import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Cpu, ArrowLeft, Shield } from 'lucide-react'

export const WorkspaceHeader = ({ activeSessionTitle }) => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#1e2d3d] bg-[#0d1117] shrink-0">
      
      {/* Left side: Back to Command Center & Branding */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center justify-center w-7 h-7 bg-[#111827] border border-[#1e2d3d] hover:border-[#2563eb]/60 text-slate-400 hover:text-slate-200 rounded-sm transition-all cursor-pointer"
          title="Return to Command Center"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-5 bg-[#1e2d3d]" />

        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#07090f] border border-[#1e2d3d] rounded-sm flex items-center justify-center">
            <Cpu className="w-3.5 h-3.5 text-[#2563eb]" />
          </div>
          <div>
            <h1 className="text-[11px] font-bold tracking-widest text-slate-200 uppercase font-mono leading-tight">
              AI Investigation Workspace
            </h1>
            <p className="text-[9px] font-mono text-slate-500 mt-0.5">
              {activeSessionTitle}
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Classification & Telemetry */}
      <div className="flex items-center gap-4">
        
        {/* Classification Badge */}
        <div className="hidden sm:flex items-center gap-1.5 border border-[#dc2626]/30 bg-[#dc2626]/10 px-2 py-0.5 rounded-sm">
          <Shield className="w-3 h-3 text-[#dc2626]" />
          <span className="text-[9px] font-mono font-bold tracking-wider text-[#dc2626] uppercase">
            CONFIDENTIAL // RESTRICTED
          </span>
        </div>

        {/* Model Telemetry */}
        <div className="flex items-center gap-2 font-mono">
          <span className="text-[9px] bg-[#07090f] text-blue-300 border border-[#1e2d3d] px-2.5 py-1 rounded-sm hidden md:block">
            Llama-3.3-70B
          </span>
          <span className="text-[9px] bg-[#07090f] text-slate-400 border border-[#1e2d3d] px-2.5 py-1 rounded-sm hidden lg:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Multi-Agent Reasoning Active
          </span>
        </div>
      </div>
    </div>
  )
}
