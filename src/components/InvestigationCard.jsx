import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'

function ConfBar({ value, color }) {
  return (
    <div className="conf-bar-track" style={{ width: 72 }}>
      <div className="conf-bar-fill" style={{ width: `${value * 100}%`, background: color }} />
    </div>
  )
}

function confColor(v) {
  return v >= 0.85 ? '#16A34A' : v >= 0.65 ? '#D97706' : '#E53E3E'
}

export default function InvestigationCard({ data }) {
  const [showTrace, setShowTrace] = useState(false)
  const pct = Math.round((data.confidence || 0.88) * 100)
  const cc  = confColor(data.confidence || 0.88)

  return (
    <div style={{ width: '100%', maxWidth: 680, background: 'var(--bg-panel)', border: '1px solid var(--border-base)', borderRadius: 4, overflow: 'hidden' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 12px', background: 'var(--bg-row)', borderBottom: '1px solid var(--border-dim)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={11} style={{ color: 'var(--cyan)' }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>INTELLIGENCE BRIEF</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-tertiary)' }}>
            {data.response_id || 'VX-0001'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="tag-red" style={{ fontSize: 9, letterSpacing: '0.06em' }}>HIGH THREAT</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: cc, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ConfBar value={data.confidence || 0.88} color={cc} />
            {pct}%
          </span>
        </div>
      </div>

      <div style={{ padding: '12px' }}>
        {/* Summary */}
        <div style={{ marginBottom: 12 }}>
          <p className="section-label" style={{ marginBottom: 5 }}>Executive Summary</p>
          <p style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.6 }}>{data.executive_summary}</p>
        </div>

        {/* Key findings table */}
        {data.key_findings?.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <p className="section-label" style={{ marginBottom: 6 }}>Key Findings</p>
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: '55%' }}>Finding</th>
                  <th>Confidence</th>
                  <th>Source Agents</th>
                </tr>
              </thead>
              <tbody>
                {data.key_findings.map((f, i) => {
                  const fc = confColor(f.confidence || 0.9)
                  return (
                    <tr key={i}>
                      <td style={{ color: 'var(--text-primary)', fontSize: 12, whiteSpace: 'normal', lineHeight: 1.4 }}>{f.finding}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <ConfBar value={f.confidence || 0.9} color={fc} />
                          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: fc }}>{Math.round((f.confidence || 0.9) * 100)}%</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                          {f.source_agents?.map(a => (
                            <span key={a} style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--purple)', background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)', padding: '1px 5px', borderRadius: 2 }}>{a.replace('Agent','')}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--border-dim)' }}>
          <button onClick={() => setShowTrace(!showTrace)} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--cyan)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--mono)' }}>
            {showTrace ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            {showTrace ? 'HIDE TRACE' : 'VIEW TRACE'}
          </button>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: data.critic_passed ? '#16A34A' : '#E53E3E' }}>
            {data.critic_passed ? '✓ CRITIC PASS' : '✗ CRITIC WARN'}
          </span>
        </div>

        <AnimatePresence>
          {showTrace && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} style={{ overflow: 'hidden' }}>
              <div style={{ marginTop: 10, padding: '10px 12px', background: 'var(--bg-canvas)', border: '1px solid var(--border-dim)', borderRadius: 3, fontFamily: 'var(--mono)', fontSize: 11, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                <p style={{ color: 'var(--purple)' }}>[Planning]   decomposed → 3 parallel tasks</p>
                <p>[SQL]        SELECT suspect_vehicles WHERE plate='ZX-7742-B' → 1 row</p>
                <p>[Graph]      Neo4j traversal → #CR-504, centrality: 0.942</p>
                <p>[Geo]        Cluster: Sector 4 (Harbor) — 3 zones</p>
                <p style={{ color: '#16A34A' }}>[Critic]     consistency score: 0.984 → PASS</p>
              </div>
              {data.recommendations?.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <p className="section-label" style={{ marginBottom: 5 }}>Recommended Actions</p>
                  {data.recommendations.map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 3 }}>
                      <TrendingUp size={10} style={{ color: '#16A34A', marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
