import { motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Package,
  PlusCircle,
  Ticket,
  XCircle,
  ChevronRight,
  Zap,
  LayoutDashboard,
  ShieldCheck,
  Activity,
  Cpu,
  Database
} from 'lucide-react'
import StatsCard from '../components/StatsCard'

export default function Dashboard({ role }) {
  const stats = [
    { icon: Activity, title: 'Operational Bookings', value: '1,284', trend: 12, color: 'primary' },
    { icon: AlertCircle, title: 'Network Incidents', value: '23', trend: -5, color: 'orange' },
    { icon: Database, title: 'Managed Resources', value: '142', trend: 8, color: 'blue' },
    { icon: Cpu, title: 'Queue Latency', value: '0.8s', trend: 2, color: 'violet' },
  ]

  const recentBookings = [
    { id: 'BK-1234', resource: 'Technical Lab 3', user: 'John Wick', date: '2026-04-14', status: 'approved' },
    { id: 'BK-1235', resource: 'Seminar Room B', user: 'Jane Foster', date: '2026-04-14', status: 'pending' },
    { id: 'BK-1236', resource: 'Holographic Studio', user: 'Tony Stark', date: '2026-04-13', status: 'rejected' },
    { id: 'BK-1237', resource: 'Quantum Computing Lab', user: 'Bruce Banner', date: '2026-04-13', status: 'approved' },
  ]

  const ticketUpdates = [
    { id: 'TC-101', title: 'Server Rack #4 Overheating', status: 'open', priority: 'high', time: '2h ago' },
    { id: 'TC-102', title: 'Lobby Smart Glass Glitch', status: 'resolved', priority: 'medium', time: '5h ago' },
    { id: 'TC-103', title: 'Library HVAC Calibration', status: 'in-progress', priority: 'high', time: '1d ago' },
  ]

  const StatusPill = ({ status }) => {
    const styles = {
      approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
      pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]',
      rejected: 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]',
      open: 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]',
      resolved: 'bg-primary-500/10 text-primary-500 border-primary-500/20 shadow-[0_0_15px_rgba(124,58,237,0.1)]',
      'in-progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]',
    }

    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest ${styles[status]}`}>
        <div className={`h-1.5 w-1.5 rounded-full ${status === 'approved' || status === 'resolved' ? 'bg-current animate-pulse' : 'bg-current opacity-50'}`} />
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-10">
      {/* Header Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/5 p-8 lg:p-12 mb-10 group">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-primary-600/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary-600/20 rounded-full blur-2xl animate-pulse-slow" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-[#020617] border border-white/10 shadow-2xl">
                <LayoutDashboard className="h-10 w-10 text-primary-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary-500/10 border border-primary-500/20 text-[9px] font-black text-primary-400 uppercase tracking-widest">
                  <Activity className="w-3 h-3" /> Live Feed
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Node ID: SLIIT-CMD-01</span>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight uppercase">Operational Command</h1>
              <p className="text-slate-400 font-medium max-w-lg mt-1 italic tracking-wide">Streamlining institutional workflows with intelligent automation and real-time operational insights.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="h-14 px-8 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-3 active:scale-95 shadow-xl">
              <Ticket className="w-4 h-4 text-primary-500" /> Incident Protocol
            </button>
            <button className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] transition-all flex items-center gap-3 active:scale-95">
              <PlusCircle className="w-4 h-4" /> Global Reservation
            </button>
          </div>
        </div>
      </section>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <StatsCard key={stat.title} {...stat} delay={idx * 0.1} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Bookings Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-primary-500 rounded-full" />
              <h3 className="text-xl font-black text-white uppercase tracking-widest">Real-Time Event Matrix</h3>
            </div>
            <button className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] flex items-center gap-2 hover:translate-x-1 transition-all">
              Comprehensive Log <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-primary-500/10 to-indigo-500/10 rounded-[2rem] blur opacity-50" />
            <div className="relative glass-card !p-0 overflow-hidden border-white/5 !rounded-[2rem] shadow-2xl bg-[#020617]/40">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/[0.05]">
                      <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">Global Reference</th>
                      <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">Resource Unit</th>
                      <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">Timeline</th>
                      <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">Status Protocol</th>
                      <th className="px-8 py-5" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentBookings.map((booking) => (
                      <motion.tr
                        key={booking.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="group transition-all hover:bg-white/[0.03]"
                      >
                        <td className="px-8 py-6 text-xs font-black text-primary-500 tracking-widest">#{booking.id}</td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-black text-white tracking-tight uppercase">{booking.resource}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 italic">{booking.user}</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <Clock className="w-3.5 h-3.5 text-slate-600" />
                            {booking.date}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <StatusPill status={booking.status} />
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-primary-500 text-slate-500 hover:text-white transition-all shadow-xl">
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="space-y-6">
          <div className="px-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-rose-500 rounded-full" />
              <h3 className="text-xl font-black text-white uppercase tracking-widest">System Sentinel</h3>
            </div>
          </div>
          
          <div className="relative group overflow-hidden rounded-[2rem]">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-[#020617] border border-white/5" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl -mr-16 -mt-16" />
            
            <div className="relative p-8 space-y-8">
              {ticketUpdates.map((ticket, idx) => (
                <motion.div 
                  key={ticket.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative pl-6 border-l-2 border-white/10 hover:border-primary-500 transition-all duration-500"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1.5 text-left">
                      <p className="text-[9px] font-black text-primary-500 uppercase tracking-widest italic leading-none">Security Node {ticket.id}</p>
                      <h5 className="text-sm font-black text-white tracking-widest uppercase group-hover:text-primary-400 transition-colors">{ticket.title}</h5>
                    </div>
                    <div className={`h-2.5 w-2.5 rounded-full ${ticket.priority === 'high' ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)]' : 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]'} animate-pulse`} />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <StatusPill status={ticket.status} />
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">{ticket.time}</p>
                  </div>
                </motion.div>
              ))}

              <button className="w-full h-14 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white hover:bg-primary-500 hover:border-primary-500 transition-all shadow-xl mt-4">
                Access Audit Repository
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Area */}
      <section className="space-y-6 pt-6">
        <div className="px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-amber-500 rounded-full" />
            <h3 className="text-xl font-black text-white uppercase tracking-widest">Rapid Command Matrix</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Network Node Registration', icon: ShieldCheck, action: 'ADMIN_INIT', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Security Incident Protocol', icon: Ticket, action: 'THREAT_REPORT', color: 'text-rose-500', bg: 'bg-rose-500/10' },
            { label: 'Temporal Schedule Link', icon: Calendar, action: 'TIME_SYNC', color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { label: 'Resource Lifecycle Audit', icon: Package, action: 'SYS_VERIFY', color: 'text-primary-500', bg: 'bg-primary-500/10' },
          ].map((item, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative overflow-hidden glass-card flex items-center gap-6 group hover:border-primary-500/50 transition-all duration-500 !p-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className={`h-14 w-14 flex items-center justify-center rounded-2xl ${item.bg} ${item.color} group-hover:bg-white group-hover:text-primary-600 transition-all duration-500 shadow-lg`}>
                <item.icon className="h-7 w-7" />
              </div>
              <div className="text-left relative z-10 flex-1">
                <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${item.color} mb-1 italic opacity-70`}>{item.action}</p>
                <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-primary-400 transition-colors leading-tight">{item.label}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-primary-500 transition-all translate-x-2 group-hover:translate-x-0" />
            </motion.button>
          ))}
        </div>
      </section>
    </div>
  )
}
