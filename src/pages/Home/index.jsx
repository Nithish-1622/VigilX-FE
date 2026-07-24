import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle, Activity, Users, Shield, Clock,
  RefreshCw, ChevronRight,
} from 'lucide-react'
import CrimeCharts from './CrimeCharts'
import NetworkMini from './NetworkMini'
import HotspotMap from './HotspotMap'

const STATS = [
  {
    id: 'incidents',
    icon: AlertTriangle,
    label: 'Active Incidents',
    value: '47',
    delta: '+3',
    deltaLabel: 'today',
    accent: '#F03E3E',
    sub: '12 high priority · Harbor District',
  },
  {
    id: 'persons',
    icon: Users,
    label: 'Tracked Persons',
    value: '1,284',
    delta: '+18',
    deltaLabel: 'today',
    accent: '#00D4FF',
    sub: '480 connected in graph',
  },
  {
    id: 'queries',
    icon: Activity,
    label: 'AI Queries Today',
    value: '392',
    delta: '+56',
    deltaLabel: 'today',
    accent: '#A855F7',
    sub: 'Avg execution 1.4s',
  },
  {
    id: 'resolved',
    icon: Shield,
    label: 'Cases Resolved',
    value: '28',
    delta: '+4',
    deltaLabel: 'today',
    accent: '#22C55E',
    sub: '67.4% resolution rate',
  },
]

const ALERTS = [
  { id: 1, title: 'Gang activity spike detected', district: 'Harbor District', time: '3m ago', level: 'CRITICAL', color: '#F03E3E' },
  { id: 2, title: 'New suspect linked to Case #4421', district: 'Downtown Sector', time: '12m ago', level: 'HIGH', color: '#F59E0B' },
  { id: 3, title: 'Cytoscape sync complete', district: '8 new connections', time: '28m ago', level: 'INFO', color: '#00D4FF' },
  { id: 4, title: 'V2 pipeline finished for query #8812', district: 'Multi-Agent', time: '41m ago', level: 'INFO', color: '#00D4FF' },
]

const FLEET_AGENTS = [
  { name: 'Planning', role: 'Orchestrator', status: 'active', color: '#A855F7' },
  { name: 'SQLTool', role: 'DB Retrieval', status: 'active', color: '#00D4FF' },
  { name: 'Graph', role: 'Network Analysis', status: 'active', color: '#22C55E' },
  { name: 'Timeline', role: 'Temporal', status: 'idle', color: '#F59E0B' },
  { name: 'Critic', role: 'Validation', status: 'active', color: '#F03E3E' },
  { name: 'Geo', role: 'Spatial', status: 'active', color: '#00D4FF' },
]

export default function Home() {
  const [refreshing, setRefreshing] = useState(false)

  const triggerRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 800)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Page header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          paddingBottom: 16,
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Intelligence Dashboard
            </h1>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '2px 8px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 500,
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.15)',
                color: '#22C55E',
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: '#22C55E',
                  animation: 'pulseDot 2s ease-in-out infinite',
                }}
              />
              Live
            </span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
            Real-time criminal analytics · Metropolitan Police HQ
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 10px',
              borderRadius: 6,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              fontSize: 11,
              color: 'var(--text-secondary)',
            }}
          >
            <Clock size={12} style={{ color: 'var(--accent-cyan)' }} />
            Thu, 24 Jul 2026
          </div>
          <button
            onClick={triggerRefresh}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 12px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--text-secondary)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)'
              e.currentTarget.style.borderColor = 'var(--border-active)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)'
              e.currentTarget.style.borderColor = 'var(--border-subtle)'
            }}
          >
            <RefreshCw
              size={13}
              style={{
                color: refreshing ? 'var(--accent-cyan)' : 'inherit',
                animation: refreshing ? 'spin 0.8s linear infinite' : 'none',
              }}
            />
            Sync Feeds
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {STATS.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
            style={{
              padding: '14px 16px',
              borderRadius: 9,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              cursor: 'default',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-active)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span className="section-label">{s.label}</span>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  background: `${s.accent}10`,
                  border: `1px solid ${s.accent}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <s.icon size={13} style={{ color: s.accent }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                {s.value}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: s.accent,
                  background: `${s.accent}10`,
                  padding: '1px 6px',
                  borderRadius: 4,
                }}
              >
                {s.delta} {s.deltaLabel}
              </span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'stretch' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <CrimeCharts />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <LiveAlertsCard alerts={ALERTS} />
        </div>
      </div>

      {/* Graph + Map row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'stretch' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <NetworkMini />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <HotspotMap />
        </div>
      </div>

      {/* Agent fleet */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 9,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-tertiary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={14} style={{ color: 'var(--accent-purple)' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
              Agent Fleet
            </span>
            <span className="tag-cyan">
              {FLEET_AGENTS.filter((a) => a.status === 'active').length}/{FLEET_AGENTS.length} active
            </span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            Avg latency{' '}
            <strong style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontWeight: 500 }}>
              140ms
            </strong>
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 1,
            background: 'var(--border-subtle)',
          }}
        >
          {FLEET_AGENTS.map((agent) => (
            <div
              key={agent.name}
              style={{
                padding: '12px 14px',
                background: 'var(--bg-secondary)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: agent.status === 'active' ? agent.color : 'var(--text-muted)',
                    boxShadow: agent.status === 'active' ? `0 0 0 2px ${agent.color}25` : 'none',
                    display: 'inline-block',
                  }}
                />
                <span
                  className="section-label"
                  style={{ color: agent.status === 'active' ? agent.color : 'var(--text-muted)' }}
                >
                  {agent.status}
                </span>
              </div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                {agent.name}
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{agent.role}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

function LiveAlertsCard({ alerts }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 9,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-tertiary)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={14} style={{ color: '#F03E3E' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Live Alerts</span>
        </div>
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#F03E3E',
            display: 'inline-block',
            animation: 'pulseDot 1.5s ease-in-out infinite',
          }}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {alerts.map((a, i) => (
          <div
            key={a.id}
            style={{
              padding: '11px 16px',
              borderBottom: i < alerts.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              cursor: 'pointer',
              transition: 'background 0.1s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 3,
                  background: `${a.color}10`,
                  color: a.color,
                  border: `1px solid ${a.color}20`,
                  letterSpacing: '0.04em',
                }}
              >
                {a.level}
              </span>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 10,
                  color: 'var(--text-muted)',
                }}
              >
                <Clock size={9} /> {a.time}
              </span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 2px', lineHeight: 1.4 }}>
              {a.title}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0 }}>{a.district}</p>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: '10px 16px',
          borderTop: '1px solid var(--border-subtle)',
          flexShrink: 0,
        }}
      >
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--accent-cyan)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          View all alerts <ChevronRight size={13} />
        </button>
      </div>
    </div>
  )
}
