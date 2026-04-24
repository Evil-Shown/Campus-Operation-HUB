import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowRight,
  Building2,
  CalendarDays,
  ClipboardList,
  Users,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Motion = motion

function Input({ label, error, icon, className = '', id, ...props }) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </label>
      ) : null}
      <div className="relative">
        {icon ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-400">{icon}</span>
          </div>
        ) : null}
        <input
          id={id}
          className={`
            w-full rounded-xl border bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500'}
            ${isFocused ? 'ring-2 ring-opacity-20' : ''}
            hover:border-gray-300 focus:outline-none focus:ring-2
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </div>
      {error ? <p className="mt-1.5 text-xs text-red-500">{error}</p> : null}
    </div>
  )
}

function Button({ variant = 'primary', isLoading = false, icon, children, className = '', disabled, ...props }) {
  const baseStyles =
    'relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

  const variants = {
    primary:
      'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 hover:shadow-md focus:ring-indigo-500 active:scale-[0.98] active:bg-indigo-800',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 focus:ring-gray-400',
    outline:
      'border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm focus:ring-gray-400',
  }

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { signin, apiBaseUrl } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({ email: '', password: '' })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = { email: '', password: '' }
    let isValid = true

    if (!formData.email) {
      newErrors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setFormError('')

    try {
      const user = await signin({
        email: formData.email.trim(),
        password: formData.password,
      })
      
      console.log('Login successful, user role:', user?.role)
      
      // Redirect based on user role
      if (user?.role === 'ADMIN') {
        console.log('Redirecting to /admin')
        navigate('/admin')
      } else {
        console.log('Redirecting to /dashboard')
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      setFormError(error.message || 'Unable to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    window.location.href = `${apiBaseUrl}/oauth2/authorization/google`
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
  }

  const leftSideVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
  }

  const rightSideVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />

      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-col overflow-hidden rounded-3xl shadow-[0_24px_70px_-32px_rgba(15,23,42,0.55)] lg:flex-row">
          <motion.div
            variants={leftSideVariants}
            initial="hidden"
            animate="visible"
            className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-600 p-8 lg:w-1/2 lg:p-12"
          >
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-cyan-300/10 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/5 blur-2xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:24px_24px]" />

            <div className="relative z-10">
              <div className="mb-12 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-semibold tracking-tight text-white">Smart Campus Hub</span>
              </div>

              <div className="max-w-md space-y-6">
                <h1 className="text-4xl font-bold leading-tight tracking-tight text-white lg:text-5xl">
                  Smart Campus
                  <span className="block text-indigo-100">Operations Hub</span>
                </h1>
                <p className="text-lg leading-relaxed text-indigo-100">
                  Efficiently manage campus bookings, facilities, and incidents from a single, intuitive platform.
                </p>

                <div className="space-y-4 pt-8">
                  <div className="flex items-center gap-3 text-indigo-100">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                      <CalendarDays className="h-4 w-4" />
                    </div>
                    <span>Smart room and equipment scheduling</span>
                  </div>
                  <div className="flex items-center gap-3 text-indigo-100">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                      <ClipboardList className="h-4 w-4" />
                    </div>
                    <span>Real-time maintenance tracking</span>
                  </div>
                  <div className="flex items-center gap-3 text-indigo-100">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                      <Users className="h-4 w-4" />
                    </div>
                    <span>Seamless stakeholder collaboration</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-auto pt-12">
              <div className="flex items-center gap-2 text-sm text-indigo-200">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-6 w-6 rounded-full border border-white/30 bg-white/20" />
                  ))}
                </div>
                <span className="ml-2">Trusted by 50+ leading universities</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={rightSideVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center bg-white p-6 sm:p-8 lg:w-1/2 lg:p-12"
          >
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md">
              <motion.div variants={itemVariants} className="text-center lg:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back</h2>
                <p className="mt-2 text-gray-500">Sign in to your account to continue</p>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-8">
                <Button
                  variant="outline"
                  icon={<Mail className="h-4 w-4" />}
                  onClick={handleGoogleSignIn}
                  className="w-full"
                  isLoading={isLoading}
                >
                  Sign in with Google
                </Button>
              </motion.div>

              <motion.div variants={itemVariants} className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-3 text-gray-400">or continue with</span>
                </div>
              </motion.div>

              <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-5">
                {formError ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p> : null}

                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email address"
                  placeholder="you@university.edu"
                  icon={<Mail className="h-4 w-4" />}
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  autoComplete="email"
                />

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <button type="button" className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      icon={<Lock className="h-4 w-4" />}
                      value={formData.password}
                      onChange={handleInputChange}
                      error={errors.password}
                      className="pr-10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" variant="primary" isLoading={isLoading} icon={<LogIn className="h-4 w-4" />} className="mt-6 w-full">
                  Sign In
                </Button>
              </motion.form>

              <motion.div variants={itemVariants} className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  Don&apos;t have an account?{' '}
                  <Link to="/signup" className="group inline-flex items-center gap-1 font-medium text-indigo-600 transition-colors hover:text-indigo-700">
                    Sign up
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-8 border-t border-gray-100 pt-6">
                <p className="text-center text-xs text-gray-400">
                  By signing in, you agree to our{' '}
                  <button className="text-gray-500 underline-offset-2 hover:text-gray-700 hover:underline" type="button">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button className="text-gray-500 underline-offset-2 hover:text-gray-700 hover:underline" type="button">
                    Privacy Policy
                  </button>
                </p>
                <div className="mt-4 text-center">
                  <Link to="/" className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-700">
                    Back to landing page
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
