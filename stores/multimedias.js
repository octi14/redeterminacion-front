import MultimediaService from '../service/multimedia'
import { defineStore } from 'pinia'

export const useMultimediasStore = defineStore('multimedias', {
  state: () => ({
    single: null,
    latest: [],
    multimedias: [],
  }),

  actions: {
    setLatest(filesList) {
      this.latest = filesList
    },
    setSingle(singleFile) {
      this.single = singleFile
    },
    setMany(multimediaList) {
      this.multimedias = multimediaList
    },
    removeItem(fileId) {
      this.multimedias = this.multimedias.filter((file) => file.id !== fileId)
    },
    sortItemsByName() {
      this.multimedias.sort((a, b) => {
        const nameA = a.nombre.toLowerCase()
        const nameB = b.nombre.toLowerCase()
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
        return 0
      })
    },

    async getAll() {
      const found = await MultimediaService.getLatest(useApi(), {})
      this.setLatest(found)
    },

    async search({ categoria }) {
      const found = await MultimediaService.search(useApi(), { categoria })
      this.setMany(found)
    },

    async searchSingle({ mes, año, categoria }) {
      const found = await MultimediaService.searchSingle(useApi(), { mes, año, categoria })
      this.setSingle(found)
    },

    async getSingle({ id }) {
      this.setSingle(null)
      const found = await MultimediaService.getSingle(useApi(), { id })
      this.setSingle(found)
    },

    async create({ multimedia, userToken }) {
      return await MultimediaService.create(useApi(), { multimedia, userToken })
    },

    async update({ multimedia, userToken }) {
      try {
        const updated = await MultimediaService.update(useApi(), { multimedia, userToken })
        this.setSingle({ updated })
      } catch (e) {
        throw new Error('Error actualizando')
      }
    },

    async delete({ id, userToken }) {
      const deleted = await MultimediaService.delete(useApi(), { id, userToken })
      this.removeItem(id)
      return deleted
    },
  },
})
