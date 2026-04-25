import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar,
  AlertCircle,
  Bell,
  ShieldCheck,
  ArrowRight,
  School,
  CheckCircle,
  Users,
  Monitor,
  BookOpen,
  Cpu,
  Clock,
  MapPin,
  ChevronRight,
  Zap
} from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: Calendar,
      title: "Facility booking",
      desc: "Reserve lecture halls, computer labs, meeting rooms, and equipment in just a few clicks. No more email chains.",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600"
    },
    {
      icon: AlertCircle,
      title: "Maintenance tickets",
      desc: "Report broken equipment or facility issues with photos. Track progress from open to resolved.",
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600"
    },
    {
      icon: Bell,
      title: "Instant notifications",
      desc: "Get notified when your booking is approved, rejected, or when a ticket status changes.",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600"
    },
    {
      icon: ShieldCheck,
      title: "Role-based access",
      desc: "Students, staff, technicians, and administrators each see exactly what they need. Nothing more.",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600"
    },
    {
      icon: Clock,
      title: "Conflict prevention",
      desc: "The system automatically detects scheduling conflicts so the same room is never double-booked.",
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600"
    },
    {
      icon: Users,
      title: "Admin oversight",
      desc: "Admins can approve or reject bookings, assign technicians to tickets, and manage all campus resources.",
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-600"
    }
  ]

  const resourceTypes = [
    { icon: BookOpen, bg: "bg-indigo-50", color: "text-indigo-600", name: "Study rooms" },
    { icon: Monitor, bg: "bg-blue-50", color: "text-blue-600", name: "Computer labs" },
    { icon: Users, bg: "bg-cyan-50", color: "text-cyan-600", name: "Meeting rooms" },
    { icon: School, bg: "bg-violet-50", color: "text-violet-600", name: "Lecture halls" },
    { icon: Cpu, bg: "bg-emerald-50", color: "text-emerald-600", name: "Equipment" },
    { icon: Zap, bg: "bg-amber-50", color: "text-amber-600", name: "Other facilities" }
  ]

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* SECTION 1: NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm h-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <School className="text-white" size={18} />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">SmartCampus</span>
            <div className="h-5 w-px bg-slate-200 mx-1"></div>
            <span className="text-sm text-slate-400 font-medium">SLIIT</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors">
              Sign in
            </Link>
            <Link to="/signup" className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl px-4 py-2 transition-colors">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* SECTION 2: HERO SECTION */}
      <section className="pt-32 pb-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 mb-8 w-fit">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">IT3030 PAF Assignment 2026</span>
              </div>
              <h1 className="text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
                Manage your campus,<br />one booking at a time.
              </h1>
              <p className="text-xl text-slate-500 font-normal leading-relaxed max-w-lg mb-10">
                Book lecture halls, labs, and equipment. Report maintenance issues. Get notified instantly. Built for SLIIT students and staff.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/signup" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl px-6 py-3 transition-colors">
                  Get started free <ArrowRight size={16} />
                </Link>
                <Link to="/login" className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-sm rounded-xl px-6 py-3 transition-colors">
                  Sign in to your account
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" />
                  <span className="text-sm text-slate-500 font-medium">Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" />
                  <span className="text-sm text-slate-500 font-medium">Google sign-in</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" />
                  <span className="text-sm text-slate-500 font-medium">SLIIT staff approved</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-16 lg:mt-0"
            >
              <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-sm font-semibold text-slate-900">Upcoming bookings</h3>
                  <span className="text-xs text-indigo-600 font-semibold">View all</span>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: BookOpen, name: "Computer Lab 3", loc: "New Building - Level 3", status: "APPROVED", statusStyle: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                    { icon: Monitor, name: "Lecture Hall A101", loc: "Main Hall - Ground Floor", status: "PENDING", statusStyle: "bg-amber-50 text-amber-700 border-amber-200" },
                    { icon: Users, name: "Meeting Room 5", loc: "Faculty Office - Level 1", status: "APPROVED", statusStyle: "bg-emerald-50 text-emerald-700 border-emerald-200" }
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <row.icon className="text-indigo-600" size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{row.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin size={12} className="text-slate-400" />
                          <span className="text-xs text-slate-400">{row.loc}</span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${row.statusStyle}`}>
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">3 reservations active</span>
                  <ArrowRight size={14} className="text-slate-300" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3: STATS BAR */}
      <section className="bg-white border-y border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x-0 lg:divide-x divide-slate-200">
            <div className="text-center px-4">
              <p className="text-3xl font-bold text-slate-900">500+</p>
              <p className="text-sm text-slate-500 font-medium mt-1">Students using the platform</p>
            </div>
            <div className="text-center px-4">
              <p className="text-3xl font-bold text-slate-900">12+</p>
              <p className="text-sm text-slate-500 font-medium mt-1">Bookable resources</p>
            </div>
            <div className="text-center px-4 md:border-l-0 lg:border-l lg:border-slate-200">
              <p className="text-3xl font-bold text-slate-900">98%</p>
              <p className="text-sm text-slate-500 font-medium mt-1">Booking approval rate</p>
            </div>
            <div className="text-center px-4">
              <p className="text-3xl font-bold text-slate-900">24/7</p>
              <p className="text-sm text-slate-500 font-medium mt-1">Platform availability</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: FEATURES SECTION */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Everything you need to manage campus resources</h2>
            <p className="text-lg text-slate-500 font-normal mt-4">Designed for students, staff, and administrators at SLIIT.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all duration-300"
              >
                <div className={`w-11 h-11 rounded-xl ${f.iconBg} flex items-center justify-center mb-4`}>
                  <f.icon className={`${f.iconColor}`} size={22} />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 font-normal leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: HOW IT WORKS */}
      <section className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
            <p className="text-lg text-slate-500 font-normal mt-4">Up and running in three steps.</p>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-8 bottom-8 w-px bg-slate-200 hidden md:block"></div>
            <div className="space-y-0">
              {[
                { title: "Create your account", desc: "Sign up with your SLIIT email or use Google sign-in. Your account is ready in seconds." },
                { title: "Browse and book", desc: "Search available resources by type, location, or capacity. Pick your time slot and submit your request." },
                { title: "Get instant updates", desc: "Receive a notification when your booking is approved or if there's a scheduling conflict. No waiting." }
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-6 relative">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center flex-shrink-0 z-10 text-indigo-600 font-bold text-lg shadow-sm">
                    {i + 1}
                  </div>
                  <div className={`flex-1 ${i === 2 ? 'pb-0' : 'pb-12'}`}>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h4>
                    <p className="text-sm text-slate-500 font-normal leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: RESOURCE TYPES PREVIEW */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Bookable resources on campus</h2>
            <p className="text-lg text-slate-500 mt-4 font-normal">From study rooms to projectors — book what you need.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {resourceTypes.map((r, i) => (
              <Link key={i} to="/login" className="bg-white border border-slate-200 rounded-2xl p-5 text-center hover:border-indigo-200 hover:shadow-md transition-all duration-300 block group">
                <div className={`w-12 h-12 rounded-xl ${r.bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <r.icon className={`${r.color}`} size={24} />
                </div>
                <span className="text-sm font-semibold text-slate-800">{r.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: CTA BANNER */}
      <section className="bg-indigo-600 py-20 overflow-hidden relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-lg text-indigo-200 font-normal leading-relaxed mb-10 max-w-xl mx-auto">
              Join the Smart Campus platform and simplify how you book and manage university resources.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/signup" className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-sm rounded-xl px-8 py-3 transition-colors inline-flex items-center gap-2 shadow-lg shadow-indigo-800/20">
                Create free account <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm rounded-xl px-8 py-3 transition-colors inline-flex items-center gap-2 border border-indigo-400 shadow-sm">
                Sign in
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-indigo-300/80">
              <ShieldCheck size={16} />
              <span className="text-sm font-medium">Secured with Google OAuth 2.0</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 8: FOOTER */}
      <footer className="bg-slate-900 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <School className="text-white" size={18} />
                </div>
                <span className="text-base font-bold text-white">SmartCampus</span>
              </div>
              <p className="text-sm text-slate-400 mt-2 font-medium">SLIIT Faculty of Computing · IT3030 PAF 2026</p>
            </div>
            <nav className="flex gap-6">
              <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Sign in</Link>
              <Link to="/signup" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Create account</Link>
            </nav>
          </div>
          <div className="border-t border-slate-800 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500 font-normal">© 2026 Smart Campus · IT3030 PAF Assignment · SLIIT</p>
            <p className="text-sm text-slate-500 font-medium">Built with Spring Boot + React</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
