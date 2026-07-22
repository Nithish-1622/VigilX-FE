import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/useAuthStore.js'
import { apiClient } from '../../../api/client.js'
import { DEV_USER, isDevMode } from '../../../lib/env'
import { Shield, Lock, User, Eye, EyeOff, AlertTriangle, Loader2 } from 'lucide-react'

export const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const setTokens = useAuthStore((state) => state.setTokens)
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate()

  React.useEffect(() => {
    if (isDevMode) {
      setTokens({ access: 'dev-mock-access-token', refresh: 'dev-mock-refresh-token' })
      setUser(DEV_USER)
      navigate('/dashboard', { replace: true })
    }
  }, [navigate, setTokens, setUser])


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('Please enter both Badge ID/Username and Access Password.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await apiClient.post('/api/auth/login/', { username, password })
      const { access, refresh } = res.data

      const mockOfficer = {
        username,
        badgeNumber: username === 'officer1' ? 'B-101' : 'B-' + Math.floor(100 + Math.random() * 900),
        department: 'Crime Investigation Dept (CID)',
        role: 'Inspector',
      }

      setTokens({ access, refresh })
      setUser(mockOfficer)
      navigate('/') // Navigate to landing first, not dashboard
    } catch (err) {
      console.error('Login failed:', err)
      if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else if (err.response?.status === 401) {
        setError('Invalid credentials. Access denied.')
      } else {
        setError('Connection failed. Unable to reach Security Gateway.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#07090f] text-[#f1f5f9] flex flex-col justify-center items-center p-4">

      {/* Classification banner */}
      <div className="w-full max-w-sm mb-6 flex items-center justify-center">
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#dc2626] uppercase border border-[#dc2626]/30 px-3 py-1 rounded-sm bg-[#dc2626]/5">
          Government Restricted System
        </span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-[#0d1117] border border-[#1e2d3d] rounded-sm overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="bg-[#07090f] border-b border-[#1e2d3d] p-6 flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-[#0d1117] border border-[#1e2d3d] flex items-center justify-center rounded-sm mb-4">
            <Shield className="w-5 h-5 text-[#2563eb]" />
          </div>
          <p className="text-[11px] font-mono font-semibold tracking-widest text-slate-500 uppercase mb-1">
            VigilX Crime Intelligence
          </p>
          <h1 className="text-lg font-bold tracking-tight text-white">
            Secure Access Gateway
          </h1>
        </div>

        {/* Warning Banner */}
        <div className="bg-[#dc2626]/5 border-b border-[#dc2626]/20 px-4 py-2.5 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
            <strong className="text-[#dc2626]">RESTRICTED:</strong> Authorized law enforcement personnel only. All access is logged and audited.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-[#dc2626]/10 border border-[#dc2626]/30 text-red-300 p-3 rounded-sm text-xs flex items-start gap-2 font-mono">
              <span className="text-[9px] bg-[#dc2626]/20 text-red-400 px-1.5 py-0.5 rounded shrink-0 font-bold uppercase">
                FAIL
              </span>
              <p>{error}</p>
            </div>
          )}

          {/* Badge ID */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase flex justify-between">
              <span>Badge ID / Username</span>
              <span className="font-normal text-slate-600">e.g. officer1</span>
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-2.5" />
              <input
                type="text"
                disabled={isLoading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter badge identifier..."
                className="w-full bg-[#07090f] border border-[#1e2d3d] focus:border-[#2563eb]/60 focus:outline-none rounded-sm py-2 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-600 transition-colors disabled:opacity-50 font-mono text-xs"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase flex justify-between">
              <span>Access Password</span>
              <span className="font-normal text-slate-600">e.g. Officer123!</span>
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#07090f] border border-[#1e2d3d] focus:border-[#2563eb]/60 focus:outline-none rounded-sm py-2 pl-9 pr-10 text-sm text-slate-200 placeholder-slate-600 transition-colors disabled:opacity-50 font-mono text-xs"
              />
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-600 hover:text-slate-400"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2.5 px-4 rounded-sm text-xs font-semibold tracking-widest uppercase transition-colors flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Authorize & Enter</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="bg-[#07090f] px-6 py-3 border-t border-[#1e2d3d] flex items-center justify-between text-[9px] font-mono text-slate-600">
          <span>GATEWAY: v1.0.2</span>
          <span>IP_LOGGED: TRUE</span>
        </div>
      </div>
    </div>
  )
}
