import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { AlertTriangle, Bell, Building2, CalendarRange, ShieldCheck } from 'lucide-react'

const features = [
  {
    icon: Building2,
    title: 'Facilities & Assets Management',
    description: 'Track and manage all campus facilities, equipment, and resources in one centralized dashboard.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: CalendarRange,
    title: 'Booking Management',
    description: 'Easy room, equipment, and venue booking with real-time availability and calendar integration.',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: AlertTriangle,
    title: 'Incident Ticketing',
    description: 'Quickly report and track maintenance issues, security concerns, or facility problems.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Bell,
    title: 'Notifications System',
    description: 'Real-time alerts for booking approvals, incident updates, and important announcements.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: ShieldCheck,
    title: 'Role-Based Access Control',
    description: 'Secure access for students, faculty, staff, and admins with granular permission settings.',
    color: 'from-emerald-500 to-teal-500',
  },
]

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  return (
    <section id="features" ref={ref} className="bg-white py-20 md:py-28 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400"
          >
            Core Capabilities
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-3xl font-bold text-transparent md:text-4xl dark:from-white dark:to-slate-300"
          >
            Everything you need to manage campus operations
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-slate-600 dark:text-slate-300"
          >
            Powerful features designed to streamline campus management and improve efficiency.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <motion.article
                key={feature.title}
                variants={cardVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.2 }}
                className="group relative rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-600/10 dark:border-slate-700 dark:bg-slate-900/70"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-800 dark:text-white">{feature.title}</h3>
                <p className="leading-relaxed text-slate-600 dark:text-slate-300">{feature.description}</p>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
