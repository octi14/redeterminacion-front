import VehiculoService from '../service/vehiculo'
import { defineStore } from 'pinia'

export const useVehiculosStore = defineStore('vehiculos', {
  state: () => ({
    single: null,
    all: [],
  }),

  actions: {
    setAll(vehiculosList) {
      this.all = vehiculosList
    },
    setSingle(singleVehiculo) {
      this.single = singleVehiculo
    },

    async getAll() {
      try {
        const found = await VehiculoService.getAll(useApi())
        this.setAll(found)
        return found
      } catch (error) {
        console.error('Error al cargar vehículos:', error)
        this.setAll([])
        return []
      }
    },

    async getSingle({ id }) {
      const found = await VehiculoService.getById(useApi(), { id })
      this.setSingle(found)
    },

    async create({ vehiculo, userToken }) {
      try {
        const newVehiculo = await VehiculoService.create(useApi(), { vehiculo, userToken })
        const currentAll = this.all || []
        this.setAll([...currentAll, newVehiculo])
        return newVehiculo
      } catch (error) {
        console.error('Error al crear vehículo:', error)
        throw error
      }
    },

    async update({ id, vehiculo, userToken }) {
      try {
        const updatedVehiculo = await VehiculoService.update(useApi(), { id, vehiculo, userToken })
        const currentAll = this.all || []
        const updatedAll = currentAll.map((v) => (v.id === id ? updatedVehiculo : v))
        this.setAll(updatedAll)
        return updatedVehiculo
      } catch (error) {
        console.error('Error al actualizar vehículo:', error)
        throw error
      }
    },

    async delete({ id, userToken }) {
      try {
        await VehiculoService.delete(useApi(), { id, userToken })
        const currentAll = this.all || []
        this.setAll(currentAll.filter((v) => v.id !== id))
        return true
      } catch (error) {
        console.error('Error al eliminar vehículo:', error)
        throw error
      }
    },
  },
})
