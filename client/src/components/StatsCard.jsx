import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function StatsCard({ icon: Icon, title, value, trend, color = 'primary' }) {
  const isPositive = trend > 0
  const colorMap = {
    primary: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    orange: 'bg-amber-50 text-amber-600 border-amber-100',
    indigo: 'bg-violet-50 text-violet-600 border-violet-100',
  }

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-5 flex flex-col justify-between group transition-all duration-300 shadow-lg hover:shadow-xl"
    >
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl border ${colorMap[color]} group-hover:scale-110 transition-transform shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
        {typeof trend === 'number' && (
          <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${
            isPositive ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-rose-100 text-rose-700 border border-rose-200'
          }`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div className="mt-5">
        <p className="text-sm font-black text-gray-400 uppercase tracking-[0.15em] mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-black text-gray-800 leading-none">{value}</p>
        </div>
      </div>
      
      <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '65%' }}
          className="h-full bg-indigo-500 rounded-full"
        />
      </div>
    </motion.div>
  )
}
