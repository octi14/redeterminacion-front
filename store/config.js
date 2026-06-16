const AbiertoAnualConfigService = require('../service/abiertoAnualConfig.js')

export const state = () => ({
  abiertoAnualPeriodos: null,
})

export const getters = {
  abiertoAnualPeriodos(state) {
    if (state.abiertoAnualPeriodos) return state.abiertoAnualPeriodos
    const year = new Date().getFullYear()
    return AbiertoAnualConfigService.getDefaultConfig(year)
  },
}

export const actions = {
  async getAbiertoAnualPeriodos({ commit }) {
    const data = await AbiertoAnualConfigService.getAbiertoAnualPeriodos(this.$axios)
    commit('setAbiertoAnualPeriodos', data)
    return data
  },
}

export const mutations = {
  setAbiertoAnualPeriodos(state, data) {
    state.abiertoAnualPeriodos = data
  },
}
