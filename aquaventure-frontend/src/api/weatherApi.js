import apiClient from './apiClient'

export const getWeatherForLocation = (locationId) =>
  apiClient.get(`/weather/location/${locationId}`).then((r) => r.data)
