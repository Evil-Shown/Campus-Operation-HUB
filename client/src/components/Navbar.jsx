import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LayoutDashboard, LogIn, Menu, UserPlus, X } from 'lucide-react'

const Motion = motion

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
          ? 'bg-white/95 shadow-sm shadow-slate-900/5 backdrop-blur-md border-b border-slate-100'
          : 'bg-white border-b border-slate-100/50'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 shadow-md shadow-indigo-600/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-indigo-600/40">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 hidden sm:inline">
              CampusOps
            </span>
          </Link>

          <div className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-indigo-600"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-indigo-600 hover:bg-slate-50"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/35"
            >
              <UserPlus className="h-4 w-4" />
              Sign Up
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
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
            className="border-b border-slate-100 bg-white md:hidden"
          >
            <div className="space-y-2 px-4 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-indigo-600"
                >
                  {link.name}
                </a>
              ))}
              <div className="space-y-2 pt-4 border-t border-slate-100 mt-4">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-4 py-2 text-center text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  to="/app"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                >
                  Get Started
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.nav>
  )
}
