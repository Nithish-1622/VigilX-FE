import React, { useState } from 'react'
import { Database, Activity, Network, BookOpen, ChevronRight, ChevronDown, Hash } from 'lucide-react'

export const ReportEvidenceAnalysis = ({ evidence }) => {
  const [expandedCitation, setExpandedCitation] = useState(null)

  if (!evidence) return null

  const {
    confidence = 'high',
    sourcesCount = 0,
    citations = [],
    ragCitations = 0,
    sqlCitations = 0,
    langGraphActive = true,
  } = evidence

  const confidencePct = confidence === 'high' ? 92 : confidence === 'medium' ? 65 : 35
  const confidenceColor = confidence === 'high' ? 'bg-emerald-500' : confidence === 'medium' ? 'bg-amber-500' : 'bg-red-500'
  const confidenceTextColor = confidence === 'high' ? 'text-emerald-400' : confidence === 'medium' ? 'text-amber-400' : 'text-red-400'

  return (
    <div className="mb-6 pl-6">
      <h3 className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase mb-4 flex items-center gap-2 -ml-6">
        <span className="w-4 h-px bg-slate-600" />
        Evidence & Reasoning Analysis
      </h3>

      <div className="max-w-5xl bg-[#0a0d14] border border-[#1e2d3d] rounded-sm p-4">
        
        {/* Top metrics row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
          
          {/* Confidence Score */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Reasoning Confidence</span>
              <span className={`text-[10px] font-mono font-bold uppercase ${confidenceTextColor}`}>
                {confidence} ({confidencePct}%)
              </span>
            </div>
            <div className="h-1.5 bg-[#1e2d3d] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${confidenceColor}`}
                style={{ width: `${confidencePct}%` }}
              />
            </div>
          </div>

          {/* Source Distribution */}
          <div>
             <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Source Distribution</span>
              <span className="text-[10px] font-mono text-slate-400">{sourcesCount} Connected DBs</span>
            </div>
            <div className="flex gap-2">
               <div className="flex-1 bg-[#111827] border border-[#1e2d3d] rounded-sm px-2 py-1 flex items-center gap-2">
                 <Database className="w-3 h-3 text-[#2563eb]" />
                 <span className="text-[9px] font-mono text-slate-300">RAG: {ragCitations}</span>
               </div>
               <div className="flex-1 bg-[#111827] border border-[#1e2d3d] rounded-sm px-2 py-1 flex items-center gap-2">
                 <Activity className="w-3 h-3 text-emerald-500" />
                 <span className="text-[9px] font-mono text-slate-300">SQL: {sqlCitations}</span>
               </div>
            </div>
          </div>

          {/* LangGraph Engine */}
          <div>
             <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Orchestration Engine</span>
              <span className="text-[10px] font-mono text-emerald-400">ACTIVE</span>
            </div>
            <div className="w-full bg-[#111827] border border-[#1e2d3d] rounded-sm px-3 py-1 flex items-center gap-2 h-7">
               <Network className="w-3.5 h-3.5 text-[#2563eb]" />
               <span className="text-[9px] font-mono text-slate-300">Multi-Agent LangGraph Routine</span>
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-auto" />
            </div>
          </div>

        </div>

        {/* Citations List */}
        {citations.length > 0 && (
          <div className="border-t border-[#1e2d3d] pt-4">
             <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen className="w-3 h-3" />
              Retrieved Records ({citations.length})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {citations.map((c, i) => (
                <div key={i} className="bg-[#111827] border border-[#1e2d3d] rounded-sm overflow-hidden">
                  <button
                    onClick={() => setExpandedCitation(expandedCitation === i ? null : i)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left cursor-pointer hover:bg-[#1a2332] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="w-3 h-3 text-[#2563eb] shrink-0" />
                      <span className="text-[11px] font-mono text-slate-300 font-semibold truncate">{c.source}</span>
                    </div>
                    {expandedCitation === i
                      ? <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      : <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    }
                  </button>
                  {expandedCitation === i && (
                    <div className="px-3 pb-3 pt-1 border-t border-[#1e2d3d]">
                      <div className="text-[9px] font-mono text-slate-500 mb-1.5">
                        REF: {c.reference_id || 'N/A'}
                      </div>
                      <p className="text-[10px] font-mono text-slate-400 leading-relaxed bg-[#0d1117] p-2 rounded-sm border border-[#1e2d3d]">
                        {c.snippet || 'No snippet available.'}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
