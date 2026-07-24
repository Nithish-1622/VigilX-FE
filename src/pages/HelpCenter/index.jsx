import { motion } from 'framer-motion'
import { HelpCircle, Book, Video, Activity, ChevronRight, ExternalLink, CheckCircle } from 'lucide-react'

const DOCS = [
  { title: 'Getting Started with VigilX', desc: 'Set up your account and connect your first data source.', tag: 'Guide' },
  { title: 'Understanding Multi-Agent Pipelines', desc: 'How V2 agents collaborate to process complex queries.', tag: 'Architecture' },
  { title: 'Universal DB Connector Guide', desc: 'Connect PostgreSQL, MongoDB, Neo4j, and more.', tag: 'Tutorial' },
  { title: 'Reading Investigation Reports', desc: 'How to interpret confidence scores, key findings, and recommendations.', tag: 'Reference' },
  { title: 'Crime Hotspot Map Integration', desc: 'Configure Leaflet map with live data feeds.', tag: 'Integration' },
  { title: 'API Reference', desc: 'Full documentation of all VigilX backend endpoints.', tag: 'API' },
]

const SYSTEM_STATUS = [
  { service: 'VigilX Backend API', status: 'operational', uptime: '99.98%' },
  { service: 'Multi-Agent Orchestrator', status: 'operational', uptime: '99.94%' },
  { service: 'PostgreSQL Adapter', status: 'operational', uptime: '100%' },
  { service: 'Neo4j Graph Engine', status: 'operational', uptime: '99.87%' },
  { service: 'Vector Store', status: 'degraded', uptime: '98.2%' },
  { service: 'Geospatial Service', status: 'operational', uptime: '99.99%' },
]

export default function HelpCenter() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Help Center</h1>
        <p className="text-sm text-text-secondary mt-0.5">Documentation · Tutorials · System Status</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Docs */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Documentation</h2>
          {DOCS.map((doc, i) => (
            <motion.div
              key={doc.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-4 flex items-center gap-4 hover:border-border-active transition-all cursor-pointer group"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <Book size={16} className="text-accent-cyan flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white group-hover:text-accent-cyan transition-colors">{doc.title}</p>
                <p className="text-xs text-text-muted mt-0.5">{doc.desc}</p>
              </div>
              <span className="tag-cyan flex-shrink-0">{doc.tag}</span>
              <ExternalLink size={13} className="text-text-muted flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* System Status */}
        <div>
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">System Status</h2>
          <div className="glass rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Activity size={13} className="text-accent-green" />
                <span className="text-xs font-medium text-white">All Systems</span>
              </div>
              <span className="tag-green">Mostly Operational</span>
            </div>
            <div className="divide-y divide-border-subtle/50">
              {SYSTEM_STATUS.map((s) => (
                <div key={s.service} className="flex items-center gap-3 px-4 py-3">
                  <div className={`status-dot ${s.status === 'operational' ? 'active' : 'error'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate">{s.service}</p>
                    <p className="text-[10px] text-text-muted">{s.uptime} uptime</p>
                  </div>
                  <span className={s.status === 'operational' ? 'text-accent-green' : 'text-accent-red'} style={{ fontSize: '10px' }}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-4 glass rounded-2xl p-4" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Quick Help</p>
            {[
              'Submit a Support Ticket',
              'Join the VigilX Community',
              'View Changelog',
              'Contact Ops Team',
            ].map((link) => (
              <button key={link} className="flex items-center justify-between w-full py-2 text-xs text-text-secondary hover:text-accent-cyan transition-colors group">
                {link}
                <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
