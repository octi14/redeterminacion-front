import TurnoService from '../service/turno'
import { defineStore } from 'pinia'

export const useTurnosStore = defineStore('turnos', {
  state: () => ({
    single: null,
    all: [],
  }),

  actions: {
    setAll(filesList) {
      this.all = filesList
    },
    setSingle(singleFile) {
      this.single = singleFile
    },
    removeItem(fileId) {
      this.all = this.all.filter((file) => file.id !== fileId)
    },
    ordenar() {
      this.all.sort((a, b) => b.nroTramite - a.nroTramite)
    },

    async getAll() {
      const found = await TurnoService.getAll(useApi(), {})
      this.setAll(found)
    },

    async getSingle({ nroTramite }) {
      this.setSingle(null)
      const found = await TurnoService.getSingle(useApi(), { nroTramite })
      this.setSingle(found)
    },

    async getById({ id }) {
      this.setSingle(null)
      const found = await TurnoService.getById(useApi(), { id })
      this.setSingle(found)
    },

    async create({ turno }) {
      return await TurnoService.create(useApi(), { turno })
    },

    async update({ id, turno, userToken }) {
      try {
        const updated = await TurnoService.update(useApi(), { id, turno, userToken })
        this.setSingle({ updated })
      } catch (e) {
        throw new Error('Error actualizando')
      }
    },

    async delete({ id, userToken }) {
      const deleted = await TurnoService.delete(useApi(), { id, userToken })
      this.removeItem(id)
      return deleted
    },
  },
})
