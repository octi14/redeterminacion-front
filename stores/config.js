import AbiertoAnualConfigService from '../service/abiertoAnualConfig.js'
import { getDefaultAbiertoAnualPeriodos } from '~/utils/abiertoAnualPeriodos'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
    abiertoAnualPeriodosData: null,
  }),

  getters: {
    abiertoAnualPeriodos(state) {
      return state.abiertoAnualPeriodosData || getDefaultAbiertoAnualPeriodos()
    },
  },

  actions: {
    setAbiertoAnualPeriodos(data) {
      this.abiertoAnualPeriodosData = data
    },

    async getAbiertoAnualPeriodos() {
      const data = await AbiertoAnualConfigService.getAbiertoAnualPeriodos(useApi())
      this.setAbiertoAnualPeriodos(data)
      return data
    },
  },
})
