import React from 'react'
import { UserX } from 'lucide-react'

export const VictimsPage: React.FC = () => {
  return (
    <div className="bg-vigilx-card border border-vigilx-borderMuted rounded-sm p-6 space-y-4">
      <div className="flex items-center gap-3">
        <UserX className="w-6 h-6 text-vigilx-primary" />
        <h1 className="text-lg font-bold text-white uppercase tracking-wider">Victims Directory</h1>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed font-mono">
        DATABASE_ROUTE: /api/victims/<br />
        STATUS: RESTRICTED ACCESS
      </p>
      <div className="border border-dashed border-vigilx-borderMuted p-10 text-center rounded-sm text-xs text-slate-500 font-mono">
        [Victims Registry Interface - Content Render Delayed in Phase 5]
      </div>
    </div>
  )
}
