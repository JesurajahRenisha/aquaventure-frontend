import apiClient from './apiClient'

export const register = (data) => apiClient.post('/auth/register', data).then((r) => r.data)

export const login = (data) => apiClient.post('/auth/login', data).then((r) => r.data)

export const resetPassword = (data) => apiClient.post('/auth/reset-password', data).then((r) => r.data)

export const getMe = () => apiClient.get('/auth/me').then((r) => r.data)
