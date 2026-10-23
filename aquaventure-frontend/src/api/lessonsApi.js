import apiClient from './apiClient'

export const getLessonSlots = (lessonId, { from, to } = {}) =>
  apiClient.get(`/lessons/${lessonId}/slots`, { params: { from, to } }).then((r) => r.data)
