import apiClient from './apiClient'

export const getMyUser = () => apiClient.get('/users/me').then((r) => r.data)
export const updateMyUser = (data) => apiClient.put('/users/me', data).then((r) => r.data)

export const getTourist = (id) => apiClient.get(`/tourists/${id}`).then((r) => r.data)
export const updateTourist = (id, data) => apiClient.put(`/tourists/${id}`, data).then((r) => r.data)

export const getProvider = (id) => apiClient.get(`/providers/${id}`).then((r) => r.data)
export const updateProvider = (id, data) => apiClient.put(`/providers/${id}`, data).then((r) => r.data)

export const listInstructorsForProvider = (providerId) =>
  apiClient.get(`/providers/${providerId}/instructors`).then((r) => r.data)
export const getInstructor = (id) => apiClient.get(`/instructors/${id}`).then((r) => r.data)
export const createInstructor = (data) => apiClient.post('/instructors', data).then((r) => r.data)
export const updateInstructor = (id, data) => apiClient.put(`/instructors/${id}`, data).then((r) => r.data)
export const deleteInstructor = (id) => apiClient.delete(`/instructors/${id}`).then((r) => r.data)

export const listEquipmentForProvider = (providerId) =>
  apiClient.get(`/providers/${providerId}/equipment`).then((r) => r.data)
export const createEquipment = (data) => apiClient.post('/equipment', data).then((r) => r.data)
export const updateEquipment = (id, data) => apiClient.put(`/equipment/${id}`, data).then((r) => r.data)
export const deleteEquipment = (id) => apiClient.delete(`/equipment/${id}`).then((r) => r.data)
