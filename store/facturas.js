const FacturaService = require('../service/factura.js')

export const state = () => ({
  all: null,
})

export const actions = {
  async getById({ commit, state }, { id }) {
    commit('setAll', null)
    const found = await FacturaService.getById(this.$axios, {
      id,
    })
    commit('setAll', found)
  },

  async agregar({ commit }, { id, factura, periodo }) {
    try {
      const response = await FacturaService.agregar(this.$axios, {
        id, factura, periodo});
      // Aquí puedes hacer algo con la respuesta si es necesario
      return response;
    } catch (error) {
      // Aquí puedes manejar errores si la solicitud falla
      throw error;
    }
  }
}

export const mutations = {
  setAll(state, filesList) {
    state.all = filesList
    // [...state.latest, ...filesList]
  },
}

export const getters = {
  facturaPorPeriodo: (state) => (periodo) => {
    return state.all && state.all.length >= periodo ? state.all[periodo - 1] : null;
  }
}
