const FechaService = require('../service/fecha')

export const state = () => ({
  fecha: null,
})

export const actions = {
  async get({ commit, state }) {
    const found = await FechaService.get(this.$axios)
    commit('set', found)
  },
}

export const mutations = {
  set(state, fecha) {
    state.fecha = fecha
  },
}
