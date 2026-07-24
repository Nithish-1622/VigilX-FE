import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Bot, User, Trash2, CheckCircle, Loader2,
  Clock, AlertTriangle, TrendingUp, Shield, Zap, ChevronDown, ChevronUp
} from 'lucide-react'
import useChatStore from '../../store/useChatStore'

const STARTERS = [
  'Map the criminal network in Harbor district',
  'Analyze drug trafficking patterns for Q3 2026',
  'Who are suspects linked to vehicle ZX-7742-B?',
]

const STAGE_COLORS = {
  pending: { color: '#484F58', bg: 'rgba(72,79,88,0.15)' },
  active: { color: '#00F0FF', bg: 'rgba(0,240,255,0.12)' },
  done: { color: '#30D158', bg: 'rgba(48,209,88,0.1)' },
}

function PipelineViz({ pipeline }) {
  return (
    <div className="py-4 px-5 border-b border-border-subtle">
      <p className="text-[10px] text-text-muted uppercase tracking-widest mb-3">Agent Pipeline Running...</p>
      <div className="flex items-center gap-1.5 flex-wrap">
        {pipeline.map((stage, i) => {
          const sc = STAGE_COLORS[stage.status]
          return (
            <div key={stage.name} className="flex items-center gap-1.5">
              <motion.div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium"
                style={{ background: sc.bg, border: `1px solid ${sc.color}30`, color: sc.color }}
                animate={stage.status === 'active' ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                {stage.status === 'active' && <Loader2 size={9} className="animate-spin" />}
                {stage.status === 'done' && <CheckCircle size={9} />}
                {stage.status === 'pending' && <Clock size={9} />}
                {stage.name.replace('Agent', '')}
              </motion.div>
              {i < pipeline.length - 1 && (
                <div className="w-3 h-px" style={{ background: sc.color + '40' }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function InvestigationCard({ data }) {
  const [expanded, setExpanded] = useState(false)
  const confColor = data.confidence > 0.8 ? '#30D158' : data.confidence > 0.6 ? '#FF9F0A' : '#FF3B30'

  return (
    <div className="chat-bubble-ai w-full max-w-full">
      {/* Summary */}
      <div className="flex items-start gap-2 mb-3">
        <Shield size={14} className="text-accent-cyan mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs font-semibold text-accent-cyan mb-1">Executive Summary</p>
          <p className="text-xs text-white/90 leading-relaxed">{data.executive_summary}</p>
        </div>
      </div>

      {/* Confidence */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px]"
          style={{ background: `${confColor}12`, border: `1px solid ${confColor}30`, color: confColor }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: confColor }} />
          Confidence: {Math.round(data.confidence * 100)}% — {data.confidence_label}
        </div>
        {data.critic_passed && (
          <div className="flex items-center gap-1.5 text-[10px] text-accent-green">
            <CheckCircle size={10} /> Critic Passed
          </div>
        )}
      </div>

      {/* Key Findings */}
      {data.key_findings?.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2">Key Findings</p>
          <div className="space-y-1.5">
            {data.key_findings.map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="text-accent-cyan font-bold flex-shrink-0">→</span>
                <div className="flex-1">
                  <p className="text-white/90">{f.finding}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] text-text-muted">{Math.round(f.confidence * 100)}% confidence</span>
                    {f.source_agents?.map((a) => <span key={a} className="tag-cyan text-[8px]">{a}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-[10px] text-text-muted hover:text-accent-cyan transition-colors mb-2"
      >
        {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
        {expanded ? 'Show less' : 'Show recommendations & metadata'}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {data.recommendations?.length > 0 && (
              <div className="mt-2">
                <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2">Recommendations</p>
                <div className="space-y-1">
                  {data.recommendations.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-white/80">
                      <TrendingUp size={10} className="text-accent-green mt-0.5 flex-shrink-0" />
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-3 pt-2 border-t border-border-subtle/50 grid grid-cols-2 gap-2 text-[10px] text-text-muted">
              <span>Intent: <span className="text-white">{data.intent}</span></span>
              <span>Complexity: <span className="text-white capitalize">{data.complexity}</span></span>
              <span>Session: <span className="text-accent-cyan mono">{data.session_id?.slice(0, 16)}...</span></span>
              <span>V2 Engine: <span className="text-accent-green">{data.v2 ? 'Active' : '—'}</span></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ChatV2() {
  const { v2Messages, v2Loading, v2Pipeline, sendV2Message, clearV2 } = useChatStore()
  const [input, setInput] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [v2Messages, v2Loading, v2Pipeline])

  const send = () => {
    const q = input.trim()
    if (!q || v2Loading) return
    setInput('')
    sendV2Message(q)
  }

  return (
    <div className="glass" style={{ borderRadius: 14, overflow: 'hidden', display:'flex', flexDirection:'column', height:'calc(100vh - 56px - 48px - 130px)', minHeight: 480, border: '1px solid rgba(0,240,255,0.12)' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', borderBottom:'1px solid rgba(33,38,45,1)', flexShrink:0, background:'rgba(0,240,255,0.03)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(0,240,255,0.12)', border: '1px solid rgba(0,240,255,0.3)' }}
          >
            <Zap size={15} className="text-accent-cyan" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">VigilX V2</h3>
            <p className="text-[10px] text-text-muted">Multi-Agent Intelligence Pipeline</p>
          </div>
          <span className="tag-cyan">7 Agents</span>
        </div>
        <button onClick={clearV2} className="text-text-muted hover:text-accent-red transition-colors">
          <Trash2 size={14} />
        </button>
      </div>

      {/* Pipeline Viz (shown when loading) */}
      <AnimatePresence>
        {v2Loading && v2Pipeline.length > 0 && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}>
            <PipelineViz pipeline={v2Pipeline} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {v2Messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.15)' }}
            >
              <Zap size={28} className="text-accent-cyan" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Multi-Agent Pipeline Ready</h3>
            <p className="text-xs text-text-muted mb-5">7 specialized agents ready to analyze your query in parallel.</p>
            <div className="flex flex-col gap-2 w-full max-w-sm">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setInput(s) }}
                  className="text-xs px-3 py-2 rounded-lg text-left text-text-secondary hover:text-white transition-all hover:bg-bg-tertiary"
                  style={{ border: '1px solid var(--border-active)' }}
                >
                  → {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {v2Messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'ai' && (
              <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                style={{ background: 'rgba(0,240,255,0.12)', border: '1px solid rgba(0,240,255,0.25)' }}
              >
                <Zap size={13} className="text-accent-cyan" />
              </div>
            )}
            <div className={m.role === 'user' ? 'chat-bubble-user' : 'w-full max-w-[92%]'}>
              {m.role === 'user' ? m.text : m.data ? <InvestigationCard data={m.data} /> : m.text}
            </div>
            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                style={{ background: 'linear-gradient(135deg, #BF5AF2, #8B5CF6)' }}
              >
                <User size={13} className="text-white" />
              </div>
            )}
          </motion.div>
        ))}

        {v2Loading && (
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Loader2 size={12} className="animate-spin text-accent-cyan" />
            <span>Orchestrating {v2Pipeline.filter((p) => p.status === 'active').map((p) => p.name).join(', ')}...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="px-5 pb-5 pt-3 border-t border-border-subtle flex gap-3 flex-shrink-0">
        <input
          id="v2-chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Query the multi-agent intelligence system..."
          className="input-cyber flex-1"
        />
        <button
          id="v2-send-btn"
          onClick={send}
          disabled={!input.trim() || v2Loading}
          className="btn-solid-cyan px-4 rounded-lg flex items-center gap-2 disabled:opacity-40"
        >
          <Zap size={14} />
          <Send size={14} />
        </button>
      </div>
    </div>
  )
}
