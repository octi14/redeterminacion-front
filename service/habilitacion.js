const formatFile = (FileResponse) => ({
  id: FileResponse._id,
  tipoSolicitud: FileResponse.solicitante.tipoSolicitud,
  dni: FileResponse.solicitante.DNI,
  mail: FileResponse.solicitante.mail,
  rubro: FileResponse.inmueble.rubro,
  status: FileResponse.status,
  // fecha_contrato: FileResponse.fecha_contrato.substr(0, 10),
  // acta_inicio: FileResponse.acta_inicio.substr(0,10),
  createdAt: new Date(FileResponse.createdAt).toLocaleDateString(),
})

const formatExtendedFile = (FileResponse) => ({
  id: FileResponse._id,
  tipoSolicitud: FileResponse.solicitante.tipoSolicitud,
  nombre: FileResponse.solicitante.nombre,
  apellido: FileResponse.solicitante.apellido,
  dni: FileResponse.solicitante.DNI,
  cuit: FileResponse.solicitante.cuit,
  razonSocial: FileResponse.solicitante.razonSocial,
  domicilioReal: FileResponse.solicitante.domicilioReal,
  telefono: FileResponse.solicitante.telefono,
  codigoPostal: FileResponse.solicitante.codigoPostal,
  localidad: FileResponse.solicitante.localidad, //Preguntar a myriam
  provincia: FileResponse.solicitante.provincia,
  mail: FileResponse.solicitante.mail,
  esApoderado: FileResponse.solicitante.esApoderado,

  localidadInmueble: FileResponse.inmueble.localidad,
  calleInmueble: FileResponse.inmueble.calle,
  nro: FileResponse.inmueble.nro,
  nroLocal: FileResponse.inmueble.nroLocal,
  nombreFantasia: FileResponse.inmueble.nombreFantasia,
  rubro: FileResponse.inmueble.rubro,
  espacioPublico: FileResponse.inmueble.espacioPublico,
  // serviciosHoteleria: [{ servicio: String, value: Boolean }],
  // marquesina: { type: Boolean, default: false },
  // mercaderia: { type: Boolean, default: false },
  // mesas: { type: Boolean, default: false },
  // carteles: { type: Boolean, default: false }
  documentos: FileResponse.documentos,
  status: FileResponse.status,
  nroTramite: FileResponse.nroSolicitud,
  // fecha_contrato: FileResponse.fecha_contrato.substr(0, 10),
  // acta_inicio: FileResponse.acta_inicio.substr(0,10),
  createdAt: new Date(FileResponse.createdAt),
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
  getByNroTramite: async (axios, { nroTramite }) => {
    const fileResponse = await axios.$post('/habilitaciones/nroTramite', {nroTramite})
    if (fileResponse.data){
      return formatFile(fileResponse.data)
    }else{
      return null
    }
  },
  getSingle: async (axios, { id }) => {
    const fileResponse = await axios.$get(`/habilitaciones/${id}`)
    return formatExtendedFile(fileResponse.data)
  },
  create: async (axios, { habilitacion }) => {

    const createdFile = await axios.$post('/habilitaciones', { habilitacion });

    return createdFile;
  },
  update: async (axios, id, { habilitacion, userToken }) => {
    axios.setHeader('Access-Control-Allow-Origin', true)
    const updated = await axios.$put(
      `/habilitaciones/${id}`,
      { habilitacion },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    )
    return formatFile(updated)
  },
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
