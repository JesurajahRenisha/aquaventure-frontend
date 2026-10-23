import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import SchoolApprovalGate from '../../components/SchoolApprovalGate'
import { useAuth } from '../../context/AuthContext'
import { listMyEquipment, createEquipment, updateEquipment, deleteEquipment } from '../../api/schoolAdminApi'

const EQUIPMENT_TYPES = ['SURFBOARD', 'SOFTBOARD', 'WETSUIT', 'LEASH', 'RASH_GUARD']

const EMPTY_FORM = { type: 'SURFBOARD', name: '', size: '', totalQuantity: '', rentalPricePerHour: '', rentalPricePerDay: '', available: true }

function SchoolEquipment() {
  const { user } = useAuth()
  const [equipment, setEquipment] = useState([])
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
    const page = await listMyEquipment()
    setEquipment(page.content ?? [])
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

  const openEdit = (item) => {
    setEditing(item.id)
    setForm({
      type: item.type,
      name: item.name,
      size: item.size ?? '',
      totalQuantity: item.totalQuantity,
      rentalPricePerHour: item.rentalPricePerHour,
      rentalPricePerDay: item.rentalPricePerDay,
      available: item.available,
    })
    setError('')
  }

  const closeModal = () => setEditing(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    const payload = {
      type: form.type,
      name: form.name,
      size: form.size || null,
      totalQuantity: Number(form.totalQuantity),
      rentalPricePerHour: Number(form.rentalPricePerHour),
      rentalPricePerDay: Number(form.rentalPricePerDay),
      available: form.available,
    }
    try {
      if (editing === 'new') {
        await createEquipment(payload)
      } else {
        await updateEquipment(editing, payload)
      }
      closeModal()
      load()
    } catch (err) {
      setError(err.response?.data?.error?.message ?? 'Could not save equipment.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this equipment?')) return
    await deleteEquipment(id)
    load()
  }

  return (
    <DashboardLayout role="SCHOOL_ADMIN" title="Equipment">
      <SchoolApprovalGate>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 className="card-title" style={{ marginBottom: 0 }}>My Equipment</h2>
            <button type="button" className="btn btn-primary" onClick={openCreate}>+ Add Equipment</button>
          </div>

          {loading && <p>Loading...</p>}
          {!loading && equipment.length === 0 && <p className="empty-state">No equipment added yet.</p>}

          {!loading && equipment.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Pricing</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map((e) => (
                    <tr key={e.id}>
                      <td>{e.name}</td>
                      <td>{e.type}</td>
                      <td>{e.totalQuantity}</td>
                      <td>${e.rentalPricePerHour}/hr &middot; ${e.rentalPricePerDay}/day</td>
                      <td>
                        <span className={`status-badge status-${e.available ? 'active' : 'inactive'}`}>
                          {e.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button type="button" className="btn btn-secondary" onClick={() => openEdit(e)}>Edit</button>
                          <button type="button" className="btn btn-danger" onClick={() => handleDelete(e.id)}>Remove</button>
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
            <div className="modal-box" onClick={(ev) => ev.stopPropagation()}>
              <h2 className="card-title">{editing === 'new' ? 'Add Equipment' : 'Edit Equipment'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="type">Type</label>
                  <select id="type" className="form-select" value={form.type} onChange={(ev) => setForm((f) => ({ ...f, type: ev.target.value }))}>
                    {EQUIPMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Item Name</label>
                  <input id="name" className="form-input" value={form.name} onChange={(ev) => setForm((f) => ({ ...f, name: ev.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="size">Size</label>
                  <input id="size" className="form-input" value={form.size} onChange={(ev) => setForm((f) => ({ ...f, size: ev.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="totalQuantity">Total Quantity</label>
                  <input id="totalQuantity" type="number" min="0" className="form-input" value={form.totalQuantity} onChange={(ev) => setForm((f) => ({ ...f, totalQuantity: ev.target.value }))} required />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="rentalPricePerHour">Price / Hour</label>
                    <input id="rentalPricePerHour" type="number" min="0" step="0.01" className="form-input" value={form.rentalPricePerHour} onChange={(ev) => setForm((f) => ({ ...f, rentalPricePerHour: ev.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="rentalPricePerDay">Price / Day</label>
                    <input id="rentalPricePerDay" type="number" min="0" step="0.01" className="form-input" value={form.rentalPricePerDay} onChange={(ev) => setForm((f) => ({ ...f, rentalPricePerDay: ev.target.value }))} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="available">
                    <input id="available" type="checkbox" checked={form.available} onChange={(ev) => setForm((f) => ({ ...f, available: ev.target.checked }))} style={{ marginRight: 8 }} />
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
      </SchoolApprovalGate>
    </DashboardLayout>
  )
}

export default SchoolEquipment
