const formatDocs = (FileResponse) => ({
  dniFrente: FileResponse.dniFrente,
  dniDorso: FileResponse.dniDorso,
  plano: FileResponse.plano,
  constanciaCuit: FileResponse.constanciaCuit,
  libreDeudaUrbana: FileResponse.libreDeudaUrbana,
  actaPersonaJuridica: FileResponse.actaPersonaJuridica,
  actaDirectorio: FileResponse.actaDirectorio,
  constanciaIngresosBrutos: FileResponse.constanciaIngresosBrutos,
  tituloPropiedad: FileResponse.tituloPropiedad,
  certificadoDomicilio: FileResponse.certificadoDomicilio,
  planillaAutorizacion: FileResponse.planillaAutorizacion,
})

module.exports = {
  getById: async (axios, { id }) => {
    const fileResponse = await axios.$get(`/habilitaciones/documentos/${id}`)
    return formatDocs(fileResponse.data)
  },
}
