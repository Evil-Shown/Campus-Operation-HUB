import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CalendarCheck, CheckCircle, Flag, Search } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Browse Resources',
    description: 'Explore available facilities, equipment, and services across campus in real-time.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: CalendarCheck,
    title: 'Request Booking',
    description: 'Submit booking requests with preferred dates, times, and special requirements.',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: CheckCircle,
    title: 'Admin Approval',
    description: 'Administrators review and approve requests instantly with automated notifications.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Flag,
    title: 'Report Incidents',
    description: 'Quickly report issues or incidents for immediate resolution by campus staff.',
    color: 'from-orange-500 to-red-500',
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  }

  const stepVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  return (
    <section id="how-it-works" ref={ref} className="bg-gradient-to-b from-slate-50 to-white py-20 md:py-28 dark:from-slate-950 dark:to-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400"
          >
            Simple Process
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-3xl font-bold text-transparent md:text-4xl dark:from-white dark:to-slate-300"
          >
            How CampusOps Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-slate-600 dark:text-slate-300"
          >
            From booking to resolution, we&apos;ve simplified every step of campus operations.
          </motion.p>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'} className="relative">
          <div className="absolute left-1/2 top-12 hidden h-0.5 w-full -translate-x-1/2 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 dark:from-indigo-800 dark:via-purple-800 dark:to-indigo-800 lg:block" />

          <div className="relative grid gap-8 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon

              return (
                <motion.article key={step.title} variants={stepVariants} className="relative text-center">
                  <div className="relative z-10">
                    <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute left-1/2 top-8 -translate-x-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white dark:bg-slate-600">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{step.description}</p>
                </motion.article>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
