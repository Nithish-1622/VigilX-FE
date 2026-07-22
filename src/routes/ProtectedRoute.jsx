import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { isDevMode } from '../lib/env'

export const ProtectedRoute = ({ children }) => {
  const accessToken = useAuthStore((state) => state.accessToken)

  if (!accessToken && !isDevMode) {
    return <Navigate to="/login" replace />
  }

  return children ? <>{children}</> : <Outlet />
}
