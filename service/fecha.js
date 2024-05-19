const formatFecha = (fecha) => ({
  fecha: fecha.data,
})

module.exports = {
  get: async (axios) => {
    const fecha = await axios.$get('/fecha')
    return formatFecha(fecha)
  },
}
