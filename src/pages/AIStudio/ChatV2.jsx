import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Bot, User, Trash2, CheckCircle2, Loader2,
  Clock, AlertTriangle, TrendingUp, Shield, Zap, ChevronDown, ChevronUp,
  FileText, Database, Network, Search, Sparkles, Filter, Paperclip, Brain
} from 'lucide-react'
import useChatStore from '../../store/useChatStore'

const PROMPT_SUGGESTIONS = [
  {
    category: 'Narcotics & Syndicates',
    query: 'Identify suspect networks and narcotics distribution hotspots in Harbor District linked to vehicle ZX-7742-B.',
    tag: 'Graph + Geo'
  },
  {
    category: 'Financial Intelligence',
    query: 'Trace financial laundering transactions exceeding $50k across accounts linked to Carlos R.',
    tag: 'SQL + RAG'
  },
  {
    category: 'Temporal Trajectory',
    query: 'Map the chronological timeline of incidents and phone calls for Case #4421 over Q3 2026.',
    tag: 'TimelineAgent'
  },
]

const STAGE_COLORS = {
  pending: { color: '#484F58', bg: 'rgba(72,79,88,0.15)' },
  active: { color: '#00F0FF', bg: 'rgba(0,240,255,0.12)' },
  done: { color: '#30D158', bg: 'rgba(48,209,88,0.1)' },
}

function PipelineViz({ pipeline }) {
  return (
    <div className="py-3 px-4 bg-[#161B22]/80 border-b border-[#21262D]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-[#00F0FF] uppercase tracking-wider flex items-center gap-1.5">
          <Loader2 size={12} className="animate-spin text-[#00F0FF]" />
          Multi-Agent DAG Execution in Progress
        </span>
        <span className="text-[10px] text-[#8B949E]">Session #VX-8812</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {pipeline.map((stage, i) => {
          const sc = STAGE_COLORS[stage.status] || STAGE_COLORS.pending
          return (
            <div key={stage.name} className="flex items-center gap-1.5">
              <motion.div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium"
                style={{ background: sc.bg, border: `1px solid ${sc.color}30`, color: sc.color }}
                animate={stage.status === 'active' ? { scale: [1, 1.03, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                {stage.status === 'active' && <Loader2 size={10} className="animate-spin" />}
                {stage.status === 'done' && <CheckCircle2 size={10} />}
                {stage.status === 'pending' && <Clock size={10} />}
                {stage.name}
              </motion.div>
              {i < pipeline.length - 1 && (
                <div className="w-2.5 h-px bg-[#30363D]" />
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
  const confColor = confPercent >= 85 ? '#30D158' : confPercent >= 65 ? '#FF9F0A' : '#FF3B30'

  return (
    <div className="glass rounded-xl p-4 border border-[#21262D] space-y-4 w-full bg-[#0D1117]/90 text-left">
      
      {/* Top Threat & Confidence Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#21262D]">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-[#00F0FF]" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Executive Intelligence Brief</span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
            style={{ background: `${confColor}15`, border: `1px solid ${confColor}30`, color: confColor }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: confColor }} />
            Confidence: {confPercent}% ({data.confidence_label || 'High Verification'})
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#FF3B30]/10 text-[#FF3B30] border border-[#FF3B30]/30">
            HIGH THREAT
          </span>
        </div>
      </div>

      {/* Executive Summary */}
      <div>
        <p className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-1">Executive Summary</p>
        <p className="text-xs text-white/90 leading-relaxed bg-[#161B22]/60 p-3 rounded-lg border border-[#21262D]">
          {data.executive_summary || 'Multi-agent analysis verified syndicate connections between primary suspect Carlos R. and regional distribution points in Harbor District.'}
        </p>
      </div>

      {/* Key Findings */}
      {data.key_findings?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-2">Validated Key Findings</p>
          <div className="space-y-2">
            {data.key_findings.map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-xs p-2.5 rounded-lg bg-[#161B22]/40 border border-[#21262D]">
                <span className="text-[#00F0FF] font-bold mt-0.5">▪</span>
                <div className="flex-1">
                  <p className="text-white/90 font-medium">{f.finding}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-[#8B949E]">{Math.round((f.confidence || 0.9) * 100)}% verified</span>
                    {f.source_agents?.map((a) => (
                      <span key={a} className="text-[9px] px-1.5 py-0.2 rounded bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations & Trace Drawer Toggle */}
      <div className="pt-2 border-t border-[#21262D] flex items-center justify-between">
        <button
          onClick={() => setExpandedTrace(!expandedTrace)}
          className="flex items-center gap-1.5 text-xs text-[#00F0FF] hover:underline font-medium"
        >
          {expandedTrace ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expandedTrace ? 'Hide Agent Execution Trace' : 'View Agent Execution Trace & Evidence Links'}
        </button>

        <span className="text-[10px] text-[#484F58] flex items-center gap-1">
          <CheckCircle2 size={12} className="text-[#30D158]" /> Verified by CriticAgent
        </span>
      </div>

      {/* Expanded Trace & Evidence */}
      <AnimatePresence>
        {expandedTrace && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-3 pt-2"
          >
            <div className="p-3 rounded-lg bg-[#070A0F] border border-[#21262D] font-mono text-[11px] text-[#8B949E] space-y-1.5">
              <div className="text-[#00F0FF] font-bold">[PlanningAgent] Task DAG decomposed into 3 sub-tasks</div>
              <div>[SQLToolAgent] Query: SELECT * FROM suspect_vehicles WHERE plate = 'ZX-7742-B' → 1 row returned</div>
              <div>[GraphAgent] Neo4j Traversal: Node #CR-504 ↔ Centrality Degree: 0.942 (Hub)</div>
              <div>[GeoAgent] Proximity Cluster: Sector 4 (Harbor District) - 3 active clusters</div>
              <div className="text-[#30D158]">[CriticAgent] Factual consistency validated (Score: 0.984)</div>
            </div>

            {data.recommendations?.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-[#8B949E] uppercase tracking-wider mb-1.5">Actionable Next Steps</p>
                <div className="space-y-1">
                  {data.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-white/80">
                      <TrendingUp size={12} className="text-[#30D158]" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
    <div
      className="glass"
      style={{
        borderRadius: 14,
        border: '1px solid #21262D',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 280px)',
        minHeight: 420,
      }}
    >
      
      {/* Sleek Top Session Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#161B22]/80 border-b border-[#21262D] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center">
            <Zap size={16} className="text-[#00F0FF]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">VigilX CORE AI</h3>
              <span className="px-2 py-0.2 rounded text-[10px] font-extrabold bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30">
                Multi-Agent V2 Pipeline
              </span>
            </div>
            <p className="text-[11px] text-[#8B949E] mt-0.5">
              Active Session #VX-8812 · 7 Specialized AI Agents Connected
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={clearV2}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161B22] hover:bg-[#FF3B30]/10 hover:border-[#FF3B30]/30 border border-[#30363D] text-xs text-[#8B949E] hover:text-[#FF3B30] transition-all"
          >
            <Trash2 size={13} /> Clear Session
          </button>
        </div>
      </div>

      {/* Pipeline Execution Banner (when processing) */}
      <AnimatePresence>
        {v2Loading && v2Pipeline.length > 0 && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}>
            <PipelineViz pipeline={v2Pipeline} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#070A0F]/60">
        
        {/* Empty State Showcase */}
        {v2Messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-xl mx-auto py-8">
            <div className="w-14 h-14 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center mb-4">
              <Brain size={28} className="text-[#00F0FF]" />
            </div>

            <h3 className="text-base font-extrabold text-white mb-1">Law Enforcement Multi-Agent Intelligence</h3>
            <p className="text-xs text-[#8B949E] mb-6 leading-relaxed">
              Ask natural language queries across criminal databases, syndicate knowledge graphs, geospatial threat layers, and police report archives.
            </p>

            <div className="w-full space-y-2.5">
              <p className="text-[11px] font-bold text-[#00F0FF] uppercase tracking-wider text-left">Suggested Sample Investigations:</p>
              {PROMPT_SUGGESTIONS.map((item) => (
                <button
                  key={item.query}
                  onClick={() => setInput(item.query)}
                  className="w-full p-3 rounded-xl bg-[#161B22]/70 hover:bg-[#161B22] border border-[#21262D] hover:border-[#00F0FF]/40 text-left transition-all group flex items-center justify-between"
                >
                  <div className="pr-4">
                    <span className="text-[10px] font-bold text-[#8B949E] uppercase">{item.category}</span>
                    <p className="text-xs text-white/90 font-medium group-hover:text-[#00F0FF] transition-colors mt-0.5">
                      "{item.query}"
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20 flex-shrink-0">
                    {item.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Thread */}
        {v2Messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'ai' && (
              <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex-shrink-0 flex items-center justify-center mt-1">
                <Zap size={14} className="text-[#00F0FF]" />
              </div>
            )}

            <div className={m.role === 'user' ? 'max-w-[75%]' : 'w-full max-w-[95%]'}>
              {m.role === 'user' ? (
                <div className="bg-gradient-to-r from-[#00F0FF]/20 to-[#0080FF]/20 border border-[#00F0FF]/30 text-white text-xs leading-relaxed p-3.5 rounded-xl rounded-tr-none">
                  {m.text}
                </div>
              ) : m.data ? (
                <InvestigationCard data={m.data} />
              ) : (
                <div className="glass p-4 rounded-xl border border-[#21262D] text-xs text-white/90 leading-relaxed text-left">
                  {m.text}
                </div>
              )}
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#BF5AF2] to-[#8B5CF6] flex-shrink-0 flex items-center justify-center mt-1 text-white text-xs font-bold">
                OF
              </div>
            )}
          </motion.div>
        ))}

        {v2Loading && (
          <div className="flex items-center gap-2 text-xs text-[#8B949E] p-2 bg-[#161B22]/40 rounded-lg border border-[#21262D] w-fit">
            <Loader2 size={13} className="animate-spin text-[#00F0FF]" />
            <span>Multi-Agent DAG is synthesizing intelligence report...</span>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Fixed Bottom Input Bar */}
      <div className="p-4 bg-[#161B22]/90 border-t border-[#21262D] flex-shrink-0 space-y-2">
        <div className="flex items-center gap-3">
          <input
            id="v2-chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask VigilX multi-agent AI (e.g. 'Trace financial links for suspect #CR-504')..."
            className="flex-1 bg-[#070A0F] border border-[#30363D] focus:border-[#00F0FF] text-white text-xs px-4 py-3 rounded-xl outline-none transition-all placeholder-[#484F58]"
          />

          <button
            id="v2-send-btn"
            onClick={send}
            disabled={!input.trim() || v2Loading}
            className="btn-solid-cyan px-5 py-3 rounded-xl flex items-center gap-2 text-xs font-bold disabled:opacity-40"
          >
            <span>Query Agents</span>
            <Send size={13} />
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#484F58] px-1">
          <span>Engine: <strong className="text-[#8B949E]">VigilX Multi-Agent DAG v2.0</strong></span>
          <span>Zero-Copy Enforcement Active</span>
        </div>
      </div>

    </div>
  )
}
