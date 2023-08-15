const formatTurno = (TurnoResponse) => ({
  id: TurnoResponse._id,
  dia: new Date(TurnoResponse.dia).toLocaleDateString(),
  horario: TurnoResponse.horario,
  nombre: TurnoResponse.nombre,
  dni: TurnoResponse.dni,
  domicilio: TurnoResponse.domicilio,
  mail: TurnoResponse.mail,
  status: TurnoResponse.status,
  nroTramite: TurnoResponse.nroTramite,
  observaciones: TurnoResponse.observaciones,
  createdAt: new Date(TurnoResponse.createdAt).toLocaleDateString(),
})

module.exports = {
  getAll: async (axios,
     ) => {
    const turnosResponse = await axios.$get('/turnos/', {
    })
    return turnosResponse.data.map(formatTurno)
  },
  // search: async (
  //   axios,
  //   { categoria }
  // ) => {
  //   const filesResponse = await axios.$post('/turnos/search', {
  //     categoria,
  //   })
  //   return filesResponse.data.map(formatTurno)
  // },
  // searchSingle: async (
  //   axios,
  //   { nombre, link }
  // ) => {
  //   const filesResponse = await axios.$post('/turnos/searchSingle', {
  //     nombre,
  //     link,
  //   })
  //   return formatTurno(filesResponse.data)
  // },
  getSingle: async (axios, { nroTramite }) => {
    const turnoResponse = await axios.$get(`/turnos/nroTramite/${nroTramite}`)
    if(turnoResponse.data.length > 0){
      return formatTurno(turnoResponse.data[0])
    }
  },
  getById: async (axios, { id }) => {
    const turnoResponse = await axios.$get(`/turnos/${id}`)
    return formatTurno(turnoResponse.data)
  },
  create: async (axios, { turno, userToken }) => {
    const createdTurno = await axios.$post(
      '/turnos/',
      { turno }
    )
    return formatTurno(createdTurno.data)
  },
  update: async (axios, { id, turno, userToken }) => {
    axios.setHeader('Access-Control-Allow-Origin', true)
    const updated = await axios.$put(
      `/turnos/${id}`,
      { turno },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    )
    return formatTurno(updated.data)
  },
  delete: async (axios, { id, userToken }) => {
    return await axios.$delete(`/turnos/${id}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
  },
}
