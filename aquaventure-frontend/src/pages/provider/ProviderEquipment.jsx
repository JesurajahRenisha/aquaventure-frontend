import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import {
  listEquipmentForProvider,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from '../../api/profileApi'

const EMPTY_FORM = { equipmentName: '', quantity: '', availability: true }

function ProviderEquipment() {
  const { user } = useAuth()
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  const load = async () => {
    if (!user?.profileId) return
    setLoading(true)
    const list = await listEquipmentForProvider(user.profileId)
    setEquipment(list)
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

  const openEdit = (item) => {
    setEditing(item.equipmentId)
    setForm({
      equipmentName: item.equipmentName,
      quantity: item.quantity,
      availability: item.availability,
    })
    setError('')
  }

  const closeModal = () => setEditing(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    const payload = {
      equipmentName: form.equipmentName,
      quantity: Number(form.quantity),
      availability: form.availability,
    }
    try {
      if (editing === 'new') {
        await createEquipment({ ...payload, providerId: user.profileId })
      } else {
        await updateEquipment(editing, payload)
      }
      closeModal()
      load()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Could not save equipment.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this equipment?')) return
    await deleteEquipment(id)
    load()
  }

  return (
    <DashboardLayout role="PROVIDER" title="Equipment">
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
                  <th>Quantity</th>
                  <th>Availability</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((e) => (
                  <tr key={e.equipmentId}>
                    <td>{e.equipmentName}</td>
                    <td>{e.quantity}</td>
                    <td>
                      <span className={`status-badge status-${e.availability ? 'active' : 'inactive'}`}>
                        {e.availability ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => openEdit(e)}>Edit</button>
                        <button type="button" className="btn btn-danger" onClick={() => handleDelete(e.equipmentId)}>Remove</button>
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
                <label className="form-label" htmlFor="equipmentName">Item Name</label>
                <input
                  id="equipmentName"
                  className="form-input"
                  value={form.equipmentName}
                  onChange={(ev) => setForm((f) => ({ ...f, equipmentName: ev.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="quantity">Quantity</label>
                <input
                  id="quantity"
                  type="number"
                  min="0"
                  className="form-input"
                  value={form.quantity}
                  onChange={(ev) => setForm((f) => ({ ...f, quantity: ev.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="availability">
                  <input
                    id="availability"
                    type="checkbox"
                    checked={form.availability}
                    onChange={(ev) => setForm((f) => ({ ...f, availability: ev.target.checked }))}
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

export default ProviderEquipment
