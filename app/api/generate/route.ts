import { NextRequest, NextResponse } from 'next/server'

interface VideoIdea {
  title: string
  hook: string
  script: string
  hashtags: string[]
  viralScore: number
}

export async function POST(request: NextRequest) {
  try {
    const { niche, trend } = await request.json()

    if (!niche) {
      return NextResponse.json(
        { error: 'Niche is required' },
        { status: 400 }
      )
    }

    // Generate ideas using Claude API via Anthropic
    const ideas = await generateViralIdeas(niche, trend)

    return NextResponse.json({ ideas })
  } catch (error) {
    console.error('Error generating ideas:', error)
    return NextResponse.json(
      { error: 'Failed to generate ideas' },
      { status: 500 }
    )
  }
}

async function generateViralIdeas(niche: string, trend: string): Promise<VideoIdea[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    // Return mock data if no API key is configured
    return generateMockIdeas(niche, trend)
  }

  try {
    const prompt = `You are a viral YouTube Shorts expert. Generate 3 highly viral video ideas for the following:

Niche: ${niche}
${trend ? `Current Trend: ${trend}` : ''}

For each idea, provide:
1. A catchy, clickbait-worthy title (under 60 characters)
2. A powerful hook for the first 3 seconds that stops scrolling
3. A complete script outline (30-60 seconds worth of content)
4. 5-8 relevant hashtags
5. A viral score from 1-10 based on current trends

Format your response as a JSON array with this structure:
[
  {
    "title": "...",
    "hook": "...",
    "script": "...",
    "hashtags": ["#...", "#...", ...],
    "viralScore": 8
  },
  ...
]

Make the ideas highly engaging, trend-focused, and optimized for maximum views and engagement.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to call Anthropic API')
    }

    const data = await response.json()
    const content = data.content[0].text

    // Extract JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const ideas = JSON.parse(jsonMatch[0])
      return ideas
    }

    // Fallback to mock data if parsing fails
    return generateMockIdeas(niche, trend)
  } catch (error) {
    console.error('Error calling AI API:', error)
    return generateMockIdeas(niche, trend)
  }
}

function generateMockIdeas(niche: string, trend: string): VideoIdea[] {
  const trendText = trend ? ` about ${trend}` : ''

  return [
    {
      title: `${niche} Secret Nobody Tells You${trendText}! 🤯`,
      hook: `"Stop! If you're into ${niche}, you NEED to see this..."`,
      script: `Hook: "Stop! If you're into ${niche}, you NEED to see this..."

Main Content:
- Show the problem most people face in ${niche}
- Reveal the shocking truth or hidden technique
- Demonstrate quick results or transformation
- Share 3 actionable tips viewers can use TODAY

CTA: "Follow for more ${niche} secrets! Comment 'YES' if this helped!"`,
      hashtags: [
        '#shorts',
        `#${niche.toLowerCase().replace(/\s+/g, '')}`,
        '#viral',
        '#fyp',
        '#trending',
        ...(trend ? [`#${trend.toLowerCase().replace(/\s+/g, '')}`] : ['#tips']),
      ],
      viralScore: 8,
    },
    {
      title: `I Tried This ${niche} Hack For 30 Days... 😱`,
      hook: `"Day 1 vs Day 30... I can't believe what happened"`,
      script: `Hook: "Day 1 vs Day 30... I can't believe what happened"

Main Content:
- Quick montage of Day 1 (showing struggle)
- Fast forward through the journey
- Reveal Day 30 results (dramatic reveal)
- Share the exact method you used
- Show before/after comparison

CTA: "Want the full tutorial? Check my bio! 🔥"`,
      hashtags: [
        '#shorts',
        `#${niche.toLowerCase().replace(/\s+/g, '')}`,
        '#transformation',
        '#beforeandafter',
        '#challenge',
        '#results',
      ],
      viralScore: 9,
    },
    {
      title: `${niche} Mistakes Killing Your Results! ❌`,
      hook: `"If you're doing THIS in ${niche}, STOP immediately!"`,
      script: `Hook: "If you're doing THIS in ${niche}, STOP immediately!"

Main Content:
- Mistake #1: [Common error] - Why it's wrong
- Mistake #2: [Another error] - What to do instead
- Mistake #3: [Final error] - The correct approach
- Quick recap with on-screen text
- Bonus tip for engagement

CTA: "Which mistake were YOU making? Comment below! 👇"`,
      hashtags: [
        '#shorts',
        `#${niche.toLowerCase().replace(/\s+/g, '')}`,
        '#mistakes',
        '#tips',
        '#howto',
        '#tutorial',
        '#learn',
      ],
      viralScore: 7,
    },
  ]
}
