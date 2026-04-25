import { useState } from 'react'
import AuthShell from './AuthShell'
import { login } from '../services/AuthService'

function LoginPage({ onCreateAccount, onLoginSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState({ message: '', isError: false })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setStatus({ message: 'Please enter email and password.', isError: true })
      return
    }

    setIsSubmitting(true)
    setStatus({ message: '', isError: false })

    try {
      const response = await login(form)
      const token = response.data
      localStorage.setItem('authToken', token)
      localStorage.setItem('authEmail', form.email)
      setStatus({ message: 'Signed in successfully.', isError: false })
      onLoginSuccess?.()
    } catch (error) {
      const apiData = error.response?.data
      const message =
        (typeof apiData === 'string' && apiData) ||
        apiData?.message ||
        apiData?.error ||
        'Sign in failed. Please check your credentials.'
      setStatus({ message, isError: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell>
      <h2 className="auth-form-title">Welcome back</h2>
      <p className="auth-form-sub">Sign in to manage your bookings and adventures.</p>

      <div className="auth-field">
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@email.com"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      <div className="auth-field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
        />
      </div>

      <p className="auth-forgot">Forgot password?</p>
      <button className="auth-submit" type="button" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in →'}
      </button>
      {status.message && (
        <p className={`auth-message ${status.isError ? 'error' : 'success'}`}>{status.message}</p>
      )}

      <div className="auth-divider">
        <div className="auth-divider-line" />
        <span className="auth-divider-text">or</span>
        <div className="auth-divider-line" />
      </div>

      <button className="auth-google" type="button">
        <span className="auth-google-icon">G</span>
        Continue with Google
      </button>

      <p className="auth-switch">
        No account? <span onClick={onCreateAccount}>Create one free</span>
      </p>
    </AuthShell>
  )
}

export default LoginPage
