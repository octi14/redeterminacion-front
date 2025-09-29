const EstadisticasService = require('../service/estadisticas')

export const state = () => ({
  estadisticasModulos: null,
  estadisticasUsuarios: null,
  estadisticasActividad: null,
  loading: false,
  error: null,
  // Datos sin filtrar para poder aplicar filtros localmente
  rawData: {
    habilitaciones: [],
    obras: [],
    turnos: [],
    pagosDobles: [],
    indices: [],
    multimedias: [],
    abiertoAnual: [],
    certificados: [],
    combustible: [],
    valesCombustible: []
  },
  currentDateFilter: null
})

export const actions = {


  async fetchEstadisticasModulos({ commit, state }, { startDate, endDate } = {}) {
    commit('setLoading', true)
    commit('setError', null)
    try {
      // Si no hay datos raw, cargarlos por primera vez
      if (!state.rawData.habilitaciones.length) {
        const rawData = await EstadisticasService.getRawData(this.$axios)
        commit('setRawData', rawData)
      }

      // Aplicar filtro local si se proporcionan fechas
      let data
      if (startDate && endDate) {
        data = await EstadisticasService.getEstadisticasPorModuloFiltered(state.rawData, { startDate, endDate })
        commit('setCurrentDateFilter', { startDate, endDate })
      } else {
        data = await EstadisticasService.getEstadisticasPorModuloFromRaw(state.rawData)
        commit('setCurrentDateFilter', null)
      }

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

  async fetchAllEstadisticas({ dispatch }, { startDate, endDate } = {}) {
    try {
      await Promise.all([
        dispatch('fetchEstadisticasModulos', { startDate, endDate }),
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
  },
  setRawData(state, data) {
    state.rawData = data
  },
  setCurrentDateFilter(state, filter) {
    state.currentDateFilter = filter
  }
}

export const getters = {
  isLoading: state => state.loading,
  hasError: state => !!state.error,
  errorMessage: state => state.error
}
