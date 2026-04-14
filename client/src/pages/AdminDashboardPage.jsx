import { useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Dashboard from './Dashboard'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const initialRole = useMemo(() => (user?.role === 'leader' ? 'admin' : 'user'), [user?.role])
  const [role, setRole] = useState(initialRole)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleRole = () => {
    setRole((prev) => (prev === 'admin' ? 'user' : 'admin'))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        role={role}
      />

      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <Topbar setMobileMenuOpen={setMobileMenuOpen} role={role} toggleRole={toggleRole} />
        <main className="p-4 md:p-6">
          <Dashboard role={role} />
        </main>
      </div>
    </div>
  )
}