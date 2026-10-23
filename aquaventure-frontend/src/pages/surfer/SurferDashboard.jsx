import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SurferLayout from '../../layouts/SurferLayout'
import { useAuth } from '../../context/AuthContext'
import { getMyBookings, getRecommendations, getMyProfile } from '../../api/surferApi'
import { getConditions } from '../../api/locationsApi'

function SurferDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [conditions, setConditions] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const [bookingPage, recs, profile] = await Promise.all([
          getMyBookings(),
          getRecommendations(),
          getMyProfile(),
        ])
        if (cancelled) return
        setBookings(bookingPage.content ?? [])
        setRecommendations(recs)
        if (profile.preferredLocationId) {
          const c = await getConditions(profile.preferredLocationId)
          if (!cancelled) setConditions(c)
        }
      } catch {
        if (!cancelled) setError('Could not load your dashboard data.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const upcoming = bookings
    .filter((b) => b.status === 'PENDING' || b.status === 'ACCEPTED')
    .sort((a, b) => new Date(a.slotStartTime) - new Date(b.slotStartTime))[0]
  const today = conditions?.days?.[0]

  return (
    <SurferLayout title={`Good day, ${user?.firstname ?? 'Surfer'}!`}>
      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && (
        <>
          <section className="grid-4" style={{ marginBottom: 24 }}>
            <div className="stat-box">
              <div className="stat-label">Total Bookings</div>
              <div className="stat-value">{bookings.length}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Upcoming</div>
              <div className="stat-value">
                {upcoming ? new Date(upcoming.slotStartTime).toLocaleDateString() : '--'}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Wave Height</div>
              <div className="stat-value">{today ? `${today.maxWaveHeightM} m` : '--'}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Wind Speed</div>
              <div className="stat-value">{today ? `${Math.round(today.avgWindSpeedKmh)} km/h` : '--'}</div>
            </div>
          </section>

          <section className="grid-2">
            <div className="card">
              <h2 className="card-title">Recommended For You</h2>
              {recommendations.length === 0 && <p className="empty-state">No recommendations yet.</p>}
              {recommendations.slice(0, 1).map((rec) => (
                <div key={rec.lessonId}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--primary-blue)' }}>
                    {rec.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', margin: '8px 0 16px' }}>
                    {rec.schoolName} &middot; {rec.locationName} &middot; {rec.matchReason}
                  </p>
                  <Link to="/surfer/recommendation" className="btn btn-primary">
                    View All
                  </Link>
                </div>
              ))}
            </div>

            <div className="card">
              <h2 className="card-title">Upcoming Booking</h2>
              {!upcoming && <p className="empty-state">No upcoming bookings.</p>}
              {upcoming && (
                <div>
                  <p style={{ fontWeight: 600 }}>{upcoming.lessonTitle}</p>
                  <p style={{ color: 'var(--text-secondary)' }}>{upcoming.schoolName}</p>
                  <p style={{ marginTop: 8 }}>{new Date(upcoming.slotStartTime).toLocaleString()}</p>
                  <span className={`status-badge status-${upcoming.status.toLowerCase()}`}>{upcoming.status}</span>
                </div>
              )}
              <Link to="/schools" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-block' }}>
                Find a School
              </Link>
            </div>
          </section>
        </>
      )}
    </SurferLayout>
  )
}

export default SurferDashboard
