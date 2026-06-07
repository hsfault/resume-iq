const express = require('express')
const cors    = require('cors')
const axios   = require('axios')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.post('/api/analyze', async (req, res) => {
  const { resumeText, jobDescription, pdfMetadata } = req.body

  if (!resumeText?.trim()) {
    return res.status(400).json({ error: 'Resume text is required.' })
  }

  const layoutContext = pdfMetadata ? `
PDF LAYOUT METADATA (auto-extracted):
- Pages: ${pdfMetadata.pageCount}
- Column layout: ${pdfMetadata.estimatedColumns}-column
- Text density: ${pdfMetadata.textDensity}
- Font sizes detected: ${pdfMetadata.fontSizes?.join(', ')}pt
- Page size: ${pdfMetadata.pageWidth} x ${pdfMetadata.pageHeight}px

Use this metadata to give specific layout feedback in the layoutFeedback field.
` : 'No PDF metadata — set layoutFeedback.score to 50 and give general layout advice based on text structure.'

  const prompt = `You are a world-class ATS resume expert and senior career coach with 20 years of experience placing candidates at Fortune 500 companies. You are brutally honest, highly specific, and give immediately actionable advice. You always reference actual content from the resume — you never give generic advice.

${layoutContext}

RESUME:
${resumeText}

${jobDescription ? `TARGET JOB DESCRIPTION:\n${jobDescription}` : 'No job description provided — return an empty missingKeywords array.'}

Analyze this resume thoroughly for ATS compatibility, content quality, structure, and impact. Reference specific content from the resume in your feedback.

Return ONLY raw JSON — no markdown, no backticks, no explanation:
{
  "atsScore": <integer 0-100>,
  "overallGrade": <"A"|"B+"|"B"|"C+"|"C"|"D">,
  "summary": "<3 specific sentences: overall quality, biggest strength in this resume, most critical issue to fix>",
  "layoutFeedback": {
    "score": <integer 0-100>,
    "positives": ["<specific layout positive>", "<another>"],
    "issues": ["<specific layout issue>", "<another>"],
    "suggestions": ["<specific actionable fix>", "<another>"]
  },
  "strengths": [
    { "point": "<specific strength>", "detail": "<why this works — reference actual resume content>" },
    { "point": "<strength>", "detail": "<detail referencing actual content>" },
    { "point": "<strength>", "detail": "<detail>" }
  ],
  "weaknesses": [
    { "point": "<specific weakness>", "detail": "<why this hurts — be specific>", "howToFix": "<exact fix, include a before/after example>" },
    { "point": "<weakness>", "detail": "<detail>", "howToFix": "<fix with example>" },
    { "point": "<weakness>", "detail": "<detail>", "howToFix": "<fix>" }
  ],
  "sectionFeedback": {
    "summary":    { "score": <0-100>, "feedback": "<specific detailed feedback>", "improvements": ["<specific fix>", "<fix>"] },
    "experience": { "score": <0-100>, "feedback": "<specific detailed feedback>", "improvements": ["<specific fix>", "<fix>"] },
    "skills":     { "score": <0-100>, "feedback": "<specific detailed feedback>", "improvements": ["<specific fix>", "<fix>"] },
    "education":  { "score": <0-100>, "feedback": "<specific detailed feedback>", "improvements": ["<specific fix>", "<fix>"] }
  },
  "missingKeywords": ["<keyword from JD not found in resume>"],
  "quickFixes": [
    { "title": "<action title>", "description": "<exact change to make right now>", "impact": "High" },
    { "title": "<action title>", "description": "<exact change>", "impact": "Medium" },
    { "title": "<action title>", "description": "<exact change>", "impact": "Low" }
  ],
  "improvementPlan": [
    { "priority": 1, "category": "<Content|Format|Keywords|Length|Impact>", "suggestion": "<detailed suggestion>", "example": "<concrete before/after or specific text to add>" },
    { "priority": 2, "category": "<category>", "suggestion": "<suggestion>", "example": "<example>" },
    { "priority": 3, "category": "<category>", "suggestion": "<suggestion>", "example": "<example>" }
  ]
}`

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 4096,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const raw   = response.data.choices[0].message.content
    const clean = raw.replace(/```json|```/g, '').trim()
    const data  = JSON.parse(clean)
    res.json(data)

  } catch (err) {
    console.error('Groq error:', err.response?.data || err.message)
    res.status(500).json({ error: 'Analysis failed. Please try again.' })
  }
})

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
)