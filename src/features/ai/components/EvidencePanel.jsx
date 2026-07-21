import React from 'react'
import { BookOpen, ChevronDown, ChevronRight, Hash, Activity, Network, CheckCircle, Database } from 'lucide-react'
import { useState } from 'react'

export const EvidencePanel = ({ lastAIMessage }) => {
  const [expandedCitation, setExpandedCitation] = useState(null)

  if (!lastAIMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
        <div className="w-10 h-10 border border-[#1e2d3d] rounded-sm flex items-center justify-center mb-4">
          <Database className="w-5 h-5 text-slate-600" />
        </div>
        <p className="text-xs text-slate-500 leading-relaxed max-w-[180px]">
          Evidence records will appear here after the first AI response.
        </p>
      </div>
    )
  }

  const { citations = [], metadata = {}, confidence } = lastAIMessage
  const confidenceColor =
    confidence === 'high' ? 'text-emerald-400' :
    confidence === 'medium' ? 'text-amber-400' : 'text-red-400'
  const confidenceBg =
    confidence === 'high' ? 'bg-emerald-950/40 border-emerald-900/60' :
    confidence === 'medium' ? 'bg-amber-950/40 border-amber-900/60' :
    'bg-red-950/40 border-red-900/60'
  const confidencePct = confidence === 'high' ? 90 : confidence === 'medium' ? 55 : 30

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Confidence Score */}
      <div className={`mx-4 mt-4 p-3 rounded-sm border ${confidenceBg}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
            Confidence
          </span>
          <span className={`text-[11px] font-mono font-bold ${confidenceColor} uppercase`}>
            {confidence}
          </span>
        </div>
        <div className="h-1 bg-[#1e2d3d] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              confidence === 'high' ? 'bg-emerald-500' :
              confidence === 'medium' ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${confidencePct}%` }}
          />
        </div>
      </div>

      {/* Intent */}
      {metadata.intent && (
        <div className="mx-4 mt-3 space-y-1.5">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Detected Intent</span>
          <div className="flex items-center gap-2 bg-[#111827] border border-[#1e2d3d] px-3 py-2 rounded-sm">
            <Activity className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />
            <span className="text-xs font-mono text-slate-300">{metadata.intent.replace(/_/g, ' ')}</span>
          </div>
        </div>
      )}

      {/* Evidence Source Counts */}
      <div className="mx-4 mt-3 grid grid-cols-2 gap-2">
        <div className="bg-[#111827] border border-[#1e2d3d] px-3 py-2.5 rounded-sm">
          <div className="text-lg font-bold font-mono text-white">{metadata.evidence_sources || 0}</div>
          <div className="text-[10px] text-slate-500 font-mono">Sources</div>
        </div>
        <div className="bg-[#111827] border border-[#1e2d3d] px-3 py-2.5 rounded-sm">
          <div className="text-lg font-bold font-mono text-white">
            {(metadata.rag_citations || 0) + (metadata.sql_citations || 0)}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Citations</div>
        </div>
      </div>

      {/* Reasoning Engine */}
      {metadata.langgraph_enabled && (
        <div className="mx-4 mt-3">
          <div className="flex items-center gap-2 bg-[#0d1117] border border-[#1e2d3d] px-3 py-2 rounded-sm">
            <Network className="w-3.5 h-3.5 text-[#2563eb]" />
            <div>
              <div className="text-[10px] font-mono text-slate-300 font-semibold">LangGraph Active</div>
              <div className="text-[9px] font-mono text-slate-500">
                RAG: {metadata.rag_citations || 0} · SQL: {metadata.sql_citations || 0}
              </div>
            </div>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 ml-auto shrink-0" />
          </div>
        </div>
      )}

      {/* Citations */}
      {citations.length > 0 && (
        <div className="mx-4 mt-4 pb-4">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <BookOpen className="w-3 h-3" />
            Retrieved Records ({citations.length})
          </div>
          <div className="space-y-2">
            {citations.map((c, i) => (
              <div key={i} className="bg-[#111827] border border-[#1e2d3d] rounded-sm overflow-hidden">
                <button
                  onClick={() => setExpandedCitation(expandedCitation === i ? null : i)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-left cursor-pointer hover:bg-[#1a2332] transition-colors"
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
  )
}
