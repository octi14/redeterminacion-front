import IndiceService from '../service/indice'
import { defineStore } from 'pinia'

export const useIndicesStore = defineStore('indices', {
  state: () => ({
    single: null,
    latest: [],
    indices: [],
  }),

  actions: {
    setLatest(filesList) {
      this.latest = filesList
    },
    setSingle(singleFile) {
      this.single = singleFile
    },
    setMany(indiceList) {
      this.indices = indiceList
    },

    async getAll() {
      const found = await IndiceService.getLatest(useApi(), {})
      this.setLatest(found)
    },

    async search({ mes, año }) {
      const found = await IndiceService.search(useApi(), { mes, año })
      this.setMany(found)
    },

    async searchSingle({ mes, año, categoria }) {
      const found = await IndiceService.searchSingle(useApi(), { mes, año, categoria })
      this.setSingle(found)
    },

    async getSingle({ id }) {
      this.setSingle(null)
      const found = await IndiceService.getSingle(useApi(), { id })
      this.setSingle(found)
    },

    async create({ indice, userToken }) {
      return await IndiceService.create(useApi(), { indice, userToken })
    },

    async update({ indice, userToken }) {
      try {
        const updated = await IndiceService.update(useApi(), { indice, userToken })
        this.setSingle({ updated })
      } catch (e) {
        throw new Error('Error actualizando')
      }
    },

    async delete({ id, userToken }) {
      return await IndiceService.delete(useApi(), { id, userToken })
    },
  },
})
