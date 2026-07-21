import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar.jsx'
import { Navbar } from './Navbar.jsx'

export const DashboardLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#07090f] text-[#f1f5f9]">
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Page Viewport */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#07090f]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
