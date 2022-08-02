const RedeterminacionService = require('../service/redeterminacion')

export const state = () => ({
  single: null,
  latest: [],
  redets: [],
})

export const actions = {
  async getAll({ commit, state }) {
    const found = await RedeterminacionService.getLatest(this.$axios, {
      // skip: state.latest.length,
    })
    commit('setLatest', found)
  },
  async search({ commit, state }, { obra, certificado }) {
    const found = await RedeterminacionService.search(this.$axios, {
      obra,
      certificado,
    })
    commit('setMany', found)
  },
  async searchByObra({ commit, state }, { obra }) {
    const found = await RedeterminacionService.searchByObra(this.$axios, {
      obra,
    })
    commit('setMany', found)
  },
  async getSingle({ commit, state }, { id }) {
    commit('setSingle', null)
    const found = await RedeterminacionService.getSingle(this.$axios, {
      id,
    })
    commit('setSingle', found)
  },
  async create({ commit, state }, { obra, certificado, items, userToken }) {
    const createdFile = await RedeterminacionService.create(this.$axios, {
      obra,
      certificado,
      items,
      userToken,
    })
    return createdFile
  },
  async update({ commit }, { certificado, userToken }) {
    try {
      const updated = await RedeterminacionService.update(this.$axios, {
        certificado,
        userToken,
      })
      commit('setSingle', { updated })
    } catch (e) {
      throw new Error('Error actualizando')
    }
  },
  async delete({ commit, state }, { id, userToken }) {
    const deleted = await RedeterminacionService.delete(this.$axios, {
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
  setMany(state, redetList) {
    state.redets = redetList
  }
}
