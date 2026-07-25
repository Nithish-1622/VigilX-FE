import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, ChevronDown, X, Sun, Moon } from 'lucide-react'
import useAppStore from '../../store/useAppStore'

export default function Topbar() {
  const [searchVal, setSearchVal] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const notifications = useAppStore((s) => s.notifications)
  const markAllRead   = useAppStore((s) => s.markAllRead)
  const theme         = useAppStore((s) => s.theme)
  const toggleTheme   = useAppStore((s) => s.toggleTheme)
  const unread = (notifications || []).filter((n) => !n.read).length

  return (
    <header
      className="glass-topbar"
      style={{ height: 'var(--topbar-height)', display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', flexShrink: 0, position: 'relative', zIndex: 40 }}
    >
      {/* Search */}
      <div style={{ position: 'relative', width: 280, flexShrink: 0 }}>
        <Search size={11} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
        <input
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Search cases, suspects, intel…"
          style={{
            width: '100%', height: 30, paddingLeft: 28, paddingRight: searchVal ? 26 : 10,
            borderRadius: 3, fontSize: 12, color: 'var(--text-primary)',
            background: searchFocused ? 'var(--bg-row)' : 'var(--bg-panel)',
            border: `1px solid ${searchFocused ? 'var(--cyan)' : 'var(--border-dim)'}`,
            outline: 'none', transition: 'all 0.12s',
            boxShadow: searchFocused ? '0 0 0 2px rgba(0,200,240,0.07)' : 'none',
            fontFamily: 'inherit',
          }}
        />
        {searchVal && (
          <button onClick={() => setSearchVal('')} style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <X size={10} />
          </button>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Live agent pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 9px', borderRadius: 2, background: 'rgba(22,163,74,0.05)', border: '1px solid rgba(22,163,74,0.12)' }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'pulseDot 2s ease-in-out infinite' }} />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--green)', letterSpacing: '0.04em' }}>3 AGENTS RUNNING</span>
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        style={{ width: 28, height: 28, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid var(--border-dim)', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.12s' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-base)'; e.currentTarget.style.color = 'var(--text-primary)' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-dim)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
      >
        {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
      </button>

      {/* Notifications */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowNotifs(!showNotifs)}
          style={{ width: 28, height: 28, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid var(--border-dim)', cursor: 'pointer', color: 'var(--text-secondary)', position: 'relative', transition: 'all 0.12s' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-base)'; e.currentTarget.style.color = 'var(--text-primary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-dim)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
        >
          <Bell size={12} />
          {unread > 0 && (
            <span style={{ position: 'absolute', top: -3, right: -3, width: 13, height: 13, borderRadius: '50%', background: 'var(--red)', color: '#fff', fontSize: 8, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--bg-canvas)' }}>
              {unread}
            </span>
          )}
        </button>

        <AnimatePresence>
          {showNotifs && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 50 }} onClick={() => setShowNotifs(false)} />
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.1 }}
                style={{ position: 'absolute', right: 0, top: 36, width: 280, borderRadius: 3, zIndex: 60, background: 'var(--bg-overlay)', border: '1px solid var(--border-base)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)', overflow: 'hidden' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid var(--border-dim)' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>NOTIFICATIONS</span>
                  <button onClick={markAllRead} style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--cyan)', cursor: 'pointer', background: 'none', border: 'none' }}>MARK ALL READ</button>
                </div>
                <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                  {(notifications || []).map((n) => (
                    <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '9px 12px', borderBottom: '1px solid var(--border-dim)', background: n.read ? 'transparent' : 'rgba(0,200,240,0.02)', cursor: 'pointer', transition: 'background 0.1s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-raised)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(0,200,240,0.02)'}
                    >
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: n.read ? 'var(--text-tertiary)' : 'var(--cyan)', marginTop: 5, flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 11, color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)', lineHeight: 1.4 }}>{n.text}</p>
                        <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-tertiary)', marginTop: 2 }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* User button */}
      <button
        style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '3px 9px 3px 3px', borderRadius: 3, background: 'transparent', border: '1px solid var(--border-dim)', cursor: 'pointer', transition: 'all 0.12s' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-base)' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-dim)' }}
      >
        <div style={{ width: 22, height: 22, borderRadius: 2, background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', fontFamily: 'var(--mono)', flexShrink: 0 }}>OF</div>
        <span style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 500, letterSpacing: '0.01em' }}>Officer</span>
        <ChevronDown size={10} style={{ color: 'var(--text-tertiary)' }} />
      </button>
    </header>
  )
}
