const CementerioService = require('../service/cementerio.js')

export const state = () => ({
  single: null,
  all: [],
  periodos: [],
  periodo: null,
})

export const actions = {
  async getAll({ commit }) {
    const found = await CementerioService.getAll(this.$axios)
    commit('setAll', found)
  },
  async getSingle({ commit }, { id }) {
    const found = await CementerioService.getSingle(this.$axios, { id })
    commit('setSingle', found)
  },
  async getDocumentos(_context, { id }) {
    return await CementerioService.getDocumentos(this.$axios, { id })
  },
  async create({ commit }, { certificado }) {
    const created = await CementerioService.create(this.$axios, { certificado })
    return created
  },
  async update({ commit }, { id, certificado }) {
    const updated = await CementerioService.update(this.$axios, id, { certificado })
    commit('setSingle', updated)
  },
  async delete({ commit }, { id }) {
    const deleted = await CementerioService.delete(this.$axios, { id })
    return deleted
  },
  async getPeriodos({ commit }) {
    const periodos = await CementerioService.getPeriodos(this.$axios)
    commit('setPeriodos', periodos)
  },
  async getMisPeriodos({ commit }) {
    const periodos = await CementerioService.getMisPeriodos(this.$axios)
    commit('setPeriodos', periodos)
  },
  async getPeriodo({ commit }, { id }) {
    const periodo = await CementerioService.getPeriodo(this.$axios, { id })
    commit('setPeriodo', periodo)
  },
  async confirmarPeriodo({ commit }, payload) {
    const periodo = await CementerioService.confirmarPeriodo(this.$axios, payload)
    commit('setPeriodo', periodo)
    return periodo
  },
  async revisarPago({ commit }, payload) {
    return await CementerioService.revisarPago(this.$axios, payload)
  },
  async revisarPagoMensual({ commit }, payload) {
    return await CementerioService.revisarPagoMensual(this.$axios, payload)
  },
  async resolverPeriodo({ commit }, payload) {
    const periodo = await CementerioService.resolverPeriodo(this.$axios, payload)
    commit('setPeriodo', periodo)
    return periodo
  }
}

export const mutations = {
  setAll(state, list) {
    state.all = list
  },
  setSingle(state, item) {
    state.single = item
  },
  setPeriodos(state, periodos) {
    state.periodos = periodos
  },
  setPeriodo(state, periodo) {
    state.periodo = periodo
  },
}




