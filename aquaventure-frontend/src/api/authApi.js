import apiClient from './apiClient'

export const registerSurfer = (data) => apiClient.post('/auth/register/surfer', data).then((r) => r.data)

export const registerSchool = (formData) =>
  apiClient.post('/auth/register/school', formData).then((r) => r.data)

export const login = (data) => apiClient.post('/auth/login', data).then((r) => r.data)
