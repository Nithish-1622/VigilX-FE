import React, { useEffect, useRef, useState, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { IntelligenceSphere } from './components/IntelligenceSphere'
import {
  Shield,
  MessageSquare,
  Search,
  FileText,
  Users,
  Brain,
  Clock,
  Database,
  ChevronRight,
  ArrowRight,
  Activity,
  Cpu,
  Lock,
  CheckCircle,
  BarChart3,
  Network
} from 'lucide-react'

// --- Animated Stat Counter ---
const StatCounter = ({ target, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    const steps = 60
    const increment = target / steps
    const intervalMs = duration / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, intervalMs)
    return () => clearInterval(timer)
  }, [started, target, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// --- Crime Network SVG Background ---
const NetworkBackground = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#4b6fff" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
    {/* Connection lines */}
    <line x1="15%" y1="20%" x2="40%" y2="45%" stroke="#4b6fff" strokeWidth="0.8" strokeDasharray="4 4" />
    <line x1="40%" y1="45%" x2="70%" y2="30%" stroke="#4b6fff" strokeWidth="0.8" strokeDasharray="4 4" />
    <line x1="70%" y1="30%" x2="85%" y2="60%" stroke="#4b6fff" strokeWidth="0.8" strokeDasharray="4 4" />
    <line x1="40%" y1="45%" x2="55%" y2="70%" stroke="#4b6fff" strokeWidth="0.8" strokeDasharray="4 4" />
    <line x1="25%" y1="65%" x2="55%" y2="70%" stroke="#4b6fff" strokeWidth="0.8" strokeDasharray="4 4" />
    {/* Nodes */}
    <circle cx="15%" cy="20%" r="3" fill="#3b82f6" opacity="0.7" />
    <circle cx="40%" cy="45%" r="5" fill="#3b82f6" opacity="0.9" />
    <circle cx="70%" cy="30%" r="3" fill="#3b82f6" opacity="0.7" />
    <circle cx="85%" cy="60%" r="2.5" fill="#3b82f6" opacity="0.6" />
    <circle cx="55%" cy="70%" r="3.5" fill="#3b82f6" opacity="0.7" />
    <circle cx="25%" cy="65%" r="2" fill="#3b82f6" opacity="0.5" />
  </svg>
)

const CAPABILITIES = [
  {
    icon: MessageSquare,
    title: 'Conversational Investigation',
    desc: 'Interrogate case files, suspect records, and evidence using natural language queries.',
  },
  {
    icon: Brain,
    title: 'Multi-Agent Reasoning',
    desc: 'LangGraph-powered agent chains reason across SQL databases and vector memory simultaneously.',
  },
  {
    icon: Search,
    title: 'Semantic Evidence Retrieval',
    desc: 'Retrieve semantically relevant evidence records without exact keyword matching.',
  },
  {
    icon: FileText,
    title: 'Case Intelligence Reports',
    desc: 'Automatically summarize FIR cases, timelines, and investigation diaries on demand.',
  },
  {
    icon: Users,
    title: 'Suspect Intelligence',
    desc: 'Cross-reference accused profiles, prior convictions, and relational links across cases.',
  },
  {
    icon: Clock,
    title: 'Timeline Reconstruction',
    desc: 'Reconstruct incident timelines from disparate evidence sources and investigation logs.',
  },
]

const WORKFLOW_STEPS = [
  { n: '01', label: 'Officer Query', desc: 'Natural language question submitted by investigating officer.' },
  { n: '02', label: 'AI Agent', desc: 'VigilX agentic engine activates LangGraph reasoning workflow.' },
  { n: '03', label: 'Evidence Retrieval', desc: 'Parallel RAG + SQL retrieval across all connected databases.' },
  { n: '04', label: 'Multi-Agent Reasoning', desc: 'Llama-3.3-70B reasons across retrieved evidence and context.' },
  { n: '05', label: 'Intelligence Output', desc: 'Structured answer with citations, confidence, and intent classification.' },
]

const METRICS = [
  { label: 'Cases Processed', target: 1240, suffix: '+' },
  { label: 'AI Investigations', target: 3870, suffix: '+' },
  { label: 'Evidence Items', target: 18600, suffix: '+' },
  { label: 'AI Queries Resolved', target: 5200, suffix: '+' },
  { label: 'Clearance Rate', target: 86, suffix: '%' },
]

export const LandingPage = () => {
  const navigate = useNavigate()
  const capabilitiesRef = useRef(null)

  const scrollToCapabilities = () => {
    capabilitiesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#07090f] text-slate-100 font-sans overflow-x-hidden">

      {/* ── TOP CLASSIFICATION BAR ── */}
      <div className="w-full bg-[#0d1117] border-b border-[#1e2d3d] px-6 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#dc2626] uppercase border border-[#dc2626]/40 px-2 py-0.5 rounded-sm bg-[#dc2626]/5">
            Government Restricted
          </span>
          <span className="text-[10px] font-mono text-slate-500 hidden sm:block">
            Authorized Law Enforcement Personnel Only — All Access Logged
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
          System Operational
        </div>
      </div>

      {/* ── SECTION 1: HERO ── */}
      <section className="relative min-h-[calc(100vh-36px)] flex flex-col">
        <NetworkBackground />

        {/* Nav Header */}
        <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-[#1e2d3d]/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0d1117] border border-[#1e2d3d] flex items-center justify-center rounded-sm">
              <Shield className="w-4 h-4 text-[#2563eb]" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-widest text-white">
                VIGIL<span className="text-[#2563eb]">X</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono block -mt-0.5 leading-tight">
                CRIME INTELLIGENCE PLATFORM
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
            <button onClick={scrollToCapabilities} className="hover:text-slate-200 transition-colors cursor-pointer">
              Capabilities
            </button>
            <button onClick={() => capabilitiesRef.current?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-slate-200 transition-colors cursor-pointer">
              How It Works
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-slate-400 border border-[#1e2d3d] px-4 py-1.5 rounded-sm hover:border-[#2563eb]/60 hover:text-slate-200 transition-all"
            >
              Sign In
            </button>
          </nav>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 px-8 py-16 max-w-7xl mx-auto w-full">

          {/* Left: Text Block */}
          <div className="flex-1 max-w-2xl">

            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-6 h-px bg-[#2563eb]" />
              <span className="text-[11px] font-mono font-semibold tracking-widest text-[#2563eb] uppercase">
                AI-Powered Intelligence Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight text-white leading-[1.1] mb-6">
              Crime Intelligence.{' '}
              <br />
              <span className="text-[#2563eb]">Powered by</span>
              <br />
              Conversational AI.
            </h1>

            {/* Subheading */}
            <p className="text-base text-slate-400 leading-relaxed max-w-xl mb-10">
              VigilX is an AI-powered investigation platform for law enforcement agencies.
              Interrogate evidence, reason across case files, and generate crime intelligence
              using natural language — powered by Llama-3.3-70B and multi-agent reasoning.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Primary CTA */}
              <button
                id="cta-start-investigation"
                onClick={() => navigate('/ai')}
                className="flex items-center justify-center gap-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-7 py-3.5 rounded-sm text-sm font-semibold transition-all duration-200 cursor-pointer shadow-lg shadow-blue-900/30"
              >
                <Cpu className="w-4 h-4" />
                <span>Start AI Investigation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary CTA */}
              <button
                id="cta-command-center"
                onClick={() => navigate('/dashboard')}
                className="flex items-center justify-center gap-2.5 bg-transparent border border-[#1e2d3d] hover:border-[#2563eb]/50 hover:bg-[#0d1117] text-slate-300 hover:text-white px-7 py-3.5 rounded-sm text-sm font-medium transition-all duration-200 cursor-pointer"
              >
                <Activity className="w-4 h-4" />
                <span>Open Command Center</span>
              </button>
            </div>

            {/* Tertiary / Learn More */}
            <button
              onClick={scrollToCapabilities}
              className="mt-5 flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer group"
            >
              <span>Learn More</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Right: Three.js Intelligence Network Sphere */}
          <div className="hidden lg:flex flex-1 max-w-md items-center justify-center relative">
            <div className="w-full h-[420px] relative">
              {/* Node type legend */}
              <div className="absolute top-0 left-0 z-10 space-y-1.5">
                {[
                  { color: '#3b82f6', label: 'Case / FIR' },
                  { color: '#ef4444', label: 'Suspect' },
                  { color: '#f59e0b', label: 'Victim' },
                  { color: '#8b5cf6', label: 'Evidence' },
                  { color: '#10b981', label: 'Location' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-mono text-slate-500">{item.label}</span>
                  </div>
                ))}
              </div>
              {/* Three.js Canvas */}
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[10px] font-mono text-slate-600">Loading network...</span>
                </div>
              }>
                <IntelligenceSphere />
              </Suspense>
              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 text-center">
                <span className="text-[10px] font-mono text-slate-600">Crime Intelligence Network · Drag to explore</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#07090f] to-transparent pointer-events-none" />
      </section>

      {/* ── SECTION 2: PLATFORM CAPABILITIES ── */}
      <section ref={capabilitiesRef} id="capabilities" className="relative py-24 px-8 border-t border-[#1e2d3d]">
        <div className="max-w-7xl mx-auto">

          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-px bg-[#2563eb]" />
              <span className="text-[11px] font-mono font-semibold tracking-widest text-[#2563eb] uppercase">
                Platform Capabilities
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Built for Intelligence-Driven Investigations
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Every feature is designed to reduce investigation friction and accelerate evidence-based decision making.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1e2d3d]">
            {CAPABILITIES.map((cap) => {
              const Icon = cap.icon
              return (
                <div
                  key={cap.title}
                  className="bg-[#07090f] hover:bg-[#0d1117] transition-colors p-6 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-[#0d1117] border border-[#1e2d3d] group-hover:border-[#2563eb]/40 flex items-center justify-center rounded-sm shrink-0 transition-colors">
                      <Icon className="w-4 h-4 text-[#2563eb]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100 mb-1">{cap.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{cap.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: HOW IT WORKS ── */}
      <section className="py-24 px-8 border-t border-[#1e2d3d]">
        <div className="max-w-7xl mx-auto">

          <div className="mb-14">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-px bg-[#2563eb]" />
              <span className="text-[11px] font-mono font-semibold tracking-widest text-[#2563eb] uppercase">
                Investigation Workflow
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              How VigilX Processes an Investigation
            </h2>
          </div>

          {/* Step flow */}
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-6 left-[40px] right-[40px] h-px bg-[#1e2d3d] hidden lg:block" />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {WORKFLOW_STEPS.map((step, i) => (
                <div key={step.n} className="relative flex flex-col items-start lg:items-center text-left lg:text-center">
                  {/* Step number bubble */}
                  <div className="relative z-10 w-12 h-12 bg-[#0d1117] border border-[#1e2d3d] rounded-sm flex items-center justify-center mb-4 shrink-0">
                    <span className="text-[11px] font-mono font-bold text-[#2563eb]">{step.n}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200 mb-2">{step.label}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 4: PLATFORM METRICS ── */}
      <section className="py-24 px-8 border-t border-[#1e2d3d] bg-[#0d1117]">
        <div className="max-w-7xl mx-auto">

          <div className="mb-14 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-6 h-px bg-[#2563eb]" />
              <span className="text-[11px] font-mono font-semibold tracking-widest text-[#2563eb] uppercase">
                Platform Statistics
              </span>
              <span className="w-6 h-px bg-[#2563eb]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Intelligence at Scale
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-[#1e2d3d]">
            {METRICS.map((metric) => (
              <div key={metric.label} className="bg-[#0d1117] px-6 py-8 text-center">
                <div className="text-3xl md:text-4xl font-bold font-mono text-white mb-2">
                  <StatCounter target={metric.target} suffix={metric.suffix} />
                </div>
                <div className="text-xs text-slate-400 font-medium">{metric.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── SECTION 5: FOOTER ── */}
      <footer className="py-12 px-8 border-t border-[#1e2d3d] bg-[#07090f]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <Shield className="w-4 h-4 text-[#2563eb]" />
                <span className="text-sm font-bold tracking-widest text-white">
                  VIGIL<span className="text-[#2563eb]">X</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-xs">
                AI-Powered Crime Intelligence Platform for Law Enforcement Agencies.
                Government Restricted System — v1.0.2
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={() => navigate('/ai')}
                className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-sm text-xs font-semibold transition-colors cursor-pointer"
              >
                <Cpu className="w-3.5 h-3.5" />
                Start AI Investigation
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 border border-[#1e2d3d] hover:border-[#2563eb]/50 text-slate-400 hover:text-slate-200 px-5 py-2.5 rounded-sm text-xs font-medium transition-colors cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5" />
                Command Center
              </button>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-[#1e2d3d]/60 flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] font-mono text-slate-600">
            <span>© 2026 VigilX Intelligence Platform. All Rights Reserved.</span>
            <div className="flex items-center gap-4">
              <span>CLASSIFICATION: RESTRICTED</span>
              <span className="text-[#1e2d3d]">·</span>
              <span>AUDIT_LOGGING: ACTIVE</span>
              <span className="text-[#1e2d3d]">·</span>
              <span>ENCRYPTION: AES-256</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
