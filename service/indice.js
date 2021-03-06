const formatIndice = (IndiceResponse) => ({
  id: IndiceResponse._id,
  año: IndiceResponse.año,
  mes: IndiceResponse.mes,
  categoria: IndiceResponse.categoria,
  valor: IndiceResponse.valor,
})

const formatItem = (ItemsData) => ({
  año: ItemsData.año,
  mes: ItemsData.mes,
  categoria: ItemsData.categoria,
  valor: ItemsData.valor,
})

module.exports = {
  getLatest: async (axios,
    //  { skip = 0, limit = 6 }
     ) => {
    const indicesResponse = await axios.$get('/indices', {
      // params: {
      //   skip,
      //   limit,
      // },
    })
    return indicesResponse.data.map(formatIndice)
  },
  search: async (
    axios,
    { mes, año }
  ) => {
    const filesResponse = await axios.$post('/indices/search', {
      mes,
      año,
      // agrego condicionalmente los parámetros de busqueda
      // (no se agregan los que están vacíos)
      // ...(obra.length && { obra }),
      // ...(objeto.length && { objeto }),
      // ...(adjudicado.length && { adjudicado }),
    })
    return filesResponse.data.map(formatIndice)
  },
  searchSingle: async (
    axios,
    { mes, año, categoria }
  ) => {
    const filesResponse = await axios.$post('/indices/searchSingle', {
      mes,
      año,
      categoria,
      // agrego condicionalmente los parámetros de busqueda
      // (no se agregan los que están vacíos)
      // ...(obra.length && { obra }),
      // ...(objeto.length && { objeto }),
      // ...(adjudicado.length && { adjudicado }),
    })
    return formatIndice(filesResponse.data)
  },
  getSingle: async (axios, { id }) => {
    const indiceResponse = await axios.$get(`/indices/${id}`)
    return formatIndice(indiceResponse.data)
  },
  // searchIndices: async (
  //   axios,
  //   { expediente = '', objeto = '', adjudicado = '' }
  // ) => {
  //   const indicesResponse = await axios.$post('/indices/search', {
  //     // agrego condicionalmente los parámetros de busqueda
  //     // (no se agregan los que están vacíos)
  //     ...(expediente.length && { expediente }),
  //     ...(objeto.length && { objeto }),
  //     ...(adjudicado.length && { adjudicado }),
  //   })
  //   return indicesResponse.data.map(formatIndice)
  // },
  create: async (axios, { indice, userToken }) => {
    const createdIndice = await axios.$post(
      '/indices',
      { indice },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    )
    return formatIndice(createdIndice.data)
  },
  update: async (axios, { obra, userToken }) => {
    axios.setHeader('Access-Control-Allow-Origin', true)
    const updated = await axios.$put(
      `/indices/${obra.id}`,
      { obra },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    )
    return formatIndice(updated.data)
  },
  delete: async (axios, { id, userToken }) => {
    return await axios.$delete(`/indices/${id}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
  },
}
