import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Shell from './components/Shell'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import SectionPage from './pages/SectionPage'
import './App.css'

const modulePages = {
  catalogue: {
    title: 'Catalogue',
    description: 'Basic landing area for resource browsing. Member-specific UI stays blank for now.',
  },
  bookings: {
    title: 'Bookings',
    description: 'Reserved for the booking workflow later. This route is intentionally minimal.',
  },
  tickets: {
    title: 'Tickets',
    description: 'Reserved for issue reporting and attachments later. No member-specific UI yet.',
  },
  notifications: {
    title: 'Notifications',
    description: 'Leader notification center placeholder. Polling and bell UI can be added later.',
  },
  admin: {
    title: 'Admin Dashboard',
    description: 'Leader-only admin shell for future role controls and setup tasks.',
  },
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/app"
          element={
            <PrivateRoute>
              <Shell>
                <AdminDashboardPage />
              </Shell>
            </PrivateRoute>
          }
        />
        <Route
          path="/catalogue"
          element={
            <PrivateRoute>
              <Shell>
                <SectionPage {...modulePages.catalogue} />
              </Shell>
            </PrivateRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <PrivateRoute>
              <Shell>
                <SectionPage {...modulePages.bookings} />
              </Shell>
            </PrivateRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <PrivateRoute>
              <Shell>
                <SectionPage {...modulePages.tickets} />
              </Shell>
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Shell>
                <SectionPage {...modulePages.notifications} />
              </Shell>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute allowRoles={['leader']}>
              <Shell>
                <SectionPage {...modulePages.admin} />
              </Shell>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
