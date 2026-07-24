import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Search, ChevronRight, Database, Globe, Network, FileText,
  Shield, Cpu, GitBranch, Eye, BarChart2, Clock, MessageSquare, AlertTriangle,
} from 'lucide-react'

const AGENTS = [
  { id: 'planning', name: 'PlanningAgent', role: 'Orchestrator', icon: Brain, color: '#A855F7', desc: 'Decomposes complex queries into sub-tasks and routes them to specialized agents.', inputs: ['User Query', 'Session Context'], outputs: ['Task Graph', 'Agent Instructions'], status: 'active' },
  { id: 'sql', name: 'SQLToolAgent', role: 'Data Retrieval', icon: Database, color: '#00D4FF', desc: 'Generates and executes SQL queries against structured databases via the Universal Adapter.', inputs: ['Task Spec', 'Schema Map'], outputs: ['Query Results', 'Row Data'], status: 'active' },
  { id: 'graph', name: 'GraphAgent', role: 'Network Analysis', icon: Network, color: '#A855F7', desc: 'Traverses Neo4j graph to find criminal connections, paths, and network centrality.', inputs: ['Entity IDs', 'Relationship Types'], outputs: ['Network JSON', 'Path Data'], status: 'active' },
  { id: 'geo', name: 'GeoAgent', role: 'Spatial Analysis', icon: Globe, color: '#22C55E', desc: 'Analyzes geographic patterns, proximity clusters, and jurisdiction overlaps.', inputs: ['Coordinates', 'Incident Data'], outputs: ['Heatmap Data', 'Clusters'], status: 'active' },
  { id: 'timeline', name: 'TimelineAgent', role: 'Temporal Analysis', icon: Clock, color: '#F59E0B', desc: 'Identifies temporal patterns, event sequences, and time-based anomalies.', inputs: ['Event Logs', 'Date Range'], outputs: ['Timeline JSON', 'Pattern Flags'], status: 'idle' },
  { id: 'doc', name: 'DocAgent', role: 'Document Analysis', icon: FileText, color: '#00D4FF', desc: 'Extracts intelligence from PDFs, reports, and unstructured documents via vector search.', inputs: ['Document IDs', 'Query'], outputs: ['Extracted Facts', 'Citations'], status: 'idle' },
  { id: 'critic', name: 'CriticAgent', role: 'Quality Control', icon: Eye, color: '#F03E3E', desc: 'Reviews agent outputs for consistency, factual accuracy, and logical coherence.', inputs: ['Draft Response', 'Evidence Bundle'], outputs: ['Validated Output', 'Warnings'], status: 'active' },
  { id: 'synthesis', name: 'SynthesisAgent', role: 'Response Generation', icon: MessageSquare, color: '#00D4FF', desc: 'Combines all agent outputs into a cohesive executive intelligence report.', inputs: ['All Agent Outputs'], outputs: ['InvestigationResponse'], status: 'idle' },
  { id: 'threat', name: 'ThreatScoringAgent', role: 'Risk Assessment', icon: AlertTriangle, color: '#F03E3E', desc: 'Computes threat levels for entities based on behavioral signals and network position.', inputs: ['Entity Profile', 'Network Metrics'], outputs: ['Threat Score', 'Risk Label'], status: 'idle' },
  { id: 'chart', name: 'ChartAgent', role: 'Visualization', icon: BarChart2, color: '#A855F7', desc: 'Generates chart specs for dynamic visualization of analytical results.', inputs: ['Structured Data', 'Chart Type'], outputs: ['Chart Spec JSON'], status: 'idle' },
  { id: 'router', name: 'DataRouterAgent', role: 'Data Orchestration', icon: GitBranch, color: '#F59E0B', desc: 'Routes queries to the correct database adapter based on query type and schema.', inputs: ['Query', 'DB Registry'], outputs: ['Adapter Selection', 'Config'], status: 'idle' },
  { id: 'intel', name: 'IntelFusionAgent', role: 'Cross-Domain Fusion', icon: Cpu, color: '#A855F7', desc: 'Fuses intelligence from criminal, financial, geospatial, and digital domains.', inputs: ['Domain Reports'], outputs: ['Unified Intelligence'], status: 'idle' },
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 280 }}>
        <Search
          size={13}
          style={{
            position: 'absolute',
            left: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
          }}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search agents…"
          className="input-cyber"
          style={{ paddingLeft: 30 }}
        />
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {filtered.map((agent, i) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            i={i}
            isSelected={selected?.id === agent.id}
            onClick={() => setSelected(selected?.id === agent.id ? null : agent)}
          />
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            style={{
              background: 'var(--bg-secondary)',
              border: `1px solid ${selected.color}30`,
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            {/* Detail header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'var(--bg-tertiary)',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 9,
                  background: `${selected.color}10`,
                  border: `1px solid ${selected.color}25`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <selected.icon size={18} style={{ color: selected.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {selected.name}
                  </h3>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      padding: '1px 7px',
                      borderRadius: 4,
                      background: `${selected.color}10`,
                      color: selected.color,
                      border: `1px solid ${selected.color}20`,
                    }}
                  >
                    {selected.role}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0', lineHeight: 1.5 }}>
                  {selected.desc}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: selected.status === 'active' ? '#22C55E' : 'var(--text-muted)',
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    color: selected.status === 'active' ? '#22C55E' : 'var(--text-muted)',
                    textTransform: 'capitalize',
                  }}
                >
                  {selected.status}
                </span>
              </div>
            </div>

            {/* Detail body */}
            <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <p className="section-label" style={{ marginBottom: 10 }}>Inputs</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selected.inputs.map((inp) => (
                    <div key={inp} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ChevronRight size={10} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{inp}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="section-label" style={{ marginBottom: 10 }}>Outputs</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selected.outputs.map((out) => (
                    <div key={out} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ChevronRight size={10} style={{ color: selected.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{out}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Workflow */}
            <div
              style={{
                padding: '14px 20px',
                borderTop: '1px solid var(--border-subtle)',
                background: 'var(--bg-primary)',
              }}
            >
              <p className="section-label" style={{ marginBottom: 10 }}>Workflow</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                {selected.inputs.map((inp, i) => (
                  <div key={inp} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 5,
                        fontSize: 11,
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-active)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {inp}
                    </span>
                    {i < selected.inputs.length - 1 && (
                      <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>+</span>
                    )}
                  </div>
                ))}
                <span style={{ color: 'var(--text-muted)', fontSize: 13, margin: '0 4px' }}>→</span>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: 5,
                    fontSize: 11,
                    background: `${selected.color}10`,
                    border: `1px solid ${selected.color}25`,
                    color: selected.color,
                    fontWeight: 500,
                  }}
                >
                  {selected.name}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: 13, margin: '0 4px' }}>→</span>
                {selected.outputs.map((out, i) => (
                  <div key={out} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 5,
                        fontSize: 11,
                        background: 'rgba(0,212,255,0.07)',
                        border: '1px solid rgba(0,212,255,0.15)',
                        color: 'var(--accent-cyan)',
                      }}
                    >
                      {out}
                    </span>
                    {i < selected.outputs.length - 1 && (
                      <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>+</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AgentCard({ agent, i, isSelected, onClick }) {
  const Icon = agent.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.03, duration: 0.18 }}
      onClick={onClick}
      style={{
        padding: '14px',
        borderRadius: 9,
        background: 'var(--bg-secondary)',
        border: `1px solid ${isSelected ? `${agent.color}35` : 'var(--border-subtle)'}`,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.borderColor = `${agent.color}25`
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-subtle)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: `${agent.color}10`,
            border: `1px solid ${agent.color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={15} style={{ color: agent.color }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
              {agent.name}
            </span>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: agent.status === 'active' ? '#22C55E' : 'var(--text-muted)',
                flexShrink: 0,
              }}
            />
          </div>
          <p style={{ fontSize: 11, color: agent.color, margin: '0 0 5px' }}>{agent.role}</p>
          <p
            style={{
              fontSize: 11,
              color: 'var(--text-muted)',
              margin: 0,
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {agent.desc}
          </p>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 10,
          paddingTop: 10,
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          {agent.inputs.length} in · {agent.outputs.length} out
        </span>
        <span style={{ fontSize: 11, color: 'var(--accent-cyan)' }}>View →</span>
      </div>
    </motion.div>
  )
}
