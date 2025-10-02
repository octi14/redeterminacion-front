const UserActivityService = require('../service/userActivity')

export const state = () => ({
  all: [],
  recent: [],
  filtered: [],
  loading: false,
  error: null
})

export const actions = {
  async getAll({ commit }) {
    try {
      commit('setLoading', true)
      commit('setError', null)
      const activities = await UserActivityService.getAll(this.$axios)
      commit('setAll', activities)
      return activities
    } catch (error) {
      console.error('Error al cargar actividades de usuarios:', error)
      commit('setError', 'Error al cargar las actividades')
      commit('setAll', [])
      return []
    } finally {
      commit('setLoading', false)
    }
  },

  async getRecent({ commit }, { limit = 50 }) {
    try {
      commit('setLoading', true)
      commit('setError', null)
      const activities = await UserActivityService.getRecent(this.$axios, { limit })
      commit('setRecent', activities)
      return activities
    } catch (error) {
      console.error('Error al cargar actividades recientes:', error)
      commit('setError', 'Error al cargar las actividades recientes')
      commit('setRecent', [])
      return []
    } finally {
      commit('setLoading', false)
    }
  },

  async getByUser({ commit }, { userId }) {
    try {
      commit('setLoading', true)
      commit('setError', null)
      const activities = await UserActivityService.getByUser(this.$axios, { userId })
      commit('setAll', activities)
      return activities
    } catch (error) {
      console.error('Error al cargar actividades del usuario:', error)
      commit('setError', 'Error al cargar las actividades del usuario')
      commit('setAll', [])
      return []
    } finally {
      commit('setLoading', false)
    }
  },

  async refresh({ dispatch }) {
    await dispatch('getAll')
  },

  async getFiltered({ commit }, { startDate, endDate, limit = 50 }) {
    try {
      commit('setLoading', true)
      commit('setError', null)
      const activities = await UserActivityService.getFiltered(this.$axios, { startDate, endDate, limit })
      commit('setFiltered', activities)
      return activities
    } catch (error) {
      console.error('Error al cargar actividades filtradas:', error)
      commit('setError', 'Error al cargar las actividades filtradas')
      commit('setFiltered', [])
      return []
    } finally {
      commit('setLoading', false)
    }
  }
}

export const mutations = {
  setAll(state, activities) {
    state.all = activities
  },

  setRecent(state, activities) {
    state.recent = activities
  },

  setFiltered(state, activities) {
    state.filtered = activities
  },

  setLoading(state, loading) {
    state.loading = loading
  },

  setError(state, error) {
    state.error = error
  },

  clearError(state) {
    state.error = null
  }
}
