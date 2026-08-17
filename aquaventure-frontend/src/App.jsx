import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import ProviderDashboard from './pages/ProviderDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ActivityDetails from './pages/ActivityDetails'

function App() {
  const [page, setPage] = useState('login')
  const [selectedActivityId, setSelectedActivityId] = useState(null)

  const authEmail = localStorage.getItem('authEmail')

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authEmail')
    localStorage.removeItem('userRole')
    setSelectedActivityId(null)
    setPage('login')
  }

  if (page === 'home') {
    return (
      <HomePage
        userEmail={authEmail}
        onLogout={handleLogout}
        onActivitySelect={(activityId) => {
          setSelectedActivityId(activityId)
          setPage('activity-details')
        }}
      />
    )
  }

  if (page === 'activity-details') {
    return (
      <ActivityDetails
        activityId={selectedActivityId}
        onBack={() => setPage('home')}
        onLogout={handleLogout}
      />
    )
  }

  if (page === 'provider-dashboard') {
    return <ProviderDashboard userEmail={authEmail} onLogout={() => setPage('login')} />
  }

  if (page === 'admin-dashboard') {
    return <AdminDashboard userEmail={authEmail} onLogout={() => setPage('login')} />
  }

  if (page === 'register') {
    return <RegisterPage onSignIn={() => setPage('login')} onRegisterSuccess={() => {
      const role = localStorage.getItem('userRole')
      if (role === 'provider') setPage('provider-dashboard')
      else if (role === 'admin') setPage('admin-dashboard')
      else setPage('home')
    }} />
  }

  return (
    <LoginPage onCreateAccount={() => setPage('register')} onLoginSuccess={() => {
      const role = localStorage.getItem('userRole')
      if (role === 'provider') setPage('provider-dashboard')
      else if (role === 'admin') setPage('admin-dashboard')
      else setPage('home')
    }} />
  )
}

export default App