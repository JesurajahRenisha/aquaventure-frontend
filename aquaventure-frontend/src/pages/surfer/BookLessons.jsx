import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SurferLayout from '../../layouts/SurferLayout'
import { searchActivities } from '../../api/activitiesApi'

function BookLessons() {
  const navigate = useNavigate()
  const [activities, setActivities] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    searchActivities()
      .then((data) => setActivities(data.filter((a) => a.active)))
      .finally(() => setLoading(false))
  }, [])

  const handleNext = () => {
    if (selectedId) {
      navigate(`/surfer/book/${selectedId}/datetime`)
    }
  }

  return (
    <SurferLayout title="Book Lessons">
      <div className="card">
        <h2 className="card-title">Select a Lesson</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
          Choose a surf lesson that matches your skill level and learning goals.
        </p>

        {loading && <p>Loading...</p>}
        {!loading && activities.length === 0 && <p className="empty-state">No lessons available right now.</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {activities.map((activity) => (
            <label
              key={activity.activityId}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: 16,
                border: `2px solid ${selectedId === activity.activityId ? 'var(--primary-blue)' : 'var(--border-color)'}`,
                borderRadius: 12,
                cursor: 'pointer',
                background: selectedId === activity.activityId ? 'rgba(0,102,204,0.03)' : 'transparent',
              }}
            >
              <input
                type="radio"
                name="activity"
                checked={selectedId === activity.activityId}
                onChange={() => setSelectedId(activity.activityId)}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{activity.activityName}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {activity.providerBusinessName} &middot; {activity.locationName}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {activity.duration} min &middot; ${activity.price}
                </div>
              </div>
            </label>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
          <button type="button" className="btn btn-primary" disabled={!selectedId} onClick={handleNext}>
            Next Step
          </button>
        </div>
      </div>
    </SurferLayout>
  )
}

export default BookLessons
