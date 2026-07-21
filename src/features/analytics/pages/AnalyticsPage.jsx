import React from 'react'
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Shield,
  Clock,
  Activity,
  ArrowUpRight
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'

const crimeCategoryData = [
  { name: 'Larceny / Theft', count: 42, color: '#3b82f6' },
  { name: 'Burglary', count: 28, color: '#059669' },
  { name: 'Cyber Fraud', count: 19, color: '#d97706' },
  { name: 'Aggravated Assault', count: 14, color: '#b91c1c' },
  { name: 'Vehicle Homicide', count: 6, color: '#8b5cf6' },
]

const monthlyResolutionData = [
  { month: 'Jan', reported: 24, solved: 18 },
  { month: 'Feb', reported: 30, solved: 22 },
  { month: 'Mar', reported: 28, solved: 25 },
  { month: 'Apr', reported: 36, solved: 30 },
  { month: 'May', reported: 40, solved: 32 },
  { month: 'Jun', reported: 48, solved: 41 },
  { month: 'Jul', reported: 52, solved: 45 },
]

export const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-vigilx-primary" />
            CRIME ANALYTICS & STATISTICAL INDICATORS
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Aggregated Telemetry Engine & Crime Rate Trends (2026 Q2 Report)
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="bg-[#111622] border border-vigilx-borderMuted px-3 py-1.5 rounded-sm text-slate-300">
            Region: Bengaluru Urban
          </span>
          <span className="bg-indigo-950 text-indigo-300 border border-indigo-900 px-3 py-1.5 rounded-sm font-bold">
            Analytics Engine: Active
          </span>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-vigilx-card border border-vigilx-borderMuted p-4 rounded-sm space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Total Logged Incidents</span>
          <div className="text-2xl font-bold font-mono text-white flex items-center justify-between">
            <span>109</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[9px] font-mono text-emerald-400">+12% vs last quarter</span>
        </div>

        <div className="bg-vigilx-card border border-vigilx-borderMuted p-4 rounded-sm space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Case Clearance Rate</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">86.5%</div>
          <span className="text-[9px] font-mono text-slate-500">Benchmark: 80% minimum</span>
        </div>

        <div className="bg-vigilx-card border border-vigilx-borderMuted p-4 rounded-sm space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Average Response Velocity</span>
          <div className="text-2xl font-bold font-mono text-indigo-400">14.2 Mins</div>
          <span className="text-[9px] font-mono text-indigo-400">-2.1 mins faster</span>
        </div>

        <div className="bg-vigilx-card border border-vigilx-borderMuted p-4 rounded-sm space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Active Hotspot Sectors</span>
          <div className="text-2xl font-bold font-mono text-amber-400">3 Sectors</div>
          <span className="text-[9px] font-mono text-amber-400">Koramangala, HSR, Indiranagar</span>
        </div>
      </div>

      {/* 3. Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Resolution Performance */}
        <div className="bg-vigilx-card border border-vigilx-borderMuted rounded-sm p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold tracking-widest text-slate-300 uppercase font-mono flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-vigilx-primary" />
              Reported vs Solved Case Velocity
            </h2>
            <span className="text-[10px] font-mono text-slate-500">2026 Monthly Breakdown</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyResolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2333" />
                <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111622', borderColor: '#1c2333', color: '#f8fafc' }}
                  itemStyle={{ fontSize: 11 }}
                />
                <Bar dataKey="reported" fill="#3b82f6" radius={[2, 2, 0, 0]} name="Reported Cases" />
                <Bar dataKey="solved" fill="#059669" radius={[2, 2, 0, 0]} name="Solved Cases" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crime Category Breakdown */}
        <div className="bg-vigilx-card border border-vigilx-borderMuted rounded-sm p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold tracking-widest text-slate-300 uppercase font-mono flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-400" />
              Incidents by Crime Category
            </h2>
            <span className="text-[10px] font-mono text-slate-500">Distribution Percentage</span>
          </div>

          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={crimeCategoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="count"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {crimeCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#111622', borderColor: '#1c2333', color: '#f8fafc' }}
                  itemStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  )
}
