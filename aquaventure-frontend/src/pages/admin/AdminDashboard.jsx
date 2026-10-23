import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { getStats } from '../../api/adminApi'

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStats().then(setStats).finally(() => setLoading(false))
  }, [])

  const totalUsers = stats ? Object.values(stats.usersByRole ?? {}).reduce((a, b) => a + b, 0) : 0
  const totalBookings = stats ? Object.values(stats.bookingsByStatus ?? {}).reduce((a, b) => a + b, 0) : 0

  return (
    <DashboardLayout role="PLATFORM_ADMIN" title="Platform Overview">
      {loading && <p>Loading...</p>}
      {!loading && stats && (
        <>
          <section className="grid-4" style={{ marginBottom: 24 }}>
            <div className="stat-box">
              <div className="stat-label">Total Users</div>
              <div className="stat-value">{totalUsers}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Schools Pending</div>
              <div className="stat-value">{stats.schoolsByStatus?.PENDING ?? 0}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Schools Approved</div>
              <div className="stat-value">{stats.schoolsByStatus?.APPROVED ?? 0}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Total Bookings</div>
              <div className="stat-value">{totalBookings}</div>
            </div>
          </section>

          <div className="grid-2">
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h2 className="card-title" style={{ marginBottom: 0 }}>Users by Role</h2>
              </div>
              {Object.entries(stats.usersByRole ?? {}).map(([role, count]) => (
                <div key={role} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span>{role}</span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h2 className="card-title" style={{ marginBottom: 0 }}>Bookings by Status</h2>
              </div>
              {Object.entries(stats.bookingsByStatus ?? {}).map(([status, count]) => (
                <div key={status} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 className="card-title" style={{ marginBottom: 0 }}>Bookings by Location</h2>
            </div>
            {Object.entries(stats.bookingsByLocation ?? {}).map(([location, count]) => (
              <div key={location} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>{location}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>

          {stats.schoolsByStatus?.PENDING > 0 && (
            <div className="card" style={{ marginTop: 24, borderLeft: '4px solid var(--accent-orange)' }}>
              <strong>{stats.schoolsByStatus.PENDING} school(s) awaiting review.</strong>{' '}
              <Link to="/admin/schools" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>Go to review queue →</Link>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  )
}

export default AdminDashboard
