import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, ArrowRight, Loader2 } from 'lucide-react'

const SUGGESTED_PROMPTS = [
  'Summarize FIR-2026-101',
  'Find suspect by name',
  'Show related cases',
  'Explain evidence item',
  'Reconstruct crime timeline',
  'List recent investigations',
]

export const WelcomeState = ({
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
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto"
    >
      <div className="w-full max-w-[640px] flex flex-col items-center">

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05, duration: 0.3 }}
          className="w-12 h-12 bg-[#0d1117] border border-[#1e2d3d] rounded-sm flex items-center justify-center mb-6"
        >
          <Shield className="w-6 h-6 text-[#2563eb]" />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-center mb-3"
        >
          <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
            Welcome, Officer.
          </h1>
          <p className="text-base text-slate-400 font-normal">
            What would you like to investigate today?
          </p>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="text-xs text-slate-500 text-center leading-relaxed mb-8 max-w-[460px]"
        >
          VigilX can help you query suspects, summarize FIR case files, reconstruct
          crime timelines, and retrieve evidence from connected databases using
          natural language.
        </motion.p>

        {/* Investigation Input */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.3 }}
          className="w-full mb-5"
        >
          <div className="relative flex items-stretch w-full">
            <input
              ref={inputRef}
              id="welcome-investigation-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe what you want to investigate..."
              disabled={isPending}
              className="flex-1 bg-[#0d1117] border border-[#1e2d3d] hover:border-[#2563eb]/40 focus:border-[#2563eb]/70 focus:outline-none rounded-l-sm px-5 py-4 text-sm text-slate-200 placeholder-slate-600 transition-colors disabled:opacity-50 font-sans"
            />
            <button
              onClick={onSubmit}
              disabled={isPending || !input.trim()}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-4 rounded-r-sm flex items-center gap-2 text-sm font-semibold transition-colors cursor-pointer shrink-0 border border-[#2563eb]"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Investigate</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Suggested Investigation Prompts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="w-full"
        >
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-wider mb-3 text-center">
            Suggested Investigations
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handlePromptClick(prompt)}
                className="text-left bg-[#0d1117] border border-[#1e2d3d] hover:border-[#2563eb]/50 hover:bg-[#111827] hover:text-slate-200 text-slate-400 px-3.5 py-2.5 rounded-sm transition-all cursor-pointer text-xs font-medium leading-snug"
              >
                {prompt}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Model Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="text-[10px] font-mono text-slate-600 mt-8 text-center"
        >
          Llama-3.3-70B · Multi-Agent RAG · LangGraph Orchestration · Groq Cloud Engine
        </motion.p>

      </div>
    </motion.div>
  )
}
