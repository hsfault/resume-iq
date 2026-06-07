import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import * as pdfjsLib from 'pdfjs-dist'
import axios from 'axios'
import Lenis from 'lenis'
import Navbar from '../components/Navbar'
import ResultsPanel from '../components/reviewer/ResultsPanel'
import {
  ArrowLeft, Loader2, XCircle,
  FileText, Upload, ClipboardPaste, X
} from 'lucide-react'
import { API_BASE } from '../config'

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

export default function Reviewer() {
  const [activeTab,        setActiveTab]        = useState('paste')
  const [resumeText,       setResumeText]       = useState('')
  const [pdfFile,          setPdfFile]          = useState(null)
  const [jobDescription,   setJobDescription]   = useState('')
  const [showJD,           setShowJD]           = useState(false)
  const [isLoading,        setIsLoading]        = useState(false)
  const [isPdfProcessing,  setIsPdfProcessing]  = useState(false)
  const [results,          setResults]          = useState(null)
  const [error,            setError]            = useState(null)
  const resultsRef  = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08 })
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  const extractPDFData = async (file) => {
    setIsPdfProcessing(true)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

      // Extract text from all pages
      let fullText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        fullText += `\n--- Page ${i} ---\n` + content.items.map(item => item.str).join(' ')
      }

      // Layout metadata from page 1
      const page1      = await pdf.getPage(1)
      const tc1        = await page1.getTextContent()
      const viewport   = page1.getViewport({ scale: 1 })

      const fontSizes = [...new Set(
        tc1.items
          .filter(it => it.transform && it.str.trim())
          .map(it => Math.abs(Math.round(it.transform[0])))
          .filter(s => s > 5 && s < 60)
      )].sort((a, b) => b - a)

      const xPos     = tc1.items.filter(it => it.str.trim()).map(it => it.transform[4])
      const midX     = viewport.width / 2
      const leftN    = xPos.filter(x => x < midX * 0.8).length
      const rightN   = xPos.filter(x => x > midX * 1.2).length
      const isMulti  = rightN > 15 && leftN > 15 && rightN / (leftN + rightN) > 0.2

      const totalChars  = tc1.items.reduce((a, it) => a + it.str.length, 0)
      const densityR    = totalChars / (viewport.width * viewport.height)
      const textDensity = densityR > 0.018 ? 'Very High — likely too crowded'
                        : densityR > 0.012 ? 'High — well filled'
                        : densityR > 0.006 ? 'Medium — good balance'
                        : 'Low — consider adding more content'

      const metadata = {
        pageCount: pdf.numPages,
        estimatedColumns: isMulti ? 2 : 1,
        fontSizes: fontSizes.slice(0, 6),
        textDensity,
        pageWidth:  Math.round(viewport.width),
        pageHeight: Math.round(viewport.height),
      }

      return { name: file.name, pageCount: pdf.numPages, text: fullText.trim(), metadata }
    } finally {
      setIsPdfProcessing(false)
    }
  }

  const handleFileChange = async (file) => {
    if (!file) return
    if (file.type !== 'application/pdf') { setError('Please upload a PDF file.'); return }
    if (file.size > 5 * 1024 * 1024)    { setError('PDF must be under 5MB.');     return }
    setError(null)
    try {
      const data = await extractPDFData(file)
      setPdfFile(data)
    } catch {
      setError('Could not read PDF. Please try a different file.')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFileChange(e.dataTransfer.files[0])
  }

  const handleAnalyze = async () => {
    const text = activeTab === 'paste' ? resumeText : pdfFile?.text
    if (!text?.trim()) {
      setError(activeTab === 'paste' ? 'Please paste your resume text.' : 'Please upload a PDF first.')
      return
    }
    setIsLoading(true)
    setError(null)
    setResults(null)
    try {
      const { data } = await axios.post(`${API_BASE}/api/analyze`, {
        resumeText:    text,
        jobDescription: showJD ? jobDescription : '',
        pdfMetadata:   activeTab === 'upload' ? pdfFile?.metadata : null,
      })
      setResults(data)
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200)
    } catch {
      setError('Analysis failed. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResults(null); setResumeText(''); setPdfFile(null)
    setJobDescription(''); setShowJD(false); setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const canAnalyze = activeTab === 'paste' ? !!resumeText.trim() : !!pdfFile

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 transition-colors mb-4">
            <ArrowLeft size={15} /> Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            Resume <span className="gradient-text">Analyzer</span>
          </h1>
          <p className="text-slate-500">Deep AI analysis — paste text or upload your PDF for layout review too.</p>
        </motion.div>

        {/* Input Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="glass-card rounded-2xl p-6 md:p-8 mb-8">

          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 w-fit">
            {[['paste', ClipboardPaste, 'Paste Text'], ['upload', Upload, 'Upload PDF']].map(([id, Icon, label]) => (
              <button
                key={id}
                onClick={() => { setActiveTab(id); setError(null) }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === id ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Paste tab */}
            {activeTab === 'paste' && (
              <motion.div key="paste" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Resume Text <span className="text-red-400">*</span></label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your full resume text here..."
                  rows={10}
                  className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent resize-none transition-all"
                />
                <p className="text-xs text-slate-400 mt-1">{resumeText.length} characters</p>
              </motion.div>
            )}

            {/* Upload tab */}
            {activeTab === 'upload' && (
              <motion.div key="upload" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                {!pdfFile ? (
                  <div
                    onClick={() => !isPdfProcessing && fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-slate-200 hover:border-brand-300 rounded-xl p-12 text-center cursor-pointer transition-colors group"
                  >
                    <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-100 transition-colors">
                      {isPdfProcessing
                        ? <Loader2 size={24} className="text-brand-500 animate-spin" />
                        : <Upload size={24} className="text-brand-500" />}
                    </div>
                    <p className="font-semibold text-slate-700 mb-1">
                      {isPdfProcessing ? 'Extracting text & layout data...' : 'Drop your PDF here or click to browse'}
                    </p>
                    <p className="text-sm text-slate-400">PDF only · Max 5MB · Layout will be analyzed</p>
                    <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileChange(e.target.files[0])} />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 bg-green-50 border border-green-100 rounded-xl p-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText size={20} className="text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">{pdfFile.name}</p>
                        <p className="text-xs text-slate-500">
                          {pdfFile.pageCount} page{pdfFile.pageCount > 1 ? 's' : ''} ·{' '}
                          {pdfFile.text.length.toLocaleString()} chars extracted ·{' '}
                          {pdfFile.metadata.estimatedColumns}-column layout detected
                        </p>
                      </div>
                      <button onClick={() => setPdfFile(null)} className="p-1.5 hover:bg-green-100 rounded-lg transition-colors flex-shrink-0">
                        <X size={16} className="text-slate-400" />
                      </button>
                    </div>
                    {/* Metadata preview */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        ['Pages',    pdfFile.metadata.pageCount],
                        ['Columns',  pdfFile.metadata.estimatedColumns],
                        ['Density',  pdfFile.metadata.textDensity.split('—')[0].trim()],
                      ].map(([label, val]) => (
                        <div key={label} className="bg-slate-50 rounded-lg px-3 py-2 text-center">
                          <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                          <p className="text-sm font-semibold text-slate-700">{val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* JD Toggle */}
          <div className="mt-5 mb-5">
            <button onClick={() => setShowJD(!showJD)} className="flex items-center gap-2.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
              <div className={`w-9 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 ${showJD ? 'bg-brand-500' : 'bg-slate-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${showJD ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
              Add job description for targeted keyword analysis (optional)
            </button>
            <AnimatePresence>
              {showJD && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden mt-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Job Description</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    rows={5}
                    className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent resize-none transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && (
            <p className="flex items-center gap-1.5 text-sm text-red-500 mb-4">
              <XCircle size={15} /> {error}
            </p>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isLoading || !canAnalyze}
            className="gradient-btn text-white font-semibold px-8 py-3.5 rounded-xl w-full flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? <><Loader2 size={18} className="animate-spin" /> Running deep analysis...</>
              : <>Analyze My Resume →</>}
          </button>
        </motion.div>

        {/* Results */}
        <div ref={resultsRef}>
          <AnimatePresence>
            {results && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <ResultsPanel
                  results={results}
                  hasPDF={activeTab === 'upload' && !!pdfFile}
                  onReset={handleReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}