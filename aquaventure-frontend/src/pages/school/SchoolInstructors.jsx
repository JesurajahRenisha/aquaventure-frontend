import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import SchoolApprovalGate from '../../components/SchoolApprovalGate'
import { useAuth } from '../../context/AuthContext'
import { listMyInstructors, createInstructor, updateInstructor, deleteInstructor } from '../../api/schoolAdminApi'

const EMPTY_FORM = { name: '', bio: '', experienceYears: '', certifications: '', languages: '', skillLevelsTaught: [], active: true }

function SchoolInstructors() {
  const { user } = useAuth()
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
    const page = await listMyInstructors()
    setInstructors(page.content ?? [])
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

  const openEdit = (instructor) => {
    setEditing(instructor.id)
    setForm({
      name: instructor.name,
      bio: instructor.bio ?? '',
      experienceYears: instructor.experienceYears ?? '',
      certifications: (instructor.certifications ?? []).join(', '),
      languages: (instructor.languages ?? []).join(', '),
      skillLevelsTaught: instructor.skillLevelsTaught ?? [],
      active: instructor.active,
    })
    setError('')
  }

  const closeModal = () => setEditing(null)

  const toggleSkill = (level) => {
    setForm((f) => ({
      ...f,
      skillLevelsTaught: f.skillLevelsTaught.includes(level)
        ? f.skillLevelsTaught.filter((x) => x !== level)
        : [...f.skillLevelsTaught, level],
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    const payload = {
      name: form.name,
      bio: form.bio || null,
      experienceYears: form.experienceYears === '' ? null : Number(form.experienceYears),
      certifications: form.certifications.split(',').map((s) => s.trim()).filter(Boolean),
      languages: form.languages.split(',').map((s) => s.trim()).filter(Boolean),
      skillLevelsTaught: form.skillLevelsTaught,
      active: form.active,
    }
    try {
      if (editing === 'new') {
        await createInstructor(payload)
      } else {
        await updateInstructor(editing, payload)
      }
      closeModal()
      load()
    } catch (err) {
      setError(err.response?.data?.error?.message ?? 'Could not save instructor.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this instructor?')) return
    await deleteInstructor(id)
    load()
  }

  return (
    <DashboardLayout role="SCHOOL_ADMIN" title="Instructors">
      <SchoolApprovalGate>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 className="card-title" style={{ marginBottom: 0 }}>My Instructors</h2>
            <button type="button" className="btn btn-primary" onClick={openCreate}>+ Add Instructor</button>
          </div>

          {loading && <p>Loading...</p>}
          {!loading && instructors.length === 0 && <p className="empty-state">No instructors added yet.</p>}

          {!loading && instructors.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Experience</th>
                    <th>Skill Levels</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {instructors.map((i) => (
                    <tr key={i.id}>
                      <td>{i.name}</td>
                      <td>{i.experienceYears ?? '-'} yrs</td>
                      <td>{(i.skillLevelsTaught ?? []).join(', ')}</td>
                      <td>
                        <span className={`status-badge status-${i.active ? 'active' : 'inactive'}`}>
                          {i.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button type="button" className="btn btn-secondary" onClick={() => openEdit(i)}>Edit</button>
                          <button type="button" className="btn btn-danger" onClick={() => handleDelete(i.id)}>Remove</button>
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
              <h2 className="card-title">{editing === 'new' ? 'Add Instructor' : 'Edit Instructor'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Name</label>
                  <input id="name" className="form-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="bio">Bio</label>
                  <textarea id="bio" className="form-input" rows={2} value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="experienceYears">Experience (years)</label>
                  <input id="experienceYears" type="number" min="0" className="form-input" value={form.experienceYears} onChange={(e) => setForm((f) => ({ ...f, experienceYears: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="certifications">Certifications (comma-separated)</label>
                  <input id="certifications" className="form-input" value={form.certifications} onChange={(e) => setForm((f) => ({ ...f, certifications: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="languages">Languages (comma-separated)</label>
                  <input id="languages" className="form-input" value={form.languages} onChange={(e) => setForm((f) => ({ ...f, languages: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Skill Levels Taught</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        className={form.skillLevelsTaught.includes(level) ? 'btn btn-primary' : 'btn btn-secondary'}
                        onClick={() => toggleSkill(level)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="active">
                    <input id="active" type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} style={{ marginRight: 8 }} />
                    Currently active
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

export default SchoolInstructors
