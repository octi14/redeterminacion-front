const CombustibleService = require('../service/combustible')

export const state = () => ({
  single: null,
  all: [],
  vales_creados: [],
  all_vales: [],
  proveedores: [],
})

export const actions = {
  async getOrdenesCompra({ commit, state }) {
    const found = await CombustibleService.getLatest(this.$axios, {
      // skip: state.latest.length,
    })
    commit('setAll', found)
  },
  async getSingle({ commit, state }, { id }) {
    const found = await CombustibleService.getSingle(this.$axios, {
      id,
    })
    commit('setSingle', found)
  },
  async create({ commit, state }, { orden }) {
    const createdFile = await CombustibleService.create(this.$axios, {
      orden
    })
    return createdFile
  },
  async getAllVales({ commit, state}){
    const found = await CombustibleService.getAllVales(this.$axios, {
    })
    commit('setAllVales', found)
  },
  async getValesSingle({ commit, state}, { id }){
    commit('setValesCreados', null)
    const found = await CombustibleService.getValesSingle(this.$axios, {
      id
    })
    commit('setValesCreados', found)
  },
  async generarVales({ commit, state }, { payload }){
    const createdVales = await CombustibleService.generarVales(this.$axios, {
      payload
    })
    commit('setValesCreados', createdVales)
  },
  async consumirVale({ commit }, { id, vale}) {
    try {
      await CombustibleService.consumirVale(this.$axios, id, {
        vale,
      })
    } catch (e) {
      throw new Error(e.message)
    }
  },
  async eliminarVale({ commit }, { id, userToken }) {
    try {
      const response = await CombustibleService.deleteVale(this.$axios, { id, userToken });

      // Si el backend responde correctamente, eliminamos el vale del store
      commit("removerVale", id);
    } catch (error) {
      console.error("Error del store de VueX", error);
      throw error; // Esto hace que el error se propague al frontend
    }
  },

  async getProveedores({ commit, state }) {
    const found = await CombustibleService.getProveedores(this.$axios, {
    })
    commit('setProveedores', found)
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
  setValesCreados(state, valesList) {
    state.vales_creados = valesList
  },
  setAllVales(state, valesList){
    state.all_vales = valesList
  },
  removerVale(state, valeId) {
    state.vales_creados = state.vales_creados.filter(vale => vale.id !== valeId);
  },
  setProveedores(state, list){
    state.proveedores = list
  },
}
