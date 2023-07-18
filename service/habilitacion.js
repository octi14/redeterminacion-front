const formatFile = (FileResponse) => ({
  id: FileResponse._id,
  // expediente: FileResponse.expediente,
  // objeto: FileResponse.objeto,
  // presup_oficial: FileResponse.presup_oficial,
  // adjudicado: FileResponse.adjudicado,
  // proveedor: FileResponse.proveedor,
  // cotizacion: FileResponse.cotizacion,
  // items: FileResponse.items,
  // certificados: FileResponse.certificados,
  // garantia_contrato: FileResponse.garantia_contrato,
  // adjudicacion: FileResponse.adjudicacion,
  // contrato: FileResponse.contrato,
  // fecha_contrato: FileResponse.fecha_contrato.substr(0, 10),
  // acta_inicio: FileResponse.acta_inicio.substr(0,10),
  // ordenanza: FileResponse.ordenanza,
  // decreto: FileResponse.decreto,
  // plazo_habilitacion: FileResponse.plazo_habilitacion,
  // anticipo_finan: FileResponse.anticipo_finan,
  // ponderacion: FileResponse.ponderacion,
  // createdAt: new Date(FileResponse.createdAt),
})

module.exports = {
  getAll: async (axios,
    //  { skip = 0, limit = 6 }
     ) => {
    const filesResponse = await axios.$get('/habilitaciones', {
      // params: {
      //   skip,
      //   limit,
      // },
    })
    return filesResponse.data.map(formatFile)
  },
  // getSingle: async (axios, { id }) => {
  //   const fileResponse = await axios.$get(`/habilitaciones/${id}`)
  //   return formatFile(fileResponse.data)
  // },
  create: async (axios, { habilitacion, userToken }) => {
    console.log(habilitacion)
    const createdFile = await axios.$post(
      '/habilitaciones',
      { habilitacion },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    )
    return formatFile(createdFile.data)
  },
  // update: async (axios, { habilitacion, userToken }) => {
  //   axios.setHeader('Access-Control-Allow-Origin', true)
  //   const updated = await axios.$put(
  //     `/habilitaciones/${habilitacion.id}`,
  //     { habilitacion },
  //     {
  //       headers: { Authorization: `Bearer ${userToken}` },
  //     }
  //   )
  //   return formatFile(updated.data)
  // },
  delete: async (axios, { id, userToken }) => {
    return await axios.$delete(`/habilitaciones/${id}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
  },

  // searchFiles: async (
  //   axios,
  //   { expediente = '', objeto = '', adjudicado = '' }
  // ) => {
  //   const filesResponse = await axios.$post('/habilitaciones/search', {
  //     // agrego condicionalmente los parámetros de busqueda
  //     // (no se agregan los que están vacíos)
  //     ...(expediente.length && { expediente }),
  //     ...(objeto.length && { objeto }),
  //     ...(adjudicado.length && { adjudicado }),
  //   })
  //   return filesResponse.data.map(formatFile)
  // },
}
