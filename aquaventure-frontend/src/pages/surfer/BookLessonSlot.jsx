import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import SurferLayout from '../../layouts/SurferLayout'
import { getSchool } from '../../api/schoolsApi'
import { getLessonSlots } from '../../api/lessonsApi'
import { createBooking } from '../../api/surferApi'

function BookLessonSlot() {
  const { schoolId, lessonId } = useParams()
  const navigate = useNavigate()
  const [school, setSchool] = useState(null)
  const [slots, setSlots] = useState([])
  const [slotId, setSlotId] = useState(null)
  const [participants, setParticipants] = useState(1)
  const [equipmentQty, setEquipmentQty] = useState({})
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const from = new Date().toISOString()
    const to = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    Promise.all([getSchool(schoolId), getLessonSlots(lessonId, { from, to })])
      .then(([schoolData, slotPage]) => {
        setSchool(schoolData)
        setSlots((slotPage.content ?? []).filter((s) => s.status === 'OPEN'))
      })
      .finally(() => setLoading(false))
  }, [schoolId, lessonId])

  const lesson = useMemo(() => school?.lessons?.find((l) => String(l.id) === String(lessonId)), [school, lessonId])

  const setQty = (equipmentId, field, value) => {
    setEquipmentQty((current) => ({
      ...current,
      [equipmentId]: { ...current[equipmentId], [field]: value },
    }))
  }

  const equipmentItems = Object.entries(equipmentQty)
    .filter(([, v]) => v?.quantity > 0)
    .map(([equipmentId, v]) => ({
      equipmentId: Number(equipmentId),
      quantity: Number(v.quantity),
      rentalUnit: v.rentalUnit ?? 'HOUR',
    }))

  const handleConfirm = async () => {
    if (!slotId) return
    setSubmitting(true)
    setError('')
    try {
      const booking = await createBooking({
        lessonSlotId: slotId,
        participants: Number(participants),
        equipmentItems: equipmentItems.length > 0 ? equipmentItems : undefined,
        note: note || undefined,
      })
      navigate('/surfer/book/confirmed', { state: { booking } })
    } catch (err) {
      const apiError = err.response?.data?.error
      setError(apiError?.message || 'Could not create the booking.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <SurferLayout title="Book a Lesson">
        <p>Loading...</p>
      </SurferLayout>
    )
  }

  if (!lesson) {
    return (
      <SurferLayout title="Book a Lesson">
        <p className="empty-state">Lesson not found.</p>
      </SurferLayout>
    )
  }

  return (
    <SurferLayout title="Book a Lesson">
      <div className="grid-2">
        <div className="card">
          <h2 className="card-title">{lesson.title}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
            {school.name} &middot; {lesson.lessonType} &middot; {lesson.durationMinutes} min
          </p>

          <div className="form-group">
            <label className="form-label">Choose a Time Slot</label>
            {slots.length === 0 && <p className="empty-state">No open slots in the next 14 days.</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
              {slots.map((slot) => (
                <label
                  key={slot.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: 12,
                    border: `2px solid ${slotId === slot.id ? 'var(--primary-blue)' : 'var(--border-color)'}`,
                    borderRadius: 10,
                    cursor: 'pointer',
                  }}
                >
                  <span>
                    <input type="radio" name="slot" checked={slotId === slot.id} onChange={() => setSlotId(slot.id)} style={{ marginRight: 8 }} />
                    {new Date(slot.startTime).toLocaleString()} with {slot.instructorName}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{slot.bookedCount}/{slot.capacity}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="participants">Participants</label>
            <input id="participants" type="number" min="1" className="form-input" value={participants} onChange={(e) => setParticipants(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="note">Note (optional)</label>
            <textarea id="note" className="form-input" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Equipment Rental (optional)</h3>
          {(school.equipment ?? []).length === 0 && <p className="empty-state">This school has no rental equipment.</p>}
          {(school.equipment ?? []).map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  ${item.rentalPricePerHour}/hr &middot; ${item.rentalPricePerDay}/day
                </div>
              </div>
              <input
                type="number"
                min="0"
                className="form-input"
                style={{ width: 70 }}
                value={equipmentQty[item.id]?.quantity ?? 0}
                onChange={(e) => setQty(item.id, 'quantity', e.target.value)}
              />
              <select
                className="form-select"
                style={{ width: 110 }}
                value={equipmentQty[item.id]?.rentalUnit ?? 'HOUR'}
                onChange={(e) => setQty(item.id, 'rentalUnit', e.target.value)}
              >
                <option value="HOUR">Per Hour</option>
                <option value="DAY">Per Day</option>
              </select>
            </div>
          ))}

          {error && <p className="error-text">{error}</p>}

          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <Link to={`/schools/${schoolId}`} className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>
              Back
            </Link>
            <button type="button" className="btn btn-primary" style={{ flex: 1 }} disabled={!slotId || submitting} onClick={handleConfirm}>
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </SurferLayout>
  )
}

export default BookLessonSlot
