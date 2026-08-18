import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/shared.css'
import './LandingPage.css'
import { listLocations } from '../../api/locationsApi'
import { getWeatherForLocation } from '../../api/weatherApi'

function conditionLabel(weather) {
  if (!weather) return null
  const { waveHeight, windSpeed } = weather
  if (waveHeight <= 1.5 && windSpeed <= 20) return { text: 'Good', className: 'good' }
  if (waveHeight <= 2.5 && windSpeed <= 30) return { text: 'Caution', className: 'caution' }
  return { text: 'Rough', className: 'rough' }
}

function LandingPage() {
  const [locations, setLocations] = useState([])
  const [weather, setWeather] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    listLocations()
      .then((locs) => {
        setLocations(locs)
        if (locs[0]) {
          getWeatherForLocation(locs[0].locationId)
            .then(setWeather)
            .catch(() => {})
        }
      })
      .catch(() => {})
  }, [])

  const filteredLocations = useMemo(
    () => locations.filter((l) => l.locationName.toLowerCase().includes(search.toLowerCase())),
    [locations, search],
  )

  const condition = conditionLabel(weather)

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
          <li><a href="#providers">Surf Providers</a></li>
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
                <Link key={l.locationId} to="/register" className="hero-search-result">
                  {l.locationName} <small>{l.difficultyLevel}</small>
                </Link>
              ))}
            </div>
          )}

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hs-icon">⚙</span>
              <strong>{weather ? `${weather.temperature}°C` : '--'}</strong>
              <small>Air Temp</small>
            </div>
            <div className="hero-stat">
              <span className="hs-icon">〜</span>
              <strong>{weather ? `${weather.waveHeight}m` : '--'}</strong>
              <small>Wave Height</small>
            </div>
            <div className="hero-stat">
              <span className="hs-icon">≋</span>
              <strong>{weather ? `${weather.windSpeed} km/h` : '--'}</strong>
              <small>Wind Speed</small>
            </div>
            <div className={`hero-stat condition ${condition?.className ?? ''}`}>
              <strong>{condition ? condition.text : '--'}</strong>
              <small>Surf Condition</small>
            </div>
          </div>

          <Link to="/register" className="btn-primary-link large full">
            Explore Surf Spots →
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
            <p>Wave height, wind speed and safety flags per surf spot, updated continuously.</p>
          </div>
          <div className="feature-card">
            <h3>Smart Recommendations</h3>
            <p>Matched to your skill level, booking history and the day's conditions.</p>
          </div>
          <div className="feature-card">
            <h3>Book Verified Instructors</h3>
            <p>Browse surf schools, pick a lesson, and confirm your booking instantly.</p>
          </div>
        </div>
      </section>

      <section id="locations" className="landing-section alt">
        <div className="section-tag">Explore</div>
        <h2>Popular Surf Locations</h2>
        <p className="section-sub">Handpicked surf spots rated by difficulty and safety, straight from our database.</p>
        <div className="locations-grid">
          {locations.length === 0 && <p className="empty-state">Surf locations will appear here.</p>}
          {locations.slice(0, 6).map((l) => (
            <div key={l.locationId} className="location-card">
              <h4>{l.locationName}</h4>
              <span className={`status-badge status-${l.difficultyLevel === 'BEGINNER' ? 'active' : l.difficultyLevel === 'ADVANCED' ? 'inactive' : 'pending'}`}>
                {l.difficultyLevel}
              </span>
              <p>Safety rating: {l.safetyRating} / 5</p>
            </div>
          ))}
        </div>
      </section>

      <section id="providers" className="landing-section">
        <div className="section-tag">Trusted Network</div>
        <h2>Surf Providers</h2>
        <p className="section-sub">
          Every lesson on AquaVenture is run by a registered surf school or instructor. Providers manage their own
          services, equipment and booking requests through their own dashboard.
        </p>
        <Link to="/register" className="btn-primary-link large">
          Register as a Surf Provider
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
