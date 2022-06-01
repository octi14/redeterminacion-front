const formatCateg = (CategResponse) => ({
  id: CategResponse._id,
  nombre: CategResponse.nombre,
})

module.exports = {
  getLatest: async (axios,
    //  { skip = 0, limit = 6 }
     ) => {
    const categsResponse = await axios.$get('/categorias', {
      // params: {
      //   skip,
      //   limit,
      // },
    })
    return categsResponse.data.map(formatCateg)
  },
  // search: async (
  //   axios,
  //   { obra = ''}
  // ) => {
  //   const filesResponse = await axios.$post('/certificados/search', {
  //     // agrego condicionalmente los parámetros de busqueda
  //     // (no se agregan los que están vacíos)
  //     ...(obra.length && { obra }),
  //     // ...(objeto.length && { objeto }),
  //     // ...(adjudicado.length && { adjudicado }),
  //   })
  //   return filesResponse.data.map(formatCertif)
  // },
  // getSingle: async (axios, { id }) => {
  //   const certifResponse = await axios.$get(`/certificados/${id}`)
  //   return formatCertif(certifResponse.data)
  // },
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
  create: async (axios, { certificado, userToken }) => {
    const createdCertif = await axios.$post(
      '/certificados',
      { certificado },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    )
    return formatCertif(createdCertif.data)
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
  delete: async (axios, { id, userToken }) => {
    return await axios.$delete(`/certificados/${id}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
  },
}
