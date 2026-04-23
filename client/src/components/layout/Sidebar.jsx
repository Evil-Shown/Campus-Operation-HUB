import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Boxes,
  CalendarCheck2,
  AlertCircle,
  ShieldCheck,
  School,
  Sparkles,
  ChevronRight,
  Database,
  Cpu,
  Globe
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'

export default function Sidebar() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const links = [
    { label: 'Command Center', href: isAdmin ? '/admin' : '/dashboard', icon: LayoutDashboard },
    { label: 'Asset Matrix', href: '/resources/1', icon: Boxes },
    { label: 'Reservations', href: '/bookings/my', icon: CalendarCheck2 },
    { label: 'Support Terminal', href: '/tickets', icon: AlertCircle },
    ...(isAdmin ? [{ label: 'Admin Protocol', href: '/admin/resources', icon: ShieldCheck }] : []),
  ]

  return (
    <aside className="sticky top-0 h-screen w-72 flex flex-col bg-[#020617] border-r border-white/5 px-4 py-8 overflow-y-auto scrollbar-refined">
      {/* Branding */}
      <div className="mb-10 px-3 flex items-center gap-4 group">
        <div className="relative">
          <div className="absolute -inset-2 bg-primary-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 border border-white/10 shadow-2xl transition-transform group-hover:scale-105">
            <School className="h-7 w-7 text-primary-500" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-black text-white leading-none tracking-tighter uppercase">
            Smart<span className="text-primary-500">Campus</span>
          </h2>
          <p className="text-[10px] uppercase tracking-[0.4em] text-slate-600 font-black mt-1">Infrastructure</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5">
        <div className="px-3 mb-6">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-700">Operational Command</p>
          <div className="h-px w-full bg-white/5 mt-2" />
        </div>

        {links.map((link) => {
          const Icon = link.icon

          return (
            <NavLink
              key={link.label}
              to={link.href}
              className={({ isActive }) =>
                `group relative flex items-center justify-between rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-widest transition-all duration-300 border ${
                  isActive
                    ? 'bg-primary-600/10 text-primary-400 border-primary-500/20 shadow-[0_0_20px_rgba(124,58,237,0.1)]'
                    : 'text-slate-500 hover:text-slate-100 hover:bg-white/[0.03] border-transparent'
                }`
              }
            >
              <div className="flex items-center gap-4 relative z-10">
                <Icon className="h-5 w-5" />
                <span>{link.label}</span>
              </div>
              
              {/* Active Indicator Bar */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-r-full opacity-0 group-[.active]:opacity-100 transition-opacity" />
              
              <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </NavLink>
          )
        })}
      </nav>

      {/* System Status Section */}
      <div className="mt-auto space-y-4 pt-8">
        <div className="px-3 mb-4">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-700">Subsystem Link</p>
          <div className="h-px w-full bg-white/5 mt-2" />
        </div>

        <div className="relative overflow-hidden rounded-[1.5rem] bg-slate-900/40 p-5 border border-white/5 group">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 bg-primary-600/5 blur-3xl group-hover:bg-primary-600/10 transition-colors" />
          
          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-500/10 border border-primary-500/20">
                  <Database className="h-3.5 w-3.5 text-primary-500" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">Storage Matrix</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-500">98.2%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <Cpu className="h-3.5 w-3.5 text-indigo-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">Neural Load</span>
              </div>
              <span className="text-[10px] font-bold text-primary-400">12.4%</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Stable Link</span>
            </div>
            <Globe className="h-3.5 w-3.5 text-slate-600 animate-spin-slow" />
          </div>
        </div>

        <p className="text-[8px] text-center text-slate-700 font-bold uppercase tracking-[0.3em] pb-2">
          Node Cluster: SLIIT-FC-01
        </p>
      </div>
    </aside>
  )
}
