import apiClient from './apiClient'

export const createBooking = (data) => apiClient.post('/bookings', data).then((r) => r.data)

export const searchBookings = (params = {}) => apiClient.get('/bookings', { params }).then((r) => r.data)

export const getBooking = (id) => apiClient.get(`/bookings/${id}`).then((r) => r.data)

export const updateBookingStatus = (id, status) =>
  apiClient.put(`/bookings/${id}/status`, { status }).then((r) => r.data)

export const payForBooking = (id, paymentMethod) =>
  apiClient.post(`/bookings/${id}/payment`, { paymentMethod }).then((r) => r.data)
