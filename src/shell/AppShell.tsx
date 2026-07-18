import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { DemoGuideOverlay } from './DemoGuideOverlay'
import { NavTrailProvider } from '../state/NavTrail'
import { DemoGuideProvider } from '../state/DemoGuide'

export function AppShell() {
  return (
    <NavTrailProvider>
      <DemoGuideProvider>
        <div className="flex h-screen overflow-hidden bg-ink-50">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <TopBar />
            <main className="min-h-0 flex-1 overflow-y-auto">
              <Outlet />
            </main>
          </div>
          <DemoGuideOverlay />
        </div>
      </DemoGuideProvider>
    </NavTrailProvider>
  )
}
