import { useEffect, useState } from 'react'
import SurferLayout from '../../layouts/SurferLayout'
import { listLocations } from '../../api/locationsApi'
import { getWeatherForLocation } from '../../api/weatherApi'

function SurfConditions() {
  const [locations, setLocations] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    listLocations().then((list) => {
      setLocations(list)
      if (list.length > 0) setSelectedId(list[0].locationId)
    })
  }, [])

  useEffect(() => {
    if (selectedId) getWeatherForLocation(selectedId).then(setWeather)
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
            <option key={loc.locationId} value={loc.locationId}>{loc.locationName}</option>
          ))}
        </select>
      </div>

      {weather && (
        <div className="grid-3">
          <div className="stat-box">
            <div className="stat-label">Wave Height</div>
            <div className="stat-value">{weather.waveHeight} m</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Wind Speed</div>
            <div className="stat-value">{weather.windSpeed} km/h</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Temperature</div>
            <div className="stat-value">{weather.temperature}&deg;C</div>
          </div>
        </div>
      )}
      {weather && (
        <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
          {weather.fromCache ? 'Cached reading' : 'Freshly fetched'} at{' '}
          {new Date(weather.recordedAt).toLocaleString()}
        </p>
      )}
    </SurferLayout>
  )
}

export default SurfConditions
