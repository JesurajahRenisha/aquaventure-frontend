import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SurferLayout from '../../layouts/SurferLayout'
import { useAuth } from '../../context/AuthContext'
import { searchBookings } from '../../api/bookingsApi'
import { listRecommendationsForTourist, generateRecommendations } from '../../api/recommendationsApi'
import { getWeatherForLocation } from '../../api/weatherApi'

function SurferDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.profileId) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const [bookingList, recs] = await Promise.all([
          searchBookings({ touristId: user.profileId }),
          listRecommendationsForTourist(user.profileId).then((list) =>
            list.length > 0 ? list : generateRecommendations(user.profileId),
          ),
        ])
        if (cancelled) return
        setBookings(bookingList)
        setRecommendations(recs)
        if (recs[0]?.locationId) {
          const w = await getWeatherForLocation(recs[0].locationId)
          if (!cancelled) setWeather(w)
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
  }, [user])

  const upcoming = bookings
    .filter((b) => b.status !== 'CANCELLED')
    .sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate))[0]

  return (
    <SurferLayout title={`Good day, ${user?.name?.split(' ')[0] ?? 'Surfer'}!`}>
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
                {upcoming ? new Date(upcoming.bookingDate).toLocaleDateString() : '--'}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Wave Height</div>
              <div className="stat-value">{weather ? `${weather.waveHeight} m` : '--'}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Wind Speed</div>
              <div className="stat-value">{weather ? `${weather.windSpeed} km/h` : '--'}</div>
            </div>
          </section>

          <section className="grid-2">
            <div className="card">
              <h2 className="card-title">Today's Recommendation</h2>
              {recommendations.length === 0 && <p className="empty-state">No recommendations yet.</p>}
              {recommendations.slice(0, 1).map((rec) => (
                <div key={rec.recommendationId}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--primary-blue)' }}>
                    {rec.locationName}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', margin: '8px 0 16px' }}>{rec.recommendationReason}</p>
                  <Link to="/surfer/recommendation" className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              ))}
            </div>

            <div className="card">
              <h2 className="card-title">Upcoming Booking</h2>
              {!upcoming && <p className="empty-state">No upcoming bookings.</p>}
              {upcoming && (
                <div>
                  <p style={{ fontWeight: 600 }}>{upcoming.activityName}</p>
                  <p style={{ color: 'var(--text-secondary)' }}>{upcoming.providerBusinessName}</p>
                  <p style={{ marginTop: 8 }}>{new Date(upcoming.bookingDate).toLocaleString()}</p>
                  <span className={`status-badge status-${upcoming.status.toLowerCase()}`}>{upcoming.status}</span>
                </div>
              )}
              <Link to="/surfer/book" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-block' }}>
                Book a Lesson
              </Link>
            </div>
          </section>
        </>
      )}
    </SurferLayout>
  )
}

export default SurferDashboard
