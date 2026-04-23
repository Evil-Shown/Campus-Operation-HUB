import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Boxes,
  CalendarCheck2,
  AlertTriangle,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Sidebar() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const links = [
    { label: 'Dashboard', href: isAdmin ? '/admin' : '/dashboard', icon: LayoutDashboard },
    { label: 'Resources', href: '/resources/1', icon: Boxes },
    { label: 'My Bookings', href: '/bookings/my', icon: CalendarCheck2 },
    { label: 'Report Issue', href: '/tickets', icon: AlertTriangle },
    ...(isAdmin ? [{ label: 'Admin', href: '/admin/resources', icon: ShieldCheck }] : []),
  ]

  return (
    <aside className="min-h-screen w-72 border-r border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 px-4 py-6 text-slate-200">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/20 ring-1 ring-cyan-400/40">
          <GraduationCap className="h-6 w-6 text-cyan-300" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Campus OS</p>
          <h2 className="text-lg font-semibold text-white">Smart Campus</h2>
        </div>
      </div>

      <nav className="space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon

          return (
            <NavLink
              key={link.label}
              to={link.href}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-100 ring-1 ring-cyan-400/40'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{link.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/80">System Status</p>
        <p className="mt-2 text-sm font-semibold text-white">All Core Services Healthy</p>
        <p className="mt-1 text-xs text-slate-300">Bookings, tickets, and notifications are operational.</p>
      </div>
    </aside>
  )
}
