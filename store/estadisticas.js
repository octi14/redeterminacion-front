const EstadisticasService = require('../service/estadisticas')

export const state = () => ({
  estadisticasModulos: null,
  estadisticasUsuarios: null,
  estadisticasActividad: null,
  loading: false,
  error: null
})

export const actions = {


  async fetchEstadisticasModulos({ commit }) {
    commit('setLoading', true)
    commit('setError', null)
    try {
      const data = await EstadisticasService.getEstadisticasPorModulo(this.$axios)
      commit('setEstadisticasModulos', data)
      return data
    } catch (error) {
      commit('setError', error.message)
      throw error
    } finally {
      commit('setLoading', false)
    }
  },

  async fetchEstadisticasUsuarios({ commit }) {
    commit('setLoading', true)
    commit('setError', null)
    try {
      const data = await EstadisticasService.getEstadisticasUsuarios(this.$axios)
      commit('setEstadisticasUsuarios', data)
      return data
    } catch (error) {
      commit('setError', error.message)
      throw error
    } finally {
      commit('setLoading', false)
    }
  },

  async fetchEstadisticasActividad({ commit }, { fechaInicio, fechaFin }) {
    commit('setLoading', true)
    commit('setError', null)
    try {
      const data = await EstadisticasService.getEstadisticasActividad(this.$axios, { fechaInicio, fechaFin })
      commit('setEstadisticasActividad', data)
      return data
    } catch (error) {
      commit('setError', error.message)
      throw error
    } finally {
      commit('setLoading', false)
    }
  },

  async fetchAllEstadisticas({ dispatch }) {
    try {
      await Promise.all([
        dispatch('fetchEstadisticasModulos'),
        dispatch('fetchEstadisticasUsuarios')
      ])
    } catch (error) {
      console.error('Error al cargar todas las estadísticas:', error)
      throw error
    }
  }
}

export const mutations = {
  setEstadisticasModulos(state, data) {
    state.estadisticasModulos = data
  },
  setEstadisticasUsuarios(state, data) {
    state.estadisticasUsuarios = data
  },
  setEstadisticasActividad(state, data) {
    state.estadisticasActividad = data
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  setError(state, error) {
    state.error = error
  }
}

export const getters = {
  isLoading: state => state.loading,
  hasError: state => !!state.error,
  errorMessage: state => state.error
}
