const formatVehiculo = (VehiculoResponse) => ({
  id: VehiculoResponse._id,
  patente: VehiculoResponse.dominio, // El backend puede devolver 'patente' o 'dominio'
  area: VehiculoResponse.area,
})

module.exports = {
  async getAll($axios) {
    try {
      const response = await $axios.get('/vehiculos/')
      // El backend devuelve {"data":[]}, así que accedemos a response.data.data
      const vehiculosData = response.data.data || response.data

      // Verificar si vehiculosData es un array
      if (Array.isArray(vehiculosData)) {
        return vehiculosData.map(formatVehiculo)
      } else {
        // Si no es un array, devolver array vacío
        console.warn('El backend devolvió un objeto en lugar de un array para vehículos')
        return []
      }
    } catch (error) {
      console.error('Error al obtener vehículos:', error)
      // Si hay error, devolver array vacío en lugar de lanzar excepción
      return []
    }
  },

  async getById($axios, { id }) {
    try {
      const response = await $axios.get(`/vehiculos/${id}`)
      const vehiculoData = response.data.data || response.data
      return formatVehiculo(vehiculoData)
    } catch (error) {
      console.error('Error al obtener vehículo:', error)
      throw error
    }
  },

  async create($axios, { vehiculo, userToken }) {
    try {
      // Convertir patente a dominio para el backend
      const vehiculoData = {
        dominio: vehiculo.patente, // El backend espera 'dominio'
        area: vehiculo.area
      }

      const response = await $axios.post('/vehiculos/', vehiculoData, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      })
      const vehiculoResponse = response.data.data || response.data
      return formatVehiculo(vehiculoResponse)
    } catch (error) {
      console.error('Error al crear vehículo:', error)
      throw error
    }
  },

  async update($axios, { id, vehiculo, userToken }) {
    try {
      // Convertir patente a dominio para el backend
      const vehiculoData = {
        dominio: vehiculo.patente, // El backend espera 'dominio'
        area: vehiculo.area
      }

      const response = await $axios.put(`/vehiculos/${id}`, vehiculoData, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      })
      const vehiculoResponse = response.data.data || response.data
      return formatVehiculo(vehiculoResponse)
    } catch (error) {
      console.error('Error al actualizar vehículo:', error)
      throw error
    }
  },

  async delete($axios, { id, userToken }) {
    try {
      const response = await $axios.delete(`/vehiculos/${id}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      })
      return response.data.data || response.data
    } catch (error) {
      console.error('Error al eliminar vehículo:', error)
      throw error
    }
  }
}
