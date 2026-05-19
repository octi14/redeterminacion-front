import UserActivityService from '../service/userActivity'
import { defineStore } from 'pinia'

export const useUserActivitiesStore = defineStore('userActivities', {
  state: () => ({
    all: [],
    recent: [],
    filtered: [],
    loading: false,
    error: null,
  }),

  actions: {
    setAll(activities) {
      this.all = activities
    },
    setRecent(activities) {
      this.recent = activities
    },
    setFiltered(activities) {
      this.filtered = activities
    },
    setLoading(loading) {
      this.loading = loading
    },
    setError(error) {
      this.error = error
    },
    clearError() {
      this.error = null
    },

    async getAll() {
      try {
        this.setLoading(true)
        this.setError(null)
        const activities = await UserActivityService.getAll(useApi())
        this.setAll(activities)
        return activities
      } catch (error) {
        console.error('Error al cargar actividades de usuarios:', error)
        this.setError('Error al cargar las actividades')
        this.setAll([])
        return []
      } finally {
        this.setLoading(false)
      }
    },

    async getLastDays({ days = 30 } = {}) {
      try {
        this.setLoading(true)
        this.setError(null)
        const activities = await UserActivityService.getLastDays(useApi(), { days })
        this.setAll(activities)
        return activities
      } catch (error) {
        console.error('Error al cargar actividades de los últimos días:', error)
        this.setError('Error al cargar las actividades')
        this.setAll([])
        return []
      } finally {
        this.setLoading(false)
      }
    },

    async getRecent({ limit = 50 } = {}) {
      try {
        this.setLoading(true)
        this.setError(null)
        const activities = await UserActivityService.getRecent(useApi(), { limit })
        this.setRecent(activities)
        return activities
      } catch (error) {
        console.error('Error al cargar actividades recientes:', error)
        this.setError('Error al cargar las actividades recientes')
        this.setRecent([])
        return []
      } finally {
        this.setLoading(false)
      }
    },

    async getByUser({ userId }) {
      try {
        this.setLoading(true)
        this.setError(null)
        const activities = await UserActivityService.getByUser(useApi(), { userId })
        this.setAll(activities)
        return activities
      } catch (error) {
        console.error('Error al cargar actividades del usuario:', error)
        this.setError('Error al cargar las actividades del usuario')
        this.setAll([])
        return []
      } finally {
        this.setLoading(false)
      }
    },

    async refresh() {
      await this.getAll()
    },

    async getFiltered({ startDate, endDate, limit = 50 }) {
      try {
        this.setLoading(true)
        this.setError(null)
        const activities = await UserActivityService.getFiltered(useApi(), {
          startDate,
          endDate,
          limit,
        })
        this.setFiltered(activities)
        return activities
      } catch (error) {
        console.error('Error al cargar actividades filtradas:', error)
        this.setError('Error al cargar las actividades filtradas')
        this.setFiltered([])
        return []
      } finally {
        this.setLoading(false)
      }
    },
  },
})
