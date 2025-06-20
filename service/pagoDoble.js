const formatFile = (FileResponse) => ({
  id: FileResponse._id,
  dni: FileResponse.solicitante.dni,
  cuit: FileResponse.solicitante.cuit,
  mail: FileResponse.solicitante.mail,
  localidad: FileResponse.solicitante.localidad,
  nroCuenta: FileResponse.solicitante.nroCuenta,
  telefono: FileResponse.solicitante.telefono,
  status: FileResponse.status,
  observaciones: FileResponse.observaciones,
  nroTramite: FileResponse.nroSolicitud,
  // nroExpediente: FileResponse.nroExpediente,
  // fecha_contrato: FileResponse.fecha_contrato.substr(0, 10),
  // acta_inicio: FileResponse.acta_inicio.substr(0,10),
  createdAt: new Date(FileResponse.createdAt).toLocaleDateString('es-AR'),
})

const formatExtendedFile = (FileResponse) => ({
  id: FileResponse._id,
  nombre: FileResponse.solicitante.nombre,
  apellido: FileResponse.solicitante.apellido,
  dni: FileResponse.solicitante.dni,
  cuit: FileResponse.solicitante.cuit,
  nroCuenta: FileResponse.solicitante.nroCuenta,
  domicilioReal: FileResponse.solicitante.domicilioReal,
  telefono: FileResponse.solicitante.telefono,
  codigoPostal: FileResponse.solicitante.codigoPostal,
  localidad: FileResponse.solicitante.localidad, //Preguntar a myriam
  provincia: FileResponse.solicitante.provincia,
  mail: FileResponse.solicitante.mail,
  esApoderado: FileResponse.solicitante.esApoderado,

  // documentos: FileResponse.documentos,
  status: FileResponse.status,
  nroTramite: FileResponse.nroSolicitud,
  nroExpediente: FileResponse.nroExpediente,
  alcance: FileResponse.alcance,
  observaciones: FileResponse.observaciones,
  createdAt: new Date(FileResponse.createdAt),
})

module.exports = {
  getAll: async (axios) => {
    const filesResponse = await axios.$get('/pagosDobles', {})
    return filesResponse.data.map(formatFile)
  },
  getByNroTramite: async (axios, { nroTramite }) => {
    const fileResponse = await axios.$post('/pagosDobles/nroTramite', {nroTramite})
    if (fileResponse.data){
      return formatFile(fileResponse.data)
    }else{
      return null
    }
  },
  getSingle: async (axios, { id }) => {
    const fileResponse = await axios.$get(`/pagosDobles/${id}`)
    return formatExtendedFile(fileResponse.data)
  },
  create: async (axios, { pagoDoble }) => {
    const createdFile = await axios.$post('/pagosDobles', { pagoDoble });
    return createdFile;
  },
  update: async (axios, id, { pago }) => {
    axios.setHeader('Access-Control-Allow-Origin', true)
    const updated = await axios.$put(
      `/pagosDobles/${id}`,
      { pago },
    )
    return formatFile(updated)
  },
  updateLazy: async (axios, id, { pagoDoble }) => {
    axios.setHeader('Access-Control-Allow-Origin', true)
    const updated = await axios.$put(
      `/pagosDobles/lazy/${id}`,
      { pagoDoble },
    )
    // return formatFile(updated)
  },
  descargarPagoDoble: async (axios, { id }) => {
    return await axios.$get(`/pagosDobles/descargar/${id}`, {
      responseType: 'blob',
    });
  },
}
