import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarCheck2,
  AlertCircle,
  ShieldCheck,
  School,
  ChevronRight,
  Database,
  Cpu,
  Globe,
  Terminal,
  Box,
  Activity,
  Server,
  Layers,
  Zap,
  Boxes
} from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import { motion } from 'framer-motion'

export default function Sidebar() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const links = [
    { label: 'Command Center', href: isAdmin ? '/admin' : '/dashboard', icon: LayoutDashboard, color: 'text-violet-600' },
    { label: 'Asset Matrix', href: '/resources', icon: Boxes, color: 'text-blue-600' },
    { label: 'Reservations', href: '/bookings/my', icon: CalendarCheck2, color: 'text-indigo-600' },
    { label: 'Sentinel Terminal', href: '/tickets', icon: Terminal, color: 'text-rose-600' },
    ...(isAdmin ? [{ label: 'Admin Protocols', href: '/admin/resources', icon: ShieldCheck, color: 'text-amber-600' }] : []),
  ]

  return (
    <aside className="sticky top-0 h-screen w-80 flex flex-col bg-white border-r border-slate-100 p-8 z-50">
      {/* Branding Sub-System */}
      <div className="mb-14 px-2 group">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-5"
        >
          <div className="relative h-14 w-14 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-slate-900/20 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/30 to-transparent" />
             <School className="text-white h-7 w-7 relative z-10" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-black tracking-tighter uppercase leading-[0.8] text-slate-900">
              Smart<span className="text-violet-600 italic font-medium">Campus</span>
            </h2>
            <div className="flex items-center gap-2 mt-2 px-1">
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-sans">Infrastructure</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Sub-Matrix */}
      <nav className="flex-1 space-y-2">
        <div className="px-5 mb-8">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.6em]">Operational Command</p>
        </div>

        {links.map((link, i) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.label}
              to={link.href}
              className={({ isActive }) =>
                `group relative flex items-center justify-between p-4.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/40'
                    : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <div className="flex items-center gap-5 relative z-10 pl-1">
                 <div className={`transition-transform duration-500 group-hover:scale-110 group-[.active]:text-white ${link.color}`}>
                    <Icon size={20} />
                 </div>
                 <span>{link.label}</span>
              </div>
              
              <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500" />
              
              {/* Active Indicator Pulse */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-violet-600 rounded-full opacity-0 group-[.active]:opacity-100 shadow-[0_0_12px_rgba(124,58,237,0.8)]" />
            </NavLink>
          )
        })}
      </nav>

      {/* Telemetry Core Module */}
      <div className="mt-auto space-y-10 pt-16">
        <div className="p-8 bg-slate-50 border border-slate-100 rounded-[3rem] space-y-10 relative overflow-hidden group/tel shadow-sm hover:shadow-xl transition-all duration-700">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 blur-3xl -mr-16 -mt-16" />
          
          <div className="space-y-8">
            <div className="space-y-3.5">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 italic">
                <div className="flex items-center gap-2">
                  <Database size={12} className="text-blue-500" />
                  <span>Storage Matrix</span>
                </div>
                <span className="text-blue-600">98.2%</span>
              </div>
              <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden p-[2px]">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: '98.2%' }} 
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]" 
                />
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 italic">
                <div className="flex items-center gap-2">
                  <Cpu size={12} className="text-violet-500" />
                  <span>Neural Load</span>
                </div>
                <span className="text-violet-600">12.4%</span>
              </div>
              <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden p-[2px]">
                <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: '12.4%' }} 
                   transition={{ duration: 1.5, ease: "easeOut" }}
                   className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.3)]" 
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] italic">Stable Node</span>
            </div>
            <Globe className="text-slate-300 group-hover/tel:text-violet-400 group-hover/tel:rotate-180 transition-all duration-1000 h-4 w-4" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 text-slate-300 py-2 border-t border-slate-50 opacity-50">
          <Server size={14} className="animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">SLIIT-NODE:Verified</p>
        </div>
      </div>
    </aside>
  )
}
