import { useEffect, useState } from 'react'
import SurferLayout from '../../layouts/SurferLayout'
import { listLocations } from '../../api/locationsApi'
import { getWeatherForLocation } from '../../api/weatherApi'

function SurfSpots() {
  const [locations, setLocations] = useState([])
  const [weatherById, setWeatherById] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listLocations()
      .then(async (list) => {
        setLocations(list)
        const entries = await Promise.all(
          list.map(async (loc) => {
            try {
              return [loc.locationId, await getWeatherForLocation(loc.locationId)]
            } catch {
              return [loc.locationId, null]
            }
          }),
        )
        setWeatherById(Object.fromEntries(entries))
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <SurferLayout title="Surf Spot Explorer">
      {loading && <p>Loading...</p>}
      <div className="grid-3">
        {locations.map((loc) => {
          const w = weatherById[loc.locationId]
          return (
            <div key={loc.locationId} className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, marginBottom: 4 }}>{loc.locationName}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
                Difficulty: {loc.difficultyLevel} &middot; Safety {loc.safetyRating}/5
              </p>
              {w && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className="status-badge status-good">{w.waveHeight} m waves</span>
                  <span className="status-badge status-pending">{w.windSpeed} km/h wind</span>
                  <span className="status-badge status-confirmed">{w.temperature}&deg;C</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </SurferLayout>
  )
}

export default SurfSpots
