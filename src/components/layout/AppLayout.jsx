import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import useAppStore from '../../store/useAppStore'

export default function AppLayout() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed)
  const sidebarW = collapsed ? 60 : 248

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />

      <div
        className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden"
        style={{
          marginLeft: `${sidebarW}px`,
          transition: 'margin-left 0.25s ease',
        }}
      >
        <Topbar />

        <main
          className="flex-1 overflow-y-auto overflow-x-hidden cyber-grid"
          style={{ background: 'var(--bg-primary)' }}
        >
          <div style={{ padding: '24px', minHeight: 'calc(100vh - var(--topbar-height))' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
