import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Boxes,
  CalendarCheck2,
  AlertCircle,
  UserCog,
  School,
  Sparkles
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Sidebar() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const links = [
    { label: 'Dashboard', href: isAdmin ? '/admin' : '/dashboard', icon: LayoutDashboard },
    { label: 'Browse Resources', href: '/resources', icon: Boxes },
    { label: 'My Bookings', href: '/bookings/my', icon: CalendarCheck2 },
    { label: 'Support Tickets', href: '/tickets', icon: AlertCircle },
    ...(isAdmin
      ? [
          { label: 'Users', href: '/admin/users', icon: UserCog },
        ]
      : []),
  ]

  return (
    <aside className="sticky top-0 h-screen w-72 flex flex-col bg-white border-r border-gray-200 px-4 py-8 overflow-y-auto">
      {/* Branding */}
      <Link to="/" className="mb-10 px-3 flex items-center gap-4 group">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-sm">
          <School className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 leading-tight">
            SmartCampus
          </h2>
          <p className="text-xs text-gray-500 font-medium">University Portal</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        <div className="px-3 mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Main Menu</p>
        </div>

        {links.map((link) => {
          const Icon = link.icon

          return (
            <NavLink
              key={link.label}
              to={link.href}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-600 rounded-r-full" />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Campus Support Section */}
      <div className="mt-auto pt-8">
        <Link
          to="/"
          className="mb-3 block text-center py-2 bg-indigo-50 border border-indigo-100 rounded-lg text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
        >
          Back to Landing Page
        </Link>
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-xs font-semibold text-gray-900">Campus Support</span>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
            Need help with bookings or equipment? Our team is available 24/7.
          </p>
          <Link 
            to="/tickets/new"
            className="block text-center py-2 bg-white border border-gray-200 rounded-lg text-[11px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Get Assistance
          </Link>
        </div>
        
        <div className="mt-4 px-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-medium text-gray-500">System Online</span>
          </div>
          <span className="text-[10px] text-gray-400">v2.4.0</span>
        </div>
      </div>
    </aside>
  )
}
