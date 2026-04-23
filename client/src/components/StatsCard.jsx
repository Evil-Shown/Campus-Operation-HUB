import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function StatsCard({ icon: Icon, title, value, trend, color = 'primary' }) {
  const isPositive = trend > 0

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-card flex flex-col justify-between group transition-all duration-300"
    >
      <div className="flex justify-between items-start">
        <div className="p-3 rounded-2xl bg-primary-500/10 text-primary-500 group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5" />
        </div>
        {typeof trend === 'number' && (
          <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${
            isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
          }`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div className="mt-5">
        <p className="text-sm font-black text-slate-500 uppercase tracking-[0.15em] mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">{value}</p>
        </div>
      </div>
      
      <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '65%' }}
          className="h-full bg-primary-500 rounded-full"
        />
      </div>
    </motion.div>
  )
}
