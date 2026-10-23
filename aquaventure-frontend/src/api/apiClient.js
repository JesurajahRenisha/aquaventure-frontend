import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

const apiClient = axios.create({ baseURL: API_BASE_URL })

function attachToken(config) {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

apiClient.interceptors.request.use(attachToken)

function handleAuthError(error) {
  if (error.response?.status === 401) {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    if (window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
  }
  return Promise.reject(error)
}

function unwrapEnvelope(response) {
  const body = response.data
  if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
    response.data = body.data
  }
  return response
}

apiClient.interceptors.response.use(unwrapEnvelope, handleAuthError)

export default apiClient
