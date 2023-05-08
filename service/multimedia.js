const formatMultimedia = (MultimediaResponse) => ({
  id: MultimediaResponse._id,
  nombre: MultimediaResponse.nombre,
  link: MultimediaResponse.link,
})

const formatItem = (ItemsData) => ({
  nombre: ItemsData.nombre,
  link: ItemsData.link,
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
    { nombre, link }
  ) => {
    const filesResponse = await axios.$post('/multimedias/search', {
      nombre,
      link,
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
  delete: async (axios, { id, userToken }) => {
    return await axios.$delete(`/multimedias/${id}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
  },
}
