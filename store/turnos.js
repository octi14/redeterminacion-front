const TurnoService = require('../service/turno')

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
  // async search({ commit, state }, { categoria }) {
  //   const found = await MultimediaService.search(this.$axios, {
  //     categoria,
  //   })
  //   commit('setMany', found)
  // },
  // async searchSingle({ commit, state }, { mes, año, categoria}) {
  //   const found = await MultimediaService.searchSingle(this.$axios, {
  //     mes,
  //     año,
  //     categoria,
  //   })
  //   commit('setSingle', found)
  // },
  async getSingle({ commit, state }, { nroTramite }) {
    commit('setSingle', null)
    const found = await TurnoService.getSingle(this.$axios, {
      nroTramite,
    })
    commit('setSingle', found)
  },
  async getById({ commit, state }, { id }) {
    commit('setSingle', null)
    const found = await TurnoService.getById(this.$axios, {
      id,
    })
    commit('setSingle', found)
  },
  async create({ commit, state }, { turno }) {
    const createdFile = await TurnoService.create(this.$axios, {
      turno
    })
    return createdFile
  },
  async update({ commit }, { id, turno, userToken }) {
    try {
      const updated = await TurnoService.update(this.$axios, {
        id,
        turno,
        userToken,
      })
      commit('setSingle', { updated })
    } catch (e) {
      throw new Error('Error actualizando')
    }
  },
  async delete({ commit, state }, { id, userToken }) {
    console.log(id)
    const deleted = await TurnoService.delete(this.$axios, {
      id,
      userToken,
    })
    commit('delete', id);
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
  delete(state, fileId) {
    state.all = state.all.filter(file => file.id !== fileId);
  }
}
