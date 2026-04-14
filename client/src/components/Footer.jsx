import { LayoutDashboard, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

const socialLinks = [
  { label: 'GitHub', shortLabel: 'GH' },
  { label: 'Twitter', shortLabel: 'X' },
  { label: 'LinkedIn', shortLabel: 'in' },
]

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-xl font-bold text-transparent dark:from-white dark:to-slate-300">
                CampusOps
              </span>
            </div>
            <p className="max-w-md text-sm text-slate-600 dark:text-slate-400">
              Smart Campus Operations Hub - simplifying facility management, bookings, and incident reporting for modern educational institutions.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-xs font-semibold text-slate-500 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
                  aria-label={link.label}
                >
                  {link.shortLabel}
                </a>
              ))}
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-indigo-500 dark:hover:text-indigo-300" aria-label="Email">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-slate-800 dark:text-white">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-sm text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-sm text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#dashboard-preview" className="text-sm text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
                  Dashboard
                </a>
              </li>
              <li>
                <Link to="/login" className="text-sm text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-slate-800 dark:text-white">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#contact" className="text-sm text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
                  Contact
                </a>
              </li>
              <li>
                <Link to="/app" className="text-sm text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
                  Access Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} CampusOps. All rights reserved. Built for modern campus management.</p>
        </div>
      </div>
    </footer>
  )
}
