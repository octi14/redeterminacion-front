import RedeterminacionService from '../service/redeterminacion'
import { defineStore } from 'pinia'

export const useRedeterminacionesStore = defineStore('redeterminaciones', {
  state: () => ({
    single: null,
    latest: [],
    redets: [],
  }),

  actions: {
    setLatest(filesList) {
      this.latest = filesList
    },
    setSingle(singleFile) {
      this.single = singleFile
    },
    setMany(redetList) {
      this.redets = redetList
    },

    async getAll() {
      const found = await RedeterminacionService.getLatest(useApi(), {})
      this.setLatest(found)
    },

    async search({ obra, certificado }) {
      const found = await RedeterminacionService.search(useApi(), { obra, certificado })
      this.setMany(found)
    },

    async searchByObra({ obra }) {
      const found = await RedeterminacionService.searchByObra(useApi(), { obra })
      this.setMany(found)
    },

    async getSingle({ id }) {
      this.setSingle(null)
      const found = await RedeterminacionService.getSingle(useApi(), { id })
      this.setSingle(found)
    },

    async create({ obra, certificado, items, userToken }) {
      return await RedeterminacionService.create(useApi(), {
        obra,
        certificado,
        items,
        userToken,
      })
    },

    async update({ certificado, userToken }) {
      try {
        const updated = await RedeterminacionService.update(useApi(), { certificado, userToken })
        this.setSingle({ updated })
      } catch (e) {
        throw new Error('Error actualizando')
      }
    },

    async delete({ redeterminacion, userToken }) {
      return await RedeterminacionService.delete(useApi(), { redeterminacion, userToken })
    },
  },
})
