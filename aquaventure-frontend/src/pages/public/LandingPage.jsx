import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/shared.css'
import './LandingPage.css'
import { listLocations, getConditions } from '../../api/locationsApi'

function conditionLabel(today) {
  if (!today) return null
  const level = today.suitability?.BEGINNER
  if (level === 'SUITABLE') return { text: 'Good', className: 'good' }
  if (level === 'NOT_SUITABLE') return { text: 'Caution', className: 'caution' }
  return null
}

function LandingPage() {
  const [locations, setLocations] = useState([])
  const [conditions, setConditions] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    listLocations()
      .then((locs) => {
        setLocations(locs)
        if (locs[0]) {
          getConditions(locs[0].id)
            .then(setConditions)
            .catch(() => {})
        }
      })
      .catch(() => {})
  }, [])

  const filteredLocations = useMemo(
    () => locations.filter((l) => l.name.toLowerCase().includes(search.toLowerCase())),
    [locations, search],
  )

  const today = conditions?.days?.[0]
  const condition = conditionLabel(today)

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-brand">
          <span className="landing-brand-icon">🌊</span>
          <div>
            <div className="landing-brand-name">AquaVenture</div>
            <div className="landing-brand-tag">Intelligent Surf Tourism DSS</div>
          </div>
        </div>
        <ul className="landing-nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#locations">Surf Locations</a></li>
          <li><a href="#schools">Surf Schools</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="landing-nav-actions">
          <Link to="/login" className="btn-outline">Login</Link>
          <Link to="/register" className="btn-primary-link">Register</Link>
        </div>
      </nav>

      <section id="home" className="landing-hero">
        <div className="landing-hero-left">
          <span className="hero-badge">$ Smart Surfing, Safe Surfing</span>
          <h1>
            Surf Smarter.
            <br />
            <span>Surf Safer.</span>
          </h1>
          <p>
            AquaVenture helps you make intelligent surfing decisions with real-time conditions, personalized
            recommendations, and safety alerts.
          </p>
          <div className="hero-points">
            <span>⟳ Real-time Conditions</span>
            <span>★ Smart Recommendations</span>
            <span>🛡 Safety First</span>
          </div>
        </div>

        <div className="hero-card">
          <h3>Find Your Perfect Wave</h3>
          <p>Search surf spots and get intelligent recommendations</p>

          <div className="hero-search">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search surf spots, locations..."
            />
            <span className="hero-search-icon">📍</span>
          </div>

          {search && (
            <div className="hero-search-results">
              {filteredLocations.length === 0 && <p>No matching surf spots.</p>}
              {filteredLocations.slice(0, 4).map((l) => (
                <Link key={l.id} to="/schools" className="hero-search-result">
                  {l.name} <small>{l.region}</small>
                </Link>
              ))}
            </div>
          )}

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hs-icon">⚙</span>
              <strong>{today ? `${Math.round(today.avgTemperatureC)}°C` : '--'}</strong>
              <small>Air Temp</small>
            </div>
            <div className="hero-stat">
              <span className="hs-icon">〜</span>
              <strong>{today ? `${today.maxWaveHeightM}m` : '--'}</strong>
              <small>Wave Height</small>
            </div>
            <div className="hero-stat">
              <span className="hs-icon">≋</span>
              <strong>{today ? `${Math.round(today.avgWindSpeedKmh)} km/h` : '--'}</strong>
              <small>Wind Speed</small>
            </div>
            <div className={`hero-stat condition ${condition?.className ?? ''}`}>
              <strong>{condition ? condition.text : '--'}</strong>
              <small>Surf Condition</small>
            </div>
          </div>

          <Link to="/schools" className="btn-primary-link large full">
            Explore Surf Schools →
          </Link>
        </div>
      </section>

      <section id="about" className="landing-section">
        <div className="section-tag">About Us</div>
        <h2>A smarter way to plan your surf trip</h2>
        <p className="section-sub">
          AquaVenture connects surfers with verified surf schools and instructors across Sri Lanka, backed by
          real-time surf conditions and personalized recommendations based on your skill level.
        </p>
        <div className="landing-features">
          <div className="feature-card">
            <h3>Real-time Conditions</h3>
            <p>Wave height, wind speed and per-skill-level suitability for every surf spot.</p>
          </div>
          <div className="feature-card">
            <h3>Smart Recommendations</h3>
            <p>Matched to your skill level and preferred location.</p>
          </div>
          <div className="feature-card">
            <h3>Book Verified Schools</h3>
            <p>Browse surf schools, pick a lesson slot, and confirm your booking instantly.</p>
          </div>
        </div>
      </section>

      <section id="locations" className="landing-section alt">
        <div className="section-tag">Explore</div>
        <h2>Popular Surf Locations</h2>
        <p className="section-sub">Handpicked surf spots across Sri Lanka's Eastern Province, straight from our database.</p>
        <div className="locations-grid">
          {locations.length === 0 && <p className="empty-state">Surf locations will appear here.</p>}
          {locations.slice(0, 6).map((l) => (
            <div key={l.id} className="location-card">
              <h4>{l.name}</h4>
              <span className="status-badge status-active">{l.region}</span>
              <p>{l.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="schools" className="landing-section">
        <div className="section-tag">Trusted Network</div>
        <h2>Surf Schools</h2>
        <p className="section-sub">
          Every lesson on AquaVenture is run by a registered, platform-approved surf school. Schools manage their own
          lessons, equipment and booking requests through their own dashboard.
        </p>
        <Link to="/register" className="btn-primary-link large">
          Register Your Surf School
        </Link>
      </section>

      <footer id="contact" className="landing-footer">
        <div>
          <div className="landing-brand-name">AquaVenture</div>
          <p>Intelligent Surf Tourism DSS</p>
        </div>
        <div className="footer-contact">
          <p>Questions? Reach out at support@aquaventure.example</p>
          <p>&copy; {new Date().getFullYear()} AquaVenture</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
