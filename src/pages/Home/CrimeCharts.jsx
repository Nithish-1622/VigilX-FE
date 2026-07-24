import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts'
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react'

const MOCK_BAR = [
  { district: 'North', crimes: 142, resolved: 98 },
  { district: 'South', crimes: 87, resolved: 61 },
  { district: 'East', crimes: 203, resolved: 140 },
  { district: 'West', crimes: 119, resolved: 89 },
  { district: 'Central', crimes: 178, resolved: 115 },
  { district: 'Harbor', crimes: 64, resolved: 50 },
]

const MOCK_LINE = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  violent: Math.floor(Math.random() * 30 + 10),
  property: Math.floor(Math.random() * 50 + 20),
  cyber: Math.floor(Math.random() * 15 + 5),
}))

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-heavy rounded-lg p-3 text-xs">
      <p className="text-text-secondary mb-2 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="flex items-center gap-1">
          <span className="font-semibold">{p.name}:</span> {p.value}
        </p>
      ))}
    </div>
  )
}

export default function CrimeCharts() {
  const [tab, setTab] = useState('bar')

  return (
    <div className="glass" style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid rgba(33,38,45,1)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <BarChart2 size={15} style={{ color:'#00F0FF' }} />
          <h2 style={{ fontSize:13, fontWeight:600, color:'#fff', margin:0 }}>Crime Analytics</h2>
        </div>
        <div style={{ display:'flex', gap:3, padding:3, borderRadius:8, background:'rgba(13,17,23,0.6)', border:'1px solid rgba(33,38,45,1)' }}>
          {['bar', 'trend'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding:'4px 10px', borderRadius:6, fontSize:11, fontWeight:500,
                background: tab===t ? 'rgba(0,240,255,0.15)' : 'transparent',
                color: tab===t ? '#00F0FF' : 'var(--text-secondary)',
                border: tab===t ? '1px solid rgba(0,240,255,0.2)' : '1px solid transparent',
                cursor:'pointer', transition:'all 0.2s',
              }}
            >
              {t === 'bar' ? 'By District' : '30-Day Trend'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:'14px 16px' }}>
        {tab === 'bar' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="bar">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={MOCK_BAR} barGap={4}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="district" tick={{ fontSize: 11, fill: '#8B949E' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#8B949E' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                  formatter={(val) => <span style={{ color: '#8B949E' }}>{val}</span>}
                />
                <Bar dataKey="crimes" name="Total Crimes" fill="#FF3B30" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
                <Bar dataKey="resolved" name="Resolved" fill="#00F0FF" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="line">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={MOCK_LINE}>
                <defs>
                  <linearGradient id="violentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3B30" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#FF3B30" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="propertyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="cyberGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#BF5AF2" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#BF5AF2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#8B949E' }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fontSize: 11, fill: '#8B949E' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} formatter={(v) => <span style={{ color: '#8B949E' }}>{v}</span>} />
                <Area type="monotone" dataKey="violent" name="Violent" stroke="#FF3B30" strokeWidth={2} fill="url(#violentGrad)" dot={false} />
                <Area type="monotone" dataKey="property" name="Property" stroke="#00F0FF" strokeWidth={2} fill="url(#propertyGrad)" dot={false} />
                <Area type="monotone" dataKey="cyber" name="Cyber" stroke="#BF5AF2" strokeWidth={2} fill="url(#cyberGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Quick stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginTop:12 }}>
          {[
            { label: 'Total Incidents', val: '793',    delta: '+12%', up: true  },
            { label: 'Resolution Rate', val: '67.4%',  delta: '+3.2%',up: true  },
            { label: 'Avg Response',    val: '8.4 min', delta: '-1.2m', up: false },
          ].map((s) => (
            <div
              key={s.label}
              style={{ borderRadius:8, padding:'10px 12px', background:'rgba(13,17,23,0.5)', border:'1px solid rgba(33,38,45,1)' }}
            >
              <p style={{ fontSize:9, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)', marginBottom:4 }}>{s.label}</p>
              <p style={{ fontSize:17, fontWeight:800, color:'#fff', lineHeight:1 }}>{s.val}</p>
              <p style={{ fontSize:10, display:'flex', alignItems:'center', gap:3, marginTop:3, color: s.up ? '#30D158' : '#FF3B30' }}>
                {s.up ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                {s.delta}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
