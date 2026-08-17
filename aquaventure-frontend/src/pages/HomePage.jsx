import { useMemo, useState } from 'react'
import './HomePage.css'
import { activities } from '../data/activities'

const quickBookOptions = ['Surfing', 'Dolphins', 'Turtles', 'Snorkeling', 'Kayaking', 'Diving']

function HomePage({ userEmail, onLogout, onActivitySelect }) {
  const [selectedQuickBook, setSelectedQuickBook] = useState('Surfing')
  const [notice, setNotice] = useState('')

  const userName = useMemo(() => {
    if (!userEmail) {
      return 'Adventurer'
    }

    const firstPart = userEmail.split('@')[0] || ''
    if (!firstPart) {
      return 'Adventurer'
    }

    return `${firstPart.charAt(0).toUpperCase()}${firstPart.slice(1)}`
  }, [userEmail])

  const handleAction = (message) => {
    setNotice(message)
  }

  return (
    <div className="home-page">
      <nav className="home-nav">
        <div className="home-logo">
          Aqua<em>Venture</em>
        </div>

        <ul className="home-nav-menu" aria-label="Primary navigation">
          <li>
            <button type="button" onClick={() => handleAction('Viewing activities catalogue.')}>Activities</button>
          </li>
          <li>
            <button type="button" onClick={() => handleAction('Viewing providers list.')}>Providers</button>
          </li>
          <li>
            <button type="button" onClick={() => handleAction('Opening safety guidance.')}>Safety</button>
          </li>
          <li>
            <button type="button" onClick={() => handleAction('Opening about section.')}>About</button>
          </li>
        </ul>

        <div className="home-nav-right">
          <span className="home-user">Hi, {userName}</span>
          <button type="button" className="home-nav-cta" onClick={() => handleAction('Preparing booking flow...')}>
            Book now
          </button>
          <button
            type="button"
            className="home-nav-logout"
            onClick={() => {
              localStorage.removeItem('authToken')
              localStorage.removeItem('authEmail')
              onLogout?.()
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <header className="home-hero">
        <div className="home-hero-left">
          <div className="home-eyebrow">
            <span className="home-dot" /> Arugam Bay · Sri Lanka
          </div>
          <h1>
            Ride the waves,
            <br />
            your way.
            <br />
            <span>Safely.</span>
          </h1>
          <p>
            Discover, compare and book surfing, dolphin watching, snorkeling and more through one trusted platform
            built for Arugam Bay.
          </p>

          <div className="home-hero-actions">
            <button type="button" className="home-btn-primary" onClick={() => handleAction('Showing all available activities.')}>Explore activities</button>
            <button type="button" className="home-btn-secondary" onClick={() => handleAction('How AquaVenture works: browse, pick, book, enjoy.')}>How it works</button>
          </div>
        </div>

        <div className="home-hero-right">
          <article className="home-card">
            <div className="home-card-top">
              <span>Today — Arugam Bay</span>
              <span className="home-safe-tag">Safe to surf</span>
            </div>

            <div className="home-weather-row">
              <div className="home-temp">29°C</div>
              <div className="home-weather-copy">
                Partly cloudy
                <br />
                Low swells · Good visibility
              </div>
            </div>

            <div className="home-weather-grid">
              <div><label>Wave ht.</label><strong>1.2 m</strong></div>
              <div><label>Wind</label><strong>12 km/h</strong></div>
              <div><label>UV</label><strong>High</strong></div>
              <div><label>Visibility</label><strong>Excellent</strong></div>
            </div>
          </article>

          <article className="home-card">
            <p className="home-quick-title">Quick book</p>
            <div className="home-pill-list">
              {quickBookOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={`home-pill ${selectedQuickBook === option ? 'is-on' : ''}`}
                  onClick={() => setSelectedQuickBook(option)}
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="home-book-check"
              onClick={() => handleAction(`Checking ${selectedQuickBook} availability at Arugam Bay.`)}
            >
              Check availability →
            </button>
          </article>
        </div>

        <svg className="home-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" fill="#fff" />
        </svg>
      </header>

      <section className="home-stats" aria-label="Platform statistics">
        <div><strong>1,200+</strong><span>Happy adventurers</span></div>
        <div><strong>18</strong><span>Verified providers</span></div>
        <div><strong>6</strong><span>Unique activities</span></div>
        <div><strong>4.9★</strong><span>Average rating</span></div>
      </section>

      <section className="home-section home-activities">
        <p className="home-section-tag">What we offer</p>
        <h2>Explore all activities</h2>
        <p className="home-section-sub">Handpicked experiences with verified local providers. Every booking includes safety checks and honest reviews.</p>

        <div className="home-activity-grid">
          {activities.map((activity) => (
            <article className="home-activity-card" key={activity.id}>
              <div className="home-activity-top" style={{ background: activity.color }}>
                <span>{activity.emoji}</span>
                {activity.badge ? <small>{activity.badge}</small> : null}
              </div>

              <div className="home-activity-body">
                <h3>{activity.name}</h3>
                <p>{activity.provider}</p>

                <div className="home-activity-row">
                  <div>
                    <strong>{activity.price}</strong>
                    <span>{activity.rating}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onActivitySelect) {
                        onActivitySelect(activity.id)
                      } else {
                        handleAction(`Viewing details for ${activity.name}.`)
                      }
                    }}
                  >
                    View details
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-how">
        <p className="home-section-tag">Simple process</p>
        <h2>How AquaVenture works</h2>

        <div className="home-steps-grid">
          <article>
            <div className="home-step-number">1</div>
            <p className="home-step-icon">🔍</p>
            <h3>Browse activities</h3>
            <p>Explore surfing, dolphins, snorkeling and more with real photos and verified reviews.</p>
          </article>
          <article>
            <div className="home-step-number">2</div>
            <p className="home-step-icon">📅</p>
            <h3>Pick your slot</h3>
            <p>Check real-time availability and live weather safety ratings before committing.</p>
          </article>
          <article>
            <div className="home-step-number">3</div>
            <p className="home-step-icon">💳</p>
            <h3>Book securely</h3>
            <p>Pay safely online with instant confirmation and safety briefing.</p>
          </article>
          <article>
            <div className="home-step-number">4</div>
            <p className="home-step-icon">🌊</p>
            <h3>Dive in</h3>
            <p>Meet verified local guides and experience Arugam Bay like never before.</p>
          </article>
        </div>
      </section>

      <section className="home-section home-reviews">
        <p className="home-section-tag">Guest stories</p>
        <h2>Trusted by adventurers worldwide</h2>

        <div className="home-review-grid">
          <article>
            <p className="home-stars">★★★★★</p>
            <p className="home-review-text">&quot;Booked a surf lesson through AquaVenture. Safety notifications were a brilliant touch.&quot;</p>
            <p className="home-review-author">Sarah A. · United Kingdom</p>
          </article>
          <article>
            <p className="home-stars">★★★★★</p>
            <p className="home-review-text">&quot;Dolphin watching was breathtaking. Easy booking, great guides, everything ran on time.&quot;</p>
            <p className="home-review-author">Marco K. · Germany</p>
          </article>
          <article>
            <p className="home-stars">★★★★★</p>
            <p className="home-review-text">&quot;Real reviews and verified guides made me feel safe as a solo traveller. Highly recommended.&quot;</p>
            <p className="home-review-author">Priya T. · Australia</p>
          </article>
        </div>
      </section>

      <section className="home-cta">
        <div>
          <h2>Ready for your ocean adventure?</h2>
          <p>Join 1,200+ travellers who have explored Arugam Bay safely through AquaVenture.</p>
        </div>
        <button type="button" onClick={() => handleAction('Starting your onboarding flow...')}>Get started today →</button>
      </section>

      {notice ? <div className="home-notice">{notice}</div> : null}

      <footer className="home-footer">
        <div className="home-logo">
          Aqua<em>Venture</em>
        </div>
        <div className="home-footer-links">
          <button type="button" onClick={() => handleAction('Opening activities.')}>Activities</button>
          <button type="button" onClick={() => handleAction('Opening providers.')}>Providers</button>
          <button type="button" onClick={() => handleAction('Opening safety resources.')}>Safety</button>
          <button type="button" onClick={() => handleAction('Opening support.')}>Support</button>
        </div>
        <p>© 2026 AquaVenture · Arugam Bay, Sri Lanka</p>
      </footer>
    </div>
  )
}

export default HomePage