const formatFile = (FileResponse) => ({
  id: FileResponse._id,
  expediente: FileResponse.expediente,
  objeto: FileResponse.objeto,
  presup_oficial: FileResponse.presup_oficial,
  adjudicado: FileResponse.adjudicado,
  proveedor: FileResponse.proveedor,
  cotizacion: FileResponse.cotizacion,
  items: FileResponse.items,
  certificados: FileResponse.certificados,
  garantia_contrato: FileResponse.garantia_contrato,
  adjudicacion: FileResponse.adjudicacion,
  contrato: FileResponse.contrato,
  fecha_contrato: new Date(FileResponse.fecha_contrato).toLocaleDateString('es-AR'),
  acta_inicio: new Date(FileResponse.acta_inicio).toLocaleDateString('es-AR'),
  ordenanza: FileResponse.ordenanza,
  decreto: FileResponse.decreto,
  plazo_obra: FileResponse.plazo_obra,
  anticipo_finan: FileResponse.anticipo_finan,
  ponderacion: FileResponse.ponderacion,
  createdAt: new Date(FileResponse.createdAt),
})

module.exports = {
  getLatest: async (axios,
    //  { skip = 0, limit = 6 }
     ) => {
    const filesResponse = await axios.$get('/obras', {
      // params: {
      //   skip,
      //   limit,
      // },
    })
    return filesResponse.data.map(formatFile)
  },
  getSingle: async (axios, { id }) => {
    const fileResponse = await axios.$get(`/obras/${id}`)
    return formatFile(fileResponse.data)
  },
  searchFiles: async (
    axios,
    { expediente = '', objeto = '', adjudicado = '' }
  ) => {
    const filesResponse = await axios.$post('/obras/search', {
      // agrego condicionalmente los parámetros de busqueda
      // (no se agregan los que están vacíos)
      ...(expediente.length && { expediente }),
      ...(objeto.length && { objeto }),
      ...(adjudicado.length && { adjudicado }),
    })
    return filesResponse.data.map(formatFile)
  },
  create: async (axios, { obra, userToken }) => {
    const createdFile = await axios.$post(
      '/obras',
      { obra },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    )
    return formatFile(createdFile.data)
  },
  update: async (axios, { obra, userToken }) => {
    axios.setHeader('Access-Control-Allow-Origin', true)
    const updated = await axios.$put(
      `/obras/${obra.id}`,
      { obra },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    )
    return formatFile(updated.data)
  },
  delete: async (axios, { id, userToken }) => {
    return await axios.$delete(`/obras/${id}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
  },
}
