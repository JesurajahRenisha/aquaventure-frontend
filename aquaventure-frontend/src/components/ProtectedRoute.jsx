import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/** Redirects to /login if not authenticated, or to the user's own dashboard if their role doesn't match. */
function ProtectedRoute({ role, children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    const home = { SURFER: '/surfer', PROVIDER: '/provider', ADMIN: '/admin' }[user.role] ?? '/login'
    return <Navigate to={home} replace />
  }

  return children
}

export default ProtectedRoute
