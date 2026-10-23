import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NotificationsBell from '../components/NotificationsBell'
import '../styles/shared.css'
import './DashboardLayout.css'

const SCHOOL_NAV = [
  { to: '/school', label: 'Dashboard', end: true },
  { to: '/school/lessons', label: 'Lessons' },
  { to: '/school/slots', label: 'Slots' },
  { to: '/school/bookings', label: 'Bookings' },
  { to: '/school/instructors', label: 'Instructors' },
  { to: '/school/equipment', label: 'Equipment' },
  { to: '/school/profile', label: 'Profile' },
]

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/schools', label: 'Schools' },
  { to: '/admin/locations', label: 'Surf Locations' },
]

function DashboardLayout({ role, title, children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const navItems = role === 'PLATFORM_ADMIN' ? ADMIN_NAV : SCHOOL_NAV
  const roleLabel = role === 'PLATFORM_ADMIN' ? 'Administrator' : 'Surf School'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <div className="dash-logo">AquaVenture</div>

        <div className="dash-profile-widget">
          <div className="dash-profile-avatar">{(user?.firstname ?? 'U').charAt(0).toUpperCase()}</div>
          <div>
            <h4>{user?.firstname ? `${user.firstname} ${user.lastname ?? ''}` : roleLabel}</h4>
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
          <NotificationsBell />
        </header>
        <div className="dash-content">{children}</div>
      </main>
    </div>
  )
}

export default DashboardLayout
