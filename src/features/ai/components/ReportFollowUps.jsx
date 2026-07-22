import React from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'

export const ReportFollowUps = ({ followUps, onSelect }) => {
  if (!followUps || followUps.length === 0) return null

  const formatPrompt = (prompt) => {
    if (prompt === null || prompt === undefined) return ''
    if (typeof prompt === 'string') return prompt
    if (typeof prompt === 'number' || typeof prompt === 'boolean') return String(prompt)
    if (Array.isArray(prompt)) return prompt.map(formatPrompt).filter(Boolean).join(', ')
    if (typeof prompt === 'object') return prompt.question || prompt.prompt || prompt.text || JSON.stringify(prompt)
    return String(prompt)
  }

  return (
    <div className="mt-8 pt-6 border-t border-[#1e2d3d]/50">
      <h3 className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase mb-3 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#2563eb]" />
        Suggested Follow-up Investigations
      </h3>
      <div className="flex flex-wrap gap-2">
        {followUps
          .map((q) => formatPrompt(q))
          .filter(Boolean)
          .map((label, i) => (
            <button
              key={`${label}-${i}`}
              onClick={() => onSelect(label)}
              className="flex items-center gap-1.5 bg-[#0a0d14] border border-[#1e2d3d] hover:border-[#2563eb]/60 hover:bg-[#111827] text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-sm transition-all cursor-pointer text-[11px] font-medium"
            >
              <span>{label}</span>
              <ArrowRight className="w-3 h-3 opacity-60" />
            </button>
          ))}
      </div>
    </div>
  )
}
