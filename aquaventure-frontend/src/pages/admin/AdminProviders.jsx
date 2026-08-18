import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import apiClient from '../../api/apiClient'

function AdminProviders() {
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient
      .get('/users')
      .then((r) => setProviders(r.data.filter((u) => u.role === 'PROVIDER')))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout role="ADMIN" title="Surf Providers">
      <div className="card">
        <h2 className="card-title">Registered Providers ({providers.length})</h2>

        {loading && <p>Loading...</p>}
        {!loading && providers.length === 0 && <p className="empty-state">No providers registered yet.</p>}

        {!loading && providers.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Contact Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((p) => (
                  <tr key={p.userId}>
                    <td>{p.userId}</td>
                    <td>{p.name}</td>
                    <td>{p.email}</td>
                    <td>{p.phoneNumber || '-'}</td>
                    <td>
                      <span className={`status-badge status-${p.enabled ? 'active' : 'inactive'}`}>
                        {p.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AdminProviders
