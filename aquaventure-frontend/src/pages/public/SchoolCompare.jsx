import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { compareSchools } from '../../api/schoolsApi'
import '../../styles/shared.css'
import './LandingPage.css'

function SchoolCompare() {
  const [searchParams] = useSearchParams()
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const ids = (searchParams.get('ids') ?? '').split(',').filter(Boolean)

  useEffect(() => {
    if (ids.length < 2) {
      setLoading(false)
      return
    }
    compareSchools(ids).then(setSchools).finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('ids')])

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
        <div className="card">
          <h2 className="card-title">Compare Schools</h2>
          {ids.length < 2 && <p className="empty-state">Pick 2–5 schools on the search page to compare them.</p>}
          {loading && ids.length >= 2 && <p>Loading...</p>}
          {!loading && schools.length > 0 && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Field</th>
                  {schools.map((s) => <th key={s.id}>{s.name}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Price range</td>
                  {schools.map((s) => (
                    <td key={s.id}>
                      {s.minPrice != null ? `${s.currency} ${s.minPrice}–${s.maxPrice}` : '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Lesson types</td>
                  {schools.map((s) => <td key={s.id}>{(s.lessonTypesOffered ?? []).join(', ') || '—'}</td>)}
                </tr>
                <tr>
                  <td>Skill levels</td>
                  {schools.map((s) => <td key={s.id}>{(s.skillLevelsSupported ?? []).join(', ') || '—'}</td>)}
                </tr>
                <tr>
                  <td>Instructor count</td>
                  {schools.map((s) => <td key={s.id}>{s.instructorCount ?? '—'}</td>)}
                </tr>
                <tr>
                  <td>Languages</td>
                  {schools.map((s) => <td key={s.id}>{(s.languagesOffered ?? []).join(', ') || '—'}</td>)}
                </tr>
                <tr>
                  <td>Equipment available</td>
                  {schools.map((s) => <td key={s.id}>{s.equipmentRentalAvailable ? 'Yes' : 'No'}</td>)}
                </tr>
                <tr>
                  <td></td>
                  {schools.map((s) => (
                    <td key={s.id}>
                      <Link to={`/schools/${s.id}`} className="btn btn-secondary">View</Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default SchoolCompare
