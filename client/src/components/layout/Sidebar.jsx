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
  Globe,
  Network,
  Terminal,
  Layers,
  Box,
  Zap,
  Activity,
  Server
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'

export default function Sidebar() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const links = [
    { label: 'Command Center', href: isAdmin ? '/admin' : '/dashboard', icon: LayoutDashboard },
    { label: 'Asset Matrix', href: '/resources', icon: Box },
    { label: 'Reservations', href: '/bookings/my', icon: CalendarCheck2 },
    { label: 'Support Terminal', href: '/tickets', icon: Terminal },
    ...(isAdmin ? [{ label: 'Admin Protocol', href: '/admin/resources', icon: ShieldCheck }] : []),
  ]

  return (
    <aside className="sticky top-0 h-screen w-80 flex flex-col bg-slate-900 text-white p-6 overflow-y-auto scrollbar-none z-50 shadow-[20px_0_60px_rgba(0,0,0,0.1)]">
      {/* Supreme Branding */}
      <div className="mb-14 px-2">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-5"
        >
          <div className="relative group">
            <div className="absolute -inset-2 bg-indigo-500/30 rounded-2xl blur-lg group-hover:bg-indigo-500/50 transition-all duration-700" />
            <div className="relative h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-500">
               <School className="text-white h-8 w-8" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tighter uppercase leading-none italic">
              Smart<span className="text-indigo-400 not-italic">Campus</span>
            </h2>
            <div className="flex items-center gap-2 mt-2">
               <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Infrastructure Grid</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Grid */}
      <nav className="flex-1 space-y-2">
        <div className="px-4 mb-6">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Primary Operations</p>
        </div>

        {links.map((link, i) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.label}
              to={link.href}
              className={({ isActive }) =>
                `group relative flex items-center justify-between p-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-[0_15px_30px_rgba(255,255,255,0.1)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <div className="flex items-center gap-5 relative z-10 font-bold">
                 <Icon className="h-5 w-5 transition-transform duration-500 group-hover:scale-110" />
                 <span>{link.label}</span>
              </div>
              
              {/* Active Glow */}
              <div className="absolute inset-0 bg-white opacity-0 group-[.active]:opacity-5 rounded-2xl blur-xl transition-opacity" />
              
              <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500" />
            </NavLink>
          )
        })}
      </nav>

      {/* Telemetry Block */}
      <div className="mt-auto space-y-6 pt-10">
        <div className="px-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Terminal Feed</p>
        </div>

        <div className="p-6 bg-white/5 border border-white/5 rounded-[2.5rem] space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-3xl -mr-12 -mt-12 group-hover:bg-indigo-500/20 transition-all" />
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                <span>Storage Matrix</span>
                <span className="text-indigo-400">98.2%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '98.2%' }} className="h-full bg-indigo-500" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                <span>Neural Load</span>
                <span className="text-emerald-400">12.4%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '12.4%' }} className="h-full bg-emerald-500" />
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em] italic">Stable Link</span>
            </div>
            <Activity size={14} className="text-slate-600" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 text-slate-500 py-2">
          <Server size={14} />
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">NODE: SLIIT-FC-01</p>
        </div>
      </div>
    </aside>
  )
}
