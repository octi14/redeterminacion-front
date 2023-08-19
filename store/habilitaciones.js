const HabilitacionService = require('../service/habilitacion.js')

export const state = () => ({
  single: null,
  all: [],
})

export const actions = {
  async getAll({ commit, state }) {
    const found = await HabilitacionService.getAll(this.$axios, {
      // skip: state.latest.length,
    })
    commit('setAll', found)
  },
  async getByNroTramite({ commit, state }, { nroTramite }) {
    commit('setSingle', null)
    const found = await HabilitacionService.getByNroTramite(this.$axios, {
      nroTramite,
    })
    commit('setSingle', found)
  },
  async getSingle({ commit, state }, { id }) {
    // commit('setSingle', null)
    const found = await HabilitacionService.getSingle(this.$axios, {
      id,
    })
    commit('setSingle', found)
  },
  async create({ commit, state }, { habilitacion }) {
    const createdFile = await HabilitacionService.create(this.$axios, {
      habilitacion,
    })
    return createdFile
  },
  async update({ commit }, { id, habilitacion}) {
    try {
      const updated = await HabilitacionService.update(this.$axios, id, {
        habilitacion,
      })
      commit('setSingle', { updated })
    } catch (e) {
      throw new Error(e.message)
    }
  },
  async updateLazy({ commit }, { id, habilitacion}) {
    try {
      const updated = await HabilitacionService.updateLazy(this.$axios, id, {
        habilitacion,
      })
      // commit('setSingle', { updated })
    } catch (e) {
      throw new Error(e.message)
    }
  },
  async delete({ commit, state }, { id, userToken }) {
    const deleted = await HabilitacionService.delete(this.$axios, {
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
}
