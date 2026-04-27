import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/auth'

export const register = (data) => axios.post(`${API}/register`, data)

export const login = (data) => axios.post(`${API}/login`, data).then(response => response.data)
