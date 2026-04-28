import { useState } from 'react'
import AuthShell from './AuthShell'
import { login } from '../services/AuthService'

function LoginPage({ onCreateAccount, onLoginSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ message: '', isError: false })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = (name, value) => {
    const fieldErrors = {}

    switch (name) {
      case 'email':
        if (!value.trim()) {
          fieldErrors.email = 'Email is required'
        }
        break
      case 'password':
        if (!value) {
          fieldErrors.password = 'Password is required'
        }
        break
    }

    return fieldErrors
  }

  const validateForm = () => {
    const allErrors = {}
    Object.keys(form).forEach(key => {
      const fieldErrors = validateField(key, form[key])
      Object.assign(allErrors, fieldErrors)
    })
    setErrors(allErrors)
    return Object.keys(allErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))

    // Clear field error on change
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: '' }))
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      setStatus({ message: 'Please correct the errors below.', isError: true })
      return
    }

    setIsSubmitting(true)
    setStatus({ message: '', isError: false })

    try {
      const user = await login(form)
      localStorage.setItem('authToken', user.token)
      localStorage.setItem('authEmail', form.email)
      localStorage.setItem('userRole', user.role)
      setStatus({ message: 'Signed in successfully.', isError: false })
      onLoginSuccess?.()
    } catch (error) {
      const apiData = error.response?.data

      if (apiData?.errors) {
        // Field-level errors from backend
        setErrors(apiData.errors)
        setStatus({ message: 'Please correct the validation errors.', isError: true })
      } else {
        // General error
        const message =
          (typeof apiData === 'string' && apiData) ||
          apiData?.message ||
          apiData?.error ||
          'Sign in failed. Please check your credentials.'
        setStatus({ message, isError: true })
        setErrors({})
      }
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
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
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
          className={errors.password ? 'error' : ''}
        />
        {errors.password && <span className="field-error">{errors.password}</span>}
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
