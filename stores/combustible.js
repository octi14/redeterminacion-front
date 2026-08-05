import CombustibleService from '../service/combustible'
import { defineStore } from 'pinia'

export const useCombustibleStore = defineStore('combustible', {
  state: () => ({
    single: null,
    all: [],
    vales_creados: [],
    all_vales: [],
    proveedores: [],
  }),

  actions: {
    setAll(filesList) {
      this.all = filesList
    },
    setSingle(singleFile) {
      this.single = singleFile
    },
    setValesCreados(valesList) {
      this.vales_creados = valesList
    },
    setAllVales(valesList) {
      this.all_vales = valesList
    },
    removerVale(valeId) {
      this.vales_creados = this.vales_creados.filter((vale) => vale.id !== valeId)
    },
    removerOrden(ordenId) {
      this.all = this.all.filter((orden) => orden.id !== ordenId)
    },
    setProveedores(list) {
      this.proveedores = list
    },

    async getOrdenesCompra() {
      const found = await CombustibleService.getLatest(useApi(), {})
      this.setAll(found)
    },

    async getSingle({ id }) {
      const found = await CombustibleService.getSingle(useApi(), { id })
      this.setSingle(found)
    },

    async create({ orden }) {
      return await CombustibleService.create(useApi(), { orden })
    },

    async getAllVales() {
      const found = await CombustibleService.getAllVales(useApi(), {})
      this.setAllVales(found)
    },

    async getValesSingle({ id }) {
      this.setValesCreados(null)
      const found = await CombustibleService.getValesSingle(useApi(), { id })
      this.setValesCreados(found)
    },

    async generarVales({ payload }) {
      const createdVales = await CombustibleService.generarVales(useApi(), { payload })
      this.setValesCreados(createdVales)
    },

    async consumirVale({ id, vale }) {
      try {
        await CombustibleService.consumirVale(useApi(), id, { vale })
      } catch (e) {
        throw new Error(e.message)
      }
    },

    async anularVale({ id, userToken }) {
      try {
        await CombustibleService.anularVale(useApi(), { id, userToken })
      } catch (error) {
        console.error('Error del store', error)
        throw error
      }
    },

    async eliminarOrden({ id, userToken }) {
      try {
        await CombustibleService.delete(useApi(), { id, userToken })
        this.removerOrden(id)
        return true
      } catch (error) {
        console.error('Error del store', error)
        throw error
      }
    },

    async getProveedores() {
      const found = await CombustibleService.getProveedores(useApi(), {})
      this.setProveedores(found)
    },
  },
})
