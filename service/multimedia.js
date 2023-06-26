const formatMultimedia = (MultimediaResponse) => ({
  id: MultimediaResponse._id,
  nombre: MultimediaResponse.nombre,
  link: MultimediaResponse.link,
  categoria: MultimediaResponse.categoria,
})

module.exports = {
  getLatest: async (axios,
    //  { skip = 0, limit = 6 }
     ) => {
    const multimediasResponse = await axios.$get('/multimedias/', {
      // params: {
      //   skip,
      //   limit,
      // },
    })
    return multimediasResponse.data.map(formatMultimedia)
  },
  search: async (
    axios,
    { categoria }
  ) => {
    const filesResponse = await axios.$post('/multimedias/search', {
      categoria,
    })
    return filesResponse.data.map(formatMultimedia)
  },
  searchSingle: async (
    axios,
    { nombre, link }
  ) => {
    const filesResponse = await axios.$post('/multimedias/searchSingle', {
      nombre,
      link,
    })
    return formatMultimedia(filesResponse.data)
  },
  getSingle: async (axios, { id }) => {
    const multimediaResponse = await axios.$get(`/multimedias/${id}`)
    return formatMultimedia(multimediaResponse.data)
  },
  create: async (axios, { multimedia, userToken }) => {
    const createdMultimedia = await axios.$post(
      '/multimedias/',
      { multimedia },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    )
    return formatMultimedia(createdMultimedia.data)
  },
  update: async (axios, { multimedia, userToken }) => {
    axios.setHeader('Access-Control-Allow-Origin', true)
    const updated = await axios.$put(
      `/multimedias/${multimedia.id}`,
      { multimedia },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    )
    return formatMultimedia(updated.data)
  },
  delete: async (axios, { id, userToken }) => {
    return await axios.$delete(`/multimedias/${id}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
  },
}
