const CementerioService = require('../service/cementerio.js')

export const state = () => ({
  single: null,
  all: [],
})

export const actions = {
  async getAll({ commit }) {
    const found = await CementerioService.getAll(this.$axios)
    commit('setAll', found)
  },
  async getSingle({ commit }, { id }) {
    const found = await CementerioService.getSingle(this.$axios, { id })
    commit('setSingle', found)
  },
  async create({ commit }, { certificado }) {
    const created = await CementerioService.create(this.$axios, { certificado })
    return created
  },
  async update({ commit }, { id, certificado }) {
    const updated = await CementerioService.update(this.$axios, id, { certificado })
    commit('setSingle', updated)
  },
  async delete({ commit }, { id }) {
    const deleted = await CementerioService.delete(this.$axios, { id })
    return deleted
  }
}

export const mutations = {
  setAll(state, list) {
    state.all = list
  },
  setSingle(state, item) {
    state.single = item
  },
}



