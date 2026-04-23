import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Search, CalendarCheck, CheckCircle, AlertTriangle } from 'lucide-react'

const Motion = motion

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
    icon: AlertTriangle,
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
    <section id="how-it-works" ref={ref} className="relative py-20 md:py-28 bg-slate-50">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold uppercase tracking-wide text-indigo-600"
          >
            Simple Process
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-4xl md:text-5xl font-bold text-slate-900"
          >
            How CampusOps Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-slate-600"
          >
            From booking to resolution, we&apos;ve simplified every step of campus operations.
          </motion.p>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'} className="relative">
          {/* Connector line */}
          <div className="absolute left-1/2 top-20 hidden h-1 w-full -translate-x-1/2 bg-gradient-to-r from-slate-200 via-indigo-300 to-slate-200 lg:block" style={{maxWidth: 'calc(100% - 120px)', left: '60px'}} />

          <div className="relative grid gap-8 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon

              return (
                <motion.div key={step.title} variants={stepVariants} className="relative">
                  {/* Step number circle */}
                  <div className="relative z-10 mb-6">
                    <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg mb-4`}>
                      <Icon className="h-9 w-9 text-white" />
                    </div>
                    <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-slate-200 font-bold text-slate-900 shadow-md">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="mb-2 text-lg font-semibold text-slate-900">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600">{step.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
