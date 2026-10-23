import apiClient from './apiClient'

export const searchSchools = (params = {}) => apiClient.get('/schools', { params }).then((r) => r.data)

export const getSchool = (id) => apiClient.get(`/schools/${id}`).then((r) => r.data)

export const compareSchools = (ids) =>
  apiClient.get('/schools/compare', { params: { ids: ids.join(',') } }).then((r) => r.data)

export const getSchoolDocument = (schoolId, index) =>
  apiClient.get(`/schools/${schoolId}/documents/${index}`, { responseType: 'blob' }).then((r) => r.data)
