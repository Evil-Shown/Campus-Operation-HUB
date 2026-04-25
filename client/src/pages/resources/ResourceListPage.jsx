import { motion } from 'framer-motion'
import { 
  Building2, 
  Users, 
  MapPin, 
  Search, 
  Filter, 
  Activity, 
  BookOpen, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Package
} from 'lucide-react'

const resources = [
  {
    id: 1,
    name: 'Lecture Hall A101',
    type: 'LECTURE_HALL',
    capacity: 80,
    location: 'Block A',
    status: 'ACTIVE',
    image: 'from-primary-500 to-indigo-600'
  },
  {
    id: 2,
    name: 'Computer Lab 3',
    type: 'LAB',
    capacity: 40,
    location: 'Block B',
    status: 'ACTIVE',
    image: 'from-emerald-500 to-teal-600'
  },
  {
    id: 3,
    name: 'Meeting Room 5',
    type: 'MEETING_ROOM',
    capacity: 10,
    location: 'Block C',
    status: 'OUT_OF_SERVICE',
    image: 'from-rose-500 to-red-600'
  },
]

function StatusPill({ status }) {
  const styles = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    OUT_OF_SERVICE: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  }
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

export default function ResourceListPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between px-2 gap-6">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-primary-600/10 border border-primary-500/20 shadow-lg shadow-primary-500/5">
            <Package className="h-8 w-8 text-primary-500" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3.5 h-3.5 text-primary-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary-500">Asset Management Module</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Institutional Resources</h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Inventory of academic and technical spaces across the institution.</p>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="glass-card !bg-white dark:!bg-slate-900 !p-3 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search specific assets or keywords..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm font-bold focus:border-primary-500 outline-none transition-all placeholder:font-normal"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 outline-none focus:border-primary-500">
            <option>All Types</option>
          </select>
          <select className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 outline-none focus:border-primary-500">
            <option>All Locations</option>
          </select>
          <button className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-primary-500 hover:text-white transition-all shadow-sm">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource, idx) => (
          <motion.div 
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            className="glass-card group !p-0 overflow-hidden border-white/5 dark:!bg-slate-900 shadow-xl"
          >
            <div className={`h-32 bg-gradient-to-br ${resource.image} relative p-6`}>
              <div className="absolute top-0 right-0 p-4">
                <StatusPill status={resource.status} />
              </div>
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Ref: ASST-00{resource.id}</p>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">{resource.name}</h2>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Building2 className="w-3 h-3" /> Classification
                  </p>
                  <p className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase">{resource.type.replace(/_/g, ' ')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Users className="w-3 h-3" /> Occupancy
                  </p>
                  <p className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase">{resource.capacity} Personnel</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> Geospatial Location
                </p>
                <p className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase">{resource.location}</p>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => <div key={i} className={`h-1 w-4 rounded-full ${i <= 4 ? 'bg-primary-500' : 'bg-slate-200 dark:bg-white/10'}`} />)}
                </div>
                <button
                  type="button"
                  className="btn-primary !py-2.5 !px-5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:scale-105 transition-all shadow-lg shadow-primary-500/20"
                >
                  Initiate Booking <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
