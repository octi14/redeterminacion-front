import { COMBUSTIBLE_DASHBOARD_USERNAMES } from '~/utils/access-control'

/**
 * Índice de navegación buscable del sitio.
 * Incluye MenuItems, trámites individuales y accesos externos frecuentes
 * que no necesariamente aparecen en el menú.
 *
 * @typedef {Object} SiteNavItem
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} to
 * @property {string} [section]
 * @property {boolean} [external]
 * @property {string[]} [aliases] Términos alternativos de búsqueda (ej. patente → automotor)
 * @property {string[]} [adminRoles]
 * @property {string[]} [allowedUsernames]
 */

/** @type {SiteNavItem[]} */
export const SITE_NAVIGATION_ITEMS = [
  // —— Inicio / landing ——
  {
    id: 'landing-normativa',
    title: 'Normativa',
    description: 'Normativa y digestos de Villa Gesell',
    to: '/normativa',
    section: 'Inicio',
    aliases: ['digesto', 'ordenanzas', 'leyes'],
  },
  {
    id: 'landing-modernizacion',
    title: 'Modernización',
    description: 'Recursos y documentación de modernización municipal',
    to: '/modernizacion',
    section: 'Inicio',
    aliases: ['procedimientos', 'tutoriales', 'notas tipo', 'formularios'],
  },
  {
    id: 'landing-comercio',
    title: 'Comercio',
    description: 'Trámites y servicios para comercios',
    to: '/comercio',
    section: 'Inicio',
    aliases: ['local', 'negocio', 'habilitación comercial'],
  },
  {
    id: 'landing-recaudaciones',
    title: 'Recaudaciones',
    description: 'Servicios de recaudación municipal',
    to: '/recaudaciones',
    section: 'Inicio',
    aliases: ['tasas', 'impuestos', 'boletas'],
  },
  {
    id: 'landing-pagos',
    title: 'Pagos',
    description: 'Portal de pagos municipales',
    to: 'https://arvige.gob.ar/lpagos',
    section: 'Inicio',
    external: true,
    aliases: ['pagar', 'boleta', 'descargar boleta', 'vencimientos'],
  },
  {
    id: 'landing-compras',
    title: 'Compras',
    description: 'Licitaciones, proveedores y suministros',
    to: '/compras',
    section: 'Inicio',
    aliases: ['licitaciones', 'proveedores', 'suministros'],
  },
  {
    id: 'landing-arvige',
    title: 'ARVIGE',
    description: 'Agencia de Recaudación de Villa Gesell',
    to: 'https://arvige.gob.ar',
    section: 'Inicio',
    external: true,
    aliases: ['agencia de recaudación', 'contribuyente'],
  },
  {
    id: 'landing-transito',
    title: 'Tránsito',
    description: 'Gestión de tránsito municipal',
    to: '/transito',
    section: 'Inicio',
    adminRoles: ['hacienda', 'master'],
    aliases: ['multas', 'infracciones'],
  },
  {
    id: 'landing-obras',
    title: 'Obras',
    description: 'Obras públicas municipales',
    to: '/obras',
    section: 'Inicio',
    adminRoles: ['hacienda', 'master'],
    aliases: ['obra pública', 'construcción'],
  },

  // —— Comercio ——
  {
    id: 'comercio-tramites',
    title: 'Trámites comerciales',
    description: 'Realizar los trámites para tu comercio',
    to: '/comercio/tramites',
    section: 'Comercio',
    aliases: ['trámites comercio', 'habilitaciones'],
  },
  {
    id: 'comercio-abierto-anual',
    title: 'Abierto Anual',
    description: 'Acceder al formulario de Abierto Anual de comercios',
    to: '/comercio/abierto_anual',
    section: 'Comercio',
    aliases: ['abierto', 'declaración jurada', 'ddjj', 'temporada'],
  },
  {
    id: 'comercio-consulta-tramite',
    title: 'Consulta estado de trámite',
    description: 'Consultá el estado de tu trámite comercial',
    to: '/comercio/consulta_tramite',
    section: 'Comercio',
    aliases: ['seguimiento', 'estado del trámite', 'consultar trámite', 'nro de trámite'],
  },
  {
    id: 'comercio-turnos',
    title: 'Turnos',
    description: 'Obtener turnos para inspección de comercios',
    to: '/comercio/turnos',
    section: 'Comercio',
    aliases: ['turno', 'inspección', 'agendar'],
  },

  // —— Trámites comerciales individuales ——
  {
    id: 'tramite-habilitacion',
    title: 'Habilitación Comercial',
    description: 'Iniciar el trámite de habilitación de un comercio',
    to: '/comercio/tramites?tramite=Habilitación',
    section: 'Trámites comerciales',
    aliases: ['habilitar', 'permiso comercial', 'abrir comercio', 'nueva habilitación'],
  },
  {
    id: 'tramite-baja',
    title: 'Baja Comercial',
    description: 'Finalizar una habilitación comercial vigente',
    to: '/comercio/tramites?tramite=Baja',
    section: 'Trámites comerciales',
    aliases: ['cerrar comercio', 'dar de baja', 'clausura'],
  },
  {
    id: 'tramite-renovacion',
    title: 'Renovación Comercial',
    description: 'Reafirmar la continuidad de una habilitación comercial',
    to: '/comercio/tramites?tramite=Renovación',
    section: 'Trámites comerciales',
    aliases: ['renovar', 'renovación habilitación'],
  },
  {
    id: 'tramite-reempadronamiento',
    title: 'Reempadronamiento Comercial',
    description: 'Reafirmar la continuidad de una habilitación en los mismos términos',
    to: '/comercio/tramites?tramite=Reempadronamiento',
    section: 'Trámites comerciales',
    aliases: ['reempadronar', 'empadronamiento'],
  },
  {
    id: 'tramite-cambio-titular',
    title: 'Cambio de Titular',
    description: 'Transferir la titularidad de una habilitación comercial',
    to: '/comercio/tramites?tramite=Cambio de Titular',
    section: 'Trámites comerciales',
    aliases: ['cambio de titularidad', 'transferencia', 'cesión'],
  },

  // —— Compras ——
  {
    id: 'compras-licitaciones',
    title: 'Licitaciones públicas',
    description: 'Pliegos y notas aclaratorias para consulta',
    to: 'https://hacienda.gesell.gob.ar/compras-y-suministros.html',
    section: 'Compras',
    external: true,
    aliases: ['pliego', 'licitación', 'llamado'],
  },
  {
    id: 'compras-proveedores',
    title: 'Inscripción de proveedores',
    description: 'Información acerca de la inscripción como Proveedor Municipal',
    to: '/compras/proveedores',
    section: 'Compras',
    aliases: ['proveedor', 'registro de proveedores'],
  },
  {
    id: 'compras-combustible',
    title: 'Combustible',
    description: 'Administrar órdenes de compra y vales de combustible',
    to: '/compras/combustible',
    section: 'Compras',
    adminRoles: ['compras', 'master'],
    allowedUsernames: COMBUSTIBLE_DASHBOARD_USERNAMES,
    aliases: ['vales', 'nafta', 'gasoil', 'órdenes de compra'],
  },

  // —— Recaudaciones ——
  {
    id: 'recaudaciones-pagos-dobles',
    title: 'Informar pagos dobles',
    description: 'Realizar un reclamo por pago doble de tasas',
    to: '/recaudaciones/pagos_dobles',
    section: 'Recaudaciones',
    aliases: ['pago doble', 'doble pago', 'pago duplicado', 'devolución', 'saldo excedente'],
  },

  // —— Normativa ——
  {
    id: 'normativa-comercio',
    title: 'Digesto Comercial',
    description: 'Normativa vigente para los comercios de Villa Gesell',
    to: '/normativa/comercio',
    section: 'Normativa',
    aliases: ['ordenanzas comercio', 'reglamento comercial'],
  },
  {
    id: 'normativa-obras',
    title: 'Normativa de Obras Públicas',
    description: 'Normativa vigente para Obras Públicas de la localidad de Villa Gesell',
    to: '/normativa/obras',
    section: 'Normativa',
    aliases: ['ordenanzas obras', 'código de edificación'],
  },

  // —— Accesos frecuentes que no están como MenuItem en este sitio ——
  {
    id: 'arvige-pagos-online',
    title: 'Pagá online / Descargá tu boleta',
    description: 'Descargar boletas y pagar tasas municipales online (ARVIGE)',
    to: 'https://arvige.gob.ar/lpagos',
    section: 'ARVIGE',
    external: true,
    aliases: [
      'pagar online',
      'descargar boleta',
      'imprimir boleta',
      'vencimientos',
      'lpagos',
    ],
  },
  {
    id: 'arvige-autogestion',
    title: 'Autogestión ARVIGE',
    description: 'Ingresá a tu cuenta de contribuyente para gestionar pagos',
    to: 'https://autogestion.arvige.gob.ar/',
    section: 'ARVIGE',
    external: true,
    aliases: ['autogestión', 'mi cuenta', 'contribuyente online', 'login arvige'],
  },
  {
    id: 'arvige-patente-automotor',
    title: 'Patente Automotor',
    description: 'Consulta y pago de patente de vehículos automotores',
    to: 'https://arvige.gob.ar/lpagos',
    section: 'ARVIGE',
    external: true,
    aliases: [
      'patente',
      'automotor',
      'rodado',
      'rodados',
      'vehículo',
      'vehiculo',
      'auto',
      'impuesto automotor',
      'patente automotor',
    ],
  },
  {
    id: 'arvige-patente-rodados-menores',
    title: 'Patente — Rodados Menores',
    description: 'Consulta y pago de patente de rodados menores',
    to: 'https://arvige.gob.ar/lpagos',
    section: 'ARVIGE',
    external: true,
    aliases: ['moto', 'motocicleta', 'ciclomotor', 'rodado menor', 'patente moto'],
  },
  {
    id: 'arvige-tasas-urbanas',
    title: 'Tasas Urbanas',
    description: 'Consulta y pago de tasas urbanas municipales',
    to: 'https://arvige.gob.ar/lpagos',
    section: 'ARVIGE',
    external: true,
    aliases: [
      'tasa urbana',
      'servicios urbanos',
      'tasa municipal',
      'impuesto municipal',
      'inmueble',
      'cuenta municipal',
    ],
  },
  {
    id: 'arvige-tish',
    title: 'TISH — Tasa de Inspección de Seguridad e Higiene',
    description: 'Consulta y pago de TISH / grandes contribuyentes',
    to: 'https://arvige.gob.ar/lpagos',
    section: 'ARVIGE',
    external: true,
    aliases: ['tish', 'seguridad e higiene', 'inspección de seguridad', 'grandes contribuyentes'],
  },
  {
    id: 'arvige-red-vial',
    title: 'Red Vial',
    description: 'Consulta y pago de tasa de red vial',
    to: 'https://arvige.gob.ar/lpagos',
    section: 'ARVIGE',
    external: true,
    aliases: ['red vial', 'vialidad'],
  },
  {
    id: 'contribuyente-tasas',
    title: 'Imprimir tasas municipales',
    description: 'Imprimí las tasas municipales vigentes con tu número de cuenta',
    to: 'https://contribuyente.gesell.gob.ar/tasas-municipales.html',
    section: 'Recaudaciones',
    external: true,
    aliases: ['imprimir tasa', 'número de cuenta', 'contribuyente'],
  },
]

/**
 * Normaliza texto para comparación (minúsculas, sin tildes).
 * @param {string} value
 * @returns {string}
 */
function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/**
 * @param {import('../stores/user.js').useUserStore} userStore
 * @param {SiteNavItem} item
 */
export function isSiteNavItemVisible(userStore, item) {
  const hasRoleRestriction = Array.isArray(item.adminRoles) && item.adminRoles.length > 0
  const hasUsernameRestriction = Array.isArray(item.allowedUsernames) && item.allowedUsernames.length > 0

  if (!hasRoleRestriction && !hasUsernameRestriction) {
    return true
  }

  const admin = userStore?.admin
  const username = userStore?.username

  if (hasRoleRestriction && item.adminRoles.includes(admin)) {
    return true
  }

  if (hasUsernameRestriction && item.allowedUsernames.includes(username)) {
    return true
  }

  return false
}

/**
 * @param {import('../stores/user.js').useUserStore} userStore
 * @returns {SiteNavItem[]}
 */
export function getVisibleSiteNavigationItems(userStore) {
  return SITE_NAVIGATION_ITEMS.filter((item) => isSiteNavItemVisible(userStore, item))
}

/**
 * @param {SiteNavItem} item
 * @returns {string}
 */
function buildSearchHaystack(item) {
  const parts = [
    item.title,
    item.description,
    item.section,
    ...(Array.isArray(item.aliases) ? item.aliases : []),
  ]

  return normalizeSearchText(parts.filter(Boolean).join(' '))
}

/**
 * @param {SiteNavItem[]} items
 * @param {string} query
 * @returns {SiteNavItem[]}
 */
export function filterSiteNavigationItems(items, query) {
  const term = normalizeSearchText(query.trim())
  if (!term) {
    return []
  }

  return items.filter((item) => buildSearchHaystack(item).includes(term))
}
