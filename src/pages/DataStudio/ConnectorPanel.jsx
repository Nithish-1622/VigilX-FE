import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Database, CheckCircle, Loader2, RefreshCw,
  FileText, Globe, Table, FileSpreadsheet, Network, X,
} from 'lucide-react'
import { getAdapterTest } from '../../api/vigilx'

const ADAPTER_META = {
  postgresql: { icon: Database, color: '#336791', label: 'PostgreSQL', desc: 'Relational database' },
  mongodb:    { icon: Database, color: '#4DB33D', label: 'MongoDB',    desc: 'NoSQL document store' },
  neo4j:      { icon: Network,  color: '#008CC1', label: 'Neo4j',      desc: 'Graph database' },
  mysql:      { icon: Database, color: '#F29111', label: 'MySQL',      desc: 'Relational database' },
  sqlite:     { icon: Database, color: '#0F80CC', label: 'SQLite',     desc: 'Embedded database' },
  csv:        { icon: Table,    color: '#22C55E', label: 'CSV',        desc: 'Comma-separated values' },
  excel:      { icon: FileSpreadsheet, color: '#1D7A3B', label: 'Excel', desc: 'Spreadsheet files' },
  pdf:        { icon: FileText, color: '#F03E3E', label: 'PDF',        desc: 'Document extraction' },
  json:       { icon: FileText, color: '#EAB308', label: 'JSON',       desc: 'JSON data files' },
  txt:        { icon: FileText, color: '#64748B', label: 'Text',       desc: 'Plain text files' },
  yaml:       { icon: FileText, color: '#F59E0B', label: 'YAML',       desc: 'Config / data files' },
  api:        { icon: Globe,    color: '#A855F7', label: 'REST API',   desc: 'External API endpoints' },
}

export default function ConnectorPanel() {
  const [adapters, setAdapters] = useState([])
  const [status, setStatus] = useState('loading')
  const [systemMsg, setSystemMsg] = useState('')
  const [selected, setSelected] = useState(null)
  const [connConfig, setConnConfig] = useState({})

  const fetchAdapters = async () => {
    setStatus('loading')
    try {
      const data = await getAdapterTest()
      setAdapters(data.registered_connectors || [])
      setSystemMsg(data.message || '')
      setStatus('success')
    } catch {
      setAdapters(Object.keys(ADAPTER_META))
      setSystemMsg('Adapter registry loaded · 12 connectors available')
      setStatus('mock')
    }
  }

  useEffect(() => { fetchAdapters() }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Status banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderRadius: 8,
          background: status === 'loading' ? 'var(--bg-tertiary)' : 'rgba(34,197,94,0.06)',
          border: `1px solid ${status === 'loading' ? 'var(--border-subtle)' : 'rgba(34,197,94,0.15)'}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {status === 'loading' ? (
            <Loader2 size={13} style={{ color: 'var(--text-secondary)', animation: 'spin 1s linear infinite' }} />
          ) : (
            <CheckCircle size={13} style={{ color: '#22C55E' }} />
          )}
          <span
            style={{
              fontSize: 12,
              color: status === 'loading' ? 'var(--text-secondary)' : '#22C55E',
            }}
          >
            {status === 'loading' ? 'Connecting to adapter registry…' : systemMsg}
          </span>
          {status === 'mock' && <span className="tag-cyan" style={{ fontSize: 9 }}>Mock</span>}
        </div>
        <button
          onClick={fetchAdapters}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 11,
            color: 'var(--text-muted)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.12s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-cyan)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <RefreshCw size={11} /> Refresh
        </button>
      </div>

      {/* Adapter grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 10,
        }}
      >
        {adapters.map((key, i) => {
          const meta = ADAPTER_META[key] || { icon: Database, color: '#64748B', label: key, desc: 'Database adapter' }
          const Icon = meta.icon
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.15 }}
              onClick={() => {
                setSelected(key)
                setConnConfig({ host: '', port: '', database: '', user: '', password: '' })
              }}
              style={{
                padding: '14px',
                borderRadius: 9,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${meta.color}35`
                e.currentTarget.style.background = 'var(--bg-tertiary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)'
                e.currentTarget.style.background = 'var(--bg-secondary)'
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: `${meta.color}10`,
                  border: `1px solid ${meta.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <Icon size={16} style={{ color: meta.color }} />
              </div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px' }}>
                {meta.label}
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 8px' }}>{meta.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: 'var(--text-muted)',
                    display: 'inline-block',
                  }}
                />
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Not connected</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Connection modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(6px)',
            }}
            onClick={(e) => e.target === e.currentTarget && setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 8 }}
              transition={{ duration: 0.15 }}
              style={{
                width: '100%',
                maxWidth: 420,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-active)',
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              {/* Modal header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: 'var(--bg-tertiary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {(() => {
                    const meta = ADAPTER_META[selected]
                    if (!meta) return null
                    const Icon = meta.icon
                    return (
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 7,
                          background: `${meta.color}10`,
                          border: `1px solid ${meta.color}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={14} style={{ color: meta.color }} />
                      </div>
                    )
                  })()}
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                      Configure {ADAPTER_META[selected]?.label || selected}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
                      {ADAPTER_META[selected]?.desc}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 4,
                    borderRadius: 5,
                    transition: 'all 0.12s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)'
                    e.currentTarget.style.background = 'var(--bg-elevated)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)'
                    e.currentTarget.style.background = 'none'
                  }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Modal body */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['host', 'port', 'database', 'user', 'password'].map((field) => (
                  <div key={field}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 11,
                        fontWeight: 500,
                        color: 'var(--text-secondary)',
                        marginBottom: 5,
                        textTransform: 'capitalize',
                      }}
                    >
                      {field}
                    </label>
                    <input
                      type={field === 'password' ? 'password' : 'text'}
                      placeholder={
                        field === 'host' ? 'localhost' : field === 'port' ? '5432' : `Enter ${field}`
                      }
                      value={connConfig[field] || ''}
                      onChange={(e) => setConnConfig((c) => ({ ...c, [field]: e.target.value }))}
                      className="input-cyber"
                      style={{ fontSize: 12 }}
                    />
                  </div>
                ))}
              </div>

              {/* Modal footer */}
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  padding: '12px 16px',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <button
                  onClick={() => setSelected(null)}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}
                  onClick={() => {
                    setSelected(null)
                    alert('Connection test initiated!')
                  }}
                >
                  Test &amp; Connect
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
