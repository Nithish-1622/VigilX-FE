import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Trash2, CheckCircle2, Loader2, Clock, TrendingUp,
  Shield, Zap, ChevronDown, ChevronUp, Brain
} from 'lucide-react'
import useChatStore from '../../store/useChatStore'

const PROMPT_SUGGESTIONS = [
  {
    category: 'Narcotics & Syndicates',
    query: 'Identify suspect networks and narcotics distribution hotspots in Harbor District linked to vehicle ZX-7742-B.',
    tag: 'Graph + Geo',
  },
  {
    category: 'Financial Intelligence',
    query: 'Trace financial laundering transactions exceeding $50k across accounts linked to Carlos R.',
    tag: 'SQL + RAG',
  },
  {
    category: 'Temporal Trajectory',
    query: 'Map the chronological timeline of incidents and phone calls for Case #4421 over Q3 2026.',
    tag: 'TimelineAgent',
  },
]

const STAGE_COLORS = {
  pending: { color: '#334155', bg: 'rgba(51,65,85,0.1)' },
  active:  { color: '#00D4FF', bg: 'rgba(0,212,255,0.08)' },
  done:    { color: '#22C55E', bg: 'rgba(34,197,94,0.07)' },
}

function PipelineViz({ pipeline }) {
  return (
    <div
      style={{
        padding: '10px 16px',
        background: 'var(--bg-tertiary)',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Loader2 size={11} style={{ color: 'var(--accent-cyan)', animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-cyan)', letterSpacing: '0.05em' }}>
            MULTI-AGENT EXECUTION
          </span>
        </div>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace' }}>#VX-8812</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
        {pipeline.map((stage, i) => {
          const sc = STAGE_COLORS[stage.status] || STAGE_COLORS.pending
          return (
            <div key={stage.name} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '3px 8px',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 500,
                  background: sc.bg,
                  border: `1px solid ${sc.color}30`,
                  color: sc.color,
                  transition: 'all 0.2s',
                }}
              >
                {stage.status === 'active' && <Loader2 size={9} style={{ animation: 'spin 1s linear infinite' }} />}
                {stage.status === 'done' && <CheckCircle2 size={9} />}
                {stage.status === 'pending' && <Clock size={9} />}
                {stage.name.replace('Agent', '')}
              </div>
              {i < pipeline.length - 1 && (
                <div style={{ width: 8, height: 1, background: 'var(--border-active)' }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function InvestigationCard({ data }) {
  const [expandedTrace, setExpandedTrace] = useState(false)
  const confPercent = Math.round((data.confidence || 0.94) * 100)
  const confColor = confPercent >= 85 ? '#22C55E' : confPercent >= 65 ? '#F59E0B' : '#F03E3E'

  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-active)',
        borderRadius: 10,
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Card Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-tertiary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Shield size={13} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
            INTELLIGENCE BRIEF
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: '2px 7px',
              borderRadius: 4,
              background: `${confColor}12`,
              border: `1px solid ${confColor}25`,
              color: confColor,
            }}
          >
            {confPercent}% confidence
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: 4,
              background: 'rgba(240,62,62,0.08)',
              border: '1px solid rgba(240,62,62,0.2)',
              color: '#F03E3E',
              letterSpacing: '0.06em',
            }}
          >
            HIGH THREAT
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '14px' }}>
        {/* Summary */}
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
            Executive Summary
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {data.executive_summary || 'Multi-agent analysis verified syndicate connections between primary suspect Carlos R. and regional distribution points in Harbor District.'}
          </p>
        </div>

        {/* Key Findings */}
        {data.key_findings?.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
              Key Findings
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {data.key_findings.map((f, i) => (
                <div
                  key={i}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 7,
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <p style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: 6 }}>
                    {f.finding}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                      {Math.round((f.confidence || 0.9) * 100)}% verified
                    </span>
                    {f.source_agents?.map((a) => (
                      <span key={a} className="tag-cyan" style={{ fontSize: 9 }}>{a}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 10,
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <button
            onClick={() => setExpandedTrace(!expandedTrace)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 11,
              color: 'var(--accent-cyan)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            {expandedTrace ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {expandedTrace ? 'Hide execution trace' : 'View execution trace'}
          </button>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 10,
              color: '#22C55E',
            }}
          >
            <CheckCircle2 size={11} /> Verified by CriticAgent
          </span>
        </div>

        {/* Expanded Trace */}
        <AnimatePresence>
          {expandedTrace && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ overflow: 'hidden' }}
            >
              <div
                style={{
                  marginTop: 12,
                  padding: '10px 12px',
                  borderRadius: 7,
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  fontFamily: 'monospace',
                  fontSize: 11,
                  lineHeight: 1.8,
                }}
              >
                <p style={{ color: 'var(--accent-cyan)' }}>[PlanningAgent] Decomposed into 3 parallel sub-tasks</p>
                <p style={{ color: 'var(--text-secondary)' }}>[SQLToolAgent] SELECT * FROM suspect_vehicles WHERE plate = 'ZX-7742-B' → 1 row</p>
                <p style={{ color: 'var(--text-secondary)' }}>[GraphAgent] Neo4j traversal → Node #CR-504, centrality: 0.942</p>
                <p style={{ color: 'var(--text-secondary)' }}>[GeoAgent] Cluster: Sector 4 (Harbor) — 3 active zones</p>
                <p style={{ color: '#22C55E' }}>[CriticAgent] Consistency validated (score: 0.984)</p>
              </div>
              {data.recommendations?.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                    Recommended Actions
                  </p>
                  {data.recommendations.map((rec, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 4 }}>
                      <TrendingUp size={11} style={{ color: '#22C55E', marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{rec}</span>
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

export default function ChatV2() {
  const { v2Messages, v2Loading, v2Pipeline, sendV2Message, clearV2 } = useChatStore()
  const [input, setInput] = useState('')
  const endRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [v2Messages, v2Loading, v2Pipeline])

  const send = () => {
    const q = input.trim()
    if (!q || v2Loading) return
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = '40px'
    sendV2Message(q)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const handleInput = (e) => {
    setInput(e.target.value)
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = '40px'
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 52px - 48px - 80px)',
        minHeight: 440,
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          height: 48,
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0,
          background: 'var(--bg-tertiary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: 'rgba(0,212,255,0.08)',
              border: '1px solid rgba(0,212,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Zap size={13} style={{ color: 'var(--accent-cyan)' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>VigilX CORE AI</span>
              <span className="tag-cyan">Multi-Agent V2</span>
            </div>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>
              Session #VX-8812 · 7 agents connected
            </p>
          </div>
        </div>

        <button
          onClick={clearV2}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 10px',
            borderRadius: 6,
            fontSize: 12,
            color: 'var(--text-secondary)',
            background: 'transparent',
            border: '1px solid var(--border-active)',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#F03E3E'
            e.currentTarget.style.borderColor = 'rgba(240,62,62,0.3)'
            e.currentTarget.style.background = 'rgba(240,62,62,0.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)'
            e.currentTarget.style.borderColor = 'var(--border-active)'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <Trash2 size={12} />
          Clear
        </button>
      </div>

      {/* Pipeline Banner */}
      <AnimatePresence>
        {v2Loading && v2Pipeline.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ flexShrink: 0, overflow: 'hidden' }}
          >
            <PipelineViz pipeline={v2Pipeline} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 20px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Empty state */}
        {v2Messages.length === 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              textAlign: 'center',
              padding: '32px 16px',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'rgba(0,212,255,0.07)',
                border: '1px solid rgba(0,212,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              }}
            >
              <Brain size={22} style={{ color: 'var(--accent-cyan)' }} />
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 5 }}>
              Multi-Agent Intelligence
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: 360, lineHeight: 1.6, marginBottom: 20 }}>
              Query across criminal databases, knowledge graphs, geospatial layers, and document archives simultaneously.
            </p>
            <div style={{ width: '100%', maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <p className="section-label" style={{ textAlign: 'left', marginBottom: 4 }}>Sample investigations</p>
              {PROMPT_SUGGESTIONS.map((item) => (
                <button
                  key={item.query}
                  onClick={() => setInput(item.query)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    gap: 12,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.25)'
                    e.currentTarget.style.background = 'var(--bg-elevated)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)'
                    e.currentTarget.style.background = 'var(--bg-tertiary)'
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {item.category}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {item.query}
                    </p>
                  </div>
                  <span className="tag-cyan" style={{ flexShrink: 0, fontSize: 9 }}>{item.tag}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message thread */}
        {v2Messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
              gap: 4,
            }}
          >
            {/* Sender label */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 5,
                  background: m.role === 'user'
                    ? 'linear-gradient(135deg, #A855F7, #7C3AED)'
                    : 'rgba(0,212,255,0.1)',
                  border: m.role === 'user' ? 'none' : '1px solid rgba(0,212,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {m.role === 'user'
                  ? <span style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>OF</span>
                  : <Zap size={11} style={{ color: 'var(--accent-cyan)' }} />
                }
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
                {m.role === 'user' ? 'You' : 'VigilX AI'}
              </span>
            </div>

            {/* Bubble / card */}
            {m.role === 'user' ? (
              <div className="chat-bubble-user">{m.text}</div>
            ) : m.data ? (
              <div style={{ width: '100%', maxWidth: 680 }}>
                <InvestigationCard data={m.data} />
              </div>
            ) : (
              <div className="chat-bubble-ai">{m.text}</div>
            )}
          </motion.div>
        ))}

        {/* Loading indicator */}
        {v2Loading && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 12px',
              borderRadius: 7,
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              width: 'fit-content',
            }}
          >
            <Loader2 size={12} style={{ color: 'var(--accent-cyan)', animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Synthesizing intelligence report…</span>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input bar */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border-subtle)',
          flexShrink: 0,
          background: 'var(--bg-tertiary)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 8,
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-active)',
            borderRadius: 9,
            padding: '6px 6px 6px 14px',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
          onFocusCapture={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.06)'
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-active)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <textarea
            ref={textareaRef}
            id="v2-chat-input"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask VigilX multi-agent AI…  (Shift+Enter for new line)"
            rows={1}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: 13,
              color: 'var(--text-primary)',
              lineHeight: 1.5,
              height: 40,
              minHeight: 40,
              maxHeight: 120,
              paddingTop: 10,
              fontFamily: 'inherit',
              overflowY: 'auto',
            }}
          />
          <button
            id="v2-send-btn"
            onClick={send}
            disabled={!input.trim() || v2Loading}
            style={{
              width: 34,
              height: 34,
              borderRadius: 7,
              background: input.trim() && !v2Loading ? 'var(--accent-cyan)' : 'var(--bg-elevated)',
              border: 'none',
              cursor: input.trim() && !v2Loading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.15s',
              opacity: input.trim() && !v2Loading ? 1 : 0.4,
            }}
          >
            {v2Loading
              ? <Loader2 size={14} style={{ color: '#000', animation: 'spin 1s linear infinite' }} />
              : <Send size={14} style={{ color: input.trim() ? '#000' : 'var(--text-secondary)' }} />
            }
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 6,
            padding: '0 2px',
          }}
        >
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
            Engine: <strong style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>VigilX DAG v2.0</strong>
          </span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Enter to send · Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  )
}
