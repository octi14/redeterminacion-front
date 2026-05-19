import CementerioService from '../service/cementerio.js'
import { defineStore } from 'pinia'

export const useCementerioStore = defineStore('cementerio', {
  state: () => ({
    single: null,
    all: [],
  }),

  actions: {
    setAll(list) {
      this.all = list
    },
    setSingle(item) {
      this.single = item
    },

    async getAll() {
      const found = await CementerioService.getAll(useApi())
      this.setAll(found)
    },

    async getSingle({ id }) {
      const found = await CementerioService.getSingle(useApi(), { id })
      this.setSingle(found)
    },

    async create({ certificado }) {
      return await CementerioService.create(useApi(), { certificado })
    },

    async update({ id, certificado }) {
      const updated = await CementerioService.update(useApi(), id, { certificado })
      this.setSingle(updated)
    },

    async delete({ id }) {
      return await CementerioService.delete(useApi(), { id })
    },
  },
})
