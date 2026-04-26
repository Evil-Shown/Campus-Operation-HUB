import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/common/PrivateRoute'
import Layout from './components/layout/Layout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/SignupPage'
import AuthCallback from './pages/auth/AuthCallback'
import ResourceListPage from './pages/resources/ResourceListPage'
import ResourceDetailPage from './pages/resources/ResourceDetailPage'
import BookingFormPage from './pages/bookings/BookingFormPage'
import MyBookingsPage from './pages/bookings/MyBookingsPage'
import TicketCreatePage from './pages/tickets/TicketCreatePage'
import TicketsPage from './pages/TicketsPage'
import TicketDetailPage from './pages/TicketDetailPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminResourcesPage from './pages/admin/AdminResourcesPage'
import AdminBookingsPage from './pages/admin/AdminBookingsPage'
import UserDashboard from './pages/UserDashboard'
import NotificationsPage from './pages/NotificationsPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const withProtectedLayout = (page, allowedRoles) => (
    <PrivateRoute allowedRoles={allowedRoles}>
      <Layout>{page}</Layout>
    </PrivateRoute>
  )

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/dashboard" element={withProtectedLayout(<UserDashboard />, ['USER'])} />
          <Route path="/user-dashboard" element={withProtectedLayout(<UserDashboard />, ['USER'])} />
          <Route path="/notifications" element={withProtectedLayout(<NotificationsPage />)} />
          <Route path="/admin-dashboard" element={withProtectedLayout(<AdminDashboardPage />, ['ADMIN'])} />
          <Route path="/resources" element={withProtectedLayout(<ResourceListPage />)} />
          <Route path="/resources/:id" element={withProtectedLayout(<ResourceDetailPage />)} />
          <Route path="/bookings/new" element={withProtectedLayout(<BookingFormPage />)} />
          <Route path="/bookings/new/:resourceId" element={withProtectedLayout(<BookingFormPage />)} />
          <Route path="/bookings/my" element={withProtectedLayout(<MyBookingsPage />)} />
          <Route path="/tickets" element={withProtectedLayout(<TicketsPage />)} />
          <Route path="/tickets/new" element={withProtectedLayout(<TicketCreatePage />)} />
          <Route path="/tickets/:id" element={withProtectedLayout(<TicketDetailPage />)} />
          <Route path="/admin" element={withProtectedLayout(<AdminDashboardPage />, ['ADMIN'])} />
          <Route path="/admin/resources" element={withProtectedLayout(<AdminResourcesPage />, ['ADMIN'])} />
          <Route path="/admin/bookings" element={withProtectedLayout(<AdminBookingsPage />, ['ADMIN'])} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
