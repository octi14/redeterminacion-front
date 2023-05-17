const ObraService = require('../service/obra')

export const state = () => ({
  // guardo los parámetros de búsqueda en el store global
  params: {
    expediente: null,
    objeto: null,
    adjudicado: null,
  },
  results: [],
})

export const actions = {
  async search({ commit }, { expediente, objeto, adjudicado }) {
    commit('setSearchParams', { expediente, objeto, adjudicado })
    const found = await ObraService.searchFiles(this.$axios, {
      expediente,
      objeto,
      adjudicado,
    })
    commit('setSearchResults', found)
    await this.$router.push('/results')
  },
}

export const mutations = {
  setSearchParams(state, { expediente, objeto, adjudicado }) {
    state.params = {
      expediente,
      objeto,
      adjudicado,
    }
  },
  resetSearchParams(state) {
    state.params = {
      expediente: null,
      objeto: null,
      adjudicado: null,
    }
  },
  setSearchResults(state, filesList) {
    state.results = [...filesList]
  },
}
