import { useEffect, useState } from 'react'
import SurferLayout from '../../layouts/SurferLayout'
import { getMyProgress, createProgress, updateProgress, deleteProgress, getProgressSummary } from '../../api/surferApi'
import { listLocations } from '../../api/locationsApi'

const EMPTY_FORM = { date: '', locationId: '', skillFocus: '', durationMinutes: '', selfRating: 3, notes: '' }

function toDateInput(iso) {
  return iso ? iso.slice(0, 10) : ''
}

function SurfProgress() {
  const [entries, setEntries] = useState([])
  const [summary, setSummary] = useState(null)
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    const [page, summaryData, locs] = await Promise.all([getMyProgress(), getProgressSummary(), listLocations()])
    setEntries((page.content ?? []).sort((a, b) => new Date(b.date) - new Date(a.date)))
    setSummary(summaryData)
    setLocations(locs)
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

  const openEdit = (entry) => {
    setEditing(entry.id)
    setForm({
      date: toDateInput(entry.date),
      locationId: entry.locationId ?? '',
      skillFocus: entry.skillFocus ?? '',
      durationMinutes: entry.durationMinutes ?? '',
      selfRating: entry.selfRating ?? 3,
      notes: entry.notes ?? '',
    })
    setError('')
  }

  const closeModal = () => setEditing(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    const payload = {
      date: form.date ? `${form.date}T00:00:00Z` : null,
      locationId: form.locationId ? Number(form.locationId) : null,
      skillFocus: form.skillFocus || null,
      durationMinutes: form.durationMinutes === '' ? null : Number(form.durationMinutes),
      selfRating: form.selfRating === '' ? null : Number(form.selfRating),
      notes: form.notes || null,
    }
    try {
      if (editing === 'new') {
        await createProgress(payload)
      } else {
        await updateProgress(editing, payload)
      }
      closeModal()
      load()
    } catch (err) {
      setError(err.response?.data?.error?.message ?? 'Could not save this entry.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this progress entry?')) return
    await deleteProgress(id)
    load()
  }

  return (
    <SurferLayout title="Surf Progress Tracker">
      {summary && (
        <section className="grid-4" style={{ marginBottom: 24 }}>
          <div className="stat-box">
            <div className="stat-label">Total Lessons</div>
            <div className="stat-value">{summary.totalLessons}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Hours in Water</div>
            <div className="stat-value">{summary.totalHoursInWater}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Current Level</div>
            <div className="stat-value">{summary.currentSkillLevel}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Top Location</div>
            <div className="stat-value" style={{ fontSize: 16 }}>
              {Object.keys(summary.sessionsPerLocation ?? {})[0] ?? '--'}
            </div>
          </div>
        </section>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className="card-title" style={{ marginBottom: 0 }}>Progress Log</h2>
          <button type="button" className="btn btn-primary" onClick={openCreate}>+ Log a Session</button>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
          A draft entry is created automatically whenever a school completes one of your bookings — fill it in below.
        </p>
        {loading && <p>Loading...</p>}
        {!loading && entries.length === 0 && <p className="empty-state">No progress entries yet.</p>}
        {!loading && entries.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {entries.map((entry) => (
              <div key={entry.id} className="stat-box" style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{new Date(entry.date).toLocaleDateString()}</strong>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {entry.draft && <span className="status-badge status-pending">Draft</span>}
                    {entry.selfRating && <span className="status-badge status-confirmed">Rating {entry.selfRating}/5</span>}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>
                  {entry.locationName ?? 'Location not set'} &middot; {entry.skillFocus ?? 'No focus set'}
                  {entry.durationMinutes ? ` · ${entry.durationMinutes} min` : ''}
                </p>
                {entry.notes && <p style={{ marginTop: 6 }}>{entry.notes}</p>}
                {entry.instructorFeedback && (
                  <p style={{ marginTop: 6, fontStyle: 'italic', color: 'var(--primary-blue)' }}>
                    Instructor feedback: {entry.instructorFeedback}
                  </p>
                )}
                <div className="row-actions" style={{ marginTop: 10 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => openEdit(entry)}>
                    {entry.draft ? 'Fill In' : 'Edit'}
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => handleDelete(entry.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="card-title">{editing === 'new' ? 'Log a Session' : 'Fill In Progress Entry'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="date">Date</label>
                <input id="date" type="date" className="form-input" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="locationId">Location</label>
                <select id="locationId" className="form-select" value={form.locationId} onChange={(e) => setForm((f) => ({ ...f, locationId: e.target.value }))}>
                  <option value="">Not set</option>
                  {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="skillFocus">Skill Focus</label>
                <input id="skillFocus" className="form-input" value={form.skillFocus} onChange={(e) => setForm((f) => ({ ...f, skillFocus: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="durationMinutes">Duration (minutes)</label>
                <input id="durationMinutes" type="number" className="form-input" value={form.durationMinutes} onChange={(e) => setForm((f) => ({ ...f, durationMinutes: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="selfRating">Self Rating (1-5)</label>
                <input id="selfRating" type="number" min="1" max="5" className="form-input" value={form.selfRating} onChange={(e) => setForm((f) => ({ ...f, selfRating: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="notes">Notes</label>
                <textarea id="notes" className="form-input" rows={3} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
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
    </SurferLayout>
  )
}

export default SurfProgress
