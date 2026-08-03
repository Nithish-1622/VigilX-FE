import {
  ResponsiveContainer, AreaChart, Area, ComposedChart, Line, Bar, BarChart,
  XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LabelList
} from 'recharts'
import { ChevronDown, ArrowUp, Activity, Crosshair, Clock, BarChart2, Shield, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react'

const WEEKLY = [
  { day: 'MON', narcotics: 24, assault: 15, gang: 10, theft: 6, total: 55 },
  { day: 'TUE', narcotics: 20, assault: 14, gang: 9, theft: 5, total: 48 },
  { day: 'WED', narcotics: 26, assault: 18, gang: 11, theft: 7, total: 62 },
  { day: 'THU', narcotics: 22, assault: 16, gang: 10, theft: 6, total: 54 },
  { day: 'FRI', narcotics: 28, assault: 20, gang: 14, theft: 10, total: 72 },
  { day: 'SAT', narcotics: 32, assault: 23, gang: 16, theft: 12, total: 83 },
  { day: 'SUN', narcotics: 27, assault: 21, gang: 13, theft: 11, total: 72 },
]

const MONTHLY = [
  { month: 'JAN', resolved: 42, open: 14, rate: 80, total: 56 },
  { month: 'FEB', resolved: 38, open: 16, rate: 77, total: 54 },
  { month: 'MAR', resolved: 41, open: 12, rate: 77, total: 53 },
  { month: 'APR', resolved: 52, open: 10, rate: 84, total: 62 },
  { month: 'MAY', resolved: 46, open: 13, rate: 78, total: 59 },
  { month: 'JUN', resolved: 58, open: 11, rate: 83, total: 69 },
  { month: 'JUL', resolved: 55, open: 12, rate: 81, total: 67 },
]

const INCIDENT_BREAKDOWN = [
  { name: 'Narcotics', value: 27, color: '#06B6D4', percentage: '21.1%' },
  { name: 'Assault', value: 23, color: '#F43F5E', percentage: '18.0%' },
  { name: 'Gang', value: 16, color: '#F59E0B', percentage: '12.5%' },
  { name: 'Theft', value: 11, color: '#A855F7', percentage: '8.6%' },
]

const PEAK_HOURS = [
  { hour: '13:00', theft: 5, gang: 0, assault: 0, narcotics: 0, angle: 195 },
  { hour: '14:00', theft: 10, gang: 10, assault: 0, narcotics: 0, angle: 210 },
  { hour: '15:00', theft: 15, gang: 0, assault: 0, narcotics: 0, angle: 225 },
  { hour: '16:00', theft: 10, gang: 15, assault: 0, narcotics: 0, angle: 240 },
  { hour: '17:00', theft: 15, gang: 10, assault: 10, narcotics: 0, angle: 255 },
  { hour: '18:00', theft: 10, gang: 15, assault: 20, narcotics: 10, angle: 270 },
  { hour: '19:00', theft: 15, gang: 10, assault: 20, narcotics: 35, angle: 285 },
  { hour: '20:00', theft: 20, gang: 10, assault: 25, narcotics: 45, angle: 300 },
]

const SERIES = [
  { key: 'narcotics', color: '#06B6D4', label: 'Narcotics' },
  { key: 'assault', color: '#F43F5E', label: 'Assault' },
  { key: 'gang', color: '#F59E0B', label: 'Gang' },
  { key: 'theft', color: '#A855F7', label: 'Theft' },
]

const monoStyle = { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.04em' }

function MonoAxisTick({ x, y, payload }) {
  return (
    <text x={x} y={y + 16} textAnchor="middle" style={monoStyle} fill="var(--text-tertiary)">
      {payload.value}
    </text>
  )
}

function MonoYTick({ x, y, payload }) {
  return (
    <text x={x - 12} y={y + 4} textAnchor="end" style={monoStyle} fill="var(--text-tertiary)">
      {payload.value}
    </text>
  )
}

function MonoYTickRight({ x, y, payload }) {
  return (
    <text x={x + 12} y={y + 4} textAnchor="start" style={monoStyle} fill="var(--text-tertiary)">
      {payload.value}%
    </text>
  )
}

const AreaDot = (props) => {
  const { cx, cy, customColor } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={4} fill="var(--bg-panel)" stroke={customColor} strokeWidth={2} />
    </g>
  )
}

const LollipopBar = (props) => {
  const { x, y, width, height, payload } = props;
  const cx = x + width / 2;
  const topY = y;
  const bottomY = y + height;

  return (
    <g>
      {/* Connecting line */}
      <line x1={cx} y1={topY} x2={cx} y2={bottomY} stroke="var(--border-dim)" strokeWidth={2} />

      {/* Open (Bottom) */}
      <circle cx={cx} cy={bottomY} r={8} fill="rgba(244, 63, 94, 0.25)" />
      <circle cx={cx} cy={bottomY} r={4} fill="#F43F5E" />
      <text x={cx} y={bottomY + 22} textAnchor="middle" fill="#F43F5E" fontSize={11} fontWeight={600} fontFamily="var(--mono)">{payload.open}</text>

      {/* Resolved (Top) */}
      <circle cx={cx} cy={topY} r={8} fill="rgba(34, 197, 94, 0.25)" />
      <circle cx={cx} cy={topY} r={4} fill="#22C55E" />
      <text x={cx} y={topY - 14} textAnchor="middle" fill="#22C55E" fontSize={11} fontWeight={600} fontFamily="var(--mono)">{payload.resolved}</text>
    </g>
  )
}

const CustomRateDot = (props) => {
  const { cx, cy, payload } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={4} fill="#3B82F6" />
      <circle cx={cx} cy={cy} r={2} fill="var(--bg-panel)" />
    </g>
  )
}

const GRID_STYLE = { stroke: 'var(--border-dim)', strokeDasharray: '4 4', opacity: 0.6 }

// Tiny sparkline component for the cards
const Sparkline = ({ color, data }) => (
  <svg width="60" height="20" viewBox="0 0 60 20">
    <path d={`M 0,${20 - data[0]} L 15,${20 - data[1]} L 30,${20 - data[2]} L 45,${20 - data[3]} L 60,${20 - data[4]}`} fill="none" stroke={color} strokeWidth="1.5" />
    <circle cx="60" cy={20 - data[4]} r="2" fill={color} />
  </svg>
)

function PeakPatternChart() {
  const cx = 200;
  const cy = 200;
  const baseR = 60;
  const scale = 1.0;
  const barWidth = 16;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="100%" height="100%" viewBox="10 10 380 380" preserveAspectRatio="xMidYMid meet">
        {/* Background Circles */}
        {[60, 95, 130, 165].map((r, i) => (
          <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="var(--border-dim)" strokeDasharray={i > 0 ? "6 6" : "none"} strokeWidth={1.5} opacity={0.5} />
        ))}

        {/* Axis Labels */}
        <text x={cx} y={cy - 180} textAnchor="middle" fill="var(--text-tertiary)" fontSize={13} fontFamily="var(--mono)">00:00</text>
        <text x={cx + 180} y={cy + 5} textAnchor="start" fill="var(--text-tertiary)" fontSize={13} fontFamily="var(--mono)">06:00</text>
        <text x={cx} y={cy + 190} textAnchor="middle" fill="var(--text-tertiary)" fontSize={13} fontFamily="var(--mono)">12:00</text>
        <text x={cx - 180} y={cy + 5} textAnchor="end" fill="var(--text-tertiary)" fontSize={13} fontFamily="var(--mono)">18:00</text>

        {/* Center Text */}
        <g transform={`translate(${cx}, ${cy})`}>
          <circle cx={0} cy={-14} r={18} fill="transparent" stroke="var(--text-secondary)" strokeWidth={2} />
          <path d="M0 -22 L0 -14 L5 -14" fill="none" stroke="var(--text-secondary)" strokeWidth={2} />
          <text x={0} y={22} textAnchor="middle" fill="var(--text-secondary)" fontSize={12} fontWeight={600} letterSpacing="0.05em">PEAK HOUR</text>
        </g>

        {/* Bars */}
        {PEAK_HOURS.map(d => {
          let currentR = baseR;
          return (
            <g key={d.hour} transform={`rotate(${d.angle}, ${cx}, ${cy})`}>
              {[
                { key: 'theft', color: '#A855F7', val: d.theft },
                { key: 'gang', color: '#F59E0B', val: d.gang },
                { key: 'assault', color: '#F43F5E', val: d.assault },
                { key: 'narcotics', color: '#06B6D4', val: d.narcotics }
              ].map(cat => {
                const h = cat.val * scale;
                const rect = (
                  <rect
                    key={cat.key}
                    x={cx - barWidth / 2}
                    y={cy - currentR - h}
                    width={barWidth}
                    height={h}
                    fill={cat.color}
                    rx={2}
                  />
                );
                currentR += h;
                return rect;
              })}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function CrimeCharts() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%', paddingBottom: 16 }}>

      {/* TOP PANEL: INCIDENT FREQUENCY */}
      <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-dim)', borderRadius: 12, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--border-dim)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} color="#A855F7" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>INCIDENT FREQUENCY</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 2 }}>7-DAY OVERVIEW BY TYPE</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--bg-row)', borderRadius: 6, border: '1px solid var(--border-dim)', cursor: 'pointer' }}>
            <i className="fa fa-calendar" style={{ fontSize: 12, color: 'var(--text-tertiary)' }}></i>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Last 7 Days</span>
            <ChevronDown size={14} color="var(--text-tertiary)" />
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', height: 520 }}>
          {/* Left Panel: Donut & Legend */}
          <div style={{ width: 280, flexShrink: 0, padding: 24, paddingRight: 40, borderRight: 'none', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 180, position: 'relative', marginBottom: 24 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={INCIDENT_BREAKDOWN} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={4} stroke="none" dataKey="value">
                    {INCIDENT_BREAKDOWN.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>128</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>Total Incidents</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#22C55E', fontSize: 11, fontWeight: 600, marginTop: 8 }}>
                  <ArrowUp size={12} strokeWidth={3} />
                  <span>14.6%</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>vs last 7 days</div>
              </div>
            </div>

            {/* Legend List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {INCIDENT_BREAKDOWN.map(item => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', width: 24, textAlign: 'right' }}>{item.value}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-tertiary)', width: 40, textAlign: 'right', fontFamily: 'var(--mono)' }}>{item.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Summary Cards + Area Chart */}
          <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column' }}>
            {/* Summary Cards */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'PEAK DAY', value: 'Saturday', sub: '32 incidents', icon: Activity, color: '#06B6D4' },
                { label: 'HIGHEST TYPE', value: 'Narcotics', sub: '27 incidents', icon: Crosshair, color: '#F43F5E' },
                { label: 'PEAK HOUR', value: '18:00 - 20:00', sub: 'Most active', icon: Clock, color: '#F59E0B' },
                { label: 'TREND', value: 'Increasing', sub: 'since Thursday', icon: BarChart2, color: '#A855F7' },
              ].map(card => (
                <div key={card.label} style={{ flex: 1, background: 'var(--bg-row)', border: 'none', borderRadius: 8, padding: '16px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: `rgba(${parseInt(card.color.slice(1, 3), 16)}, ${parseInt(card.color.slice(3, 5), 16)}, ${parseInt(card.color.slice(5, 7), 16)}, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <card.icon size={20} color={card.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: card.color, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 2 }}>{card.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{card.value}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{card.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Split Charts Container */}
            <div style={{ display: 'flex', gap: 24, flex: 1, minHeight: 0 }}>

              {/* Left Column: Bar Chart */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.05em', marginBottom: 16 }}>
                  INCIDENTS BY DAY AND TYPE
                </div>

                <div style={{ flex: 1, minHeight: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={WEEKLY} margin={{ top: 35, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid vertical={false} {...GRID_STYLE} />
                      <XAxis dataKey="day" tick={<MonoAxisTick />} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tick={<MonoYTick />} axisLine={false} tickLine={false} domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} />
                      <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-dim)' }} />

                      <Bar dataKey="theft" stackId="a" fill="#A855F7" isAnimationActive={false} barSize={20} />
                      <Bar dataKey="gang" stackId="a" fill="#F59E0B" isAnimationActive={false} />
                      <Bar dataKey="assault" stackId="a" fill="#F43F5E" isAnimationActive={false} />
                      <Bar dataKey="narcotics" stackId="a" fill="#06B6D4" isAnimationActive={false} radius={[4, 4, 0, 0]}>
                        <LabelList dataKey="total" position="top" offset={10} fill="var(--text-primary)" fontSize={12} fontWeight={700} fontFamily="var(--mono)" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Chart Legend */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
                  {SERIES.map(s => (
                    <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Radial Chart */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, paddingLeft: 24, borderLeft: '1px solid var(--border-dim)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.05em', marginBottom: 16 }}>
                  INCIDENTS BY HOUR (PEAK PATTERN)
                </div>
                <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                    <PeakPatternChart />
                  </div>
                </div>
                {/* Chart Legend */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
                  {SERIES.map(s => (
                    <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM PANEL: CASE RESOLUTION */}
      <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-dim)', borderRadius: 12, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--border-dim)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} color="#22C55E" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>CASE RESOLUTION</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 2 }}>7-MONTH OVERVIEW</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--bg-row)', borderRadius: 6, border: '1px solid var(--border-dim)', cursor: 'pointer' }}>
            <i className="fa fa-calendar" style={{ fontSize: 12, color: 'var(--text-tertiary)' }}></i>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Last 7 Months</span>
            <ChevronDown size={14} color="var(--text-tertiary)" />
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', height: 360 }}>
          {/* Left Panel: Gauge & Stats */}
          <div style={{ width: 380, flexShrink: 0, padding: 24, paddingRight: 40, borderRight: 'none', display: 'flex', flexDirection: 'column' }}>

            <div style={{ display: 'flex', gap: 24, flex: 1 }}>
              {/* Gauge */}
              <div style={{ width: 160, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    {/* Background track */}
                    <Pie data={[{ value: 1 }]} cx="50%" cy="50%" startAngle={220} endAngle={-40} innerRadius={60} outerRadius={75} fill="var(--bg-row)" stroke="none" />
                    {/* Value */}
                    <Pie data={[{ value: 78 }, { value: 22, fill: 'transparent' }]} cx="50%" cy="50%" startAngle={220} endAngle={-40} innerRadius={60} outerRadius={75} stroke="none" dataKey="value">
                      <Cell fill="#22C55E" />
                      <Cell fill="transparent" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', top: '20%', left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>78%</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6 }}>Resolution Rate</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#22C55E', fontSize: 11, fontWeight: 600, marginTop: 8 }}>
                    <ArrowUp size={12} strokeWidth={3} />
                    <span>12%</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>vs last 7 months</div>
                </div>
                <div style={{ position: 'absolute', bottom: '15%', left: 0, fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--mono)' }}>0%</div>
                <div style={{ position: 'absolute', bottom: '15%', right: 0, fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--mono)' }}>100%</div>
              </div>

              {/* Stat Cards */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center' }}>
                {/* Resolved Card */}
                <div style={{ background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.15)', borderRadius: 8, padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <CheckCircle2 size={16} color="#22C55E" />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>RESOLVED</span>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>546</div>
                  <div style={{ fontSize: 11, color: '#22C55E', marginBottom: 8 }}>78% of total</div>
                  <Sparkline color="#22C55E" data={[4, 8, 5, 12, 18]} />
                </div>

                {/* Open Card */}
                <div style={{ background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.15)', borderRadius: 8, padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <XCircle size={16} color="#F43F5E" />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>OPEN</span>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>154</div>
                  <div style={{ fontSize: 11, color: '#F43F5E', marginBottom: 8 }}>22% of total</div>
                  <Sparkline color="#F43F5E" data={[15, 10, 12, 6, 4]} />
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: 6, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <ArrowUp size={16} color="#22C55E" style={{ marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 12, color: '#22C55E', fontWeight: 500 }}>Resolution rate improved by 12%</div>
                <div style={{ fontSize: 11, color: 'rgba(34, 197, 94, 0.7)' }}>compared to previous 7 months</div>
              </div>
            </div>
          </div>

          {/* Right Panel: Lollipop Chart */}
          <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column' }}>
            {/* Chart Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
                RESOLUTION TREND OVER TIME
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E' }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Resolved</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F43F5E' }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Open</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="16" height="6" viewBox="0 0 16 6">
                    <path d="M0 3 Q 4 0, 8 3 T 16 3" fill="none" stroke="#3B82F6" strokeWidth="2" />
                  </svg>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Resolution Rate (%)</span>
                </div>
              </div>
            </div>

            {/* Main Composed Chart */}
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={MONTHLY} margin={{ top: 25, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} {...GRID_STYLE} />
                  <XAxis dataKey="month" tick={<MonoAxisTick />} axisLine={false} tickLine={false} dy={10} />
                  <YAxis yAxisId="left" tick={<MonoYTick />} axisLine={false} tickLine={false} domain={[0, 120]} ticks={[0, 30, 60, 90, 120]} />
                  <YAxis yAxisId="right" orientation="right" tick={<MonoYTickRight />} axisLine={false} tickLine={false} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-dim)' }} />

                  <Bar yAxisId="left" dataKey="open" stackId="a" fill="#F43F5E" isAnimationActive={false} barSize={24}>
                    <LabelList dataKey="open" position="center" fill="#fff" fontSize={11} fontWeight={600} fontFamily="var(--mono)" />
                  </Bar>
                  <Bar yAxisId="left" dataKey="resolved" stackId="a" fill="#22C55E" isAnimationActive={false} radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="resolved" position="center" fill="#fff" fontSize={11} fontWeight={600} fontFamily="var(--mono)" />
                  </Bar>

                  {/* The Rate Line */}
                  <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#3B82F6" strokeWidth={2} dot={<CustomRateDot />} isAnimationActive={false}>
                    <LabelList dataKey="rate" position="top" offset={10} fill="#3B82F6" fontSize={11} fontWeight={600} fontFamily="var(--mono)" formatter={(val) => `${val}%`} />
                  </Line>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
