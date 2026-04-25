import './AuthPage.css'

const features = [
  'Verified local providers you can trust',
  'Real-time weather & safety notifications',
  'Instant booking confirmations',
  'Free cancellation up to 24 hrs before',
  'Honest reviews from real adventurers',
]

const activities = ['Surfing', 'Dolphins', 'Snorkeling', 'Turtles']

function AuthShell({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-layout">
        <aside className="auth-left">
          <div className="auth-deco main" />
          <div className="auth-deco alt" />

          <div className="auth-brand">
            Aqua<em>Venture</em>
          </div>

          <div className="auth-left-center">
            <p className="auth-eyebrow">Arugam Bay · Sri Lanka</p>
            <h1 className="auth-title">
              Your ocean
              <br />
              adventure
              <br />
              awaits.
            </h1>
            <p className="auth-sub">
              Join the platform trusted by 1,200+ adventurers for safe, organised beach activities in one of Sri
              Lanka&apos;s most beautiful destinations.
            </p>

            <div className="auth-features">
              {features.map((feature) => (
                <div className="auth-feature" key={feature}>
                  <span className="auth-dot" />
                  {feature}
                </div>
              ))}
            </div>

            <div className="auth-activities">
              {activities.map((activity) => (
                <div className="auth-chip" key={activity}>
                  {activity}
                </div>
              ))}
            </div>
          </div>

          <p className="auth-footer-left">© 2026 AquaVenture · Safe, smart beach adventures</p>
        </aside>

        <section className="auth-right">
          <div className="auth-card">{children}</div>
        </section>
      </div>
    </div>
  )
}

export default AuthShell
