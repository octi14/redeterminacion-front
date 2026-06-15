export const DIA_CIERRE_PERIODO = 1

export const TIPOS_SEPULTURA = [
  { value: 'economico', text: 'Económico', precio: 1000 },
  { value: 'intermedio', text: 'Intermedio', precio: 10000 },
  { value: 'premium', text: 'Premium', precio: 100000 },
]

export const ESTADOS_PERIODO = {
  ABIERTO: 'ABIERTO',
  PENDIENTE_CONFIRMACION: 'PENDIENTE_CONFIRMACION',
  EN_PROCESO: 'EN_PROCESO',
  APROBADO: 'APROBADO',
  RECHAZADO: 'RECHAZADO',
}

export const ESTADOS_REVISION_PAGO = {
  PENDIENTE: 'PENDIENTE',
  APROBADO: 'APROBADO',
  RECHAZADO: 'RECHAZADO',
}

export const CONDICIONES_PAGO = {
  PAGO: 'PAGO',
  EXENTO: 'EXENTO',
}
