const formatUserActivity = (activityResponse) => ({
  id: activityResponse._id,
  userId: activityResponse.userId,
  actionType: activityResponse.actionType,
  actionResult: activityResponse.actionResult,
  timestamp: new Date(activityResponse.timestamp),
  sessionId: activityResponse.sessionId,
  visitedUrl: activityResponse.visitedUrl,
  deviceInfo: activityResponse.deviceInfo || {}
})

module.exports = {
  // Todas las actividades (sin filtro de fecha)
  getAll: async (axios) => {
    const response = await axios.$get('/user-activities')
    return response.data.map(formatUserActivity)
  },

  // Últimos N días (pide al backend, más eficiente)
  getLastDays: async (axios, { days = 30 }) => {
    const response = await axios.$get('/user-activities', { params: { days } })
    return response.data.map(formatUserActivity)
  },

  getByUser: async (axios, { userId }) => {
    const response = await axios.$get(`/user-activities/user/${userId}`)
    return response.data.map(formatUserActivity)
  },

  getRecent: async (axios, { limit = 50 }) => {
    const response = await axios.$get('/user-activities', { params: { days: 30 } })
    const activities = response.data.map(formatUserActivity)
    return activities.slice(0, limit)
  },

  getFiltered: async (axios, { startDate, endDate }) => {
    const response = await axios.$get('/user-activities', {
      params: { startDate, endDate }
    })
    return response.data.map(formatUserActivity)
  }
}
