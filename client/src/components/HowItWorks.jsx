import { motion } from 'framer-motion'
import { ClipboardPaste, Briefcase, BarChart3 } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: ClipboardPaste,
    title: 'Paste Your Resume',
    desc: 'Copy and paste your resume text into the input field. No account or sign-up needed.',
  },
  {
    number: '02',
    icon: Briefcase,
    title: 'Add Job Description',
    desc: 'Optionally paste a job description to get targeted keyword matching and role-specific feedback.',
  },
  {
    number: '03',
    icon: BarChart3,
    title: 'Get Instant Analysis',
    desc: 'Our AI instantly returns your ATS score, strengths, weaknesses, and exactly what to fix.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-brand-600 uppercase tracking-widest">Process</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-3 mb-4">
            How it <span className="gradient-text">works</span>
          </h2>
          <p className="text-slate-500 text-lg">Three simple steps to a stronger resume.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(({ number, icon: Icon, title, desc }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative glass-card rounded-2xl p-8 text-center overflow-hidden"
            >
              <span className="text-7xl font-extrabold text-brand-100 absolute -top-2 -right-1 select-none leading-none">
                {number}
              </span>
              <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-200 relative z-10">
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800 relative z-10">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed relative z-10">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}