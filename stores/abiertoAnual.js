import AbiertoAnualService from '../service/abiertoAnual.js'
import { defineStore } from 'pinia'

export const useAbiertoAnualStore = defineStore('abiertoAnual', {
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
    ordenar() {
      this.all.sort((a, b) => new Date(b.ultimaActualizacion) - new Date(a.ultimaActualizacion))
    },

    async getAll() {
      const found = await AbiertoAnualService.getAll(useApi(), {})
      this.setAll(found)
    },

    async getByCuitLegajo({ cuit, nroLegajo }) {
      this.setSingle(null)
      const found = await AbiertoAnualService.getByCuitLegajo(useApi(), { cuit, nroLegajo })
      this.setSingle(found)
      return found
    },

    async getSingle({ id }) {
      const found = await AbiertoAnualService.getSingle(useApi(), { id })
      this.setSingle(found)
    },

    async create({ cuit, nroLegajo }) {
      return await AbiertoAnualService.create(useApi(), { cuit, nroLegajo })
    },

    async update({ id, tramite }) {
      try {
        this.setSingle(await AbiertoAnualService.update(useApi(), id, { tramite }))
      } catch (e) {
        throw new Error(e.message)
      }
    },

    async updateLazy({ id, tramite }) {
      try {
        await AbiertoAnualService.updateLazy(useApi(), id, { tramite })
      } catch (e) {
        throw new Error(e.message)
      }
    },

    async delete({ id, userToken }) {
      return await AbiertoAnualService.delete(useApi(), { id, userToken })
    },
  },
})
