import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { searchSchools } from '../../api/schoolsApi'
import { listLocations } from '../../api/locationsApi'
import '../../styles/shared.css'
import './LandingPage.css'

function SchoolSearch() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [locations, setLocations] = useState([])
  const [filters, setFilters] = useState({ locationId: '', skillLevel: '', lessonType: '', minPrice: '', maxPrice: '', sort: 'name' })
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [compareIds, setCompareIds] = useState([])

  useEffect(() => {
    listLocations().then(setLocations).catch(() => {})
  }, [])

  const load = () => {
    setLoading(true)
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))
    searchSchools(params)
      .then((page) => setSchools(page.content ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFilterChange = (event) => {
    const { name, value } = event.target
    setFilters((current) => ({ ...current, [name]: value }))
  }

  const toggleCompare = (id) => {
    setCompareIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : current.length < 5 ? [...current, id] : current
    )
  }

  return (
    <div className="landing" style={{ paddingTop: 0 }}>
      <nav className="landing-nav">
        <Link to="/" className="landing-brand">
          <span className="landing-brand-icon">🌊</span>
          <div>
            <div className="landing-brand-name">AquaVenture</div>
            <div className="landing-brand-tag">Surf Schools</div>
          </div>
        </Link>
        <div className="landing-nav-actions">
          {user ? (
            <Link to={user.role === 'SURFER' ? '/surfer' : user.role === 'SCHOOL_ADMIN' ? '/school' : '/admin'} className="btn-primary-link">
              My Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/register" className="btn-primary-link">Register</Link>
            </>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '32px auto', padding: '0 24px' }}>
        <div className="card" style={{ marginBottom: 24 }}>
          <h2 className="card-title">Find a Surf School</h2>
          <div className="grid-4">
            <div className="form-group">
              <label className="form-label">Location</label>
              <select name="locationId" className="form-select" value={filters.locationId} onChange={handleFilterChange}>
                <option value="">Any</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Skill Level</label>
              <select name="skillLevel" className="form-select" value={filters.skillLevel} onChange={handleFilterChange}>
                <option value="">Any</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Lesson Type</label>
              <select name="lessonType" className="form-select" value={filters.lessonType} onChange={handleFilterChange}>
                <option value="">Any</option>
                <option value="GROUP">Group</option>
                <option value="PRIVATE">Private</option>
                <option value="SEMI_PRIVATE">Semi-Private</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Sort By</label>
              <select name="sort" className="form-select" value={filters.sort} onChange={handleFilterChange}>
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Min Price</label>
              <input name="minPrice" type="number" className="form-input" value={filters.minPrice} onChange={handleFilterChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Max Price</label>
              <input name="maxPrice" type="number" className="form-input" value={filters.maxPrice} onChange={handleFilterChange} />
            </div>
          </div>
          <button type="button" className="btn btn-primary" onClick={load}>Search</button>
          {compareIds.length >= 2 && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ marginLeft: 12 }}
              onClick={() => navigate(`/schools/compare?ids=${compareIds.join(',')}`)}
            >
              Compare ({compareIds.length})
            </button>
          )}
        </div>

        {loading && <p>Loading...</p>}
        {!loading && schools.length === 0 && <p className="empty-state">No schools match your filters.</p>}

        <div className="grid-3">
          {schools.map((school) => (
            <div key={school.id} className="card">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <input type="checkbox" checked={compareIds.includes(school.id)} onChange={() => toggleCompare(school.id)} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Compare</span>
              </label>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 6 }}>{school.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>
                {(school.locationNames ?? []).join(', ') || 'Location TBD'}
              </p>
              <p style={{ fontSize: 13, marginBottom: 8 }}>{(school.lessonTypesOffered ?? []).join(', ')}</p>
              <p style={{ fontWeight: 700, color: 'var(--primary-blue)', marginBottom: 12 }}>
                {school.minPrice != null ? `${school.currency} ${school.minPrice} – ${school.maxPrice}` : 'Pricing TBD'}
              </p>
              <Link to={`/schools/${school.id}`} className="btn btn-primary" style={{ display: 'block', textAlign: 'center' }}>
                View School
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SchoolSearch
