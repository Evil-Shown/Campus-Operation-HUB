import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/common/PrivateRoute'
import Layout from './components/layout/Layout'
import RootPage from './pages/RootPage'
import LoginPage from './pages/auth/LoginPage'
import AuthCallback from './pages/auth/AuthCallback'
import ResourceListPage from './pages/resources/ResourceListPage'
import ResourceDetailPage from './pages/resources/ResourceDetailPage'
import BookingFormPage from './pages/bookings/BookingForm'
import MyBookingsPage from './pages/bookings/MyBookings'
import TicketListPage from './pages/tickets/TicketListPage'
import TicketCreatePage from './pages/tickets/TicketCreatePage'
import TicketDetailPage from './pages/tickets/TicketDetailPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminResourcesPage from './pages/admin/AdminResourcesPage'
import AdminBookingsPage from './pages/bookings/AdminBookings'
import Dashboard from './pages/Dashboard'
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
          <Route path="/" element={<RootPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/dashboard" element={withProtectedLayout(<Dashboard role="user" />)} />
          <Route path="/resources/:id" element={withProtectedLayout(<ResourceDetailPage />)} />
          <Route path="/bookings/new" element={withProtectedLayout(<BookingFormPage />)} />
          <Route path="/bookings/new/:resourceId" element={withProtectedLayout(<BookingFormPage />)} />
          <Route path="/bookings/my" element={withProtectedLayout(<MyBookingsPage />)} />
          <Route path="/tickets" element={withProtectedLayout(<TicketListPage />)} />
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
