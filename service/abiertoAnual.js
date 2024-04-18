const formatFile = (FileResponse) => ({
    id: FileResponse._id,
    cuit: FileResponse.cuit,
    nroLegajo: FileResponse.nroLegajo,
    dfe: FileResponse.dfe,
    status: FileResponse.status,
    observaciones: FileResponse.observaciones,
    createdAt: new Date(FileResponse.createdAt).toLocaleDateString('es-AR'),
    updatedAt: new Date(FileResponse.updatedAt).toLocaleDateString('es-AR'),
  })

  const formatExtendedFile = (FileResponse) => ({
    id: FileResponse._id,
    cuit: FileResponse.cuit,
    dfe: FileResponse.dfe,
    status: FileResponse.status,
    nroLegajo: FileResponse.nroLegajo,
    observaciones: FileResponse.observaciones,
    createdAt: new Date(FileResponse.createdAt),
  })

  module.exports = {
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
      return formatExtendedFile(fileResponse.data)
    },


    getByCuitLegajo: async(axios, { cuit, legajo }) => {
      const fileResponse = await axios.$post(`/abiertoAnual/cuit`,{
        cuit: cuit,
        nroLegajo: legajo,
      });
      if(fileResponse.data){
        return formatFile(fileResponse.data);
      }else{
        return null
      }
    },


    create: async (axios, { cuit, nroLegajo }) => {
      const createdFile = await axios.$post('/abiertoAnual', { cuit,nroLegajo });
      return createdFile;
    },
    update: async (axios, id, { habilitacion }) => {
      axios.setHeader('Access-Control-Allow-Origin', true)
      const updated = await axios.$put(
        `/habilitaciones/${id}`,
        { habilitacion },
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
