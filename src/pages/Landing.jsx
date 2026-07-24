import { useState, useEffect, Suspense, lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, CheckCircle2, Shield, Activity, Terminal, Database,
  Brain, Network, Globe, Lock, Cpu, Play, ChevronRight, Zap, RefreshCw,
  GitBranch, Eye, BarChart2, Layers, Search, Sparkles, AlertCircle, FileText
} from 'lucide-react'

const ParticleNetwork = lazy(() => import('../components/three/ParticleNetwork'))

// ── Data Definitions ──
const AGENT_FLEET = [
  { name: 'PlanningAgent', role: 'Orchestrator', color: '#BF5AF2', desc: 'Decomposes queries into multi-agent task graphs.' },
  { name: 'SQLToolAgent', role: 'Database Retrieval', color: '#00F0FF', desc: 'Generates SQL & traverses relational databases.' },
  { name: 'GraphAgent', role: 'Network Analysis', color: '#30D158', desc: 'Traverses Neo4j graph for syndicate links.' },
  { name: 'GeoAgent', role: 'Spatial Clustering', color: '#FF9F0A', desc: 'Analyzes spatial density & jurisdiction overlap.' },
  { name: 'DocAgent', role: 'Unstructured RAG', color: '#00F0FF', desc: 'Extracts intelligence from PDF reports & transcripts.' },
  { name: 'ThreatScoringAgent', role: 'Risk Engine', color: '#FF3B30', desc: 'Computes multi-variable threat scores & anomaly metrics.' },
]

const CONNECTORS = [
  { name: 'PostgreSQL', type: 'Relational DB', status: 'Connected', count: '1.4M rows', iconColor: '#336791' },
  { name: 'Neo4j Graph', type: 'Syndicate Graph', status: 'Connected', count: '480K nodes', iconColor: '#008CC1' },
  { name: 'MongoDB', type: 'Document Store', status: 'Connected', count: '2.1M docs', iconColor: '#47A248' },
  { name: 'Geospatial GIS', type: 'Vector Layer', status: 'Active Sync', count: '14 districts', iconColor: '#FF9F0A' },
  { name: 'Unstructured PDF/OCR', type: 'Vector Index', status: 'Ready', count: '85K files', iconColor: '#BF5AF2' },
  { name: 'REST / Webhooks', type: 'Live Stream', status: 'Streaming', count: '120 req/s', iconColor: '#00F0FF' },
]

const PLATFORM_CAPABILITIES = [
  {
    tag: 'MULTI-AGENT PIPELINE',
    title: 'Autonomous Multi-Agent Intelligence Engine',
    desc: 'VigilX coordinates 12+ specialized AI agents working concurrently. Rather than relying on a single LLM, queries trigger a DAG (Directed Acyclic Graph) of planning, database traversal, document extraction, and self-correcting critic agents.',
    bullets: [
      'Parallel agent execution with cross-validation',
      'Autonomous SQL generation & query optimization',
      'Factual validation loop via CriticAgent',
    ],
    accent: '#00F0FF',
    previewType: 'pipeline'
  },
  {
    tag: 'GRAPH & GEOSPATIAL FUSION',
    title: 'Knowledge Graph & Criminal Network Resolution',
    desc: 'Instantly map criminal syndicates, hidden phone tree connections, financial laundering flows, and geospatial crime hotspots onto an interactive, multi-dimensional intelligence canvas.',
    bullets: [
      'Neo4j syndicate topology & centrality metrics',
      'Real-time Leaflet GIS threat clustering',
      'Entity disambiguation & alias resolution',
    ],
    accent: '#BF5AF2',
    previewType: 'graph'
  },
  {
    tag: 'UNIVERSAL ADAPTER',
    title: 'Zero-Copy Universal Database Federation',
    desc: 'Query across relational SQL, graph DBs, vector search, and unstructured police reports through a single unified interface without manual data migration or complex ETL lag.',
    bullets: [
      'Plug-and-play DB adapter registry',
      'Sub-second query response over millions of records',
      'Automated schema auto-discovery & field mapping',
    ],
    accent: '#30D158',
    previewType: 'adapter'
  },
  {
    tag: 'EXPERIMENTAL SANDBOX',
    title: 'Predictive Modeling & Disruption Simulations',
    desc: 'Run scenario simulations to predict how removing key syndicate nodes impacts crime rates, or test custom multi-agent prompt strategies in a risk-free sandbox environment.',
    bullets: [
      'What-If node removal disruption scoring',
      'A/B testing of prompt strategies & LLM models',
      'Synthetic crime surge prediction engines',
    ],
    accent: '#FF9F0A',
    previewType: 'simulation'
  }
]

export default function Landing() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [simStep, setSimStep] = useState(0)

  // Simulation step timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSimStep((prev) => (prev + 1) % 4)
    }, 2800)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#070A0F', color: '#fff', overflowX: 'hidden', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Background 3D & Glowing Grids ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Suspense fallback={null}>
          <ParticleNetwork />
        </Suspense>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,240,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '400px', background: 'radial-gradient(ellipse at 50% 0%, rgba(0,240,255,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '300px', background: 'radial-gradient(ellipse at 50% 100%, rgba(191,90,242,0.08) 0%, transparent 70%)' }} />
      </div>

      {/* ── Top Navigation Bar ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(7,10,15,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, rgba(0,240,255,0.25), rgba(191,90,242,0.25))', border: '1px solid rgba(0,240,255,0.4)', display: 'flex', alignItems: 'center', justifyCenter: 'center', boxShadow: '0 0 16px rgba(0,240,255,0.25)' }}>
              <Shield size={20} style={{ color: '#00F0FF' }} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '0.08em', color: '#fff', lineHeight: 1 }}>
                VIGIL<span style={{ color: '#00F0FF' }}>X</span>
              </div>
              <div style={{ fontSize: 9, letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 2 }}>
                Multi-Agent Defense AI
              </div>
            </div>
          </div>

          {/* Quick Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="hidden-sm">
            <a href="#features" style={{ fontSize: 13, color: '#8B949E', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#00F0FF'} onMouseLeave={(e) => e.target.style.color = '#8B949E'}>Capabilities</a>
            <a href="#architecture" style={{ fontSize: 13, color: '#8B949E', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#00F0FF'} onMouseLeave={(e) => e.target.style.color = '#8B949E'}>Agent Architecture</a>
            <a href="#connectors" style={{ fontSize: 13, color: '#8B949E', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#00F0FF'} onMouseLeave={(e) => e.target.style.color = '#8B949E'}>Data Connectors</a>
            <a href="#security" style={{ fontSize: 13, color: '#8B949E', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#00F0FF'} onMouseLeave={(e) => e.target.style.color = '#8B949E'}>Security & Governance</a>
          </nav>

          {/* CTA Group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, background: 'rgba(48,209,88,0.08)', border: '1px solid rgba(48,209,88,0.2)', fontSize: 11, color: '#30D158' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#30D158', animation: 'pulseDot 2s infinite' }} />
              System Status: Operational
            </div>
            <button
              onClick={() => navigate('/app/home')}
              className="btn-solid-cyan"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700 }}
            >
              Enter Portal <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </header>

      {/* ── Hero Section ── */}
      <section style={{ position: 'relative', zIndex: 10, padding: '80px 24px 60px', textAlign: 'center', maxWidth: 1100, margin: '0 auto' }}>
        
        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 20, background: 'linear-gradient(90deg, rgba(0,240,255,0.1), rgba(191,90,242,0.1))', border: '1px solid rgba(0,240,255,0.3)', color: '#00F0FF', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 24 }}>
            <Sparkles size={13} style={{ color: '#BF5AF2' }} />
            VigilX v2.0 Multi-Agent Intelligence Engine
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} style={{ fontSize: 'clamp(44px, 6.5vw, 80px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', margin: '0 0 24px' }}>
          Autonomous Law Enforcement <br />
          <span style={{ background: 'linear-gradient(135deg, #00F0FF 0%, #BF5AF2 50%, #FF3B30 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Intelligence Platform
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ fontSize: 18, color: '#8B949E', maxWidth: 760, margin: '0 auto 40px', lineHeight: 1.6 }}>
          Synthesize siloed database records, criminal network graphs, GIS hotspots, and unstructured evidence files into unified, real-time investigation reports powered by coordinated AI agent fleets.
        </motion.p>

        {/* Hero Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 60 }}>
          <button onClick={() => navigate('/app/home')} className="btn-solid-cyan" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700 }}>
            Launch Intelligence Dashboard <ArrowRight size={16} />
          </button>
          <button onClick={() => navigate('/app/ai-studio')} className="btn-cyber" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 28px', borderRadius: 12, fontSize: 14 }}>
            Explore AI Studio <Brain size={16} />
          </button>
        </motion.div>

        {/* Live Metrics Strip */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.4 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, background: 'rgba(13,17,23,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '24px', backdropFilter: 'blur(12px)' }}>
          {[
            { metric: '12+', label: 'Specialized AI Agents', desc: 'Autonomous DAG pipeline' },
            { metric: '< 1.8s', label: 'Query Execution Time', desc: 'Multi-threaded DB routing' },
            { metric: '100%', label: 'Zero-Copy Security', desc: 'Federated data architecture' },
            { metric: '99.94%', label: 'Graph Entity Accuracy', desc: 'Self-correcting CriticAgent' },
          ].map((m) => (
            <div key={m.label} style={{ textAlign: 'left', padding: '0 12px', borderLeft: '2px solid rgba(0,240,255,0.3)' }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: '#00F0FF', letterSpacing: '-0.02em' }}>{m.metric}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginTop: 2 }}>{m.label}</div>
              <div style={{ fontSize: 11, color: '#484F58', marginTop: 2 }}>{m.desc}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Interactive Live Agent Terminal Mockup ── */}
      <section style={{ position: 'relative', zIndex: 10, padding: '0 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ background: '#0D1117', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 80px rgba(0,0,0,0.8), 0 0 40px rgba(0,240,255,0.1)' }}>
          
          {/* Terminal Top Bar */}
          <div style={{ background: '#161B22', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF3B30' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF9F0A' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#30D158' }} />
              <span style={{ fontSize: 12, color: '#8B949E', fontFamily: 'monospace', marginLeft: 12 }}>
                vigilx-orchestrator // session-id: #VX-8812-US
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#00F0FF' }}>
              <Activity size={12} /> Live Simulation
            </div>
          </div>

          {/* Terminal Body */}
          <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, minHeight: 340 }}>
            
            {/* Left: Live Query Trace */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: 'rgba(0,240,255,0.05)', border: '1px solid rgba(0,240,255,0.15)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#fff', fontFamily: 'monospace' }}>
                <span style={{ color: '#00F0FF', fontWeight: 700 }}>INVESTIGATOR QUERY:</span> "Identify suspect networks and recent narcotics distribution hotspots in Harbor District linked to vehicle ZX-7742-B."
              </div>

              {/* Execution Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {[
                  { step: 0, name: 'PlanningAgent', status: 'Decomposed query into 3 parallel sub-tasks (Graph, SQL, Geo).', color: '#BF5AF2' },
                  { step: 1, name: 'SQLToolAgent', status: 'Queried vehicle DB: Registered owner "Carlos R." (ID: #CR-504).', color: '#00F0FF' },
                  { step: 2, name: 'GraphAgent & GeoAgent', status: 'Neo4j found 4 syndicate links; Leaflet mapped 3 active clusters in Sector 4.', color: '#30D158' },
                  { step: 3, name: 'Critic & SynthesisAgent', status: 'Validated facts (Confidence 98.4%). Executive Intelligence Report rendered.', color: '#FF9F0A' },
                ].map((s) => {
                  const isActive = simStep >= s.step
                  return (
                    <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, background: isActive ? 'rgba(255,255,255,0.03)' : 'transparent', border: `1px solid ${isActive ? s.color + '40' : 'transparent'}`, transition: 'all 0.3s' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: isActive ? s.color : '#21262D', boxShadow: isActive ? `0 0 10px ${s.color}` : 'none' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: isActive ? s.color : '#484F58' }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: isActive ? '#C9D1D9' : '#30363D', marginTop: 1 }}>{s.status}</div>
                      </div>
                      {isActive && <CheckCircle2 size={14} style={{ color: s.color }} />}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right: Real-time Rendered Intel Card Preview */}
            <div style={{ background: 'rgba(13,17,23,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', color: '#FF3B30', textTransform: 'uppercase' }}>THREAT LEVEL: HIGH RISK</span>
                  <span style={{ fontSize: 11, color: '#8B949E', fontFamily: 'monospace' }}>Report #INT-9902</span>
                </div>

                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>Syndicate Cluster Identified</h4>
                <p style={{ fontSize: 12, color: '#8B949E', lineHeight: 1.5, margin: 0 }}>
                  Primary Target <strong style={{ color: '#fff' }}>Carlos R.</strong> linked via vehicle ZX-7742-B to <strong style={{ color: '#00F0FF' }}>Dmitri V.</strong> (Harbor District cell leader).
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
                  <div style={{ background: 'rgba(0,240,255,0.05)', border: '1px solid rgba(0,240,255,0.15)', borderRadius: 8, padding: '10px' }}>
                    <div style={{ fontSize: 10, color: '#8B949E' }}>Graph Centrality</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#00F0FF', marginTop: 2 }}>0.942 (Hub)</div>
                  </div>
                  <div style={{ background: 'rgba(255,59,48,0.05)', border: '1px solid rgba(255,59,48,0.15)', borderRadius: 8, padding: '10px' }}>
                    <div style={{ fontSize: 10, color: '#8B949E' }}>Active Hotspots</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#FF3B30', marginTop: 2 }}>3 Districts</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, marginTop: 16 }}>
                <span style={{ fontSize: 11, color: '#30D158', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={12} /> Verified by CriticAgent
                </span>
                <button onClick={() => navigate('/app/ai-studio')} style={{ background: 'none', border: 'none', color: '#00F0FF', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Open Full Pipeline →
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section: Platform Capabilities Showcase ── */}
      <section id="features" style={{ position: 'relative', zIndex: 10, padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', color: '#00F0FF', textTransform: 'uppercase', marginBottom: 8 }}>
            UNIFIED CAPABILITIES
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', margin: 0 }}>
            Designed for Modern Criminal Analytics & Defense Operations
          </h2>
        </div>

        {/* Feature Cards Grid with Custom Visual Previews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {PLATFORM_CAPABILITIES.map((cap, index) => (
            <div
              key={cap.tag}
              style={{
                display: 'grid',
                gridTemplateColumns: index % 2 === 0 ? '1fr 1.1fr' : '1.1fr 1fr',
                gap: 40,
                alignItems: 'center',
                background: 'rgba(13,17,23,0.6)',
                border: `1px solid ${cap.accent}25`,
                borderRadius: 24,
                padding: '36px',
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Text Side */}
              <div style={{ order: index % 2 === 0 ? 1 : 2 }}>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', color: cap.accent, textTransform: 'uppercase', background: `${cap.accent}12`, padding: '4px 10px', borderRadius: 6, border: `1px solid ${cap.accent}30` }}>
                  {cap.tag}
                </span>
                <h3 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginTop: 14, marginBottom: 14, lineHeight: 1.2 }}>
                  {cap.title}
                </h3>
                <p style={{ fontSize: 14, color: '#8B949E', lineHeight: 1.6, marginBottom: 20 }}>
                  {cap.desc}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {cap.bullets.map((bullet) => (
                    <div key={bullet} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#C9D1D9' }}>
                      <CheckCircle2 size={16} style={{ color: cap.accent, flexShrink: 0 }} />
                      {bullet}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/app/home')}
                  style={{ background: 'none', border: 'none', color: cap.accent, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, padding: 0 }}
                >
                  Explore in Platform →
                </button>
              </div>

              {/* Visual Component Side (No generic icons!) */}
              <div style={{ order: index % 2 === 0 ? 2 : 1 }}>
                {cap.previewType === 'pipeline' && <PipelineVisualPreview accent={cap.accent} />}
                {cap.previewType === 'graph' && <GraphVisualPreview accent={cap.accent} />}
                {cap.previewType === 'adapter' && <AdapterVisualPreview accent={cap.accent} />}
                {cap.previewType === 'simulation' && <SimulationVisualPreview accent={cap.accent} />}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section: Full Agent Fleet Architecture ── */}
      <section id="architecture" style={{ position: 'relative', zIndex: 10, padding: '80px 24px', background: 'rgba(13,17,23,0.4)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', color: '#BF5AF2', textTransform: 'uppercase' }}>AGENT DIRECTORY</span>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginTop: 6 }}>12 Autonomous AI Agents Working as One</h2>
            <p style={{ fontSize: 15, color: '#8B949E', maxWidth: 600, margin: '10px auto 0' }}>
              Each agent is engineered with single-responsibility focus for maximum factual accuracy and strict auditability.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
            {AGENT_FLEET.map((agent) => (
              <div key={agent.name} className="glass" style={{ borderRadius: 16, padding: '20px', border: `1px solid ${agent.color}25`, background: 'rgba(13,17,23,0.7)', transition: 'transform 0.2s, border-color 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: agent.color, boxShadow: `0 0 10px ${agent.color}` }} />
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{agent.name}</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: agent.color, background: `${agent.color}15`, padding: '2px 8px', borderRadius: 4 }}>
                    {agent.role}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: '#8B949E', lineHeight: 1.5, margin: 0 }}>{agent.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button onClick={() => navigate('/app/ai-studio')} className="btn-cyber" style={{ padding: '10px 24px', borderRadius: 10, fontSize: 13 }}>
              View Complete Agent Fleet Directory →
            </button>
          </div>
        </div>
      </section>

      {/* ── Section: Data Connectors Grid ── */}
      <section id="connectors" style={{ position: 'relative', zIndex: 10, padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', color: '#30D158', textTransform: 'uppercase' }}>UNIVERSAL ADAPTER</span>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginTop: 6 }}>Connect Any Database, API, or Document Registry</h2>
          <p style={{ fontSize: 15, color: '#8B949E', maxWidth: 600, margin: '10px auto 0' }}>
            Zero-copy architecture ensures data stays in your secure infrastructure while VigilX queries across boundaries.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {CONNECTORS.map((c) => (
            <div key={c.name} style={{ background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '18px', textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{c.name}</div>
              <div style={{ fontSize: 11, color: '#8B949E', marginTop: 2 }}>{c.type}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 10, color: '#30D158', fontWeight: 600 }}>● {c.status}</span>
                <span style={{ fontSize: 10, color: '#484F58', fontFamily: 'monospace' }}>{c.count}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section: Security & Compliance ── */}
      <section id="security" style={{ position: 'relative', zIndex: 10, padding: '80px 24px', background: 'rgba(13,17,23,0.6)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', color: '#FF3B30', textTransform: 'uppercase' }}>ENTERPRISE GOVERNANCE</span>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginTop: 8, marginBottom: 16 }}>
              Defense-Grade Security & Immutable Audit Logging
            </h2>
            <p style={{ fontSize: 14, color: '#8B949E', lineHeight: 1.6, marginBottom: 24 }}>
              VigilX is architected for strict law enforcement compliance. Every AI agent thought process, database query, and user access is cryptographically logged for full courtroom evidentiary chain-of-custody.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { title: 'Level 5 Clearance RBAC', desc: 'Granular field-level security masks sensitive PII.' },
                { title: 'AES-256 & FIPS 140-3', desc: 'End-to-end encryption at rest & in transit.' },
                { title: 'Evidentiary Chain Log', desc: 'Immutable cryptographic trail of agent reasoning.' },
                { title: 'Zero Data Retention', desc: 'No LLM training on proprietary case files.' },
              ].map((s) => (
                <div key={s.title} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '14px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: '#8B949E', marginTop: 4, lineHeight: 1.4 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#0D1117', border: '1px solid rgba(255,59,48,0.2)', borderRadius: 20, padding: '24px', boxShadow: '0 0 40px rgba(255,59,48,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Lock size={18} style={{ color: '#FF3B30' }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>Audit Compliance Monitor</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: 'monospace', fontSize: 11 }}>
              <div style={{ color: '#30D158' }}>[SUCCESS] Cryptographic signature verified #CHAIN-8801</div>
              <div style={{ color: '#8B949E' }}>[AUDIT] User Officer_Admin requested entity #CR-504</div>
              <div style={{ color: '#00F0FF' }}>[GOVERNANCE] PII Mask applied to Social Security field</div>
              <div style={{ color: '#BF5AF2' }}>[AGENT] CriticAgent logged confidence score 0.984</div>
              <div style={{ color: '#30D158' }}>[ENCRYPTION] TLS 1.3 session active (AES-256-GCM)</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom Call To Action ── */}
      <section style={{ position: 'relative', zIndex: 10, padding: '80px 24px', textAlign: 'center', background: 'radial-gradient(ellipse at 50% 50%, rgba(0,240,255,0.08) 0%, transparent 70%)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', margin: '0 0 16px' }}>Ready to Elevate Your Intelligence Operations?</h2>
          <p style={{ fontSize: 16, color: '#8B949E', marginBottom: 32 }}>Access the full suite of VigilX multi-agent capabilities, knowledge graphs, and spatial analytics instantly.</p>
          <button onClick={() => navigate('/app/home')} className="btn-solid-cyan" style={{ padding: '16px 36px', borderRadius: 12, fontSize: 16, fontWeight: 800 }}>
            Enter Secure Portal Now <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ── Complete Enterprise Footer ── */}
      <footer style={{ position: 'relative', zIndex: 10, background: '#05070B', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '60px 24px 30px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr', gap: 40, marginBottom: 40 }}>
          
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, rgba(0,240,255,0.25), rgba(191,90,242,0.25))', border: '1px solid rgba(0,240,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={16} style={{ color: '#00F0FF' }} />
              </div>
              <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: '0.08em', color: '#fff' }}>
                VIGIL<span style={{ color: '#00F0FF' }}>X</span>
              </span>
            </div>
            <p style={{ fontSize: 12, color: '#8B949E', lineHeight: 1.6, maxWidth: 280 }}>
              Autonomous Multi-Agent Law Enforcement & Criminal Intelligence Platform. Empowering investigative teams with unified data federation.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, fontSize: 11, color: '#30D158' }}>
              <div className="status-dot active" />
              All Defense Clusters Active (100% Uptime)
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', color: '#fff', textTransform: 'uppercase', marginBottom: 16 }}>Platform</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
              <a onClick={() => navigate('/app/home')} style={{ color: '#8B949E', cursor: 'pointer', textDecoration: 'none' }}>Home Dashboard</a>
              <a onClick={() => navigate('/app/data-studio')} style={{ color: '#8B949E', cursor: 'pointer', textDecoration: 'none' }}>Data Studio</a>
              <a onClick={() => navigate('/app/ai-studio')} style={{ color: '#8B949E', cursor: 'pointer', textDecoration: 'none' }}>AI Studio</a>
              <a onClick={() => navigate('/app/experimental')} style={{ color: '#8B949E', cursor: 'pointer', textDecoration: 'none' }}>Experimental Studio</a>
            </div>
          </div>

          {/* Agent Architecture */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', color: '#fff', textTransform: 'uppercase', marginBottom: 16 }}>Agents</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12, color: '#8B949E' }}>
              <span>PlanningAgent</span>
              <span>SQLToolAgent</span>
              <span>GraphAgent</span>
              <span>GeoAgent</span>
              <span>CriticAgent</span>
            </div>
          </div>

          {/* Governance */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', color: '#fff', textTransform: 'uppercase', marginBottom: 16 }}>Compliance</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12, color: '#8B949E' }}>
              <span>FIPS 140-3 Encryption</span>
              <span>Zero-Trust RBAC</span>
              <span>Chain of Custody Logs</span>
              <span>Auditing Protocols</span>
            </div>
          </div>

          {/* Security Badge Card */}
          <div style={{ background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#00F0FF', textTransform: 'uppercase', marginBottom: 6 }}>DEFENSE SECURE NODE</div>
            <div style={{ fontSize: 10, color: '#8B949E', lineHeight: 1.4 }}>
              Authorized government & law enforcement personnel only. Cryptographic session keys assigned.
            </div>
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 10, color: '#484F58', fontFamily: 'monospace' }}>
              NODE_ID: #VX-METRO-09
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ maxWidth: 1200, margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#484F58' }}>
          <div>© 2026 VigilX Intelligence Systems Inc. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Disclosures</span>
          </div>
        </div>
      </footer>

    </div>
  )
}

// ── Custom Rich Visual Previews (Replacing Generic Icon Boxes) ──

function PipelineVisualPreview({ accent }) {
  return (
    <div style={{ background: '#0D1117', border: `1px solid ${accent}30`, borderRadius: 16, padding: '20px', boxShadow: `0 0 30px ${accent}10` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: accent, fontFamily: 'monospace' }}>DAG EXECUTION GRAPH</span>
        <span className="tag-cyan">7 AGENTS RUNNING</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { name: 'Task Planning & Routing', time: '0.12s', progress: '100%', color: '#BF5AF2' },
          { name: 'Parallel SQL + Graph Traversal', time: '0.45s', progress: '100%', color: '#00F0FF' },
          { name: 'Vector Doc Extraction & RAG', time: '0.38s', progress: '100%', color: '#30D158' },
          { name: 'Critic Logic & Synthesis', time: '0.22s', progress: '90%', color: '#FF9F0A' },
        ].map((p) => (
          <div key={p.name} style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#fff', marginBottom: 4 }}>
              <span>{p.name}</span>
              <span style={{ color: p.color, fontFamily: 'monospace' }}>{p.time}</span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: p.progress, height: '100%', background: p.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GraphVisualPreview({ accent }) {
  return (
    <div style={{ background: '#0D1117', border: `1px solid ${accent}30`, borderRadius: 16, padding: '20px', height: 260, position: 'relative', overflow: 'hidden' }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: accent, fontFamily: 'monospace', marginBottom: 12 }}>
        KNOWLEDGE GRAPH NODE TOPOLOGY
      </div>

      {/* Visual SVG Network Topology */}
      <svg width="100%" height="180" style={{ overflow: 'visible' }}>
        <line x1="80" y1="50" x2="180" y2="100" stroke="rgba(191,90,242,0.4)" strokeWidth="2" strokeDasharray="4" />
        <line x1="180" y1="100" x2="280" y2="40" stroke="rgba(0,240,255,0.4)" strokeWidth="2" />
        <line x1="180" y1="100" x2="260" y2="140" stroke="rgba(255,59,48,0.4)" strokeWidth="2" />

        {/* Nodes */}
        <g transform="translate(80,50)">
          <circle r="18" fill="rgba(191,90,242,0.2)" stroke="#BF5AF2" strokeWidth="2" />
          <text textAnchor="middle" dy="4" fill="#fff" fontSize="9" fontWeight="bold">Phone</text>
        </g>
        <g transform="translate(180,100)">
          <circle r="24" fill="rgba(255,59,48,0.3)" stroke="#FF3B30" strokeWidth="2" />
          <text textAnchor="middle" dy="4" fill="#fff" fontSize="10" fontWeight="bold">Carlos R.</text>
        </g>
        <g transform="translate(280,40)">
          <circle r="16" fill="rgba(0,240,255,0.2)" stroke="#00F0FF" strokeWidth="2" />
          <text textAnchor="middle" dy="4" fill="#fff" fontSize="9" fontWeight="bold">Vehicle</text>
        </g>
        <g transform="translate(260,140)">
          <circle r="18" fill="rgba(48,209,88,0.2)" stroke="#30D158" strokeWidth="2" />
          <text textAnchor="middle" dy="4" fill="#fff" fontSize="9" fontWeight="bold">Account</text>
        </g>
      </svg>
    </div>
  )
}

function AdapterVisualPreview({ accent }) {
  return (
    <div style={{ background: '#0D1117', border: `1px solid ${accent}30`, borderRadius: 16, padding: '20px' }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: accent, fontFamily: 'monospace', marginBottom: 14 }}>
        FEDERATED SCHEMA MAPPER
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { field: 'suspect_id', source: 'PostgreSQL.users', match: '99%' },
          { field: 'phone_hash', source: 'Neo4j.Person.phone', match: '100%' },
          { field: 'geo_coordinates', source: 'GIS.incidents', match: '98%' },
          { field: 'transcript_nlp', source: 'VectorStore.pdf', match: '94%' },
        ].map((item) => (
          <div key={item.field} style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#00F0FF' }}>{item.field}</div>
            <div style={{ fontSize: 10, color: '#8B949E', marginTop: 2 }}>← {item.source}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SimulationVisualPreview({ accent }) {
  return (
    <div style={{ background: '#0D1117', border: `1px solid ${accent}30`, borderRadius: 16, padding: '20px' }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: accent, fontFamily: 'monospace', marginBottom: 14 }}>
        SIMULATION ENGINE // WHAT-IF SCENARIO
      </div>
      <div style={{ background: 'rgba(255,159,10,0.08)', border: '1px solid rgba(255,159,10,0.2)', borderRadius: 10, padding: '12px', marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#FF9F0A' }}>Scenario: Remove Central Hub #CR-504</div>
        <div style={{ fontSize: 11, color: '#8B949E', marginTop: 4 }}>Predicted Syndicate Disruption: <strong style={{ color: '#fff' }}>-64.2% communication volume</strong></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#8B949E', fontFamily: 'monospace' }}>
        <span>Confidence Interval: 94.8%</span>
        <span style={{ color: '#30D158' }}>Simulation Verified</span>
      </div>
    </div>
  )
}
