import AbiertoAnualConfigService from '../service/abiertoAnualConfig.js'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
    abiertoAnualPeriodos: null,
  }),

  getters: {
    abiertoAnualPeriodos(state) {
      if (state.abiertoAnualPeriodos) return state.abiertoAnualPeriodos
      const year = new Date().getFullYear()
      return AbiertoAnualConfigService.getDefaultConfig(year)
    },
  },

  actions: {
    setAbiertoAnualPeriodos(data) {
      this.abiertoAnualPeriodos = data
    },

    async getAbiertoAnualPeriodos() {
      const data = await AbiertoAnualConfigService.getAbiertoAnualPeriodos(useApi())
      this.setAbiertoAnualPeriodos(data)
      return data
    },
  },
})
