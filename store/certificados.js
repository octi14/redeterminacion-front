const CertificadoService = require('../service/certificado')

export const state = () => ({
  single: null,
  latest: [],
})

export const actions = {
  async getAll({ commit, state }) {
    const found = await CertificadoService.getLatest(this.$axios, {
      // skip: state.latest.length,
    })
    commit('setLatest', found)
  },
  async search({ commit, state }, { search }) {
    const found = await CertificadoService.search(this.$axios, {
      search,
    })
  },
  async getSingle({ commit, state }, { id }) {
    commit('setSingle', null)
    const found = await CertificadoService.getSingle(this.$axios, {
      id,
    })
    commit('setSingle', found)
  },
  async create({ commit, state }, { certificado, userToken }) {
    const createdFile = await CertificadoService.create(this.$axios, {
      certificado,
      userToken,
    })
    return createdFile
  },
  async update({ commit }, { certificado, userToken }) {
    try {
      const updated = await CertificadoService.update(this.$axios, {
        certificado,
        userToken,
      })
      commit('setSingle', { updated })
    } catch (e) {
      throw new Error('Error actualizando')
    }
  },
  async delete({ commit, state }, { id, userToken }) {
    const deleted = await CertificadoService.delete(this.$axios, {
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
