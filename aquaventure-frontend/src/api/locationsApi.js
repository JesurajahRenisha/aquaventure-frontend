import apiClient from './apiClient'

export const listLocations = () => apiClient.get('/locations').then((r) => r.data)

export const getConditions = (locationId) =>
  apiClient.get(`/locations/${locationId}/conditions`).then((r) => r.data)
