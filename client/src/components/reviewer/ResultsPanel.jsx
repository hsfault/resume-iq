import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScoreRing from './ScoreRing'
import {
  CheckCircle2, XCircle, ChevronDown, ChevronUp,
  Zap, Tag, BookOpen, Briefcase, GraduationCap,
  User, RotateCcw, Layout, Lightbulb, TrendingUp, ArrowRight
} from 'lucide-react'

const gradeConfig = {
  'A':  { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Excellent'  },
  'B+': { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Great'      },
  'B':  { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Good'       },
  'C+': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Average'    },
  'C':  { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Needs Work' },
  'D':  { bg: 'bg-red-100',    text: 'text-red-700',    label: 'Poor'       },
}

const sectionIcons  = { summary: User, experience: Briefcase, skills: Zap, education: GraduationCap }
const sectionLabels = { summary: 'Professional Summary', experience: 'Experience', skills: 'Skills', education: 'Education' }

const impactColors = {
  High:   { bg: 'bg-red-100',    text: 'text-red-700'    },
  Medium: { bg: 'bg-orange-100', text: 'text-orange-700' },
  Low:    { bg: 'bg-green-100',  text: 'text-green-700'  },
}

const categoryColors = {
  Content:  { bg: 'bg-blue-100',   text: 'text-blue-700'   },
  Format:   { bg: 'bg-purple-100', text: 'text-purple-700' },
  Keywords: { bg: 'bg-violet-100', text: 'text-violet-700' },
  Length:   { bg: 'bg-pink-100',   text: 'text-pink-700'   },
  Impact:   { bg: 'bg-amber-100',  text: 'text-amber-700'  },
}

const ScoreBar = ({ score }) => {
  const color = score >= 80 ? 'from-green-400 to-emerald-500'
              : score >= 60 ? 'from-brand-500 to-violet-600'
              : score >= 40 ? 'from-amber-400 to-orange-500'
              :               'from-red-400 to-red-600'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
      <span className="text-xs font-bold text-slate-400 w-8 text-right">{score}</span>
    </div>
  )
}

export default function ResultsPanel({ results, hasPDF, onReset }) {
  const [openSection,  setOpenSection]  = useState(null)
  const [openWeakness, setOpenWeakness] = useState(null)
  const grade = gradeConfig[results.overallGrade] ?? gradeConfig['C']

  return (
    <div className="space-y-6">

      {/* ── Score Overview ── */}
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <ScoreRing score={results.atsScore} />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-3">
              <h2 className="text-2xl font-extrabold text-slate-800">ATS Score</h2>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${grade.bg} ${grade.text}`}>
                Grade {results.overallGrade} — {grade.label}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">{results.summary}</p>
          </div>
        </div>
      </div>

      {/* ── Layout Feedback (PDF only) ── */}
      {hasPDF && results.layoutFeedback && (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
              <Layout size={18} className="text-brand-500" /> Layout Analysis
            </h3>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              results.layoutFeedback.score >= 80 ? 'bg-green-100 text-green-700' :
              results.layoutFeedback.score >= 60 ? 'bg-blue-100 text-blue-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>{results.layoutFeedback.score}/100</span>
          </div>
          <ScoreBar score={results.layoutFeedback.score} />
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: '✓ What Works',  items: results.layoutFeedback.positives,    dot: 'text-green-400', color: 'text-green-600' },
              { label: '✗ Issues',      items: results.layoutFeedback.issues,       dot: 'text-red-400',   color: 'text-red-600'   },
              { label: '→ Suggestions', items: results.layoutFeedback.suggestions,  dot: 'text-brand-400', color: 'text-brand-600' },
            ].map(({ label, items, dot, color }) => (
              <div key={label}>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${color}`}>{label}</p>
                <ul className="space-y-1.5">
                  {items?.map((item, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className={`${dot} mt-0.5`}>•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Strengths & Weaknesses ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Strengths */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-bold text-base text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-500" /> Strengths
          </h3>
          <div className="space-y-4">
            {results.strengths?.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800 mb-0.5">
                    {typeof s === 'object' ? s.point : s}
                  </p>
                  {s.detail && <p className="text-xs text-slate-500 leading-relaxed">{s.detail}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-bold text-base text-slate-800 mb-4 flex items-center gap-2">
            <XCircle size={18} className="text-red-400" /> Areas to Improve
          </h3>
          <div className="space-y-2">
            {results.weaknesses?.map((w, i) => {
              const isOpen = openWeakness === i
              return (
                <div key={i} className="border border-slate-100 rounded-xl overflow-hidden bg-white/50">
                  <button
                    onClick={() => setOpenWeakness(isOpen ? null : i)}
                    className="w-full flex items-start gap-3 p-3 text-left hover:bg-white/80 transition-colors"
                  >
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">
                        {typeof w === 'object' ? w.point : w}
                      </p>
                      {w.detail && !isOpen && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{w.detail}</p>
                      )}
                    </div>
                    {w.howToFix && (
                      isOpen
                        ? <ChevronUp   size={14} className="text-slate-400 flex-shrink-0 mt-1" />
                        : <ChevronDown size={14} className="text-slate-400 flex-shrink-0 mt-1" />
                    )}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 border-t border-slate-100 space-y-2 pt-2">
                          {w.detail && <p className="text-xs text-slate-500 leading-relaxed">{w.detail}</p>}
                          {w.howToFix && (
                            <div className="bg-brand-50 rounded-lg p-2.5">
                              <p className="text-xs font-semibold text-brand-700 mb-1 flex items-center gap-1">
                                <Lightbulb size={11} /> How to fix
                              </p>
                              <p className="text-xs text-brand-600 leading-relaxed">{w.howToFix}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Section Feedback ── */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-bold text-base text-slate-800 mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-brand-500" /> Section-by-Section Feedback
        </h3>
        <div className="space-y-2">
          {Object.entries(results.sectionFeedback || {}).map(([key, value]) => {
            const Icon        = sectionIcons[key]  ?? BookOpen
            const label       = sectionLabels[key] ?? key
            const isOpen      = openSection === key
            const score       = typeof value === 'object' ? value.score       : null
            const feedback    = typeof value === 'object' ? value.feedback    : value
            const improvements = typeof value === 'object' ? value.improvements : []
            const barColor    = score >= 80 ? 'bg-green-400' : score >= 60 ? 'bg-brand-500' : score >= 40 ? 'bg-amber-400' : 'bg-red-400'

            return (
              <div key={key} className="border border-slate-100 rounded-xl overflow-hidden bg-white/50">
                <button
                  onClick={() => setOpenSection(isOpen ? null : key)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/80 transition-colors"
                >
                  <Icon size={15} className="text-brand-500 flex-shrink-0" />
                  <span className="flex-1 font-semibold text-slate-700 text-sm">{label}</span>
                  {score !== null && (
                    <div className="flex items-center gap-2 mr-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${score}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-400 w-6 text-right">{score}</span>
                    </div>
                  )}
                  {isOpen
                    ? <ChevronUp   size={15} className="text-slate-400 flex-shrink-0" />
                    : <ChevronDown size={15} className="text-slate-400 flex-shrink-0" />}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-3 border-t border-slate-100 space-y-3">
                        <p className="text-sm text-slate-600 leading-relaxed">{feedback}</p>
                        {improvements?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-2">Improvements</p>
                            <ul className="space-y-1.5">
                              {improvements.map((imp, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                                  <ArrowRight size={12} className="text-brand-400 flex-shrink-0 mt-0.5" />
                                  {imp}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Missing Keywords ── */}
      {results.missingKeywords?.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-bold text-base text-slate-800 mb-2 flex items-center gap-2">
            <Tag size={18} className="text-violet-500" /> Missing Keywords
          </h3>
          <p className="text-sm text-slate-500 mb-4">Add these to improve your match with the job description.</p>
          <div className="flex flex-wrap gap-2">
            {results.missingKeywords.map((kw, i) => (
              <span key={i} className="px-3 py-1.5 bg-violet-50 text-violet-700 text-sm font-medium rounded-full border border-violet-100">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Quick Fixes ── */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-bold text-base text-slate-800 mb-4 flex items-center gap-2">
          <Zap size={18} className="text-amber-500" /> Quick Fixes
        </h3>
        <div className="space-y-3">
          {results.quickFixes?.map((fix, i) => {
            const impact = impactColors[fix.impact] ?? impactColors['Medium']
            return (
              <div key={i} className="flex items-start gap-4 bg-amber-50/70 border border-amber-100 rounded-xl p-4">
                <span className="w-7 h-7 rounded-lg bg-amber-400 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-semibold text-slate-800 text-sm">{fix.title}</p>
                    {fix.impact && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${impact.bg} ${impact.text}`}>
                        {fix.impact} Impact
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{fix.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Improvement Plan ── */}
      {results.improvementPlan?.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-bold text-base text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-brand-500" /> Improvement Plan
          </h3>
          <div className="space-y-4">
            {results.improvementPlan.map((item, i) => {
              const cat = categoryColors[item.category] ?? categoryColors['Content']
              return (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-violet-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {item.priority ?? i + 1}
                  </div>
                  <div className="flex-1 bg-white/60 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      {item.category && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cat.bg} ${cat.text}`}>
                          {item.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-700 mb-2 leading-relaxed">{item.suggestion}</p>
                    {item.example && (
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Example</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.example}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Reset */}
      <div className="text-center pt-2">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand-600 transition-colors border border-slate-200 px-6 py-3 rounded-xl hover:border-brand-200 bg-white/60"
        >
          <RotateCcw size={15} /> Analyze Another Resume
        </button>
      </div>

    </div>
  )
}