import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import SchoolApprovalGate from '../../components/SchoolApprovalGate'
import { useAuth } from '../../context/AuthContext'
import { getDashboard } from '../../api/schoolAdminApi'

function SchoolDashboard() {
  const { user } = useAuth()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    if (user?.schoolStatus !== 'APPROVED') {
      setLoading(false)
      return
    }
    getDashboard()
      .then(setDashboard)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.schoolStatus])

  return (
    <DashboardLayout role="SCHOOL_ADMIN" title={`Welcome back, ${user?.firstname ?? 'Team'}!`}>
      <SchoolApprovalGate>
        {loading && <p>Loading...</p>}
        {!loading && dashboard && (
          <>
            <section className="grid-4" style={{ marginBottom: 24 }}>
              <div className="stat-box">
                <div className="stat-label">Pending Requests</div>
                <div className="stat-value">{dashboard.pendingBookingsCount}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Completed Bookings</div>
                <div className="stat-value">{dashboard.revenue?.completedBookingsCount ?? 0}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Revenue This Month</div>
                <div className="stat-value">${dashboard.revenue?.revenueThisMonth?.toFixed(0) ?? 0}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Total Revenue</div>
                <div className="stat-value">${dashboard.revenue?.totalRevenue?.toFixed(0) ?? 0}</div>
              </div>
            </section>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 className="card-title" style={{ marginBottom: 0 }}>Upcoming Open Slots</h2>
                <Link to="/school/bookings" style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary-blue)' }}>
                  View Bookings
                </Link>
              </div>

              {(dashboard.upcomingLessons ?? []).length === 0 && <p className="empty-state">No upcoming slots.</p>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(dashboard.upcomingLessons ?? []).map((slot) => (
                  <div
                    key={slot.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 14,
                      border: '1px solid var(--border-color)',
                      borderRadius: 8,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{slot.lessonTitle}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        {new Date(slot.startTime).toLocaleString()} &middot; {slot.instructorName} &middot; {slot.locationName}
                      </div>
                    </div>
                    <span className="status-badge status-active">{slot.bookedCount}/{slot.capacity}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </SchoolApprovalGate>
    </DashboardLayout>
  )
}

export default SchoolDashboard
