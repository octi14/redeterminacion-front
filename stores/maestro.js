import MaestroService from '../service/maestro'
import { defineStore } from 'pinia'

export const useMaestroStore = defineStore('maestro', {
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

    async get() {
      this.setAll([])
      const found = await MaestroService.get(useApi())
      this.setAll(found)
    },

    async getSingle({ cuit, legajo }) {
      this.setSingle([])
      const found = await MaestroService.getSingle(useApi(), { cuit, legajo })
      this.setSingle(found)
    },

    async create({ file }) {
      try {
        const response = await MaestroService.create(useApi(), { file })
        this.setAll(response.filesList)
      } catch (error) {
        console.error(error)
      }
    },
  },
})
