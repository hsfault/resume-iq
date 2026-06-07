import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/60 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-btn flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold gradient-text">ResumeIQ</span>
        </Link>

        <p className="text-sm text-slate-400 text-center">
          © 2025 ResumeIQ. Built with AI to help you get hired.
        </p>

        <div className="flex gap-6">
          <a href="#features" className="text-sm text-slate-400 hover:text-brand-600 transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-slate-400 hover:text-brand-600 transition-colors">How It Works</a>
          <Link to="/review" className="text-sm text-slate-400 hover:text-brand-600 transition-colors">Try It</Link>
        </div>
      </div>
    </footer>
  )
}