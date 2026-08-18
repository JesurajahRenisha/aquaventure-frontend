import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import SurferLayout from '../../layouts/SurferLayout'
import { getBooking, payForBooking } from '../../api/bookingsApi'

function BookingConfirmed() {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState(null)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  const load = () => getBooking(bookingId).then(setBooking)

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId])

  const handlePay = async () => {
    setPaying(true)
    setError('')
    try {
      await payForBooking(bookingId, 'CARD')
      await load()
    } catch (err) {
      const apiData = err.response?.data
      setError(apiData?.message || apiData?.error || 'Payment failed.')
    } finally {
      setPaying(false)
    }
  }

  if (!booking) {
    return (
      <SurferLayout title="Booking Confirmed">
        <p>Loading...</p>
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
            Your Booking is {booking.status === 'CONFIRMED' ? 'Confirmed' : 'Pending Confirmation'}!
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
            We&apos;re looking forward to seeing you in the water.
          </p>
          <div className="stat-box" style={{ textAlign: 'left' }}>
            <div className="stat-label">Booking ID</div>
            <div style={{ fontFamily: 'monospace' }}>#{booking.bookingId}</div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Booking Summary</h3>
          <p style={{ fontWeight: 600 }}>{booking.activityName}</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>{booking.providerBusinessName}</p>

          <div className="stat-box" style={{ textAlign: 'left', marginBottom: 12 }}>
            <div className="stat-label">Date & Time</div>
            <div>{new Date(booking.bookingDate).toLocaleString()}</div>
          </div>
          <div className="stat-box" style={{ textAlign: 'left', marginBottom: 12 }}>
            <div className="stat-label">Status</div>
            <span className={`status-badge status-${booking.status.toLowerCase()}`}>{booking.status}</span>
          </div>
          <div className="stat-box" style={{ textAlign: 'left', marginBottom: 20 }}>
            <div className="stat-label">Payment</div>
            <span className={`status-badge status-${booking.paymentStatus.toLowerCase()}`}>{booking.paymentStatus}</span>
            <span style={{ marginLeft: 12, fontWeight: 700 }}>${booking.price}</span>
          </div>

          {error && <p className="error-text">{error}</p>}

          <div style={{ display: 'flex', gap: 12 }}>
            {booking.paymentStatus === 'UNPAID' && (
              <button type="button" className="btn btn-primary" style={{ flex: 1 }} disabled={paying} onClick={handlePay}>
                {paying ? 'Processing...' : 'Pay Now'}
              </button>
            )}
            <Link to="/surfer" className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </SurferLayout>
  )
}

export default BookingConfirmed
