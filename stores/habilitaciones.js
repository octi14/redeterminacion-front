import HabilitacionService from '../service/habilitacion.js'
import { defineStore } from 'pinia'

export const useHabilitacionesStore = defineStore('habilitaciones', {
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
    setSingleVisible(visible) {
      if (this.single) {
        this.single.visible = visible
      }
    },
    ordenarHabilitaciones() {
      this.all.sort((a, b) => b.nroTramite - a.nroTramite)
    },

    async getAll() {
      const userToken = useUserStore().token
      const found = await HabilitacionService.getAll(useApi(), { userToken })
      this.setAll(found)
    },

    async getByNroTramite({ nroTramite }) {
      this.setSingle(null)
      const found = await HabilitacionService.getByNroTramite(useApi(), { nroTramite })
      this.setSingle(found)
    },

    async getSingle({ id }) {
      const found = await HabilitacionService.getSingle(useApi(), { id })
      this.setSingle(found)
    },

    async create({ habilitacion, notificacion }) {
      return await HabilitacionService.create(useApi(), { habilitacion, notificacion })
    },

    async update({ id, habilitacion, notificacion }) {
      try {
        const updated = await HabilitacionService.update(useApi(), id, { habilitacion, notificacion })
        this.setSingle(updated)
      } catch (e) {
        throw new Error(e.message)
      }
    },

    async updateLazy({ id, habilitacion, notificacion }) {
      try {
        await HabilitacionService.updateLazy(useApi(), id, { habilitacion, notificacion })
      } catch (e) {
        throw new Error(e.message)
      }
    },

    async delete({ id, userToken }) {
      return await HabilitacionService.delete(useApi(), { id, userToken })
    },

    async descargar({ id }) {
      try {
        return await HabilitacionService.descargarHabilitacion(useApi(), { id })
      } catch (error) {
        console.error('Error en la acción descargarHabilitacion:', error)
        throw error
      }
    },
  },
})
