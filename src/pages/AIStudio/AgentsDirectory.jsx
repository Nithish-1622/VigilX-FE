import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Search, ChevronRight, Database, Globe, Network, FileText, Shield, Cpu, GitBranch, Eye, BarChart2, Clock, MessageSquare, AlertTriangle } from 'lucide-react'

const AGENTS = [
  { id: 'planning', name: 'PlanningAgent', role: 'Orchestrator', icon: Brain, color: '#BF5AF2', desc: 'Decomposes complex queries into sub-tasks and routes them to specialized agents.', inputs: ['User Query', 'Session Context'], outputs: ['Task Graph', 'Agent Instructions'], status: 'active' },
  { id: 'sql', name: 'SQLToolAgent', role: 'Data Retrieval', icon: Database, color: '#00F0FF', desc: 'Generates and executes SQL queries against structured databases via the Universal Adapter.', inputs: ['Task Specification', 'Schema Map'], outputs: ['Query Results', 'Row Data'], status: 'active' },
  { id: 'graph', name: 'GraphAgent', role: 'Network Analysis', icon: Network, color: '#BF5AF2', desc: 'Traverses Neo4j graph to find criminal connections, paths, and network centrality.', inputs: ['Entity IDs', 'Relationship Types'], outputs: ['Network JSON', 'Path Data'], status: 'active' },
  { id: 'geo', name: 'GeoAgent', role: 'Spatial Analysis', icon: Globe, color: '#30D158', desc: 'Analyzes geographic patterns, proximity clusters, and jurisdiction overlaps.', inputs: ['Coordinates', 'Incident Data'], outputs: ['Heatmap Data', 'Cluster Polygons'], status: 'active' },
  { id: 'timeline', name: 'TimelineAgent', role: 'Temporal Analysis', icon: Clock, color: '#FF9F0A', desc: 'Identifies temporal patterns, event sequences, and time-based anomalies.', inputs: ['Event Logs', 'Date Range'], outputs: ['Timeline JSON', 'Pattern Flags'], status: 'idle' },
  { id: 'doc', name: 'DocAgent', role: 'Document Analysis', icon: FileText, color: '#00F0FF', desc: 'Extracts intelligence from PDFs, reports, and unstructured documents via vector search.', inputs: ['Document IDs', 'Search Query'], outputs: ['Extracted Facts', 'Citations'], status: 'idle' },
  { id: 'critic', name: 'CriticAgent', role: 'Quality Control', icon: Eye, color: '#FF3B30', desc: 'Reviews agent outputs for consistency, factual accuracy, and logical coherence.', inputs: ['Draft Response', 'Evidence Bundle'], outputs: ['Validated Output', 'Warning Flags'], status: 'active' },
  { id: 'synthesis', name: 'SynthesisAgent', role: 'Response Generation', icon: MessageSquare, color: '#00F0FF', desc: 'Combines all agent outputs into a cohesive executive intelligence report.', inputs: ['All Agent Outputs'], outputs: ['InvestigationResponse'], status: 'idle' },
  { id: 'threat', name: 'ThreatScoringAgent', role: 'Risk Assessment', icon: AlertTriangle, color: '#FF3B30', desc: 'Computes threat levels for entities based on behavioral signals and network position.', inputs: ['Entity Profile', 'Network Metrics'], outputs: ['Threat Score', 'Risk Label'], status: 'idle' },
  { id: 'chart', name: 'ChartAgent', role: 'Visualization', icon: BarChart2, color: '#BF5AF2', desc: 'Generates chart_specs for dynamic visualization of analytical results.', inputs: ['Structured Data', 'Chart Type'], outputs: ['Chart Spec JSON'], status: 'idle' },
  { id: 'router', name: 'DataRouterAgent', role: 'Data Orchestration', icon: GitBranch, color: '#FF9F0A', desc: 'Routes queries to the correct database adapter based on query type and schema.', inputs: ['Query', 'DB Registry'], outputs: ['Adapter Selection', 'Connection Config'], status: 'idle' },
  { id: 'intel', name: 'IntelFusionAgent', role: 'Cross-Domain Fusion', icon: Cpu, color: '#BF5AF2', desc: 'Fuses intelligence from multiple domains: criminal, financial, geospatial, and digital.', inputs: ['Domain Reports'], outputs: ['Unified Intelligence'], status: 'idle' },
]

export default function AgentsDirectory() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = AGENTS.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search agents..."
          className="input-cyber pl-9 py-2.5"
        />
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((agent, i) => (
          <AgentCard key={agent.id} agent={agent} i={i} onClick={() => setSelected(selected?.id === agent.id ? null : agent)} isSelected={selected?.id === agent.id} />
        ))}
      </div>

      {/* Detail Panel */}
      {selected && (
        <motion.div
          layoutId="agentDetail"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-heavy rounded-2xl p-6 mt-2"
          style={{ border: `1px solid ${selected.color}30` }}
        >
          <div className="flex items-start gap-4 mb-5">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${selected.color}18`, border: `1px solid ${selected.color}30` }}
            >
              <selected.icon size={24} style={{ color: selected.color }} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{selected.name}</h3>
              <p className="text-sm" style={{ color: selected.color }}>{selected.role}</p>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed max-w-xl">{selected.desc}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className={`status-dot ${selected.status}`} />
              <span className="text-xs capitalize text-text-secondary">{selected.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2">Inputs</p>
              <div className="space-y-1.5">
                {selected.inputs.map((inp) => (
                  <div key={inp} className="flex items-center gap-2 text-xs">
                    <ChevronRight size={10} className="text-accent-cyan" />
                    <span className="text-white">{inp}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2">Outputs</p>
              <div className="space-y-1.5">
                {selected.outputs.map((out) => (
                  <div key={out} className="flex items-center gap-2 text-xs">
                    <ChevronRight size={10} style={{ color: selected.color }} />
                    <span className="text-white">{out}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Workflow Diagram (simplified) */}
          <div className="mt-5 pt-5 border-t border-border-subtle">
            <p className="text-[10px] text-text-muted uppercase tracking-widest mb-3">Workflow</p>
            <div className="flex items-center gap-2 flex-wrap">
              {selected.inputs.map((inp, i) => (
                <div key={inp} className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-lg text-xs"
                    style={{ background: 'rgba(139,148,158,0.1)', border: '1px solid rgba(139,148,158,0.2)', color: '#8B949E' }}
                  >
                    {inp}
                  </div>
                  {i < selected.inputs.length - 1 && <div className="text-text-muted text-xs">+</div>}
                </div>
              ))}
              <div className="text-text-muted text-xs mx-2">→</div>
              <div className="px-3 py-1.5 rounded-lg text-xs"
                style={{ background: `${selected.color}12`, border: `1px solid ${selected.color}30`, color: selected.color }}
              >
                {selected.name}
              </div>
              <div className="text-text-muted text-xs mx-2">→</div>
              {selected.outputs.map((out, i) => (
                <div key={out} className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-lg text-xs"
                    style={{ background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.2)', color: 'var(--accent-cyan)' }}
                  >
                    {out}
                  </div>
                  {i < selected.outputs.length - 1 && <div className="text-text-muted text-xs">+</div>}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function AgentCard({ agent, i, onClick, isSelected }) {
  const Icon = agent.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.04 }}
      onClick={onClick}
      className="glass rounded-xl p-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
      style={{
        border: isSelected ? `1px solid ${agent.color}50` : '1px solid rgba(255,255,255,0.06)',
        boxShadow: isSelected ? `0 0 20px ${agent.color}15` : 'none',
      }}
      whileHover={{ borderColor: `${agent.color}30` }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${agent.color}18`, border: `1px solid ${agent.color}30` }}
        >
          <Icon size={18} style={{ color: agent.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white truncate">{agent.name}</p>
            <div className={`status-dot ${agent.status} flex-shrink-0`} />
          </div>
          <p className="text-xs mt-0.5 truncate" style={{ color: agent.color }}>{agent.role}</p>
          <p className="text-xs text-text-muted mt-1 leading-relaxed line-clamp-2">{agent.desc}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-subtle/50">
        <span className="text-[10px] text-text-muted">{agent.inputs.length} inputs · {agent.outputs.length} outputs</span>
        <span className="ml-auto text-[10px] text-accent-cyan">View workflow →</span>
      </div>
    </motion.div>
  )
}
