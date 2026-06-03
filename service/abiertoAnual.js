const formatFile = (FileResponse) => {
  const rawStatus = Array.isArray(FileResponse.status) ? FileResponse.status : []
  const rawFacturas = Array.isArray(FileResponse.facturas) ? FileResponse.facturas : []
  const rawFechasCarga = Array.isArray(FileResponse.fechasCarga) ? FileResponse.fechasCarga : []

  // La UI asume que:
  // status[0] / facturas[0] / fechasCarga[0] => Período 1
  // status[1] / facturas[1] / fechasCarga[1] => Período 2
  // status[2] / facturas[2] / fechasCarga[2] => Período 3
  // Si el backend devuelve esas 3 posiciones en otro orden, se desfasarán los círculos.
  let status = rawStatus
  let facturas = rawFacturas
  let fechasCarga = rawFechasCarga

  const len = Math.min(rawStatus.length, rawFacturas.length, rawFechasCarga.length)
  if (len >= 3) {
    const indices = rawFechasCarga.slice(0, len).map((fecha, idx) => {
      const t = new Date(fecha).getTime()
      return { idx, t: Number.isFinite(t) ? t : Number.POSITIVE_INFINITY }
    })

    indices.sort((a, b) => {
      if (a.t !== b.t) return a.t - b.t
      return a.idx - b.idx
    })

    const orderedIdx = indices.map((x) => x.idx)
    status = orderedIdx.map((i) => rawStatus[i])
    facturas = orderedIdx.map((i) => rawFacturas[i])
    fechasCarga = orderedIdx.map((i) => rawFechasCarga[i])
  }

  return ({
    id: FileResponse._id,
    cuit: FileResponse.cuit,
    nroLegajo: FileResponse.nroLegajo,
    dfe: FileResponse.dfe,
    facturas,
    status,
    fechasCarga: fechasCarga.map((fecha) => new Date(fecha).toLocaleDateString('es-AR')),
    createdAt: new Date(FileResponse.createdAt).toLocaleDateString('es-AR'),
    updatedAt: new Date(FileResponse.updatedAt).toLocaleDateString('es-AR'),
    ultimaActualizacion: new Date(FileResponse.updatedAt),
  })
}


  const formatExtendedFile = (FileResponse) => ({
    id: FileResponse._id,
    cuit: FileResponse.cuit,
    dfe: FileResponse.dfe,
    status: FileResponse.status,
    nroLegajo: FileResponse.nroLegajo,
    observaciones: FileResponse.observaciones,
    fechasCarga: FileResponse.fechasCarga,
    createdAt: new Date(FileResponse.createdAt),
  })

  export default {
    getAll: async (axios,
      //  { skip = 0, limit = 6 }
       ) => {
      const filesResponse = await axios.$get('/abiertoAnual', {
        // params: {
        //   skip,
        //   limit,
        // },
      })
      return filesResponse.data.map(formatFile)
    },
    // getByNroTramite: async (axios, { nroTramite }) => {
    //   const fileResponse = await axios.$post('/habilitaciones/nroTramite', {nroTramite})
    //   if (fileResponse.data){
    //     return formatFile(fileResponse.data)
    //   }else{
    //     return null
    //   }
    // },
    getSingle: async (axios, { id }) => {
      const fileResponse = await axios.$get(`/abiertoAnual/${id}`)
      return formatFile(fileResponse.data)
    },


    getByCuitLegajo: async(axios, { cuit, nroLegajo }) => {
      const fileResponse = await axios.$post(`/abiertoAnual/buscar/${cuit}`,{
        nroLegajo
      });
      if (fileResponse.data.length === 0) {
        return null
      }else{
        return formatFile(fileResponse.data);
      }
    },


    create: async (axios, { cuit, nroLegajo }) => {
      const createdFile = await axios.$post('/abiertoAnual', { cuit,nroLegajo });
      return createdFile;
    },
    update: async (axios, id, { tramite }) => {
      axios.setHeader('Access-Control-Allow-Origin', true)
      const updated = await axios.$put(
        `/abiertoAnual/${id}`,
        { tramite },
      )
      return formatFile(updated)
    },
    updateLazy: async (axios, id, { habilitacion }) => {
      axios.setHeader('Access-Control-Allow-Origin', true)
      const updated = await axios.$put(
        `/habilitaciones/lazy/${id}`,
        { habilitacion },
      )
      // return formatFile(updated)
    },
    delete: async (axios, { id, userToken }) => {
      return await axios.$delete(`/habilitaciones/${id}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
    },

    // searchFiles: async (
    //   axios,
    //   { expediente = '', objeto = '', adjudicado = '' }
    // ) => {
    //   const filesResponse = await axios.$post('/habilitaciones/search', {
    //     // agrego condicionalmente los parámetros de busqueda
    //     // (no se agregan los que están vacíos)
    //     ...(expediente.length && { expediente }),
    //     ...(objeto.length && { objeto }),
    //     ...(adjudicado.length && { adjudicado }),
    //   })
    //   return filesResponse.data.map(formatFile)
    // },
  }

