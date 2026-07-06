const formatFecha = (fecha) => ({
  fecha: fecha.data,
})

export default {
  get: async (axios) => {
    const fecha = await axios.$get('/fecha')
    return formatFecha(fecha)
  },
}

