const ObraService = require('../service/obra')

export const state = () => ({
  // guardo los parámetros de búsqueda en el store global
  params: {
    name: null,
    description: null,
  },
  results: [],
})

export const actions = {
  async search({ commit }, { name, description }) {
    // TODO: Handle errors!!
    // TODO: add loading
    commit('setSearchParams', { name, description })
    const found = await ObraService.search(this.$axios, {
      name,
      description,
    })
    commit('setSearchResults', found)
    await this.$router.push('/results')
  },
}

export const mutations = {
  setSearchParams(state, { name, description }) {
    state.params = {
      name,
      description,
    }
  },
  resetSearchParams(state) {
    state.params = {
      name: null,
      description: null,
    }
  },
  setSearchResults(state, filesList) {
    state.results = [...filesList]
  },
}
