import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' }
  })
}

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto text-center">

        {/* Badge */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-medium text-slate-600">Free AI-Powered Resume Analysis</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight"
        >
          Get Your Resume{' '}
          <span className="gradient-text">Past ATS</span>
          <br />Filters — Instantly
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Paste your resume and get a detailed ATS score, section-by-section
          feedback, keyword analysis, and actionable fixes — all in seconds.
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={3}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <button
            onClick={() => navigate('/review')}
            className="gradient-btn text-white font-semibold px-8 py-4 rounded-xl flex items-center gap-2 text-base shadow-lg shadow-indigo-200"
          >
            Analyze My Resume <ArrowRight size={18} />
          </button>
          <a
            href="#how-it-works"
            className="text-brand-600 font-semibold px-8 py-4 rounded-xl border border-brand-200 bg-white/60 hover:bg-white transition-colors text-base"
          >
            See How It Works
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={4}
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 mb-16"
        >
          {['No sign-up required', 'Completely free', 'Results in seconds'].map(item => (
            <span key={item} className="flex items-center gap-1.5">
              <CheckCircle size={15} className="text-green-500" /> {item}
            </span>
          ))}
        </motion.div>

        {/* Mock score preview card */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={5}
          className="glass-card rounded-2xl p-6 max-w-sm mx-auto text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-700">Sample Analysis Preview</span>
            <span className="text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">Grade A</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E0E7FF" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="url(#heroGrad)" strokeWidth="3"
                  strokeDasharray="82 100" strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-brand-600">82</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1.5">✓ Strong experience section</p>
              <p className="text-xs text-slate-500 mb-1.5">⚠ 3 keywords missing</p>
              <p className="text-xs text-slate-500">⚡ 2 quick fixes available</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}