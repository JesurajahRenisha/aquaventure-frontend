import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import SchoolApprovalGate from '../../components/SchoolApprovalGate'
import { useAuth } from '../../context/AuthContext'
import { listMySlots, createSlot, updateSlot, deleteSlot, listMyLessons, listMyInstructors } from '../../api/schoolAdminApi'

const EMPTY_FORM = { lessonId: '', instructorId: '', date: '', startTime: '', endTime: '', capacity: '' }

function SchoolSlots() {
  const { user } = useAuth()
  const [slots, setSlots] = useState([])
  const [lessons, setLessons] = useState([])
  const [instructors, setInstructors] = useState([])
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
    const [slotPage, lessonPage, instructorPage] = await Promise.all([
      listMySlots(),
      listMyLessons(),
      listMyInstructors(),
    ])
    setSlots((slotPage.content ?? []).sort((a, b) => new Date(a.startTime) - new Date(b.startTime)))
    setLessons(lessonPage.content ?? [])
    setInstructors(instructorPage.content ?? [])
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

  const openEdit = (slot) => {
    setEditing(slot.id)
    setForm({
      lessonId: slot.lessonId,
      instructorId: slot.instructorId,
      date: slot.startTime.slice(0, 10),
      startTime: slot.startTime.slice(11, 16),
      endTime: slot.endTime.slice(11, 16),
      capacity: slot.capacity,
    })
    setError('')
  }

  const closeModal = () => setEditing(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    const lesson = lessons.find((l) => String(l.id) === String(form.lessonId))
    if (!lesson) {
      setError('Select a lesson.')
      return
    }
    const payload = {
      lessonId: Number(form.lessonId),
      instructorId: Number(form.instructorId),
      locationId: lesson.locationId,
      startTime: `${form.date}T${form.startTime}:00Z`,
      endTime: `${form.date}T${form.endTime}:00Z`,
      capacity: Number(form.capacity),
    }
    try {
      if (editing === 'new') {
        await createSlot(payload)
      } else {
        await updateSlot(editing, payload)
      }
      closeModal()
      load()
    } catch (err) {
      setError(err.response?.data?.error?.message ?? 'Could not save slot.')
    }
  }

  const handleDelete = async (slot) => {
    if (slot.bookedCount > 0) return
    if (!window.confirm('Delete this slot?')) return
    await deleteSlot(slot.id)
    load()
  }

  return (
    <DashboardLayout role="SCHOOL_ADMIN" title="Lesson Slots">
      <SchoolApprovalGate>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 className="card-title" style={{ marginBottom: 0 }}>Bookable Time Slots</h2>
            <button type="button" className="btn btn-primary" onClick={openCreate} disabled={lessons.length === 0 || instructors.length === 0}>
              + Add Slot
            </button>
          </div>
          {(lessons.length === 0 || instructors.length === 0) && (
            <p className="empty-state">Add a lesson and an instructor before publishing slots.</p>
          )}

          {loading && <p>Loading...</p>}
          {!loading && slots.length === 0 && lessons.length > 0 && <p className="empty-state">No slots published yet.</p>}

          {!loading && slots.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Lesson</th>
                    <th>Instructor</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Booked / Capacity</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((s) => (
                    <tr key={s.id}>
                      <td>{s.lessonTitle}</td>
                      <td>{s.instructorName}</td>
                      <td>{new Date(s.startTime).toLocaleString()}</td>
                      <td>{new Date(s.endTime).toLocaleString()}</td>
                      <td>{s.bookedCount} / {s.capacity}</td>
                      <td>
                        <span className={`status-badge status-${s.status === 'OPEN' ? 'active' : 'inactive'}`}>{s.status}</span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button type="button" className="btn btn-secondary" onClick={() => openEdit(s)}>Edit</button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            disabled={s.bookedCount > 0}
                            title={s.bookedCount > 0 ? 'Cannot delete a slot with bookings' : ''}
                            onClick={() => handleDelete(s)}
                          >
                            Delete
                          </button>
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
              <h2 className="card-title">{editing === 'new' ? 'Add Slot' : 'Edit Slot'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="lessonId">Lesson</label>
                  <select id="lessonId" className="form-select" value={form.lessonId} onChange={(e) => setForm((f) => ({ ...f, lessonId: e.target.value }))} required>
                    <option value="" disabled>Select a lesson</option>
                    {lessons.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="instructorId">Instructor</label>
                  <select id="instructorId" className="form-select" value={form.instructorId} onChange={(e) => setForm((f) => ({ ...f, instructorId: e.target.value }))} required>
                    <option value="" disabled>Select an instructor</option>
                    {instructors.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="date">Date</label>
                  <input id="date" type="date" className="form-input" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="startTime">Start Time (UTC)</label>
                    <input id="startTime" type="time" className="form-input" value={form.startTime} onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="endTime">End Time (UTC)</label>
                    <input id="endTime" type="time" className="form-input" value={form.endTime} onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="capacity">Capacity</label>
                  <input id="capacity" type="number" min="1" className="form-input" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} required />
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

export default SchoolSlots
