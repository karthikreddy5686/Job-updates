import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    // ── Check API key exists ─────────────────────
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey || apiKey.trim() === '') {
      console.error('GEMINI_API_KEY is not set in .env.local')
      return NextResponse.json(
        {
          error:
            'AI service is not configured. ' +
            'Please add GEMINI_API_KEY to your .env.local file. ' +
            'Get a free key at aistudio.google.com/apikey',
        },
        { status: 500 }
      )
    }

    // ── Parse request body ───────────────────────
    const body = await req.json()
    const { resumeText, jobDescription } = body

    // ── Validate inputs ──────────────────────────
    if (!resumeText?.trim()) {
      return NextResponse.json(
        { error: 'Resume text is required.' },
        { status: 400 }
      )
    }


    // ── Detect raw PDF binary ────────────────────
    const isPDFBinary =
      resumeText.includes('%PDF-1.') ||
      resumeText.includes('endobj') ||
      resumeText.includes('/MediaBox') ||
      resumeText.includes('/Resources') ||
      resumeText.includes('/BaseFont') ||
      resumeText.includes('/Encoding /Win') ||
      resumeText.includes('xref') ||
      resumeText.includes('%%EOF') ||
      resumeText.includes('obj\n') ||
      resumeText.includes('BT\n')

    if (isPDFBinary) {
      return NextResponse.json(
        {
          error:
            'PDF binary detected. Please manually copy text: ' +
            'Open PDF → Ctrl+A → Ctrl+C → Paste in text box.',
        },
        { status: 400 }
      )
    }

    // ── Check minimum content ────────────────────
    const wordCount = resumeText.trim().split(/\s+/).length
    if (wordCount < 20) {
      return NextResponse.json(
        {
          error:
            'Resume text is too short. ' +
            'Please paste your complete resume.',
        },
        { status: 400 }
      )
    }

    // ── Clean text ───────────────────────────────
    const cleanResume = resumeText
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
      .replace(/[ \t]{4,}/g, '   ')
      .trim()
      .slice(0, 6000)

    const cleanJD = jobDescription
      ? jobDescription.replace(/[^\x20-\x7E\n\r\t]/g, ' ').trim().slice(0, 3000)
      : ''

    // ── Build prompt ─────────────────────────────
    const prompt = `You are an expert ATS (Applicant Tracking System) 
resume analyzer specializing in the Indian job market.

${cleanJD 
  ? 'Analyze the resume below against the job description and return' 
  : 'Perform a general ATS analysis on the resume below and return'}
ONLY a valid JSON object. No markdown, no backticks, no text 
before or after — just the raw JSON object.

RESUME:
${cleanResume}
${cleanJD ? `\nJOB DESCRIPTION:\n${cleanJD}\n` : ''}
Return this exact JSON (fill with real analysis values):
{
  "atsScore": 85,
  "scoreLabel": "Excellent",
  "summary": "2-3 sentence assessment of this candidate${cleanJD ? ' for this specific role' : ''}",
  "matchedKeywords": [${cleanJD ? '"keyword found in both resume and JD"' : '"strong keywords found in the resume"'}],
  "missingKeywords": [${cleanJD ? '"important keyword in JD but missing from resume"' : '"common industry keywords missing from the resume"'}],
  "sectionScores": {
    "skills": 90,
    "experience": 80,
    "education": 100,
    "formatting": 85,
    "keywords": 70
  },
  "sectionFeedback": {
    "skills": "specific feedback",
    "experience": "specific feedback",
    "education": "specific feedback",
    "formatting": "specific feedback",
    "keywords": "specific feedback"
  },
  "improvements": [
    {
      "priority": "high",
      "title": "what to improve",
      "detail": "exact actionable steps"
    }
  ],
  "strengths": [
    "genuine strength based on resume content"
  ],
  "atsFormatTips": [
    "specific ATS formatting tip"
  ],
  "recommendedJobTitles": [
    "job title matching this resume profile"
  ]
}`

    // ── Call Gemini API ──────────────────────────
    console.log('Calling Gemini API...')

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json',
          },
        }),
      }
    )

    // ── Handle Gemini API errors ─────────────────
    if (!geminiRes.ok) {
      const errBody = await geminiRes.text()
      console.error(
        `Gemini API error ${geminiRes.status}:`,
        errBody.slice(0, 300)
      )

      if (geminiRes.status === 400) {
        return NextResponse.json(
          {
            error:
              'API key is invalid. ' +
              'Please check your GEMINI_API_KEY in .env.local. ' +
              'Get a free key at aistudio.google.com/apikey',
          },
          { status: 500 }
        )
      }

      if (geminiRes.status === 403) {
        return NextResponse.json(
          {
            error:
              'API key does not have permission. ' +
              'Please generate a new key at aistudio.google.com/apikey',
          },
          { status: 500 }
        )
      }

      if (geminiRes.status === 429) {
        return NextResponse.json(
          {
            error:
              'Rate limit reached. ' +
              'Please wait 1 minute and try again.',
          },
          { status: 429 }
        )
      }

      return NextResponse.json(
        {
          error: `AI error (${geminiRes.status}). Please try again.`,
        },
        { status: 500 }
      )
    }

    // ── Parse Gemini response ────────────────────
    const aiData = await geminiRes.json()

    // Gemini response structure:
    // { candidates: [{ content: { parts: [{ text: "..." }] } }] }
    const rawText =
      aiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!rawText) {
      console.error('Empty Gemini response:', JSON.stringify(aiData).slice(0, 500))
      return NextResponse.json(
        { error: 'AI returned empty response. Please try again.' },
        { status: 500 }
      )
    }

    console.log('Gemini response preview:', rawText.slice(0, 150))

    // ── Parse JSON — 3 fallback methods ─────────
    let result: any

    // Method 1: Direct parse
    try {
      result = JSON.parse(rawText)
    } catch {
      // Method 2: Strip markdown fences
      try {
        const stripped = rawText
          .replace(/^```(?:json)?\s*/i, '')
          .replace(/\s*```\s*$/i, '')
          .trim()
        result = JSON.parse(stripped)
      } catch {
        // Method 3: Extract JSON with regex
        try {
          const match = rawText.match(/\{[\s\S]*\}/)
          if (!match) throw new Error('No JSON object found')
          result = JSON.parse(match[0])
        } catch {
          console.error(
            'All JSON parse methods failed. Raw:',
            rawText.slice(0, 400)
          )
          return NextResponse.json(
            {
              error:
                'AI response format error. Please try again. ' +
                'If this persists, try shorter resume text.',
            },
            { status: 500 }
          )
        }
      }
    }

    // ── Validate & ensure required fields ────────
    if (typeof result.atsScore !== 'number') {
      result.atsScore = 50
    }
    if (!result.scoreLabel) {
      result.scoreLabel =
        result.atsScore >= 80
          ? 'Excellent'
          : result.atsScore >= 60
          ? 'Good'
          : result.atsScore >= 40
          ? 'Fair'
          : 'Poor'
    }

    result.matchedKeywords = Array.isArray(result.matchedKeywords)
      ? result.matchedKeywords
      : []
    result.missingKeywords = Array.isArray(result.missingKeywords)
      ? result.missingKeywords
      : []
    result.improvements = Array.isArray(result.improvements)
      ? result.improvements
      : []
    result.strengths = Array.isArray(result.strengths)
      ? result.strengths
      : []
    result.atsFormatTips = Array.isArray(result.atsFormatTips)
      ? result.atsFormatTips
      : []
    result.recommendedJobTitles = Array.isArray(result.recommendedJobTitles)
      ? result.recommendedJobTitles
      : []

    if (!result.summary) {
      result.summary =
        'Analysis complete. Review the sections below for details.'
    }

    if (!result.sectionScores) {
      result.sectionScores = {
        skills: result.atsScore,
        experience: result.atsScore,
        education: result.atsScore,
        formatting: result.atsScore,
        keywords: result.atsScore,
      }
    }

    if (!result.sectionFeedback) {
      result.sectionFeedback = {}
    }

    console.log(`Analysis complete. ATS Score: ${result.atsScore}`)

    return NextResponse.json({ success: true, result })

  } catch (err: any) {
    console.error('Unhandled error in resume-match route:', err)
    return NextResponse.json(
      {
        error:
          err?.message ||
          'Unexpected error. Please try again.',
      },
      { status: 500 }
    )
  }
}
