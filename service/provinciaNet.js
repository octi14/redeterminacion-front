const STORAGE_KEY = 'provinciaNetUUID'
const RESULT_REDIRECT_KEY = 'provinciaNetResultRedirect'

const marcarRedirectResultado = (ruta) => {
  if (import.meta.client) {
    sessionStorage.setItem(RESULT_REDIRECT_KEY, ruta)
  }
}

const consumirRedirectResultado = (ruta) => {
  if (!import.meta.client) return false
  const guardada = sessionStorage.getItem(RESULT_REDIRECT_KEY)
  if (guardada !== ruta) return false
  sessionStorage.removeItem(RESULT_REDIRECT_KEY)
  return true
}

const createPreorder = async (axios, body) => {
  return await axios.$post('/pagos/provincia-net/preorder', body)
}

const getEstado = async (axios, uuid) => {
  return await axios.$get(`/pagos/provincia-net/estado/${encodeURIComponent(uuid)}`)
}

const rutaSegunStatus = (status) => {
  if (status === 'Cancelado') return '/tasas/pagar-tasas/error'
  if (status === 'Finalizado' || status === 'Parcial') return '/tasas/pagar-tasas/exito'
  return null
}

const getConfiguracion = async (axios, headers = {}) => {
  return await axios.$get('/pagos/provincia-net/configuracion', { headers })
}

const updateConfiguracion = async (axios, body, headers = {}) => {
  return await axios.$put('/pagos/provincia-net/configuracion', body, { headers })
}

const getDeuda = async (axios, { tipoTasa, objetoClave }, headers = {}) => {
  const params = new URLSearchParams({
    tipoTasa: tipoTasa || 'URBANA',
    objetoClave: objetoClave || '',
  })
  return await axios.$get(`/pagos/provincia-net/deuda?${params.toString()}`, { headers })
}

const importarUrbana = async (axios, file, headers = {}) => {
  return await axios.$post('/pagos/provincia-net/urbana/importar', file, {
    headers,
    timeout: 10 * 60 * 1000,
  })
}

const progresoImportUrbana = async (axios, importId, headers = {}) => {
  return await axios.$get(
    `/pagos/provincia-net/urbana/importar/${encodeURIComponent(importId)}/progreso`,
    { headers }
  )
}

const listarImportacionesUrbana = async (axios, headers = {}) => {
  return await axios.$get('/pagos/provincia-net/urbana/importaciones', { headers })
}

const listarPeriodosUrbana = async (axios, headers = {}) => {
  return await axios.$get('/pagos/provincia-net/urbana/periodos', { headers })
}

const cambiarEstadoPeriodoUrbana = async (axios, body, headers = {}) => {
  return await axios.$put('/pagos/provincia-net/urbana/periodos/estado', body, { headers })
}

const descargarOriginalUrbana = async (axios, importId, headers = {}) => {
  return await axios.get(
    `/pagos/provincia-net/urbana/importaciones/${encodeURIComponent(importId)}/original`,
    { headers, responseType: 'blob' }
  )
}

export default {
  STORAGE_KEY,
  createPreorder,
  getEstado,
  rutaSegunStatus,
  marcarRedirectResultado,
  consumirRedirectResultado,
  getConfiguracion,
  updateConfiguracion,
  getDeuda,
  importarUrbana,
  progresoImportUrbana,
  listarImportacionesUrbana,
  listarPeriodosUrbana,
  cambiarEstadoPeriodoUrbana,
  descargarOriginalUrbana,
}
