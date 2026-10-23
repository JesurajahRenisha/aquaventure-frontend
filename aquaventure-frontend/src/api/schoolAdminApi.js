import apiClient from './apiClient'

export const getMySchool = () => apiClient.get('/school/me').then((r) => r.data)
export const updateMySchool = (data) => apiClient.put('/school/me', data).then((r) => r.data)

export const listMyInstructors = (params = {}) =>
  apiClient.get('/school/me/instructors', { params }).then((r) => r.data)
export const createInstructor = (data) => apiClient.post('/school/me/instructors', data).then((r) => r.data)
export const updateInstructor = (id, data) =>
  apiClient.put(`/school/me/instructors/${id}`, data).then((r) => r.data)
export const deleteInstructor = (id) =>
  apiClient.delete(`/school/me/instructors/${id}`).then((r) => r.data)

export const listMyLessons = (params = {}) =>
  apiClient.get('/school/me/lessons', { params }).then((r) => r.data)
export const createLesson = (data) => apiClient.post('/school/me/lessons', data).then((r) => r.data)
export const updateLesson = (id, data) =>
  apiClient.put(`/school/me/lessons/${id}`, data).then((r) => r.data)
export const deleteLesson = (id) => apiClient.delete(`/school/me/lessons/${id}`).then((r) => r.data)

export const listMySlots = (params = {}) =>
  apiClient.get('/school/me/slots', { params }).then((r) => r.data)
export const createSlot = (data) => apiClient.post('/school/me/slots', data).then((r) => r.data)
export const updateSlot = (id, data) => apiClient.put(`/school/me/slots/${id}`, data).then((r) => r.data)
export const deleteSlot = (id) => apiClient.delete(`/school/me/slots/${id}`).then((r) => r.data)

export const listMyEquipment = (params = {}) =>
  apiClient.get('/school/me/equipment', { params }).then((r) => r.data)
export const createEquipment = (data) => apiClient.post('/school/me/equipment', data).then((r) => r.data)
export const updateEquipment = (id, data) =>
  apiClient.put(`/school/me/equipment/${id}`, data).then((r) => r.data)
export const deleteEquipment = (id) =>
  apiClient.delete(`/school/me/equipment/${id}`).then((r) => r.data)

export const getMyBookings = (params = {}) =>
  apiClient.get('/school/me/bookings', { params }).then((r) => r.data)
export const acceptBooking = (id) =>
  apiClient.patch(`/school/me/bookings/${id}/accept`).then((r) => r.data)
export const rejectBooking = (id, note) =>
  apiClient.patch(`/school/me/bookings/${id}/reject`, { note }).then((r) => r.data)
export const completeBooking = (id) =>
  apiClient.patch(`/school/me/bookings/${id}/complete`).then((r) => r.data)

export const giveProgressFeedback = (progressId, feedback) =>
  apiClient.patch(`/school/me/progress/${progressId}/feedback`, { feedback }).then((r) => r.data)

export const getDashboard = () => apiClient.get('/school/me/dashboard').then((r) => r.data)
