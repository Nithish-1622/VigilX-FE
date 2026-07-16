import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSessionStore } from '../store/useSessionStore'
import { motion } from 'framer-motion'
import {
  Activity,
  FolderKanban,
  UserX,
  Skull,
  Cpu,
  BarChart3,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react'

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useSessionStore()

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Activity },
    { name: 'Cases', path: '/cases', icon: FolderKanban },
    { name: 'Suspects Database', path: '/accused', icon: Skull },
    { name: 'Victims Portal', path: '/victims', icon: UserX },
    { name: 'AI Intelligence Hub', path: '/ai', icon: Cpu },
    { name: 'Crime Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Security Audit Logs', path: '/audit', icon: ShieldCheck }
  ]

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.15, ease: 'easeInOut' }}
      className="h-full bg-[#0d111a] border-r border-vigilx-borderMuted flex flex-col justify-between shrink-0 overflow-x-hidden"
    >
      <div className="flex flex-col gap-6 pt-4">
        {/* Branding header */}
        <div className="h-10 flex items-center px-4 overflow-hidden gap-3">
          <div className="w-8 h-8 rounded-sm bg-indigo-950/60 border border-vigilx-borderActive flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4 text-vigilx-primary" />
          </div>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-bold tracking-widest text-white font-sans whitespace-nowrap"
            >
              VIGIL<span className="text-vigilx-primary">X</span> PLATFORM
            </motion.span>
          )}
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-sm transition-all select-none whitespace-nowrap border ${
                    isActive
                      ? 'bg-indigo-950/20 text-vigilx-primary border-vigilx-borderActive'
                      : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-[#111622] hover:border-vigilx-borderMuted'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Collapse Toggle Button */}
      <div className="p-3 border-t border-vigilx-borderMuted">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-sm bg-[#111622] border border-vigilx-borderMuted hover:border-vigilx-borderActive text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider">
              <ChevronLeft className="w-4 h-4" />
              <span>COLLAPSE CORE</span>
            </div>
          )}
        </button>
      </div>
    </motion.aside>
  )
}
