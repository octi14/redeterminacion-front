const formatFile = (FileResponse) => ({
  id: FileResponse._id,
  tipoSolicitud: FileResponse.solicitante.tipoSolicitud,
  dni: FileResponse.solicitante.dni,
  mail: FileResponse.solicitante.mail,
  rubro: FileResponse.inmueble.rubro,
  localidad: FileResponse.inmueble.localidad,
  telefono: FileResponse.solicitante.telefono,
  status: FileResponse.status,
  observaciones: FileResponse.observaciones,
  nroTramite: FileResponse.nroSolicitud,
  nroExpediente: FileResponse.nroExpediente,
  // fecha_contrato: FileResponse.fecha_contrato.substr(0, 10),
  // acta_inicio: FileResponse.acta_inicio.substr(0,10),
  createdAt: new Date(FileResponse.createdAt).toLocaleDateString('es-AR'),
})

const formatExtendedFile = (FileResponse) => ({
  id: FileResponse._id,
  tipoSolicitud: FileResponse.solicitante.tipoSolicitud,
  nombre: FileResponse.solicitante.nombre,
  apellido: FileResponse.solicitante.apellido,
  dni: FileResponse.solicitante.dni,
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
  descripcionRubro: FileResponse.inmueble.descripcionRubro,
  espacioPublico: FileResponse.inmueble.espacioPublico,
  serviciosHoteleria: FileResponse.inmueble.serviciosHoteleria,
  marquesina: FileResponse.inmueble.marquesina,
  mercaderia: FileResponse.inmueble.mercaderia,
  mesas: FileResponse.inmueble.mesas,
  carteles: FileResponse.inmueble.carteles,
  otrosServicios: FileResponse.inmueble.otrosServicios,
  // documentos: FileResponse.documentos,
  status: FileResponse.status,
  nroTramite: FileResponse.nroSolicitud,
  nroExpediente: FileResponse.nroExpediente,
  alcance: FileResponse.alcance,
  nroLegajo: FileResponse.nroLegajo,
  observaciones: FileResponse.observaciones,
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
  update: async (axios, id, { habilitacion }) => {
    axios.setHeader('Access-Control-Allow-Origin', true)
    const updated = await axios.$put(
      `/habilitaciones/${id}`,
      { habilitacion },
    )
    return formatFile(updated)
  },
  updateLazy: async (axios, id, { habilitacion }) => {
    axios.setHeader('Access-Control-Allow-Origin', true)
    const updated = await axios.$put(
      `/habilitaciones/lazy/${id}`,
      { habilitacion },
    )
    // return formatFile(updated)
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
