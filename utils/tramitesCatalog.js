/**
 * Catálogo de trámites comerciales con aliases para el buscador.
 * Los términos alternativos reflejan el lenguaje habitual en trámites municipales argentinos.
 */

const catalogoTramites = [
  {
    id: 'Habilitación',
    etiqueta: 'Habilitación Comercial',
    descripcionCorta: 'Iniciar o habilitar un nuevo comercio o local.',
    habilitado: true,
    aliases: [
      'habilitacion comercial',
      'apertura',
      'apertura de local',
      'nuevo comercio',
      'nuevo local',
      'abrir comercio',
      'abrir negocio',
      'abrir un negocio',
      'abrir local',
      'permiso comercial',
      'permiso de funcionamiento',
      'inscripcion comercial',
      'inscripción comercial',
      'alta comercial',
      'habilitar',
      'habilitar local',
      'habilitar comercio',
      'local comercial',
      'negocio nuevo',
    ],
  },
  {
    id: 'Baja',
    etiqueta: 'Baja Comercial',
    descripcionCorta: 'Finalizar o cerrar una habilitación comercial existente.',
    habilitado: true,
    aliases: [
      'baja comercial',
      'baja de comercio',
      'cerrar comercio',
      'cierre',
      'cierre comercio',
      'cierre de local',
      'clausura',
      'dar de baja',
      'finalizar habilitacion',
      'finalizar habilitación',
      'cancelar habilitacion',
      'cancelar habilitación',
      'fin de actividad',
      'cese de actividad',
    ],
  },
  {
    id: 'Renovación',
    etiqueta: 'Renovación Comercial',
    descripcionCorta: 'Renovar la habilitación cuando finalizó el contrato de locación.',
    habilitado: true,
    aliases: [
      'renovacion comercial',
      'renovación comercial',
      'renovar',
      'renovar habilitacion',
      'renovar habilitación',
      'renovar permiso',
      'prorroga',
      'prórroga',
      'contrato concluido',
      'contrato finalizado',
      'locacion concluida',
      'locación concluida',
      'comodato concluido',
    ],
  },
  {
    id: 'Reempadronamiento',
    etiqueta: 'Reempadronamiento Comercial',
    descripcionCorta: 'Actualizar datos del comercio con contrato de locación vigente.',
    habilitado: true,
    aliases: [
      'reempadronamiento comercial',
      'reempadronar',
      're empadronamiento',
      'empadronamiento',
      'actualizar datos',
      'actualizacion de datos',
      'actualización de datos',
      'modificacion de datos',
      'modificación de datos',
      'contrato vigente',
      'contrato en vigencia',
      'locacion vigente',
      'locación vigente',
      'comodato vigente',
    ],
  },
  {
    id: 'Cambio de Titular',
    etiqueta: 'Cambio de Titular',
    descripcionCorta: 'Transferir la titularidad de una habilitación comercial.',
    habilitado: true,
    aliases: [
      'cambio de titularidad',
      'cambio de dueño',
      'cambio de dueno',
      'transferencia',
      'transferencia de titular',
      'traspaso',
      'traspaso de comercio',
      'nuevo titular',
      'cesion',
      'cesión',
      'cesion de titular',
      'cambio titular',
      'venta del comercio',
    ],
  },
  {
    id: 'Cambio de Domicilio',
    etiqueta: 'Cambio de Domicilio',
    descripcionCorta: 'Trasladar el comercio a una nueva dirección.',
    habilitado: false,
    aliases: [
      'cambio de domicilio comercial',
      'mudanza',
      'mudanza de local',
      'traslado',
      'traslado de local',
      'cambio de direccion',
      'cambio de dirección',
      'nueva direccion',
      'nueva dirección',
    ],
  },
  {
    id: 'Anexo',
    etiqueta: 'Anexo de Metros Cuadrados',
    descripcionCorta: 'Ampliar la superficie habilitada del comercio.',
    habilitado: false,
    aliases: [
      'anexo',
      'anexo de mts2',
      'anexo de metros',
      'ampliacion',
      'ampliación',
      'ampliacion de local',
      'ampliación de local',
      'metros cuadrados',
      'superficie',
    ],
  },
  {
    id: 'Anexo Cambio',
    etiqueta: 'Anexo con Cambio',
    descripcionCorta: 'Anexo de superficie con modificación de titularidad o domicilio.',
    habilitado: false,
    aliases: [
      'anexo cambio',
      'anexo con cambio',
    ],
  },
]

function normalizarTextoBusqueda(texto) {
  return String(texto || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function obtenerCamposBusqueda(tramite) {
  return [
    tramite.id,
    tramite.etiqueta,
    tramite.descripcionCorta,
    ...(tramite.aliases || []),
  ]
    .map(normalizarTextoBusqueda)
    .filter(Boolean)
}

function puntuarTramite(tramite, normalizado) {
  const campos = obtenerCamposBusqueda(tramite)

  for (const campo of campos) {
    if (campo === normalizado) return 200
    if (campo.includes(normalizado)) return 150
  }

  const tokens = normalizado.split(/\s+/).filter((token) => token.length >= 2)
  if (!tokens.length) return 0

  let score = 0
  for (const token of tokens) {
    let tokenMatch = false
    for (const campo of campos) {
      if (campo === token) {
        score += 100
        tokenMatch = true
      } else if (campo.startsWith(token)) {
        score += 50
        tokenMatch = true
      } else if (campo.includes(token)) {
        score += 10
        tokenMatch = true
      }
    }
    if (!tokenMatch) return 0
  }

  return score
}

/**
 * Busca trámites por término. Coincide con id, etiqueta, descripción y aliases.
 * @param {string} termino
 * @param {{ soloHabilitados?: boolean }} [opciones]
 */
export function buscarTramites(termino, opciones = {}) {
  const normalizado = normalizarTextoBusqueda(termino)
  if (!normalizado || normalizado.length < 2) return []

  let resultados = catalogoTramites
    .map((tramite) => ({ tramite, score: puntuarTramite(tramite, normalizado) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ tramite }) => tramite)

  if (opciones.soloHabilitados) {
    resultados = resultados.filter((tramite) => tramite.habilitado)
  }

  return resultados
}

export { catalogoTramites }
export default catalogoTramites
