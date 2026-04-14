import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, LogIn } from 'lucide-react'

export default function CallToAction() {
  return (
    <section id="contact" className="relative overflow-hidden py-20 md:py-28 bg-white">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />
      
      {/* Decorative elements */}
      <div className="absolute -top-20 right-0 w-96 h-96 rounded-full bg-indigo-100/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-0 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="text-slate-900">
                Ready to streamline your
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                campus operations?
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
              Join institutions already transforming their campus management with CampusOps. Get started in minutes, not months.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all duration-300 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/40"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-8 py-3.5 font-semibold text-slate-900 transition-all duration-300 hover:bg-slate-50 hover:border-slate-400"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
          </div>

          {/* Trust badges */}
          <div className="pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-600 mb-6">Trusted by leading educational institutions</p>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">500+</p>
                <p className="text-sm text-slate-600">Active Institutions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">50k+</p>
                <p className="text-sm text-slate-600">Happy Users</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">99.9%</p>
                <p className="text-sm text-slate-600">Uptime Guaranteed</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
