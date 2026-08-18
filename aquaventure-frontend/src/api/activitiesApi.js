import apiClient from './apiClient'

export const searchActivities = (params = {}) => apiClient.get('/activities', { params }).then((r) => r.data)

export const getActivity = (id) => apiClient.get(`/activities/${id}`).then((r) => r.data)

export const createActivity = (data) => apiClient.post('/activities', data).then((r) => r.data)

export const updateActivity = (id, data) => apiClient.put(`/activities/${id}`, data).then((r) => r.data)

export const deleteActivity = (id) => apiClient.delete(`/activities/${id}`).then((r) => r.data)
