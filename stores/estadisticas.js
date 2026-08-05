import EstadisticasService from '../service/estadisticas'
import { defineStore } from 'pinia'

export const useEstadisticasStore = defineStore('estadisticas', {
  state: () => ({
    estadisticasModulos: {},
    estadisticasUsuarios: null,
    estadisticasActividad: null,
    loading: false,
    error: null,
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
      valesCombustible: [],
    },
    currentDateFilter: null,
  }),

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    errorMessage: (state) => state.error,
  },

  actions: {
    setEstadisticasModulos(data) {
      this.estadisticasModulos = data
    },
    setModulo({ name, data }) {
      this.estadisticasModulos = { ...(this.estadisticasModulos || {}), [name]: data }
    },
    setEstadisticasUsuarios(data) {
      this.estadisticasUsuarios = data
    },
    setEstadisticasActividad(data) {
      this.estadisticasActividad = data
    },
    setLoading(loading) {
      this.loading = loading
    },
    setError(error) {
      this.error = error
    },
    setRawData(data) {
      this.rawData = data
    },
    setCurrentDateFilter(filter) {
      this.currentDateFilter = filter
    },

    async fetchEstadisticasModulos({ startDate, endDate } = {}) {
      this.setLoading(true)
      this.setError(null)
      try {
        if (!this.rawData.habilitaciones.length) {
          const rawData = await EstadisticasService.getRawData(useApi())
          this.setRawData(rawData)
        }
        let data
        if (startDate && endDate) {
          data = await EstadisticasService.getEstadisticasPorModuloFiltered(this.rawData, {
            startDate,
            endDate,
          })
          this.setCurrentDateFilter({ startDate, endDate })
        } else {
          data = await EstadisticasService.getEstadisticasPorModuloFromRaw(this.rawData)
          this.setCurrentDateFilter(null)
        }
        this.setEstadisticasModulos(data)
        return data
      } catch (error) {
        this.setError(error.message)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    async fetchEstadisticasUsuarios() {
      this.setLoading(true)
      this.setError(null)
      try {
        const data = await EstadisticasService.getEstadisticasUsuarios(useApi())
        this.setEstadisticasUsuarios(data)
        return data
      } catch (error) {
        this.setError(error.message)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    async fetchEstadisticasActividad({ fechaInicio, fechaFin }) {
      this.setLoading(true)
      this.setError(null)
      try {
        const data = await EstadisticasService.getEstadisticasActividad(useApi(), {
          fechaInicio,
          fechaFin,
        })
        this.setEstadisticasActividad(data)
        return data
      } catch (error) {
        this.setError(error.message)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    async fetchAllEstadisticas({ startDate, endDate } = {}) {
      this.setLoading(true)
      this.setError(null)
      const filter = startDate && endDate ? { startDate, endDate } : {}
      if (startDate && endDate) {
        this.setCurrentDateFilter({ startDate, endDate })
      } else {
        this.setCurrentDateFilter(null)
      }
      await Promise.all([
        this.fetchModuloComercio(filter),
        this.fetchModuloObras(filter),
        this.fetchModuloTurnos(filter),
        this.fetchModuloRecaudaciones(filter),
        this.fetchModuloCombustible(filter),
        this.fetchModuloAbiertoAnual(filter),
        this.fetchModuloIndices(),
        this.fetchEstadisticasUsuarios(),
      ])
    },

    async fetchModuloComercio({ startDate, endDate } = {}) {
      try {
        const raw = await EstadisticasService.getRawDataComercio(useApi())
        const data = EstadisticasService.getEstadisticasComercioFromRaw(raw, { startDate, endDate })
        this.setModulo({ name: 'comercio', data })
      } catch (error) {
        this.setError(error.message)
      } finally {
        this.setLoading(false)
      }
    },

    async fetchModuloObras({ startDate, endDate } = {}) {
      try {
        const raw = await EstadisticasService.getRawDataObras(useApi())
        const data = EstadisticasService.getEstadisticasObrasFromRaw(raw, { startDate, endDate })
        this.setModulo({ name: 'obras', data })
      } catch (error) {
        this.setError(error.message)
      } finally {
        this.setLoading(false)
      }
    },

    async fetchModuloTurnos({ startDate, endDate } = {}) {
      try {
        const raw = await EstadisticasService.getRawDataTurnos(useApi())
        const data = EstadisticasService.getEstadisticasTurnosFromRaw(raw, { startDate, endDate })
        this.setModulo({ name: 'turnos', data })
      } catch (error) {
        this.setError(error.message)
      } finally {
        this.setLoading(false)
      }
    },

    async fetchModuloRecaudaciones({ startDate, endDate } = {}) {
      try {
        const raw = await EstadisticasService.getRawDataRecaudaciones(useApi())
        const data = EstadisticasService.getEstadisticasRecaudacionesFromRaw(raw, {
          startDate,
          endDate,
        })
        this.setModulo({ name: 'recaudaciones', data })
      } catch (error) {
        this.setError(error.message)
      } finally {
        this.setLoading(false)
      }
    },

    async fetchModuloCombustible({ startDate, endDate } = {}) {
      try {
        const raw = await EstadisticasService.getRawDataCombustible(useApi())
        let result
        if (startDate && endDate) {
          result = await EstadisticasService.getEstadisticasCombustibleFiltered(raw, {
            startDate,
            endDate,
          })
        } else {
          result = await EstadisticasService.getEstadisticasCombustibleFromRaw(raw)
        }
        this.setModulo({ name: 'combustible', data: result.combustible })
      } catch (error) {
        this.setError(error.message)
      } finally {
        this.setLoading(false)
      }
    },

    async fetchModuloAbiertoAnual({ startDate, endDate } = {}) {
      try {
        const raw = await EstadisticasService.getRawDataAbiertoAnual(useApi())
        const data = EstadisticasService.getEstadisticasAbiertoAnualFromRaw(raw, {
          startDate,
          endDate,
        })
        this.setModulo({ name: 'abiertoAnual', data })
      } catch (error) {
        this.setError(error.message)
      } finally {
        this.setLoading(false)
      }
    },

    async fetchModuloIndices() {
      try {
        const raw = await EstadisticasService.getRawDataIndices(useApi())
        const data = EstadisticasService.getEstadisticasIndicesFromRaw(raw)
        this.setModulo({ name: 'indices', data })
      } catch (error) {
        this.setError(error.message)
      } finally {
        this.setLoading(false)
      }
    },

    async fetchEstadisticasCombustible({ startDate, endDate } = {}) {
      this.setLoading(true)
      this.setError(null)
      try {
        const rawDataCombustible = await EstadisticasService.getRawDataCombustible(useApi())
        let data
        if (startDate && endDate) {
          data = await EstadisticasService.getEstadisticasCombustibleFiltered(rawDataCombustible, {
            startDate,
            endDate,
          })
          this.setCurrentDateFilter({ startDate, endDate })
        } else {
          data = await EstadisticasService.getEstadisticasCombustibleFromRaw(rawDataCombustible)
          this.setCurrentDateFilter(null)
        }
        const currentModulos = this.estadisticasModulos || {}
        this.setEstadisticasModulos({
          ...currentModulos,
          combustible: data.combustible,
        })
        return data
      } catch (error) {
        this.setError(error.message)
        throw error
      } finally {
        this.setLoading(false)
      }
    },
  },
})
