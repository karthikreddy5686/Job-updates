import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API service is not configured. Missing API key.' },
        { status: 500 }
      )
    }

    const { company, jobTitle, resumeText } = await req.json()

    if (!resumeText?.trim()) {
      return NextResponse.json({ error: 'Resume text is required.' }, { status: 400 })
    }

    const prompt = `You are an expert career coach helping a candidate write a cold message on LinkedIn or email to request a referral for a job.
You will be provided with the target company, target job title, and the candidate's resume.

Target Company: ${company || 'the company'}
Target Role: ${jobTitle || 'an open role'}

Candidate Resume:
${resumeText.slice(0, 6000)}

Task: Write a concise, professional, and engaging message (around 3-4 sentences) that the candidate can send to an employee at the company.
The message should:
- Start with a polite greeting (assume no name is provided, keep it general but friendly).
- Mention the role they are interested in.
- Highlight 1-2 key impressive points from the resume that make them a strong fit.
- Ask politely for a referral.
- Be under 150 words.
- Do NOT use subject lines or placeholders like [Your Name]. Just write the message body directly.

Return ONLY the generated message text, nothing else.`

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    )

    if (!geminiRes.ok) {
      const err = await geminiRes.text()
      console.error('Gemini API Error:', err)
      return NextResponse.json({ error: 'Failed to generate message from AI.' }, { status: 500 })
    }

    const data = await geminiRes.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!text) {
      return NextResponse.json({ error: 'AI returned empty response.' }, { status: 500 })
    }

    return NextResponse.json({ message: text })
  } catch (err: any) {
    console.error('generate-referral error:', err)
    return NextResponse.json({ error: 'Unexpected error occurred.' }, { status: 500 })
  }
}
