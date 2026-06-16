const key = 'AIzaSyBMVbgdE_RgvPZOyzC6_uuP5vqqTPdDAYw';
const prompt = `You are an expert career coach helping a candidate write a cold message on LinkedIn or email to request a referral for a job.
You will be provided with the target company, target job title, and the candidate's resume.

Target Company: Google India
Target Role: Frontend developer

Candidate Resume:
HARI KISHORE REDDY Kadapa, Andhra Pradesh | +91-8019519353 | harikishorereddy9908@gmail.com github.com/H

Task: Write a concise, professional, and engaging message (around 3-4 sentences) that the candidate can send to an employee at the company.
The message should:
- Start with a polite greeting (assume no name is provided, keep it general but friendly).
- Mention the role they are interested in.
- Highlight 1-2 key impressive points from the resume that make them a strong fit.
- Ask politely for a referral.
- Be under 150 words.
- Do NOT use subject lines or placeholders like [Your Name]. Just write the message body directly.

Return ONLY the generated message text, nothing else.`;

fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=' + key, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
  })
}).then(r => r.json()).then(d => console.log(JSON.stringify(d, null, 2))).catch(console.error);
