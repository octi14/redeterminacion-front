const PagoDobleService = require('../service/pagoDoble.js')

export const state = () => ({
  single: null,
  all: [],
})

export const actions = {
  async getAll({ commit, state }) {
    const found = await PagoDobleService.getAll(this.$axios, {
      // skip: state.latest.length,
    })
    commit('setAll', found)
  },
  async getByNroTramite({ commit, state }, { nroTramite }) {
    commit('setSingle', null)
    const found = await PagoDobleService.getByNroTramite(this.$axios, {
      nroTramite,
    })
    commit('setSingle', found)
  },
  async getSingle({ commit, state }, { id }) {
    // commit('setSingle', null)
    const found = await PagoDobleService.getSingle(this.$axios, {
      id,
    })
    commit('setSingle', found)
  },
  async create({ commit, state }, { pagoDoble }) {
    const createdFile = await PagoDobleService.create(this.$axios, {
      pagoDoble,
    })
    return createdFile
  },
  async update({ commit }, { id, pago}) {
    try {
      const updated = await PagoDobleService.update(this.$axios, id, {
        pago,
      })
      commit('setSingle', { updated })
    } catch (e) {
      throw new Error(e.message)
    }
  },
  async updateLazy({ commit }, { id, pagoDoble}) {
    try {
      const updated = await PagoDobleService.updateLazy(this.$axios, id, {
        pagoDoble,
      })
      // commit('setSingle', { updated })
    } catch (e) {
      throw new Error(e.message)
    }
  },
  async delete({ commit, state }, { id, userToken }) {
    const deleted = await PagoDobleService.delete(this.$axios, {
      id,
      userToken,
    })
    return deleted
  },
  async descargar({ commit }, { id }) {
    try {
      console.log("ID: " + id)
      // Llamamos al servicio y retornamos la respuesta para que el componente maneje el blob
      const response = await PagoDobleService.descargarPagoDoble(this.$axios, { id });

      console.log("Response: " + response)
      // Devolvemos la respuesta completa para que el componente se encargue del procesamiento
      return response;
    } catch (error) {
      console.error('Error en la acción descargarPagoDoble:', error);
      throw error; // Re-lanzamos el error para que el componente también pueda manejarlo si es necesario
    }
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
  ordenarPagosDobles(state) {
    state.all.sort((a, b) => b.nroTramite - a.nroTramite);
  },
}
