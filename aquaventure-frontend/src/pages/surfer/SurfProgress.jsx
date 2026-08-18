import { useEffect, useState } from 'react'
import SurferLayout from '../../layouts/SurferLayout'
import { useAuth } from '../../context/AuthContext'
import { listProgressForTourist } from '../../api/progressApi'

function SurfProgress() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.profileId) return
    listProgressForTourist(user.profileId)
      .then((data) => data.sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate)))
      .then(setEntries)
      .finally(() => setLoading(false))
  }, [user])

  return (
    <SurferLayout title="Surf Progress Tracker">
      <div className="card">
        <h2 className="card-title">Progress Log</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
          Logged by your instructors after each lesson.
        </p>
        {loading && <p>Loading...</p>}
        {!loading && entries.length === 0 && <p className="empty-state">No progress entries yet.</p>}
        {!loading && entries.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {entries.map((entry) => (
              <div key={entry.progressId} className="stat-box" style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{new Date(entry.sessionDate).toLocaleDateString()}</strong>
                  <span className="status-badge status-confirmed">{entry.skillLevel}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>
                  Instructor: {entry.instructorName ?? 'N/A'}
                </p>
                {entry.notes && <p style={{ marginTop: 6 }}>{entry.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </SurferLayout>
  )
}

export default SurfProgress
