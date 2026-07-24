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
      <div className="pb-2 border-b border-[#21262D]/60">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">System Settings</h1>
        <p className="text-xs text-[#8B949E] mt-1">Configure clearance roles, API integrations, security policies & preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left Section Navigation */}
        <div className="w-full md:w-56 flex-shrink-0 space-y-1 bg-[#161B22]/40 p-2 rounded-xl border border-[#21262D]">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              id={`settings-${s.id}`}
              onClick={() => setActiveSection(s.id)}
              className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: activeSection === s.id ? 'rgba(0,240,255,0.12)' : 'transparent',
                color: activeSection === s.id ? '#00F0FF' : '#8B949E',
                border: activeSection === s.id ? '1px solid rgba(0,240,255,0.25)' : '1px solid transparent',
              }}
            >
              <s.icon size={15} />
              {s.label}
            </button>
          ))}
        </div>

        {/* Right Section Content Panel */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 w-full glass rounded-xl p-6 border border-[#21262D]"
        >
          {activeSection === 'profile' && (
            <div className="space-y-5">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Profile Information</h2>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#161B22]/60 border border-[#21262D]">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-black text-white bg-gradient-to-br from-[#BF5AF2] to-[#8B5CF6] shadow-lg shadow-[#BF5AF2]/20">
                  OF
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Officer Admin</p>
                  <p className="text-xs text-[#8B949E] mt-0.5">Level 5 Clearance · Jurisdiction: Metropolitan Police HQ</p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#30D158]/10 text-[#30D158] border border-[#30D158]/20">
                    Active Duty
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[{ label: 'Display Name', val: 'Officer Admin' }, { label: 'Badge ID', val: 'A-5041' }, { label: 'Department', val: 'Cyber Intelligence Unit' }, { label: 'Email', val: 'officer@vigilx.gov' }].map((f) => (
                  <div key={f.label}>
                    <label className="block text-xs font-medium text-[#8B949E] mb-1.5">{f.label}</label>
                    <input defaultValue={f.val} className="w-full bg-[#070A0F] border border-[#30363D] focus:border-[#00F0FF] text-white text-xs px-3.5 py-2.5 rounded-lg outline-none" />
                  </div>
                ))}
              </div>
              <button className="btn-solid-cyan px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2">
                <Save size={14} /> Save Profile Changes
              </button>
            </div>
          )}

          {activeSection === 'api' && (
            <div className="space-y-5">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">API Key Management</h2>
              {[{ name: 'VigilX Backend API', key: 'vx-sk-a8f2c9b1d4e7f0a3...', status: 'active' }, { name: 'OpenAI Integration', key: 'sk-proj-xxxx...', status: 'active' }, { name: 'Neo4j Graph API', key: 'neo4j-key-xxxx...', status: 'inactive' }].map((k) => (
                <div key={k.name} className="flex items-center justify-between p-4 rounded-xl bg-[#161B22]/60 border border-[#21262D]">
                  <div>
                    <p className="text-xs font-bold text-white">{k.name}</p>
                    <code className="text-xs text-[#8B949E] font-mono mt-1 block">{showKey ? k.key : '••••••••••••••••••••'}</code>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setShowKey(!showKey)} className="text-[#8B949E] hover:text-white transition-colors">
                      {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${k.status === 'active' ? 'bg-[#30D158]/10 text-[#30D158] border border-[#30D158]/20' : 'bg-[#FF3B30]/10 text-[#FF3B30] border border-[#FF3B30]/20'}`}>
                      {k.status}
                    </span>
                  </div>
                </div>
              ))}
              <button className="btn-cyber px-4 py-2 rounded-lg text-xs flex items-center gap-2">
                <Key size={13} /> Generate New API Key
              </button>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Notification Preferences</h2>
              {[
                { label: 'Agent Pipeline Completions', desc: 'Notify when V2 analysis finishes' },
                { label: 'Critical Threat Alerts', desc: 'Immediate alerts for threat level changes' },
                { label: 'Data Sync Completions', desc: 'Notify when ETL pipelines finish' },
                { label: 'New Criminal Network Connections', desc: 'Alert when graph discovers new nodes' },
              ].map((n, i) => (
                <div key={n.label} className="flex items-center justify-between p-4 rounded-xl bg-[#161B22]/40 border border-[#21262D]">
                  <div>
                    <p className="text-xs font-bold text-white">{n.label}</p>
                    <p className="text-[11px] text-[#8B949E] mt-0.5">{n.desc}</p>
                  </div>
                  <Toggle defaultOn={i < 2} />
                </div>
              ))}
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Theme & Appearance</h2>
              <div className="p-4 rounded-xl bg-[#161B22]/40 border border-[#21262D]">
                <p className="text-xs font-semibold text-white mb-3">Color Theme Preset</p>
                <div className="flex gap-3">
                  {[
                    { name: 'Cyber Dark', colors: ['#0D1117', '#00F0FF'] },
                    { name: 'Midnight Defense', colors: ['#050810', '#BF5AF2'] },
                    { name: 'Steel HQ', colors: ['#1A1F2C', '#8B949E'] },
                  ].map((t, i) => (
                    <button key={t.name} className="p-3 rounded-xl border flex flex-col items-center gap-2" style={{ border: i === 0 ? '2px solid #00F0FF' : '1px solid #21262D' }}>
                      <div className="flex gap-1.5">
                        {t.colors.map((c) => <div key={c} className="w-4 h-4 rounded" style={{ background: c }} />)}
                      </div>
                      <span className="text-[10px] text-[#8B949E]">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Security Clearance & Governance</h2>
              {[
                { label: 'Two-Factor Authentication', status: 'Enabled', safe: true },
                { label: 'Session Timeout', status: '30 minutes', safe: true },
                { label: 'IP Whitelist Enforcement', status: '3 addresses', safe: true },
                { label: 'Audit Trail Signature Logging', status: 'Active', safe: true },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between p-4 rounded-xl bg-[#161B22]/40 border border-[#21262D]">
                  <div className="flex items-center gap-3">
                    <Shield size={16} className="text-[#30D158]" />
                    <p className="text-xs font-bold text-white">{s.label}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#30D158]/10 text-[#30D158] border border-[#30D158]/20 uppercase">
                    {s.status}
                  </span>
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
      className="relative w-9 h-5 rounded-full transition-colors flex-shrink-0"
      style={{ background: on ? '#00F0FF' : '#30363D' }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform"
        style={{ transform: on ? 'translateX(16px)' : 'translateX(0)' }}
      />
    </button>
  )
}
