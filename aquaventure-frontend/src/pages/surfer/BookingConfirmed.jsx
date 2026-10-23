import { Link, useLocation } from 'react-router-dom'
import SurferLayout from '../../layouts/SurferLayout'

function BookingConfirmed() {
  const { state } = useLocation()
  const booking = state?.booking

  if (!booking) {
    return (
      <SurferLayout title="Booking Confirmed">
        <div className="card" style={{ textAlign: 'center' }}>
          <p className="empty-state">Booking details aren&apos;t available on this page any more.</p>
          <Link to="/surfer/bookings" className="btn btn-primary">Go to My Bookings</Link>
        </div>
      </SurferLayout>
    )
  }

  return (
    <SurferLayout title="Booking Confirmed">
      <div className="grid-2">
        <div className="card" style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #14b8a6, #10b981)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: 'white',
              fontSize: 36,
            }}
          >
            &#10003;
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>
            Booking Request Sent!
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
            The school will accept or reject your request shortly — you&apos;ll get a notification either way.
          </p>
          <div className="stat-box" style={{ textAlign: 'left' }}>
            <div className="stat-label">Booking ID</div>
            <div style={{ fontFamily: 'monospace' }}>#{booking.id}</div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Booking Summary</h3>
          <p style={{ fontWeight: 600 }}>{booking.lessonTitle}</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>{booking.schoolName}</p>

          <div className="stat-box" style={{ textAlign: 'left', marginBottom: 12 }}>
            <div className="stat-label">Date & Time</div>
            <div>{new Date(booking.slotStartTime).toLocaleString()}</div>
          </div>
          <div className="stat-box" style={{ textAlign: 'left', marginBottom: 12 }}>
            <div className="stat-label">Status</div>
            <span className={`status-badge status-${booking.status.toLowerCase()}`}>{booking.status}</span>
          </div>
          <div className="stat-box" style={{ textAlign: 'left', marginBottom: 20 }}>
            <div className="stat-label">Total Price</div>
            <span style={{ fontWeight: 700, fontSize: 18 }}>{booking.currency} {booking.totalPrice}</span>
          </div>

          <Link to="/surfer" className="btn btn-secondary" style={{ display: 'block', textAlign: 'center' }}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    </SurferLayout>
  )
}

export default BookingConfirmed
