const formatFile = (FileResponse) => ({
  id: FileResponse._id,
  expediente: FileResponse.expediente,
  objeto: FileResponse.objeto,
  presup: FileResponse.presup_oficial,
  adjudicado: FileResponse.adjudicado,
  proveedor: FileResponse.proveedor,
  cotizacion: FileResponse.cotizacion,
  items: FileResponse.items,
  garantia_contrato: FileResponse.garantia_contrato,
  adjudicacion: FileResponse.adjudicacion,
  contrato: FileResponse.contrato,
  fecha_contrato: new Date(FileResponse.fecha_contrato),
  ordenanza: FileResponse.ordenanza,
  decreto: FileResponse.decreto,
  plazo_obra: FileResponse.plazo_obra,
  anticipo_finan: FileResponse.anticipo_finan,
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
    const fileResponse = await axios.$get(`/files/${id}`)
    return formatFile(fileResponse.data)
  },
  searchFiles: async (
    axios,
    { name = '', ingredients = [], tags = [], ids = [] }
  ) => {
    const filesResponse = await axios.$post('/files/search', {
      // agrego condicionalmente los parámetros de busqueda
      // (no se agregan los que están vacíos)
      ...(name.length && { name }),
      ...(ids.length && { ids }),
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
}
