import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Suspense, lazy } from 'react'
import { Shield, ArrowRight, Eye, Globe, Network } from 'lucide-react'

const ParticleNetwork = lazy(() => import('../components/three/ParticleNetwork'))

const FEATURES = [
  { icon: Eye,     label: 'Multi-Agent Intelligence',  desc: 'Decentralized AI agents work in concert to surface non-obvious insights from siloed data sources.' },
  { icon: Globe,   label: 'Geospatial Analysis',       desc: 'Real-time crime hotspot mapping with predictive overlay across jurisdictions.' },
  { icon: Network, label: 'Criminal Network Graph',    desc: 'Visualize syndicate structures, relationships, and hidden connections through graph traversal.' },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}
const item = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#0D1117',
        overflow: 'hidden',
      }}
    >
      {/* 3D Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Suspense fallback={null}>
          <ParticleNetwork />
        </Suspense>
      </div>

      {/* Gradient overlays */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(0,240,255,0.06) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to top, #0D1117, transparent)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(to bottom, rgba(13,17,23,0.7), transparent)' }} />
      </div>

      {/* Header */}
      <header
        style={{
          position: 'relative', zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 40px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(0,128,255,0.2))',
            border: '1px solid rgba(0,240,255,0.4)',
            boxShadow: '0 0 18px rgba(0,240,255,0.2)',
          }}>
            <Shield size={19} style={{ color: '#00F0FF' }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '0.06em', color: '#fff' }}>
            VIGIL<span style={{ color: '#00F0FF' }}>X</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 20, fontSize: 12,
            background: 'rgba(0,240,255,0.08)',
            border: '1px solid rgba(0,240,255,0.2)',
            color: '#00F0FF',
          }}>
            <div className="status-dot active" />
            Systems Online
          </div>
        </motion.div>
      </header>

      {/* ── Hero ── */}
      <main
        style={{
          position: 'relative', zIndex: 10,
          flex: 1,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px 40px',
        }}
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          style={{ maxWidth: 820, width: '100%' }}
        >
          {/* Badge */}
          <motion.div variants={item} style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 18px', borderRadius: 20, fontSize: 11, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              background: 'rgba(0,240,255,0.08)',
              border: '1px solid rgba(0,240,255,0.2)',
              color: '#00F0FF',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00F0FF', display: 'inline-block', animation: 'pulseDot 2s ease-in-out infinite' }} />
              Next-Generation Multi-Agent AI Platform
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            style={{ fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1, margin: '0 0 16px', fontSize: 'clamp(48px, 8vw, 88px)' }}
          >
            <span style={{ color: '#fff' }}>Intelligence,</span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #00F0FF, #0080FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
            }}>
              Unified.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={item}
            style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.6 }}
          >
            Transform raw, siloed data into actionable intelligence. VigilX deploys a decentralized
            network of specialized AI agents to map criminal syndicates, predict threats, and
            surface non-obvious connections at unprecedented scale.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={item} style={{ display: 'flex', gap: 14, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginBottom: 44 }}>
            <motion.button
              id="enter-portal-btn"
              onClick={() => navigate('/app/home')}
              className="btn-solid-cyan"
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', padding: '14px 28px', borderRadius: 12 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Enter Secure Portal
              <ArrowRight size={16} />
            </motion.button>
            <motion.button
              onClick={() => navigate('/app/ai-studio')}
              className="btn-cyber"
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '14px 28px', borderRadius: 12 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Try AI Studio
            </motion.button>
          </motion.div>

          {/* Stats Row */}
          <motion.div variants={item} style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
            {[
              { val: '20+',   label: 'AI Agents'     },
              { val: '12',    label: 'DB Adapters'   },
              { val: '99.9%', label: 'Uptime'        },
              { val: '<2s',   label: 'Response Time' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#00F0FF', textShadow: '0 0 20px rgba(0,240,255,0.5)' }}>{s.val}</div>
                <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* ── Feature Cards ── */}
      <section style={{ position: 'relative', zIndex: 10, padding: '0 40px 48px' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}
        >
          {FEATURES.map((f) => <FeatureCard key={f.label} feature={f} />)}
        </motion.div>
      </section>
    </div>
  )
}

function FeatureCard({ feature }) {
  const { icon: Icon, label, desc } = feature
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass"
      style={{ borderRadius: 18, padding: '22px', cursor: 'default', transition: 'border-color 0.3s', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 10, marginBottom: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.2)',
      }}>
        <Icon size={18} style={{ color: '#00F0FF' }} />
      </div>
      <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{label}</h3>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{desc}</p>
    </motion.div>
  )
}
