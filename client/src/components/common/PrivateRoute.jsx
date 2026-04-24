import { useAuth } from '../../context/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'

export default function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  console.log('PrivateRoute check:', { 
    pathname: location.pathname, 
    userRole: user?.role, 
    allowedRoles, 
    loading 
  })

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    console.log('No user, redirecting to /login')
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // Role-based access control
  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    console.log('Role mismatch:', { userRole: user.role, allowedRoles })
    // If admin tries to access user-only route, redirect to admin dashboard
    if (user.role === 'ADMIN') {
      console.log('Admin accessing user route, redirecting to /admin')
      return <Navigate to="/admin" replace />
    }
    // If regular user tries to access admin-only route, redirect to user dashboard
    console.log('User accessing admin route, redirecting to /dashboard')
    return <Navigate to="/dashboard" replace />
  }

  // Additional protection: prevent admins from accessing user dashboard
  if (user.role === 'ADMIN' && location.pathname === '/dashboard') {
    console.log('Admin on /dashboard, redirecting to /admin')
    return <Navigate to="/admin" replace />
  }

  // Prevent regular users from accessing admin routes
  if (user.role !== 'ADMIN' && location.pathname.startsWith('/admin')) {
    console.log('Non-admin on admin route, redirecting to /dashboard')
    return <Navigate to="/dashboard" replace />
  }

  console.log('Access granted')
  return children
}
