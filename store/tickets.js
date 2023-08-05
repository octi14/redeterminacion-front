const TicketService = require('../service/ticket')

export const state = () => ({
  single: null,
  all: [],
})

export const actions = {
  async getAll({ commit, state }) {
    const found = await TurnoService.getAll(this.$axios, {
      // skip: state.latest.length,
    })
    commit('setAll', found)
  },
  async getSingle({ commit, state }, { id }) {
    commit('setSingle', null)
    const found = await MultimediaService.getSingle(this.$axios, {
      id,
    })
    commit('setSingle', found)
  },
  async getCurrent({ commit, state }) {
    commit('setSingle', null)
    const found = await TicketService.getCurrent(this.$axios)
    commit('setSingle', found)
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
  delete(state, fileId) {
    state.all = state.all.filter(file => file.id !== fileId);
  }
}
