const VehiculoService = require('../service/vehiculo')

export const state = () => ({
  single: null,
  all: [],
})

export const actions = {
  async getAll({ commit, state }) {
    try {
      const found = await VehiculoService.getAll(this.$axios)
      commit('setAll', found)
      return found
    } catch (error) {
      console.error('Error al cargar vehículos:', error)
      // En caso de error, establecer array vacío
      commit('setAll', [])
      return []
    }
  },

  async getSingle({ commit, state }, { id }) {
    const found = await VehiculoService.getById(this.$axios, { id })
    commit('setSingle', found)
  },

  async create({ commit, state }, { vehiculo, userToken }) {
    try {
      const newVehiculo = await VehiculoService.create(this.$axios, { vehiculo, userToken })
      // Agregar el nuevo vehículo al array existente
      const currentAll = state.all || []
      commit('setAll', [...currentAll, newVehiculo])
      return newVehiculo
    } catch (error) {
      console.error('Error al crear vehículo:', error)
      throw error
    }
  },

  async update({ commit, state }, { id, vehiculo, userToken }) {
    try {
      const updatedVehiculo = await VehiculoService.update(this.$axios, { id, vehiculo, userToken })
      // Actualizar el vehículo en el array
      const currentAll = state.all || []
      const updatedAll = currentAll.map(v => v.id === id ? updatedVehiculo : v)
      commit('setAll', updatedAll)
      return updatedVehiculo
    } catch (error) {
      console.error('Error al actualizar vehículo:', error)
      throw error
    }
  },

  async delete({ commit, state }, { id, userToken }) {
    try {
      await VehiculoService.delete(this.$axios, { id, userToken })
      // Remover el vehículo del array
      const currentAll = state.all || []
      const filteredAll = currentAll.filter(v => v.id !== id)
      commit('setAll', filteredAll)
      return true
    } catch (error) {
      console.error('Error al eliminar vehículo:', error)
      throw error
    }
  }
}

export const mutations = {
  setAll(state, vehiculosList) {
    state.all = vehiculosList
  },
  setSingle(state, singleVehiculo) {
    state.single = singleVehiculo
  }
}
