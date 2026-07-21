import React from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Activity,
  FileText,
  UserCheck,
  Zap,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Compass,
  Cpu
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// Mock Data matching the DB and AI Guide metrics
const statsData = [
  { label: 'Total FIR Cases', value: '12', icon: Briefcase, color: 'text-indigo-400', bg: 'bg-indigo-950/25', border: 'border-indigo-950' },
  { label: 'Under Investigation', value: '8', icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-950/25', border: 'border-amber-900/60' },
  { label: 'Solved Cases', value: '4', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-950/25', border: 'border-emerald-900/60' },
]

const crimeTrendData = [
  { month: 'Feb', Burglary: 2, Theft: 4, Assault: 1 },
  { month: 'Mar', Burglary: 3, Theft: 5, Assault: 2 },
  { month: 'Apr', Burglary: 1, Theft: 6, Assault: 3 },
  { month: 'May', Burglary: 4, Theft: 3, Assault: 2 },
  { month: 'Jun', Burglary: 5, Theft: 8, Assault: 4 },
  { month: 'Jul', Burglary: 6, Theft: 9, Assault: 5 },
]

const recentCases = [
  { id: 'FIR-123', type: 'THEFT', date: '2026-07-14', location: 'Koramangala, Blr', status: 'PENDING' },
  { id: 'FIR-124', type: 'ASSAULT', date: '2026-07-13', location: 'Indiranagar, Blr', status: 'INVESTIGATING' },
  { id: 'FIR-125', type: 'BURGLARY', date: '2026-07-11', location: 'Whitefield, Blr', status: 'SOLVED' },
  { id: 'FIR-126', type: 'CYBER_FRAUD', date: '2026-07-10', location: 'HSR Layout, Blr', status: 'INVESTIGATING' },
]

const alertTicker = [
  { time: '14:24', message: 'Unassigned case reported (Urgent)', priority: 'HIGH' },
  { time: '13:05', message: 'Suspect John Doe linked to FIR-123', priority: 'MEDIUM' },
  { time: '11:42', message: 'Physical evidence logged: SHA-256 verified', priority: 'LOW' },
  { time: '09:15', message: 'FastAPI Agentic reasoning path triggered', priority: 'LOW' },
]

const aiInsights = [
  { id: 'INS-01', text: 'Accused John Doe shares a phone number linked to unresolved cases.', confidence: 'HIGH' },
  { id: 'INS-02', text: 'Spatial clustering indicates burglary surge in Koramangala block 4.', confidence: 'MEDIUM' },
]

const caseDistribution = [
  { name: 'Burglary', value: 5, color: '#3b82f6' },
  { name: 'Theft', value: 9, color: '#059669' },
  { name: 'Assault', value: 4, color: '#d97706' },
  { name: 'Cybercrime', value: 3, color: '#b91c1c' },
]

export const DashboardPage = () => {
  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner & Quick Action Grid */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-vigilx-primary" />
            VIGILX CRIME INTELLIGENCE HUB
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Operational Overview & Telemetry Matrix (Update frequency: 5s)
          </p>
        </div>

        {/* Quick Action Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full xl:w-auto">
          <Link
            to="/cases"
            className="flex items-center justify-center gap-2 bg-indigo-950/20 border border-vigilx-borderActive hover:bg-indigo-950/45 py-2 px-4 rounded-sm text-xs font-semibold text-indigo-300 transition-colors text-center"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>CASE RECORD</span>
          </Link>
          <Link
            to="/accused"
            className="flex items-center justify-center gap-2 bg-[#111622] border border-vigilx-borderMuted hover:border-indigo-900/60 py-2 px-4 rounded-sm text-xs font-semibold text-slate-300 hover:text-white transition-colors text-center"
          >
            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>SEARCH SUSPECT</span>
          </Link>
          <Link
            to="/ai"
            className="flex items-center justify-center gap-2 bg-emerald-950/20 border border-[#0d3625] hover:bg-emerald-950/40 py-2 px-4 rounded-sm text-xs font-semibold text-emerald-400 transition-colors text-center"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>ASK VIGILX AI</span>
          </Link>
          <button
            onClick={() => alert('Feature flag: Dispatch Protocol Active')}
            className="flex items-center justify-center gap-2 bg-red-950/20 border border-[#4c1d1d] hover:bg-red-950/40 py-2 px-4 rounded-sm text-xs font-semibold text-red-400 transition-colors text-center cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>DISPATCH protocol</span>
          </button>
        </div>
      </div>

      {/* 2. Stats Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsData.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div
              key={i}
              className={`p-4 bg-vigilx-card border ${stat.border} rounded-sm flex items-center justify-between shadow-lg`}
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  {stat.label}
                </span>
                <div className="text-2xl font-bold font-mono text-white">
                  {stat.value}
                </div>
              </div>
              <div className={`p-3 rounded-sm ${stat.bg} ${stat.color} border border-vigilx-borderMuted`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          )
        })}
      </div>

      {/* 3. Main Data Grids - Column split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 columns - Charts and Cases */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Crime Trends Chart */}
          <div className="bg-vigilx-card border border-vigilx-borderMuted rounded-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-vigilx-primary" />
                Crime Trends Distribution
              </h2>
              <span className="text-[10px] text-slate-500 font-mono">Monthly telemetry</span>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={crimeTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTheft" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBurglary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c2333" />
                  <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111622', borderColor: '#1c2333', color: '#f8fafc' }}
                    labelStyle={{ fontFamily: 'monospace', fontSize: 11 }}
                    itemStyle={{ fontSize: 11 }}
                  />
                  <Area type="monotone" dataKey="Theft" stroke="#059669" fillOpacity={1} fill="url(#colorTheft)" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="Burglary" stroke="#3b82f6" fillOpacity={1} fill="url(#colorBurglary)" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent FIR Case Records Grid */}
          <div className="bg-vigilx-card border border-vigilx-borderMuted rounded-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2">
                <FileText className="w-4 h-4 text-vigilx-primary" />
                Recent FIR Registry Entries
              </h2>
              <Link to="/cases" className="text-[10px] text-vigilx-primary hover:underline font-mono">
                View All Cases →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-vigilx-borderMuted text-slate-400 font-semibold bg-[#0d121c]/40 font-mono">
                    <th className="py-2.5 px-3">CASE ID</th>
                    <th className="py-2.5 px-3">CRIME TYPE</th>
                    <th className="py-2.5 px-3">INCIDENT LOCATION</th>
                    <th className="py-2.5 px-3">INCIDENT DATE</th>
                    <th className="py-2.5 px-3 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-vigilx-borderMuted font-mono">
                  {recentCases.map((c) => (
                    <tr key={c.id} className="hover:bg-[#151c2b]/30 transition-colors">
                      <td className="py-2.5 px-3 text-indigo-400 font-semibold">{c.id}</td>
                      <td className="py-2.5 px-3 text-slate-200">{c.type}</td>
                      <td className="py-2.5 px-3 text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {c.location}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">{c.date}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`px-2 py-0.5 text-[9px] rounded-sm font-semibold border ${
                          c.status === 'SOLVED'
                            ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/60'
                            : c.status === 'INVESTIGATING'
                            ? 'bg-amber-950/30 text-amber-400 border-amber-900/60'
                            : 'bg-red-950/30 text-red-400 border-red-900/60'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Heatmap Canvas Placeholder */}
          <div className="bg-vigilx-card border border-vigilx-borderMuted rounded-sm p-4">
            <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2 mb-4">
              <Compass className="w-4 h-4 text-vigilx-primary" />
              Geo-Intelligence Hotspots (Mock Grid)
            </h2>
            <div className="h-44 bg-[#080b11] border border-vigilx-borderMuted rounded-sm relative overflow-hidden flex items-center justify-center">
              {/* Mock Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none opacity-20">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="border border-indigo-500" />
                ))}
              </div>
              
              {/* Radar Sweeper Visual Effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-indigo-500/20 rounded-full animate-ping pointer-events-none" />

              {/* Mock Hotspots */}
              <div className="absolute top-1/3 left-1/4 flex flex-col items-center">
                <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse border border-white" />
                <span className="text-[9px] font-mono text-red-400 mt-1 bg-black/60 px-1 py-0.5 rounded">Sector Alpha (Theft)</span>
              </div>

              <div className="absolute top-2/3 right-1/3 flex flex-col items-center">
                <span className="w-3 h-3 bg-amber-500 rounded-full animate-pulse border border-white" />
                <span className="text-[9px] font-mono text-amber-400 mt-1 bg-black/60 px-1 py-0.5 rounded">Sector Gamma (Burglary)</span>
              </div>

              <span className="text-[10px] font-mono text-slate-500 z-10 uppercase tracking-widest">
                Leaflet/Mapbox Geospatial Overlay Offline (Placeholder Layer)
              </span>
            </div>
          </div>

        </div>

        {/* Right 1 column - Alerts, AI and Doughnut */}
        <div className="space-y-6">

          {/* Real-time Alert Ticker */}
          <div className="bg-vigilx-card border border-vigilx-borderMuted rounded-sm p-4 flex flex-col h-64 justify-between">
            <div>
              <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-vigilx-danger" />
                Real-Time Alert Feed
              </h2>
              <div className="space-y-3 overflow-y-auto pr-1">
                {alertTicker.map((alert, i) => (
                  <div key={i} className="flex gap-2 text-xs items-start font-mono border-b border-vigilx-borderMuted/30 pb-2">
                    <span className="text-slate-500 text-[10px] shrink-0 mt-0.5">{alert.time}</span>
                    <div className="flex-1">
                      <p className="text-slate-300 leading-tight text-[11px]">{alert.message}</p>
                      <span className={`text-[8px] px-1 font-semibold rounded ${
                        alert.priority === 'HIGH' ? 'bg-red-950/40 text-red-400 border border-red-900/60' :
                        alert.priority === 'MEDIUM' ? 'bg-amber-950/40 text-amber-400 border border-amber-900/60' :
                        'bg-indigo-950/40 text-indigo-400 border border-indigo-900/60'
                      }`}>
                        {alert.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-[9px] text-center text-slate-500 font-mono pt-2 border-t border-vigilx-borderMuted">
              Connected via secure webhook feed
            </div>
          </div>

          {/* Case Distribution Doughnut */}
          <div className="bg-vigilx-card border border-vigilx-borderMuted rounded-sm p-4">
            <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-vigilx-primary" />
              Crime Distribution
            </h2>
            <div className="h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={caseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {caseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111622', borderColor: '#1c2333', color: '#f8fafc' }}
                    itemStyle={{ fontSize: 10 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1.5 text-[10px] font-mono shrink-0 pl-2">
                {caseDistribution.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-400">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent AI Insights Feed */}
          <div className="bg-indigo-950/10 border border-[#312e81]/60 rounded-sm p-4 relative overflow-hidden backdrop-blur-sm shadow-[0_0_15px_rgba(49,46,129,0.15)]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
            <h2 className="text-xs font-bold tracking-widest text-white uppercase flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-indigo-400 animate-pulse" />
              Agentic AI Insight Queue
            </h2>
            
            <div className="space-y-3">
              {aiInsights.map((insight) => (
                <div key={insight.id} className="p-2.5 bg-[#0e121d] border border-vigilx-borderMuted rounded-sm space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold font-mono text-indigo-400">{insight.id}</span>
                    <span className="text-[8px] font-mono bg-indigo-950 text-indigo-300 px-1 border border-indigo-900 rounded-sm">
                      CONF: {insight.confidence}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed font-sans">{insight.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-3.5 pt-2 border-t border-indigo-950 flex justify-between items-center">
              <span className="text-[9px] font-mono text-slate-500">FastAPI Orchestrator</span>
              <Link to="/ai" className="text-[10px] text-indigo-300 font-semibold hover:underline flex items-center gap-1">
                Open AI Hub →
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
