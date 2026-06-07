import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  const navigate = useNavigate()

  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto glass-card rounded-3xl p-12 text-center relative overflow-hidden"
      >
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-100 rounded-full blur-3xl opacity-70 pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-violet-100 rounded-full blur-3xl opacity-70 pointer-events-none" />

        <span className="text-sm font-semibold text-brand-600 uppercase tracking-widest relative z-10">
          Get Started
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold mt-3 mb-4 relative z-10">
          Ready to land your{' '}
          <span className="gradient-text">dream job?</span>
        </h2>
        <p className="text-slate-500 text-lg mb-8 relative z-10">
          Your next interview could be one resume fix away. It's free.
        </p>
        <button
          onClick={() => navigate('/review')}
          className="gradient-btn text-white font-semibold px-10 py-4 rounded-xl text-base shadow-lg shadow-indigo-200 inline-flex items-center gap-2 relative z-10"
        >
          Analyze My Resume Free <ArrowRight size={18} />
        </button>
      </motion.div>
    </section>
  )
}