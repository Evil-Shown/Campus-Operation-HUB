import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion'
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
  Zap,
  ArrowUp,
  ShieldAlert
} from 'lucide-react'

// --- HELPER COMPONENTS ---

function CountUp({ end, duration = 2000 }) {
  const [count, setCount] = useState(0)
  const countRef = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true)
      },
      { threshold: 0.1 }
    )
    if (countRef.current) observer.observe(countRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const endValue = parseInt(end)
    if (isNaN(endValue)) return setCount(end)

    const totalFrames = duration / 16
    const increment = endValue / totalFrames
    let frame = 0

    const timer = setInterval(() => {
      frame++
      start += increment
      if (frame >= totalFrames) {
        setCount(endValue)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, end, duration])

  return <span ref={countRef}>{count}{end.toString().includes('+') ? '+' : end.toString().includes('%') ? '%' : ''}</span>
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [headlineIndex, setHeadlineIndex] = useState(0)
  const headlines = ["one click at a time.", "one booking at a time.", "one ticket at a time."]
  
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 200]) // Parallax effect
  
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      setShowBackToTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlines.length)
    }, 3000)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(interval)
    }
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const features = [
    {
      icon: Calendar,
      title: "Facility booking",
      desc: "Reserve lecture halls, computer labs, meeting rooms, and equipment in just a few clicks. No more email chains.",
      accent: "#6366f1",
      iconColor: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      icon: AlertCircle,
      title: "Maintenance tickets",
      desc: "Report broken equipment or facility issues with photos. Track progress from open to resolved.",
      accent: "#f43f5e",
      iconColor: "text-rose-600",
      bg: "bg-rose-50"
    },
    {
      icon: Bell,
      title: "Instant notifications",
      desc: "Get notified when your booking is approved, rejected, or when a ticket status changes.",
      accent: "#10b981",
      iconColor: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      icon: ShieldCheck,
      title: "Role-based access",
      desc: "Students, staff, technicians, and administrators each see exactly what they need. Nothing more.",
      accent: "#f59e0b",
      iconColor: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      icon: Clock,
      title: "Conflict prevention",
      desc: "The system automatically detects scheduling conflicts so the same room is never double-booked.",
      accent: "#8b5cf6",
      iconColor: "text-violet-600",
      bg: "bg-violet-50"
    },
    {
      icon: Users,
      title: "Admin oversight",
      desc: "Admins can approve or reject bookings, assign technicians to tickets, and manage all campus resources.",
      accent: "#06b6d4",
      iconColor: "text-cyan-600",
      bg: "bg-cyan-50"
    }
  ]

  const resourceTypes = [
    { icon: BookOpen, bg: "bg-indigo-50", color: "text-indigo-600", name: "Study rooms", sample: "Lab 3", status: "Available now" },
    { icon: Monitor, bg: "bg-blue-50", color: "text-blue-600", name: "Computer labs", sample: "B402", status: "In use" },
    { icon: Users, bg: "bg-cyan-50", color: "text-cyan-600", name: "Meeting rooms", sample: "Boardroom", status: "Available" },
    { icon: School, bg: "bg-violet-50", color: "text-violet-600", name: "Lecture halls", sample: "Main Auditorium", status: "Booked" },
    { icon: Cpu, bg: "bg-emerald-50", color: "text-emerald-600", name: "Equipment", sample: "Projector 5", status: "Ready" },
    { icon: Zap, bg: "bg-amber-50", color: "text-amber-600", name: "Other facilities", sample: "Roof Terrace", status: "Available" }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* ── GLOBAL POLISH ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        html { scroll-behavior: smooth; }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        .animate-shimmer { animation: shimmer 2s infinite; }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 10s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .shimmer-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: 0.5s;
          pointer-events: none;
        }
        .shimmer-btn:hover::before { left: 100%; }
        .diagonal-stripes {
          background-image: repeating-linear-gradient(45deg, #f8fafc 0px, #f8fafc 10px, #ffffff 10px, #ffffff 20px);
          opacity: 0.5;
        }
      `}} />

      {/* Top Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 z-[100] origin-left" style={{ scaleX }} />

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-[60] w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-500/50 hover:bg-indigo-700 transition-colors active:scale-90"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* SECTION 1: NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-20 flex items-center ${
        scrolled 
        ? "bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-lg" 
        : "bg-transparent border-b border-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <motion.div whileHover={{ rotate: 10, scale: 1.1 }} className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <School className="text-white" size={20} />
            </motion.div>
            <div className="flex flex-col">
              <span className={`text-xl font-black tracking-tight leading-none transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>SmartCampus</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 transition-colors ${scrolled ? 'text-slate-400' : 'text-indigo-200'}`}>SLIIT University</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className={`text-sm font-bold px-4 py-2 transition-colors ${scrolled ? 'text-slate-600 hover:text-indigo-600' : 'text-white/80 hover:text-white'}`}>
              Login
            </Link>
            <Link to="/signup" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* SECTION 2: HERO SECTION */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden pt-20">
        {/* Parallax Background Image */}
        <motion.div 
          style={{ y: heroY }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1562774053-701939374585?w=1600" 
            alt="Campus" 
            className="w-full h-full object-fit-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-indigo-950/60 mix-blend-multiply"></div>
        </motion.div>

        {/* Decorative Blobs */}
        <div className="absolute inset-0 z-1 pointer-events-none">
          <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-[15%] left-[10%] w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full animate-blob"></motion.div>
          <motion.div animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 30, 0] }} transition={{ duration: 12, repeat: Infinity }} className="absolute bottom-[20%] right-[15%] w-[30rem] h-[30rem] bg-violet-500/20 blur-3xl rounded-full animate-blob animation-delay-2000"></motion.div>
          <motion.div animate={{ scale: [1, 1.1, 1], x: [20, 0, 20], y: [-30, 0, -30] }} transition={{ duration: 15, repeat: Infinity }} className="absolute top-[40%] right-[5%] w-80 h-80 bg-blue-500/10 blur-3xl rounded-full animate-blob animation-delay-4000"></motion.div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-8">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                <span className="text-[10px] font-black text-indigo-100 uppercase tracking-[0.2em]">IT3030 PAF Assignment 2026</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-8">
                Manage your campus,<br />
                <span className="text-indigo-400">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={headlineIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="inline-block"
                    >
                      {headlines[headlineIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>

              <p className="text-lg text-indigo-100/80 font-medium leading-relaxed max-w-lg mb-10">
                Book lecture halls, labs, and equipment with precision. Report maintenance issues and get notified instantly. Built for the modern SLIIT experience.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/signup" className="shimmer-btn relative overflow-hidden inline-flex items-center gap-2 bg-indigo-600 text-white font-black text-base rounded-2xl px-8 py-4 shadow-2xl shadow-indigo-500/40">
                    Get started free <ArrowRight size={18} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/login" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-black text-base rounded-2xl px-8 py-4 transition-all">
                    Login to account
                  </Link>
                </motion.div>
              </div>

              <div className="mt-12 flex items-center gap-8 flex-wrap">
                <div className="flex items-center">
                  <div className="flex -space-x-3 mr-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`w-10 h-10 rounded-full border-2 border-slate-900 bg-indigo-${100 * i} flex items-center justify-center text-[10px] font-bold text-indigo-700 shadow-xl`}>
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-white leading-none">500+ Students</span>
                    <span className="text-[10px] text-indigo-200/60 font-bold uppercase mt-1 tracking-widest">Joined the platform</span>
                  </div>
                </div>
                <div className="h-10 w-px bg-white/20"></div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-emerald-400" />
                  <span className="text-sm text-indigo-100 font-bold uppercase tracking-tight">SLIIT Approved</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="mt-20 lg:mt-0 relative will-change-transform"
            >
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="bg-white/95 backdrop-blur-xl border border-white rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] p-8 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Upcoming Activity</h3>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-indigo-600">
                    <Zap size={18} />
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: BookOpen, name: "Computer Lab 3", loc: "Block B - Level 3", status: "APPROVED", color: "text-emerald-600", bg: "bg-emerald-50" },
                    { icon: Monitor, name: "Lecture Hall A101", loc: "Main Hall - G Floor", status: "PENDING", color: "text-amber-600", bg: "bg-amber-50" },
                    { icon: Users, name: "Meeting Room 5", loc: "Faculty Office - L1", status: "APPROVED", color: "text-emerald-600", bg: "bg-emerald-50" }
                  ].map((row, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + (i * 0.1) }}
                      className="flex items-center gap-5 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-indigo-200 transition-all cursor-default"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                        <row.icon className="text-slate-400" size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black text-slate-900">{row.name}</p>
                        <div className="flex items-center gap-1 mt-1 opacity-60">
                          <MapPin size={10} />
                          <span className="text-[10px] font-bold">{row.loc}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black border ${row.color} ${row.bg} border-current/10`}>
                        {row.status}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3: STATS BAR */}
      <section className="relative z-10 py-16 bg-white overflow-hidden">
        <div className="absolute inset-0 diagonal-stripes pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: "Active Students", val: "500+" },
              { label: "Smart Resources", val: "12+" },
              { label: "Approval Rate", val: "98%" },
              { label: "Uptime", val: "24/7" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl font-black text-slate-900 tracking-tight">
                  <CountUp end={stat.val} />
                </div>
                <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mt-3">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: FEATURES SECTION */}
      <section className="py-32 relative bg-white">
        {/* Dot Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiM0ZjQ2ZTUiLz48L3N2Zz4=')` }}>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">Everything you need to manage campus resources</h2>
            <div className="w-20 h-2 bg-indigo-600 mx-auto mt-10 rounded-full"></div>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {features.map((f, i) => (
              <motion.div key={i} variants={itemVariants} className="group relative will-change-transform">
                <div className="absolute -inset-[2px] bg-slate-200 rounded-[22px] group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-violet-500 transition-all duration-500"></div>
                <div className="relative bg-white rounded-2xl p-8 h-full shadow-sm group-hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-[3px]" style={{ borderTopColor: f.accent }}>
                  <motion.div 
                    whileHover={{ scale: 1.15, rotate: 6 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-6 shadow-inner`}
                  >
                    <f.icon className={`${f.iconColor}`} size={28} />
                  </motion.div>
                  <h3 className="text-xl font-black text-slate-900 mb-4">{f.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: HOW IT WORKS */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-32">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">How it works</h2>
            <p className="text-lg text-slate-500 font-medium mt-6 italic">Seamless operations in three steps.</p>
          </div>
          
          <div className="relative">
            {/* Animated SVG Dashed Connector */}
            <div className="absolute left-7 top-10 bottom-10 w-1 hidden md:block opacity-20">
              <svg width="4" height="100%" className="overflow-visible">
                <motion.line 
                  x1="2" y1="0" x2="2" y2="100%" 
                  stroke="#4f46e5" strokeWidth="4" strokeDasharray="12 16"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </svg>
            </div>

            <div className="space-y-24">
              {[
                { title: "Create your account", desc: "Sign up with your SLIIT email or Google sign-in. Your account is ready in seconds." },
                { title: "Browse and book", desc: "Search available resources by type, location, or capacity. Pick your slot and submit." },
                { title: "Get instant updates", desc: "Receive notifications when approved or if there's a conflict. No more waiting." }
              ].map((step, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.6 }}
                  className="relative flex items-start gap-12 group"
                >
                  <span className="absolute -top-16 -left-8 text-[9rem] font-black text-slate-200/50 select-none pointer-events-none group-hover:text-indigo-100/50 transition-colors">
                    {i + 1}
                  </span>
                  
                  <div className="relative shrink-0 z-10">
                    <div className="w-16 h-16 rounded-full bg-white border-[6px] border-indigo-600 flex items-center justify-center shadow-xl">
                      <span className="text-indigo-600 font-black text-2xl">{i + 1}</span>
                    </div>
                  </div>
                  
                  <div className="relative pt-2">
                    <h4 className="text-2xl font-black text-slate-900 mb-3">{step.title}</h4>
                    <p className="text-base text-slate-500 font-medium leading-relaxed max-w-xl">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: RESOURCE TYPES PREVIEW */}
      <section className="py-32 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">Bookable resources</h2>
              <p className="text-lg text-slate-500 mt-6 font-medium">From high-tech labs to peaceful study pods — everything in one place.</p>
            </div>
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-black text-indigo-600 hover:gap-4 transition-all">
              Explore All <ChevronRight size={18} />
            </Link>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8"
          >
            {resourceTypes.map((r, i) => (
              <motion.div key={i} variants={itemVariants} whileHover={{ y: -8 }} className="relative group overflow-visible">
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 w-max translate-y-2 group-hover:translate-y-0">
                  <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-[11px] font-black shadow-2xl relative">
                    <span className="block text-indigo-400">{r.sample}</span>
                    <span className="block mt-0.5 uppercase tracking-wider">{r.status}</span>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900"></div>
                  </div>
                </div>

                <Link to="/login" className="bg-white border border-slate-200 rounded-[2rem] p-8 text-center shadow-sm hover:shadow-[0_20px_40px_rgba(99,102,241,0.15)] hover:border-indigo-200 transition-all block">
                  <div className={`w-16 h-16 rounded-2xl ${r.bg} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-sm`}>
                    <r.icon className={`${r.color}`} size={32} />
                  </div>
                  <span className="text-[11px] font-black text-slate-800 tracking-widest uppercase">{r.name}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 7: CTA BANNER */}
      <section className="py-32 relative overflow-hidden bg-slate-900">
        {/* Background Image with Multiply Blend */}
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600" alt="Campus night" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-indigo-900/80 mix-blend-multiply"></div>
        </div>

        {/* Animated Floating Particles */}
        <div className="absolute inset-0 z-1">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white/30 rounded-full"
              style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
              animate={{
                y: [-20, 20],
                x: [-10, 10],
                opacity: [0.1, 0.4, 0.1]
              }}
              transition={{
                duration: 4 + Math.random() * 6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Pulsing Ring Behind Header */}
          <motion.div 
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-indigo-400 rounded-full pointer-events-none"
          ></motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-10 leading-tight">Join the future of <br />campus management.</h2>
            
            <div className="flex justify-center gap-6 flex-wrap">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/signup" className="shimmer-btn relative overflow-hidden bg-indigo-600 text-white font-black text-base rounded-2xl px-12 py-5 shadow-2xl shadow-indigo-500/50 block">
                  Create free account
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/login" className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-black text-base rounded-2xl px-12 py-5 transition-all border border-white/20 block">
                  Login
                </Link>
              </motion.div>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-3 text-indigo-300/40">
              <ShieldCheck size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.25em]">Secured with Google OAuth 2.0</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER TRANSITION ZONE ── */}
      <div className="h-24 bg-gradient-to-b from-white to-slate-900"></div>

      {/* SECTION 8: FOOTER */}
      <footer className="relative bg-slate-900 pt-24 pb-12 overflow-hidden">
        {/* Subtle Campus Silhouette */}
        <div className="absolute inset-0 opacity-10 pointer-events-none grayscale blur-[2px]">
          <img src="https://images.unsplash.com/photo-1562774053-701939374585?w=1600" alt="Footer silhouette" className="w-full h-full object-cover" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-20">
            <div className="max-w-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/50">
                  <School className="text-white" size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white leading-none tracking-tight">SmartCampus</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">SLIIT University</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 mt-10 font-medium leading-relaxed">
                Empowering the SLIIT community with seamless resource management and facility oversight. Built by students, for students.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-20">
              <div>
                <h5 className="text-[10px] font-black text-white uppercase tracking-[0.25em] mb-10">Platform</h5>
                <nav className="flex flex-col gap-5">
                  <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-indigo-400 transition-colors">Resources</Link>
                  <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-indigo-400 transition-colors">Tickets</Link>
                  <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-indigo-400 transition-colors">Availability</Link>
                </nav>
              </div>
              <div>
                <h5 className="text-[10px] font-black text-white uppercase tracking-[0.25em] mb-10">Account</h5>
                <nav className="flex flex-col gap-5">
                  <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-indigo-400 transition-colors">Sign In</Link>
                  <Link to="/signup" className="text-sm font-bold text-slate-500 hover:text-indigo-400 transition-colors">Sign Up</Link>
                  <Link to="/" className="text-sm font-bold text-slate-500 hover:text-indigo-400 transition-colors">OAuth Docs</Link>
                </nav>
              </div>
              <div className="col-span-2 md:col-span-1">
                <button 
                  onClick={scrollToTop}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center transition-all group active:scale-95"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mb-4 group-hover:-translate-y-2 transition-transform shadow-xl shadow-indigo-900">
                    <ArrowUp size={20} className="text-white" />
                  </div>
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.25em]">Top</span>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 mt-24 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">© 2026 Smart Campus · SLIIT Faculty of Computing</p>
            <div className="flex items-center gap-8">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Built with Spring Boot + React</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
