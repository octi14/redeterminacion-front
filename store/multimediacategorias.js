const MultimediaCategoriaService = require('../service/multimediacategoria')

export const state = () => ({
  single: null,
  all: [],
})

export const actions = {
  async getAll({ commit, state }) {
    const found = await MultimediaCategoriaService.getLatest(this.$axios, {
    })
    commit('setAll', found)
  },
  // async getSingle({ commit, state }, { id }) {
  //   commit('setSingle', null)
  //   const found = await CertificadoService.getSingle(this.$axios, {
  //     id,
  //   })
  //   commit('setSingle', found)
  // },
}

export const mutations = {
  setAll(state, filesList) {
    state.all = filesList
    // [...state.latest, ...filesList]
  },
  setSingle(state, singleFile) {
    state.single = singleFile
  },
  setMany(state, certifList) {
    state.certifs = certifList
  }
}
