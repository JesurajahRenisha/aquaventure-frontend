import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/shared.css'
import './SurferLayout.css'

const NAV_ITEMS = [
  { to: '/surfer', label: 'Dashboard', end: true },
  { to: '/surfer/profile', label: 'My Profile' },
  { to: '/surfer/recommendation', label: 'Surf Recommendation' },
  { to: '/surfer/conditions', label: 'Surf Conditions' },
  { to: '/surfer/spots', label: 'Surf Spots' },
  { to: '/surfer/progress', label: 'Surf Progress' },
  { to: '/surfer/book', label: 'Book Lessons' },
  { to: '/surfer/bookings', label: 'Booking History' },
  { to: '/surfer/settings', label: 'Settings' },
]

function SurferLayout({ title, children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="surfer-shell">
      <aside className="surfer-sidebar">
        <div className="surfer-logo">AquaVenture</div>

        <div className="surfer-profile-widget">
          <div className="surfer-profile-avatar">{(user?.name ?? 'S').charAt(0).toUpperCase()}</div>
          <div>
            <h3>{user?.name ?? 'Surfer'}</h3>
            <p>Surfer</p>
          </div>
        </div>

        <ul className="surfer-menu">
          {NAV_ITEMS.map((item) => (
            <li key={item.to} className="surfer-menu-item">
              <NavLink to={item.to} end={item.end} className={({ isActive }) => (isActive ? 'active' : '')}>
                {item.label}
              </NavLink>
            </li>
          ))}
          <li className="surfer-menu-item">
            <button type="button" className="surfer-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </aside>

      <main className="surfer-main">
        <header className="surfer-page-header">
          <h1>{title}</h1>
        </header>
        <div className="surfer-content">{children}</div>
      </main>
    </div>
  )
}

export default SurferLayout
