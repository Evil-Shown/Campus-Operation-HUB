import { useState, useEffect } from 'react'
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
  Database,
  Zap,
  Network,
  Server,
  Layers,
  Box,
  Layout,
  Globe,
  Grid
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import StatsCard from '../components/StatsCard'
import { listMyBookings } from '../api/bookings'
import { listTickets } from '../api/tickets'
import { listResources } from '../api/resources'

function StatusBadge({ status }) {
  const styles = {
    confirmed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-sm',
    approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-sm',
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-sm',
    resolved: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20 shadow-sm',
    open: 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-sm',
    'in-progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-sm',
    rejected: 'bg-slate-500/10 text-slate-500 border-slate-500/20 shadow-sm'
  }
  const cleanStatus = (status || '').toLowerCase()
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${styles[cleanStatus] || styles.pending}`}>
      <div className={`h-1.5 w-1.5 rounded-full bg-current ${['confirmed', 'resolved', 'approved'].includes(cleanStatus) ? 'animate-pulse' : 'opacity-70'}`} />
      {status}
    </span>
  )
}

const BentoBox = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className={`bg-white/70 backdrop-blur-3xl border border-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden group hover:shadow-2xl transition-all duration-500 perspective-1000 ${className}`}
  >
    {children}
  </motion.div>
)

export default function UserDashboard() {
  const { user, apiBaseUrl, token } = useAuth()
  const [bookings, setBookings] = useState([])
  const [tickets, setTickets] = useState([])
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        
        const [bookingsData, ticketsData, resourcesData] = await Promise.all([
          listMyBookings({ baseUrl: apiBaseUrl, token }).catch(() => []),
          listTickets({ baseUrl: apiBaseUrl, token, scope: 'mine' }).catch(() => []),
          listResources({ baseUrl: apiBaseUrl, token }).catch(() => [])
        ])
        
        setBookings(bookingsData || [])
        setTickets(ticketsData || [])
        setResources(resourcesData || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (apiBaseUrl && token) {
      fetchData()
    }
  }, [apiBaseUrl, token])

  const upcomingBookings = bookings
    .filter(b => b.status === 'APPROVED' || b.status === 'PENDING' || b.status === 'CONFIRMED')
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .slice(0, 4)

  const recentTickets = tickets
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Server className="h-12 w-12 text-indigo-600 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-indigo-100 p-4 lg:p-8 space-y-8 animate-in fade-in duration-1000 relative overflow-hidden">
      
      {/* Background Animated Pulse */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-indigo-100/30 blur-[150px] rounded-full animate-float" />
        <div className="absolute top-1/2 -left-24 w-[400px] h-[400px] bg-emerald-50/40 blur-[120px] rounded-full animate-float [animation-delay:2s]" />
      </div>

      {/* Header Stat Strip */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-[0.8]">
            Operational <br />
            <span className="text-indigo-600 italic">Command Center</span>
          </h1>
          <div className="flex items-center gap-3 mt-6 px-1">
             <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-full">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Node: SLIIT-FC-01 &bull; Status: Optimal</p>
             </div>
          </div>
        </div>

        <div className="flex gap-4">
           {[
             { label: "Active Grid Protocols", value: upcomingBookings.length, icon: Layers, color: "text-indigo-600" },
             { label: "Sentinel Reports", value: recentTickets.filter(t => t.status === "OPEN").length, icon: ShieldCheck, color: "text-rose-500" },
             { label: "System Sync", value: "99.4%", icon: Activity, color: "text-emerald-500" }
           ].map((stat, i) => (
             <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-white/90 backdrop-blur-3xl border border-white px-8 py-6 rounded-[2.5rem] shadow-xl shadow-slate-200/40 flex items-center gap-6 group hover:shadow-2xl transition-all"
             >
                <div className={`p-3 rounded-2xl bg-slate-50 border border-slate-100 ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} />
                </div>
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                   <p className={`text-3xl font-black ${stat.color} tracking-tighter`}>{stat.value}</p>
                </div>
             </motion.div>
           ))}
        </div>
      </div>

      {/* Main Command Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Welcome Block */}
        <BentoBox className="lg:col-span-8 p-14 relative flex flex-col justify-center shimmer" delay={0.1}>
          <div className="absolute top-0 right-0 w-[45%] h-full bg-gradient-to-l from-indigo-50/70 to-transparent pointer-events-none" />
          
          <div className="relative z-10 space-y-10">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="inline-flex items-center gap-3 px-5 py-2 bg-indigo-600 border border-indigo-500 rounded-2xl shadow-xl shadow-indigo-600/20">
              <Zap size={14} className="text-white fill-white" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">Authentication Status: Secure</span>
            </motion.div>
            <motion.h2 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-8xl font-black text-slate-900 tracking-tighter leading-[0.8] uppercase">
              Welcome Back, <br />
              <span className="text-indigo-600 italic tracking-[-0.04em] font-medium">{user?.name?.split(' ')[0] || 'Operator'}</span>
            </motion.h2>
            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-3xl text-slate-500 font-bold max-w-2xl leading-[1.2] italic border-l-[12px] border-indigo-600/10 pl-10">
              The SmartCampus grid has been synchronized with your operational profile. All subsystems are ready for command.
            </motion.p>
          </div>
        </BentoBox>

        {/* Action Quick Launch */}
        <BentoBox className="lg:col-span-4 p-10 bg-slate-900 group border-slate-800" delay={0.2}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 blur-[80px] -mr-24 -mt-24" />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="space-y-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.5em]">Command Input</h3>
                  <Grid size={18} className="text-slate-700" />
               </div>
               <div className="grid grid-cols-2 gap-5">
                 {[
                   { icon: Plus, label: "Add Protocol", to: "/resources", color: "bg-indigo-600" },
                   { icon: AlertCircle, label: "Report Incident", to: "/tickets", color: "bg-rose-600" },
                   { icon: Database, label: "Grid Assets", to: "/resources", color: "bg-emerald-600" },
                   { icon: Settings, label: "Subsystems", to: "/dashboard", color: "bg-amber-600" }
                 ].map((action, i) => (
                   <Link key={i} to={action.to} className="flex flex-col items-center gap-4 p-6 bg-white/5 hover:bg-white/10 border border-white/5 rounded-[2.5rem] transition-all group/btn">
                      <div className={`h-14 w-14 rounded-2xl ${action.color} flex items-center justify-center group-hover/btn:scale-110 transition-all duration-500 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)]`}>
                        <action.icon className="text-white h-7 w-7" />
                      </div>
                      <span className="text-[10px] font-black text-white/40 group-hover/btn:text-white transition-colors uppercase tracking-[0.2em]">{action.label}</span>
                   </Link>
                 ))}
               </div>
            </div>
            <button className="w-full h-20 bg-white rounded-[2rem] mt-10 text-slate-900 font-bold uppercase tracking-[0.4em] text-[11px] hover:translate-y-[-6px] hover:shadow-2xl hover:shadow-indigo-500/20 transition-all">
              Launch Diagnostic
            </button>
          </div>
        </BentoBox>

        {/* Live Reservation Feed */}
        <BentoBox className="lg:col-span-12 p-12" delay={0.3}>
           <div className="flex items-center justify-between mb-12 px-4">
              <div className="flex items-center gap-6">
                 <div className="h-12 w-3 bg-indigo-600 rounded-full" />
                 <h3 className="text-3xl font-black text-slate-900 uppercase tracking-widest leading-none">Global Schedule Matrix</h3>
              </div>
              <Link to="/bookings/my" className="h-14 px-8 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                Enter Matrix Console <ArrowRight size={20} />
              </Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {upcomingBookings.length > 0 ? upcomingBookings.map((bk, i) => (
                 <motion.div 
                    key={bk.id} 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    whileHover={{ scale: 1.03, y: -12 }}
                    className="bg-white border border-slate-100 p-10 rounded-[4rem] shadow-2xl shadow-slate-200/30 hover:shadow-indigo-500/10 transition-all relative group/card overflow-hidden"
                 >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-bl-[4rem]" />
                    <div className="absolute top-8 right-10 z-10">
                       <StatusBadge status={bk.status} />
                    </div>
                    <div className="h-24 w-24 rounded-[2rem] bg-indigo-50 flex items-center justify-center text-indigo-600 mb-10 border border-indigo-100 group-hover/card:bg-indigo-600 group-hover/card:text-white transition-all duration-500">
                       <Monitor size={48} />
                    </div>
                    <div className="space-y-6">
                       <div className="flex items-center gap-3">
                          <p className="text-[11px] font-black text-indigo-600 uppercase tracking-widest italic">{bk.resource?.type || 'GRID_NODE'}</p>
                          <div className="h-1.5 w-1.5 bg-slate-200 rounded-full" />
                          <p className="text-[10px] font-black text-slate-400">ID: {bk.id}</p>
                       </div>
                       <h4 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">{bk.resource?.name || 'Institutional Asset'}</h4>
                       <div className="pt-6 border-t border-slate-50 space-y-4">
                          <div className="flex items-center gap-4 text-slate-400">
                             <Calendar size={16} className="text-indigo-500" />
                             <span className="text-[11px] font-black uppercase tracking-widest">{new Date(bk.startTime).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-4 text-slate-400">
                             <Clock size={16} className="text-indigo-500" />
                             <span className="text-[11px] font-black uppercase tracking-widest">{new Date(bk.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                       </div>
                    </div>
                 </motion.div>
              )) : (
                <div className="col-span-full py-24 flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-[5rem] bg-slate-50/30">
                   <Box size={80} className="text-slate-100 mb-8" />
                   <p className="text-base font-black text-slate-300 uppercase tracking-[0.5em]">Grid Matrix Offline: No Active Protocols</p>
                </div>
              )}
           </div>
        </BentoBox>

        {/* Sentinel Support Logs */}
        <BentoBox className="lg:col-span-4 p-12 flex flex-col" delay={0.4}>
           <div className="flex items-center gap-6 mb-12">
              <div className="h-12 w-3 bg-rose-500 rounded-full" />
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-widest leading-none text-left">Sentinel Feed</h3>
           </div>
           
           <div className="flex-1 space-y-10">
              {recentTickets.length > 0 ? recentTickets.map((tk, i) => (
                <div key={tk.id} className="group/tk relative pl-10 border-l-[3px] border-slate-50 hover:border-indigo-600 transition-all duration-700 text-left">
                   <div className="flex items-start justify-between mb-2">
                      <div className="space-y-2">
                         <p className="text-[11px] font-black text-indigo-600 uppercase tracking-widest italic leading-none">{tk.category || 'Institutional'}</p>
                         <h5 className="text-sm font-black text-slate-800 uppercase tracking-wider line-clamp-1 group-hover/tk:text-indigo-600 transition-colors">{tk.description || 'System Event'}</h5>
                      </div>
                      <div className={`h-3 w-3 rounded-full mt-1.5 ${tk.priority === 'HIGH' || tk.priority === 'CRITICAL' ? 'bg-rose-500 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'bg-emerald-500'}`} />
                   </div>
                   <div className="flex items-center justify-between mt-6">
                      <StatusBadge status={tk.status} />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{new Date(tk.createdAt).toLocaleDateString()}</span>
                   </div>
                </div>
              )) : (
                <div className="flex h-full items-center justify-center opacity-20 italic">
                   <p className="text-base">Satellite feed clear.</p>
                </div>
              )}
           </div>
           <button className="w-full h-18 mt-12 bg-slate-900 border border-slate-800 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] text-white hover:bg-indigo-600 transition-all shadow-xl">
              Initialize Grid Signal
           </button>
        </BentoBox>

        {/* Global Asset Matrix Overview */}
        <BentoBox className="lg:col-span-8 p-12" delay={0.5}>
           <div className="flex items-center justify-between mb-12 px-4">
              <div className="flex items-center gap-6">
                 <div className="h-12 w-3 bg-emerald-500 rounded-full" />
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-widest">Grid Asset Directory</h3>
              </div>
           </div>
           
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: "Study Hubs", count: resources.filter(r => r.type === 'LECTURE_HALL' || r.type === 'STUDY_ROOM').length, icon: BookOpen, color: "text-indigo-600", border: "border-indigo-100" },
                { label: "Neural Nodes", count: resources.filter(r => r.type === 'LAB' || r.type === 'COMPUTER_LAB').length, icon: Cpu, color: "text-blue-600", border: "border-blue-100" },
                { label: "Collab Units", count: resources.filter(r => r.type === 'MEETING_ROOM').length, icon: Users, color: "text-emerald-600", border: "border-emerald-100" },
                { label: "Satellite Gear", count: resources.filter(r => r.type === 'EQUIPMENT').length, icon: Box, color: "text-amber-600", border: "border-amber-100" }
              ].map((matrix, i) => (
                <div key={i} className="bg-slate-50/50 border border-slate-100 p-8 rounded-[3rem] group/matrix hover:bg-white hover:shadow-2xl transition-all duration-500">
                   <div className={`h-16 w-16 rounded-[1.5rem] border bg-white flex items-center justify-center mb-8 group-hover/matrix:scale-110 group-hover/matrix:rotate-6 transition-all ${matrix.border}`}>
                      <matrix.icon className={`h-8 w-8 ${matrix.color}`} />
                   </div>
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{matrix.label}</p>
                   <p className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{matrix.count}</p>
                </div>
              ))}
           </div>
           
           <Link to="/resources" className="mt-10 p-8 bg-slate-900 rounded-[3rem] flex items-center justify-between group cursor-pointer hover:bg-indigo-600 transition-all duration-500 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-y-0 right-0 w-[30%] bg-white/5 skew-x-[-25deg] translate-x-20" />
              <div className="flex items-center gap-8 relative z-10">
                 <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center text-white ring-1 ring-white/20">
                   <Search size={32} />
                 </div>
                 <div className="text-left">
                    <h4 className="text-white font-black uppercase tracking-widest text-lg">Hyper-Search Matrix</h4>
                    <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest">Execute deep scanning across 2,400+ institutional assets</p>
                 </div>
              </div>
              <ChevronRight className="text-white h-10 w-10 group-hover:translate-x-4 transition-transform relative z-10" />
           </Link>
        </BentoBox>

      </div>
    </div>
  )
}
