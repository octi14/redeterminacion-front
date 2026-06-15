export const unwrapData = response => response && response.data !== undefined ? response.data : response

export const formatCurrency = value => new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
}).format(Number(value || 0))

export const formatPeriodLabel = period => {
  if (!period) return ''
  if (period.nombre) return period.nombre

  const year = period.anio || new Date(period.fechaInicio).getFullYear()
  const month = period.mes || new Date(period.fechaInicio).getMonth() + 1
  const date = new Date(year, month - 1, 1)
  return date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
}

export const getStatusVariant = status => ({
  ABIERTO: 'success',
  PENDIENTE_CONFIRMACION: 'warning',
  EN_PROCESO: 'primary',
  APROBADO: 'success',
  RECHAZADO: 'danger',
  PENDIENTE: 'warning',
}[status] || 'secondary')
