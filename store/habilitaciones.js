const HabilitacionService = require('../service/habilitacion.js')

export const state = () => ({
  single: null,
  all: [],
})

export const actions = {
  async getAll({ commit, state }) {
    const found = await HabilitacionService.getLatest(this.$axios, {
      // skip: state.latest.length,
    })
    commit('setAll', found)
  },
  // async search({ commit, state }, { search }) {
  //   const found = await ObraService.searchFiles(this.$axios, {
  //     search,
  //   })
  // },
  // async getSingle({ commit, state }, { id }) {
  //   commit('setSingle', null)
  //   const found = await ObraService.getSingle(this.$axios, {
  //     id,
  //   })
  //   commit('setSingle', found)
  // },
  async create({ commit, state }, { habilitacion, userToken }) {
    const createdFile = await HabilitacionService.create(this.$axios, {
      habilitacion,
      userToken,
    })
    return createdFile
  },
  // async update({ commit }, { obra, userToken }) {
  //   try {
  //     const updated = await ObraService.update(this.$axios, {
  //       obra,
  //       userToken,
  //     })
  //     commit('setSingle', { updated })
  //   } catch (e) {
  //     throw new Error('Error actualizando')
  //   }
  // },
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
