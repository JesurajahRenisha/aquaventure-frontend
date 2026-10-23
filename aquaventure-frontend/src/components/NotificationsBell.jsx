import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyNotifications, markRead, markAllRead } from '../api/notificationsApi'
import { useAuth } from '../context/AuthContext'

const POLL_MS = 30000

function routeForNotification(type, user) {
  if (type?.startsWith('BOOKING_')) {
    return user.role === 'SURFER' ? '/surfer/bookings' : '/school/bookings'
  }
  if (type?.startsWith('SCHOOL_')) {
    return user.role === 'SCHOOL_ADMIN' ? '/school/profile' : '/admin/schools'
  }
  return null
}

function NotificationsBell() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const load = async () => {
    try {
      const page = await getMyNotifications()
      setNotifications(page.content ?? [])
    } catch {
      // keep whatever we already have on a transient failure
    }
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, POLL_MS)
    window.addEventListener('focus', load)
    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', load)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleItemClick = async (notification) => {
    if (!notification.read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      )
      markRead(notification.id).catch(() => {})
    }
    setOpen(false)
    const route = routeForNotification(notification.type, user)
    if (route) navigate(route)
  }

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    try {
      await markAllRead()
    } catch {
      load()
    }
  }

  return (
    <div className="notif-bell" ref={containerRef}>
      <span onClick={() => setOpen((o) => !o)} title="Notifications">
        🔔{unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </span>
      {open && (
        <div className="notif-dropdown">
          <div className="notif-dropdown-header">
            <strong>Notifications</strong>
            <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: 12 }} onClick={handleMarkAllRead}>
              Mark all read
            </button>
          </div>
          {notifications.length === 0 && <div className="empty-state">No notifications yet</div>}
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`notif-item${n.read ? '' : ' unread'}`}
              onClick={() => handleItemClick(n)}
            >
              {n.message ?? n.type}
              <div className="notif-item-time">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationsBell
