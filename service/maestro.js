const formatMaestro = (MaestroResponse) => ({
  id: MaestroResponse._id,
  legajo: MaestroResponse.legajo,
  cuit: MaestroResponse.cuit,
  denominacion: MaestroResponse.denominacion,
  titular: MaestroResponse.titular,
  dfe: MaestroResponse.dfe,
  telefono: MaestroResponse.telefono,
  mail: MaestroResponse.mail,
})

module.exports = {
  get: async (axios,
    //  { skip = 0, limit = 6 }
     ) => {
    const maestroResponse = await axios.$get('/maestro', {
    })
    return maestroResponse.data.map(formatMaestro)
  },
  getSingle: async (axios,{cuit, legajo}) => {
    const maestroResponse = await axios.$post('/maestro/single', {
      cuit,legajo
    })
    return maestroResponse.data.map(formatMaestro)
  },
  create: async (axios, { file }) => {
    const createdCertif = await axios.$post(
      '/maestro',
      { file },
    )
    // return formatCertif(createdCertif.data)
  },
  update: async (axios, { maestro }) => {
    const updated = await axios.$put(
      `/maestro/${maestro.id}`,
      { maestro },
    )
    return formatMaestro(updated.data)
  },
  delete: async (axios, { id, userToken }) => {
    return await axios.$delete(`/certificados/${id}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
  },
}
