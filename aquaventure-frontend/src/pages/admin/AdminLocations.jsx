import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { listLocations, createLocation, updateLocation, deleteLocation } from '../../api/locationsApi'

const EMPTY_FORM = { locationName: '', difficultyLevel: 'BEGINNER', safetyRating: 3 }

function AdminLocations() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    const list = await listLocations()
    setLocations(list)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    setEditing('new')
    setForm(EMPTY_FORM)
    setError('')
  }

  const openEdit = (loc) => {
    setEditing(loc.locationId)
    setForm({
      locationName: loc.locationName,
      difficultyLevel: loc.difficultyLevel,
      safetyRating: loc.safetyRating,
    })
    setError('')
  }

  const closeModal = () => setEditing(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    const payload = {
      locationName: form.locationName,
      difficultyLevel: form.difficultyLevel,
      safetyRating: Number(form.safetyRating),
    }
    try {
      if (editing === 'new') {
        await createLocation(payload)
      } else {
        await updateLocation(editing, payload)
      }
      closeModal()
      load()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Could not save location.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this surf location?')) return
    await deleteLocation(id)
    load()
  }

  return (
    <DashboardLayout role="ADMIN" title="Surf Locations">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className="card-title" style={{ marginBottom: 0 }}>All Surf Locations</h2>
          <button type="button" className="btn btn-primary" onClick={openCreate}>+ Add Location</button>
        </div>

        {loading && <p>Loading...</p>}
        {!loading && locations.length === 0 && <p className="empty-state">No surf locations yet.</p>}

        {!loading && locations.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Difficulty</th>
                  <th>Safety Rating</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {locations.map((l) => (
                  <tr key={l.locationId}>
                    <td>{l.locationName}</td>
                    <td>{l.difficultyLevel}</td>
                    <td>{l.safetyRating} / 5</td>
                    <td>
                      <div className="row-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => openEdit(l)}>Edit</button>
                        <button type="button" className="btn btn-danger" onClick={() => handleDelete(l.locationId)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="card-title">{editing === 'new' ? 'Add Location' : 'Edit Location'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="locationName">Location Name</label>
                <input
                  id="locationName"
                  className="form-input"
                  value={form.locationName}
                  onChange={(e) => setForm((f) => ({ ...f, locationName: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="difficultyLevel">Difficulty Level</label>
                <select
                  id="difficultyLevel"
                  className="form-select"
                  value={form.difficultyLevel}
                  onChange={(e) => setForm((f) => ({ ...f, difficultyLevel: e.target.value }))}
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="safetyRating">Safety Rating (1-5)</label>
                <input
                  id="safetyRating"
                  type="number"
                  min="1"
                  max="5"
                  className="form-input"
                  value={form.safetyRating}
                  onChange={(e) => setForm((f) => ({ ...f, safetyRating: e.target.value }))}
                  required
                />
              </div>
              {error && <p className="error-text">{error}</p>}
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default AdminLocations
