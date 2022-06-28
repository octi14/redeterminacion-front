const IndiceService = require('../service/indice')

export const state = () => ({
  single: null,
  latest: [],
  indices: [],
})

export const actions = {
  async getAll({ commit, state }) {
    const found = await IndiceService.getLatest(this.$axios, {
      // skip: state.latest.length,
    })
    commit('setLatest', found)
  },
  async search({ commit, state }, { mes, año }) {
    const found = await IndiceService.search(this.$axios, {
      mes: mes,
      año: año,
    })
    commit('setMany', found)
  },
  async searchSingle({ commit, state }, { mes, año, categoria}) {
    const found = await IndiceService.searchSingle(this.$axios, {
      mes,
      año,
      categoria,
    })
    commit('setSingle', found)
  },
  async getSingle({ commit, state }, { id }) {
    commit('setSingle', null)
    const found = await IndiceService.getSingle(this.$axios, {
      id,
    })
    commit('setSingle', found)
  },
  async create({ commit, state }, { indice, userToken }) {
    const createdFile = await IndiceService.create(this.$axios, {
      indice,
      userToken,
    })
    return createdFile
  },
  async update({ commit }, { indice, userToken }) {
    try {
      const updated = await IndiceService.update(this.$axios, {
        indice,
        userToken,
      })
      commit('setSingle', { updated })
    } catch (e) {
      throw new Error('Error actualizando')
    }
  },
  async delete({ commit, state }, { id, userToken }) {
    const deleted = await IndiceService.delete(this.$axios, {
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
  setMany(state, indiceList) {
    state.indices = indiceList
  }
}
