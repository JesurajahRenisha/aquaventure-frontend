import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import SchoolApprovalGate from '../../components/SchoolApprovalGate'
import { useAuth } from '../../context/AuthContext'
import { listMyLessons, createLesson, updateLesson, deleteLesson } from '../../api/schoolAdminApi'
import { listLocations } from '../../api/locationsApi'

const EMPTY_FORM = {
  title: '',
  description: '',
  lessonType: 'GROUP',
  skillLevel: 'BEGINNER',
  durationMinutes: 90,
  price: '',
  currency: 'USD',
  maxParticipants: 6,
  includesEquipment: false,
  locationId: '',
  active: true,
}

function SchoolLessons() {
  const { user } = useAuth()
  const [lessons, setLessons] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  const load = async () => {
    if (user?.schoolStatus !== 'APPROVED') {
      setLoading(false)
      return
    }
    setLoading(true)
    const [page, locs] = await Promise.all([listMyLessons(), listLocations()])
    setLessons(page.content ?? [])
    setLocations(locs)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.schoolStatus])

  const openCreate = () => {
    setEditing('new')
    setForm(EMPTY_FORM)
    setError('')
  }

  const openEdit = (lesson) => {
    setEditing(lesson.id)
    setForm({
      title: lesson.title,
      description: lesson.description ?? '',
      lessonType: lesson.lessonType,
      skillLevel: lesson.skillLevel,
      durationMinutes: lesson.durationMinutes,
      price: lesson.price,
      currency: lesson.currency,
      maxParticipants: lesson.maxParticipants,
      includesEquipment: lesson.includesEquipment,
      locationId: lesson.locationId,
      active: lesson.active,
    })
    setError('')
  }

  const closeModal = () => setEditing(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    const payload = {
      title: form.title,
      description: form.description || null,
      lessonType: form.lessonType,
      skillLevel: form.skillLevel,
      durationMinutes: Number(form.durationMinutes),
      price: Number(form.price),
      currency: form.currency,
      maxParticipants: Number(form.maxParticipants),
      includesEquipment: form.includesEquipment,
      locationId: Number(form.locationId),
      active: form.active,
    }
    try {
      if (editing === 'new') {
        await createLesson(payload)
      } else {
        await updateLesson(editing, payload)
      }
      closeModal()
      load()
    } catch (err) {
      setError(err.response?.data?.error?.message ?? 'Could not save lesson.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lesson?')) return
    await deleteLesson(id)
    load()
  }

  return (
    <DashboardLayout role="SCHOOL_ADMIN" title="My Lessons">
      <SchoolApprovalGate>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 className="card-title" style={{ marginBottom: 0 }}>Surf Lessons</h2>
            <button type="button" className="btn btn-primary" onClick={openCreate}>+ Add Lesson</button>
          </div>

          {loading && <p>Loading...</p>}
          {!loading && lessons.length === 0 && <p className="empty-state">No lessons yet. Add your first surf lesson.</p>}

          {!loading && lessons.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Skill</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map((l) => (
                    <tr key={l.id}>
                      <td>{l.title}</td>
                      <td>{l.lessonType}</td>
                      <td>{l.skillLevel}</td>
                      <td>{l.locationName}</td>
                      <td>{l.currency} {Number(l.price).toFixed(2)}</td>
                      <td>
                        <span className={`status-badge status-${l.active ? 'active' : 'inactive'}`}>
                          {l.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button type="button" className="btn btn-secondary" onClick={() => openEdit(l)}>Edit</button>
                          <button type="button" className="btn btn-danger" onClick={() => handleDelete(l.id)}>Delete</button>
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
              <h2 className="card-title">{editing === 'new' ? 'Add Lesson' : 'Edit Lesson'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="title">Title</label>
                  <input id="title" className="form-input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="description">Description</label>
                  <textarea id="description" className="form-input" rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="lessonType">Lesson Type</label>
                    <select id="lessonType" className="form-select" value={form.lessonType} onChange={(e) => setForm((f) => ({ ...f, lessonType: e.target.value }))}>
                      <option value="GROUP">Group</option>
                      <option value="PRIVATE">Private</option>
                      <option value="SEMI_PRIVATE">Semi-Private</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="skillLevel">Skill Level</label>
                    <select id="skillLevel" className="form-select" value={form.skillLevel} onChange={(e) => setForm((f) => ({ ...f, skillLevel: e.target.value }))}>
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="locationId">Location</label>
                  <select id="locationId" className="form-select" value={form.locationId} onChange={(e) => setForm((f) => ({ ...f, locationId: e.target.value }))} required>
                    <option value="" disabled>Select a location</option>
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="durationMinutes">Duration (minutes)</label>
                    <input id="durationMinutes" type="number" min="15" className="form-input" value={form.durationMinutes} onChange={(e) => setForm((f) => ({ ...f, durationMinutes: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="maxParticipants">Max Participants</label>
                    <input id="maxParticipants" type="number" min="1" className="form-input" value={form.maxParticipants} onChange={(e) => setForm((f) => ({ ...f, maxParticipants: e.target.value }))} required />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="price">Price</label>
                    <input id="price" type="number" min="0" step="0.01" className="form-input" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="currency">Currency</label>
                    <select id="currency" className="form-select" value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}>
                      <option value="USD">USD</option>
                      <option value="LKR">LKR</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="includesEquipment">
                    <input id="includesEquipment" type="checkbox" checked={form.includesEquipment} onChange={(e) => setForm((f) => ({ ...f, includesEquipment: e.target.checked }))} style={{ marginRight: 8 }} />
                    Includes equipment
                  </label>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="active">
                    <input id="active" type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} style={{ marginRight: 8 }} />
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
      </SchoolApprovalGate>
    </DashboardLayout>
  )
}

export default SchoolLessons
