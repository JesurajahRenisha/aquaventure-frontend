import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'

function App() {
  const [page, setPage] = useState(() => (localStorage.getItem('authToken') ? 'home' : 'login'))

  const authEmail = localStorage.getItem('authEmail')

  if (page === 'home') {
    return <HomePage userEmail={authEmail} onLogout={() => setPage('login')} />
  }

  if (page === 'register') {
    return <RegisterPage onSignIn={() => setPage('login')} onRegisterSuccess={() => setPage('home')} />
  }

  return (
    <LoginPage onCreateAccount={() => setPage('register')} onLoginSuccess={() => setPage('home')} />
  )
}

export default App