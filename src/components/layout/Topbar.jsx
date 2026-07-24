import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, ChevronDown, Activity, X } from 'lucide-react'
import useAppStore from '../../store/useAppStore'

export default function Topbar() {
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchVal, setSearchVal]         = useState('')
  const [showNotifs, setShowNotifs]       = useState(false)
  const notifications = useAppStore((s) => s.notifications)
  const markAllRead   = useAppStore((s) => s.markAllRead)
  const unread        = notifications.filter((n) => !n.read).length

  return (
    <header
      className="flex items-center gap-3 flex-shrink-0 relative z-40"
      style={{
        height: 56,
        padding: '0 24px',
        background: 'rgba(13,17,23,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Search */}
      <div className="relative" style={{ flex: '1 1 0', maxWidth: 380 }}>
        <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Search intelligence, cases, agents..."
          style={{
            width: '100%',
            paddingLeft: 30, paddingRight: searchVal ? 30 : 10,
            paddingTop: 7, paddingBottom: 7,
            borderRadius: 8,
            fontSize: 13,
            color: '#fff',
            background: 'rgba(22,27,34,0.85)',
            border: `1px solid ${searchFocused ? 'rgba(0,240,255,0.4)' : 'rgba(33,38,45,1)'}`,
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: searchFocused ? '0 0 0 2px rgba(0,240,255,0.08)' : 'none',
          }}
        />
        {searchVal && (
          <button
            onClick={() => setSearchVal('')}
            style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          >
            <X size={12} />
          </button>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Live status pill */}
      <div
        className="hidden-sm flex items-center gap-1.5"
        style={{
          padding: '5px 10px',
          borderRadius: 8,
          background: 'rgba(0,240,255,0.06)',
          border: '1px solid rgba(0,240,255,0.12)',
          whiteSpace: 'nowrap',
        }}
      >
        <Activity size={12} style={{ color: '#00F0FF' }} />
        <span style={{ fontSize: 11, color: '#00F0FF', fontWeight: 600 }}>3 Agents Active</span>
        <div className="status-dot active" />
      </div>

      {/* Notification Bell */}
      <div style={{ position: 'relative' }}>
        <button
          id="notif-btn"
          onClick={() => setShowNotifs(!showNotifs)}
          className="flex items-center justify-center rounded-lg transition-colors hover:bg-white/5"
          style={{ width: 36, height: 36, border: '1px solid rgba(33,38,45,1)', position: 'relative' }}
        >
          <Bell size={15} style={{ color: 'var(--text-secondary)' }} />
          {unread > 0 && (
            <span
              style={{
                position: 'absolute', top: -3, right: -3,
                width: 16, height: 16, borderRadius: '50%',
                background: 'var(--accent-red)', color: '#000',
                fontSize: 9, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'pulseDot 2s ease-in-out infinite',
              }}
            >
              {unread}
            </span>
          )}
        </button>

        <AnimatePresence>
          {showNotifs && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.14 }}
              style={{
                position: 'absolute', right: 0, top: 44,
                width: 300,
                borderRadius: 12,
                overflow: 'hidden',
                zIndex: 60,
                background: 'rgba(22,27,34,0.98)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid rgba(33,38,45,1)' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Notifications</span>
                <button onClick={markAllRead} style={{ fontSize: 11, color: '#00F0FF', cursor: 'pointer', background: 'none', border: 'none' }}>
                  Mark all read
                </button>
              </div>
              <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      padding: '10px 14px',
                      borderBottom: '1px solid rgba(33,38,45,0.5)',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                  >
                    <div className={`status-dot ${n.read ? 'idle' : 'active'}`} style={{ marginTop: 4, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 12, color: n.read ? 'var(--text-secondary)' : '#fff', lineHeight: 1.4 }}>{n.text}</p>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User button */}
      <button
        className="flex items-center gap-2 rounded-lg transition-colors hover:bg-white/5"
        style={{ padding: '5px 10px', border: '1px solid rgba(33,38,45,1)', cursor: 'pointer' }}
      >
        <div
          className="flex items-center justify-center rounded-full text-white font-black"
          style={{ width: 26, height: 26, background: 'linear-gradient(135deg,#BF5AF2,#8B5CF6)', fontSize: 10 }}
        >
          OF
        </div>
        <span style={{ fontSize: 13, color: '#fff' }}>Officer</span>
        <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} />
      </button>
    </header>
  )
}
