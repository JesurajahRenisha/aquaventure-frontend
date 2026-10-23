import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SurferLayout from '../../layouts/SurferLayout'
import { getRecommendations } from '../../api/surferApi'

function SurfRecommendation() {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRecommendations().then(setRecommendations).finally(() => setLoading(false))
  }, [])

  return (
    <SurferLayout title="Surf Recommendation">
      <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
        Matched to your skill level and preferred location — update these on your profile to refine them.
      </p>

      {loading && <p>Loading...</p>}

      <div className="grid-2">
        {recommendations.map((rec) => (
          <div key={rec.lessonId} className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--primary-blue)' }}>
              {rec.title}
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{rec.schoolName} &middot; {rec.locationName}</p>
            <p style={{ fontWeight: 700, margin: '8px 0' }}>{rec.currency} {rec.price}</p>
            <p style={{ color: 'var(--text-secondary)' }}>{rec.matchReason}</p>
            <Link to={`/schools/${rec.schoolId}`} className="btn btn-primary" style={{ marginTop: 12, display: 'inline-block' }}>
              View School
            </Link>
          </div>
        ))}
        {!loading && recommendations.length === 0 && (
          <p className="empty-state">No recommendations yet — set your skill level and preferred location on your profile.</p>
        )}
      </div>
    </SurferLayout>
  )
}

export default SurfRecommendation
