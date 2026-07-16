import React from 'react'
import { Skull } from 'lucide-react'

export const AccusedPage: React.FC = () => {
  return (
    <div className="bg-vigilx-card border border-vigilx-borderMuted rounded-sm p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skull className="w-6 h-6 text-vigilx-danger" />
        <h1 className="text-lg font-bold text-white uppercase tracking-wider">Suspects & Accused Records</h1>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed font-mono">
        DATABASE_ROUTE: /api/accused/<br />
        STATUS: RESTRICTED ACCESS
      </p>
      <div className="border border-dashed border-vigilx-borderMuted p-10 text-center rounded-sm text-xs text-slate-500 font-mono">
        [Accused & Suspect Query Interface - Content Render Delayed in Phase 5]
      </div>
    </div>
  )
}
