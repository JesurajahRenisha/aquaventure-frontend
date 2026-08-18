import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/shared.css'
import './DashboardLayout.css'

const PROVIDER_NAV = [
  { to: '/provider', label: 'Dashboard', end: true },
  { to: '/provider/services', label: 'Services' },
  { to: '/provider/bookings', label: 'Bookings' },
  { to: '/provider/instructors', label: 'Instructors' },
  { to: '/provider/equipment', label: 'Equipment' },
  { to: '/provider/profile', label: 'Profile' },
]

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/providers', label: 'Providers' },
  { to: '/admin/locations', label: 'Surf Locations' },
  { to: '/admin/bookings', label: 'Bookings' },
]

function DashboardLayout({ role, title, children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const navItems = role === 'ADMIN' ? ADMIN_NAV : PROVIDER_NAV
  const roleLabel = role === 'ADMIN' ? 'Administrator' : 'Surf Provider'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <div className="dash-logo">AquaVenture</div>

        <div className="dash-profile-widget">
          <div className="dash-profile-avatar">{(user?.name ?? 'U').charAt(0).toUpperCase()}</div>
          <div>
            <h4>{user?.name ?? roleLabel}</h4>
            <p>{roleLabel}</p>
          </div>
        </div>

        <ul className="dash-menu">
          {navItems.map((item) => (
            <li key={item.to} className="dash-menu-item">
              <NavLink to={item.to} end={item.end} className={({ isActive }) => (isActive ? 'active' : '')}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button type="button" className="dash-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="dash-main">
        <header className="dash-header">
          <h1>{title}</h1>
        </header>
        <div className="dash-content">{children}</div>
      </main>
    </div>
  )
}

export default DashboardLayout
