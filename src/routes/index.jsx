import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute.jsx'
import { DashboardLayout } from '../layouts/DashboardLayout.jsx'
import { isDevMode } from '../lib/env'

// Public routes
import { LandingPage } from '../features/landing/LandingPage.jsx'
import { LoginPage } from '../features/auth/pages/LoginPage.jsx'

// Protected platform routes
import { DashboardPage } from '../features/dashboard/pages/DashboardPage.jsx'
import { AIChatPage } from '../features/ai/pages/AIChatPage.jsx'
import { CasesPage } from '../features/cases/pages/CasesPage.jsx'
import { AccusedPage } from '../features/accused/pages/AccusedPage.jsx'
import { VictimsPage } from '../features/victims/pages/VictimsPage.jsx'
import { AnalyticsPage } from '../features/analytics/pages/AnalyticsPage.jsx'
import { AuditPage } from '../features/audit/pages/AuditPage.jsx'

export const AppRoutes = () => {
  return (
    <HashRouter>
      <Routes>

        {/* ── Public routes (no auth required) ── */}
        <Route path="/"        element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login"   element={isDevMode ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

        {/* ── Protected platform routes ── */}
        <Route element={<ProtectedRoute />}>
          {/* Dedicated full-viewport routes */}
          <Route path="/ai" element={<AIChatPage />} />

          {/* Standard dashboard routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/cases"     element={<CasesPage />} />
            <Route path="/accused"   element={<AccusedPage />} />
            <Route path="/victims"   element={<VictimsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/audit"     element={<AuditPage />} />
          </Route>
        </Route>

        {/* ── Catch-all: redirect ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </HashRouter>
  )
}
