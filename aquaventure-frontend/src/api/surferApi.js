import apiClient from './apiClient'

export const getMyProfile = () => apiClient.get('/surfer/me/profile').then((r) => r.data)
export const updateMyProfile = (data) => apiClient.put('/surfer/me/profile', data).then((r) => r.data)

export const getRecommendations = () => apiClient.get('/surfer/me/recommendations').then((r) => r.data)

export const createBooking = (data) => apiClient.post('/bookings', data).then((r) => r.data)

export const getMyBookings = (params = {}) =>
  apiClient.get('/surfer/me/bookings', { params }).then((r) => r.data)

export const cancelBooking = (id) =>
  apiClient.patch(`/surfer/me/bookings/${id}/cancel`).then((r) => r.data)

export const getMyProgress = (params = {}) =>
  apiClient.get('/surfer/me/progress', { params }).then((r) => r.data)

export const createProgress = (data) => apiClient.post('/surfer/me/progress', data).then((r) => r.data)

export const updateProgress = (id, data) =>
  apiClient.put(`/surfer/me/progress/${id}`, data).then((r) => r.data)

export const deleteProgress = (id) => apiClient.delete(`/surfer/me/progress/${id}`).then((r) => r.data)

export const getProgressSummary = () => apiClient.get('/surfer/me/progress/summary').then((r) => r.data)
