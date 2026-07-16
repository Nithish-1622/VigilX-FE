import React from 'react'
import { FolderKanban } from 'lucide-react'

export const CasesPage: React.FC = () => {
  return (
    <div className="bg-vigilx-card border border-vigilx-borderMuted rounded-sm p-6 space-y-4">
      <div className="flex items-center gap-3">
        <FolderKanban className="w-6 h-6 text-vigilx-primary" />
        <h1 className="text-lg font-bold text-white uppercase tracking-wider">Case Management Files</h1>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed font-mono">
        DATABASE_ROUTE: /api/cases/<br />
        STATUS: RESTRICTED ACCESS
      </p>
      <div className="border border-dashed border-vigilx-borderMuted p-10 text-center rounded-sm text-xs text-slate-500 font-mono">
        [Cases Database Query Interface - Content Render Delayed in Phase 5]
      </div>
    </div>
  )
}
