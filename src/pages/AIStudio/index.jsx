import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, MessageSquare, Cpu, Users } from 'lucide-react'
import ChatV1 from './ChatV1'
import ChatV2 from './ChatV2'
import AgentsDirectory from './AgentsDirectory'
import MLPage from './MLPage'

const TABS = [
  { id: 'v2', label: 'VigilX V2 AI', icon: Brain, badge: 'Multi-Agent Pipeline' },
  { id: 'v1', label: 'V1 Chat', icon: MessageSquare, badge: null },
  { id: 'agents', label: 'Agents Fleet', icon: Users, badge: '12 Active' },
  { id: 'ml', label: 'ML Studio', icon: Cpu, badge: 'Beta' },
]

export default function AIStudio() {
  const [tab, setTab] = useState('v2')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Title & Subtitle Header */}
      <div style={{ paddingBottom: 10, borderBottom: '1px solid rgba(33,38,45,0.6)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>AI Studio</h1>
        <p style={{ fontSize: 13, color: '#8B949E', marginTop: 4 }}>
          Multi-Agent Intelligence Orchestrator · Conversational AI · Predictive Law Enforcement Models
        </p>
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: 4, borderRadius: 10, background: 'rgba(22,27,34,0.85)', border: '1px solid rgba(33,38,45,1)', width: 'fit-content', flexWrap: 'wrap' }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`aistudio-tab-${t.id}`}
            onClick={() => setTab(t.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: tab === t.id ? 'rgba(0,240,255,0.12)' : 'transparent',
              color: tab === t.id ? '#00F0FF' : '#8B949E',
              border: tab === t.id ? '1px solid rgba(0,240,255,0.25)' : '1px solid transparent',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <t.icon size={13} />
            <span>{t.label}</span>
            {t.badge && (
              <span
                style={{
                  fontSize: 9, fontFamily: 'monospace', padding: '2px 6px', borderRadius: 4,
                  background: tab === t.id ? 'rgba(0,240,255,0.2)' : 'rgba(139,148,158,0.15)',
                  color: tab === t.id ? '#00F0FF' : '#8B949E',
                }}
              >
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content Container */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        style={{ flex: 1 }}
      >
        {tab === 'v2' && <ChatV2 />}
        {tab === 'v1' && <ChatV1 />}
        {tab === 'agents' && <AgentsDirectory />}
        {tab === 'ml' && <MLPage />}
      </motion.div>
    </div>
  )
}
