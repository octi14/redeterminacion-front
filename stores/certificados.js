import CertificadoService from '../service/certificado'
import { defineStore } from 'pinia'

export const useCertificadosStore = defineStore('certificados', {
  state: () => ({
    single: null,
    latest: [],
    certifs: [],
  }),

  actions: {
    setLatest(filesList) {
      this.latest = filesList
    },
    setSingle(singleFile) {
      this.single = singleFile
    },
    setMany(certifList) {
      this.certifs = certifList
    },

    async getAll() {
      const found = await CertificadoService.getLatest(useApi(), {})
      this.setLatest(found)
    },

    async search({ obra }) {
      const found = await CertificadoService.search(useApi(), { obra })
      this.setMany(found)
    },

    async getSingle({ id }) {
      this.setSingle(null)
      const found = await CertificadoService.getSingle(useApi(), { id })
      this.setSingle(found)
    },

    async create({ certificado, userToken }) {
      return await CertificadoService.create(useApi(), { certificado, userToken })
    },

    async update({ certificado, userToken }) {
      try {
        const updated = await CertificadoService.update(useApi(), { certificado, userToken })
        this.setSingle({ updated })
      } catch (e) {
        throw new Error('Error actualizando')
      }
    },

    async delete({ certificado, userToken }) {
      return await CertificadoService.delete(useApi(), { certificado, userToken })
    },
  },
})
