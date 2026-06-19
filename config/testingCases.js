const TEST_USERS = {
  admin: {
    label: 'Admin experimental',
    username: 'test.admin@gesell.gob.ar',
    roleKey: 'admin',
    passwordHint: 'Password comun del seedExperimentalRbacUsers.js',
    permissions: ['*']
  },
  noPermissions: {
    label: 'Usuario sin permisos',
    username: 'Usuario valido sin roles experimentales',
    roleKey: 'none',
    passwordHint: 'Crear o usar usuario QA sin roles',
    permissions: []
  },
  habilitaciones: {
    label: 'Habilitaciones',
    username: 'test.habilitaciones@gesell.gob.ar',
    roleKey: 'habilitaciones',
    passwordHint: 'Password comun del seedExperimentalRbacUsers.js',
    permissions: ['habilitaciones.read']
  },
  habilitacionesJefe: {
    label: 'Habilitaciones jefe',
    username: 'test.habilitaciones.jefe@gesell.gob.ar',
    roleKey: 'habilitaciones_jefe',
    passwordHint: 'Password comun del seedExperimentalRbacUsers.js',
    permissions: ['habilitaciones.read', 'habilitaciones.status', 'habilitaciones.export']
  },
  turnos: {
    label: 'Turnos',
    username: 'test.turnos@gesell.gob.ar',
    roleKey: 'turnos',
    passwordHint: 'Password comun del seedExperimentalRbacUsers.js',
    permissions: ['turnos.read']
  },
  turnosJefe: {
    label: 'Turnos jefe',
    username: 'test.turnos.jefe@gesell.gob.ar',
    roleKey: 'turnos_jefe',
    passwordHint: 'Password comun del seedExperimentalRbacUsers.js',
    permissions: ['turnos.read', 'turnos.update']
  },
  pagosDobles: {
    label: 'Pagos dobles',
    username: 'test.pagos.dobles@gesell.gob.ar',
    roleKey: 'pagos_dobles',
    passwordHint: 'Password comun del seedExperimentalRbacUsers.js',
    permissions: ['pagosDobles.read', 'pagosDobles.update']
  },
  pagosDoblesJefe: {
    label: 'Pagos dobles jefe',
    username: 'test.pagos.dobles.jefe@gesell.gob.ar',
    roleKey: 'pagos_dobles_jefe',
    passwordHint: 'Password comun del seedExperimentalRbacUsers.js',
    permissions: ['pagosDobles.read', 'pagosDobles.update', 'pagosDobles.export']
  },
  cementerioFuneraria: {
    label: 'Cementerio funeraria',
    username: 'test.funeraria.1@gesell.gob.ar',
    roleKey: 'cementerio_funeraria',
    passwordHint: 'Password comun del seedExperimentalRbacUsers.js',
    permissions: ['cementerio.read', 'cementerio.update']
  },
  cementerioFunerariaJefe: {
    label: 'Cementerio funeraria jefe',
    username: 'test.funeraria.2@gesell.gob.ar',
    roleKey: 'cementerio_funeraria_jefe',
    passwordHint: 'Password comun del seedExperimentalRbacUsers.js',
    permissions: ['cementerio.read', 'cementerio.update', 'cementerio.confirm']
  },
  cementerioReview: {
    label: 'Cementerio revision',
    username: 'Usuario con rol cementerio_review',
    roleKey: 'cementerio_review',
    passwordHint: 'Asignar rol desde DevTools o admin usuarios',
    permissions: ['cementerio.review']
  },
  cementerioAdmin: {
    label: 'Cementerio admin',
    username: 'Usuario con rol cementerio_admin',
    roleKey: 'cementerio_admin',
    passwordHint: 'Asignar rol desde DevTools o admin usuarios',
    permissions: ['cementerio.read', 'cementerio.admin']
  },
  compras: {
    label: 'Compras',
    username: 'test.compras@gesell.gob.ar',
    roleKey: 'compras',
    passwordHint: 'Password comun del seedExperimentalRbacUsers.js',
    permissions: ['compras.ordenes.read', 'compras.ordenes.update', 'compras.ordenes.delete']
  },
  comprasJefe: {
    label: 'Compras jefe',
    username: 'test.compras.jefe@gesell.gob.ar',
    roleKey: 'compras_jefe',
    passwordHint: 'Password comun del seedExperimentalRbacUsers.js',
    permissions: [
      'compras.ordenes.read',
      'compras.ordenes.update',
      'compras.ordenes.delete',
      'compras.vales.read',
      'compras.vales.update',
      'compras.vehiculos.manage',
      'compras.dashboard'
    ]
  },
  haciendaJefe: {
    label: 'Hacienda jefe',
    username: 'test.hacienda.jefe@gesell.gob.ar',
    roleKey: 'hacienda_jefe',
    passwordHint: 'Password comun del seedExperimentalRbacUsers.js',
    permissions: [
      'hacienda.obras.read',
      'hacienda.obras.update',
      'hacienda.obras.export',
      'hacienda.indices.read',
      'hacienda.indices.update',
      'dashboard.read',
      'activities.read'
    ]
  },
  abiertoAnualJefe: {
    label: 'Abierto anual jefe',
    username: 'Usuario con rol abierto_anual_jefe',
    roleKey: 'abierto_anual_jefe',
    passwordHint: 'Asignar rol desde DevTools o admin usuarios',
    permissions: ['abiertoAnual.read', 'abiertoAnual.update', 'abiertoAnual.export', 'abiertoAnual.admin']
  },
  maestroComercial: {
    label: 'Maestro comercial',
    username: 'Usuario con rol maestro_comercial',
    roleKey: 'maestro_comercial',
    passwordHint: 'Asignar rol desde DevTools o admin usuarios',
    permissions: ['maestroComercial.read', 'maestroComercial.update']
  },
  modernizacion: {
    label: 'Modernizacion',
    username: 'test.modernizacion@gesell.gob.ar',
    roleKey: 'modernizacion',
    passwordHint: 'Password comun del seedExperimentalRbacUsers.js',
    permissions: ['modernizacion.read', 'modernizacion.update']
  }
}

const MODULES = [
  { key: 'auth', label: 'Autenticacion y permisos', icon: 'person-check' },
  { key: 'navigation', label: 'Navegacion y menus', icon: 'compass' },
  { key: 'habilitaciones', label: 'Habilitaciones', icon: 'file-earmark-check' },
  { key: 'turnos', label: 'Turnos', icon: 'calendar-check' },
  { key: 'pagosDobles', label: 'Pagos dobles', icon: 'receipt-cutoff' },
  { key: 'cementerio', label: 'Cementerio', icon: 'building' },
  { key: 'compras', label: 'Compras y combustible', icon: 'fuel-pump' },
  { key: 'hacienda', label: 'Hacienda', icon: 'graph-up-arrow' },
  { key: 'abiertoAnual', label: 'Abierto anual', icon: 'calendar-event' },
  { key: 'maestroComercial', label: 'Maestro comercial', icon: 'table' },
  { key: 'modernizacion', label: 'Modernizacion', icon: 'collection-play' },
  { key: 'boletas', label: 'Boletas admin', icon: 'receipt' },
  { key: 'security', label: 'Seguridad RBAC', icon: 'shield-exclamation' },
  { key: 'public', label: 'Flujos publicos', icon: 'globe2' }
]

const CASES = [
  {
    id: 'AUTH-01',
    module: 'auth',
    submodule: 'sin-token',
    title: 'Sin token en pantalla privada',
    goal: 'Validar que una pantalla privada no muestre contenido cuando no hay sesion.',
    suggestedUser: null,
    negativeUser: null,
    route: '/admin/usuarios',
    permissions: [],
    expected: 'La UI redirige o no muestra contenido privado; la API privada debe responder 401/403.',
    steps: [
      {
        id: 'AUTH-01-01',
        text: 'Cerrar sesion o abrir una ventana sin token.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AUTH-01-02',
        text: 'Intentar entrar a /admin/usuarios.',
        checkpoint: { type: 'route-not', path: '/admin/usuarios' }
      },
      {
        id: 'AUTH-01-03',
        text: 'Confirmar que no se muestra la administracion de usuarios.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'AUTH-03',
    module: 'auth',
    submodule: 'sin-permisos',
    title: 'Usuario valido sin permisos',
    goal: 'Verificar que un usuario autenticado sin roles no vea menus privados.',
    suggestedUser: 'noPermissions',
    negativeUser: null,
    route: '/',
    permissions: [],
    expected: 'No aparecen menus privados y las APIs protegidas devuelven 403.',
    steps: [
      {
        id: 'AUTH-03-01',
        text: 'Iniciar sesion con un usuario valido sin roles experimentales.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AUTH-03-02',
        text: 'Confirmar que el usuario actual no tiene permisos activos.',
        checkpoint: { type: 'permissions-exact', permissions: [] }
      },
      {
        id: 'AUTH-03-03',
        text: 'Revisar que no aparezcan menus privados en la barra superior.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'AUTH-04',
    module: 'auth',
    submodule: 'wildcard',
    title: 'Admin experimental con wildcard',
    goal: 'Confirmar que el rol admin experimental obtiene acceso completo.',
    suggestedUser: 'admin',
    negativeUser: null,
    route: '/',
    permissions: ['*'],
    expected: 'El usuario ve todos los menus y pasa todos los requirePermission.',
    steps: [
      {
        id: 'AUTH-04-01',
        text: 'Iniciar sesion con test.admin@gesell.gob.ar.',
        checkpoint: { type: 'user', username: TEST_USERS.admin.username }
      },
      {
        id: 'AUTH-04-02',
        text: 'Confirmar que el permiso wildcard esta activo.',
        checkpoint: { type: 'permissions', permissions: ['*'] }
      },
      {
        id: 'AUTH-04-03',
        text: 'Revisar visualmente que los menus privados esperados esten disponibles.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'NAV-02',
    module: 'navigation',
    submodule: 'menus-area',
    title: 'Menu por area',
    goal: 'Validar que cada rol operativo vea solo el menu de su area.',
    suggestedUser: 'habilitaciones',
    negativeUser: null,
    route: '/',
    permissions: ['habilitaciones.read'],
    expected: 'El usuario ve Comercio > Habilitaciones y no ve areas ajenas.',
    steps: [
      {
        id: 'NAV-02-01',
        text: 'Iniciar sesion con test.habilitaciones@gesell.gob.ar.',
        checkpoint: { type: 'user', username: TEST_USERS.habilitaciones.username }
      },
      {
        id: 'NAV-02-02',
        text: 'Confirmar que habilitaciones.read esta activo.',
        checkpoint: { type: 'permissions', permissions: ['habilitaciones.read'] }
      },
      {
        id: 'NAV-02-03',
        text: 'Revisar que no aparezcan Compras, Cementerio, Dashboard ni Usuarios.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'HAB-READ-01',
    module: 'habilitaciones',
    submodule: 'read',
    title: 'Habilitaciones lectura',
    goal: 'Ver solicitudes de habilitacion sin permisos de exportacion o visibilidad.',
    suggestedUser: 'habilitaciones',
    negativeUser: 'pagosDobles',
    route: '/comercio/solicitudes',
    permissions: ['habilitaciones.read'],
    expected: 'Carga listado y detalle; no muestra acciones de jefe.',
    steps: [
      {
        id: 'HAB-READ-01-01',
        text: 'Entrar con el rol Habilitaciones.',
        checkpoint: { type: 'permissions', permissions: ['habilitaciones.read'] }
      },
      {
        id: 'HAB-READ-01-02',
        text: 'Abrir la pagina de solicitudes de comercio.',
        checkpoint: { type: 'route', path: '/comercio/solicitudes' }
      },
      {
        id: 'HAB-READ-01-03',
        text: 'Confirmar que el listado carga y que no aparece exportacion si falta habilitaciones.export.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'HAB-EXPORT-01',
    module: 'habilitaciones',
    submodule: 'export-status',
    title: 'Habilitaciones jefe',
    goal: 'Validar exportacion, estado y visibilidad para el rol jefe.',
    suggestedUser: 'habilitacionesJefe',
    negativeUser: 'habilitaciones',
    route: '/comercio/solicitudes',
    permissions: ['habilitaciones.read', 'habilitaciones.status', 'habilitaciones.export'],
    expected: 'El rol jefe ve exportacion y acciones protegidas; el rol base no.',
    steps: [
      {
        id: 'HAB-EXPORT-01-01',
        text: 'Entrar con Habilitaciones jefe.',
        checkpoint: { type: 'permissions', permissions: ['habilitaciones.status', 'habilitaciones.export'] }
      },
      {
        id: 'HAB-EXPORT-01-02',
        text: 'Abrir /comercio/solicitudes.',
        checkpoint: { type: 'route', path: '/comercio/solicitudes' }
      },
      {
        id: 'HAB-EXPORT-01-03',
        text: 'Confirmar que aparece exportacion y que el rol base no la ve.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'TURNOS-01',
    module: 'turnos',
    submodule: 'read-update',
    title: 'Turnos lectura y modificacion',
    goal: 'Diferenciar lectura de turnos y cambios de estado.',
    suggestedUser: 'turnosJefe',
    negativeUser: 'turnos',
    route: '/comercio/turnos/reservas',
    permissions: ['turnos.read', 'turnos.update'],
    expected: 'El jefe puede modificar; el rol base solo consulta.',
    steps: [
      {
        id: 'TURNOS-01-01',
        text: 'Entrar con Turnos jefe.',
        checkpoint: { type: 'permissions', permissions: ['turnos.read', 'turnos.update'] }
      },
      {
        id: 'TURNOS-01-02',
        text: 'Abrir reservas de turnos.',
        checkpoint: { type: 'route', path: '/comercio/turnos/reservas' }
      },
      {
        id: 'TURNOS-01-03',
        text: 'Confirmar que las acciones de modificar/cancelar aparecen solo con turnos.update.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'PD-01',
    module: 'pagosDobles',
    submodule: 'read-update',
    title: 'Pagos dobles operativo',
    goal: 'Validar lectura y actualizacion de solicitudes de pagos dobles.',
    suggestedUser: 'pagosDobles',
    negativeUser: 'habilitaciones',
    route: '/recaudaciones/pagos_dobles/solicitudes',
    permissions: ['pagosDobles.read', 'pagosDobles.update'],
    expected: 'El rol operativo carga solicitudes y puede resolver acciones permitidas.',
    steps: [
      {
        id: 'PD-01-01',
        text: 'Entrar con Pagos dobles.',
        checkpoint: { type: 'permissions', permissions: ['pagosDobles.read', 'pagosDobles.update'] }
      },
      {
        id: 'PD-01-02',
        text: 'Abrir solicitudes de pagos dobles.',
        checkpoint: { type: 'route', path: '/recaudaciones/pagos_dobles/solicitudes' }
      },
      {
        id: 'PD-01-03',
        text: 'Confirmar que un rol de otra area no accede al listado.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'PD-EXPORT-01',
    module: 'pagosDobles',
    submodule: 'export',
    title: 'Pagos dobles exportacion',
    goal: 'Validar que exportar requiere pagosDobles.export.',
    suggestedUser: 'pagosDoblesJefe',
    negativeUser: 'pagosDobles',
    route: '/recaudaciones/pagos_dobles/solicitudes',
    permissions: ['pagosDobles.export'],
    expected: 'El jefe ve exportacion; el rol operativo no.',
    steps: [
      {
        id: 'PD-EXPORT-01-01',
        text: 'Entrar con Pagos dobles jefe.',
        checkpoint: { type: 'permissions', permissions: ['pagosDobles.export'] }
      },
      {
        id: 'PD-EXPORT-01-02',
        text: 'Abrir el listado de solicitudes.',
        checkpoint: { type: 'route', path: '/recaudaciones/pagos_dobles/solicitudes' }
      },
      {
        id: 'PD-EXPORT-01-03',
        text: 'Confirmar visualmente que existe exportacion y que el rol base no la ve.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'CEM-01',
    module: 'cementerio',
    submodule: 'funeraria',
    title: 'Cementerio funeraria',
    goal: 'Validar carga y edicion de declaraciones de una funeraria.',
    suggestedUser: 'cementerioFuneraria',
    negativeUser: 'pagosDobles',
    route: '/cementerio/certificado_defuncion',
    permissions: ['cementerio.read', 'cementerio.update'],
    expected: 'La funeraria ve y carga sus periodos; otra area no accede.',
    steps: [
      {
        id: 'CEM-01-01',
        text: 'Entrar con una funeraria de prueba.',
        checkpoint: { type: 'permissions', permissions: ['cementerio.read', 'cementerio.update'] }
      },
      {
        id: 'CEM-01-02',
        text: 'Abrir declaraciones juradas de cementerio.',
        checkpoint: { type: 'route', path: '/cementerio/certificado_defuncion' }
      },
      {
        id: 'CEM-01-03',
        text: 'Confirmar que solo aparecen datos de su funeraria asociada.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'CEM-CONFIRM-01',
    module: 'cementerio',
    submodule: 'confirmacion',
    title: 'Cementerio confirmacion mensual',
    goal: 'Validar que confirmar periodo requiere cementerio.confirm.',
    suggestedUser: 'cementerioFunerariaJefe',
    negativeUser: 'cementerioFuneraria',
    route: '/cementerio/certificado_defuncion',
    permissions: ['cementerio.confirm'],
    expected: 'El jefe puede confirmar; el rol base no ve la accion.',
    steps: [
      {
        id: 'CEM-CONFIRM-01-01',
        text: 'Entrar con Cementerio funeraria jefe.',
        checkpoint: { type: 'permissions', permissions: ['cementerio.confirm'] }
      },
      {
        id: 'CEM-CONFIRM-01-02',
        text: 'Abrir la pantalla de declaraciones.',
        checkpoint: { type: 'route', path: '/cementerio/certificado_defuncion' }
      },
      {
        id: 'CEM-CONFIRM-01-03',
        text: 'Confirmar que aparece la accion de confirmar periodo cuando corresponde.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'CEM-REVIEW-01',
    module: 'cementerio',
    submodule: 'revision',
    title: 'Cementerio revision recaudatoria',
    goal: 'Validar revision global de comprobantes y periodos.',
    suggestedUser: 'cementerioReview',
    negativeUser: 'cementerioFuneraria',
    route: '/cementerio/solicitudes',
    permissions: ['cementerio.review'],
    expected: 'Revision ve solicitudes globales; funeraria no ve esa consola.',
    steps: [
      {
        id: 'CEM-REVIEW-01-01',
        text: 'Entrar con un usuario de revision.',
        checkpoint: { type: 'permissions', permissions: ['cementerio.review'] }
      },
      {
        id: 'CEM-REVIEW-01-02',
        text: 'Abrir /cementerio/solicitudes.',
        checkpoint: { type: 'route', path: '/cementerio/solicitudes' }
      },
      {
        id: 'CEM-REVIEW-01-03',
        text: 'Confirmar que se pueden revisar comprobantes y resolver periodos segun estado.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'COMPRAS-01',
    module: 'compras',
    submodule: 'ordenes',
    title: 'Compras ordenes',
    goal: 'Validar ordenes de compra sin permisos de vales.',
    suggestedUser: 'compras',
    negativeUser: 'habilitaciones',
    route: '/compras/combustible',
    permissions: ['compras.ordenes.read', 'compras.ordenes.update', 'compras.ordenes.delete'],
    expected: 'Compras gestiona ordenes; no gestiona vales ni vehiculos si no tiene permisos.',
    steps: [
      {
        id: 'COMPRAS-01-01',
        text: 'Entrar con test.compras@gesell.gob.ar.',
        checkpoint: { type: 'permissions', permissions: ['compras.ordenes.read'] }
      },
      {
        id: 'COMPRAS-01-02',
        text: 'Abrir Combustible.',
        checkpoint: { type: 'route', path: '/compras/combustible' }
      },
      {
        id: 'COMPRAS-01-03',
        text: 'Confirmar que ve ordenes y no ve herramientas de vales/vehiculos si faltan permisos.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'COMPRAS-JEFE-01',
    module: 'compras',
    submodule: 'vales-dashboard',
    title: 'Compras jefe combustible',
    goal: 'Validar vales, vehiculos y dashboard de combustible.',
    suggestedUser: 'comprasJefe',
    negativeUser: 'compras',
    route: '/compras/combustible',
    permissions: ['compras.vales.read', 'compras.vales.update', 'compras.vehiculos.manage', 'compras.dashboard'],
    expected: 'El jefe ve vales, vehiculos y estadisticas.',
    steps: [
      {
        id: 'COMPRAS-JEFE-01-01',
        text: 'Entrar con Compras jefe.',
        checkpoint: { type: 'permissions', permissions: ['compras.vales.read', 'compras.vehiculos.manage', 'compras.dashboard'] }
      },
      {
        id: 'COMPRAS-JEFE-01-02',
        text: 'Abrir la pantalla de combustible.',
        checkpoint: { type: 'route', path: '/compras/combustible' }
      },
      {
        id: 'COMPRAS-JEFE-01-03',
        text: 'Confirmar tabs/acciones de vales, vehiculos y estadisticas.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'HAC-01',
    module: 'hacienda',
    submodule: 'obras-indices',
    title: 'Hacienda obras e indices',
    goal: 'Validar lectura y edicion de obras/indices, dashboard y actividades.',
    suggestedUser: 'haciendaJefe',
    negativeUser: 'modernizacion',
    route: '/obras',
    permissions: ['hacienda.obras.read', 'hacienda.obras.update', 'hacienda.indices.read', 'hacienda.indices.update'],
    expected: 'Hacienda accede a obras e indices; otra area no.',
    steps: [
      {
        id: 'HAC-01-01',
        text: 'Entrar con Hacienda jefe.',
        checkpoint: { type: 'permissions', permissions: ['hacienda.obras.read', 'hacienda.indices.read'] }
      },
      {
        id: 'HAC-01-02',
        text: 'Abrir el listado de obras.',
        checkpoint: { type: 'route', path: '/obras' }
      },
      {
        id: 'HAC-01-03',
        text: 'Luego revisar /indices/search y las acciones de crear/editar.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'AA-01',
    module: 'abiertoAnual',
    submodule: 'gestion-export',
    title: 'Abierto anual jefe',
    goal: 'Validar el circuito completo del rol jefe: listado de registros, detalle/acciones, exportacion y administracion de periodos.',
    suggestedUser: 'abiertoAnualJefe',
    negativeUser: null,
    route: '/comercio/abierto_anual/registros',
    permissions: ['abiertoAnual.read', 'abiertoAnual.update', 'abiertoAnual.export', 'abiertoAnual.admin'],
    expected: 'El jefe puede ver registros, entrar al detalle, ejecutar acciones permitidas, exportar y abrir la administracion de periodos.',
    steps: [
      {
        id: 'AA-01-01',
        text: 'Entrar con Abierto anual jefe.',
        checkpoint: { type: 'permissions', permissions: ['abiertoAnual.read', 'abiertoAnual.update'] }
      },
      {
        id: 'AA-01-02',
        text: 'Abrir registros de abierto anual.',
        checkpoint: { type: 'route', path: '/comercio/abierto_anual/registros' }
      },
      {
        id: 'AA-01-03',
        text: 'Confirmar que el listado de registros carga y permite entrar al detalle de un registro.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-01-04',
        text: 'En el detalle, confirmar que las acciones de gestion aparecen cuando el estado del tramite las permite.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-01-05',
        text: 'Volver al listado y confirmar que la opcion Exportar CSV aparece y descarga correctamente.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-01-06',
        text: 'Abrir Administrar abierto anual o DevTools > Abierto anual y confirmar que se pueden revisar periodos y rectificacion global.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'MAESTRO-01',
    module: 'maestroComercial',
    submodule: 'read-update',
    title: 'Maestro comercial',
    goal: 'Validar consulta y actualizacion del maestro comercial.',
    suggestedUser: 'maestroComercial',
    negativeUser: 'habilitaciones',
    route: '/maestro',
    permissions: ['maestroComercial.read', 'maestroComercial.update'],
    expected: 'Maestro comercial carga y edita; otra area no accede.',
    steps: [
      {
        id: 'MAESTRO-01-01',
        text: 'Entrar con Maestro comercial.',
        checkpoint: { type: 'permissions', permissions: ['maestroComercial.read'] }
      },
      {
        id: 'MAESTRO-01-02',
        text: 'Abrir /maestro.',
        checkpoint: { type: 'route', path: '/maestro' }
      },
      {
        id: 'MAESTRO-01-03',
        text: 'Confirmar que se puede abrir detalle y editar solo con update.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'MOD-01',
    module: 'modernizacion',
    submodule: 'multimedia',
    title: 'Modernizacion multimedia',
    goal: 'Validar gestion de contenido de modernizacion.',
    suggestedUser: 'modernizacion',
    negativeUser: 'pagosDobles',
    route: '/modernizacion',
    permissions: ['modernizacion.read', 'modernizacion.update'],
    expected: 'Modernizacion ve y gestiona contenido; pagos dobles no.',
    steps: [
      {
        id: 'MOD-01-01',
        text: 'Entrar con Modernizacion.',
        checkpoint: { type: 'permissions', permissions: ['modernizacion.read', 'modernizacion.update'] }
      },
      {
        id: 'MOD-01-02',
        text: 'Abrir /modernizacion.',
        checkpoint: { type: 'route', path: '/modernizacion' }
      },
      {
        id: 'MOD-01-03',
        text: 'Confirmar acciones de gestion de contenido.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'BOLETAS-01',
    module: 'boletas',
    submodule: 'manage',
    title: 'Administracion de boletas',
    goal: 'Validar que importar/publicar boletas requiere boletas.manage.',
    suggestedUser: 'admin',
    negativeUser: 'haciendaJefe',
    route: '/admin/boletas',
    permissions: ['*'],
    expected: 'Admin o boletas.manage puede operar; Hacienda sin boletas.manage no.',
    steps: [
      {
        id: 'BOLETAS-01-01',
        text: 'Entrar con Admin experimental o usuario con boletas.manage.',
        checkpoint: { type: 'permissions-any', permissions: ['*', 'boletas.manage'] }
      },
      {
        id: 'BOLETAS-01-02',
        text: 'Abrir /admin/boletas.',
        checkpoint: { type: 'route', path: '/admin/boletas' }
      },
      {
        id: 'BOLETAS-01-03',
        text: 'Confirmar que analizar, publicar y deshabilitar cargas no aparecen para usuarios sin boletas.manage.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'SEC-01',
    module: 'security',
    submodule: 'backend-403',
    title: 'Ocultar boton no alcanza',
    goal: 'Validar que el backend responde 403 si se fuerza una request sin permiso.',
    suggestedUser: 'habilitaciones',
    negativeUser: null,
    route: '/comercio/solicitudes',
    permissions: ['habilitaciones.read'],
    expected: 'Cualquier accion no permitida falla en backend aunque se fuerce manualmente.',
    steps: [
      {
        id: 'SEC-01-01',
        text: 'Entrar con un rol que tenga lectura pero no el permiso sensible.',
        checkpoint: { type: 'permissions', permissions: ['habilitaciones.read'] }
      },
      {
        id: 'SEC-01-02',
        text: 'Intentar forzar una accion protegida desde DevTools del navegador o cliente HTTP.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'SEC-01-03',
        text: 'Confirmar que el backend responde 403 y mensaje de permiso.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'PUBLIC-01',
    module: 'public',
    submodule: 'no-login',
    title: 'Flujos publicos sin login',
    goal: 'Confirmar que home, consultas y formularios publicos no piden sesion.',
    suggestedUser: null,
    negativeUser: null,
    route: '/',
    permissions: [],
    expected: 'Los accesos publicos siguen funcionando sin login.',
    steps: [
      {
        id: 'PUBLIC-01-01',
        text: 'Cerrar sesion.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PUBLIC-01-02',
        text: 'Abrir la home.',
        checkpoint: { type: 'route', path: '/' }
      },
      {
        id: 'PUBLIC-01-03',
        text: 'Probar consulta publica de tramites y boletas si hay datos disponibles.',
        checkpoint: { type: 'manual' }
      }
    ]
  }
]

function caseById(id) {
  return CASES.find(item => item.id === id) || null
}

function moduleByKey(key) {
  return MODULES.find(item => item.key === key) || null
}

function userByKey(key) {
  return TEST_USERS[key] || null
}

module.exports = {
  TEST_USERS,
  MODULES,
  CASES,
  caseById,
  moduleByKey,
  userByKey
}
