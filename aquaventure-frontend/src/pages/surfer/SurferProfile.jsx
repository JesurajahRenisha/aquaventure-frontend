import { useEffect, useState } from 'react'
import SurferLayout from '../../layouts/SurferLayout'
import { useAuth } from '../../context/AuthContext'
import { getMyProfile, updateMyProfile } from '../../api/surferApi'
import { listLocations } from '../../api/locationsApi'

const EMPTY_FORM = {
  skillLevel: 'BEGINNER',
  preferredLocationId: '',
  preferredLessonType: '',
  budgetMin: '',
  budgetMax: '',
  boardTypePreference: '',
  bio: '',
}

function SurferProfile() {
  const { user } = useAuth()
  const [locations, setLocations] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')

  useEffect(() => {
    Promise.all([getMyProfile(), listLocations()]).then(([profile, locs]) => {
      setLocations(locs)
      setForm({
        skillLevel: profile.skillLevel ?? 'BEGINNER',
        preferredLocationId: profile.preferredLocationId ?? '',
        preferredLessonType: profile.preferredLessonType ?? '',
        budgetMin: profile.budgetMin ?? '',
        budgetMax: profile.budgetMax ?? '',
        boardTypePreference: profile.boardTypePreference ?? '',
        bio: profile.bio ?? '',
      })
      setLoading(false)
    })
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setStatus('Saving...')
    try {
      await updateMyProfile({
        skillLevel: form.skillLevel,
        preferredLocationId: form.preferredLocationId ? Number(form.preferredLocationId) : null,
        preferredLessonType: form.preferredLessonType || null,
        budgetMin: form.budgetMin === '' ? null : Number(form.budgetMin),
        budgetMax: form.budgetMax === '' ? null : Number(form.budgetMax),
        boardTypePreference: form.boardTypePreference || null,
        bio: form.bio || null,
      })
      setStatus('Saved.')
    } catch {
      setStatus('Could not save changes.')
    }
  }

  if (loading) {
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
            <div>{user?.firstname} {user?.lastname}</div>
          </div>
          <div className="stat-box" style={{ textAlign: 'left' }}>
            <div className="stat-label">Email</div>
            <div>{user?.email}</div>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Surfing Profile</h2>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label" htmlFor="skillLevel">Skill Level</label>
              <select id="skillLevel" name="skillLevel" className="form-select" value={form.skillLevel} onChange={handleChange}>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="preferredLocationId">Preferred Location</label>
              <select id="preferredLocationId" name="preferredLocationId" className="form-select" value={form.preferredLocationId} onChange={handleChange}>
                <option value="">No preference</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="preferredLessonType">Preferred Lesson Type</label>
              <select id="preferredLessonType" name="preferredLessonType" className="form-select" value={form.preferredLessonType} onChange={handleChange}>
                <option value="">No preference</option>
                <option value="GROUP">Group</option>
                <option value="PRIVATE">Private</option>
                <option value="SEMI_PRIVATE">Semi-Private</option>
              </select>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="budgetMin">Budget Min</label>
                <input id="budgetMin" name="budgetMin" type="number" className="form-input" value={form.budgetMin} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="budgetMax">Budget Max</label>
                <input id="budgetMax" name="budgetMax" type="number" className="form-input" value={form.budgetMax} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="boardTypePreference">Board Type Preference</label>
              <input id="boardTypePreference" name="boardTypePreference" className="form-input" value={form.boardTypePreference} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="bio">Bio</label>
              <textarea id="bio" name="bio" className="form-input" rows={4} value={form.bio} onChange={handleChange} />
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
