import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { Bell, Search, LogOut, Cpu } from 'lucide-react'

export const Navbar: React.FC = () => {
  const { user: storeUser, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const isDevMode = import.meta.env.VITE_DEV_MODE === 'TRUE'
  const user = storeUser || (isDevMode ? {
    username: 'dev_officer',
    badgeNumber: 'DEV-007',
    department: 'System Development Command',
    role: 'Developer'
  } : null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Determine page title based on path
  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/') return 'Telemetry Dashboard'
    if (path === '/cases') return 'Case Files'
    if (path === '/ai') return 'Conversational AI Hub'
    if (path === '/victims') return 'Victims Directory'
    if (path === '/accused') return 'Suspects Database'
    if (path === '/analytics') return 'Analytics & Trends'
    if (path === '/audit') return 'Security Audit Trail'
    // Capitalize first letter as fallback
    const segment = path.substring(1)
    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }

  return (
    <header className="h-14 border-b border-vigilx-borderMuted bg-[#0d111a] flex items-center justify-between px-6 select-none shrink-0">
      
      {/* Left: Location indicator */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold tracking-widest text-vigilx-primary uppercase">
          National Intelligence Command
        </span>
        <div className="h-4 w-px bg-vigilx-borderMuted" />
        <span className="text-xs text-slate-300 font-mono flex items-center gap-1.5 bg-[#080b11] px-2.5 py-1 border border-vigilx-borderMuted rounded-sm">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
          {getPageTitle()}
        </span>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden md:flex items-center max-w-sm w-80 relative">
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3" />
        <input
          type="text"
          placeholder="Global search (FIR ID, suspect, evidence)..."
          className="w-full bg-[#080b11] border border-vigilx-borderMuted focus:border-vigilx-borderActive focus:outline-none rounded-sm py-1.5 pl-9 pr-4 text-xs font-mono text-slate-300 placeholder-slate-600 transition-colors"
        />
      </div>

      {/* Right: Telemetry & Controls */}
      <div className="flex items-center gap-5">
        
        {/* Status Indicators */}
        <div className="hidden lg:flex items-center gap-3 text-[10px] font-mono">
          <div className="flex items-center gap-1 bg-[#0b1c16] text-[#059669] border border-[#0d3625] px-2 py-0.5 rounded-sm">
            <span className="w-1 h-1 bg-vigilx-success rounded-full" />
            <span>DB: ONLINE</span>
          </div>
          <div className="flex items-center gap-1 bg-[#0b1c16] text-[#059669] border border-[#0d3625] px-2 py-0.5 rounded-sm">
            <Cpu className="w-2.5 h-2.5" />
            <span>AI: ONLINE</span>
          </div>
        </div>

        {/* Notifications Icon */}
        <button className="relative p-1.5 hover:bg-slate-800/35 border border-transparent hover:border-vigilx-borderMuted rounded-sm text-slate-400 hover:text-slate-200 transition-all cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-600 rounded-full" />
        </button>

        <div className="h-6 w-px bg-vigilx-borderMuted" />

        {/* Officer Profile & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-200">
              {user?.username || 'Officer'}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Badge: {user?.badgeNumber || 'N/A'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Terminate Session"
            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-950/80 rounded-sm transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  )
}
