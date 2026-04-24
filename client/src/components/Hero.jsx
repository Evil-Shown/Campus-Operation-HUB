import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, CheckCircle2, Users, Zap, Play } from 'lucide-react'

const Motion = motion

const upcomingBookings = [
  { name: 'Conference Room A', time: 'Today, 2:00 PM', dotClass: 'bg-indigo-500' },
  { name: 'Sports Complex', time: 'Tomorrow, 10:00 AM', dotClass: 'bg-purple-500' },
  { name: 'Library Study Room', time: 'Fri, 3:30 PM', dotClass: 'bg-pink-500' },
]

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-24">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-white" />
      
      {/* Decorative blurred circles - very subtle */}
      <div className="absolute top-40 left-1/4 w-80 h-80 rounded-full bg-indigo-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 right-1/4 w-80 h-80 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid items-center gap-12 lg:grid-cols-2"
        >
          <div>
            <motion.div variants={itemVariants}>
              <span className="mb-6 inline-flex rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700">
                Smart Campus Management Platform
              </span>
            </motion.div>
            
            <motion.h1
              variants={itemVariants}
              className="max-w-3xl text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-slate-900"
            >
              Smart Campus Operations.{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Simplified.
              </span>
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600"
            >
              Manage facility bookings, resources, and incident reports from one unified platform. Streamline operations and keep your campus running smoothly.
            </motion.p>
            
            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/app"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all duration-300 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/40"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-50 hover:border-slate-400"
              >
                <Play className="h-4 w-4" />
                View Demo
              </button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div variants={itemVariants} className="mt-10 pt-8 border-t border-slate-200 grid grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-indigo-600" />
                  <span className="font-bold text-slate-900">500+</span>
                </div>
                <p className="text-sm text-slate-600">Campus Teams</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-4 w-4 text-indigo-600" />
                  <span className="font-bold text-slate-900">99.9%</span>
                </div>
                <p className="text-sm text-slate-600">Uptime</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  <span className="font-bold text-slate-900">24/7</span>
                </div>
                <p className="text-sm text-slate-600">Support</p>
              </div>
            </motion.div>
          </div>

          {/* Right side - Dashboard preview */}
          <motion.div
            variants={itemVariants}
            className="relative"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
              {/* Browser chrome */}
              <div className="border-b border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center gap-2 px-2">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">Upcoming Bookings</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Next 7 days</p>
                  </div>
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>

                <div className="space-y-3">
                  {upcomingBookings.map((item) => (
                    <div key={item.name} className="flex items-center justify-between bg-slate-50 rounded-lg p-3 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <span className={`h-2.5 w-2.5 rounded-full ${item.dotClass}`} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.time}</p>
                        </div>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    </div>
                  ))}
                </div>

                <button className="w-full py-2 px-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  View all bookings →
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
