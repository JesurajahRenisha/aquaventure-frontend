import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import apiClient from '../../api/apiClient'

const ROLES = ['ALL', 'SURFER', 'PROVIDER', 'INSTRUCTOR', 'ADMIN']

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState('ALL')

  useEffect(() => {
    apiClient
      .get('/users')
      .then((r) => setUsers(r.data))
      .finally(() => setLoading(false))
  }, [])

  const visible = roleFilter === 'ALL' ? users : users.filter((u) => u.role === roleFilter)

  return (
    <DashboardLayout role="ADMIN" title="Users">
      <div className="card">
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              className={r === roleFilter ? 'btn btn-primary' : 'btn btn-secondary'}
              onClick={() => setRoleFilter(r)}
            >
              {r.charAt(0) + r.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {loading && <p>Loading...</p>}
        {!loading && visible.length === 0 && <p className="empty-state">No users found.</p>}

        {!loading && visible.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((u) => (
                  <tr key={u.userId}>
                    <td>{u.userId}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phoneNumber || '-'}</td>
                    <td>{u.role}</td>
                    <td>
                      <span className={`status-badge status-${u.enabled ? 'active' : 'inactive'}`}>
                        {u.enabled ? 'Enabled' : 'Disabled'}
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

export default AdminUsers
