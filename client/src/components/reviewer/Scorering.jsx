import { useState, useEffect } from 'react'

const getColors = (score) => {
  if (score >= 80) return { start: '#4F46E5', end: '#7C3AED', text: '#4F46E5' }
  if (score >= 60) return { start: '#3B82F6', end: '#06B6D4', text: '#3B82F6' }
  if (score >= 40) return { start: '#F59E0B', end: '#EF4444', text: '#F59E0B' }
  return { start: '#EF4444', end: '#DC2626', text: '#EF4444' }
}

export default function ScoreRing({ score }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    setCurrent(0)
    const duration = 1500
    const startTime = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(eased * score))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [score])

  const { start, end, text } = getColors(score)

  return (
    <div className="relative w-32 h-32 flex-shrink-0">
      <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
        <circle
          cx="18" cy="18" r="15.9"
          fill="none" stroke="#E0E7FF" strokeWidth="2.5"
        />
        <circle
          cx="18" cy="18" r="15.9"
          fill="none"
          stroke={`url(#sg${score})`}
          strokeWidth="2.5"
          strokeDasharray={`${current} 100`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id={`sg${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={start} />
            <stop offset="100%" stopColor={end}   />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold leading-none" style={{ color: text }}>
          {current}
        </span>
        <span className="text-xs text-slate-400 font-medium mt-0.5">/ 100</span>
      </div>
    </div>
  )
}