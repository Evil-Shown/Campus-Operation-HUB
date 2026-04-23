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
  LayoutDashboard
} from 'lucide-react'
import StatsCard from '../components/StatsCard'

export default function Dashboard({ role }) {
  const stats = [
    { icon: Calendar, title: 'Operational Bookings', value: '1,284', trend: 12, color: 'primary' },
    { icon: Ticket, title: 'Network Incidents', value: '23', trend: -5, color: 'orange' },
    { icon: Package, title: 'Managed Resources', value: '142', trend: 8, color: 'blue' },
    { icon: Clock, title: 'Queue Latency', value: '0.8s', trend: 2, color: 'violet' },
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
      approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      rejected: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      open: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      resolved: 'bg-primary-500/10 text-primary-500 border-primary-500/20',
      'in-progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    }

    return (
      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between px-2">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600/10 border border-primary-500/20 shadow-lg shadow-primary-500/5">
            <LayoutDashboard className="h-8 w-8 text-primary-500" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3.5 h-3.5 text-primary-500 fill-primary-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500">Resource Management Terminal</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Active Operations Hub</h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Monitoring institutional assets and personnel lifecycle.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="btn-secondary py-3 px-6 text-xs uppercase tracking-widest font-black flex items-center gap-2">
            <Ticket className="w-4 h-4" /> Issue Ticket
          </button>
          <button className="btn-primary py-3 px-6 text-xs uppercase tracking-widest font-black flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Book Asset
          </button>
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
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Global Activity Feed</h3>
            <button className="text-[10px] font-black text-primary-500 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
              Comprehensive Log <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="glass-card !p-0 overflow-hidden border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Reference</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Resource Unit</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Timeline</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {recentBookings.map((booking) => (
                    <motion.tr
                      key={booking.id}
                      className="group transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                    >
                      <td className="px-6 py-4 text-xs font-black text-primary-500">#{booking.id}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{booking.resource}</p>
                        <p className="text-[10px] font-medium text-slate-400 capitalize">{booking.user}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400">{booking.date}</td>
                      <td className="px-6 py-4">
                        <StatusPill status={booking.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 rounded-lg hover:bg-white dark:hover:bg-white/10 transition-colors text-slate-400">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="space-y-6">
          <div className="px-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Security & Support</h3>
          </div>
          
          <div className="glass-card flex flex-col h-full border-white/5">
            <div className="flex-1 space-y-6">
              {ticketUpdates.map((ticket) => (
                <div key={ticket.id} className="group relative pl-4 border-l-2 border-slate-100 dark:border-white/10 hover:border-primary-500 transition-all duration-300">
                  <div className="flex items-start justify-between mb-2">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Ticket {ticket.id}</p>
                      <StatusPill status={ticket.status} />
                    </div>
                    <div className={`h-2 w-2 rounded-full ${ticket.priority === 'high' ? 'bg-rose-500 shadow-lg shadow-rose-500/20' : 'bg-amber-500 shadow-lg shadow-amber-500/20'}`} />
                  </div>
                  <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary-500 transition-colors">{ticket.title}</h5>
                  <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ticket.time}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
              <button className="w-full btn-secondary py-3 text-[10px] font-black uppercase tracking-widest">
                Support Repository
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Area */}
      <section className="space-y-6">
        <div className="px-2">
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Rapid Command Access</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Register Asset', icon: BookOpen, action: 'Create' },
            { label: 'Incident Protocol', icon: Ticket, action: 'Report' },
            { label: 'Schedule Matrix', icon: Calendar, action: 'View' },
            { label: 'System Audit', icon: Package, action: 'Review' },
          ].map((item, idx) => (
            <motion.button
              key={idx}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass-card flex items-center gap-4 group hover:bg-primary-500 transition-all duration-300"
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary-500/10 text-primary-500 group-hover:bg-white group-hover:text-primary-500 transition-colors">
                <item.icon className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white/70">{item.action}</p>
                <p className="text-sm font-black text-slate-800 dark:text-white group-hover:text-white">{item.label}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>
    </div>
  )
}
