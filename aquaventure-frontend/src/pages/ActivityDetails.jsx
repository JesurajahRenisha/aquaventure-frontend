import { activities } from '../data/activities'
import './ActivityDetails.css'

function ActivityDetails({ activityId, onBack, onLogout }) {
  const activity = activities.find((item) => item.id === activityId)

  if (!activity) {
    return (
      <div className="activity-details-page">
        <div className="activity-details-alert">Activity not found.</div>
        <button type="button" className="activity-details-back" onClick={onBack}>
          ← Back to activities
        </button>
      </div>
    )
  }

  return (
    <div className="activity-details-page">
      <header className="activity-details-header">
        <div>
          <div className="activity-details-eyebrow">Activity details</div>
          <h1>{activity.name}</h1>
          <p>{activity.provider}</p>
        </div>

        <div className="activity-details-actions">
          <button type="button" className="activity-details-logout" onClick={onLogout}>
            Logout
          </button>
          <button type="button" className="activity-details-back" onClick={onBack}>
            ← Back to activities
          </button>
        </div>
      </header>

      <section className="activity-details-main">
        <div className="activity-details-card">
          <div className="activity-details-badge" style={{ background: activity.color }}>
            {activity.emoji}
          </div>
          <div>
            <div className="activity-details-price">{activity.price}</div>
            <div className="activity-details-rating">{activity.rating}</div>
            <p>{activity.description}</p>
          </div>
        </div>

        <div className="activity-details-grid">
          <article>
            <h3>What to expect</h3>
            <ul>
              <li>Location: {activity.location}</li>
              <li>Duration: {activity.duration}</li>
              <li>Group size: {activity.groupSize}</li>
              <li>Safety briefing and equipment included</li>
            </ul>
          </article>

          <article>
            <h3>Why this activity?</h3>
            <p>
              This experience is built for travellers who want reliable local guides, strong safety support, and a memorable day by the water.
            </p>
          </article>
        </div>

        <div className="activity-details-cta-row">
          <button type="button" className="activity-details-book">Book now</button>
          <button type="button" className="activity-details-secondary" onClick={onBack}>
            Back to list
          </button>
        </div>
      </section>
    </div>
  )
}

export default ActivityDetails