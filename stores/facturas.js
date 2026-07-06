import FacturaService from '../service/factura.js'
import { defineStore } from 'pinia'

export const useFacturasStore = defineStore('facturas', {
  state: () => ({
    all: null,
  }),

  getters: {
    facturaPorPeriodo: (state) => (periodo) => {
      return state.all && state.all.length >= periodo ? state.all[periodo - 1] : null
    },
  },

  actions: {
    setAll(filesList) {
      this.all = filesList
    },

    async getById({ id }) {
      this.setAll(null)
      const found = await FacturaService.getById(useApi(), { id })
      this.setAll(found)
    },

    async agregar({ id, factura, periodo }) {
      try {
        return await FacturaService.agregar(useApi(), { id, factura, periodo })
      } catch (error) {
        throw error
      }
    },
  },
})
