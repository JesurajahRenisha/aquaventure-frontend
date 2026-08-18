import { useEffect, useState } from 'react'
import SurferLayout from '../../layouts/SurferLayout'
import { useAuth } from '../../context/AuthContext'
import { getTourist, updateTourist } from '../../api/profileApi'

function SurferProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ skillLevel: 'BEGINNER', experience: '' })
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!user?.profileId) return
    getTourist(user.profileId).then((data) => {
      setProfile(data)
      setForm({ skillLevel: data.skillLevel ?? 'BEGINNER', experience: data.experience ?? '' })
    })
  }, [user])

  const handleSave = async (event) => {
    event.preventDefault()
    setStatus('Saving...')
    try {
      const updated = await updateTourist(user.profileId, form)
      setProfile(updated)
      setStatus('Saved.')
    } catch {
      setStatus('Could not save changes.')
    }
  }

  if (!profile) {
    return (
      <SurferLayout title="My Profile">
        <p>Loading...</p>
      </SurferLayout>
    )
  }

  return (
    <SurferLayout title="My Profile">
      <div className="grid-2">
        <div className="card">
          <h2 className="card-title">Account</h2>
          <div className="stat-box" style={{ textAlign: 'left', marginBottom: 12 }}>
            <div className="stat-label">Name</div>
            <div>{profile.name}</div>
          </div>
          <div className="stat-box" style={{ textAlign: 'left' }}>
            <div className="stat-label">Email</div>
            <div>{profile.email}</div>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Surfing Profile</h2>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label" htmlFor="skillLevel">Skill Level</label>
              <select
                id="skillLevel"
                className="form-select"
                value={form.skillLevel}
                onChange={(e) => setForm((f) => ({ ...f, skillLevel: e.target.value }))}
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="experience">Experience / Bio</label>
              <textarea
                id="experience"
                className="form-input"
                rows={4}
                value={form.experience}
                onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
              />
            </div>
            <button type="submit" className="btn btn-primary">Save Changes</button>
            {status && <p style={{ marginTop: 12, fontSize: 13, color: 'var(--text-secondary)' }}>{status}</p>}
          </form>
        </div>
      </div>
    </SurferLayout>
  )
}

export default SurferProfile
