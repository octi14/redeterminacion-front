const MultimediaService = require('../service/multimedia')

export const state = () => ({
  single: null,
  latest: [],
  multimedias: [],
})

export const actions = {
  async getAll({ commit, state }) {
    const found = await MultimediaService.getLatest(this.$axios, {
      // skip: state.latest.length,
    })
    commit('setLatest', found)
  },
  async search({ commit, state }, { categoria }) {
    const found = await MultimediaService.search(this.$axios, {
      categoria,
    })
    commit('setMany', found)
  },
  async searchSingle({ commit, state }, { mes, año, categoria}) {
    const found = await MultimediaService.searchSingle(this.$axios, {
      mes,
      año,
      categoria,
    })
    commit('setSingle', found)
  },
  async getSingle({ commit, state }, { id }) {
    commit('setSingle', null)
    const found = await MultimediaService.getSingle(this.$axios, {
      id,
    })
    commit('setSingle', found)
  },
  async create({ commit, state }, { multimedia, userToken }) {
    const createdFile = await MultimediaService.create(this.$axios, {
      multimedia,
      userToken,
    })
    return createdFile
  },
  async update({ commit }, { multimedia, userToken }) {
    try {
      const updated = await MultimediaService.update(this.$axios, {
        multimedia,
        userToken,
      })
      commit('setSingle', { updated })
    } catch (e) {
      throw new Error('Error actualizando')
    }
  },
  async delete({ commit, state }, { id, userToken }) {
    console.log(id)
    const deleted = await MultimediaService.delete(this.$axios, {
      id,
      userToken,
    })
    commit('delete', id);
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
  setMany(state, multimediaList) {
    state.multimedias = multimediaList
  },
  delete(state, fileId) {
    state.multimedias = state.multimedias.filter(file => file.id !== fileId);
  },
  sortItemsByName(state) {
    state.multimedias.sort((a, b) => {
      const nameA = a.nombre.toLowerCase();
      const nameB = b.nombre.toLowerCase();

      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  },
}
