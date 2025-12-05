const formatFile = (res) => ({
  id: res._id,
  estado: res.estado,
  createdAt: new Date(res.createdAt).toLocaleDateString('es-AR'),
  funeraria: res.funeraria,
  obito: res.obito,
  // Campos planos útiles para listados
  cuit: res.funeraria && res.funeraria.cuit,
  mail: res.funeraria && res.funeraria.mail,
  responsable: res.funeraria && res.funeraria.responsable,
});

module.exports = {
  getAll: async (axios) => {
    const response = await axios.$get('/cementerio/certificadosDefuncion');
    return response.data.map(formatFile);
  },
  getSingle: async (axios, { id }) => {
    const response = await axios.$get(`/cementerio/certificadosDefuncion/${id}`);
    return formatFile(response.data);
  },
  getDocumentos: async (axios, { id }) => {
    const response = await axios.$get(`/cementerio/certificadosDefuncion/documentos/${id}`);
    return response.data; // { nombreDocumento: { url } }
  },
  create: async (axios, { certificado }) => {
    const created = await axios.$post('/cementerio/certificadosDefuncion', { certificado });
    return created;
  },
  update: async (axios, id, { certificado }) => {
    const updated = await axios.$put(`/cementerio/certificadosDefuncion/${id}`, { certificado });
    return formatFile(updated);
  },
  delete: async (axios, { id }) => {
    return await axios.$delete(`/cementerio/certificadosDefuncion/${id}`);
  },
}


