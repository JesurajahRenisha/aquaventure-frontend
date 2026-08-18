import { useEffect, useState } from 'react'
import SurferLayout from '../../layouts/SurferLayout'
import { getMyUser, updateMyUser } from '../../api/profileApi'

function SurferSettings() {
  const [form, setForm] = useState({ name: '', phoneNumber: '' })
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyUser()
      .then((data) => setForm({ name: data.name, phoneNumber: data.phoneNumber ?? '' }))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('Saving...')
    try {
      await updateMyUser(form)
      setStatus('Saved.')
    } catch {
      setStatus('Could not save changes.')
    }
  }

  return (
    <SurferLayout title="Settings">
      <div className="card" style={{ maxWidth: 480 }}>
        <h2 className="card-title">Account Settings</h2>
        {loading && <p>Loading...</p>}
        {!loading && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input
                id="name"
                className="form-input"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                className="form-input"
                value={form.phoneNumber}
                onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
              />
            </div>
            <button type="submit" className="btn btn-primary">Save Changes</button>
            {status && <p style={{ marginTop: 12, fontSize: 13, color: 'var(--text-secondary)' }}>{status}</p>}
          </form>
        )}
      </div>
    </SurferLayout>
  )
}

export default SurferSettings
