import React, { useState } from 'react'
import {
  ShieldCheck,
  Search,
  Filter,
  Lock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Hash
} from 'lucide-react'

const MOCK_AUDIT_LOGS = [
  {
    id: 'LOG-9001',
    timestamp: '2026-07-21T12:45:10Z',
    officer: 'dev_officer (DEV-007)',
    action: 'SEARCH_SUSPECT_DOSSIER',
    resource: '/api/accused/?search=John+Doe',
    ip: '127.0.0.1',
    status: 'VERIFIED',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    id: 'LOG-9002',
    timestamp: '2026-07-21T11:30:22Z',
    officer: 'officer1 (B-101)',
    action: 'REGISTER_FIR_CASE',
    resource: '/api/cases/',
    ip: '192.168.1.45',
    status: 'VERIFIED',
    hash: '8f4e3c2b1a9f0d8e7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d',
  },
  {
    id: 'LOG-9003',
    timestamp: '2026-07-21T10:15:05Z',
    officer: 'officer1 (B-101)',
    action: 'AI_AGENT_REASONING_QUERY',
    resource: '/ai/ask',
    ip: '192.168.1.45',
    status: 'VERIFIED',
    hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
  },
  {
    id: 'LOG-9004',
    timestamp: '2026-07-21T08:00:19Z',
    officer: 'analyst_sharma (B-204)',
    action: 'EXPORT_ANALYTICS_REPORT',
    resource: '/api/analytics/export',
    ip: '10.0.0.12',
    status: 'VERIFIED',
    hash: '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
  },
  {
    id: 'LOG-9005',
    timestamp: '2026-07-20T22:12:44Z',
    officer: 'guest_user (UNVERIFIED)',
    action: 'AUTH_FAILURE',
    resource: '/api/auth/login/',
    ip: '185.220.101.5',
    status: 'REJECTED',
    hash: '7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b',
  },
]

export const AuditPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAction, setSelectedAction] = useState('ALL')

  const filteredLogs = MOCK_AUDIT_LOGS.filter((log) => {
    const matchesSearch =
      log.officer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip.includes(searchQuery)
    const matchesAction = selectedAction === 'ALL' || log.action.includes(selectedAction)
    return matchesSearch && matchesAction
  })

  return (
    <div className="space-y-6">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-vigilx-success" />
            SECURITY ACCESS LOGS & AUDIT TRAILS
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Immutable Cryptographic Ledger & Judicial Access Protocol (Compliance Standard ISO 27001)
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="bg-[#0b1c16] text-[#059669] border border-[#0d3625] px-3 py-1.5 rounded-sm flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            LEDGER_VERIFIED: TRUE
          </span>
        </div>
      </div>

      {/* 2. Control Bar */}
      <div className="bg-vigilx-card border border-vigilx-borderMuted rounded-sm p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search officer, action, IP, resource..."
            className="w-full bg-[#080b11] border border-vigilx-borderMuted focus:border-vigilx-borderActive focus:outline-none rounded-sm py-2 pl-9 pr-4 text-xs font-mono text-slate-200 placeholder-slate-600 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1 mr-2">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {['ALL', 'SEARCH', 'REGISTER', 'AI_AGENT', 'AUTH'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedAction(cat)}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                selectedAction === cat
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900 font-semibold'
                  : 'text-slate-400 border border-transparent hover:border-vigilx-borderMuted hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Data Table */}
      <div className="bg-vigilx-card border border-vigilx-borderMuted rounded-sm overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-vigilx-borderMuted text-slate-400 font-semibold bg-[#0d121c] font-mono">
                <th className="py-3 px-4">LOG ID / TIMESTAMP</th>
                <th className="py-3 px-4">OFFICER IDENTIFIER</th>
                <th className="py-3 px-4">ACTION CATEGORY</th>
                <th className="py-3 px-4">TARGET RESOURCE</th>
                <th className="py-3 px-4">CLIENT IP</th>
                <th className="py-3 px-4">AUDIT HASH</th>
                <th className="py-3 px-4 text-right">STATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vigilx-borderMuted font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#151c2b]/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="text-indigo-400 font-bold">{log.id}</span>
                      <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-200 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{log.officer}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-[#182030] text-indigo-300 border border-vigilx-borderMuted px-2 py-0.5 rounded text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">
                    {log.resource}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {log.ip}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500 max-w-[120px] truncate" title={log.hash}>
                    <div className="flex items-center gap-1">
                      <Hash className="w-3 h-3 text-slate-600 shrink-0" />
                      <span className="truncate">{log.hash}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] rounded-sm font-semibold border ${
                        log.status === 'VERIFIED'
                          ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/60'
                          : 'bg-red-950/30 text-red-400 border-red-900/60'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#0d101a] px-4 py-3 border-t border-vigilx-borderMuted flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>TOTAL LOGGED ACTIONS: {filteredLogs.length}</span>
          <span>LEDGER_ENGINE: SHA-256 SYNCED</span>
        </div>
      </div>

    </div>
  )
}
