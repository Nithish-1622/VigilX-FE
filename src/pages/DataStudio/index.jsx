import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [tab, setTab] = useState(tabParam || 'connectors')

  useEffect(() => {
    if (tabParam && tabParam !== tab) {
      setTab(tabParam)
    }
  }, [tabParam])

  const handleTabChange = (newTab) => {
    setTab(newTab)
    setSearchParams({ tab: newTab })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>Data Studio</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          Universal Database Connector · ETL Pipelines · Data Intelligence
        </p>
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: 3, padding: 4, borderRadius: 10, background: 'rgba(22,27,34,0.85)', border: '1px solid rgba(33,38,45,1)', width: 'fit-content' }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`datastudio-tab-${t.id}`}
            onClick={() => handleTabChange(t.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              background: tab === t.id ? 'rgba(0,240,255,0.12)' : 'transparent',
              color: tab === t.id ? '#00F0FF' : 'var(--text-secondary)',
              border: tab === t.id ? '1px solid rgba(0,240,255,0.2)' : '1px solid transparent',
              cursor: 'pointer', transition: 'all 0.2s',
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
    <div className="glass rounded-xl p-5 border border-[#21262D]">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#21262D]">
        <div className="flex items-center gap-2">
          <GitBranch size={16} className="text-[#BF5AF2]" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">ETL Data Ingestion Pipelines</h2>
        </div>
        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20">
          4 Active Pipelines
        </span>
      </div>

      <div className="divide-y divide-[#21262D]/60">
        {pipelines.map((p) => (
          <div key={p.id} className="py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">{p.name}</p>
              <p className="text-[11px] text-[#8B949E] mt-0.5">{p.source}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[11px] text-[#8B949E] font-mono">{p.records} records</span>
              <span className="text-[11px] text-[#8B949E]">{p.duration}</span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                style={{
                  background: `${STATUS_COLOR[p.status]}15`,
                  color: STATUS_COLOR[p.status],
                  border: `1px solid ${STATUS_COLOR[p.status]}30`
                }}
              >
                {p.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
