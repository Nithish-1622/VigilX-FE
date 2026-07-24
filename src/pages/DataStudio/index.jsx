import { useState } from 'react'
import { motion } from 'framer-motion'
import { Database, MessageSquare, GitBranch, Activity, ChevronRight } from 'lucide-react'
import ConnectorPanel from './ConnectorPanel'
import DBChatbot from './DBChatbot'

const TABS = [
  { id: 'connectors', label: 'DB Connectors', icon: Database },
  { id: 'chatbot', label: 'DB Chatbot', icon: MessageSquare },
  { id: 'pipelines', label: 'ETL Pipelines', icon: GitBranch },
]

const PIPELINES = [
  { id: 1, name: 'Crime Reports Ingestion', source: 'CSV → PostgreSQL', status: 'running', records: 1240, duration: '2m 14s' },
  { id: 2, name: 'Suspect Graph Sync', source: 'PostgreSQL → Neo4j', status: 'completed', records: 8810, duration: '5m 47s' },
  { id: 3, name: 'PDF Document Parse', source: 'PDF → Vector Store', status: 'queued', records: 0, duration: '—' },
  { id: 4, name: 'API Intelligence Feed', source: 'REST API → MongoDB', status: 'completed', records: 3320, duration: '1m 02s' },
]

const STATUS_COLOR = { running: '#00F0FF', completed: '#30D158', queued: '#8B949E', failed: '#FF3B30' }

export default function DataStudio() {
  const [tab, setTab] = useState('connectors')

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div>
        <h1 style={{ fontSize:22, fontWeight:800, color:'#fff', margin:0 }}>Data Studio</h1>
        <p style={{ fontSize:13, color:'var(--text-secondary)', marginTop:4 }}>Universal Database Connector · ETL Pipelines · Data Intelligence</p>
      </div>

      {/* Tab Bar */}
      <div style={{ display:'flex', gap:3, padding:4, borderRadius:10, background:'rgba(22,27,34,0.85)', border:'1px solid rgba(33,38,45,1)', width:'fit-content' }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`datastudio-tab-${t.id}`}
            onClick={() => setTab(t.id)}
            style={{
              display:'flex', alignItems:'center', gap:7,
              padding:'7px 16px', borderRadius:8, fontSize:13, fontWeight:500,
              background: tab===t.id ? 'rgba(0,240,255,0.12)' : 'transparent',
              color: tab===t.id ? '#00F0FF' : 'var(--text-secondary)',
              border: tab===t.id ? '1px solid rgba(0,240,255,0.2)' : '1px solid transparent',
              cursor:'pointer', transition:'all 0.2s',
            }}
          >
            <t.icon size={13} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {tab === 'connectors' && <ConnectorPanel />}
        {tab === 'chatbot' && <DBChatbot />}
        {tab === 'pipelines' && <PipelineMonitor pipelines={PIPELINES} />}
      </motion.div>
    </div>
  )
}

function PipelineMonitor({ pipelines }) {
  return (
    <div className="space-y-3">
      {pipelines.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-xl p-4 flex items-center gap-4 hover:border-border-active transition-all"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${STATUS_COLOR[p.status]}12`, border: `1px solid ${STATUS_COLOR[p.status]}30` }}
          >
            <GitBranch size={16} style={{ color: STATUS_COLOR[p.status] }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{p.name}</p>
            <p className="text-xs text-text-muted mt-0.5">{p.source}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs font-medium capitalize" style={{ color: STATUS_COLOR[p.status] }}>{p.status}</p>
            {p.records > 0 && <p className="text-[10px] text-text-muted">{p.records.toLocaleString()} records</p>}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-text-muted">{p.duration}</p>
          </div>
          {p.status === 'running' && (
            <Activity size={14} className="text-accent-cyan flex-shrink-0 animate-pulse" />
          )}
          <ChevronRight size={14} className="text-text-muted flex-shrink-0" />
        </motion.div>
      ))}
    </div>
  )
}
