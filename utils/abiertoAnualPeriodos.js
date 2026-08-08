const DEFAULT_PERIODOS = [
  { min: '01/05', max: '31/05' },
  { min: '01/08', max: '31/08' },
  { min: '01/10', max: '31/10' },
]
const DEFAULT_RECTIFICACION = { min: '01/11', max: '30/11' }

function parseDDMM(str, year) {
  const [d, m] = String(str).split('/').map(Number)
  return new Date(year, m - 1, d)
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

/**
 * Config de respaldo, usada solo antes de que llegue la primera respuesta del backend
 * (o si el fetch falla). Una vez que hay respuesta real, /config/abiertoAnualPeriodos
 * (Redeterminacion/services/configs.service.js) ya trae rectificacion/popUpAbiertoAnualCerrado
 * calculados con la config guardada por el admin: el front no debe volver a calcularlos,
 * o se desincroniza de lo que el admin configuró.
 */
export function getDefaultAbiertoAnualPeriodos(year = new Date().getFullYear()) {
  const todayStart = startOfDay(new Date())
  const rectMin = parseDDMM(DEFAULT_RECTIFICACION.min, year)
  const rectMax = parseDDMM(DEFAULT_RECTIFICACION.max, year)
  const rectificacion = todayStart >= startOfDay(rectMin) && todayStart <= startOfDay(rectMax)

  const periodStart = parseDDMM(DEFAULT_PERIODOS[0].min, year)
  const popUpAbiertoAnualCerrado = !rectificacion
    && (todayStart < startOfDay(periodStart) || todayStart > startOfDay(rectMax))

  return {
    minDates: DEFAULT_PERIODOS.map((p) => `${p.min}/${year}`),
    maxDates: DEFAULT_PERIODOS.map((p) => `${p.max}/${year}`),
    rectificacionMinDate: `${DEFAULT_RECTIFICACION.min}/${year}`,
    rectificacionMaxDate: `${DEFAULT_RECTIFICACION.max}/${year}`,
    rectificacion,
    rectificacionGlobal: undefined,
    rectificacionPorFecha: rectificacion,
    popUpAbiertoAnualCerrado,
  }
}
