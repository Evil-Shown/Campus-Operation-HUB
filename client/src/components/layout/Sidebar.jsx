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
    <aside className="sticky top-0 h-screen w-72 flex flex-col bg-white/80 backdrop-blur-md border-r border-gray-200 px-4 py-8 overflow-y-auto scrollbar-refined">
      {/* Branding */}
      <div className="mb-10 px-3 flex items-center gap-4 group">
        <div className="relative">
          <div className="absolute -inset-2 bg-primary-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-indigo-100 shadow-lg transition-transform group-hover:scale-105">
            <School className="h-7 w-7 text-indigo-600" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-800 leading-none tracking-tighter uppercase">
            Smart<span className="text-indigo-600">Campus</span>
          </h2>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-black mt-1">Infrastructure</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5">
        <div className="px-3 mb-6">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Operational Command</p>
          <div className="h-px w-full bg-gray-200 mt-2" />
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
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50 border-transparent'
                }`
              }
            >
              <div className="flex items-center gap-4 relative z-10">
                <Icon className="h-5 w-5" />
                <span>{link.label}</span>
              </div>
              
              {/* Active Indicator Bar */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full opacity-0 group-[.active]:opacity-100 transition-opacity" />
              
              <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </NavLink>
          )
        })}
      </nav>

      {/* System Status Section */}
      <div className="mt-auto space-y-4 pt-8">
        <div className="px-3 mb-4">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Subsystem Link</p>
          <div className="h-px w-full bg-gray-200 mt-2" />
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gray-50/80 p-5 border border-gray-100 group">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 bg-indigo-100/40 blur-3xl group-hover:bg-indigo-100/60 transition-colors" />
          
          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-100">
                  <Database className="h-3.5 w-3.5 text-indigo-600" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">Storage Matrix</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600">98.2%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 border border-blue-100">
                  <Cpu className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">Neural Load</span>
              </div>
              <span className="text-[10px] font-bold text-indigo-600">12.4%</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em]">Stable Link</span>
            </div>
            <Globe className="h-3.5 w-3.5 text-gray-400 animate-spin-slow" />
          </div>
        </div>

        <p className="text-[8px] text-center text-gray-400 font-bold uppercase tracking-[0.3em] pb-2">
          Node Cluster: SLIIT-FC-01
        </p>
      </div>
    </aside>
  )
}
