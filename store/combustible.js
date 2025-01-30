const CombustibleService = require('../service/combustible')

export const state = () => ({
  single: null,
  all: [],
})

export const actions = {
  async getOrdenesCompra({ commit, state }) {
    const found = await CombustibleService.getLatest(this.$axios, {
      // skip: state.latest.length,
    })
    commit('setAll', found)
  },
  async getSingle({ commit, state }, { id }) {
    commit('setSingle', null)
    const found = await CombustibleService.getSingle(this.$axios, {
      id,
    })
    commit('setSingle', found)
  },
  async create({ commit, state }, { orden }) {
    const createdFile = await CombustibleService.create(this.$axios, {
      orden
    })
    return createdFile
  },
}

export const mutations = {
  setAll(state, filesList) {
    state.all = filesList
    // [...state.latest, ...filesList]
  },
  setSingle(state, singleFile) {
    state.single = singleFile
  },
  // setMany(state, certifList) {
  //   state.certifs = certifList
  // }
}