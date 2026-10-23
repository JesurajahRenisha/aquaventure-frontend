import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { listUsers, suspendUser, reactivateUser } from '../../api/adminApi'

const ROLES = ['ALL', 'SURFER', 'SCHOOL_ADMIN', 'PLATFORM_ADMIN']

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [query, setQuery] = useState('')

  const load = async () => {
    setLoading(true)
    const params = {}
    if (roleFilter !== 'ALL') params.role = roleFilter
    if (query) params.q = query
    const page = await listUsers(params)
    setUsers(page.content ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter])

  const handleToggle = async (user) => {
    if (user.status === 'ACTIVE') {
      await suspendUser(user.id)
    } else {
      await reactivateUser(user.id)
    }
    load()
  }

  return (
    <DashboardLayout role="PLATFORM_ADMIN" title="Users">
      <div className="card">
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              className={r === roleFilter ? 'btn btn-primary' : 'btn btn-secondary'}
              onClick={() => setRoleFilter(r)}
            >
              {r}
            </button>
          ))}
          <input
            className="form-input"
            style={{ maxWidth: 220, marginLeft: 'auto' }}
            placeholder="Search name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
          />
          <button type="button" className="btn btn-secondary" onClick={load}>Search</button>
        </div>

        {loading && <p>Loading...</p>}
        {!loading && users.length === 0 && <p className="empty-state">No users found.</p>}

        {!loading && users.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.firstname} {u.lastname}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <span className={`status-badge status-${u.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <button type="button" className={u.status === 'ACTIVE' ? 'btn btn-danger' : 'btn btn-secondary'} onClick={() => handleToggle(u)}>
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Reactivate'}
                      </button>
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
