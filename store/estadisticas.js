const EstadisticasService = require('../service/estadisticas')

export const state = () => ({
  estadisticasModulos: {},
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


  // Carga monolítica (legacy): usa getRawData + getEstadisticasPorModuloFromRaw. Preferir fetchAllEstadisticas (carga progresiva por módulo).
  async fetchEstadisticasModulos({ commit, state }, { startDate, endDate } = {}) {
    commit('setLoading', true)
    commit('setError', null)
    try {
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

  async fetchAllEstadisticas({ commit, dispatch }, { startDate, endDate } = {}) {
    commit('setLoading', true)
    commit('setError', null)
    const filter = (startDate && endDate) ? { startDate, endDate } : {}
    if (startDate && endDate) {
      commit('setCurrentDateFilter', { startDate, endDate })
    } else {
      commit('setCurrentDateFilter', null)
    }
    dispatch('fetchModuloComercio', filter)
    dispatch('fetchModuloObras', filter)
    dispatch('fetchModuloTurnos', filter)
    dispatch('fetchModuloRecaudaciones', filter)
    dispatch('fetchModuloCombustible', filter)
    dispatch('fetchModuloAbiertoAnual', filter)
    dispatch('fetchModuloIndices', filter)
    dispatch('fetchEstadisticasUsuarios')
  },

  async fetchModuloComercio({ commit }, { startDate, endDate } = {}) {
    try {
      const raw = await EstadisticasService.getRawDataComercio(this.$axios)
      const data = EstadisticasService.getEstadisticasComercioFromRaw(raw, { startDate, endDate })
      commit('setModulo', { name: 'comercio', data })
    } catch (error) {
      commit('setError', error.message)
    } finally {
      commit('setLoading', false)
    }
  },

  async fetchModuloObras({ commit }, { startDate, endDate } = {}) {
    try {
      const raw = await EstadisticasService.getRawDataObras(this.$axios)
      const data = EstadisticasService.getEstadisticasObrasFromRaw(raw, { startDate, endDate })
      commit('setModulo', { name: 'obras', data })
    } catch (error) {
      commit('setError', error.message)
    } finally {
      commit('setLoading', false)
    }
  },

  async fetchModuloTurnos({ commit }, { startDate, endDate } = {}) {
    try {
      const raw = await EstadisticasService.getRawDataTurnos(this.$axios)
      const data = EstadisticasService.getEstadisticasTurnosFromRaw(raw, { startDate, endDate })
      commit('setModulo', { name: 'turnos', data })
    } catch (error) {
      commit('setError', error.message)
    } finally {
      commit('setLoading', false)
    }
  },

  async fetchModuloRecaudaciones({ commit }, { startDate, endDate } = {}) {
    try {
      const raw = await EstadisticasService.getRawDataRecaudaciones(this.$axios)
      const data = EstadisticasService.getEstadisticasRecaudacionesFromRaw(raw, { startDate, endDate })
      commit('setModulo', { name: 'recaudaciones', data })
    } catch (error) {
      commit('setError', error.message)
    } finally {
      commit('setLoading', false)
    }
  },

  async fetchModuloCombustible({ commit }, { startDate, endDate } = {}) {
    try {
      const raw = await EstadisticasService.getRawDataCombustible(this.$axios)
      let result
      if (startDate && endDate) {
        result = await EstadisticasService.getEstadisticasCombustibleFiltered(raw, { startDate, endDate })
      } else {
        result = await EstadisticasService.getEstadisticasCombustibleFromRaw(raw)
      }
      commit('setModulo', { name: 'combustible', data: result.combustible })
    } catch (error) {
      commit('setError', error.message)
    } finally {
      commit('setLoading', false)
    }
  },

  async fetchModuloAbiertoAnual({ commit }, { startDate, endDate } = {}) {
    try {
      const raw = await EstadisticasService.getRawDataAbiertoAnual(this.$axios)
      const data = EstadisticasService.getEstadisticasAbiertoAnualFromRaw(raw, { startDate, endDate })
      commit('setModulo', { name: 'abiertoAnual', data })
    } catch (error) {
      commit('setError', error.message)
    } finally {
      commit('setLoading', false)
    }
  },

  async fetchModuloIndices({ commit }) {
    try {
      const raw = await EstadisticasService.getRawDataIndices(this.$axios)
      const data = EstadisticasService.getEstadisticasIndicesFromRaw(raw)
      commit('setModulo', { name: 'indices', data })
    } catch (error) {
      commit('setError', error.message)
    } finally {
      commit('setLoading', false)
    }
  },

  async fetchEstadisticasCombustible({ commit, state }, { startDate, endDate } = {}) {
    commit('setLoading', true)
    commit('setError', null)
    try {
      // Cargar solo datos de combustible
      const rawDataCombustible = await EstadisticasService.getRawDataCombustible(this.$axios)
      
      // Aplicar filtro de fecha si se proporcionan fechas
      let data
      if (startDate && endDate) {
        data = await EstadisticasService.getEstadisticasCombustibleFiltered(rawDataCombustible, { startDate, endDate })
        commit('setCurrentDateFilter', { startDate, endDate })
      } else {
        // Si no hay filtro, calcular estadísticas sin filtrar
        data = await EstadisticasService.getEstadisticasCombustibleFromRaw(rawDataCombustible)
        commit('setCurrentDateFilter', null)
      }

      // Actualizar solo la parte de combustible en estadisticasModulos
      const currentModulos = state.estadisticasModulos || {}
      commit('setEstadisticasModulos', {
        ...currentModulos,
        combustible: data.combustible
      })
      
      return data
    } catch (error) {
      commit('setError', error.message)
      throw error
    } finally {
      commit('setLoading', false)
    }
  }
}

export const mutations = {
  setEstadisticasModulos(state, data) {
    state.estadisticasModulos = data
  },
  setModulo(state, { name, data }) {
    state.estadisticasModulos = { ...(state.estadisticasModulos || {}), [name]: data }
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
