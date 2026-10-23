import { useEffect, useState } from 'react'
import SurferLayout from '../../layouts/SurferLayout'
import { listLocations, getConditions } from '../../api/locationsApi'

function SurfSpots() {
  const [locations, setLocations] = useState([])
  const [conditionsById, setConditionsById] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listLocations()
      .then(async (list) => {
        setLocations(list)
        const entries = await Promise.all(
          list.map(async (loc) => {
            try {
              return [loc.id, await getConditions(loc.id)]
            } catch {
              return [loc.id, null]
            }
          }),
        )
        setConditionsById(Object.fromEntries(entries))
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <SurferLayout title="Surf Spot Explorer">
      {loading && <p>Loading...</p>}
      <div className="grid-3">
        {locations.map((loc) => {
          const today = conditionsById[loc.id]?.days?.[0]
          return (
            <div key={loc.id} className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, marginBottom: 4 }}>{loc.name}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>{loc.region}</p>
              {today && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className="status-badge status-good">{today.maxWaveHeightM} m waves</span>
                  <span className="status-badge status-pending">{Math.round(today.avgWindSpeedKmh)} km/h wind</span>
                  <span className="status-badge status-confirmed">{Math.round(today.avgTemperatureC)}&deg;C</span>
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
