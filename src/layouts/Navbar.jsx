import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore.js'
import { Bell, LogOut, Cpu, Activity } from 'lucide-react'

const PAGE_TITLES = {
  '/dashboard': 'Command Center',
  '/cases': 'Case Files',
  '/ai': 'AI Investigation',
  '/victims': 'Victims Directory',
  '/accused': 'Accused & Suspects',
  '/analytics': 'Crime Analytics',
  '/audit': 'Security Audit Trail',
}

export const Navbar = () => {
  const { user: storeUser, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const isDevMode = import.meta.env.VITE_DEV_MODE === 'TRUE'
  const user = storeUser || (isDevMode ? {
    username: 'dev_officer',
    badgeNumber: 'DEV-007',
    department: 'System Development Command',
    role: 'Developer',
  } : null)

  const pageTitle = PAGE_TITLES[location.pathname] || location.pathname.replace('/', '').replace(/^./, c => c.toUpperCase())
  const isAIPage = location.pathname === '/ai'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="h-14 border-b border-[#1e2d3d] bg-[#0d1117] flex items-center justify-between px-5 select-none shrink-0">

      {/* Left — Page Context */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-pulse" />
          <span className="text-xs font-semibold text-slate-300 tracking-wide">
            {pageTitle}
          </span>
        </div>
      </div>

      {/* Center — AI Investigation Quick Access (hidden on AI page) */}
      {!isAIPage && (
        <button
          onClick={() => navigate('/ai')}
          className="hidden md:flex items-center gap-2 bg-[#2563eb]/10 border border-[#2563eb]/30 hover:bg-[#2563eb]/20 hover:border-[#2563eb]/60 text-[#3b82f6] px-4 py-1.5 rounded-sm text-xs font-semibold transition-all cursor-pointer"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>AI Investigation</span>
        </button>
      )}

      {/* Right — Status & Officer */}
      <div className="flex items-center gap-4">

        {/* Status Indicators */}
        <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono">
          <div className="flex items-center gap-1.5 border border-[#1e2d3d] bg-[#07090f] px-2 py-1 rounded-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-slate-500">DB</span>
          </div>
          <div className="flex items-center gap-1.5 border border-[#1e2d3d] bg-[#07090f] px-2 py-1 rounded-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-pulse" />
            <span className="text-slate-500">AI</span>
          </div>
        </div>

        <div className="h-5 w-px bg-[#1e2d3d]" />

        {/* Officer Profile */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-xs font-medium text-slate-300">
              {user?.username || 'Officer'}
            </span>
            <span className="text-[10px] font-mono text-slate-600">
              {user?.badgeNumber || 'N/A'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="End Session"
            className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-900/50 rounded-sm transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  )
}
