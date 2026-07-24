import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Database, Brain, FlaskConical,
  Settings, HelpCircle, ChevronLeft, Shield, Zap
} from 'lucide-react'
import useAppStore from '../../store/useAppStore'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Home',         path: '/app/home',         accent: '#00F0FF' },
  { icon: Database,        label: 'Data Studio',  path: '/app/data-studio',  accent: '#BF5AF2' },
  { icon: Brain,           label: 'AI Studio',    path: '/app/ai-studio',    accent: '#00F0FF' },
  { icon: FlaskConical,    label: 'Experimental', path: '/app/experimental', accent: '#FF9F0A' },
]

const BOTTOM_ITEMS = [
  { icon: Settings,   label: 'Settings',    path: '/app/settings', accent: '#8B949E' },
  { icon: HelpCircle, label: 'Help Center', path: '/app/help',     accent: '#8B949E' },
]

export default function Sidebar() {
  const collapsed    = useAppStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)
  const navigate     = useNavigate()

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 left-0 h-full z-50 flex flex-col overflow-hidden"
      style={{
        background: 'rgba(13,17,23,0.98)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '4px 0 30px rgba(0,0,0,0.5)',
      }}
    >
      {/* ── Logo Row ── */}
      <div
        className="flex items-center gap-2 flex-shrink-0"
        style={{ padding: '14px 12px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 flex-1 min-w-0"
        >
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-lg"
            style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg,rgba(0,240,255,0.2),rgba(0,128,255,0.2))',
              border: '1px solid rgba(0,240,255,0.4)',
              boxShadow: '0 0 12px rgba(0,240,255,0.18)',
            }}
          >
            <Shield size={16} style={{ color: '#00F0FF' }} />
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col min-w-0"
              >
                <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '0.06em', color: '#fff', lineHeight: 1.1 }}>
                  VIGIL<span style={{ color: '#00F0FF' }}>X</span>
                </span>
                <span style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Intelligence Platform
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="flex-shrink-0 flex items-center justify-center rounded-md transition-colors hover:bg-white/5"
          style={{ width: 26, height: 26, color: 'var(--text-muted)' }}
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronLeft size={13} />
          </motion.div>
        </button>
      </div>

      {/* ── System Status Badge ── */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', flexShrink: 0, padding: '8px 10px 0' }}
          >
            <div
              className="flex items-center gap-2 rounded-lg"
              style={{
                padding: '7px 10px',
                background: 'rgba(0,240,255,0.04)',
                border: '1px solid rgba(0,240,255,0.1)',
              }}
            >
              <div className="status-dot active" style={{ flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>
                  System Status
                </div>
                <div style={{ fontSize: 11, color: '#00F0FF', fontWeight: 600 }}>All Systems Operational</div>
              </div>
              <Zap size={11} style={{ color: '#00F0FF', flexShrink: 0 }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Nav ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden" style={{ padding: '10px 8px' }}>
        {!collapsed && (
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 8px 6px' }}>
            Navigation
          </div>
        )}
        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <SidebarItem key={item.path} item={item} collapsed={collapsed} />
          ))}
        </div>
      </nav>

      {/* ── Bottom Section ── */}
      <div
        className="flex-shrink-0 flex flex-col gap-0.5"
        style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        {BOTTOM_ITEMS.map((item) => (
          <SidebarItem key={item.path} item={item} collapsed={collapsed} />
        ))}

        {/* User row */}
        <div
          className="flex items-center gap-2.5 rounded-lg cursor-pointer transition-colors hover:bg-white/5"
          style={{ padding: '8px', marginTop: 4 }}
        >
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-full text-xs font-black text-white"
            style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#BF5AF2,#8B5CF6)', boxShadow: '0 0 10px rgba(191,90,242,0.35)', fontSize: 11 }}
          >
            OF
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col min-w-0"
              >
                <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Officer Admin</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Level 5 Clearance</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  )
}

function SidebarItem({ item, collapsed }) {
  const { icon: Icon, label, path, accent } = item
  return (
    <NavLink to={path}>
      {({ isActive }) => (
        <motion.div
          className="relative flex items-center gap-2.5 rounded-lg cursor-pointer group transition-colors"
          style={{
            padding: '8px 10px',
            background: isActive ? 'rgba(0,240,255,0.08)' : 'transparent',
            border: isActive ? '1px solid rgba(0,240,255,0.15)' : '1px solid transparent',
          }}
          whileHover={{ x: 2 }}
        >
          {isActive && (
            <motion.div
              layoutId="activeBar"
              className="absolute rounded-r"
              style={{ left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, background: accent }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}

          <Icon
            size={17}
            style={{
              flexShrink: 0,
              color: isActive ? accent : 'var(--text-secondary)',
              transition: 'color 0.2s',
            }}
          />

          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.18 }}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </NavLink>
  )
}
