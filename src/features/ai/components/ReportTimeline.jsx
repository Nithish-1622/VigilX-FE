import React from 'react'

export const ReportTimeline = ({ timeline }) => {
  if (!timeline || timeline.length === 0) return null

  return (
    <div className="mb-6 pl-6">
      <h3 className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase mb-4 flex items-center gap-2 -ml-6">
        <span className="w-4 h-px bg-slate-600" />
        Chronological Investigation Timeline
      </h3>
      
      <div className="max-w-4xl relative">
        {/* Vertical connecting line */}
        <div className="absolute left-2 top-2 bottom-2 w-px bg-[#1e2d3d]" />
        
        <div className="space-y-4">
          {timeline.map((event, i) => (
            <div key={i} className="relative flex items-start gap-4">
              {/* Timeline dot */}
              <div className={`w-4 h-4 rounded-full mt-0.5 border-2 border-[#07090f] shrink-0 z-10 ${
                i === timeline.length - 1 ? 'bg-[#2563eb]' : 'bg-slate-600'
              }`} />
              
              {/* Event content */}
              <div className="flex-1 bg-[#0a0d14] border border-[#1e2d3d] rounded-sm p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-200">{event.event}</span>
                  <span className="text-[10px] font-mono text-slate-500">{event.time}</span>
                </div>
                {event.description && (
                  <p className="text-[11px] text-slate-400 mt-1">{event.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
