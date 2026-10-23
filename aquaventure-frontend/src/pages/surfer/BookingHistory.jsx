import { useEffect, useState } from 'react'
import SurferLayout from '../../layouts/SurferLayout'
import { getMyBookings, cancelBooking } from '../../api/surferApi'

const CANCELLABLE = ['PENDING', 'ACCEPTED']

function BookingHistory() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () =>
    getMyBookings()
      .then((page) => (page.content ?? []).sort((a, b) => new Date(b.slotStartTime) - new Date(a.slotStartTime)))
      .then(setBookings)
      .finally(() => setLoading(false))

  useEffect(() => {
    load()
  }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    await cancelBooking(id)
    load()
  }

  return (
    <SurferLayout title="Booking History">
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading && <p style={{ padding: 24 }}>Loading...</p>}
        {!loading && bookings.length === 0 && <p className="empty-state">You have no bookings yet.</p>}
        {!loading && bookings.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Lesson</th>
                <th>School</th>
                <th>Date</th>
                <th>Price</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.lessonTitle}</td>
                  <td>{b.schoolName}</td>
                  <td>{new Date(b.slotStartTime).toLocaleString()}</td>
                  <td>{b.currency} {b.totalPrice}</td>
                  <td>
                    <span className={`status-badge status-${b.status.toLowerCase()}`}>{b.status}</span>
                  </td>
                  <td>
                    {CANCELLABLE.includes(b.status) && (
                      <button type="button" className="btn btn-danger" onClick={() => handleCancel(b.id)}>Cancel</button>
                    )}
                    {b.status === 'COMPLETED' && (
                      <a href="/surfer/progress" className="btn btn-secondary">Progress</a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </SurferLayout>
  )
}

export default BookingHistory
