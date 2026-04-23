import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Plus,
  ChevronRight,
  TrendingUp,
  Activity,
  Users,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  Monitor,
  BookOpen,
  Dumbbell,
  Utensils,
  Car,
  Sparkles,
  ArrowUpRight
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const resourceCategories = [
  { name: 'Study Rooms', icon: BookOpen, color: 'primary', count: 12 },
  { name: 'Computer Labs', icon: Monitor, color: 'indigo', count: 8 },
  { name: 'Meeting Rooms', icon: Users, color: 'blue', count: 6 },
  { name: 'Gym Facilities', icon: Dumbbell, color: 'violet', count: 4 },
  { name: 'Cafeteria', icon: Utensils, color: 'purple', count: 3 },
  { name: 'Parking', icon: Car, color: 'slate', count: 2 }
]

const upcomingBookings = [
  {
    id: 'BK-2024-001',
    resourceName: 'Study Room A-204',
    category: 'Study Rooms',
    date: '2026-04-24',
    time: '10:00 AM - 12:00 PM',
    status: 'confirmed',
    location: 'Building A, Floor 2'
  },
  {
    id: 'BK-2024-002',
    resourceName: 'Computer Lab 3',
    category: 'Computer Labs',
    date: '2026-04-25',
    time: '2:00 PM - 4:00 PM',
    status: 'pending',
    location: 'Building B, Floor 1'
  }
]

const recentTickets = [
  {
    id: 'TK-2024-002',
    title: 'Projector connectivity in C-101',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2 hrs ago'
  },
  {
    id: 'TK-2024-003',
    title: 'AC maintenance in Lab 3',
    status: 'open',
    priority: 'medium',
    createdAt: '5 hrs ago'
  }
]

function StatCard({ title, value, change, icon: Icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card flex flex-col justify-between group"
    >
      <div className="flex justify-between items-start">
        <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-500 group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
          <ArrowUpRight className="w-3 h-3" />
          {change}%
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{value}</p>
        <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{title}</p>
      </div>
    </motion.div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    confirmed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    resolved: 'bg-primary-500/10 text-primary-600 border-primary-500/20',
    open: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    'in-progress': 'bg-blue-500/10 text-blue-600 border-blue-500/20'
  }
  return (
    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>
      {status}
    </span>
  )
}

export default function UserDashboard() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Hero */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 lg:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-primary-600/20 blur-[130px] animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-80 w-80 rounded-full bg-indigo-600/10 blur-[120px] animate-pulse-slow" />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400">Personal Portal</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-4"
            >
              Great to see you, <br />
              <span className="text-gradient">{user?.name || 'Academic'}</span>.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 font-medium text-lg max-w-md leading-relaxed"
            >
              Manage your bookings, track incidents, and access campus resources from your unified command center.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard title="Active Reservations" value="03" change="12" icon={Calendar} delay={0.3} />
            <StatCard title="Total Credits" value="1.2k" change="08" icon={TrendingUp} delay={0.4} />
            <StatCard title="Pending Tickets" value="02" change="10" icon={Activity} delay={0.5} />
            <StatCard title="Hours Logged" value="128" change="15" icon={BarChart3} delay={0.6} />
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reservation Terminal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary-500" /> Upcoming Reservations
            </h3>
            <Link to="/bookings/my" className="text-xs font-bold text-primary-500 hover:underline">View All Schedule</Link>
          </div>

          <div className="space-y-4">
            {upcomingBookings.map((booking, idx) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (idx * 0.1) }}
                className="glass-card flex flex-col md:flex-row md:items-center justify-between gap-6 hover:translate-x-1"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-white/5">
                    <BookOpen className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{booking.resourceName}</h4>
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {booking.location}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5 justify-end mb-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {booking.date}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 justify-end">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {booking.time}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                  <button className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <ChevronRight className="w-4 h-4 text-primary-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Support Terminal */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Support Hub</h3>
            <Link to="/tickets" className="text-xs font-bold text-primary-500 hover:underline">History</Link>
          </div>

          <div className="glass-card space-y-6">
            {recentTickets.map((ticket, idx) => (
              <div key={ticket.id} className="group relative pl-4 border-l-2 border-primary-500/20 hover:border-primary-500 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <StatusBadge status={ticket.status} />
                  <span className="text-[10px] font-bold text-slate-400">{ticket.createdAt}</span>
                </div>
                <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary-500 transition-colors line-clamp-1">{ticket.title}</h5>
                <p className="text-[10px] font-medium text-slate-500 mt-1">Ref: {ticket.id} &bull; Priority: {ticket.priority}</p>
              </div>
            ))}
            <button className="btn-primary w-full py-4 text-xs tracking-[0.2em] uppercase font-black">
              New Support Case
            </button>
          </div>
        </div>
      </div>

      {/* Resource Directory */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Resource Directory</h3>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter assets..." 
              className="bg-slate-100 dark:bg-slate-900/50 border border-transparent focus:border-primary-500/30 rounded-xl pl-10 pr-4 py-1.5 text-xs font-medium focus:outline-none transition-all w-48 focus:w-64"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {resourceCategories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              whileHover={{ y: -5 }}
              className="glass-card !p-5 flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-4 ring-1 ring-primary-500/20 group-hover:bg-primary-500 group-hover:rotate-6 transition-all duration-300">
                <cat.icon className="w-6 h-6 text-primary-500 group-hover:text-white transition-colors" />
              </div>
              <h6 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">{cat.name}</h6>
              <p className="text-[10px] font-bold text-slate-500 mt-1">{cat.count} AVAILABLE</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
