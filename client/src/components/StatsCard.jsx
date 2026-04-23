import { motion } from 'framer-motion'

const Motion = motion

export default function StatsCard({ icon: Icon, title, value, trend, color = 'indigo' }) {
  void Icon
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
  }

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-1 text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {typeof trend === 'number' && (
            <p className={`mt-2 text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? `+${trend}%` : `${trend}%`} from last month
            </p>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses[color] ?? colorClasses.indigo}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  )
}
