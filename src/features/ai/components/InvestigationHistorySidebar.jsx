import React from 'react'
import { Plus, Search, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export const InvestigationHistorySidebar = ({
  sessions,
  currentSessionId,
  sessionSearch,
  setSessionSearch,
  onCreateSession,
  onSelectSession,
  isWelcomeState
}) => {
  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(sessionSearch.toLowerCase())
  )

  return (
    <AnimatePresence>
      {!isWelcomeState && (
        <motion.aside
          key="sessions-panel"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 220, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
          className="shrink-0 border-r border-[#1e2d3d] bg-[#0d1117] flex-col hidden md:flex overflow-hidden"
          style={{ minWidth: 0 }}
        >
          {/* New Investigation */}
          <div className="p-3 border-b border-[#1e2d3d]">
            <button
              onClick={onCreateSession}
              className="w-full flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2 px-3 rounded-sm text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              New Investigation
            </button>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-[#1e2d3d]">
            <div className="relative">
              <Search className="w-3 h-3 text-slate-600 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={sessionSearch}
                onChange={(e) => setSessionSearch(e.target.value)}
                placeholder="Search history..."
                className="w-full bg-[#07090f] border border-[#1e2d3d] focus:border-[#2563eb]/60 focus:outline-none rounded-sm py-1.5 pl-7 pr-3 text-[11px] font-mono text-slate-400 placeholder-slate-600"
              />
            </div>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto py-2">
            <div className="px-3 pb-1.5">
              <span className="text-[9px] font-mono font-bold tracking-widest text-slate-600 uppercase">
                Investigations ({filteredSessions.length})
              </span>
            </div>
            <div className="space-y-0.5 px-2">
              {filteredSessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSelectSession(s.id)}
                  className={`w-full flex flex-col items-start px-2.5 py-2 rounded-sm text-left transition-colors cursor-pointer ${
                    currentSessionId === s.id
                      ? 'bg-[#0f1d35] border border-[#1e3a6e]/60 text-slate-200'
                      : 'text-slate-500 hover:bg-[#111827] hover:text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-1.5 w-full">
                    <MessageSquare className={`w-3 h-3 shrink-0 ${currentSessionId === s.id ? 'text-[#2563eb]' : 'text-slate-600'}`} />
                    <span className="text-[11px] font-medium truncate">{s.title}</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-600 mt-0.5 ml-4.5">{s.time}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status Footer */}
          <div className="p-3 border-t border-[#1e2d3d] bg-[#07090f]">
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                History Vault
              </span>
              <span className="truncate max-w-[80px] text-right text-[#334155]">
                {currentSessionId?.slice(-8) ?? '—'}
              </span>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
