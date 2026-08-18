import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import SurferLayout from '../../layouts/SurferLayout'
import { getActivity } from '../../api/activitiesApi'
import { createBooking } from '../../api/bookingsApi'

function BookLessonsDateTime() {
  const { activityId } = useParams()
  const navigate = useNavigate()
  const [activity, setActivity] = useState(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getActivity(activityId).then(setActivity)
  }, [activityId])

  const handleConfirm = async () => {
    if (!date || !time) return
    setSubmitting(true)
    setError('')
    try {
      const bookingDate = `${date}T${time}:00`
      const booking = await createBooking({ activityId: Number(activityId), bookingDate })
      navigate(`/surfer/book/confirmed/${booking.bookingId}`)
    } catch (err) {
      const apiData = err.response?.data
      setError(apiData?.message || apiData?.error || 'Could not create the booking.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!activity) {
    return (
      <SurferLayout title="Choose Date & Time">
        <p>Loading...</p>
      </SurferLayout>
    )
  }

  return (
    <SurferLayout title="Choose Date & Time">
      <div className="grid-2">
        <div className="card">
          <h2 className="card-title">Select Date & Time</h2>
          <div className="form-group">
            <label className="form-label" htmlFor="date">Date</label>
            <input id="date" type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="time">Time</label>
            <input id="time" type="time" className="form-input" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Booking Summary</h2>
          <p style={{ fontWeight: 600 }}>{activity.activityName}</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
            {activity.providerBusinessName} &middot; {activity.locationName}
          </p>
          <div className="stat-box" style={{ textAlign: 'left', marginBottom: 12 }}>
            <div className="stat-label">Duration</div>
            <div>{activity.duration} minutes</div>
          </div>
          <div className="stat-box" style={{ textAlign: 'left', marginBottom: 20 }}>
            <div className="stat-label">Price</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary-blue)' }}>${activity.price}</div>
          </div>

          {error && <p className="error-text">{error}</p>}

          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/surfer/book" className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>
              Back
            </Link>
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={!date || !time || submitting}
              onClick={handleConfirm}
            >
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </SurferLayout>
  )
}

export default BookLessonsDateTime
