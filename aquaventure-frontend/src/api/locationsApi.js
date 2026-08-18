import apiClient from './apiClient'

export const listLocations = () => apiClient.get('/locations').then((r) => r.data)

export const getLocation = (id) => apiClient.get(`/locations/${id}`).then((r) => r.data)

export const createLocation = (data) => apiClient.post('/locations', data).then((r) => r.data)

export const updateLocation = (id, data) => apiClient.put(`/locations/${id}`, data).then((r) => r.data)

export const deleteLocation = (id) => apiClient.delete(`/locations/${id}`).then((r) => r.data)
