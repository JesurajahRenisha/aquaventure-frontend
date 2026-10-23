import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { getMySchool, updateMySchool } from '../../api/schoolAdminApi'
import { listLocations } from '../../api/locationsApi'
import { useAuth } from '../../context/AuthContext'

const EMPTY_FORM = { name: '', description: '', address: '', contactPhone: '', contactEmail: '', logoUrl: '', locationIds: [] }

function SchoolProfile() {
  const { setSchoolStatus } = useAuth()
  const [school, setSchool] = useState(null)
  const [locations, setLocations] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('')

  const load = () =>
    Promise.all([getMySchool(), listLocations()]).then(([data, locs]) => {
      setSchool(data)
      setSchoolStatus(data.status)
      setLocations(locs)
      setForm({
        name: data.name ?? '',
        description: data.description ?? '',
        address: data.address ?? '',
        contactPhone: data.contactPhone ?? '',
        contactEmail: data.contactEmail ?? '',
        logoUrl: data.logoUrl ?? '',
        locationIds: data.locationIds ?? [],
      })
    })

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleLocation = (id) => {
    setForm((f) => ({
      ...f,
      locationIds: f.locationIds.includes(id) ? f.locationIds.filter((x) => x !== id) : [...f.locationIds, id],
    }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setStatus('Saving...')
    try {
      const updated = await updateMySchool({
        name: form.name,
        description: form.description || null,
        address: form.address || null,
        contactPhone: form.contactPhone || null,
        contactEmail: form.contactEmail || null,
        logoUrl: form.logoUrl || null,
        imageUrls: school.imageUrls ?? [],
        locationIds: form.locationIds,
      })
      setSchool(updated)
      setStatus('Saved.')
    } catch {
      setStatus('Could not save changes.')
    }
  }

  if (!school) {
    return (
      <DashboardLayout role="SCHOOL_ADMIN" title="School Profile">
        <p>Loading...</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="SCHOOL_ADMIN" title="School Profile">
      {school.status !== 'APPROVED' && (
        <div className="card" style={{ marginBottom: 24, borderLeft: '4px solid var(--accent-orange)' }}>
          <strong>Status: {school.status}</strong>
          {school.status === 'REJECTED' && school.rejectionReason && (
            <p style={{ marginTop: 6, color: 'var(--text-secondary)' }}>Reason: {school.rejectionReason}</p>
          )}
        </div>
      )}
      <div className="grid-2">
        <div className="card">
          <h2 className="card-title">Status</h2>
          <span className={`status-badge status-${school.status.toLowerCase()}`}>{school.status}</span>
        </div>

        <div className="card">
          <h2 className="card-title">Business Details</h2>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">School Name</label>
              <input id="name" className="form-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="description">Description</label>
              <textarea id="description" className="form-input" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="address">Address</label>
              <input id="address" className="form-input" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contactPhone">Contact Phone</label>
              <input id="contactPhone" className="form-input" value={form.contactPhone} onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contactEmail">Contact Email</label>
              <input id="contactEmail" className="form-input" value={form.contactEmail} onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="logoUrl">Logo URL</label>
              <input id="logoUrl" className="form-input" value={form.logoUrl} onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Locations Served</label>
              <div className="role-tabs" style={{ flexWrap: 'wrap', display: 'flex', gap: 8 }}>
                {locations.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    className={form.locationIds.includes(loc.id) ? 'btn btn-primary' : 'btn btn-secondary'}
                    onClick={() => toggleLocation(loc.id)}
                  >
                    {loc.name}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Save Changes</button>
            {status && <p style={{ marginTop: 12, fontSize: 13, color: 'var(--text-secondary)' }}>{status}</p>}
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SchoolProfile
