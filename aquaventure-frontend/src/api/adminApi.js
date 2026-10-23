import apiClient from './apiClient'

export const listSchools = (params = {}) => apiClient.get('/admin/schools', { params }).then((r) => r.data)
export const getSchool = (id) => apiClient.get(`/admin/schools/${id}`).then((r) => r.data)
export const approveSchool = (id) => apiClient.patch(`/admin/schools/${id}/approve`).then((r) => r.data)
export const rejectSchool = (id, reason) =>
  apiClient.patch(`/admin/schools/${id}/reject`, { reason }).then((r) => r.data)
export const suspendSchool = (id) => apiClient.patch(`/admin/schools/${id}/suspend`).then((r) => r.data)
export const reactivateSchool = (id) =>
  apiClient.patch(`/admin/schools/${id}/reactivate`).then((r) => r.data)

export const listUsers = (params = {}) => apiClient.get('/admin/users', { params }).then((r) => r.data)
export const suspendUser = (id) => apiClient.patch(`/admin/users/${id}/suspend`).then((r) => r.data)
export const reactivateUser = (id) =>
  apiClient.patch(`/admin/users/${id}/reactivate`).then((r) => r.data)

export const listAllLocations = () => apiClient.get('/admin/locations').then((r) => r.data)
export const createLocation = (data) => apiClient.post('/admin/locations', data).then((r) => r.data)
export const updateLocation = (id, data) =>
  apiClient.put(`/admin/locations/${id}`, data).then((r) => r.data)
export const deleteLocation = (id) => apiClient.delete(`/admin/locations/${id}`).then((r) => r.data)

export const getStats = () => apiClient.get('/admin/stats').then((r) => r.data)
