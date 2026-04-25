import { motion } from 'framer-motion'
import { 
  Building2, 
  Users, 
  MapPin, 
  Activity, 
  Clock, 
  ChevronLeft,
  CalendarCheck,
  ShieldCheck,
  Zap,
  ArrowUpRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ResourceDetailPage() {
  const navigate = useNavigate()
  const resource = {
    name: 'Computer Lab 3',
    type: 'LAB',
    capacity: 40,
    location: 'Block B',
    status: 'ACTIVE',
    availability: 'Weekdays 08:00 - 17:00',
  }

  const specs = [
    { label: 'Classification', value: resource.type, icon: Building2 },
    { label: 'Max Occupancy', value: `${resource.capacity} Personnel`, icon: Users },
    { label: 'Geospatial Sector', value: resource.location, icon: MapPin },
    { label: 'Operational Status', value: resource.status, icon: Activity },
    { label: 'Availability Window', value: resource.availability, icon: Clock },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary-500 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Inventory
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between px-2 gap-6">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-emerald-500/10 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
            <ShieldCheck className="h-8 w-8 text-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3.5 h-3.5 text-primary-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary-500">Resource Detail Inspector</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{resource.name}</h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Institutional asset specification and availability metadata.</p>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary py-4 px-8 text-xs font-black uppercase tracking-[0.15em] flex items-center gap-2 shadow-xl shadow-primary-500/20"
        >
          <CalendarCheck className="w-4 h-4" /> Initialize Booking Protocol
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card !bg-white dark:!bg-slate-900 overflow-hidden !p-0">
            <div className="h-64 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-950 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2 className="w-24 h-24 text-slate-400/20" />
              </div>
              <div className="absolute top-6 right-6">
                <span className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest">
                  Live Status: {resource.status}
                </span>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">Institutional Specifications</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                This academic facility is optimized for technical operations and collaborative research. 
                Equipped with high-performance computing units and localized air purification systems. 
                Usage during off-hours requires special administrative authorization.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Fiber Uplink', 'HVAC Control', 'Biometric Entry', 'UHD Projector'].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card !bg-slate-50 dark:!bg-slate-900/50 border-primary-500/10">
            <h4 className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] mb-6">Asset Metadata</h4>
            <div className="space-y-5">
              {specs.map((spec) => (
                <div key={spec.label} className="group">
                  <div className="flex items-center gap-3 mb-1.5">
                    <spec.icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-500 transition-colors" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{spec.label}</span>
                  </div>
                  <p className="text-sm font-black text-slate-900 dark:text-slate-200 uppercase pl-7">{spec.value}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Operational Health</span>
                <span className="text-xs font-black text-emerald-500 uppercase tracking-wider">98.4%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "98.4%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
