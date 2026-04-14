import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Calendar, ChevronRight, Package, Ticket } from 'lucide-react'

const calendarDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const calendarDates = [29, 30, 31, 1, 2, 3, 4]

const tickets = [
  { title: 'Broken AC in Library', priority: 'High', priorityClass: 'text-red-600 dark:text-red-400', dotClass: 'bg-red-500' },
  { title: 'Projector not working', priority: 'Medium', priorityClass: 'text-orange-600 dark:text-orange-400', dotClass: 'bg-orange-500' },
  { title: 'Room cleaning request', priority: 'Low', priorityClass: 'text-emerald-600 dark:text-emerald-400', dotClass: 'bg-emerald-500' },
]

const resources = [
  { name: 'Conference Room A', status: 'Available', badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  { name: 'Audio Equipment', status: 'In Use', badgeClass: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  { name: 'Sports Hall', status: 'Maintenance', badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  { name: 'Study Pods', status: 'Available', badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
]

export default function DashboardPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (index) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: index * 0.1, duration: 0.5, ease: 'easeOut' },
    }),
  }

  return (
    <section id="dashboard-preview" ref={ref} className="bg-white py-20 md:py-28 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400"
          >
            Modern Interface
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-3xl font-bold text-transparent md:text-4xl dark:from-white dark:to-slate-300"
          >
            A dashboard built for efficiency
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-slate-600 dark:text-slate-300"
          >
            Everything you need at your fingertips, beautifully organized.
          </motion.p>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.article
            custom={0}
            variants={cardVariants}
            whileHover={{ y: -5 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-lg dark:border-slate-700 dark:from-slate-900/70 dark:to-slate-900/40"
          >
            <div className="border-b border-slate-200 p-5 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-500" />
                  <h3 className="font-semibold text-slate-800 dark:text-white">Booking Calendar</h3>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
            <div className="p-5">
              <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs">
                {calendarDays.map((day) => (
                  <div key={day} className="font-medium text-slate-500 dark:text-slate-400">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {calendarDates.map((date) => (
                  <div
                    key={date}
                    className={`cursor-pointer rounded-full p-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 ${
                      date === 1 ? 'bg-indigo-600 text-white' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {date}
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300">Conference Room A</span>
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">2:00 PM</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300">Sports Complex</span>
                  <span className="font-medium text-purple-600 dark:text-purple-400">10:00 AM</span>
                </div>
              </div>
            </div>
          </motion.article>

          <motion.article
            custom={1}
            variants={cardVariants}
            whileHover={{ y: -5 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-lg dark:border-slate-700 dark:from-slate-900/70 dark:to-slate-900/40"
          >
            <div className="border-b border-slate-200 p-5 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-purple-500" />
                  <h3 className="font-semibold text-slate-800 dark:text-white">Active Tickets</h3>
                </div>
                <span className="text-xs font-medium text-purple-600 dark:text-purple-400">3 pending</span>
              </div>
            </div>
            <div className="space-y-3 p-5">
              {tickets.map((ticket) => (
                <div key={ticket.title} className="flex items-center justify-between rounded-lg bg-white p-2 dark:bg-slate-800">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">{ticket.title}</p>
                    <p className={`text-xs ${ticket.priorityClass}`}>{ticket.priority}</p>
                  </div>
                  <span className={`h-2 w-2 rounded-full ${ticket.dotClass}`} />
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article
            custom={2}
            variants={cardVariants}
            whileHover={{ y: -5 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-lg dark:border-slate-700 dark:from-slate-900/70 dark:to-slate-900/40"
          >
            <div className="border-b border-slate-200 p-5 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-emerald-500" />
                  <h3 className="font-semibold text-slate-800 dark:text-white">Resource Availability</h3>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
            <div className="space-y-3 p-5">
              {resources.map((resource) => (
                <div key={resource.name} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-300">{resource.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${resource.badgeClass}`}>{resource.status}</span>
                </div>
              ))}
            </div>
          </motion.article>
        </motion.div>
      </div>
    </section>
  )
}
