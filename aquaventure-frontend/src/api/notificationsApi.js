import apiClient from './apiClient'

export const getMyNotifications = (params = {}) =>
  apiClient.get('/notifications/me', { params }).then((r) => r.data)

export const markRead = (id) => apiClient.patch(`/notifications/${id}/read`).then((r) => r.data)

export const markAllRead = () => apiClient.patch('/notifications/me/read-all').then((r) => r.data)
