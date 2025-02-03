const formatOrden = (OrdenResponse) => ({
  id: OrdenResponse._id,
  nroOrden: OrdenResponse.nroOrden,
  montoSuper: OrdenResponse.monto.montoSuper,
  montoVPower: OrdenResponse.monto.montoVPower,
  saldoSuper: OrdenResponse.saldoRestante.saldoSuper,
  saldoVPower: OrdenResponse.saldoRestante.saldoVPower,
  area: OrdenResponse.area,
  vales: OrdenResponse.vales ? OrdenResponse.vales.length : 0,  // Aquí agregas el campo 'vales' con la longitud
  observaciones: String(OrdenResponse.observaciones),
})

const formatVale = (ValeResponse) => ({
  id: ValeResponse._id,
  orden_id: ValeResponse.orden,
  monto: ValeResponse.monto,
  tipoCombustible: ValeResponse.tipoCombustible,
  area: ValeResponse.area,
  fechaEmision: new Date(ValeResponse.fechaEmision),
  consumido: ValeResponse.consumido,
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
  getAllVales: async (axios) => {
    const response = await axios.$get('/valesCombustible')
    return response.data.map(formatVale)
  },
  getValesSingle: async (axios, { id }) => {
    const response = await axios.$post('/valesCombustible/single',
      { id }
    );
    return response.data.map(formatVale)
  },
  generarVales: async (axios, { payload }) => {
    const createdVales = await axios.$post(
      '/valesCombustible',
      { payload },
    )
    return createdVales.data.map(formatVale)
  },
  deleteVale: async (axios, { id, userToken }) =>{
    console.log("Borrandolo...")
    return await axios.$delete(`/valesCombustible/${id}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
  }
}
