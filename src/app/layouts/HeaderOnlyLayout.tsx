import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function HeaderOnlyLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 p-4 lg:p-6 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
