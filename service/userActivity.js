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
    const response = await axios.$get(`/user-activities/recent?limit=${limit}`)
    return response.data.map(formatUserActivity)
  }
}
