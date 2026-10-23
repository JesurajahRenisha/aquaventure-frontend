import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { listAllLocations, createLocation, updateLocation, deleteLocation } from '../../api/adminApi'

const EMPTY_FORM = { name: '', region: '', description: '', latitude: '', longitude: '', active: true }

function AdminLocations() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    const list = await listAllLocations()
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
    setEditing(loc.id)
    setForm({
      name: loc.name,
      region: loc.region ?? '',
      description: loc.description ?? '',
      latitude: loc.latitude ?? '',
      longitude: loc.longitude ?? '',
      active: loc.active,
    })
    setError('')
  }

  const closeModal = () => setEditing(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    const payload = {
      name: form.name,
      region: form.region || null,
      description: form.description || null,
      latitude: form.latitude === '' ? null : Number(form.latitude),
      longitude: form.longitude === '' ? null : Number(form.longitude),
      active: form.active,
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
      setError(err.response?.data?.error?.message ?? 'Could not save location.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this surf location?')) return
    await deleteLocation(id)
    load()
  }

  return (
    <DashboardLayout role="PLATFORM_ADMIN" title="Surf Locations">
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
                  <th>Region</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {locations.map((l) => (
                  <tr key={l.id}>
                    <td>{l.name}</td>
                    <td>{l.region}</td>
                    <td>
                      <span className={`status-badge status-${l.active ? 'active' : 'inactive'}`}>
                        {l.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => openEdit(l)}>Edit</button>
                        <button type="button" className="btn btn-danger" onClick={() => handleDelete(l.id)}>Deactivate</button>
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
                <label className="form-label" htmlFor="name">Location Name</label>
                <input id="name" className="form-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="region">Region</label>
                <input id="region" className="form-input" value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="description">Description</label>
                <textarea id="description" className="form-input" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="latitude">Latitude</label>
                  <input id="latitude" type="number" step="0.0001" className="form-input" value={form.latitude} onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="longitude">Longitude</label>
                  <input id="longitude" type="number" step="0.0001" className="form-input" value={form.longitude} onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="active">
                  <input id="active" type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} style={{ marginRight: 8 }} />
                  Active
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

export default AdminLocations
