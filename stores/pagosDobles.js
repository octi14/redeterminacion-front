import PagoDobleService from '../service/pagoDoble.js'
import { defineStore } from 'pinia'

export const usePagosDoblesStore = defineStore('pagosDobles', {
  state: () => ({
    single: null,
    all: [],
  }),

  actions: {
    setAll(filesList) {
      this.all = filesList
    },
    setSingle(singleFile) {
      this.single = singleFile
    },
    ordenarPagos() {
      this.all.sort((a, b) => b.nroTramite - a.nroTramite)
    },

    async getAll() {
      const found = await PagoDobleService.getAll(useApi(), {})
      this.setAll(found)
    },

    async getByNroTramite({ nroTramite }) {
      this.setSingle(null)
      const found = await PagoDobleService.getByNroTramite(useApi(), { nroTramite })
      this.setSingle(found)
    },

    async getSingle({ id }) {
      const found = await PagoDobleService.getSingle(useApi(), { id })
      this.setSingle(found)
    },

    async create({ pagoDoble }) {
      return await PagoDobleService.create(useApi(), { pagoDoble })
    },

    async update({ id, pago }) {
      try {
        const updated = await PagoDobleService.update(useApi(), id, { pago })
        this.setSingle({ updated })
      } catch (e) {
        throw new Error(e.message)
      }
    },

    async updateLazy({ id, pagoDoble }) {
      try {
        await PagoDobleService.updateLazy(useApi(), id, { pagoDoble })
      } catch (e) {
        throw new Error(e.message)
      }
    },

    async delete({ id, userToken }) {
      return await PagoDobleService.delete(useApi(), { id, userToken })
    },

    async descargar({ id }) {
      try {
        return await PagoDobleService.descargarPagoDoble(useApi(), { id })
      } catch (error) {
        console.error('Error en la acción descargarPagoDoble:', error)
        throw error
      }
    },
  },
})
