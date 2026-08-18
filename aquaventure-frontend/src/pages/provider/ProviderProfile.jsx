import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { getProvider, updateProvider } from '../../api/profileApi'

function ProviderProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ businessName: '', contactDetails: '', location: '' })
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!user?.profileId) return
    getProvider(user.profileId).then((data) => {
      setProfile(data)
      setForm({
        businessName: data.businessName ?? '',
        contactDetails: data.contactDetails ?? '',
        location: data.location ?? '',
      })
    })
  }, [user])

  const handleSave = async (event) => {
    event.preventDefault()
    setStatus('Saving...')
    try {
      const updated = await updateProvider(user.profileId, form)
      setProfile(updated)
      setStatus('Saved.')
    } catch {
      setStatus('Could not save changes.')
    }
  }

  if (!profile) {
    return (
      <DashboardLayout role="PROVIDER" title="Business Profile">
        <p>Loading...</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="PROVIDER" title="Business Profile">
      <div className="grid-2">
        <div className="card">
          <h2 className="card-title">Account</h2>
          <div className="stat-box" style={{ textAlign: 'left', marginBottom: 12 }}>
            <div className="stat-label">Contact Name</div>
            <div>{profile.name}</div>
          </div>
          <div className="stat-box" style={{ textAlign: 'left' }}>
            <div className="stat-label">Email</div>
            <div>{profile.email}</div>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Business Details</h2>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label" htmlFor="businessName">Business Name</label>
              <input
                id="businessName"
                className="form-input"
                value={form.businessName}
                onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contactDetails">Contact Details</label>
              <input
                id="contactDetails"
                className="form-input"
                value={form.contactDetails}
                onChange={(e) => setForm((f) => ({ ...f, contactDetails: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="location">Location</label>
              <input
                id="location"
                className="form-input"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              />
            </div>
            <button type="submit" className="btn btn-primary">Save Changes</button>
            {status && <p style={{ marginTop: 12, fontSize: 13, color: 'var(--text-secondary)' }}>{status}</p>}
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ProviderProfile
