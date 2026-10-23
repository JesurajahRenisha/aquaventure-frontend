import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import SchoolApprovalGate from '../../components/SchoolApprovalGate'
import { useAuth } from '../../context/AuthContext'
import { getMyBookings, acceptBooking, rejectBooking, completeBooking, giveProgressFeedback } from '../../api/schoolAdminApi'

const FILTERS = ['ALL', 'PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED']

function SchoolBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [rejecting, setRejecting] = useState(null)
  const [rejectNote, setRejectNote] = useState('')
  const [feedbackFor, setFeedbackFor] = useState(null)
  const [feedbackForm, setFeedbackForm] = useState({ progressId: '', feedback: '' })
  const [error, setError] = useState('')

  const load = async () => {
    if (user?.schoolStatus !== 'APPROVED') {
      setLoading(false)
      return
    }
    setLoading(true)
    const params = filter === 'ALL' ? {} : { status: filter }
    const page = await getMyBookings(params)
    setBookings((page.content ?? []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.schoolStatus, filter])

  const handleAccept = async (id) => {
    setError('')
    try {
      await acceptBooking(id)
      load()
    } catch (err) {
      setError(err.response?.data?.error?.message ?? 'Could not accept booking.')
    }
  }

  const handleComplete = async (id) => {
    setError('')
    try {
      await completeBooking(id)
      load()
    } catch (err) {
      setError(err.response?.data?.error?.message ?? 'Could not complete booking.')
    }
  }

  const submitReject = async (event) => {
    event.preventDefault()
    try {
      await rejectBooking(rejecting, rejectNote)
      setRejecting(null)
      setRejectNote('')
      load()
    } catch (err) {
      setError(err.response?.data?.error?.message ?? 'Could not reject booking.')
    }
  }

  const submitFeedback = async (event) => {
    event.preventDefault()
    try {
      await giveProgressFeedback(feedbackForm.progressId, feedbackForm.feedback)
      setFeedbackFor(null)
      setFeedbackForm({ progressId: '', feedback: '' })
    } catch (err) {
      setError(err.response?.data?.error?.message ?? 'Could not save feedback. Double-check the progress entry ID.')
    }
  }

  return (
    <DashboardLayout role="SCHOOL_ADMIN" title="Bookings">
      <SchoolApprovalGate>
        <div className="card">
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={f === filter ? 'btn btn-primary' : 'btn btn-secondary'}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {error && <p className="error-text">{error}</p>}
          {loading && <p>Loading...</p>}
          {!loading && bookings.length === 0 && <p className="empty-state">No bookings found.</p>}

          {!loading && bookings.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Lesson</th>
                    <th>Date</th>
                    <th>Participants</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.lessonTitle}</td>
                      <td>{new Date(b.slotStartTime).toLocaleString()}</td>
                      <td>{b.participants}</td>
                      <td>{b.currency} {b.totalPrice}</td>
                      <td>
                        <span className={`status-badge status-${b.status.toLowerCase()}`}>{b.status}</span>
                      </td>
                      <td>
                        <div className="row-actions">
                          {b.status === 'PENDING' && (
                            <>
                              <button type="button" className="btn btn-primary" onClick={() => handleAccept(b.id)}>Accept</button>
                              <button type="button" className="btn btn-danger" onClick={() => setRejecting(b.id)}>Reject</button>
                            </>
                          )}
                          {b.status === 'ACCEPTED' && (
                            <button type="button" className="btn btn-primary" onClick={() => handleComplete(b.id)}>Complete</button>
                          )}
                          {b.status === 'COMPLETED' && (
                            <button type="button" className="btn btn-secondary" onClick={() => setFeedbackFor(b.id)}>Give Feedback</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {rejecting && (
          <div className="modal-overlay" onClick={() => setRejecting(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h2 className="card-title">Reject Booking</h2>
              <form onSubmit={submitReject}>
                <div className="form-group">
                  <label className="form-label" htmlFor="rejectNote">Reason for the surfer</label>
                  <textarea id="rejectNote" className="form-input" rows={3} value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} required />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" className="btn btn-danger">Reject Booking</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setRejecting(null)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {feedbackFor && (
          <div className="modal-overlay" onClick={() => setFeedbackFor(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h2 className="card-title">Give Progress Feedback</h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
                The API doesn&apos;t yet expose a lookup from booking to progress entry — ask the surfer for their
                progress entry ID (visible on their Progress page) or check it in the database.
              </p>
              <form onSubmit={submitFeedback}>
                <div className="form-group">
                  <label className="form-label" htmlFor="progressId">Progress Entry ID</label>
                  <input
                    id="progressId"
                    type="number"
                    className="form-input"
                    value={feedbackForm.progressId}
                    onChange={(e) => setFeedbackForm((f) => ({ ...f, progressId: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="feedback">Feedback</label>
                  <textarea
                    id="feedback"
                    className="form-input"
                    rows={3}
                    value={feedbackForm.feedback}
                    onChange={(e) => setFeedbackForm((f) => ({ ...f, feedback: e.target.value }))}
                    required
                  />
                </div>
                {error && <p className="error-text">{error}</p>}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" className="btn btn-primary">Save Feedback</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setFeedbackFor(null)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </SchoolApprovalGate>
    </DashboardLayout>
  )
}

export default SchoolBookings
