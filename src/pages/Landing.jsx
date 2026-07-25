/**
 * VigilX — Next-Gen Multi-Agent Criminal Intelligence Platform
 *
 * MODIFIED LANDING PAGE UI
 * Features:
 *   - Background 3D Graph Particle Network (ParticleNetwork)
 *   - 3D Interactive Convergence Scene (ConvergenceScene)
 *   - High-impact Hero with Classification Badges & Live Metrics
 *   - Product Studio Breakdown (Data Studio, AI Studio, Entity Graph, Surveillance)
 *   - 4-Step Intelligence Pipeline & Architecture Workflow
 *   - Enterprise Security & Compliance Matrix (Air-Gap, TS//SCI, Zero-Egress)
 *   - Live Terminal Telemetry Preview
 *   - Professional Multi-Column Footer with Live System Status
 */

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  ArrowRight, 
  Database, 
  Cpu, 
  Share2, 
  Activity, 
  Lock, 
  Terminal, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  Search,
  Eye,
  Server,
  FileText,
  Zap,
  Globe,
  Radio,
  ChevronRight
} from 'lucide-react'
import ConvergenceScene from '../components/landing/ConvergenceScene'
import ParticleNetwork from '../components/three/ParticleNetwork'

// ─── Static Data Definitions ──────────────────────────────────────────────────

const STATS = [
  { v: '< 1.4s',  l: 'Query Fusion Latency' },
  { v: '12',      l: 'Specialized AI Agents' },
  { v: '99.99%',  l: 'Uptime Reliability' },
  { v: 'TS//SCI', l: 'Air-Gap Classification' },
]

const PRODUCT_STUDIOS = [
  {
    id: 'data-studio',
    icon: Database,
    tag: 'DATA STUDIO',
    title: 'Federated Multi-Database Intelligence Querying',
    subtitle: 'Interrogate PostgreSQL, Neo4j, MongoDB, Vector DBs, and PDF Archives in a single query.',
    body: 'VigilX eliminates data silos. Field agents and intelligence analysts can execute natural-language or structured queries across disparate legacy databases simultaneously without needing manual SQL, Cypher, or API mappings.',
    chips: ['PostgreSQL', 'Neo4j Graph', 'Milvus Vector', 'PDF Archives', 'REST Feeds'],
    codeSnippet: `SELECT fuse_entities(suspect_id, cdr_records, alpr_scans)
FROM vigilx_federated_mesh 
WHERE risk_score > 0.85 AND location = 'Harbor Sector';`,
    metrics: 'Federated response in 1.18s · 5 sources synced'
  },
  {
    id: 'ai-studio',
    icon: Cpu,
    tag: 'AI INTELLIGENCE STUDIO',
    title: 'Autonomous Multi-Agent Consensus & Orchestration',
    subtitle: 'Every response is cross-checked by specialized AI agents before analyst review.',
    body: 'An ensemble of LLM agents (AnalystAgent, GraphAgent, GeoAgent, CriticAgent) independently process query fragments, cross-validate evidence for internal consistency, and calculate confidence scores with source citations.',
    chips: ['AnalystAgent', 'GraphAgent', 'GeoAgent', 'CriticAgent', 'FactVerifier'],
    codeSnippet: `[CriticAgent] Evaluation: PASSED (confidence: 0.94)
[FactVerifier] 14 data points grounded in case_4421.pdf & CDR logs.
[System] Synthesized report ready for Level-4 Analyst.`,
    metrics: 'Critic consensus: 99.4% · 0 hallucinated edges'
  },
  {
    id: 'entity-graph',
    icon: Share2,
    tag: 'ENTITY GRAPH ENGINE',
    title: 'Real-Time Link Analysis & Automated Entity Resolution',
    subtitle: 'Fuse phone numbers, vehicle plates, suspects, and case files into unified 360° profiles.',
    body: 'Automated entity resolution links disparate data fragments—such as an ALPR license plate scan, a burner phone CDR log, and a suspect field report—into a single interconnected knowledge graph with temporal centrality scoring.',
    chips: ['Centrality Analysis', 'Link Prediction', 'Community Detection', 'Geo-Clustering'],
    codeSnippet: `Graph.merge_entity({
  person: "Target Alpha",
  vehicle: "ZX-7742-B",
  phone: "+1-555-9182",
  centrality_rank: 0.942
});`,
    metrics: '2,341 active nodes · 8,912 relationships mapped'
  },
  {
    id: 'surveillance-studio',
    icon: Activity,
    tag: 'EXPERIMENTAL & SURVEILLANCE LAB',
    title: 'Live Threat Telemetry & Predictive Anomaly Detection',
    subtitle: 'Continuous real-time stream processing for high-risk tactical environments.',
    body: 'Monitor live incident feeds, automated license plate recognition (ALPR), signal intelligence, and geolocation anomalies with predictive alert triggers and automated countermeasure prompts.',
    chips: ['Real-Time Streams', 'ALPR Telemetry', 'Geo Fencing', 'Anomaly Alerts'],
    codeSnippet: `STREAM incident_telemetry FROM 'harbor_gateway'
WHEN anomaly_score > 0.78
TRIGGER dispatch_alert(priority='IMMEDIATE');`,
    metrics: 'Stream latency < 45ms · 120k events/sec'
  }
]

const PIPELINE_STEPS = [
  {
    step: '01',
    title: 'Multi-Modal Ingestion',
    desc: 'Ingests structured SQL rows, unstructured PDF transcripts, CDR call logs, ALPR plate scans, and live REST streams.',
    mono: 'INGEST // 5 DATA TYPES'
  },
  {
    step: '02',
    title: 'Entity Fusion & Graph Linkage',
    desc: 'Cross-links isolated records into unified entity nodes using fuzzy matching, graph neural networks, and spatial-temporal correlation.',
    mono: 'FUSE // GRAPH SYNTHESIS'
  },
  {
    step: '03',
    title: 'Multi-Agent Consensus',
    desc: 'Analyst, Geo, and Graph agents synthesize intelligence while CriticAgent audits for logical consistency and source grounding.',
    mono: 'VERIFY // CRITIC AUDIT'
  },
  {
    step: '04',
    title: 'Actionable Intelligence Output',
    desc: 'Delivers high-confidence threat reports, dynamic network graphs, and spatial maps ready for operational decision-making.',
    mono: 'OUTPUT // C4ISR DASHBOARD'
  }
]

const SECURITY_FEATURES = [
  {
    icon: Lock,
    title: 'Air-Gapped & On-Premise',
    desc: 'Deployable in zero-connectivity air-gapped SCIF environments. Local LLM inference supported with no outbound network traffic.'
  },
  {
    icon: Shield,
    title: 'Classification & RBAC',
    desc: 'Granular security controls supporting Level 1 through Level 5 clearance (Unclassified to TS//SCI//NOFORN).'
  },
  {
    icon: Terminal,
    title: 'Immutable Audit Trail',
    desc: 'Every query, agent reasoning step, and analyst access log is cryptographically hashed and logged to an immutable ledger.'
  },
  {
    icon: Server,
    title: 'Zero Data Egress',
    desc: 'Raw databases remain on your infrastructure. VigilX runs locally over your existing database connectors without data duplication.'
  }
]

const TERMINAL_LOGS = [
  { time: '12:04:18.102', agent: 'SYSTEM', msg: 'Initiating federated query across 5 target nodes...' },
  { time: '12:04:18.341', agent: 'DATA_STUDIO', msg: 'PostgreSQL: 14,880 rows scanned (suspects_db)' },
  { time: '12:04:18.520', agent: 'GRAPH_AGENT', msg: 'Neo4j: Target Alpha linked to Vehicle ZX-7742-B (degree: 14)' },
  { time: '12:04:18.890', agent: 'GEO_AGENT', msg: 'Spatial match confirmed: Harbor District (34.0522, -118.2437)' },
  { time: '12:04:19.110', agent: 'CRITIC_AGENT', msg: 'Cross-verification complete. Confidence: 0.942. Zero hallucinations detected.' },
  { time: '12:04:19.250', agent: 'VIGILX_CORE', msg: 'Synthesis complete. Report generated for Analyst Level-4.' }
]

// ─── Component Code ──────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate()
  const reduced = useReducedMotion()
  const [scenePhase, setScenePhase] = useState(0)
  const [activeStudioTab, setActiveStudioTab] = useState('data-studio')
  const [logIndex, setLogIndex] = useState(3)

  // Auto-advance terminal logs for live UI feel
  useEffect(() => {
    const timer = setInterval(() => {
      setLogIndex((prev) => (prev < TERMINAL_LOGS.length ? prev + 1 : prev))
    }, 1800)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#06080C', color: '#E8EDF5', overflowX: 'hidden', fontFamily: "'Inter', sans-serif" }}>

      {/* ── 1. BACKGROUND GRAPH ANIMATION CANVAS ───────────────────────── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <ParticleNetwork style={{ opacity: 0.55 }} />
        {/* Dark radial glow overlay for visual depth */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 20%, rgba(0, 200, 240, 0.08) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.06) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(6, 8, 12, 0.8) 0%, rgba(6, 8, 12, 0.98) 100%)'
        }} />
      </div>

      {/* ── 2. FIXED TOPBAR HEADER ──────────────────────────────────────── */}
      <motion.header
        initial={reduced ? false : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px',
          background: 'rgba(6, 8, 12, 0.85)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 4,
            background: 'rgba(0, 200, 240, 0.1)', border: '1px solid rgba(0, 200, 240, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(0, 200, 240, 0.2)'
          }}>
            <Shield size={14} style={{ color: '#00C8F0' }} />
          </div>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 800, letterSpacing: '0.12em', color: '#E8EDF5' }}>
            VIGIL<span style={{ color: '#00C8F0' }}>X</span>
          </span>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#00C8F0',
            background: 'rgba(0, 200, 240, 0.08)', border: '1px solid rgba(0, 200, 240, 0.2)',
            padding: '2px 8px', borderRadius: 2, letterSpacing: '0.1em'
          }}>
            v2.0.1 PLATFORM
          </span>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="hidden-mobile">
          <a href="#studios" style={{ fontSize: 12, color: '#A0AEC0', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#00C8F0'} onMouseLeave={(e) => e.target.style.color = '#A0AEC0'}>Capabilities</a>
          <a href="#pipeline" style={{ fontSize: 12, color: '#A0AEC0', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#00C8F0'} onMouseLeave={(e) => e.target.style.color = '#A0AEC0'}>Architecture</a>
          <a href="#security" style={{ fontSize: 12, color: '#A0AEC0', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#00C8F0'} onMouseLeave={(e) => e.target.style.color = '#A0AEC0'}>Security & Air-Gap</a>
          <a href="#telemetry" style={{ fontSize: 12, color: '#A0AEC0', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#00C8F0'} onMouseLeave={(e) => e.target.style.color = '#A0AEC0'}>Live Telemetry</a>
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#4A5568', letterSpacing: '0.06em' }}>
            ● CLASSIFIED PORTAL
          </span>
          <button
            onClick={() => navigate('/app')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 3,
              fontSize: 11, fontWeight: 700, color: '#06080C', background: '#00C8F0', border: 'none',
              cursor: 'pointer', letterSpacing: '0.06em', transition: 'all 0.2s',
              boxShadow: '0 0 16px rgba(0, 200, 240, 0.35)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#33D6F6'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#00C8F0'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            ENTER SECURE PORTAL <ArrowRight size={12} />
          </button>
        </div>
      </motion.header>

      {/* ── 3. HERO SECTION ─────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 74, paddingBottom: 40 }}>
        <div style={{ maxWidth: 1280, width: '100%', margin: '0 auto', padding: '0 32px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>

          {/* Left Column: Copy & Actions */}
          <div style={{ flex: '1 1 52%', minWidth: 320, paddingRight: 24 }}>
            
            {/* Classification Pill */}
            <motion.div
              initial={reduced ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}
            >
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em',
                color: '#E53E3E', background: 'rgba(229, 62, 62, 0.08)', border: '1px solid rgba(229, 62, 62, 0.25)',
                padding: '4px 12px', borderRadius: 2, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E53E3E', boxShadow: '0 0 8px #E53E3E' }} />
                TOP SECRET // SCI // NOFORN
              </span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#4A5568', letterSpacing: '0.1em' }}>
                AIR-GAP COMPLIANT
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                fontSize: 'clamp(38px, 4.8vw, 64px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.08,
                color: '#F7FAFC', marginBottom: 20
              }}
            >
              Unified Data Fusion & <br />
              <span style={{
                background: 'linear-gradient(135deg, #00C8F0 0%, #8B5CF6 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                Multi-Agent Graph Intelligence
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.68, maxWidth: 540, marginBottom: 36 }}
            >
              VigilX connects your organization's PostgreSQL, Neo4j, MongoDB, ALPR scans, CDR logs, and PDF case files into one interrogable knowledge layer. Execute complex multi-database queries with automated multi-agent consensus and complete source grounding.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 48 }}
            >
              <button
                onClick={() => navigate('/app')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '13px 28px', borderRadius: 3,
                  fontSize: 13, fontWeight: 700, color: '#06080C', background: '#00C8F0', border: 'none',
                  cursor: 'pointer', letterSpacing: '0.05em', transition: 'all 0.2s',
                  boxShadow: '0 0 24px rgba(0, 200, 240, 0.4)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#33D6F6'; e.currentTarget.style.boxShadow = '0 0 32px rgba(0, 200, 240, 0.6)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#00C8F0'; e.currentTarget.style.boxShadow = '0 0 24px rgba(0, 200, 240, 0.4)' }}
              >
                ENTER SECURE PORTAL <ArrowRight size={15} />
              </button>

              <a
                href="#studios"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '13px 24px', borderRadius: 3,
                  fontSize: 13, fontWeight: 600, color: '#CBD5E1', background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.12)', textDecoration: 'none', transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00C8F0'; e.currentTarget.style.color = '#00C8F0' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'; e.currentTarget.style.color = '#CBD5E1' }}
              >
                EXPLORE CAPABILITIES
              </a>
            </motion.div>

            {/* Metrics Bar */}
            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1,
                background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 4, overflow: 'hidden'
              }}
            >
              {STATS.map((s) => (
                <div key={s.l} style={{ padding: '12px 14px', background: 'rgba(10, 14, 22, 0.85)', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 16, fontWeight: 700, color: '#00C8F0', letterSpacing: '-0.02em' }}>{s.v}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </motion.div>

          </div>

          {/* Right Column: Convergence Graph Stage */}
          <div style={{ flex: '1 1 45%', minWidth: 320, height: 480, position: 'relative', marginTop: 24 }}>
            <div style={{
              position: 'relative', width: '100%', height: '100%',
              background: 'rgba(10, 14, 22, 0.6)', border: '1px solid rgba(0, 200, 240, 0.2)',
              borderRadius: 6, overflow: 'hidden', boxShadow: '0 0 40px rgba(0, 200, 240, 0.1)'
            }}>

              {/* Stage Top Bar */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px',
                background: 'rgba(6, 8, 12, 0.9)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#64748B', marginLeft: 8 }}>
                    CONVERGENCE_ENGINE // 3D GRAPH VISUALIZER
                  </span>
                </div>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: '#00C8F0', letterSpacing: '0.1em' }}>
                  {scenePhase >= 2 ? '● GRAPH RESOLVED (8 SOURCES)' : '● FUSING DATA SOURCES...'}
                </span>
              </div>

              {/* 3D Canvas component */}
              <ConvergenceScene onPhaseChange={setScenePhase} />

              {/* Stage Footer Tag */}
              <div style={{
                position: 'absolute', bottom: 12, left: 16, right: 16, zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '6px 12px', background: 'rgba(6, 8, 12, 0.85)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 3
              }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#94A3B8' }}>
                  ACTIVE NODES: PostgreSQL · Neo4j · ALPR · CDR · PDF
                </span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#00C8F0' }}>
                  FPS: 60 · REALTIME
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ── 4. PRODUCT STUDIOS & FEATURE BREAKDOWN ─────────────────────── */}
      <section id="studios" style={{ position: 'relative', zIndex: 1, padding: '96px 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          
          <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 64px' }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
              color: '#00C8F0', textTransform: 'uppercase', background: 'rgba(0, 200, 240, 0.08)',
              border: '1px solid rgba(0, 200, 240, 0.2)', padding: '4px 12px', borderRadius: 2
            }}>
              PLATFORM ARCHITECTURE & CAPABILITIES
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em', marginTop: 16, marginBottom: 16 }}>
              Four Integrated Intelligence Modules
            </h2>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65 }}>
              Designed specifically for high-stakes criminal investigations, intelligence analysis, and tactical monitoring with complete multi-agent validation.
            </p>
          </div>

          {/* Studio Tab Selection Bar */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            {PRODUCT_STUDIOS.map((s) => {
              const IconComp = s.icon
              const active = activeStudioTab === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStudioTab(s.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 4,
                    fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                    color: active ? '#00C8F0' : '#94A3B8',
                    background: active ? 'rgba(0, 200, 240, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                    border: `1px solid ${active ? 'rgba(0, 200, 240, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                    boxShadow: active ? '0 0 16px rgba(0, 200, 240, 0.2)' : 'none'
                  }}
                >
                  <IconComp size={14} />
                  {s.tag}
                </button>
              )
            })}
          </div>

          {/* Studio Active Feature Display Card */}
          <div style={{ background: 'rgba(10, 14, 22, 0.85)', border: '1px solid rgba(0, 200, 240, 0.2)', borderRadius: 8, overflow: 'hidden', padding: '36px' }}>
            {PRODUCT_STUDIOS.filter((s) => s.id === activeStudioTab).map((s) => {
              const IconComp = s.icon
              return (
                <div key={s.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 36, alignItems: 'center' }}>
                  
                  {/* Left Column: Details */}
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 10px', background: 'rgba(0, 200, 240, 0.1)', border: '1px solid rgba(0, 200, 240, 0.25)', borderRadius: 2, marginBottom: 16 }}>
                      <IconComp size={12} style={{ color: '#00C8F0' }} />
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#00C8F0', letterSpacing: '0.1em' }}>{s.tag}</span>
                    </div>

                    <h3 style={{ fontSize: 24, fontWeight: 800, color: '#F8FAFC', marginBottom: 10, lineHeight: 1.25 }}>
                      {s.title}
                    </h3>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#38BDF8', marginBottom: 14 }}>
                      {s.subtitle}
                    </p>
                    <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.7, marginBottom: 24 }}>
                      {s.body}
                    </p>

                    {/* Chips */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                      {s.chips.map((c) => (
                        <span key={c} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#CBD5E1', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '3px 9px', borderRadius: 2 }}>
                          {c}
                        </span>
                      ))}
                    </div>

                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#10B981', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 size={13} /> {s.metrics}
                    </div>
                  </div>

                  {/* Right Column: Code/Log Terminal Box */}
                  <div style={{ background: '#030712', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ height: 30, background: '#0B0F19', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#64748B' }}>
                        {s.id}.telemetry.log
                      </span>
                      <Terminal size={12} style={{ color: '#00C8F0' }} />
                    </div>
                    <pre style={{ margin: 0, padding: 20, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#38BDF8', overflowX: 'auto', lineHeight: 1.6 }}>
                      <code>{s.codeSnippet}</code>
                    </pre>
                  </div>

                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ── 5. INTELLIGENCE PIPELINE WORKFLOW ───────────────────────────── */}
      <section id="pipeline" style={{ position: 'relative', zIndex: 1, padding: '96px 0', background: 'rgba(4, 6, 10, 0.7)', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          
          <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 64px' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: '#8B5CF6', textTransform: 'uppercase', background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '4px 12px', borderRadius: 2 }}>
              HOW VIGILX WORKS
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em', marginTop: 16, marginBottom: 16 }}>
              The 4-Step Intelligence Fusion Pipeline
            </h2>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65 }}>
              From raw fragmented records to verified actionable intelligence in under 1.4 seconds.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            {PIPELINE_STEPS.map((p, idx) => (
              <div
                key={p.step}
                style={{
                  background: 'rgba(10, 14, 22, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 6, padding: '28px 24px', position: 'relative', transition: 'transform 0.2s, border-color 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00C8F0'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 32, fontWeight: 800, color: '#00C8F0', opacity: 0.35, marginBottom: 12 }}>
                  {p.step}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC', marginBottom: 10 }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.65, marginBottom: 18 }}>
                  {p.desc}
                </p>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#64748B', letterSpacing: '0.08em' }}>
                  {p.mono}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 6. ENTERPRISE SECURITY & COMPLIANCE MATRIX ───────────────────── */}
      <section id="security" style={{ position: 'relative', zIndex: 1, padding: '96px 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          
          <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 64px' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: '#10B981', textTransform: 'uppercase', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '4px 12px', borderRadius: 2 }}>
              GOVERNANCE & SECURITY
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em', marginTop: 16, marginBottom: 16 }}>
              Built for SCIF Environments & Sovereign Deployments
            </h2>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65 }}>
              Your operational data never leaves your environment. Complete privacy, zero cloud lock-in, and strict clearance boundaries.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {SECURITY_FEATURES.map((sf) => {
              const IconComp = sf.icon
              return (
                <div
                  key={sf.title}
                  style={{
                    background: 'rgba(10, 14, 22, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 6, padding: '28px 24px'
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 4, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <IconComp size={18} style={{ color: '#10B981' }} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC', marginBottom: 10 }}>
                    {sf.title}
                  </h3>
                  <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.6 }}>
                    {sf.desc}
                  </p>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ── 7. LIVE TELEMETRY LOG TERMINAL PREVIEW ───────────────────────── */}
      <section id="telemetry" style={{ position: 'relative', zIndex: 1, padding: '80px 0', background: 'rgba(3, 5, 8, 0.85)', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '0 32px' }}>
          
          <div style={{ background: '#050810', border: '1px solid rgba(0, 200, 240, 0.25)', borderRadius: 6, overflow: 'hidden', boxShadow: '0 0 32px rgba(0, 200, 240, 0.1)' }}>
            
            <div style={{ height: 36, background: '#090E1A', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity size={13} style={{ color: '#00C8F0' }} />
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700, color: '#E8EDF5', letterSpacing: '0.08em' }}>
                  VIGILX_LIVE_TELEMETRY // MULTI_AGENT_REASONING_STREAM
                </span>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                LIVE STREAMING
              </span>
            </div>

            <div style={{ padding: 20, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, minHeight: 180 }}>
              {TERMINAL_LOGS.slice(0, logIndex).map((log, i) => (
                <div key={i} style={{ marginBottom: 8, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ color: '#64748B' }}>[{log.time}]</span>
                  <span style={{ color: log.agent === 'CRITIC_AGENT' ? '#10B981' : log.agent === 'SYSTEM' ? '#00C8F0' : '#38BDF8', fontWeight: 700 }}>
                    [{log.agent}]
                  </span>
                  <span style={{ color: '#CBD5E1' }}>{log.msg}</span>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* ── 8. PROFESSIONAL MULTI-COLUMN ENTERPRISE FOOTER ──────────────── */}
      <footer style={{ position: 'relative', zIndex: 1, background: '#020408', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 72, paddingBottom: 40 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 64 }}>
            
            {/* Column 1: Brand & Status */}
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 26, height: 26, borderRadius: 3, background: 'rgba(0, 200, 240, 0.1)', border: '1px solid rgba(0, 200, 240, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={13} style={{ color: '#00C8F0' }} />
                </div>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 15, fontWeight: 800, letterSpacing: '0.12em', color: '#E8EDF5' }}>
                  VIGIL<span style={{ color: '#00C8F0' }}>X</span> SYSTEMS
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, maxWidth: 360, marginBottom: 20 }}>
                Next-generation multi-agent intelligence fusion platform for defense, law enforcement, and criminal intelligence units worldwide.
              </p>

              {/* Live Operational Status Badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 3 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#10B981', fontWeight: 600, letterSpacing: '0.08em' }}>
                  ALL SYSTEMS OPERATIONAL (99.99%)
                </span>
              </div>
            </div>

            {/* Column 2: Platform */}
            <div>
              <h4 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 700, color: '#F8FAFC', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
                Platform Modules
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <li><a href="#studios" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none' }}>Data Studio</a></li>
                <li><a href="#studios" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none' }}>AI Intelligence Studio</a></li>
                <li><a href="#studios" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none' }}>Entity Graph Engine</a></li>
                <li><a href="#studios" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none' }}>Experimental Lab</a></li>
                <li><button onClick={() => navigate('/app')} style={{ background: 'none', border: 'none', padding: 0, color: '#00C8F0', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>Launch Portal →</button></li>
              </ul>
            </div>

            {/* Column 3: Security & Governance */}
            <div>
              <h4 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 700, color: '#F8FAFC', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
                Security & Air-Gap
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <li><a href="#security" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none' }}>SCIF Deployment</a></li>
                <li><a href="#security" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none' }}>TS//SCI Compliance</a></li>
                <li><a href="#security" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none' }}>Zero-Egress SLA</a></li>
                <li><a href="#security" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none' }}>Audit Log Hashing</a></li>
                <li><a href="#security" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none' }}>Role Clearance L1-L5</a></li>
              </ul>
            </div>

            {/* Column 4: Enterprise & Support */}
            <div>
              <h4 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 700, color: '#F8FAFC', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
                Enterprise & Support
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <li><a href="#telemetry" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none' }}>Documentation</a></li>
                <li><a href="#telemetry" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none' }}>API Connectors</a></li>
                <li><a href="#telemetry" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none' }}>Support Desk</a></li>
                <li><a href="#telemetry" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none' }}>Security Notices</a></li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright Strip */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
            paddingTop: 24, borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={12} style={{ color: '#475569' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#64748B', letterSpacing: '0.05em' }}>
                VIGILX SYSTEMS INC. © 2026 · ALL RIGHTS RESERVED
              </span>
            </div>

            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#475569', letterSpacing: '0.08em' }}>
              CLASSIFIED // AUTHORIZED PERSONNEL ONLY // BUILD 2.0.1-STABLE
            </span>
          </div>

        </div>
      </footer>

    </div>
  )
}
