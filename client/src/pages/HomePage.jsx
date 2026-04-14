import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import DashboardPreview from '../components/DashboardPreview'
import CallToAction from '../components/CallToAction'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <DashboardPreview />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}
