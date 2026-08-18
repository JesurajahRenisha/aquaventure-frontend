import apiClient from './apiClient'

export const listProgressForTourist = (touristId) =>
  apiClient.get(`/progress/tourist/${touristId}`).then((r) => r.data)

export const createProgress = (data) => apiClient.post('/progress', data).then((r) => r.data)

export const updateProgress = (id, data) => apiClient.put(`/progress/${id}`, data).then((r) => r.data)
