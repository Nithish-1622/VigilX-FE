import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-vigilx-bg text-foreground">
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
        {/* Header Navbar */}
        <Navbar />

        {/* Core Page Output Viewport */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#080a0f]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
