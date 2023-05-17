const CategoriaService = require('../service/categoria')

export const state = () => ({
  single: null,
  all: [],
})

export const actions = {
  async getAll({ commit, state }) {
    const found = await CategoriaService.getLatest(this.$axios, {
      // skip: state.latest.length,
    })
    commit('setAll', found)
  },
}

export const mutations = {
  setAll(state, filesList) {
    state.all = filesList
    // [...state.latest, ...filesList]
  },
  // setSingle(state, singleFile) {
  //   state.single = singleFile
  // },
  // setMany(state, certifList) {
  //   state.certifs = certifList
  // }
}
