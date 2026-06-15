const { unwrapData } = require('../utils/cementerio.js')

const formatFile = (res) => ({
  id: res._id,
  estado: res.estado,
  createdAt: new Date(res.createdAt).toLocaleDateString('es-AR'),
  funeraria: res.funeraria,
  obito: res.obito,
  funerariaId: res.funerariaId,
  periodoId: res.periodoId,
  tipoSepultura: res.tipoSepultura,
  precioAplicado: res.precioAplicado,
  condicionPago: res.condicionPago,
  estadoRevisionPago: res.estadoRevisionPago,
  // Campos planos útiles para listados
  cuit: res.funeraria && res.funeraria.cuit,
  mail: res.funeraria && res.funeraria.mail,
  responsable: res.funeraria && res.funeraria.responsable,
});

module.exports = {
  getAll: async (axios) => {
    const response = await axios.$get('/cementerio/certificadosDefuncion');
    return unwrapData(response).map(formatFile);
  },
  getSingle: async (axios, { id }) => {
    const response = await axios.$get(`/cementerio/certificadosDefuncion/${id}`);
    return formatFile(unwrapData(response));
  },
  getDocumentos: async (axios, { id }) => {
    const response = await axios.$get(`/cementerio/certificadosDefuncion/documentos/${id}`);
    return unwrapData(response); // { nombreDocumento: { url } }
  },
  create: async (axios, { certificado }) => {
    const created = await axios.$post('/cementerio/certificadosDefuncion', { certificado });
    return created;
  },
  update: async (axios, id, { certificado }) => {
    const updated = await axios.$put(`/cementerio/certificadosDefuncion/${id}`, { certificado });
    return formatFile(unwrapData(updated));
  },
  delete: async (axios, { id }) => {
    return await axios.$delete(`/cementerio/certificadosDefuncion/${id}`);
  },
  getPeriodos: async (axios) => {
    return unwrapData(await axios.$get('/cementerio/periodos'));
  },
  getMisPeriodos: async (axios) => {
    return unwrapData(await axios.$get('/cementerio/periodos/mis-periodos'));
  },
  getPeriodo: async (axios, { id }) => {
    return unwrapData(await axios.$get(`/cementerio/periodos/${id}`));
  },
  confirmarPeriodo: async (axios, { id, comprobantePagoMensual }) => {
    return unwrapData(await axios.$post(`/cementerio/periodos/${id}/confirmar`, { comprobantePagoMensual }));
  },
  revisarPago: async (axios, { periodoId, fallecidoId, estado, observacion }) => {
    return unwrapData(await axios.$put(`/cementerio/periodos/${periodoId}/fallecidos/${fallecidoId}/revision`, { estado, observacion }));
  },
  revisarPagoMensual: async (axios, { periodoId, estado, observacion }) => {
    return unwrapData(await axios.$put(`/cementerio/periodos/${periodoId}/revision-pago-mensual`, { estado, observacion }));
  },
  resolverPeriodo: async (axios, { id, estado, observacion }) => {
    return unwrapData(await axios.$put(`/cementerio/periodos/${id}/resolver`, { estado, observacion }));
  },
}


