import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Database, Brain, FlaskConical, MessageSquare,
  GitBranch, Settings, HelpCircle, ChevronLeft, ChevronDown, Shield,
  Zap, Users, Cpu, BarChart2,
} from 'lucide-react'
import useAppStore from '../../store/useAppStore'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Home', path: '/app/home' },
  {
    icon: Database,
    label: 'Data Studio',
    path: '/app/data-studio',
    children: [
      { icon: Database, label: 'DB Connectors', tab: 'connectors', path: '/app/data-studio?tab=connectors' },
      { icon: MessageSquare, label: 'DB Chatbot', tab: 'chatbot', path: '/app/data-studio?tab=chatbot' },
      { icon: GitBranch, label: 'ETL Pipelines', tab: 'pipelines', path: '/app/data-studio?tab=pipelines' },
    ],
  },
  {
    icon: Brain,
    label: 'AI Studio',
    path: '/app/ai-studio',
    children: [
      { icon: Zap,         label: 'V2 Multi-Agent', tab: 'v2',     path: '/app/ai-studio?tab=v2' },
      { icon: MessageSquare, label: 'V1 Chat',      tab: 'v1',     path: '/app/ai-studio?tab=v1' },
      { icon: Users,       label: 'Agents Fleet',   tab: 'agents', path: '/app/ai-studio?tab=agents' },
      { icon: Cpu,         label: 'ML Studio',      tab: 'ml',     path: '/app/ai-studio?tab=ml' },
    ],
  },
  {
    icon: FlaskConical,
    label: 'Experimental',
    path: '/app/experimental',
    children: [
      { icon: GitBranch, label: 'Experiments',  tab: 'experiment',  path: '/app/experimental?tab=experiment' },
      { icon: BarChart2, label: 'Simulations',  tab: 'simulation',  path: '/app/experimental?tab=simulation' },
    ],
  },
]

const BOTTOM_ITEMS = [
  { icon: Settings, label: 'Settings', path: '/app/settings' },
  { icon: HelpCircle, label: 'Help', path: '/app/help' },
]

export default function Sidebar() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)
  const navigate = useNavigate()

  return (
    <motion.aside
      animate={{ width: collapsed ? 60 : 248 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 52,
          padding: '0 12px',
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0,
          gap: 10,
        }}
      >
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flex: 1,
            minWidth: 0,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid rgba(0,212,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Shield size={14} style={{ color: 'var(--accent-cyan)' }} />
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                style={{ display: 'flex', flexDirection: 'column', minWidth: 0, lineHeight: 1 }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    color: 'var(--text-primary)',
                  }}
                >
                  VIGIL<span style={{ color: 'var(--accent-cyan)' }}>X</span>
                </span>
                <span
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginTop: 2,
                  }}
                >
                  Intelligence
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={toggleSidebar}
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            flexShrink: 0,
            transition: 'color 0.15s, background 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)'
            e.currentTarget.style.background = 'var(--bg-tertiary)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)'
            e.currentTarget.style.background = 'none'
          }}
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronLeft size={13} />
          </motion.div>
        </button>
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '8px 6px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {!collapsed && (
          <p className="section-label" style={{ padding: '4px 6px 6px' }}>
            Menu
          </p>
        )}
        {NAV_ITEMS.map((item) => (
          <SidebarItem key={item.path} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Bottom */}
      <div
        style={{
          flexShrink: 0,
          padding: '6px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {BOTTOM_ITEMS.map((item) => (
          <SidebarItem key={item.path} item={item} collapsed={collapsed} />
        ))}

        {/* User row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '7px 8px',
            borderRadius: 7,
            marginTop: 4,
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
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
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                style={{ minWidth: 0 }}
              >
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  Officer Admin
                </p>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>
                  Level 5 Clearance
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  )
}

function SidebarItem({ item, collapsed }) {
  const { icon: Icon, label, path, children } = item
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isParentActive = location.pathname.startsWith(path)
  const [expanded, setExpanded] = useState(isParentActive)

  useEffect(() => {
    if (isParentActive) setExpanded(true)
  }, [isParentActive])

  const itemBase = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'flex-start',
    gap: 9,
    padding: collapsed ? '8px' : '7px 8px',
    borderRadius: 7,
    cursor: 'pointer',
    transition: 'all 0.12s',
    position: 'relative',
    border: '1px solid transparent',
    userSelect: 'none',
    width: '100%',
    textAlign: 'left',
    background: 'none',
    outline: 'none',
  }

  if (children?.length) {
    return (
      <div>
        <div
          onClick={() => {
            if (!isParentActive) navigate(path)
            setExpanded(!expanded)
          }}
          style={{
            ...itemBase,
            background: isParentActive ? 'rgba(168,85,247,0.08)' : 'transparent',
            borderColor: isParentActive ? 'rgba(168,85,247,0.15)' : 'transparent',
          }}
          onMouseEnter={(e) => {
            if (!isParentActive) e.currentTarget.style.background = 'var(--bg-tertiary)'
          }}
          onMouseLeave={(e) => {
            if (!isParentActive) e.currentTarget.style.background = 'transparent'
          }}
        >
          {isParentActive && (
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 2,
                height: 16,
                borderRadius: '0 2px 2px 0',
                background: '#A855F7',
              }}
            />
          )}

          <Icon
            size={15}
            style={{
              color: isParentActive ? '#A855F7' : 'var(--text-secondary)',
              flexShrink: 0,
              transition: 'color 0.12s',
            }}
          />

          {!collapsed && (
            <>
              <span
                style={{
                  flex: 1,
                  fontSize: 13,
                  fontWeight: 500,
                  color: isParentActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {label}
              </span>
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ color: 'var(--text-muted)', flexShrink: 0 }}
              >
                <ChevronDown size={12} />
              </motion.div>
            </>
          )}
        </div>

        <AnimatePresence>
          {expanded && !collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{
                overflow: 'hidden',
                marginLeft: 12,
                paddingLeft: 12,
                borderLeft: '1px solid var(--border-subtle)',
                marginTop: 2,
                marginBottom: 2,
              }}
            >
              {children.map((child) => {
                // default tab per section: data-studio → connectors, ai-studio → v2, experimental → experiment
                const rawTab = searchParams.get('tab')
                const defaultTab = path.includes('data-studio') ? 'connectors'
                  : path.includes('ai-studio') ? 'v2'
                  : path.includes('experimental') ? 'experiment'
                  : rawTab
                const currentTab = rawTab || defaultTab
                const isActive = isParentActive && currentTab === child.tab
                const ChildIcon = child.icon
                return (
                  <NavLink key={child.path} to={child.path} style={{ textDecoration: 'none' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '6px 8px',
                        borderRadius: 6,
                        marginBottom: 1,
                        background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                        border: `1px solid ${isActive ? 'rgba(0,212,255,0.12)' : 'transparent'}`,
                        transition: 'all 0.12s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'var(--bg-elevated)'
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <ChildIcon
                        size={12}
                        style={{ color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)', flexShrink: 0 }}
                      />
                      <span
                        style={{
                          fontSize: 12,
                          color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                          fontWeight: isActive ? 500 : 400,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {child.label}
                      </span>
                    </div>
                  </NavLink>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <NavLink to={path} style={{ textDecoration: 'none' }}>
      {({ isActive }) => (
        <div
          style={{
            ...itemBase,
            background: isActive ? 'rgba(0,212,255,0.07)' : 'transparent',
            borderColor: isActive ? 'rgba(0,212,255,0.12)' : 'transparent',
          }}
          onMouseEnter={(e) => {
            if (!isActive) e.currentTarget.style.background = 'var(--bg-tertiary)'
          }}
          onMouseLeave={(e) => {
            if (!isActive) e.currentTarget.style.background = 'transparent'
          }}
        >
          {isActive && (
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 2,
                height: 16,
                borderRadius: '0 2px 2px 0',
                background: 'var(--accent-cyan)',
              }}
            />
          )}
          <Icon
            size={15}
            style={{
              color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              flexShrink: 0,
              transition: 'color 0.12s',
            }}
          />
          {!collapsed && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flex: 1,
              }}
            >
              {label}
            </span>
          )}
        </div>
      )}
    </NavLink>
  )
}
