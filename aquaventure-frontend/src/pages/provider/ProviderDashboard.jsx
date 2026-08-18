import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { searchBookings, updateBookingStatus } from '../../api/bookingsApi'
import { searchActivities } from '../../api/activitiesApi'

function ProviderDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    if (!user?.profileId) return
    setLoading(true)
    const [bookingList, activityList] = await Promise.all([
      searchBookings({ providerId: user.profileId }),
      searchActivities({ providerId: user.profileId }),
    ])
    setBookings(bookingList.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)))
    setActivities(activityList)
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

  const pending = bookings.filter((b) => b.status === 'PENDING')
  const revenue = bookings
    .filter((b) => b.paymentStatus === 'PAID')
    .reduce((sum, b) => sum + Number(b.price), 0)

  return (
    <DashboardLayout role="PROVIDER" title={`Welcome back, ${user?.name?.split(' ')[0] ?? 'Provider'}!`}>
      <section className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-box">
          <div className="stat-label">Total Bookings</div>
          <div className="stat-value">{bookings.length}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Pending Requests</div>
          <div className="stat-value">{pending.length}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Active Services</div>
          <div className="stat-value">{activities.filter((a) => a.active).length}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Revenue (paid)</div>
          <div className="stat-value">${revenue.toFixed(0)}</div>
        </div>
      </section>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className="card-title" style={{ marginBottom: 0 }}>Booking Requests</h2>
          <Link to="/provider/services" style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
            Manage Services
          </Link>
        </div>

        {loading && <p>Loading...</p>}
        {!loading && bookings.length === 0 && <p className="empty-state">No bookings yet.</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {bookings.slice(0, 8).map((b) => (
            <div
              key={b.bookingId}
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
                <div style={{ fontWeight: 600 }}>{b.touristName} &middot; {b.activityName}</div>
                <div style={{ fontSize: 13, color: 'var(--text-light)' }}>
                  {new Date(b.bookingDate).toLocaleString()}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={`status-badge status-${b.status.toLowerCase()}`}>{b.status}</span>
                {b.status === 'PENDING' && (
                  <>
                    <button type="button" className="btn btn-primary" onClick={() => handleDecision(b.bookingId, 'CONFIRMED')}>
                      Confirm
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => handleDecision(b.bookingId, 'CANCELLED')}>
                      Decline
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ProviderDashboard
