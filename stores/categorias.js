import CategoriaService from '../service/categoria'
import { defineStore } from 'pinia'

export const useCategoriasStore = defineStore('categorias', {
  state: () => ({
    single: null,
    all: [],
  }),

  actions: {
    setAll(filesList) {
      this.all = filesList
    },

    async getAll() {
      const found = await CategoriaService.getLatest(useApi(), {})
      this.setAll(found)
    },
  },
})
