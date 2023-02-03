const formatRedet = (RedeterminacionResponse) => ({
  id: RedeterminacionResponse._id,
  obra: RedeterminacionResponse.obra,
  certificado: RedeterminacionResponse.certificado,
  items: RedeterminacionResponse.items.map(formatItem),
})

const formatItem = (ItemsData) => ({
  item: ItemsData.item,
  saldo: ItemsData.saldo,
  materiales: ItemsData.materiales,
  generales: ItemsData.generales,
  manoObra: ItemsData.manoObra,
  equipos: ItemsData.equipos,
  uvi: ItemsData.uvi,
})

module.exports = {
  getLatest: async (axios,
    //  { skip = 0, limit = 6 }
     ) => {
    const certifsResponse = await axios.$get('/certificados', {
      // params: {
      //   skip,
      //   limit,
      // },
    })
    return certifsResponse.data.map(formatCertif)
  },
  search: async (
    axios,
    { obra, certificado }
  ) => {
    const filesResponse = await axios.$post('/redeterminaciones/search', {
      obra,
      certificado,
      // agrego condicionalmente los parámetros de busqueda
      // (no se agregan los que están vacíos)
      // ...(obra.length && { obra }),
      // ...(objeto.length && { objeto }),
      // ...(adjudicado.length && { adjudicado }),
    })
    return filesResponse.data.map(formatRedet)
  },
  searchByObra: async (
    axios,
    { obra }
  ) => {
    const filesResponse = await axios.$post('/redeterminaciones/searchByObra', {
      obra,
      // agrego condicionalmente los parámetros de busqueda
      // (no se agregan los que están vacíos)
      // ...(obra.length && { obra }),
      // ...(objeto.length && { objeto }),
      // ...(adjudicado.length && { adjudicado }),
    })
    return filesResponse.data.map(formatRedet)
  },
  getSingle: async (axios, { id }) => {
    const redetResponse = await axios.$get(`/redeterminaciones/${id}`)
    return formatRedet(redetResponse.data)
  },
  // searchCertifs: async (
  //   axios,
  //   { expediente = '', objeto = '', adjudicado = '' }
  // ) => {
  //   const certifsResponse = await axios.$post('/certificados/search', {
  //     // agrego condicionalmente los parámetros de busqueda
  //     // (no se agregan los que están vacíos)
  //     ...(expediente.length && { expediente }),
  //     ...(objeto.length && { objeto }),
  //     ...(adjudicado.length && { adjudicado }),
  //   })
  //   return certifsResponse.data.map(formatCertif)
  // },
  create: async (axios, { obra, certificado, items, userToken }) => {
    const created = await axios.$post(
      '/redeterminaciones',
      { obra, certificado, items },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    )
    return formatRedet(created.data)
  },
  update: async (axios, { obra, userToken }) => {
    axios.setHeader('Access-Control-Allow-Origin', true)
    const updated = await axios.$put(
      `/certificados/${obra.id}`,
      { obra },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    )
    return formatCertif(updated.data)
  },
  delete: async (axios, { redeterminacion, userToken }) => {
    return await axios.$delete(`/redeterminaciones/${redeterminacion.id}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
  },
}
