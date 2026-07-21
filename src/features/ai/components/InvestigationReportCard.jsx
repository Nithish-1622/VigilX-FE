import React from 'react'
import { Lock, FileText, Cpu, CheckCircle } from 'lucide-react'
import { ReportSummary } from './ReportSummary'
import { ReportKeyDetails } from './ReportKeyDetails'
import { ReportEvidenceAnalysis } from './ReportEvidenceAnalysis'
import { ReportGraphView } from './ReportGraphView'
import { ReportTimeline } from './ReportTimeline'
import { ReportFollowUps } from './ReportFollowUps'

export const InvestigationReportCard = ({ report, onSelectFollowUp }) => {
  // Extract sections from the report object
  const {
    id,
    timestamp,
    query,
    summary,
    keyDetails,
    evidence,
    graphData,
    timeline,
    followUps,
  } = report

  return (
    <div className="w-full max-w-6xl mx-auto bg-[#07090f] border border-[#1e2d3d] rounded-sm shadow-2xl mb-8 flex flex-col relative overflow-hidden">
      
      {/* Top Banner / Classification */}
      <div className="bg-[#0a0d14] border-b border-[#1e2d3d] px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-6 h-6 bg-[#111827] border border-[#1e2d3d] rounded-sm">
            <Lock className="w-3 h-3 text-slate-400" />
          </div>
          <div>
            <h2 className="text-[10px] font-mono font-bold tracking-widest text-slate-200 uppercase">
              OFFICIAL CRIME INTELLIGENCE REPORT
            </h2>
            <p className="text-[9px] font-mono text-slate-500 mt-0.5">
              REPORT ID: {id} | TIMESTAMP: {timestamp}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 border border-[#dc2626]/30 bg-[#dc2626]/10 px-2.5 py-1 rounded-sm">
          <span className="text-[9px] font-mono font-bold tracking-widest text-[#dc2626] uppercase">
            CONFIDENTIAL
          </span>
        </div>
      </div>

      {/* Query Banner */}
      <div className="bg-[#111827]/50 border-b border-[#1e2d3d]/50 px-6 py-3 flex items-start gap-3">
        <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase mt-1 shrink-0">
          INVESTIGATION QUERY:
        </span>
        <span className="text-xs font-mono text-slate-300 leading-relaxed italic">
          "{query}"
        </span>
      </div>

      {/* Report Body */}
      <div className="p-6 md:p-8 flex-1">
        
        {/* 1. Summary */}
        <ReportSummary summaryText={summary} />

        {/* 2. Key Details */}
        <ReportKeyDetails details={keyDetails} />

        {/* 3. Evidence Analysis */}
        <ReportEvidenceAnalysis evidence={evidence} />

        {/* 4. Graph Relationships */}
        <ReportGraphView graphData={graphData} />

        {/* 5. Timeline */}
        <ReportTimeline timeline={timeline} />

        {/* 6. Follow-ups */}
        <ReportFollowUps followUps={followUps} onSelect={onSelectFollowUp} />

      </div>

      {/* Footer Footer */}
      <div className="bg-[#0a0d14] border-t border-[#1e2d3d] px-6 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4 text-[9px] font-mono text-slate-500">
          <span className="flex items-center gap-1.5"><Cpu className="w-3 h-3" /> Llama-3.3-70B Engine</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-500" /> Multi-Agent RAG Verified</span>
        </div>
        <span className="text-[9px] font-mono text-slate-600">
          VigilX Automated Intelligence System
        </span>
      </div>
    </div>
  )
}
