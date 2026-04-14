import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, LogIn } from 'lucide-react'

export default function CallToAction() {
  return (
    <section id="contact" className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 dark:from-indigo-600/10 dark:via-purple-600/10 dark:to-pink-600/10" />
      <div className="absolute -left-40 -bottom-40 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
              Ready to transform your
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              campus operations?
            </span>
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Join institutions already streamlining their campus management with CampusOps.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/app"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/30"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-8 py-4 font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Login
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
