import React from 'react'

export const ReportSummary = ({ summaryText }) => {
  if (!summaryText) return null

  return (
    <div className="mb-6">
      <h3 className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase mb-3 flex items-center gap-2">
        <span className="w-4 h-px bg-slate-600" />
        Executive Investigation Summary
      </h3>
      <div className="text-sm text-slate-200 leading-relaxed max-w-4xl whitespace-pre-wrap font-sans pl-6">
        {summaryText}
      </div>
    </div>
  )
}
