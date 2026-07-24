import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import useAppStore from '../../store/useAppStore'

export default function AppLayout() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed)
  const sidebarW = collapsed ? 72 : 260

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <div
        className="flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-300"
        style={{ marginLeft: `${sidebarW}px` }}
      >
        <Topbar />
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden cyber-grid"
          style={{ background: 'var(--bg-primary)' }}
        >
          <div className="page-transition" style={{ padding: '24px', minHeight: '100%' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
