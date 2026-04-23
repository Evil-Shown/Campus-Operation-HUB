import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    // If user is not admin, redirect to user dashboard
    if (user.role !== 'ADMIN') {
      return <Navigate to="/dashboard" replace />
    }
    // If user is admin but trying to access non-admin route, redirect to admin dashboard
    return <Navigate to="/admin" replace />
  }

  return children
}
