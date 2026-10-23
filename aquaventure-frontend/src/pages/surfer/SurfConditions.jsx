import { useEffect, useState } from 'react'
import SurferLayout from '../../layouts/SurferLayout'
import { listLocations, getConditions } from '../../api/locationsApi'

function suitabilityClass(label) {
  return label === 'SUITABLE' ? 'status-good' : 'status-rejected'
}

function SurfConditions() {
  const [locations, setLocations] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [conditions, setConditions] = useState(null)

  useEffect(() => {
    listLocations().then((list) => {
      setLocations(list)
      if (list.length > 0) setSelectedId(list[0].id)
    })
  }, [])

  useEffect(() => {
    if (selectedId) getConditions(selectedId).then(setConditions).catch(() => setConditions(null))
  }, [selectedId])

  return (
    <SurferLayout title="Surf Conditions">
      <div className="card" style={{ marginBottom: 24 }}>
        <label className="form-label" htmlFor="loc">Surf Spot</label>
        <select
          id="loc"
          className="form-select"
          value={selectedId ?? ''}
          onChange={(e) => setSelectedId(Number(e.target.value))}
        >
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
          ))}
        </select>
      </div>

      {conditions && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {conditions.days.map((day) => (
            <div key={day.date} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <strong>{new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</strong>
              </div>
              <div className="grid-4" style={{ marginBottom: 12 }}>
                <div className="stat-box">
                  <div className="stat-label">Wave Height</div>
                  <div className="stat-value">{day.maxWaveHeightM} m</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Swell Period</div>
                  <div className="stat-value">{day.avgSwellPeriodSec.toFixed(1)}s</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Wind Speed</div>
                  <div className="stat-value">{Math.round(day.avgWindSpeedKmh)} km/h</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Temperature</div>
                  <div className="stat-value">{Math.round(day.avgTemperatureC)}&deg;C</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {Object.entries(day.suitability ?? {}).map(([level, label]) => (
                  <span key={level} className={`status-badge ${suitabilityClass(label)}`}>
                    {level}: {label === 'SUITABLE' ? 'Suitable' : 'Not Suitable'}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {!conditions && <p className="empty-state">Conditions unavailable right now.</p>}
    </SurferLayout>
  )
}

export default SurfConditions
