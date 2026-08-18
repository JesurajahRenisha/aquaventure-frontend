import { useEffect, useState } from 'react'
import SurferLayout from '../../layouts/SurferLayout'
import { useAuth } from '../../context/AuthContext'
import { searchBookings } from '../../api/bookingsApi'

function BookingHistory() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.profileId) return
    searchBookings({ touristId: user.profileId })
      .then((data) => data.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)))
      .then(setBookings)
      .finally(() => setLoading(false))
  }, [user])

  return (
    <SurferLayout title="Booking History">
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading && <p style={{ padding: 24 }}>Loading...</p>}
        {!loading && bookings.length === 0 && <p className="empty-state">You have no bookings yet.</p>}
        {!loading && bookings.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
                <th style={th}>Activity</th>
                <th style={th}>Provider</th>
                <th style={th}>Date</th>
                <th style={th}>Price</th>
                <th style={th}>Status</th>
                <th style={th}>Payment</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.bookingId} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td style={td}>{b.activityName}</td>
                  <td style={td}>{b.providerBusinessName}</td>
                  <td style={td}>{new Date(b.bookingDate).toLocaleString()}</td>
                  <td style={td}>${b.price}</td>
                  <td style={td}>
                    <span className={`status-badge status-${b.status.toLowerCase()}`}>{b.status}</span>
                  </td>
                  <td style={td}>
                    <span className={`status-badge status-${b.paymentStatus.toLowerCase()}`}>{b.paymentStatus}</span>
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

const th = { padding: '14px 20px', textAlign: 'left', fontSize: 12, textTransform: 'uppercase', color: 'var(--text-secondary)' }
const td = { padding: '14px 20px', fontSize: 14 }

export default BookingHistory
