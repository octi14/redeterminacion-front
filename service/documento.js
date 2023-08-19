const formatDocs = (FileResponse) => ({
  documentos: FileResponse.documentos,
})

module.exports = {
  getById: async (axios, { id }) => {
    const fileResponse = await axios.$get(`/habilitaciones/documentos/${id}`)
    return formatDocs(fileResponse.data)
  },
}
