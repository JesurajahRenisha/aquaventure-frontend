import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { searchBookings } from '../../api/bookingsApi'

const FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED']

function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    searchBookings()
      .then((list) => setBookings(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))))
      .finally(() => setLoading(false))
  }, [])

  const visible = filter === 'ALL' ? bookings : bookings.filter((b) => b.status === filter)
  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === 'PAID')
    .reduce((sum, b) => sum + Number(b.price), 0)

  return (
    <DashboardLayout role="ADMIN" title="Bookings Ledger">
      <section className="grid-3" style={{ marginBottom: 24 }}>
        <div className="stat-box">
          <div className="stat-label">Total Bookings</div>
          <div className="stat-value">{bookings.length}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Pending</div>
          <div className="stat-value">{bookings.filter((b) => b.status === 'PENDING').length}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Platform Revenue (paid)</div>
          <div className="stat-value">${totalRevenue.toFixed(0)}</div>
        </div>
      </section>

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
                  <th>Provider</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((b) => (
                  <tr key={b.bookingId}>
                    <td>{b.touristName}</td>
                    <td>{b.activityName}</td>
                    <td>{b.providerBusinessName}</td>
                    <td>{new Date(b.bookingDate).toLocaleString()}</td>
                    <td>${Number(b.price).toFixed(2)}</td>
                    <td>
                      <span className={`status-badge status-${b.paymentStatus.toLowerCase()}`}>{b.paymentStatus}</span>
                    </td>
                    <td>
                      <span className={`status-badge status-${b.status.toLowerCase()}`}>{b.status}</span>
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

export default AdminBookings
