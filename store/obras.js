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
  async search({ commit, state }, { search }) {
    const found = await ObraService.searchFiles(this.$axios, {
      search,
    })
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
  async update({ commit }, { obra, userToken }) {
    try {
      const updated = await ObraService.update(this.$axios, {
        obra,
        userToken,
      })
      commit('setSingle', { updated })
    } catch (e) {
      console.log(e)
      throw new Error('Error actualizando')
    }
  },
  async delete({ commit, state }, { id, userToken }) {
    const deleted = await ObraService.delete(this.$axios, {
      id,
      userToken,
    })
    return deleted
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
