import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/useAuthStore'
import { apiClient } from '../../../api/client'
import { Shield, Lock, User, Eye, EyeOff, AlertTriangle, Loader2 } from 'lucide-react'

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  React.useEffect(() => {
    if (import.meta.env.VITE_DEV_MODE === 'TRUE') {
      login(
        { access: 'dev-mock-access-token', refresh: 'dev-mock-refresh-token' },
        {
          username: 'dev_officer',
          badgeNumber: 'DEV-007',
          department: 'System Development Command',
          role: 'Developer',
        }
      )
      navigate('/')
    }
  }, [login, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('Please enter both Badge ID/Username and Access Password.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await apiClient.post('/api/auth/login/', {
        username,
        password,
      })

      const { access, refresh } = res.data

      // Mock additional details since login only returns JWT tokens
      const mockOfficer = {
        username,
        badgeNumber: username === 'officer1' ? 'B-101' : 'B-' + Math.floor(100 + Math.random() * 900),
        department: 'Crime Investigation Dept (CID)',
        role: 'Inspector',
      }

      login({ access, refresh }, mockOfficer)
      navigate('/')
    } catch (err: any) {
      console.error('Login failed:', err)
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail)
      } else if (err.response && err.response.status === 401) {
        setError('Invalid credentials. Access Denied.')
      } else {
        setError('Connection timeout. Failed to reach Security Gateway.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-vigilx-bg text-foreground flex flex-col justify-center items-center p-4">
      {/* Container Card */}
      <div className="w-full max-w-md bg-vigilx-card border border-vigilx-borderMuted rounded-sm overflow-hidden shadow-2xl">
        
        {/* Institutional Header Banner */}
        <div className="bg-[#0e1320] border-b border-vigilx-borderMuted p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-indigo-950/40 border border-vigilx-borderActive flex items-center justify-center rounded-sm mb-3">
            <Shield className="w-6 h-6 text-vigilx-primary" />
          </div>
          <h2 className="text-sm font-semibold tracking-widest text-slate-400 uppercase">
            VigilX Crime Intelligence
          </h2>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1">
            Security Operations Gateway
          </h1>
        </div>

        {/* Access Restriction Warning Banner */}
        <div className="bg-red-950/20 border-b border-vigilx-borderMuted p-3 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-vigilx-danger shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-400 leading-relaxed uppercase">
            <strong className="text-vigilx-danger font-semibold">Restricted Access:</strong> This is a secure federal law enforcement system. All actions are logged, monitored, and subject to audit under judicial regulations.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-950/40 border border-red-800 text-red-200 p-3 rounded-sm text-xs flex items-start gap-2">
              <span className="font-semibold uppercase text-[10px] bg-red-800 px-1.5 py-0.5 rounded shrink-0">FAIL</span>
              <p>{error}</p>
            </div>
          )}

          {/* Badge ID Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-wider text-slate-400 uppercase flex justify-between">
              <span>Badge ID / Username</span>
              <span className="text-[10px] text-slate-500 font-normal lowercase">e.g. officer1</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                disabled={isLoading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter badge identifier..."
                className="w-full bg-[#080b11] border border-vigilx-borderMuted focus:border-vigilx-borderActive focus:outline-none rounded-sm py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 transition-colors disabled:opacity-50 font-mono"
              />
            </div>
          </div>

          {/* Access Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-wider text-slate-400 uppercase flex justify-between">
              <span>Access Password</span>
              <span className="text-[10px] text-slate-500 font-normal lowercase">e.g. Officer123!</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••"
                className="w-full bg-[#080b11] border border-vigilx-borderMuted focus:border-vigilx-borderActive focus:outline-none rounded-sm py-2 pl-10 pr-10 text-sm text-slate-200 placeholder-slate-600 transition-colors disabled:opacity-50 font-mono"
              />
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-vigilx-primary hover:bg-[#2563eb] text-white py-2.5 px-4 rounded-sm text-xs font-semibold tracking-widest uppercase transition-colors flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <span>Authorize Access & Login</span>
            )}
          </button>
        </form>

        {/* Footer Log Notice */}
        <div className="bg-[#0d101a] px-6 py-4 border-t border-vigilx-borderMuted flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>HOST_GATEWAY: v1.0.2</span>
          <span>IP_LOGGED: TRUE</span>
        </div>
      </div>
    </div>
  )
}
