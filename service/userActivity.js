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
  getAll: async (axios) => {
    const response = await axios.$get('/user-activities')
    return response.data.map(formatUserActivity)
  },

  getByUser: async (axios, { userId }) => {
    const response = await axios.$get(`/user-activities/user/${userId}`)
    return response.data.map(formatUserActivity)
  },

  getRecent: async (axios, { limit = 50 }) => {
    try {
      const response = await axios.$get('/user-activities')
      const activities = response.data.map(formatUserActivity)
      // Ordenar por timestamp descendente y limitar
      return activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit)
    } catch (error) {
      console.warn('Error al obtener actividades recientes, usando endpoint principal:', error)
      // Fallback al endpoint principal
      const response = await axios.$get('/user-activities')
      return response.data.map(formatUserActivity)
    }
  },

  getFiltered: async (axios, { startDate, endDate, limit = 50 }) => {
    try {
      const response = await axios.$get('/user-activities')
      const activities = response.data.map(formatUserActivity)

      // Filtrar por rango de fechas
      const filteredActivities = activities.filter(activity => {
        const activityDate = new Date(activity.timestamp)
        const start = new Date(startDate)
        const end = new Date(endDate)

        // Normalizar fechas a inicio del día
        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)
        activityDate.setHours(0, 0, 0, 0)

        return activityDate >= start && activityDate <= end
      })

      // Ordenar por timestamp descendente y limitar
      return filteredActivities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit)
    } catch (error) {
      console.error('Error al obtener actividades filtradas:', error)
      throw error
    }
  }
}
