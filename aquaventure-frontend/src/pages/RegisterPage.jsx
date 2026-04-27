import { useState } from 'react'
import AuthShell from './AuthShell'
import { register } from '../services/AuthService'

function RegisterPage({ onSignIn, onRegisterSuccess }) {
  const [role, setRole] = useState('tourist')
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  })
  const [status, setStatus] = useState({ message: '', isError: false })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!form.firstname || !form.lastname || !form.email || !form.password) {
      setStatus({ message: 'Please fill all required fields.', isError: true })
      return
    }

    setIsSubmitting(true)
    setStatus({ message: '', isError: false })

    try {
      await register({ ...form, role })
      setStatus({ message: 'Account created. You can now sign in.', isError: false })
      localStorage.setItem('authEmail', form.email)
      localStorage.setItem('userRole', role)
      onRegisterSuccess?.()
    } catch (error) {
      const apiData = error.response?.data
      const message =
        (typeof apiData === 'string' && apiData) ||
        apiData?.message ||
        apiData?.error ||
        'Registration failed. Please try again.'
      setStatus({ message, isError: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell>
      <h2 className="auth-form-title">Join AquaVenture</h2>
      <p className="auth-form-sub">Create your free account and start exploring beach activities.</p>

      <div className="auth-roles">
        <button
          className={`auth-role ${role === 'tourist' ? 'active' : ''}`}
          onClick={() => setRole('tourist')}
          type="button"
        >
          <div className="auth-role-icon">🏖️</div>
          <div className="auth-role-name">Tourist</div>
          <div className="auth-role-description">Browse and book activities</div>
        </button>

        <button
          className={`auth-role ${role === 'provider' ? 'active' : ''}`}
          onClick={() => setRole('provider')}
          type="button"
        >
          <div className="auth-role-icon">🏄</div>
          <div className="auth-role-name">Provider</div>
          <div className="auth-role-description">List and manage services</div>
        </button>

        <button
          className={`auth-role ${role === 'admin' ? 'active' : ''}`}
          onClick={() => setRole('admin')}
          type="button"
        >
          <div className="auth-role-icon">⚙️</div>
          <div className="auth-role-name">Admin</div>
          <div className="auth-role-description">Manage platform operations</div>
        </button>
      </div>

      <div className="auth-row">
        <div className="auth-field">
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            name="firstname"
            type="text"
            placeholder="Kasun"
            value={form.firstname}
            onChange={handleChange}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            name="lastname"
            type="text"
            placeholder="Perera"
            value={form.lastname}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor="registerEmail">Email address</label>
        <input
          id="registerEmail"
          name="email"
          type="email"
          placeholder="you@email.com"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      <div className="auth-field">
        <label htmlFor="registerPassword">Password</label>
        <input
          id="registerPassword"
          name="password"
          type="password"
          placeholder="Min. 8 characters"
          value={form.password}
          onChange={handleChange}
        />
      </div>

      <button className="auth-submit" type="button" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create account →'}
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
        Sign up with Google
      </button>

      <p className="auth-switch">
        Already have an account? <span onClick={onSignIn}>Sign in</span>
      </p>

      <p className="auth-terms">
        By creating an account you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>
      </p>
    </AuthShell>
  )
}

export default RegisterPage
