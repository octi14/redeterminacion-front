const formatDocs = (FileResponse) => {
  const formattedDocs = {};
  for (const key in FileResponse) {
    if (FileResponse.hasOwnProperty(key)) {
      formattedDocs[key] = FileResponse[key];
    }
  }
  return formattedDocs;
};

module.exports = {
  getById: async (axios, { id }) => {
    const fileResponse = await axios.$get(`/habilitaciones/documentos/${id}`);
    return formatDocs(fileResponse.data);
  },
};
