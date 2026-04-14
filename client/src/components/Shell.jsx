import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/app', label: 'Admin dashboard' },
  { to: '/catalogue', label: 'Catalogue' },
  { to: '/bookings', label: 'Bookings' },
  { to: '/tickets', label: 'Tickets' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/admin', label: 'Admin' },
]

export default function Shell({ children }) {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <div className="app-shell__layout">
        <aside className="app-shell__sidebar">
          <div className="app-shell__brand">
            <strong>CampusOps HUB</strong>
            <span>Leader workspace</span>
          </div>

          <nav className="app-shell__nav" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="app-shell__sidebar-footer">
            <p>{user?.name}</p>
            <p>{user?.role}</p>
            <button className="button-secondary" type="button" onClick={logout}>
              Sign out
            </button>
          </div>
        </aside>

        <main className="app-shell__content">
          <div className="page-frame">{children}</div>
        </main>
      </div>
    </div>
  )
}
