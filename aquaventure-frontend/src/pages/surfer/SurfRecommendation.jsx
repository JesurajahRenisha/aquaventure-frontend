import { useEffect, useState } from 'react'
import SurferLayout from '../../layouts/SurferLayout'
import { useAuth } from '../../context/AuthContext'
import { listRecommendationsForTourist, generateRecommendations } from '../../api/recommendationsApi'

function SurfRecommendation() {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    if (!user?.profileId) return
    setLoading(true)
    const list = await listRecommendationsForTourist(user.profileId)
    setRecommendations(list)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleGenerate = async () => {
    if (!user?.profileId) return
    setLoading(true)
    const list = await generateRecommendations(user.profileId)
    setRecommendations(list)
    setLoading(false)
  }

  return (
    <SurferLayout title="Surf Recommendation">
      <div style={{ marginBottom: 20 }}>
        <button type="button" className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
          {loading ? 'Analyzing...' : 'Generate New Recommendations'}
        </button>
      </div>

      <div className="grid-2">
        {recommendations.map((rec) => (
          <div key={rec.recommendationId} className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--primary-blue)' }}>
              {rec.locationName}
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>{rec.recommendationReason}</p>
          </div>
        ))}
        {!loading && recommendations.length === 0 && (
          <p className="empty-state">No recommendations yet -- click generate above.</p>
        )}
      </div>
    </SurferLayout>
  )
}

export default SurfRecommendation
