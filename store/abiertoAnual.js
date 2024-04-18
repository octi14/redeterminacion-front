const AbiertoAnualService = require('../service/abiertoAnual.js')

export const state = () => ({
  single: null,
  all: [],
})

export const actions = {
  async getAll({ commit, state }) {
    const found = await AbiertoAnualService.getAll(this.$axios, {
      // skip: state.latest.length,
    })
    commit('setAll', found)
  },
  async getByCuitLegajo({ commit, state }, { cuit, legajo }) {
    commit('setAll', null)
    const found = await AbiertoAnualService.getByCuitLegajo(this.$axios, {
      cuit,
      legajo
    })
    commit('setAll', found)
    return found
  },
  async getSingle({ commit, state }, { id }) {
    // commit('setSingle', null)
    const found = await AbiertoAnualService.getSingle(this.$axios, {
      id,
    })
    commit('setSingle', found)
  },
  async create({ commit, state }, { cuit, nroLegajo }) {
    const createdFile = await AbiertoAnualService.create(this.$axios, {
      cuit,
      nroLegajo,
    })
    return createdFile
  },
  async update({ commit }, { id, tramite}) {
    try {
      const updated = await AbiertoAnualService.update(this.$axios, id, {
        tramite,
      })
      commit('setSingle', { updated })
    } catch (e) {
      throw new Error(e.message)
    }
  },
  async updateLazy({ commit }, { id, tramite}) {
    try {
      const updated = await AbiertoAnualService.updateLazy(this.$axios, id, {
        tramite,
      })
      // commit('setSingle', { updated })
    } catch (e) {
      throw new Error(e.message)
    }
  },
  async delete({ commit, state }, { id, userToken }) {
    const deleted = await AbiertoAnualService.delete(this.$axios, {
      id,
      userToken,
    })
    return deleted
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
  ordenar(state) {
    state.all.sort((a, b) => b.updatedAt - a.updatedAt);
  },
}
