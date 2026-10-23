import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { listSchools, getSchool, approveSchool, rejectSchool, suspendSchool, reactivateSchool } from '../../api/adminApi'
import { getSchoolDocument } from '../../api/schoolsApi'

const STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED']

function AdminSchools() {
  const [status, setStatus] = useState('PENDING')
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState(null)
  const [rejecting, setRejecting] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    const page = await listSchools({ status })
    setSchools(page.content ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const openDetail = async (id) => {
    setError('')
    const data = await getSchool(id)
    setDetail(data)
  }

  const closeDetail = () => {
    setDetail(null)
    setRejecting(false)
    setRejectReason('')
  }

  const handleApprove = async () => {
    await approveSchool(detail.id)
    closeDetail()
    load()
  }

  const submitReject = async (event) => {
    event.preventDefault()
    try {
      await rejectSchool(detail.id, rejectReason)
      closeDetail()
      load()
    } catch (err) {
      setError(err.response?.data?.error?.message ?? 'Could not reject school.')
    }
  }

  const handleSuspend = async () => {
    await suspendSchool(detail.id)
    closeDetail()
    load()
  }

  const handleReactivate = async () => {
    await reactivateSchool(detail.id)
    closeDetail()
    load()
  }

  const viewDocument = async (index) => {
    try {
      const blob = await getSchoolDocument(detail.id, index)
      window.open(URL.createObjectURL(blob), '_blank')
    } catch {
      setError('Could not load that document.')
    }
  }

  return (
    <DashboardLayout role="PLATFORM_ADMIN" title="Surf Schools">
      <div className="card">
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {STATUSES.map((s) => (
            <button key={s} type="button" className={s === status ? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => setStatus(s)}>
              {s}
            </button>
          ))}
        </div>

        {loading && <p>Loading...</p>}
        {!loading && schools.length === 0 && <p className="empty-state">No schools with this status.</p>}

        {!loading && schools.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Owner</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {schools.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.ownerEmail}</td>
                    <td>{s.address || '-'}</td>
                    <td>
                      <span className={`status-badge status-${s.status.toLowerCase()}`}>{s.status}</span>
                    </td>
                    <td>
                      <button type="button" className="btn btn-secondary" onClick={() => openDetail(s.id)}>Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {detail && (
        <div className="modal-overlay" onClick={closeDetail}>
          <div className="modal-box" style={{ width: 560 }} onClick={(e) => e.stopPropagation()}>
            <h2 className="card-title">{detail.name}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>Owner: {detail.ownerEmail}</p>
            <p style={{ marginBottom: 8 }}>Business Reg. #: {detail.businessRegistrationNumber}</p>
            {detail.description && <p style={{ marginBottom: 8 }}>{detail.description}</p>}
            {detail.address && <p style={{ marginBottom: 8, fontSize: 13, color: 'var(--text-secondary)' }}>{detail.address}</p>}
            <span className={`status-badge status-${detail.status.toLowerCase()}`}>{detail.status}</span>
            {detail.rejectionReason && <p style={{ marginTop: 8, color: '#ef4444' }}>Rejection reason: {detail.rejectionReason}</p>}

            {(detail.verificationDocumentUrls ?? []).length > 0 && (
              <div style={{ marginTop: 16 }}>
                <strong>Verification Documents</strong>
                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  {detail.verificationDocumentUrls.map((_, index) => (
                    <button key={index} type="button" className="btn btn-secondary" onClick={() => viewDocument(index)}>
                      Document {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && <p className="error-text">{error}</p>}

            {!rejecting ? (
              <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
                {detail.status === 'PENDING' && (
                  <>
                    <button type="button" className="btn btn-primary" onClick={handleApprove}>Approve</button>
                    <button type="button" className="btn btn-danger" onClick={() => setRejecting(true)}>Reject</button>
                  </>
                )}
                {detail.status === 'APPROVED' && (
                  <button type="button" className="btn btn-danger" onClick={handleSuspend}>Suspend</button>
                )}
                {detail.status === 'SUSPENDED' && (
                  <button type="button" className="btn btn-primary" onClick={handleReactivate}>Reactivate</button>
                )}
                <button type="button" className="btn btn-secondary" onClick={closeDetail}>Close</button>
              </div>
            ) : (
              <form onSubmit={submitReject} style={{ marginTop: 16 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="rejectReason">Rejection Reason</label>
                  <textarea id="rejectReason" className="form-input" rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} required />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" className="btn btn-danger">Confirm Rejection</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setRejecting(false)}>Back</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default AdminSchools
