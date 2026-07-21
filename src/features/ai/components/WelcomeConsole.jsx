import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, ArrowRight, Loader2, Database, Network } from 'lucide-react'

const SUGGESTED_PROMPTS = [
  'Summarize FIR-2026-101',
  'Investigate Rajesh Kumar',
  'Show related cyber crime cases',
  'Analyze evidence item EV-889',
  'Reconstruct crime timeline',
  'List recent active investigations',
]

export const WelcomeConsole = ({
  input,
  setInput,
  onSubmit,
  isPending,
}) => {
  const inputRef = useRef(null)

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handlePromptClick = (prompt) => {
    setInput(prompt)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto w-full h-full"
    >
      <div className="w-full max-w-[720px] flex flex-col items-center">

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05, duration: 0.3 }}
          className="w-14 h-14 bg-[#0d1117] border border-[#1e2d3d] rounded-sm flex items-center justify-center mb-8 shadow-lg shadow-blue-900/10"
        >
          <Shield className="w-7 h-7 text-[#2563eb]" />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            Welcome, Officer.
          </h1>
          <p className="text-lg text-slate-400 font-normal max-w-lg mx-auto leading-relaxed">
            What would you like to investigate today?
          </p>
        </motion.div>

        {/* Investigation Input (Large) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.3 }}
          className="w-full mb-8 relative"
        >
          <div className="relative flex items-stretch w-full rounded-sm shadow-2xl shadow-blue-900/5 group">
            <input
              ref={inputRef}
              id="welcome-investigation-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe what you want to investigate..."
              disabled={isPending}
              className="flex-1 bg-[#0a0d14] border-2 border-[#1e2d3d] group-hover:border-[#2563eb]/50 focus:border-[#2563eb] focus:outline-none rounded-l-sm px-6 py-5 text-base text-slate-200 placeholder-slate-600 transition-all disabled:opacity-50 font-sans"
            />
            <button
              onClick={onSubmit}
              disabled={isPending || !input.trim()}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed text-white px-8 py-5 rounded-r-sm flex items-center gap-2.5 text-base font-semibold transition-colors cursor-pointer shrink-0 shadow-inner"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Investigate</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
          
          {/* Subtle Capabilities Line */}
          <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-6 text-[11px] font-mono text-slate-500 opacity-80">
            <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-blue-500" /> Connected to National Databases</span>
            <span className="flex items-center gap-1.5"><Network className="w-3.5 h-3.5 text-emerald-500" /> Multi-Agent Reasoning Active</span>
          </div>
        </motion.div>

        {/* Suggested Investigation Prompts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="w-full mt-10"
        >
          <p className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest mb-4 text-center">
            Suggested Investigations
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handlePromptClick(prompt)}
                className="text-left bg-[#0d1117] border border-[#1e2d3d] hover:border-[#2563eb]/60 hover:bg-[#111827] text-slate-400 hover:text-slate-200 px-4 py-3 rounded-sm transition-all cursor-pointer text-[13px] font-medium leading-snug shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  )
}
