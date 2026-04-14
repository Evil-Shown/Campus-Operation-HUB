import { LayoutDashboard, Mail, Globe, MessageCircle, Send } from 'lucide-react'
import { Link } from 'react-router-dom'

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Dashboard', href: '#dashboard-preview' },
    { name: 'Pricing', href: '#' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Contact', href: '#contact' },
    { name: 'Blog', href: '#' },
    { name: 'Careers', href: '#' },
  ],
  resources: [
    { name: 'Documentation', href: '#' },
    { name: 'API Reference', href: '#' },
    { name: 'Support', href: '#' },
    { name: 'Status', href: '#' },
  ],
}

const socialLinks = [
  { icon: Globe, href: '#', label: 'Website' },
  { icon: Send, href: '#', label: 'Updates' },
  { icon: MessageCircle, href: '#', label: 'Community' },
  { icon: Mail, href: '#', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5 mb-12">
          {/* Brand section */}
          <div className="md:col-span-1">
            <Link to="/" className="group flex items-center gap-2.5 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 shadow-md">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">CampusOps</span>
            </Link>
            <p className="text-sm text-slate-600 mb-6">
              Smart campus operations management platform for modern educational institutions.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-all duration-300 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links sections */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-slate-600 transition-colors hover:text-indigo-600">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-slate-600 transition-colors hover:text-indigo-600">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-slate-600 transition-colors hover:text-indigo-600">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-slate-600 transition-colors hover:text-indigo-600">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 transition-colors hover:text-indigo-600">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 transition-colors hover:text-indigo-600">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-slate-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600">
              &copy; {new Date().getFullYear()} CampusOps. All rights reserved.
            </p>
            <p className="text-sm text-slate-600">
              Built for educational institutions worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
