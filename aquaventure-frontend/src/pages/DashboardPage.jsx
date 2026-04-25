import { useMemo, useState } from 'react'
import './DashboardPage.css'

const stats = [
  { label: 'Total bookings', value: '5', hint: 'Since joining AquaVenture' },
  { label: 'Upcoming sessions', value: '2', hint: 'Next: 1 Apr · 8:00 AM' },
  { label: 'Total spent', value: '$218', hint: 'Across 4 different activities' },
]

const tabs = [
  { id: 'upcoming', label: 'Upcoming (2)' },
  { id: 'past', label: 'Past (3)' },
  { id: 'cancelled', label: 'Cancelled (1)' },
]

const bookingGroups = {
  upcoming: [
    {
      id: 'surf-lessons',
      icon: '🏄',
      iconTone: 'mint',
      title: 'Surfing lessons',
      provider: "Ravi's Wave School · Verified",
      details: 'Tuesday 1 April · 8:00 AM · Main Point Beach\n2 guests · 2-3 hours · Gear included',
      price: '$53',
      status: 'Upcoming',
      statusTone: 'upcoming',
      actions: ['View details', 'Get directions', 'Reschedule', 'Cancel'],
    },
    {
      id: 'snorkeling-tour',
      icon: '🤿',
      iconTone: 'ocean',
      title: 'Snorkeling tour',
      provider: 'Ocean Explorer LK · Verified',
      details: 'Friday 4 April · 10:00 AM · Pottuvil Lagoon\n1 guest · 2 hours · Gear included',
      price: '$33',
      status: 'Upcoming',
      statusTone: 'upcoming',
      actions: ['View details', 'Get directions', 'Cancel'],
    },
  ],
  past: [
    {
      id: 'past-surf',
      icon: '🏄',
      iconTone: 'mint',
      title: 'Surfing lessons',
      provider: "Ravi's Wave School",
      details: 'Saturday 22 March · 8:00 AM · 2 guests',
      price: '$53',
      status: 'Completed',
      statusTone: 'completed',
      review: 'How was your session? Leave a review for Ravi.',
      actions: ['Write review'],
    },
    {
      id: 'past-dolphins',
      icon: '🐬',
      iconTone: 'rose',
      title: 'Dolphin watching',
      provider: 'Bay Adventures',
      details: 'Sunday 15 March · 6:00 AM · 3 guests',
      price: '$108',
      status: 'Completed',
      statusTone: 'completed',
      actions: ['Book again', 'View receipt'],
    },
    {
      id: 'past-turtles',
      icon: '🐢',
      iconTone: 'sage',
      title: 'Turtle watching',
      provider: 'Eco Beach Tours',
      details: 'Tuesday 4 March · 5:30 PM · 1 guest',
      price: '$23',
      status: 'Completed',
      statusTone: 'completed',
      actions: ['Book again', 'View receipt'],
    },
  ],
  cancelled: [
    {
      id: 'cancelled-kayak',
      icon: '🛶',
      iconTone: 'danger',
      title: 'Sea kayaking',
      provider: 'Surf Lanka Guides',
      details: 'Monday 10 March · 9:00 AM · 2 guests\nCancelled — unsafe weather conditions on the day',
      price: '$59',
      status: 'Cancelled',
      statusTone: 'cancelled',
      actions: ['Rebook now'],
      struckPrice: true,
    },
  ],
}

const helperMessage = {
  upcoming: 'Great conditions for your surfing session tomorrow. Wave height 1.2 m, wind 12 km/h, UV high.',
  past: 'Your recent trips are ready for reviews, receipts, or quick rebooking.',
  cancelled: 'Cancelled bookings stay here so you can rebook when conditions improve.',
}

function DashboardPage() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [notice, setNotice] = useState('')

  const bookings = useMemo(() => bookingGroups[activeTab], [activeTab])

  const handleAction = (label, title) => {
    setNotice(`${label} selected for ${title}.`)
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-orb dashboard-orb-a" />
      <div className="dashboard-orb dashboard-orb-b" />

      <nav className="dashboard-nav">
        <div className="dashboard-brand">
          Aqua<em>Venture</em>
        </div>

        <div className="dashboard-nav-links">
          <button type="button" className="dashboard-nav-link" onClick={() => setNotice('Browse activities selected.')}>Browse activities</button>
          <button type="button" className="dashboard-nav-link" onClick={() => setNotice('Safety center selected.')}>Safety</button>
          <div className="dashboard-user-chip">
            <div className="dashboard-avatar">KP</div>
            <div className="dashboard-user-name">Kasun P.</div>
          </div>
        </div>
      </nav>

      <main className="dashboard-shell">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-kicker">Your account</p>
            <h1 className="dashboard-title">My adventures</h1>
            <p className="dashboard-subtitle">Welcome back, Kasun. You have 2 upcoming sessions.</p>
          </div>

          <button type="button" className="dashboard-primary" onClick={() => setNotice('Show available activities near Arugam Bay.')}>+ Book new activity</button>
        </header>

        <section className="dashboard-stats" aria-label="Booking summary">
          {stats.map((stat) => (
            <article className="dashboard-stat-card" key={stat.label}>
              <span className="dashboard-stat-label">{stat.label}</span>
              <strong className="dashboard-stat-value">{stat.value}</strong>
              <span className="dashboard-stat-hint">{stat.hint}</span>
            </article>
          ))}
        </section>

        <section className="dashboard-alert" aria-label="Weather and safety update">
          <div className="dashboard-alert-icon">☀️</div>
          <div className="dashboard-alert-body">
            <strong>Great conditions for your surfing session tomorrow</strong>
            <p>{helperMessage[activeTab]}</p>
          </div>
          <div className="dashboard-alert-badge">Safe to go</div>
        </section>

        {notice && <div className="dashboard-notice">{notice}</div>}

        <section className="dashboard-tabs" aria-label="Booking history filters">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`dashboard-tab ${activeTab === tab.id ? 'is-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </section>

        <section className="dashboard-bookings" aria-live="polite">
          {bookings.map((booking) => (
            <article className="dashboard-booking-card" key={booking.id}>
              <div className={`dashboard-booking-icon tone-${booking.iconTone}`}>{booking.icon}</div>

              <div className="dashboard-booking-main">
                <h2>{booking.title}</h2>
                <p className="dashboard-booking-provider">{booking.provider}</p>
                <p className="dashboard-booking-details">
                  {booking.details.split('\n').map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>

                {booking.review ? (
                  <div className="dashboard-review-prompt">
                    <span className="dashboard-review-copy">⭐ {booking.review}</span>
                    <button type="button" className="dashboard-action primary" onClick={() => handleAction('Write review', booking.title)}>
                      Write review
                    </button>
                  </div>
                ) : null}

                <div className="dashboard-actions">
                  {booking.actions.map((action, index) => (
                    <button
                      type="button"
                      key={action}
                      className={`dashboard-action ${index === 0 ? 'primary' : ''} ${action === 'Cancel' ? 'destructive' : ''}`}
                      onClick={() => handleAction(action, booking.title)}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>

              <div className="dashboard-booking-side">
                <strong className={`dashboard-booking-price ${booking.struckPrice ? 'is-struck' : ''}`}>{booking.price}</strong>
                <span className={`dashboard-status tone-${booking.statusTone}`}>{booking.status}</span>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}

export default DashboardPage