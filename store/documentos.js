const DocumentoService = require('../service/documento.js')

export const state = () => ({
  all: null,
})

export const actions = {
  async getById({ commit, state }, { id }) {
    commit('setAll', null)
    const found = await DocumentoService.getById(this.$axios, {
      id,
    })
    commit('setAll', found)
  },
}

export const mutations = {
  setAll(state, filesList) {
    state.all = filesList
    // [...state.latest, ...filesList]
  },
}
