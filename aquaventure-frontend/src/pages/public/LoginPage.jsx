import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../layouts/AuthLayout.css'

const HOME_BY_ROLE = { SURFER: '/surfer', PROVIDER: '/provider', ADMIN: '/admin', INSTRUCTOR: '/surfer' }

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState({ message: '', isError: false })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus({ message: '', isError: false })

    try {
      const response = await login(form.email, form.password)
      navigate(HOME_BY_ROLE[response.role] ?? '/surfer')
    } catch (error) {
      const apiData = error.response?.data
      const message = apiData?.message || apiData?.error || 'Sign in failed. Please check your credentials.'
      setStatus({ message, isError: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-body">
      <div className="auth-container">
        <div className="auth-card">
          <Link to="/" className="auth-logo">
            <span className="auth-logo-text">AquaVenture</span>
            <div className="auth-tagline">Surf Smart, Surf Safe</div>
          </Link>

          <div className="auth-header">
            <h2 className="auth-title">Welcome Back!</h2>
            <p className="auth-subtitle">Login to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Login'}
            </button>

            {status.message && (
              <p className={`auth-message ${status.isError ? 'error' : 'success'}`}>{status.message}</p>
            )}
          </form>

          <div className="auth-footer">
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
