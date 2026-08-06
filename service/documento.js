const formatDocs = (FileResponse) => {
  const formattedDocs = {};
  for (const key in FileResponse) {
    if (FileResponse.hasOwnProperty(key)) {
      formattedDocs[key] = FileResponse[key];
    }
  }
  return formattedDocs;
};

export default {
  getById: async (axios, { id }) => {
    const fileResponse = await axios.$get(`/habilitaciones/documentos/${id}`);
    return formatDocs(fileResponse.data);
  },

  getPagosById: async (axios, { id }) => {
    const fileResponse = await axios.$get(`/pagosDobles/documentos/${id}`);
    return formatDocs(fileResponse.data);
  },

  /**
   * Baja un documento para ZIP: preferir URL firmada S3; si falla CORS, proxy del back.
   */
  downloadFileBuffer: async (axios, { id, nombreDocumento, url }) => {
    if (url) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          return await res.arrayBuffer();
        }
      } catch (_) {
        // CORS u otro error de red → proxy
      }
    }
    const encoded = encodeURIComponent(nombreDocumento);
    const res = await axios.get(
      `/habilitaciones/documentos/${id}/file/${encoded}`,
      { responseType: 'arraybuffer' }
    );
    return res.data;
  },
};

