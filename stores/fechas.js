import FechaService from '../service/fecha'
import { defineStore } from 'pinia'

export const useFechasStore = defineStore('fechas', {
  state: () => ({
    fecha: null,
  }),

  actions: {
    set(fecha) {
      this.fecha = fecha
    },

    async get() {
      const found = await FechaService.get(useApi())
      this.set(found)
    },
  },
})
