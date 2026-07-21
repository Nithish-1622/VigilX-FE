import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSessionStore } from '../store/useSessionStore.js'
import { motion } from 'framer-motion'
import {
  Cpu,
  Activity,
  FolderKanban,
  UserX,
  Users,
  BarChart3,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Shield,
  Home
} from 'lucide-react'

const AI_ITEM = { name: 'AI Investigation', path: '/ai', icon: Cpu }

const NAV_ITEMS = [
  { name: 'Command Center', path: '/dashboard', icon: Activity },
  { name: 'Cases', path: '/cases', icon: FolderKanban },
  { name: 'Accused', path: '/accused', icon: Users },
  { name: 'Victims', path: '/victims', icon: UserX },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Audit Logs', path: '/audit', icon: ShieldCheck },
]

export const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useSessionStore()
  const navigate = useNavigate()

  const linkBase = 'flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-sm transition-all select-none whitespace-nowrap border'
  const activeClass = 'bg-[#0f1d35] text-[#3b82f6] border-[#1e3a6e]/70'
  const inactiveClass = 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-[#111827] hover:border-[#1e2d3d]'

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 56 : 220 }}
      transition={{ duration: 0.18, ease: 'easeInOut' }}
      className="h-full bg-[#0d1117] border-r border-[#1e2d3d] flex flex-col justify-between shrink-0 overflow-x-hidden"
    >
      <div className="flex flex-col pt-4 gap-5">

        {/* ── Brand ── */}
        <div className="h-9 flex items-center px-3.5 overflow-hidden gap-3">
          <div className="w-7 h-7 rounded-sm bg-[#07090f] border border-[#1e2d3d] flex items-center justify-center shrink-0">
            <Shield className="w-3.5 h-3.5 text-[#2563eb]" />
          </div>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="text-[13px] font-bold tracking-widest text-white whitespace-nowrap leading-tight">
                VIGIL<span className="text-[#2563eb]">X</span>
              </div>
              <div className="text-[9px] font-mono text-slate-600 tracking-wider whitespace-nowrap">
                INTELLIGENCE PLATFORM
              </div>
            </motion.div>
          )}
        </div>

        {/* ── AI Investigation (Primary — First, Visually distinct) ── */}
        <div className="px-2">
          <NavLink
            to={AI_ITEM.path}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? 'bg-[#2563eb]/15 text-[#3b82f6] border-[#2563eb]/40 font-semibold' : 'text-slate-400 border-[#1e2d3d]/50 bg-[#111827]/40 hover:bg-[#2563eb]/10 hover:text-[#3b82f6] hover:border-[#2563eb]/30 font-medium'}`
            }
          >
            <AI_ITEM.icon className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {AI_ITEM.name}
              </motion.span>
            )}
          </NavLink>
        </div>

        {/* ── Divider ── */}
        <div className="px-3">
          <div className="border-t border-[#1e2d3d]" />
          {!sidebarCollapsed && (
            <span className="text-[9px] font-mono font-semibold tracking-widest text-slate-600 uppercase block mt-2.5 px-0.5">
              Platform
            </span>
          )}
        </div>

        {/* ── Standard Nav Items ── */}
        <nav className="flex flex-col gap-0.5 px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeClass : inactiveClass}`
                }
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {!sidebarCollapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {item.name}
                  </motion.span>
                )}
              </NavLink>
            )
          })}
        </nav>

      </div>

      {/* ── Landing Page Link + Collapse ── */}
      <div className="flex flex-col gap-2 p-2 border-t border-[#1e2d3d]">
        {!sidebarCollapsed && (
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono text-slate-600 hover:text-slate-400 transition-colors cursor-pointer rounded-sm hover:bg-[#111827]"
          >
            <Home className="w-3 h-3 shrink-0" />
            <span>Platform Home</span>
          </button>
        )}
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-sm bg-[#07090f] border border-[#1e2d3d] hover:border-[#2563eb]/40 text-slate-600 hover:text-slate-400 transition-all cursor-pointer"
        >
          {sidebarCollapsed
            ? <ChevronRight className="w-3.5 h-3.5" />
            : (
              <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-wider">
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Collapse</span>
              </div>
            )
          }
        </button>
      </div>
    </motion.aside>
  )
}
