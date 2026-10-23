import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getSchool } from '../../api/schoolsApi'
import '../../styles/shared.css'
import './LandingPage.css'

function SchoolDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [school, setSchool] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getSchool(id).then(setSchool).finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleBook = (lessonId) => {
    if (!user) {
      navigate('/login')
      return
    }
    if (user.role !== 'SURFER') return
    navigate(`/surfer/book/${id}/${lessonId}`)
  }

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>
  if (!school) return <p style={{ padding: 40 }}>School not found.</p>

  return (
    <div className="landing" style={{ paddingTop: 0 }}>
      <nav className="landing-nav">
        <Link to="/" className="landing-brand">
          <span className="landing-brand-icon">🌊</span>
          <div className="landing-brand-name">AquaVenture</div>
        </Link>
        <Link to="/schools" className="btn-outline">← Back to Schools</Link>
      </nav>

      <div style={{ maxWidth: 1000, margin: '32px auto', padding: '0 24px' }}>
        <div className="card" style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>{school.name}</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>{(school.locationNames ?? []).join(', ')}</p>
          {school.description && <p style={{ marginBottom: 8 }}>{school.description}</p>}
          {school.address && <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{school.address}</p>}
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <h2 className="card-title">Lessons</h2>
          {(school.lessons ?? []).length === 0 && <p className="empty-state">No lessons published yet.</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(school.lessons ?? []).map((lesson) => (
              <div
                key={lesson.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 16,
                  border: '1px solid var(--border-color)',
                  borderRadius: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{lesson.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    {lesson.lessonType} &middot; {lesson.skillLevel} &middot; {lesson.durationMinutes} min &middot;{' '}
                    {lesson.locationName}
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>
                    {lesson.currency} {lesson.price}
                  </div>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => handleBook(lesson.id)}>
                  Book This Lesson
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid-2">
          <div className="card">
            <h2 className="card-title">Instructors</h2>
            {(school.instructors ?? []).length === 0 && <p className="empty-state">No instructors listed.</p>}
            {(school.instructors ?? []).map((i) => (
              <div key={i.id} style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 600 }}>{i.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {i.experienceYears} yrs &middot; {(i.languages ?? []).join(', ')}
                </div>
                <div style={{ fontSize: 13 }}>{(i.skillLevelsTaught ?? []).join(', ')}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <h2 className="card-title">Equipment</h2>
            {(school.equipment ?? []).length === 0 && <p className="empty-state">No rental equipment listed.</p>}
            {(school.equipment ?? []).map((e) => (
              <div key={e.id} style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 600 }}>{e.name} ({e.type})</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  ${e.rentalPricePerHour}/hr &middot; ${e.rentalPricePerDay}/day
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SchoolDetail
