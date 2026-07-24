import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, User, Key, Bell, Palette, Shield, Save, Eye, EyeOff } from 'lucide-react'

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'security', label: 'Security', icon: Shield },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile')
  const [showKey, setShowKey] = useState(false)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 flex-shrink-0 space-y-1">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              id={`settings-${s.id}`}
              onClick={() => setActiveSection(s.id)}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm transition-all"
              style={{
                background: activeSection === s.id ? 'rgba(0,240,255,0.08)' : 'transparent',
                color: activeSection === s.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                border: activeSection === s.id ? '1px solid rgba(0,240,255,0.15)' : '1px solid transparent',
              }}
            >
              <s.icon size={14} />
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 glass rounded-2xl p-6"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {activeSection === 'profile' && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-white">Profile Information</h2>
              <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'rgba(13,17,23,0.5)', border: '1px solid var(--border-subtle)' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black"
                  style={{ background: 'linear-gradient(135deg, #BF5AF2, #8B5CF6)' }}
                >
                  OF
                </div>
                <div>
                  <p className="text-base font-bold text-white">Officer Admin</p>
                  <p className="text-xs text-text-muted">Level 5 Clearance · Jurisdiction: Metropolitan</p>
                  <p className="tag-green mt-1">Active Duty</p>
                </div>
              </div>
              {[{ label: 'Display Name', val: 'Officer Admin' }, { label: 'Badge ID', val: 'A-5041' }, { label: 'Department', val: 'Cyber Intelligence Unit' }, { label: 'Email', val: 'officer@vigilx.gov' }].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs text-text-secondary mb-1.5">{f.label}</label>
                  <input defaultValue={f.val} className="input-cyber w-full" />
                </div>
              ))}
              <button className="btn-solid-cyan flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm">
                <Save size={14} /> Save Changes
              </button>
            </div>
          )}

          {activeSection === 'api' && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-white">API Key Management</h2>
              {[{ name: 'VigilX Backend API', key: 'vx-sk-a8f2c9b1d4e7f0a3...', status: 'active' }, { name: 'OpenAI Integration', key: 'sk-proj-xxxx...', status: 'active' }, { name: 'Neo4j Graph API', key: 'neo4j-key-xxxx...', status: 'inactive' }].map((k) => (
                <div key={k.name} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'rgba(13,17,23,0.5)', border: '1px solid var(--border-active)' }}>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{k.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs text-text-muted mono">{showKey ? k.key : '••••••••••••••••••••'}</code>
                    </div>
                  </div>
                  <button onClick={() => setShowKey(!showKey)} className="text-text-muted hover:text-white transition-colors">
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <span className={k.status === 'active' ? 'tag-green' : 'tag-red'}>{k.status}</span>
                </div>
              ))}
              <button className="btn-cyber flex items-center gap-2 px-4 py-2 rounded-lg text-sm">
                <Key size={13} /> Generate New Key
              </button>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-white">Notification Preferences</h2>
              {[
                { label: 'Agent Pipeline Completions', desc: 'Notify when V2 analysis finishes' },
                { label: 'Critical Threat Alerts', desc: 'Immediate alerts for threat level changes' },
                { label: 'Data Sync Completions', desc: 'Notify when ETL pipelines finish' },
                { label: 'New Criminal Network Connections', desc: 'Alert when graph discovers new nodes' },
              ].map((n, i) => (
                <div key={n.label} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(13,17,23,0.5)', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <p className="text-sm font-medium text-white">{n.label}</p>
                    <p className="text-xs text-text-muted mt-0.5">{n.desc}</p>
                  </div>
                  <Toggle defaultOn={i < 2} />
                </div>
              ))}
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-white">Appearance</h2>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(13,17,23,0.5)', border: '1px solid var(--border-subtle)' }}>
                <p className="text-sm text-white mb-3">Color Theme</p>
                <div className="flex gap-3">
                  {[
                    { name: 'Cyber Dark', colors: ['#0D1117', '#00F0FF'] },
                    { name: 'Midnight', colors: ['#050810', '#BF5AF2'] },
                    { name: 'Steel', colors: ['#1A1F2C', '#8B949E'] },
                  ].map((t, i) => (
                    <button key={t.name}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all"
                      style={{ border: i === 0 ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)' }}
                    >
                      <div className="flex gap-1.5">
                        {t.colors.map((c) => <div key={c} className="w-5 h-5 rounded" style={{ background: c }} />)}
                      </div>
                      <span className="text-[10px] text-text-muted">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-white">Security Settings</h2>
              {[
                { label: 'Two-Factor Authentication', status: 'Enabled', safe: true },
                { label: 'Session Timeout', status: '30 minutes', safe: true },
                { label: 'IP Whitelist', status: '3 addresses', safe: true },
                { label: 'Audit Log', status: 'Active', safe: true },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between p-4 rounded-xl"
                  style={{ background: 'rgba(13,17,23,0.5)', border: '1px solid var(--border-subtle)' }}
                >
                  <div className="flex items-center gap-3">
                    <Shield size={15} className="text-accent-green" />
                    <p className="text-sm text-white">{s.label}</p>
                  </div>
                  <span className="tag-green">{s.status}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function Toggle({ defaultOn }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      onClick={() => setOn(!on)}
      className="relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0"
      style={{ background: on ? 'var(--accent-cyan)' : 'var(--border-active)' }}
    >
      <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200"
        style={{ transform: on ? 'translateX(20px)' : 'translateX(0)' }}
      />
    </button>
  )
}
