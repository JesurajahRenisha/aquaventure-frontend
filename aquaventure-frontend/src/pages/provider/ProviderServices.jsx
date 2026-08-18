import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { searchActivities, createActivity, updateActivity, deleteActivity } from '../../api/activitiesApi'
import { listLocations } from '../../api/locationsApi'

const EMPTY_FORM = { locationId: '', activityName: '', price: '', duration: '', active: true }

function ProviderServices() {
  const { user } = useAuth()
  const [activities, setActivities] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  const load = async () => {
    if (!user?.profileId) return
    setLoading(true)
    const [activityList, locationList] = await Promise.all([
      searchActivities({ providerId: user.profileId }),
      listLocations(),
    ])
    setActivities(activityList)
    setLocations(locationList)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const openCreate = () => {
    setEditing('new')
    setForm(EMPTY_FORM)
    setError('')
  }

  const openEdit = (activity) => {
    setEditing(activity.activityId)
    setForm({
      locationId: activity.locationId,
      activityName: activity.activityName,
      price: activity.price,
      duration: activity.duration,
      active: activity.active,
    })
    setError('')
  }

  const closeModal = () => setEditing(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    const payload = {
      locationId: Number(form.locationId),
      activityName: form.activityName,
      price: Number(form.price),
      duration: Number(form.duration),
      active: form.active,
    }
    try {
      if (editing === 'new') {
        await createActivity(payload)
      } else {
        await updateActivity(editing, payload)
      }
      closeModal()
      load()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Could not save service.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return
    await deleteActivity(id)
    load()
  }

  return (
    <DashboardLayout role="PROVIDER" title="My Services">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className="card-title" style={{ marginBottom: 0 }}>Surf Lessons</h2>
          <button type="button" className="btn btn-primary" onClick={openCreate}>+ Add Service</button>
        </div>

        {loading && <p>Loading...</p>}
        {!loading && activities.length === 0 && <p className="empty-state">No services yet. Add your first surf lesson.</p>}

        {!loading && activities.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a) => (
                  <tr key={a.activityId}>
                    <td>{a.activityName}</td>
                    <td>{a.locationName}</td>
                    <td>${Number(a.price).toFixed(2)}</td>
                    <td>{a.duration} min</td>
                    <td>
                      <span className={`status-badge status-${a.active ? 'active' : 'inactive'}`}>
                        {a.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => openEdit(a)}>Edit</button>
                        <button type="button" className="btn btn-danger" onClick={() => handleDelete(a.activityId)}>Delete</button>
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
            <h2 className="card-title">{editing === 'new' ? 'Add Service' : 'Edit Service'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="activityName">Service Name</label>
                <input
                  id="activityName"
                  className="form-input"
                  value={form.activityName}
                  onChange={(e) => setForm((f) => ({ ...f, activityName: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="locationId">Surf Location</label>
                <select
                  id="locationId"
                  className="form-select"
                  value={form.locationId}
                  onChange={(e) => setForm((f) => ({ ...f, locationId: e.target.value }))}
                  required
                >
                  <option value="" disabled>Select a location</option>
                  {locations.map((l) => (
                    <option key={l.locationId} value={l.locationId}>{l.locationName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="price">Price ($)</label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-input"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="duration">Duration (minutes)</label>
                <input
                  id="duration"
                  type="number"
                  min="15"
                  className="form-input"
                  value={form.duration}
                  onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="active">
                  <input
                    id="active"
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                    style={{ marginRight: 8 }}
                  />
                  Active (visible to surfers)
                </label>
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

export default ProviderServices
