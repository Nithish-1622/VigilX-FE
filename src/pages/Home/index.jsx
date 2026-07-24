import { motion } from 'framer-motion'
import { AlertTriangle, Activity, Users, Shield, Clock, TrendingUp } from 'lucide-react'
import CrimeCharts from './CrimeCharts'
import NetworkMini from './NetworkMini'
import HotspotMap from './HotspotMap'

const STATS = [
  { icon: AlertTriangle, label: 'Active Incidents', value: '47',    delta: '+3',  accent: '#FF3B30', bg: 'rgba(255,59,48,0.07)',  border: 'rgba(255,59,48,0.18)' },
  { icon: Users,         label: 'Tracked Persons',  value: '1,284', delta: '+18', accent: '#00F0FF', bg: 'rgba(0,240,255,0.05)', border: 'rgba(0,240,255,0.13)' },
  { icon: Activity,      label: 'AI Queries Today', value: '392',   delta: '+56', accent: '#BF5AF2', bg: 'rgba(191,90,242,0.05)', border: 'rgba(191,90,242,0.13)' },
  { icon: Shield,        label: 'Cases Resolved',   value: '28',    delta: '+4',  accent: '#30D158', bg: 'rgba(48,209,88,0.05)', border: 'rgba(48,209,88,0.13)' },
]

const ALERTS = [
  { id: 1, msg: 'Gang activity spike detected — Harbor District', time: '3m ago',  level: 'critical' },
  { id: 2, msg: 'New suspect linked to Case #4421',              time: '12m ago', level: 'high'     },
  { id: 3, msg: 'Cytoscape sync complete: 8 new connections',   time: '28m ago', level: 'info'     },
  { id: 4, msg: 'V2 pipeline completed for query #8812',        time: '41m ago', level: 'info'     },
]

const AGENTS = [
  { name: 'PlanningAgent',  status: 'active', tasks: 3 },
  { name: 'SQLToolAgent',   status: 'active', tasks: 7 },
  { name: 'GraphAgent',     status: 'idle',   tasks: 0 },
  { name: 'TimelineAgent',  status: 'active', tasks: 2 },
  { name: 'CriticAgent',    status: 'idle',   tasks: 0 },
  { name: 'GeoAgent',       status: 'active', tasks: 1 },
]

const LEVEL_COLOR = { critical: '#FF3B30', high: '#FF9F0A', info: '#00F0FF' }

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>Intelligence Dashboard</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Real-time overview ·{' '}
            <span style={{ color: '#00F0FF' }}>Thursday, 24 July 2026</span>
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 8, fontSize: 12,
          background: 'rgba(0,240,255,0.06)', border: '1px solid rgba(0,240,255,0.12)',
        }}>
          <Clock size={12} style={{ color: '#00F0FF' }} />
          <span style={{ color: '#00F0FF', fontWeight: 600 }}>Live</span>
          <span style={{ color: 'var(--text-muted)' }}>· Updated just now</span>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14 }}>
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              borderRadius: 12, padding: '14px 16px',
              background: s.bg, border: `1px solid ${s.border}`,
              transition: 'transform 0.2s',
              cursor: 'default',
            }}
            whileHover={{ y: -2 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <s.icon size={15} style={{ color: s.accent }} />
              <span style={{
                fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                background: `${s.accent}20`, color: s.accent,
              }}>
                {s.delta} today
              </span>
            </div>
            <p style={{ fontSize: 24, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Charts + Alerts Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'start' }}>
        <CrimeCharts />
        <LiveAlerts alerts={ALERTS} />
      </div>

      {/* ── Network + Map Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
        <NetworkMini />
        <HotspotMap />
      </div>

      {/* ── Agent Fleet ── */}
      <AgentStatus agents={AGENTS} />
    </div>
  )
}

function LiveAlerts({ alerts }) {
  return (
    <div className="glass" style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(33,38,45,1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={14} style={{ color: '#FF3B30' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Live Alerts</span>
        </div>
        <div className="status-dot active" />
      </div>
      <div>
        {alerts.map((a) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 16px', borderBottom: '1px solid rgba(33,38,45,0.5)', cursor: 'default' }}
          >
            <div style={{ width: 3, minHeight: 8, borderRadius: 2, background: LEVEL_COLOR[a.level], flexShrink: 0, marginTop: 4 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 11, color: '#fff', lineHeight: 1.4 }}>{a.msg}</p>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={9} /> {a.time}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(33,38,45,1)' }}>
        <button style={{ fontSize: 11, color: '#00F0FF', background: 'none', border: 'none', cursor: 'pointer' }}>
          View all alerts →
        </button>
      </div>
    </div>
  )
}

function AgentStatus({ agents }) {
  return (
    <div className="glass" style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(33,38,45,1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={14} style={{ color: '#BF5AF2' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>AI Agent Fleet</span>
          <span className="tag-cyan">{agents.filter((a) => a.status === 'active').length} Active</span>
        </div>
        <TrendingUp size={13} style={{ color: '#30D158' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', padding: 0 }}>
        {agents.map((agent, i) => (
          <div
            key={agent.name}
            style={{
              padding: '12px 8px', textAlign: 'center',
              borderRight: i < 5 ? '1px solid rgba(33,38,45,0.5)' : 'none',
              cursor: 'default',
            }}
          >
            <div style={{
              width: 8, height: 8, borderRadius: '50%', margin: '0 auto 6px',
              background: agent.status === 'active' ? '#00F0FF' : 'var(--text-muted)',
              boxShadow: agent.status === 'active' ? '0 0 6px #00F0FF' : 'none',
              animation: agent.status === 'active' ? 'pulseDot 2s ease-in-out infinite' : 'none',
            }} />
            <p style={{ fontSize: 10, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {agent.name.replace('Agent', '')}
            </p>
            <p style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'capitalize', marginTop: 1 }}>{agent.status}</p>
            {agent.tasks > 0 && (
              <p style={{ fontSize: 9, color: '#00F0FF', marginTop: 1 }}>{agent.tasks} tasks</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
