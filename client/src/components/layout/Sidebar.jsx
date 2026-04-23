import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Boxes,
  CalendarCheck2,
  AlertCircle,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Sidebar() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const links = [
    { label: 'Main Dashboard', href: isAdmin ? '/admin' : '/dashboard', icon: LayoutDashboard },
    { label: 'Asset Directory', href: '/resources/1', icon: Boxes },
    { label: 'Reservations', href: '/bookings/my', icon: CalendarCheck2 },
    { label: 'Support Desk', href: '/tickets', icon: AlertCircle },
    ...(isAdmin ? [{ label: 'Admin Terminal', href: '/admin/resources', icon: ShieldCheck }] : []),
  ]

  return (
    <aside className="sticky top-0 h-screen w-72 flex flex-col bg-slate-950 border-r border-white/5 px-4 py-8 overflow-y-auto scrollbar-refined">
      <div className="mb-10 px-2 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-600 shadow-xl shadow-primary-500/20">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-white leading-tight">SmartCampus</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary-500 font-black">Operations Hub</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        <p className="px-2 mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Navigation Menu</p>
        {links.map((link) => {
          const Icon = link.icon

          return (
            <NavLink
              key={link.label}
              to={link.href}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-primary-600/15 text-primary-400 border border-primary-500/20 shadow-lg shadow-primary-500/5'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-100 border border-transparent'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 transition-colors ${isActive ? 'text-primary-400' : 'group-hover:text-slate-100'}`} />
                <span>{link.label}</span>
              </div>
              <ChevronRight className={`h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto pt-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 p-5 border border-white/5">
          <div className="absolute top-0 right-0 -mr-2 -mt-2 h-16 w-16 bg-primary-500/10 blur-2xl" />
          <div className="relative flex items-center gap-2 mb-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-500/20 text-primary-400">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">System Pulse</p>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            All nodes operational. Latency <span className="text-emerald-400 font-bold">12ms</span>.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Stable Core</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
