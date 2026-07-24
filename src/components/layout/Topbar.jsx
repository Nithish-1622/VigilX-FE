import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, ChevronDown, Activity, X, Sun, Moon } from 'lucide-react'
import useAppStore from '../../store/useAppStore'

export default function Topbar() {
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [showNotifs, setShowNotifs] = useState(false)
  const notifications = useAppStore((s) => s.notifications)
  const markAllRead = useAppStore((s) => s.markAllRead)
  const unread = notifications.filter((n) => !n.read).length
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 20px',
        background: 'rgba(10, 12, 16, 0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
        position: 'relative',
        zIndex: 40,
      }}
    >
      {/* Search */}
      <div style={{ position: 'relative', flex: '1 1 0', maxWidth: 320 }}>
        <Search
          size={13}
          style={{
            position: 'absolute',
            left: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Search cases, agents, intel..."
          style={{
            width: '100%',
            height: 32,
            paddingLeft: 30,
            paddingRight: searchVal ? 28 : 10,
            borderRadius: 7,
            fontSize: 12,
            color: 'var(--text-primary)',
            background: searchFocused ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
            border: `1px solid ${searchFocused ? 'rgba(0,212,255,0.35)' : 'var(--border-subtle)'}`,
            outline: 'none',
            transition: 'all 0.15s',
            boxShadow: searchFocused ? '0 0 0 3px rgba(0,212,255,0.06)' : 'none',
          }}
        />
        {searchVal && (
          <button
            onClick={() => setSearchVal('')}
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={11} />
          </button>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Live agents pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          borderRadius: 6,
          background: 'rgba(34, 197, 94, 0.06)',
          border: '1px solid rgba(34, 197, 94, 0.12)',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--accent-green)',
            boxShadow: '0 0 0 2px rgba(34,197,94,0.2)',
            display: 'inline-block',
          }}
        />
        <span style={{ fontSize: 11, color: 'var(--accent-green)', fontWeight: 500 }}>3 agents running</span>
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: '1px solid var(--border-subtle)',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          transition: 'all 0.15s',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--bg-tertiary)'
          e.currentTarget.style.borderColor = 'var(--border-active)'
          e.currentTarget.style.color = 'var(--accent-cyan)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.borderColor = 'var(--border-subtle)'
          e.currentTarget.style.color = 'var(--text-secondary)'
        }}
      >
        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
      </button>

      {/* Notifications */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowNotifs(!showNotifs)}
          style={{
            width: 32,
            height: 32,
            borderRadius: 7,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            position: 'relative',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-tertiary)'
            e.currentTarget.style.borderColor = 'var(--border-active)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'var(--border-subtle)'
          }}
        >
          <Bell size={14} />
          {unread > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -3,
                right: -3,
                width: 15,
                height: 15,
                borderRadius: '50%',
                background: 'var(--accent-red)',
                color: '#fff',
                fontSize: 9,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid var(--bg-primary)',
              }}
            >
              {unread}
            </span>
          )}
        </button>

        <AnimatePresence>
          {showNotifs && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 50 }}
                onClick={() => setShowNotifs(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.12 }}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 40,
                  width: 300,
                  borderRadius: 10,
                  overflow: 'hidden',
                  zIndex: 60,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-active)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                    Notifications
                  </span>
                  <button
                    onClick={markAllRead}
                    style={{
                      fontSize: 11,
                      color: 'var(--accent-cyan)',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                    }}
                  >
                    Mark all read
                  </button>
                </div>

                <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        padding: '10px 14px',
                        borderBottom: '1px solid rgba(30,35,48,0.6)',
                        background: n.read ? 'transparent' : 'rgba(0,212,255,0.02)',
                        cursor: 'pointer',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(0,212,255,0.02)')
                      }
                    >
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: n.read ? 'var(--text-muted)' : 'var(--accent-cyan)',
                          marginTop: 5,
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 12,
                            color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)',
                            lineHeight: 1.4,
                          }}
                        >
                          {n.text}
                        </p>
                        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* User menu */}
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '4px 10px 4px 4px',
          borderRadius: 7,
          background: 'transparent',
          border: '1px solid var(--border-subtle)',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--bg-tertiary)'
          e.currentTarget.style.borderColor = 'var(--border-active)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.borderColor = 'var(--border-subtle)'
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            background: 'linear-gradient(135deg, #A855F7, #7C3AED)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 700,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          OF
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>Officer</span>
        <ChevronDown size={11} style={{ color: 'var(--text-muted)' }} />
      </button>
    </header>
  )
}
