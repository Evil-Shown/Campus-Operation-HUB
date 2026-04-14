import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Calendar, ChevronRight, AlertCircle, Users, TrendingUp } from 'lucide-react'

const tickets = [
  { title: 'Broken AC in Library', priority: 'High', priorityClass: 'text-red-600 bg-red-50', dotClass: 'bg-red-500' },
  { title: 'Projector not working', priority: 'Medium', priorityClass: 'text-orange-600 bg-orange-50', dotClass: 'bg-orange-500' },
  { title: 'Room cleaning request', priority: 'Low', priorityClass: 'text-emerald-600 bg-emerald-50', dotClass: 'bg-emerald-500' },
]

const resources = [
  { name: 'Conference Room A', status: 'Available', badgeClass: 'bg-emerald-100 text-emerald-700' },
  { name: 'Audio Equipment', status: 'In Use', badgeClass: 'bg-orange-100 text-orange-700' },
  { name: 'Sports Hall', status: 'Maintenance', badgeClass: 'bg-red-100 text-red-700' },
]

export default function DashboardPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (index) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: index * 0.1, duration: 0.5, ease: 'easeOut' },
    }),
  }

  return (
    <section id="dashboard-preview" ref={ref} className="relative py-20 md:py-28 bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50/50 pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold uppercase tracking-wide text-indigo-600"
          >
            Dashboard Preview
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-4xl md:text-5xl font-bold text-slate-900"
          >
            A dashboard built for efficiency
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-slate-600"
          >
            Everything you need at your fingertips, beautifully organized and easy to use.
          </motion.p>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Booking Calendar Card */}
          <motion.div
            custom={0}
            variants={cardVariants}
            whileHover={{ y: -4 }}
            className="rounded-xl border border-slate-200 bg-white shadow-md overflow-hidden"
          >
            <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-blue-50/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Booking Calendar</h3>
                    <p className="text-xs text-slate-500">April 2026</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-7 gap-2 text-center mb-3">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <div key={`${day}-${index}`} className="text-xs font-semibold text-slate-500">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {[...Array(30)].map((_, i) => {
                  const isActive = i === 13
                  return (
                    <div
                      key={i}
                      className={`rounded-lg py-1.5 text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {i + 1}
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Incidents Card */}
          <motion.div
            custom={1}
            variants={cardVariants}
            whileHover={{ y: -4 }}
            className="rounded-xl border border-slate-200 bg-white shadow-md overflow-hidden"
          >
            <div className="border-b border-slate-100 bg-gradient-to-r from-red-50 to-red-50/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500">
                    <AlertCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Open Incidents</h3>
                    <p className="text-xs text-slate-500">Current tickets</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
            <div className="p-4 space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket.title} className="flex items-start gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full mt-1.5 ${ticket.dotClass}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{ticket.title}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded ${ticket.priorityClass}`}>
                      {ticket.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Resources Status Card */}
          <motion.div
            custom={2}
            variants={cardVariants}
            whileHover={{ y: -4 }}
            className="rounded-xl border border-slate-200 bg-white shadow-md overflow-hidden"
          >
            <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-emerald-50/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Resources</h3>
                    <p className="text-xs text-slate-500">Availability status</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
            <div className="p-4 space-y-3">
              {resources.map((resource) => (
                <div key={resource.name} className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900">{resource.name}</p>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${resource.badgeClass}`}>
                    {resource.status}
                  </span>
                </div>
              ))}
              <button className="w-full mt-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                View all resources
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
