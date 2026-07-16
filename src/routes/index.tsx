import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { DashboardPage } from '../features/dashboard/pages/DashboardPage'
import { CasesPage } from '../features/cases/pages/CasesPage'
import { AccusedPage } from '../features/accused/pages/AccusedPage'
import { VictimsPage } from '../features/victims/pages/VictimsPage'
import { AIChatPage } from '../features/ai/pages/AIChatPage'
import { AnalyticsPage } from '../features/analytics/pages/AnalyticsPage'
import { AuditPage } from '../features/audit/pages/AuditPage'

export const AppRoutes: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public auth route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected dashboard and operational routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/cases" element={<CasesPage />} />
            <Route path="/accused" element={<AccusedPage />} />
            <Route path="/victims" element={<VictimsPage />} />
            <Route path="/ai" element={<AIChatPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/audit" element={<AuditPage />} />
          </Route>
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
