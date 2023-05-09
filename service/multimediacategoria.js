const formatMultCateg = (MultimediaCategResponse) => ({
  id: MultimediaCategResponse._id,
  nombre: MultimediaCategResponse.nombre,
})

module.exports = {
  getLatest: async (axios,
    //  { skip = 0, limit = 6 }
     ) => {
    const response = await axios.$get('/multimediacategorias/', {
      // params: {
      //   skip,
      //   limit,
      // },
    })
    return response.data.map(formatMultCateg)
  },
  // getSingle: async (axios, { id }) => {
  //   const response = await axios.$get(`/certificados/${id}`)
  //   return formatCertif(certifResponse.data)
  // },
  // create: async (axios, { certificado, userToken }) => {
  //   const createdCertif = await axios.$post(
  //     '/certificados',
  //     { certificado },
  //     {
  //       headers: { Authorization: `Bearer ${userToken}` },
  //     }
  //   )
  //   return formatCertif(createdCertif.data)
  // },
}
