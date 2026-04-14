import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Package, Play, Ticket } from 'lucide-react'

const upcomingBookings = [
  { name: 'Conference Room A', time: 'Today, 2:00 PM', dotClass: 'bg-indigo-500' },
  { name: 'Sports Complex', time: 'Tomorrow, 10:00 AM', dotClass: 'bg-purple-500' },
  { name: 'Library Study Room', time: 'Fri, 3:30 PM', dotClass: 'bg-pink-500' },
]

const avatars = [1, 2, 3, 4]

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  return (
    <section className="relative overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 via-transparent to-purple-50/60 dark:from-indigo-950/20 dark:to-purple-950/20" />
      <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-500/10" />
      <div className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-500/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid items-center gap-12 lg:grid-cols-2"
        >
          <div>
            <motion.div variants={itemVariants}>
              <span className="mb-6 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                Smart Campus Management Platform
              </span>
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="max-w-3xl text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl"
            >
              <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                Smart Campus
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Operations. Simplified.
              </span>
            </motion.h1>
            <motion.p variants={itemVariants} className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Streamline facility bookings, incident reporting, and resource management across your campus. The hub keeps students, faculty, and administrators aligned in one place.
            </motion.p>
            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/app"
                className="inline-flex items-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/30"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <button
                type="button"
                className="inline-flex items-center rounded-xl border border-slate-200 px-6 py-3 font-medium text-slate-700 transition-all duration-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Play className="mr-2 h-4 w-4" />
                View Demo
              </button>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="relative" whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-2xl shadow-slate-900/10 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/70">
              <div className="border-b border-slate-100 p-4 dark:border-slate-700/50">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 dark:text-white">Upcoming Bookings</h3>
                  <Calendar className="h-4 w-4 text-indigo-500" />
                </div>

                <div className="space-y-3">
                  {upcomingBookings.map((item) => (
                    <div key={item.name} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                      <div className="flex items-center gap-3">
                        <span className={`h-2 w-2 rounded-full ${item.dotClass}`} />
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">{item.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{item.time}</p>
                        </div>
                      </div>
                      <Ticket className="h-4 w-4 text-slate-400" />
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">Available Resources</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">12</span>
                  </div>
                  <div className="mt-2 flex -space-x-2">
                    {avatars.map((avatar) => (
                      <div
                        key={avatar}
                        className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-indigo-400 to-purple-400 dark:border-slate-900"
                      />
                    ))}
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-xs font-medium text-slate-600 dark:border-slate-900 dark:bg-slate-700 dark:text-slate-300">
                      +8
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 -top-4 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <Package className="h-3 w-3 text-emerald-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200">Real-time sync</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
