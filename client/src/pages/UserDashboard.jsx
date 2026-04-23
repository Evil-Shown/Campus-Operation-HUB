import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Database
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import StatsCard from '../components/StatsCard'

const resourceCategories = [
  { name: 'Study Rooms', icon: BookOpen, action: 'ACADEMIC_STUDY', count: 12, color: 'text-primary-500' },
  { name: 'Computer Labs', icon: Monitor, action: 'TECH_WORKSTATION', count: 8, color: 'text-indigo-400' },
  { name: 'Meeting Rooms', icon: Users, action: 'COLLAB_CENTER', count: 6, color: 'text-cyan-400' },
  { name: 'Gym Facilities', icon: Dumbbell, action: 'WELLNESS_NODE', count: 4, color: 'text-emerald-400' },
  { name: 'Cafeteria', icon: Utensils, action: 'ENERGY_CORE', count: 3, color: 'text-amber-400' },
  { name: 'Parking', icon: Car, action: 'LOGISTICS_ZONE', count: 2, color: 'text-slate-400' }
]

const upcomingBookings = [
  {
    id: 'BK-2024-001',
    resourceName: 'Technical Lab 3',
    category: 'Computer Labs',
    date: '2026-04-24',
    time: '10:00 AM - 12:00 PM',
    status: 'confirmed',
    location: 'Building A, Floor 2'
  },
  {
    id: 'BK-2024-002',
    resourceName: 'Seminar Room B',
    category: 'Meeting Rooms',
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

function StatusBadge({ status }) {
  const styles = {
    confirmed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]',
    resolved: 'bg-primary-500/10 text-primary-500 border-primary-500/20 shadow-[0_0_15px_rgba(124,58,237,0.1)]',
    open: 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]',
    'in-progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${styles[status]}`}>
      <div className={`h-1.5 w-1.5 rounded-full ${status === 'confirmed' || status === 'resolved' ? 'bg-current animate-pulse' : 'bg-current opacity-50'}`} />
      {status}
    </span>
  )
}

export default function UserDashboard() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-10">
      {/* Welcome Hero */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/5 p-8 lg:p-12 group">
        <div className="absolute top-0 right-0 w-[45%] h-full bg-gradient-to-l from-primary-600/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-12">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6"
            >
              <div className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400">Secure Personal Portal</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-6xl font-black text-white leading-[1] mb-6 tracking-tight uppercase"
            >
              Great to see you, <br />
              <span className="text-gradient drop-shadow-sm font-black">{user?.name?.split(' ')[0] || 'Operator'}</span>.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 font-medium text-xl max-w-lg leading-relaxed italic"
            >
              Streamlining institutional workflows with intelligent automation and real-time operational insights.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 gap-5 lg:w-[480px]">
            {[
              { icon: Calendar, title: 'Active Reservations', value: '03', trend: 12, color: 'primary' },
              { icon: ShieldCheck, title: 'Identity Status', value: 'Verified', trend: 100, color: 'blue' },
              { icon: Activity, title: 'Pending Support', value: '02', trend: -5, color: 'orange' },
              { icon: Database, title: 'Allocated Storage', value: '42GB', trend: 8, color: 'indigo' },
            ].map((stat, i) => (
              <StatsCard key={i} {...stat} delay={0.3 + (i * 0.1)} />
            ))}
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reservation Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-primary-500 rounded-full" />
              <h3 className="text-xl font-black text-white uppercase tracking-widest">Active Schedule Matrix</h3>
            </div>
            <Link to="/bookings/my" className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] flex items-center gap-2 hover:translate-x-1 transition-all">
              Initialize View <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-5">
            {upcomingBookings.map((booking, idx) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative group cursor-pointer"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/10 to-indigo-600/10 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative glass-card !bg-[#020617]/40 !rounded-[2rem] !p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-white/5 hover:border-primary-500/50 shadow-2xl transition-all">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-primary-500/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500" />
                      <div className="relative h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center border border-white/10 group-hover:bg-primary-600 transition-all duration-300">
                        <BookOpen className="w-8 h-8 text-primary-500 group-hover:text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black text-primary-500 uppercase tracking-widest italic">{booking.category}</span>
                        <div className="h-1 w-1 rounded-full bg-slate-700" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.1em]">Ref: {booking.id}</span>
                      </div>
                      <h4 className="text-xl font-black text-white uppercase tracking-tight">{booking.resourceName}</h4>
                      <p className="text-xs font-bold text-slate-400 flex items-center gap-2 mt-1 italic">
                        <MapPin className="w-4 h-4 text-primary-600" /> {booking.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs font-black text-white flex items-center gap-2 justify-end mb-1 uppercase tracking-wider">
                        <Calendar className="w-4 h-4 text-primary-500" /> {booking.date}
                      </p>
                      <p className="text-[10px] font-black text-slate-500 flex items-center gap-2 justify-end uppercase tracking-[0.1em]">
                        <Clock className="w-4 h-4 text-slate-600" /> {booking.time}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} />
                    <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/5 group-hover:bg-primary-500 group-hover:text-white transition-all shadow-xl">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sentinel Section */}
        <div className="space-y-6">
          <div className="px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-rose-500 rounded-full" />
              <h3 className="text-xl font-black text-white uppercase tracking-widest">Support Sentinel</h3>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-[2rem]">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-[#020617] border border-white/5" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl -mr-16 -mt-16" />
            
            <div className="relative p-8 space-y-8">
              {recentTickets.map((ticket, idx) => (
                <div key={ticket.id} className="group relative pl-6 border-l-2 border-white/10 hover:border-primary-500 transition-all duration-500">
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1.5 text-left text-left">
                      <p className="text-[9px] font-black text-primary-500 uppercase tracking-widest italic leading-none">Security Node {ticket.id}</p>
                      <h5 className="text-sm font-black text-white tracking-widest uppercase group-hover:text-primary-400 transition-colors line-clamp-1">{ticket.title}</h5>
                    </div>
                    <div className={`h-2.5 w-2.5 rounded-full ${ticket.priority === 'high' ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)]' : 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]'} animate-pulse`} />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <StatusBadge status={ticket.status} />
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">{ticket.createdAt}</span>
                  </div>
                </div>
              ))}
              <button className="w-full h-14 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white hover:bg-primary-500 hover:border-primary-500 transition-all shadow-xl mt-4">
                Initialize Protocol
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Section */}
      <section className="space-y-6 pt-6">
        <div className="px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-amber-500 rounded-full" />
            <h3 className="text-xl font-black text-white uppercase tracking-widest">Global Asset Directory</h3>
          </div>
          <div className="relative hidden sm:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="bg-[#020617]/40 border border-white/5 focus:border-primary-500/50 rounded-2xl pl-11 pr-5 h-11 text-xs font-bold uppercase tracking-widest focus:outline-none transition-all w-64 shadow-xl"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 px-1">
          {resourceCategories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card !bg-white/[0.01] border-white/5 !p-6 flex flex-col items-center text-center group cursor-pointer hover:!bg-white/[0.04] transition-all duration-500 !rounded-[2rem]"
            >
              <div className={`h-16 w-16 rounded-[1.5rem] bg-[#020617] border border-white/5 flex items-center justify-center mb-5 group-hover:bg-primary-600 transition-all duration-500 shadow-2xl`}>
                <cat.icon className={`w-8 h-8 ${cat.color} group-hover:text-white transition-colors`} />
              </div>
              <p className="text-[8px] font-black text-slate-600 mb-1 uppercase tracking-widest italic">{cat.action}</p>
              <h6 className="text-[11px] font-black text-white uppercase tracking-widest">{cat.name}</h6>
              <div className="mt-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary-500/10 border border-primary-500/20">
                <div className="h-1 w-1 rounded-full bg-primary-500" />
                <span className="text-[9px] font-black text-primary-400 uppercase tracking-[0.1em]">{cat.count} ACTIVE</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
