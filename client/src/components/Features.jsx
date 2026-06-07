import { motion } from 'framer-motion'
import { Target, FileSearch, KeyRound, Zap } from 'lucide-react'

const features = [
  {
    icon: Target,
    title: 'ATS Score',
    desc: 'Get a precise 0–100 compatibility score showing exactly how well your resume passes automated screening systems.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
  },
  {
    icon: FileSearch,
    title: 'Section Feedback',
    desc: 'Detailed review of every section — Summary, Experience, Skills, Education — with specific improvement tips.',
    color: 'text-violet-500',
    bg: 'bg-violet-50',
  },
  {
    icon: KeyRound,
    title: 'Keyword Matching',
    desc: 'Paste a job description and instantly see which keywords are missing that recruiters are scanning for.',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    icon: Zap,
    title: 'Quick Fixes',
    desc: 'Get the top 3 highest-impact actions you can take right now to dramatically improve your resume score.',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-brand-600 uppercase tracking-widest">Features</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-3 mb-4">
            Everything you need to{' '}
            <span className="gradient-text">stand out</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Our AI analyzes every aspect of your resume and gives you a clear, actionable roadmap.
          </p>
        </motion.div>

        <motion.div
          variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map(({ icon: Icon, title, desc, color, bg }) => (
            <motion.div
              key={title} variants={item}
              className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon size={22} className={color} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-800">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}