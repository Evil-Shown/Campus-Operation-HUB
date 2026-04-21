import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  Calendar,
  Ticket,
  Users,
  ChevronLeft,
  Menu,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen, role }) => {
  const userNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/app' },
    { icon: Package, label: 'Resources', path: '/catalogue' },
    { icon: Calendar, label: 'My Bookings', path: '/bookings' },
    { icon: Ticket, label: 'Tickets', path: '/tickets' },
  ]

  const adminNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/app' },
    { icon: Package, label: 'Manage Resources', path: '/catalogue' },
    { icon: Calendar, label: 'Manage Bookings', path: '/bookings/admin' },
    { icon: Ticket, label: 'Manage Tickets', path: '/tickets' },
    { icon: Users, label: 'Users', path: '/admin' },
  ]

  const navItems = role === 'admin' ? adminNavItems : userNavItems

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center h-16 px-4 border-b border-gray-200 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">SC</span>
          </div>
          {!collapsed && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-semibold text-gray-900">
              Smart Campus Hub
            </motion.span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            type="button"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <motion.div key={item.label} whileHover={{ x: 4 }}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 group ${
                  isActive ? 'bg-indigo-50 text-indigo-600' : ''
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Collapse button for expanded view */}
      {collapsed && (
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={() => setCollapsed(false)}
            className="w-full p-2 rounded-lg hover:bg-gray-100 transition-colors flex justify-center"
            type="button"
            aria-label="Expand sidebar"
          >
            <Menu className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 256 }}
        className="hidden lg:block fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-30 overflow-hidden"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: mobileOpen ? 0 : -300 }}
        className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 lg:hidden"
      >
        <div className="absolute top-4 right-4">
          <button onClick={() => setMobileOpen(false)} className="p-1" type="button" aria-label="Close mobile menu">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <SidebarContent />
      </motion.aside>
    </>
  )
}

export default Sidebar
