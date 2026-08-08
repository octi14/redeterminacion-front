import CementerioService from '../service/cementerio.js'
import { defineStore } from 'pinia'

export const useCementerioStore = defineStore('cementerio', {
  state: () => ({
    single: null,
    all: [],
    periodos: [],
    periodo: null,
  }),

  actions: {
    setAll(list) {
      this.all = list
    },
    setSingle(item) {
      this.single = item
    },
    setPeriodos(list) {
      this.periodos = list
    },
    setPeriodo(item) {
      this.periodo = item
    },

    async getAll() {
      const found = await CementerioService.getAll(useApi())
      this.setAll(found)
    },

    async getSingle({ id }) {
      const found = await CementerioService.getSingle(useApi(), { id })
      this.setSingle(found)
    },

    async create({ certificado }) {
      return await CementerioService.create(useApi(), { certificado })
    },

    async update({ id, certificado }) {
      const updated = await CementerioService.update(useApi(), id, { certificado })
      this.setSingle(updated)
    },

    async delete({ id }) {
      return await CementerioService.delete(useApi(), { id })
    },

    async getPeriodos() {
      const periodos = await CementerioService.getPeriodos(useApi())
      this.setPeriodos(periodos)
    },

    async getMisPeriodos({ funerariaId } = {}) {
      const periodos = await CementerioService.getMisPeriodos(useApi(), { funerariaId })
      this.setPeriodos(periodos)
    },

    async getPeriodo({ id }) {
      const periodo = await CementerioService.getPeriodo(useApi(), { id })
      this.setPeriodo(periodo)
      return periodo
    },

    async confirmarPeriodo({ id, comprobantePagoMensual }) {
      const periodo = await CementerioService.confirmarPeriodo(useApi(), { id, comprobantePagoMensual })
      this.setPeriodo(periodo)
      return periodo
    },

    async revisarPago({ periodoId, fallecidoId, estado, observacion }) {
      return await CementerioService.revisarPago(useApi(), { periodoId, fallecidoId, estado, observacion })
    },

    async revisarPagoMensual({ periodoId, estado, observacion }) {
      return await CementerioService.revisarPagoMensual(useApi(), { periodoId, estado, observacion })
    },

    async resolverPeriodo({ id, estado, observacion }) {
      const periodo = await CementerioService.resolverPeriodo(useApi(), { id, estado, observacion })
      this.setPeriodo(periodo)
      return periodo
    },
  },
})
