import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import apiClient from '../../api/apiClient'
import { searchBookings } from '../../api/bookingsApi'

function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiClient.get('/users').then((r) => r.data).catch(() => []),
      searchBookings(),
    ])
      .then(([userList, bookingList]) => {
        setUsers(userList)
        setBookings(bookingList)
      })
      .finally(() => setLoading(false))
  }, [])

  const providers = users.filter((u) => u.role === 'PROVIDER')
  const surfers = users.filter((u) => u.role === 'SURFER')

  return (
    <DashboardLayout role="ADMIN" title="Platform Overview">
      {loading && <p>Loading...</p>}
      {!loading && (
        <>
          <section className="grid-4" style={{ marginBottom: 24 }}>
            <div className="stat-box">
              <div className="stat-label">Total Users</div>
              <div className="stat-value">{users.length}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Surfers</div>
              <div className="stat-value">{surfers.length}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Providers</div>
              <div className="stat-value">{providers.length}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Total Bookings</div>
              <div className="stat-value">{bookings.length}</div>
            </div>
          </section>

          <div className="card">
            <h2 className="card-title">Recent Bookings (platform-wide)</h2>
            {bookings.length === 0 && <p className="empty-state">No bookings yet.</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {bookings
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 10)
                .map((b) => (
                  <div
                    key={b.bookingId}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: 12,
                      border: '1px solid var(--border-color)',
                      borderRadius: 8,
                    }}
                  >
                    <span>
                      {b.touristName} &middot; {b.activityName} ({b.providerBusinessName})
                    </span>
                    <span className={`status-badge status-${b.status.toLowerCase()}`}>{b.status}</span>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

export default AdminDashboard
