const formatFile = (FileResponse) => ({
  id: FileResponse._id,
  name: FileResponse.name,
  description: FileResponse.description,
  budget: FileResponse.budget,
  // image: FileResponse.image,
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
