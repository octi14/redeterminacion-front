const ObraService = require('../service/obra')

export const state = () => ({
  single: null,
  latest: [],
})

export const actions = {
  async getAll({ commit, state }) {
    const found = await ObraService.getLatest(this.$axios, {
      // skip: state.latest.length,
    })
    commit('setLatest', found)
  },
  async getSingle({ commit, state }, { id }) {
    commit('setSingle', null)
    const found = await ObraService.getSingle(this.$axios, {
      id,
    })
    commit('setSingle', found)
  },
  async create({ commit, state }, { obra, userToken }) {
    const createdFile = await ObraService.create(this.$axios, {
      obra,
      userToken,
    })
    return createdFile
  },
}

export const mutations = {
  setLatest(state, filesList) {
    state.latest = filesList
    // [...state.latest, ...filesList]
  },
  setSingle(state, singleFile) {
    state.single = singleFile
  },
}
