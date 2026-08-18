import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import {
  listInstructorsForProvider,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from '../../api/profileApi'

const EMPTY_FORM = { name: '', certification: '', experience: '', availability: true }

function ProviderInstructors() {
  const { user } = useAuth()
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  const load = async () => {
    if (!user?.profileId) return
    setLoading(true)
    const list = await listInstructorsForProvider(user.profileId)
    setInstructors(list)
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

  const openEdit = (instructor) => {
    setEditing(instructor.instructorId)
    setForm({
      name: instructor.name,
      certification: instructor.certification ?? '',
      experience: instructor.experience ?? '',
      availability: instructor.availability,
    })
    setError('')
  }

  const closeModal = () => setEditing(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      if (editing === 'new') {
        await createInstructor({ ...form, providerId: user.profileId })
      } else {
        await updateInstructor(editing, form)
      }
      closeModal()
      load()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Could not save instructor.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this instructor?')) return
    await deleteInstructor(id)
    load()
  }

  return (
    <DashboardLayout role="PROVIDER" title="Instructors">
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
                  <th>Certification</th>
                  <th>Experience</th>
                  <th>Availability</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {instructors.map((i) => (
                  <tr key={i.instructorId}>
                    <td>{i.name}</td>
                    <td>{i.certification || '-'}</td>
                    <td>{i.experience || '-'}</td>
                    <td>
                      <span className={`status-badge status-${i.availability ? 'active' : 'inactive'}`}>
                        {i.availability ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => openEdit(i)}>Edit</button>
                        <button type="button" className="btn btn-danger" onClick={() => handleDelete(i.instructorId)}>Remove</button>
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
                <input
                  id="name"
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="certification">Certification</label>
                <input
                  id="certification"
                  className="form-input"
                  value={form.certification}
                  onChange={(e) => setForm((f) => ({ ...f, certification: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="experience">Experience</label>
                <input
                  id="experience"
                  className="form-input"
                  value={form.experience}
                  onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="availability">
                  <input
                    id="availability"
                    type="checkbox"
                    checked={form.availability}
                    onChange={(e) => setForm((f) => ({ ...f, availability: e.target.checked }))}
                    style={{ marginRight: 8 }}
                  />
                  Currently available
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

export default ProviderInstructors
