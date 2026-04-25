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
  ShieldAlert,
  LogIn,
  Globe,
  Send,
  MessageCircle,
  Mail
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
    if (isNaN(endValue)) {
      setCount(end)
      return
    }

    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * endValue))
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }, [isInView, end, duration])

  const suffix = end.toString().replace(/[0-9]/g, '')
  return <span ref={countRef}>{count}{suffix}</span>
}

const PhotoCarousel = () => {
  const images = [
    'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  ]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-2xl shadow-2xl bg-indigo-100">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index]}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      </AnimatePresence>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? 'w-6 bg-indigo-600' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [headlineIndex, setHeadlineIndex] = useState(0)
  const headlines = ["one booking at a time.", "one click at a time.", "one ticket at a time."]
  
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
  }, [headlines.length])

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
        .diagonal-stripes {
          background-image: repeating-linear-gradient(45deg, #f8fafc 0px, #f8fafc 10px, #ffffff 10px, #ffffff 20px);
          opacity: 0.7;
        }
        .will-change-transform { will-change: transform; }
      `}} />

      {/* Top Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-indigo-600 z-[100] origin-left" style={{ scaleX }} />

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-[60] w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-2xl hover:bg-indigo-500 transition-colors active:scale-90"
          >
            <ArrowUp size={20} strokeWidth={3} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* SECTION 1: NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-20 flex items-center ${
        scrolled 
        ? "bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm" 
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
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Full-bleed Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1562774053-701939374585?w=1600" 
            alt="Campus" 
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-indigo-950/60" />
        </div>

        {/* Decorative Floating Blobs */}
        <div className="absolute inset-0 z-1 pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1], 
              x: [0, 50, 0], 
              y: [0, -30, 0] 
            }} 
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} 
            className="absolute top-[10%] left-[5%] w-[30rem] h-[30rem] bg-indigo-500/20 blur-3xl rounded-full"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2], 
              x: [0, -60, 0], 
              y: [0, 40, 0] 
            }} 
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} 
            className="absolute bottom-[10%] right-[5%] w-[35rem] h-[35rem] bg-violet-500/20 blur-3xl rounded-full"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <span className="text-[10px] font-black text-indigo-100 uppercase tracking-[0.2em]">IT3030 PAF Assignment 2026</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-8">
              Manage your campus,<br />
              <span className="text-indigo-300">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={headlineIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="inline-block"
                  >
                    {headlines[headlineIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-indigo-100/90 font-medium leading-relaxed max-w-xl mb-12">
              Book lecture halls, labs, and equipment with precision. Report maintenance issues and get notified instantly. Built for the modern SLIIT experience.
            </p>
            
            <div className="flex flex-wrap gap-5 mb-16">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-black text-base rounded-2xl px-10 py-5 shadow-2xl transition-all hover:bg-indigo-50">
                  Get started free <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/login" className="inline-flex items-center gap-2 bg-transparent border-2 border-white/40 backdrop-blur-md hover:bg-white/10 text-white font-black text-base rounded-2xl px-10 py-5 transition-all">
                  Login to account
                </Link>
              </motion.div>
            </div>

            <div className="flex items-center gap-10 flex-wrap">
              <div className="flex items-center">
                <div className="flex -space-x-3 mr-4">
                  {['S', 'L', 'I', 'I'].map((initial, i) => (
                    <div key={i} className={`w-12 h-12 rounded-full border-4 border-indigo-900 bg-indigo-${200 + i * 100} flex items-center justify-center text-xs font-black text-white shadow-xl`}>
                      {initial}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-black text-white leading-none">Joined by 500+ students</span>
                  <span className="text-[10px] text-indigo-200/60 font-bold uppercase mt-1 tracking-widest">Real-time collaboration</span>
                </div>
              </div>
              <div className="h-10 w-px bg-white/20"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle size={20} className="text-emerald-400" />
                </div>
                <span className="text-sm text-indigo-100 font-bold uppercase tracking-tight">SLIIT Approved</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Hero Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white z-10" />
      </section>

      {/* SECTION 3: STATS BAR */}
      <section className="relative z-20 py-20 bg-white overflow-hidden">
        <div className="absolute inset-0 diagonal-stripes pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: "Active Students", val: "500+" },
              { label: "Smart Resources", val: "12+" },
              { label: "Approval Rate", val: "98%" },
              { label: "Uptime", val: "24/7" }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-2">
                  <CountUp end={stat.val} />
                </div>
                <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.3em] group-hover:text-indigo-600 transition-colors">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: FEATURES SECTION */}
      <section className="py-32 relative bg-white">
        {/* SVG Dot Grid Background */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
          style={{ backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiM0ZjQ2ZTUiLz48L3N2Zz4=')` }} 
        />

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
              <motion.div key={i} variants={itemVariants} className="group relative will-change-transform h-full">
                {/* Gradient Border Glow Wrapper */}
                <div className="absolute -inset-[1px] bg-slate-200 rounded-[24px] group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:via-violet-500 group-hover:to-cyan-500 transition-all duration-500 blur-[0px] group-hover:blur-[2px]" />
                
                <div className="relative bg-white rounded-[23px] p-10 h-full shadow-sm transition-all duration-300 overflow-hidden border-t-[4px]" style={{ borderTopColor: f.accent }}>
                  <motion.div 
                    whileHover={{ scale: 1.15, rotate: 6 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className={`w-16 h-16 rounded-2xl ${f.bg} flex items-center justify-center mb-8 shadow-inner`}
                  >
                    <f.icon className={`${f.iconColor}`} size={32} />
                  </motion.div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{f.title}</h3>
                  <p className="text-base text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* NEW SECTION: PHOTO SHOWCASE */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em] mb-6 block">Campus Resources</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight mb-8">See SmartCampus<br />in action</h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10 max-w-lg">
                Real spaces, real bookings — managed from one place. Experience how SmartCampus transforms everyday operations into seamless digital workflows.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-1 bg-indigo-600 rounded-full" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Interactive Experience</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <PhotoCarousel />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 5: HOW IT WORKS */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-32">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">How it works</h2>
            <p className="text-lg text-slate-500 font-medium mt-6 italic">Seamless operations in three simple steps.</p>
          </div>
          
          <div className="space-y-0">
            {[
              { 
                title: "Create your account", 
                desc: "Sign up with your SLIIT email or Google sign-in. Your professional profile is ready in seconds.",
                img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
                badge: "✓ Ready in seconds"
              },
              { 
                title: "Browse and book", 
                desc: "Search available resources by type, location, or capacity. Pick your slot and submit for instant review.",
                img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
                badge: "⚡ Instant booking"
              },
              { 
                title: "Get instant updates", 
                desc: "Receive notifications when approved or if there's a scheduling conflict. No more waiting or uncertainty.",
                img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
                badge: "🔔 Real-time alerts"
              }
            ].map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={i} className={`py-24 ${i !== 2 ? 'border-b border-slate-200/60' : ''} relative`}>
                  {/* Giant Faded Step Number Background */}
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-black text-slate-200/30 select-none pointer-events-none z-0">
                    {i + 1}
                  </span>

                  <div className={`grid lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10 ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Text Column */}
                    <motion.div 
                      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className={`${!isEven ? 'lg:order-2' : ''}`}
                    >
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-white border-[6px] border-indigo-600 flex items-center justify-center shadow-xl mb-8">
                          <span className="text-indigo-600 font-black text-2xl">{i + 1}</span>
                        </div>
                        <h4 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight">{step.title}</h4>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">{step.desc}</p>
                      </div>
                    </motion.div>

                    {/* Image Column */}
                    <motion.div 
                      initial={{ opacity: 0, x: isEven ? 50 : -50, scale: 0.95 }}
                      whileInView={{ opacity: 1, x: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className={`relative group ${!isEven ? 'lg:order-1' : ''}`}
                    >
                      {/* Decorative Accent Border */}
                      <motion.div 
                        initial={{ opacity: 0, x: isEven ? 10 : -10, y: 10 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className={`absolute -bottom-4 ${isEven ? '-right-4' : '-left-4'} w-full h-full border-2 border-indigo-200 rounded-2xl -z-10`}
                      />

                      <motion.div 
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        whileHover={{ scale: 1.03 }}
                        className="relative rounded-2xl overflow-hidden shadow-2xl h-72 w-full transition-all duration-400"
                      >
                        <img 
                          src={step.img} 
                          alt={step.title} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/20 to-transparent" />
                        
                        {/* Floating Badge */}
                        <div className="absolute bottom-4 left-4">
                          <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-full px-4 py-2 flex items-center gap-2">
                            <span className="text-xs font-black text-indigo-700 uppercase tracking-wider">{step.badge}</span>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6: RESOURCE TYPES PREVIEW */}
      <section className="py-32 relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">Bookable resources</h2>
              <p className="text-lg text-slate-500 mt-6 font-medium">From high-tech labs to peaceful study pods — everything in one unified dashboard.</p>
            </div>
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-black text-indigo-600 hover:gap-4 transition-all">
              Explore All Resources <ChevronRight size={18} />
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
              <motion.div key={i} variants={itemVariants} whileHover={{ y: -8 }} className="relative group overflow-visible will-change-transform">
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-5 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 w-max translate-y-2 group-hover:translate-y-0">
                  <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl text-[10px] font-black shadow-2xl relative border border-white/10">
                    <span className="block text-indigo-400 mb-1">{r.sample}</span>
                    <span className="block uppercase tracking-[0.2em]">{r.status}</span>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[8px] border-transparent border-t-slate-900"></div>
                  </div>
                </div>

                <Link to="/login" className="bg-white border border-slate-200 rounded-[2.5rem] p-10 text-center shadow-sm hover:shadow-[0_25px_50px_rgba(99,102,241,0.18)] hover:border-indigo-200 transition-all block group">
                  <div className={`w-20 h-20 rounded-3xl ${r.bg} flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}>
                    <r.icon className={`${r.color}`} size={36} />
                  </div>
                  <span className="text-[11px] font-black text-slate-800 tracking-widest uppercase block mb-1">{r.name}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 7: CTA BANNER */}
      <section className="py-40 relative overflow-hidden bg-slate-900">
        {/* Background Image with Multiply Blend */}
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600" alt="Campus night" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-indigo-700/80 mix-blend-multiply" />
        </div>

        {/* Animated Floating Particles */}
        <div className="absolute inset-0 z-1 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/20 rounded-full"
              style={{ 
                width: Math.random() * 4 + 3 + 'px', 
                height: Math.random() * 4 + 3 + 'px',
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%` 
              }}
              animate={{
                y: [-40, 40],
                opacity: [0.1, 0.5, 0.1],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 5 + Math.random() * 7,
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
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-indigo-300 rounded-full pointer-events-none"
          />

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-12 leading-[1.1] tracking-tight">Join the future of <br />campus management.</h2>
            
            <div className="flex justify-center gap-6 flex-wrap">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/signup" className="relative overflow-hidden bg-white text-indigo-700 font-black text-lg rounded-2xl px-14 py-6 shadow-2xl block hover:bg-indigo-50 transition-colors">
                  Create free account
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/login" className="bg-transparent border-2 border-white/30 backdrop-blur-md hover:bg-white/10 text-white font-black text-lg rounded-2xl px-14 py-6 transition-all block">
                  Login
                </Link>
              </motion.div>
            </div>
            
            <div className="mt-16 flex items-center justify-center gap-4 text-indigo-300/60">
              <ShieldCheck size={24} />
              <span className="text-[11px] font-black uppercase tracking-[0.3em]">Secured with Google OAuth 2.0 Encryption</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER TRANSITION ZONE */}
      <div className="h-16 bg-gradient-to-b from-white to-slate-800" />

      {/* SECTION 8: FOOTER */}
      <footer className="relative bg-slate-800 pt-32 pb-16 overflow-hidden">
        {/* Subtle Campus Silhouette Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600" alt="Footer silhouette" className="w-full h-full object-cover" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-24">
            <div className="max-w-md">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-900/50">
                  <School className="text-white" size={30} />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white leading-none tracking-tight">SmartCampus</span>
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-2">SLIIT Faculty of Computing</span>
                </div>
              </div>
              <p className="text-base text-slate-300 font-medium leading-relaxed">
                Empowering the SLIIT community with seamless resource management and facility oversight. Built by students, for students, focusing on efficiency and transparency.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 lg:gap-24">
              <div>
                <h5 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-10">Platform</h5>
                <nav className="flex flex-col gap-6">
                  <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Resources</Link>
                  <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Tickets</Link>
                  <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Availability</Link>
                </nav>
              </div>
              <div>
                <h5 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-10">Account</h5>
                <nav className="flex flex-col gap-6">
                  <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Sign In</Link>
                  <Link to="/signup" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Sign Up</Link>
                  <Link to="/" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">OAuth Docs</Link>
                </nav>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <h5 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-10">Connect</h5>
                <div className="flex gap-4">
                  {[Globe, Send, MessageCircle, Mail].map((Icon, i) => (
                    <a key={i} href="#" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-indigo-600 hover:text-white transition-all">
                      <Icon size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 mt-32 pt-12 flex flex-col md:flex-row justify-between items-center gap-10">
            <p className="text-[12px] text-slate-500 font-bold uppercase tracking-widest">© 2026 Smart Campus · SLIIT University Assignment</p>
            <div className="flex items-center gap-10">
              <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Spring Boot + React + Tailwind</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
