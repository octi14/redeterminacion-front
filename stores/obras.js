import ObraService from '../service/obra'
import { defineStore } from 'pinia'

export const useObrasStore = defineStore('obras', {
  state: () => ({
    single: null,
    latest: [],
  }),

  actions: {
    setLatest(filesList) {
      this.latest = filesList
    },
    setSingle(singleFile) {
      this.single = singleFile
    },
    actualizarCertificadosEnObra(certificados) {
      this.single.certificados = certificados
    },

    async getAll() {
      const found = await ObraService.getLatest(useApi(), {})
      this.setLatest(found)
    },

    async search({ search }) {
      await ObraService.searchFiles(useApi(), { search })
    },

    async getSingle({ id }) {
      this.setSingle(null)
      const found = await ObraService.getSingle(useApi(), { id })
      this.setSingle(found)
    },

    async create({ obra, userToken }) {
      return await ObraService.create(useApi(), { obra, userToken })
    },

    async update({ obra, userToken }) {
      try {
        const updated = await ObraService.update(useApi(), { obra, userToken })
        this.setSingle({ updated })
      } catch (e) {
        throw new Error('Error actualizando')
      }
    },

    async delete({ id, userToken }) {
      return await ObraService.delete(useApi(), { id, userToken })
    },

    async actualizarCertificados(certificados) {
      try {
        this.actualizarCertificadosEnObra(certificados)
      } catch (e) {
        throw new Error('Error actualizando certificados')
      }
    },
  },
})
