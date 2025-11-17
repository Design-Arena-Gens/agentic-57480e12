'use client'

import { useState } from 'react'

interface VideoIdea {
  title: string
  hook: string
  script: string
  hashtags: string[]
  viralScore: number
}

export default function Home() {
  const [niche, setNiche] = useState('')
  const [trend, setTrend] = useState('')
  const [loading, setLoading] = useState(false)
  const [ideas, setIdeas] = useState<VideoIdea[]>([])
  const [error, setError] = useState('')

  const generateIdeas = async () => {
    if (!niche.trim()) {
      setError('Please enter a niche')
      return
    }

    setLoading(true)
    setError('')
    setIdeas([])

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ niche, trend }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate ideas')
      }

      const data = await response.json()
      setIdeas(data.ideas)
    } catch (err) {
      setError('Failed to generate ideas. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            🎬 Viral Shorts Agent
          </h1>
          <p className="text-xl text-gray-300">
            AI-Powered YouTube Shorts Ideas That Go Viral
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 mb-8 shadow-2xl border border-white/20">
          <div className="space-y-4">
            <div>
              <label className="block text-white text-lg font-semibold mb-2">
                Your Niche *
              </label>
              <input
                type="text"
                placeholder="e.g., fitness, cooking, tech reviews, comedy"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-white text-lg font-semibold mb-2">
                Current Trend (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., AI tools, morning routines, life hacks"
                value={trend}
                onChange={(e) => setTrend(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={generateIdeas}
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating Viral Ideas...
                </span>
              ) : (
                '✨ Generate Viral Ideas'
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {ideas.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">
              🔥 Your Viral Video Ideas
            </h2>
            {ideas.map((idea, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20 hover:border-purple-500 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white flex-1">
                    {idea.title}
                  </h3>
                  <div className="ml-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full font-bold">
                    {idea.viralScore}/10
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">
                      🎣 Hook (First 3 seconds):
                    </h4>
                    <p className="text-gray-200 bg-black/30 p-3 rounded-lg">
                      {idea.hook}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">
                      📝 Script Outline:
                    </h4>
                    <p className="text-gray-200 bg-black/30 p-3 rounded-lg whitespace-pre-line">
                      {idea.script}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">
                      #️⃣ Hashtags:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {idea.hashtags.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Features */}
        {ideas.length === 0 && !loading && (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Trend-Optimized
              </h3>
              <p className="text-gray-300">
                Ideas based on current viral trends and algorithms
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Instant Scripts
              </h3>
              <p className="text-gray-300">
                Get complete video scripts with hooks and CTAs
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-4xl mb-3">📈</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Viral Score
              </h3>
              <p className="text-gray-300">
                AI-predicted virality score for each idea
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
