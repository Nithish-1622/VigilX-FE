import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle, Activity, Users, Shield, Clock, TrendingUp,
  RefreshCw, Layers, CheckCircle2, ChevronRight
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
    delta: '+3 today',
    accent: '#FF3B30',
    subtext: '12 high priority in Harbor District'
  },
  {
    id: 'persons',
    icon: Users,
    label: 'Tracked Persons',
    value: '1,284',
    delta: '+18 today',
    accent: '#00F0FF',
    subtext: '480 connected in Neo4j graph'
  },
  {
    id: 'queries',
    icon: Activity,
    label: 'AI Queries Today',
    value: '392',
    delta: '+56 today',
    accent: '#BF5AF2',
    subtext: 'Avg execution time 1.4s'
  },
  {
    id: 'resolved',
    icon: Shield,
    label: 'Cases Resolved',
    value: '28',
    delta: '+4 today',
    accent: '#30D158',
    subtext: '67.4% resolution rate'
  },
]

const ALERTS = [
  { id: 1, title: 'Gang activity spike detected', district: 'Harbor District', time: '3m ago', level: 'CRITICAL', badgeColor: '#FF3B30' },
  { id: 2, title: 'New suspect linked to Case #4421', district: 'Downtown Sector', time: '12m ago', level: 'HIGH RISK', badgeColor: '#FF9F0A' },
  { id: 3, title: 'Cytoscape sync complete', district: '8 new connections', time: '28m ago', level: 'INFO', badgeColor: '#00F0FF' },
  { id: 4, title: 'V2 pipeline finished for query #8812', district: 'Multi-Agent', time: '41m ago', level: 'INFO', badgeColor: '#00F0FF' },
]

const FLEET_AGENTS = [
  { name: 'PlanningAgent', role: 'Orchestrator', status: 'active', tasks: 3, color: '#BF5AF2' },
  { name: 'SQLToolAgent', role: 'Database Retrieval', status: 'active', tasks: 7, color: '#00F0FF' },
  { name: 'GraphAgent', role: 'Network Analysis', status: 'active', tasks: 4, color: '#30D158' },
  { name: 'TimelineAgent', role: 'Temporal Mapping', status: 'idle', tasks: 0, color: '#FF9F0A' },
  { name: 'CriticAgent', role: 'Fact Verification', status: 'active', tasks: 2, color: '#FF3B30' },
  { name: 'GeoAgent', role: 'Spatial Clustering', status: 'active', tasks: 1, color: '#00F0FF' },
]

export default function Home() {
  const [refreshing, setRefreshing] = useState(false)

  const triggerRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 800)
  }

  return (
    <div className="space-y-6">

      {/* ── Dashboard Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#21262D]/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">Intelligence Dashboard</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
              Live Operations
            </span>
          </div>
          <p className="text-xs text-[#8B949E] mt-1">
            Real-time multi-agent criminal analytics · Jurisdiction: Metropolitan Police HQ
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#161B22] border border-[#30363D] text-xs text-[#8B949E]">
            <Clock size={13} className="text-[#00F0FF]" />
            <span>Updated: Thursday, 24 July 2026</span>
          </div>
          <button
            onClick={triggerRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] text-xs text-white transition-colors"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin text-[#00F0FF]' : 'text-[#8B949E]'} />
            Sync Feeds
          </button>
        </div>
      </div>

      {/* ── Key Metrics Cards Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-4 hover:border-[#30363D] transition-all cursor-default"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider">{s.label}</span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${s.accent}15`, border: `1px solid ${s.accent}30` }}
              >
                <s.icon size={16} style={{ color: s.accent }} />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-white tracking-tight">{s.value}</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#161B22] text-white/90 border border-[#30363D]">
                {s.delta}
              </span>
            </div>
            <p className="text-[11px] text-[#484F58] mt-2 truncate">{s.subtext}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Row 1: Crime Analytics & Live Alerts (Equal Height Grid) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <CrimeCharts />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <LiveAlertsCard alerts={ALERTS} />
        </div>
      </div>

      {/* ── Row 2: Criminal Network Graph & Geospatial Map (Equal Height Grid) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 flex flex-col">
          <NetworkMini />
        </div>
        <div className="lg:col-span-6 flex flex-col">
          <HotspotMap />
        </div>
      </div>

      {/* ── Row 3: Agent Fleet Status Banner ── */}
      <div className="glass rounded-xl p-4 border border-[#21262D]">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#21262D]">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-[#BF5AF2]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Multi-Agent Fleet Status</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20">
              {FLEET_AGENTS.filter((a) => a.status === 'active').length} / {FLEET_AGENTS.length} Active
            </span>
          </div>
          <span className="text-[11px] text-[#8B949E]">Avg Latency: <strong className="text-white font-mono">140ms</strong></span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {FLEET_AGENTS.map((agent) => (
            <div
              key={agent.name}
              className="p-2.5 rounded-lg bg-[#161B22]/60 border border-[#21262D] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="w-2 h-2 rounded-full" style={{ background: agent.color, boxShadow: `0 0 8px ${agent.color}` }} />
                <span className="text-[9px] font-semibold uppercase text-[#8B949E]">{agent.status}</span>
              </div>
              <p className="text-xs font-bold text-white truncate">{agent.name.replace('Agent', '')}</p>
              <p className="text-[10px] text-[#484F58] mt-0.5 truncate">{agent.role}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

function LiveAlertsCard({ alerts }) {
  return (
    <div className="glass rounded-xl border border-[#21262D] overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#21262D] bg-[#161B22]/50">
        <div className="flex items-center gap-2">
          <AlertTriangle size={15} className="text-[#FF3B30]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Live Intel Alerts</h3>
        </div>
        <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-ping" />
      </div>

      <div className="divide-y divide-[#21262D]/60 flex-1 overflow-y-auto max-h-[360px]">
        {alerts.map((a) => (
          <div key={a.id} className="p-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-1">
              <span
                className="text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase"
                style={{ background: `${a.badgeColor}15`, color: a.badgeColor, border: `1px solid ${a.badgeColor}30` }}
              >
                {a.level}
              </span>
              <span className="text-[10px] text-[#484F58] flex items-center gap-1">
                <Clock size={10} /> {a.time}
              </span>
            </div>
            <p className="text-xs font-semibold text-white leading-snug">{a.title}</p>
            <p className="text-[11px] text-[#8B949E] mt-1">{a.district}</p>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-[#21262D] bg-[#161B22]/30">
        <button className="text-xs font-semibold text-[#00F0FF] hover:underline flex items-center gap-1">
          View All Live Alerts <ChevronRight size={12} />
        </button>
      </div>
    </div>
  )
}
