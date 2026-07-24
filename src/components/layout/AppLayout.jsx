import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import useAppStore from '../../store/useAppStore'

export default function AppLayout() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed)
  const sidebarW = collapsed ? 72 : 260

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070A0F] text-white font-sans">
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Container Area */}
      <div
        className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden transition-all duration-300 ease-in-out"
        style={{ marginLeft: `${sidebarW}px` }}
      >
        {/* Sticky Topbar */}
        <Topbar />

        {/* Scrollable Viewport Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#070A0F] cyber-grid">
          <div className="w-full px-6 py-6 min-h-[calc(100vh-56px)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
