import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { searchBookings, updateBookingStatus } from '../../api/bookingsApi'

const FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED']

function ProviderBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  const load = async () => {
    if (!user?.profileId) return
    setLoading(true)
    const list = await searchBookings({ providerId: user.profileId })
    setBookings(list.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)))
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleDecision = async (id, status) => {
    await updateBookingStatus(id, status)
    load()
  }

  const visible = filter === 'ALL' ? bookings : bookings.filter((b) => b.status === filter)

  return (
    <DashboardLayout role="PROVIDER" title="Bookings">
      <div className="card">
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={f === filter ? 'btn btn-primary' : 'btn btn-secondary'}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {loading && <p>Loading...</p>}
        {!loading && visible.length === 0 && <p className="empty-state">No bookings found.</p>}

        {!loading && visible.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tourist</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((b) => (
                  <tr key={b.bookingId}>
                    <td>{b.touristName}</td>
                    <td>{b.activityName}</td>
                    <td>{new Date(b.bookingDate).toLocaleString()}</td>
                    <td>${Number(b.price).toFixed(2)}</td>
                    <td>
                      <span className={`status-badge status-${b.paymentStatus.toLowerCase()}`}>{b.paymentStatus}</span>
                    </td>
                    <td>
                      <span className={`status-badge status-${b.status.toLowerCase()}`}>{b.status}</span>
                    </td>
                    <td>
                      {b.status === 'PENDING' && (
                        <div className="row-actions">
                          <button type="button" className="btn btn-primary" onClick={() => handleDecision(b.bookingId, 'CONFIRMED')}>Confirm</button>
                          <button type="button" className="btn btn-secondary" onClick={() => handleDecision(b.bookingId, 'CANCELLED')}>Decline</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ProviderBookings
