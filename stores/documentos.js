import DocumentoService from '../service/documento.js'
import { defineStore } from 'pinia'

export const useDocumentosStore = defineStore('documentos', {
  state: () => ({
    all: null,
  }),

  actions: {
    setAll(filesList) {
      this.all = filesList
    },

    async getById({ id }) {
      this.setAll(null)
      const found = await DocumentoService.getById(useApi(), { id })
      this.setAll(found)
    },

    async getPagosById({ id }) {
      this.setAll(null)
      const found = await DocumentoService.getPagosById(useApi(), { id })
      this.setAll(found)
    },
  },
})
