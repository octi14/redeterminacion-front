const formatOrden = (OrdenResponse) => ({
  id: OrdenResponse._id,
  nroOrden: OrdenResponse.nroOrden,
  montoSuper: OrdenResponse.monto.montoSuper,
  montoVPower: OrdenResponse.monto.montoVPower,
  saldoSuper: OrdenResponse.saldoRestante.saldoSuper,
  saldoVPower: OrdenResponse.saldoRestante.saldoVPower,
  area: OrdenResponse.area,
})

module.exports = {
  getLatest: async (axios) => {
    const response = await axios.$get('/ordenesCompra')
    return response.data.map(formatOrden)
  },
  getSingle: async (axios, { id }) => {
    const fileResponse = await axios.$get(`/ordenesCompra/${id}`)
    return formatOrden(fileResponse.data)
  },
  create: async (axios, { orden }) => {
    const createdOrden = await axios.$post(
      '/ordenesCompra',
      { orden },
      // {
      //   headers: { Authorization: `Bearer ${userToken}` },
      // }
    )
    return formatOrden(createdOrden.data)
  },
  update: async (axios, { obra, userToken }) => {
    axios.setHeader('Access-Control-Allow-Origin', true)
    const updated = await axios.$put(
      `/ordenesCompra/${obra.id}`,
      { obra },
      // {
      //   headers: { Authorization: `Bearer ${userToken}` },
      // }
    )
    return formatOrden(updated.data)
  },
  delete: async (axios, { id, userToken }) => {
    return await axios.$delete(`/ordenesCompra/${id}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
  },
}
