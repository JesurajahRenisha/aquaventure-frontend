import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../layouts/AuthLayout.css'

const ROLE_TABS = [
  { value: 'SURFER', label: 'Surfer / Tourist' },
  { value: 'PROVIDER', label: 'Surf Provider' },
]

function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('SURFER')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    skillLevel: 'BEGINNER',
    businessName: '',
    contactDetails: '',
    location: '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ message: '', isError: false })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: '' }))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (form.password !== form.confirmPassword) {
      setStatus({ message: 'Passwords do not match.', isError: true })
      return
    }

    setIsSubmitting(true)
    setStatus({ message: '', isError: false })
    setErrors({})

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role,
      ...(role === 'SURFER' ? { skillLevel: form.skillLevel } : {}),
      ...(role === 'PROVIDER'
        ? { businessName: form.businessName, contactDetails: form.contactDetails, location: form.location }
        : {}),
    }

    try {
      await register(payload)
      setStatus({ message: 'Account created. You can now sign in.', isError: false })
      setTimeout(() => navigate('/login'), 1200)
    } catch (error) {
      const apiData = error.response?.data
      if (apiData?.fieldErrors) {
        setErrors(apiData.fieldErrors)
        setStatus({ message: 'Please correct the errors below.', isError: true })
      } else {
        const message = apiData?.message || apiData?.error || 'Registration failed. Please try again.'
        setStatus({ message, isError: true })
      }
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
            <h2 className="auth-title">Create Your Account</h2>
            <p className="auth-subtitle">Join AquaVenture today!</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="role-tabs-container">
              <label className="role-label">Select Your Role</label>
              <div className="role-tabs">
                {ROLE_TABS.map((tab) => (
                  <button
                    key={tab.value}
                    type="button"
                    className={`role-tab ${role === tab.value ? 'active' : ''}`}
                    onClick={() => setRole(tab.value)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Min. 8 characters, upper+lower+number+special"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {role === 'SURFER' && (
              <div className="auth-field">
                <label htmlFor="skillLevel">Skill Level</label>
                <select id="skillLevel" name="skillLevel" value={form.skillLevel} onChange={handleChange}>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
            )}

            {role === 'PROVIDER' && (
              <>
                <div className="auth-field">
                  <label htmlFor="businessName">Business Name</label>
                  <input id="businessName" name="businessName" value={form.businessName} onChange={handleChange} required />
                </div>
                <div className="auth-field">
                  <label htmlFor="location">Location</label>
                  <input id="location" name="location" value={form.location} onChange={handleChange} />
                </div>
                <div className="auth-field">
                  <label htmlFor="contactDetails">Contact Details</label>
                  <input id="contactDetails" name="contactDetails" value={form.contactDetails} onChange={handleChange} />
                </div>
              </>
            )}

            <button type="submit" className="auth-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Register'}
            </button>

            {status.message && (
              <p className={`auth-message ${status.isError ? 'error' : 'success'}`}>{status.message}</p>
            )}
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
