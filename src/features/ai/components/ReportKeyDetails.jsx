import React from 'react'

export const ReportKeyDetails = ({ details }) => {
  if (!details || Object.keys(details).length === 0) return null

  return (
    <div className="mb-6 pl-6">
      <h3 className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase mb-3 flex items-center gap-2 -ml-6">
        <span className="w-4 h-px bg-slate-600" />
        Key Investigation Details
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl">
        {Object.entries(details).map(([key, value], i) => {
          if (value === null || value === undefined || value === '') return null
          
          return (
            <div key={i} className="bg-[#0a0d14] border border-[#1e2d3d] px-4 py-3 rounded-sm flex flex-col justify-center">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                {key.replace(/_/g, ' ')}
              </span>
              <span className="text-xs font-semibold text-slate-200">
                {value}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
