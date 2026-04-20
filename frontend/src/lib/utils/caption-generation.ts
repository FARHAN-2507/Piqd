interface CaptionResult {
  tone: string
  caption: string
  hashtags: string
}

export async function generateCaptions(
  photoUrls: string[],
  dominantMood: string,
  apiKey: string
): Promise<CaptionResult[]> {
  const prompt = `You are a social media expert. Generate 3 Instagram captions for a photo dump post.
  
Photos (URLs): ${photoUrls.join(', ')}
Dominant mood: ${dominantMood}

Generate exactly 3 captions in JSON format with this structure:
[
  {"tone": "casual", "caption": "...", "hashtags": "..."},
  {"tone": "funny", "caption": "...", "hashtags": "..."},
  {"tone": "aesthetic", "caption": "...", "hashtags": "..."}
]

Requirements:
- casual: Friendly, relatable, simple
- funny: Humorous, meme-style
- aesthetic: Elegant, minimal, dreamy
- Each caption should be 1-3 sentences
- hashtags should be 5-10 relevant tags
- Return ONLY valid JSON, no other text`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!content) {
    throw new Error('No content in Gemini response')
  }

  const jsonMatch = content.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    throw new Error('No JSON found in Gemini response')
  }

  const parsed = JSON.parse(jsonMatch[0])
  return parsed.map((c: any) => ({
    tone: c.tone,
    caption: c.caption,
    hashtags: c.hashtags
  }))
}