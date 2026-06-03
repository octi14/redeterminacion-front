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

function parseDDMMYYYY(str) {
  const [d, m, y] = String(str).split('/').map(Number)
  return new Date(y, m - 1, d)
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

function isRectificacionActiva(config, todayStart, year) {
  if (typeof config.rectificacion === 'boolean') {
    return config.rectificacion
  }
  const rectMin = config.rectificacionMinDate
    ? parseDDMMYYYY(config.rectificacionMinDate)
    : parseDDMM(DEFAULT_RECTIFICACION.min, year)
  const rectMax = config.rectificacionMaxDate
    ? parseDDMMYYYY(config.rectificacionMaxDate)
    : parseDDMM(DEFAULT_RECTIFICACION.max, year)
  return todayStart >= startOfDay(rectMin) && todayStart <= startOfDay(rectMax)
}

/**
 * true = mostrar popup "período cerrado" (fuera de la ventana del Abierto Anual).
 * Misma regla que el backend: antes del 1.er período o después del fin de rectificación.
 */
export function computePopUpAbiertoAnualCerrado(config) {
  if (!config?.minDates?.length) return false

  const now = new Date()
  const year = now.getFullYear()
  const todayStart = startOfDay(now)

  const periodStart = config.minDates[0].includes('/')
    && String(config.minDates[0]).split('/').length === 3
    ? parseDDMMYYYY(config.minDates[0])
    : parseDDMM(config.minDates[0], year)

  let rectEnd
  if (config.rectificacionMaxDate) {
    rectEnd = parseDDMMYYYY(config.rectificacionMaxDate)
  } else if (config.maxDates?.length) {
    const lastMax = config.maxDates[config.maxDates.length - 1]
    rectEnd = lastMax.split('/').length === 3
      ? parseDDMMYYYY(lastMax)
      : parseDDMM(lastMax, year)
  } else {
    rectEnd = parseDDMM(DEFAULT_RECTIFICACION.max, year)
  }

  return todayStart < startOfDay(periodStart) || todayStart > startOfDay(rectEnd)
}

export function normalizeAbiertoAnualPeriodos(apiData) {
  const year = new Date().getFullYear()
  const todayStart = startOfDay(new Date())

  const minDates = apiData?.minDates?.length
    ? apiData.minDates
    : DEFAULT_PERIODOS.map((p) => `${p.min}/${year}`)
  const maxDates = apiData?.maxDates?.length
    ? apiData.maxDates
    : DEFAULT_PERIODOS.map((p) => `${p.max}/${year}`)

  const rectificacionMinDate = apiData?.rectificacionMinDate || `${DEFAULT_RECTIFICACION.min}/${year}`
  const rectificacionMaxDate = apiData?.rectificacionMaxDate || `${DEFAULT_RECTIFICACION.max}/${year}`

  const config = {
    minDates,
    maxDates,
    rectificacionMinDate,
    rectificacionMaxDate,
    rectificacion: isRectificacionActiva(
      { ...apiData, rectificacionMinDate, rectificacionMaxDate },
      todayStart,
      year,
    ),
  }

  return {
    ...apiData,
    ...config,
    popUpAbiertoAnualCerrado: computePopUpAbiertoAnualCerrado(config),
  }
}

export function getDefaultAbiertoAnualPeriodos(year = new Date().getFullYear()) {
  return normalizeAbiertoAnualPeriodos({
    minDates: DEFAULT_PERIODOS.map((p) => `${p.min}/${year}`),
    maxDates: DEFAULT_PERIODOS.map((p) => `${p.max}/${year}`),
    rectificacionMinDate: `${DEFAULT_RECTIFICACION.min}/${year}`,
    rectificacionMaxDate: `${DEFAULT_RECTIFICACION.max}/${year}`,
  })
}
