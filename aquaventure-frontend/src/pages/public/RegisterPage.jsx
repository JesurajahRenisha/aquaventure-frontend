import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { listLocations } from '../../api/locationsApi'
import '../../layouts/AuthLayout.css'

const ROLE_TABS = [
  { value: 'SURFER', label: 'Surfer / Tourist' },
  { value: 'SCHOOL_ADMIN', label: 'Surf School' },
]

const SURFER_INITIAL = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  nationality: '',
  local: true,
}

const SCHOOL_INITIAL = {
  ownerFirstname: '',
  ownerLastname: '',
  email: '',
  password: '',
  confirmPassword: '',
  schoolName: '',
  description: '',
  address: '',
  contactPhone: '',
  contactEmail: '',
  businessRegistrationNumber: '',
}

function RegisterPage() {
  const { registerSurfer, registerSchool } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('SURFER')
  const [surferForm, setSurferForm] = useState(SURFER_INITIAL)
  const [schoolForm, setSchoolForm] = useState(SCHOOL_INITIAL)
  const [locations, setLocations] = useState([])
  const [locationIds, setLocationIds] = useState([])
  const [documents, setDocuments] = useState([])
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ message: '', isError: false })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    listLocations().then(setLocations).catch(() => {})
  }, [])

  const handleSurferChange = (event) => {
    const { name, value, type, checked } = event.target
    setSurferForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleSchoolChange = (event) => {
    const { name, value } = event.target
    setSchoolForm((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }))
  }

  const toggleLocation = (id) => {
    setLocationIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const form = role === 'SURFER' ? surferForm : schoolForm
    if (form.password !== form.confirmPassword) {
      setStatus({ message: 'Passwords do not match.', isError: true })
      return
    }

    setIsSubmitting(true)
    setStatus({ message: '', isError: false })
    setErrors({})

    try {
      if (role === 'SURFER') {
        await registerSurfer({
          firstname: surferForm.firstname,
          lastname: surferForm.lastname,
          email: surferForm.email,
          password: surferForm.password,
          phone: surferForm.phone || undefined,
          nationality: surferForm.nationality || undefined,
          local: surferForm.local,
        })
      } else {
        const formData = new FormData()
        formData.append('ownerFirstname', schoolForm.ownerFirstname)
        formData.append('ownerLastname', schoolForm.ownerLastname)
        formData.append('email', schoolForm.email)
        formData.append('password', schoolForm.password)
        formData.append('schoolName', schoolForm.schoolName)
        if (schoolForm.description) formData.append('description', schoolForm.description)
        if (schoolForm.address) formData.append('address', schoolForm.address)
        if (schoolForm.contactPhone) formData.append('contactPhone', schoolForm.contactPhone)
        if (schoolForm.contactEmail) formData.append('contactEmail', schoolForm.contactEmail)
        formData.append('businessRegistrationNumber', schoolForm.businessRegistrationNumber)
        locationIds.forEach((id) => formData.append('locationIds', id))
        documents.forEach((file) => formData.append('documents', file))
        await registerSchool(formData)
      }
      setStatus({
        message:
          role === 'SURFER'
            ? 'Account created. You can now sign in.'
            : 'School registered. It will show as Pending until a platform admin approves it — you can sign in now and edit your profile.',
        isError: false,
      })
      setTimeout(() => navigate('/login'), 1800)
    } catch (error) {
      const apiError = error.response?.data?.error
      if (apiError?.fieldErrors) {
        setErrors(apiError.fieldErrors)
        setStatus({ message: 'Please correct the errors below.', isError: true })
      } else {
        const message = apiError?.message || 'Registration failed. Please try again.'
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

            {role === 'SURFER' ? (
              <>
                <div className="auth-field">
                  <label htmlFor="firstname">First Name</label>
                  <input id="firstname" name="firstname" value={surferForm.firstname} onChange={handleSurferChange} required />
                  {errors.firstname && <span className="field-error">{errors.firstname}</span>}
                </div>
                <div className="auth-field">
                  <label htmlFor="lastname">Last Name</label>
                  <input id="lastname" name="lastname" value={surferForm.lastname} onChange={handleSurferChange} required />
                  {errors.lastname && <span className="field-error">{errors.lastname}</span>}
                </div>
                <div className="auth-field">
                  <label htmlFor="email">Email Address</label>
                  <input id="email" name="email" type="email" value={surferForm.email} onChange={handleSurferChange} required />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
                <div className="auth-field">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Min. 8 characters, upper+lower+number+special"
                    value={surferForm.password}
                    onChange={handleSurferChange}
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
                    value={surferForm.confirmPassword}
                    onChange={handleSurferChange}
                    required
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="phone">Phone (optional)</label>
                  <input id="phone" name="phone" value={surferForm.phone} onChange={handleSurferChange} />
                </div>
                <div className="auth-field">
                  <label htmlFor="nationality">Nationality (optional)</label>
                  <input id="nationality" name="nationality" value={surferForm.nationality} onChange={handleSurferChange} />
                </div>
                <div className="auth-field">
                  <label>
                    <input type="checkbox" name="local" checked={surferForm.local} onChange={handleSurferChange} />
                    {' '}I am a local resident
                  </label>
                </div>
              </>
            ) : (
              <>
                <div className="auth-field">
                  <label htmlFor="ownerFirstname">Owner First Name</label>
                  <input id="ownerFirstname" name="ownerFirstname" value={schoolForm.ownerFirstname} onChange={handleSchoolChange} required />
                  {errors.ownerFirstname && <span className="field-error">{errors.ownerFirstname}</span>}
                </div>
                <div className="auth-field">
                  <label htmlFor="ownerLastname">Owner Last Name</label>
                  <input id="ownerLastname" name="ownerLastname" value={schoolForm.ownerLastname} onChange={handleSchoolChange} required />
                  {errors.ownerLastname && <span className="field-error">{errors.ownerLastname}</span>}
                </div>
                <div className="auth-field">
                  <label htmlFor="schoolEmail">Email Address</label>
                  <input id="schoolEmail" name="email" type="email" value={schoolForm.email} onChange={handleSchoolChange} required />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
                <div className="auth-field">
                  <label htmlFor="schoolPassword">Password</label>
                  <input
                    id="schoolPassword"
                    name="password"
                    type="password"
                    placeholder="Min. 8 characters, upper+lower+number+special"
                    value={schoolForm.password}
                    onChange={handleSchoolChange}
                    required
                    minLength={8}
                  />
                  {errors.password && <span className="field-error">{errors.password}</span>}
                </div>
                <div className="auth-field">
                  <label htmlFor="schoolConfirmPassword">Confirm Password</label>
                  <input
                    id="schoolConfirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={schoolForm.confirmPassword}
                    onChange={handleSchoolChange}
                    required
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="schoolName">School Name</label>
                  <input id="schoolName" name="schoolName" value={schoolForm.schoolName} onChange={handleSchoolChange} required />
                  {errors.schoolName && <span className="field-error">{errors.schoolName}</span>}
                </div>
                <div className="auth-field">
                  <label htmlFor="description">Description (optional)</label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-input"
                    value={schoolForm.description}
                    onChange={handleSchoolChange}
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="address">Address (optional)</label>
                  <input id="address" name="address" value={schoolForm.address} onChange={handleSchoolChange} />
                </div>
                <div className="auth-field">
                  <label htmlFor="contactPhone">Contact Phone (optional)</label>
                  <input id="contactPhone" name="contactPhone" value={schoolForm.contactPhone} onChange={handleSchoolChange} />
                </div>
                <div className="auth-field">
                  <label htmlFor="contactEmail">Contact Email (optional)</label>
                  <input id="contactEmail" name="contactEmail" value={schoolForm.contactEmail} onChange={handleSchoolChange} />
                </div>
                <div className="auth-field">
                  <label htmlFor="businessRegistrationNumber">Business Registration Number</label>
                  <input
                    id="businessRegistrationNumber"
                    name="businessRegistrationNumber"
                    value={schoolForm.businessRegistrationNumber}
                    onChange={handleSchoolChange}
                    required
                  />
                  {errors.businessRegistrationNumber && (
                    <span className="field-error">{errors.businessRegistrationNumber}</span>
                  )}
                </div>
                <div className="auth-field">
                  <label>Locations You Operate In</label>
                  <div className="role-tabs" style={{ flexWrap: 'wrap' }}>
                    {locations.map((loc) => (
                      <button
                        key={loc.id}
                        type="button"
                        className={`role-tab ${locationIds.includes(loc.id) ? 'active' : ''}`}
                        onClick={() => toggleLocation(loc.id)}
                      >
                        {loc.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="auth-field">
                  <label htmlFor="documents">Verification Documents</label>
                  <input
                    id="documents"
                    type="file"
                    multiple
                    onChange={(e) => setDocuments(Array.from(e.target.files ?? []))}
                  />
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
