import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { TopBar } from './TopBar'

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-bg/80">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        {/* pb accounts for the mobile bottom nav height + safe area */}
        <main className="flex-1 px-4 pb-24 pt-5 sm:px-6 lg:pb-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
