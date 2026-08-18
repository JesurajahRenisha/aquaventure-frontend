import apiClient from './apiClient'

export const listRecommendationsForTourist = (touristId) =>
  apiClient.get(`/recommendations/tourist/${touristId}`).then((r) => r.data)

export const generateRecommendations = (touristId) =>
  apiClient.post(`/recommendations/generate/${touristId}`).then((r) => r.data)
