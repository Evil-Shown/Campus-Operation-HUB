import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LayoutDashboard, LogIn, Menu, X } from 'lucide-react'

const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Dashboard Preview', href: '#dashboard-preview' },
  { name: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/60 bg-white/80 shadow-lg shadow-slate-900/5 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-950/75'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-600/30 transition-transform duration-300 group-hover:scale-105">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-xl font-bold text-transparent dark:from-white dark:to-slate-300">
              CampusOps
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-medium text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
            <Link
              to="/app"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/30"
            >
              Get Started
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white md:hidden"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-950/95 md:hidden"
          >
            <div className="space-y-3 px-4 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl px-3 py-2 font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                >
                  {link.name}
                </a>
              ))}
              <div className="space-y-3 pt-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl border border-slate-200 px-4 py-2.5 text-center font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                  Login
                </Link>
                <Link
                  to="/app"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-center font-semibold text-white"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.nav>
  )
}
