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
  abiertoAnualLectura: {
    label: 'Abierto anual lectura',
    username: 'Usuario con rol abierto_anual_lectura',
    roleKey: 'abierto_anual_lectura',
    passwordHint: 'Asignar rol desde DevTools o admin usuarios',
    permissions: ['abiertoAnual.read']
  },
  abiertoAnualOperador: {
    label: 'Abierto anual operador',
    username: 'Usuario con rol abierto_anual_operador',
    roleKey: 'abierto_anual_operador',
    passwordHint: 'Asignar rol desde DevTools o admin usuarios',
    permissions: ['abiertoAnual.read', 'abiertoAnual.update']
  },
  abiertoAnualExportador: {
    label: 'Abierto anual exportador',
    username: 'Usuario con rol abierto_anual_exportador',
    roleKey: 'abierto_anual_exportador',
    passwordHint: 'Asignar rol desde DevTools o admin usuarios',
    permissions: ['abiertoAnual.read', 'abiertoAnual.export']
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
  {
    key: 'auth',
    label: 'Autenticacion y permisos',
    icon: 'person-check',
    description: 'Login, usuario actual y comportamiento basico cuando falta sesion o permisos.',
    includes: ['Ingreso/salida de sesion', 'Usuario sin permisos', 'Admin con wildcard'],
    excludes: ['Acciones internas de cada tramite'],
    recommendedFor: 'Arrancar una pasada QA desde identidad y acceso base.'
  },
  {
    key: 'navigation',
    label: 'Navegacion y menus',
    icon: 'compass',
    description: 'Visibilidad de menues, accesos y rutas segun el rol activo.',
    includes: ['Menus privados visibles', 'Accesos ocultos por area', 'Casos compartidos por modulo'],
    excludes: ['Validacion profunda de endpoints'],
    recommendedFor: 'Comprobar que el usuario ve solo las puertas correctas.'
  },
  {
    key: 'habilitaciones',
    label: 'Habilitaciones',
    icon: 'file-earmark-check',
    description: 'Backoffice de solicitudes comerciales, lectura, gestion, estado y exportacion.',
    includes: ['Solicitudes recibidas', 'Detalle administrativo', 'Exportacion', 'Casos compartidos publicos/RBAC'],
    excludes: ['Abierto anual y turnos salvo casos compartidos'],
    recommendedFor: 'Probar el circuito administrativo de comercio.'
  },
  {
    key: 'turnos',
    label: 'Turnos',
    icon: 'calendar-check',
    description: 'Gestion de turnos de inspeccion y acciones operativas asociadas.',
    includes: ['Reserva/listado', 'Modificar o cancelar', 'Permisos turnos.read/update'],
    excludes: ['Aprobacion completa de solicitudes comerciales'],
    recommendedFor: 'Validar agenda e intervenciones del area de inspeccion.'
  },
  {
    key: 'pagosDobles',
    label: 'Pagos dobles',
    icon: 'receipt-cutoff',
    description: 'Solicitudes de pagos dobles desde carga publica hasta revision interna.',
    includes: ['Lectura y actualizacion', 'Exportacion', 'Casos publicos compartidos'],
    excludes: ['Boletas de tasas e importaciones masivas'],
    recommendedFor: 'Probar circuito de recaudaciones con permisos propios.'
  },
  {
    key: 'cementerio',
    label: 'Cementerio',
    icon: 'building',
    description: 'Declaraciones, confirmaciones y revision recaudatoria del modulo cementerio.',
    includes: ['Funerarias', 'Confirmacion mensual', 'Revision de comprobantes'],
    excludes: ['Pagos dobles y boletas generales'],
    recommendedFor: 'Validar operaciones mensuales y permisos de cementerio.'
  },
  {
    key: 'compras',
    label: 'Compras y combustible',
    icon: 'fuel-pump',
    description: 'Ordenes, vales, vehiculos y tablero de combustible.',
    includes: ['Ordenes de compra', 'Vales', 'Vehiculos', 'Dashboard'],
    excludes: ['Hacienda/redeterminaciones'],
    recommendedFor: 'Probar permisos separados dentro de compras.'
  },
  {
    key: 'hacienda',
    label: 'Hacienda',
    icon: 'graph-up-arrow',
    description: 'Obras, indices, dashboard y acciones vinculadas a redeterminacion.',
    includes: ['Obras', 'Indices', 'Actividades', 'Dashboard'],
    excludes: ['Compras operativas'],
    recommendedFor: 'Validar el circuito del proyecto hermano desde el front.'
  },
  {
    key: 'abiertoAnual',
    label: 'Abierto anual',
    icon: 'calendar-event',
    description: 'Carga publica de facturas, revision interna por periodo, exportacion y administracion de ventanas.',
    includes: ['Home publica', 'CUIT y legajo', 'Carga por periodo', 'Estados de factura', 'Revision interna', 'Exportacion CSV', 'Periodos y rectificacion', 'Permisos propios'],
    excludes: ['Alta general de habilitaciones', 'Turnos de inspeccion', 'Maestro comercial salvo validacion de CUIT/legajo'],
    recommendedFor: 'Probar el beneficio de Abierto Anual de punta a punta.'
  },
  {
    key: 'maestroComercial',
    label: 'Maestro comercial',
    icon: 'table',
    description: 'Consulta y actualizacion del padron/maestro comercial.',
    includes: ['Lectura', 'Detalle', 'Actualizacion'],
    excludes: ['Solicitudes nuevas de comercio'],
    recommendedFor: 'Validar datos base comerciales y permisos de edicion.'
  },
  {
    key: 'modernizacion',
    label: 'Modernizacion',
    icon: 'collection-play',
    description: 'Gestion interna de contenidos y herramientas del area Modernizacion.',
    includes: ['Multimedia', 'Contenido', 'Permisos modernizacion.read/update'],
    excludes: ['Tramites comerciales'],
    recommendedFor: 'Probar herramientas internas de contenido.'
  },
  {
    key: 'boletas',
    label: 'Boletas admin',
    icon: 'receipt',
    description: 'Administracion de cargas de boletas y configuraciones visuales de tasas.',
    includes: ['Importacion/publicacion', 'Permiso boletas.manage', 'Colores de PDF'],
    excludes: ['Pagos dobles como tramite'],
    recommendedFor: 'Validar herramientas administrativas de tasas.'
  },
  {
    key: 'security',
    label: 'Seguridad RBAC',
    icon: 'shield-exclamation',
    description: 'Bloqueos reales por permiso, incluyendo requests forzadas al backend.',
    includes: ['403 esperados', 'Permisos sensibles', 'Casos compartidos con tramites'],
    excludes: ['Solo visibilidad de menu'],
    recommendedFor: 'Confirmar que ocultar botones no es la unica defensa.'
  },
  {
    key: 'public',
    label: 'Flujos publicos',
    icon: 'globe2',
    description: 'Pantallas sin login municipal: home, formularios y consultas publicas.',
    includes: ['Acceso sin sesion', 'Consultas publicas', 'Inicios de tramite compartidos'],
    excludes: ['Backoffice municipal'],
    recommendedFor: 'Hacer una pasada transversal de experiencia ciudadana.'
  }
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
    modules: ['auth', 'navigation', 'security'],
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
    modules: ['navigation', 'habilitaciones'],
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
    id: 'PD-PUBLIC-01',
    module: 'pagosDobles',
    modules: ['pagosDobles', 'public'],
    submodule: 'publico-envio',
    title: 'Inicio publico de solicitud',
    goal: 'Completar el formulario publico de pagos dobles con datos validos y confirmar que se genera el tramite.',
    suggestedUser: null,
    negativeUser: null,
    route: '/recaudaciones/pagos_dobles/form',
    permissions: [],
    expected: 'El vecino puede enviar la solicitud sin login, recibe numero R... y se dispara el mail pagosDobles.solicitud_recibida.',
    steps: [
      {
        id: 'PD-PUBLIC-01-01',
        text: 'Cerrar sesion o usar ventana sin usuario municipal.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-01-02',
        text: 'Abrir /recaudaciones/pagos_dobles/form.',
        checkpoint: { type: 'route', path: '/recaudaciones/pagos_dobles/form' }
      },
      {
        id: 'PD-PUBLIC-01-03',
        text: 'Cargar datos validos: Nombre QA Pagos, Apellido Dobles, DNI 12345678, CUIT 20123456783, Cuenta 123456789, Domicilio Av. Buenos Aires 1234, Telefono 2255555444, CP 7165, Localidad Villa Gesell, Provincia Buenos Aires. En ambos campos de correo usar una casilla real de QA accesible por el tester, porque este caso exige confirmar recepcion del mail automatico.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-01-04',
        text: 'Dejar "Sos titular del inmueble?" en No y cargar archivos validos menores a 15MB para DNI frente, DNI dorso, comprobante de pago, comprobante duplicado, planilla de autorizacion y acreditacion de titularidad.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-01-05',
        text: 'Completar captcha y presionar Enviar.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-01-06',
        text: 'Confirmar popup de exito, registrar el numero de tramite R... y confirmar recepcion del mail automatico pagosDobles.solicitud_recibida.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-01-07',
        text: 'En el popup de exito presionar Imprimir. Confirmar que aparece el comprobante de solicitud con dia, numero de tramite R... y solicitante, que se abre el dialogo de impresion del navegador y que luego queda disponible el boton Volver.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'PD-PUBLIC-02',
    module: 'pagosDobles',
    modules: ['pagosDobles', 'public'],
    submodule: 'validaciones-datos',
    title: 'Validaciones datos solicitante',
    goal: 'Probar input por input las validaciones del formulario publico de pagos dobles.',
    suggestedUser: null,
    negativeUser: null,
    route: '/recaudaciones/pagos_dobles/form',
    permissions: [],
    expected: 'Cada campo muestra su error especifico y el boton Enviar permanece deshabilitado hasta completar datos validos.',
    steps: [
      {
        id: 'PD-PUBLIC-02-01',
        text: 'Abrir /recaudaciones/pagos_dobles/form sin login municipal.',
        checkpoint: { type: 'route', path: '/recaudaciones/pagos_dobles/form' }
      },
      {
        id: 'PD-PUBLIC-02-02',
        text: 'Tocar y dejar vacio Nombre; confirmar error "El Nombre no puede estar vacio". Luego cargar Nombre = QA Pagos.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-02-03',
        text: 'Tocar y dejar vacio Apellido; confirmar error "El Apellido no puede estar vacio". Luego cargar Apellido = Dobles.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-02-04',
        text: 'En DNI / Pasaporte probar ABC123 y luego 123456; ambos deben ser invalidos. Reemplazar por 12345678 y confirmar que queda valido.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-02-05',
        text: 'En CUIT probar 20-12345678-3; debe ser invalido por guiones. Reemplazar por 20123456783 y confirmar que queda valido.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-02-06',
        text: 'Tocar y dejar vacio Numero de cuenta; confirmar error. Luego cargar 123456789.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-02-07',
        text: 'Tocar y dejar vacio Domicilio Real y/o Legal; confirmar error. Luego cargar Av. Buenos Aires 1234.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-02-08',
        text: 'En Telefono probar 11-5555-4444; debe ser invalido por caracteres especiales. Reemplazar por 2255555444.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-02-09',
        text: 'En Codigo Postal probar 716; debe ser invalido por longitud. Reemplazar por 7165.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-02-10',
        text: 'Tocar y dejar vacia Localidad; confirmar error. Luego cargar Localidad = Villa Gesell. No abrir todavia el selector Provincia.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-02-11',
        text: 'Sin modificar Localidad, ir a Provincia. Confirmar que sigue vacia antes de tocar el selector; recien entonces abrirlo y seleccionar Buenos Aires.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-02-12',
        text: 'En Correo Electronico probar qa-pagos-dobles; debe ser invalido. Reemplazar por una casilla real de QA accesible por el tester.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-02-13',
        text: 'En Repita el Correo Electronico cargar otro@gesell.gob.ar; debe indicar que los correos no coinciden. Reemplazar por la misma casilla real de QA usada en Correo Electronico.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'PD-PUBLIC-03',
    module: 'pagosDobles',
    modules: ['pagosDobles', 'public'],
    submodule: 'titularidad-documentos',
    title: 'Documentos segun titularidad',
    goal: 'Validar que la pregunta de titularidad muestra u oculta documentos obligatorios correctamente.',
    suggestedUser: null,
    negativeUser: null,
    route: '/recaudaciones/pagos_dobles/form',
    permissions: [],
    expected: 'Si no es titular se piden planilla y acreditacion; si es titular dejan de mostrarse o no bloquean el envio.',
    steps: [
      {
        id: 'PD-PUBLIC-03-01',
        text: 'Abrir el formulario publico de pagos dobles.',
        checkpoint: { type: 'route', path: '/recaudaciones/pagos_dobles/form' }
      },
      {
        id: 'PD-PUBLIC-03-02',
        text: 'Dejar "Sos titular del inmueble?" en No. Confirmar que aparecen DNI frente, DNI dorso, Comprobante de pago, Comprobante de pago duplicado, Planilla de autorizacion y Acreditacion de titularidad.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-03-03',
        text: 'Cargar archivos validos a DNI Frente, DNI Dorso, Comprobante de pago y Comprobante de pago duplicado, pero no cargar Planilla de autorizacion ni Acreditacion de titularidad. Confirmar que Enviar queda bloqueado y ambos documentos muestran requeridos al tocarlos.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-03-04',
        text: 'Cambiar "Sos titular del inmueble?" a Si. Confirmar que Planilla de autorizacion y Acreditacion de titularidad desaparecen o dejan de bloquear el formulario.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-03-05',
        text: 'Volver a No. Confirmar que los documentos condicionales vuelven a aparecer y vuelven a ser obligatorios.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'PD-PUBLIC-04',
    module: 'pagosDobles',
    modules: ['pagosDobles', 'public'],
    submodule: 'validacion-archivos',
    title: 'Validacion de archivos',
    goal: 'Validar documentos requeridos, formatos aceptados y limite de 15 MB.',
    suggestedUser: null,
    negativeUser: null,
    route: '/recaudaciones/pagos_dobles/form',
    permissions: [],
    expected: 'El formulario exige los archivos correctos, acepta PDF/imagenes, rechaza archivos mayores a 15 MB y permite enviar la solicitud cuando quedan todos validos.',
    steps: [
      {
        id: 'PD-PUBLIC-04-01',
        text: 'Abrir /recaudaciones/pagos_dobles/form y completar datos validos del solicitante.',
        checkpoint: { type: 'route', path: '/recaudaciones/pagos_dobles/form' }
      },
      {
        id: 'PD-PUBLIC-04-02',
        text: 'Con titularidad en No, tocar cada documento sin cargar archivo: DNI frente, DNI dorso, Comprobante de pago, Comprobante duplicado, Planilla de autorizacion y Acreditacion de titularidad. Confirmar "Debe seleccionar un archivo".',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-04-03',
        text: 'Cargar archivos validos menores a 15MB: Planilla de autorizacion; Acreditacion de titularidad.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-04-04',
        text: 'En al menos un documento intentar cargar un archivo mayor a 15MB. Confirmar mensaje "superando el limite de peso permitido" y que Enviar queda bloqueado.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-04-05',
        text: 'Reemplazar el archivo pesado por uno valido menor a 15MB. Confirmar que desaparece el error de peso.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-04-06',
        text: 'Con todos los archivos requeridos validos cargados, completar captcha y presionar Enviar.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PUBLIC-04-07',
        text: 'Confirmar popup de exito, registrar el numero de tramite R... y confirmar recepcion del mail automatico pagosDobles.solicitud_recibida en la casilla real de QA usada en el formulario.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'PD-READ-01',
    module: 'pagosDobles',
    submodule: 'bandeja',
    title: 'Bandeja operativa',
    goal: 'Validar listado, filtros, paginacion y apertura de detalle de pagos dobles.',
    suggestedUser: 'pagosDobles',
    negativeUser: 'habilitaciones',
    route: '/recaudaciones/pagos_dobles/solicitudes',
    permissions: ['pagosDobles.read'],
    expected: 'El rol operativo ve la bandeja, filtra por CUIT/estado, pagina resultados y abre detalles.',
    steps: [
      {
        id: 'PD-READ-01-01',
        text: 'Entrar con Pagos dobles.',
        checkpoint: { type: 'permissions', permissions: ['pagosDobles.read'] }
      },
      {
        id: 'PD-READ-01-02',
        text: 'Abrir solicitudes de pagos dobles.',
        checkpoint: { type: 'route', path: '/recaudaciones/pagos_dobles/solicitudes' }
      },
      {
        id: 'PD-READ-01-03',
        text: 'Buscar por CUIT usando 20123456783 o el CUIT del tramite de prueba. Confirmar que la tabla filtra sin romper paginacion.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-READ-01-04',
        text: 'Filtrar por estado En revision, Aprobada y Rechazada. Confirmar que los colores/estados coinciden con la columna Estado.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-READ-01-05',
        text: 'Usar el paginador si hay mas de 10 solicitudes y confirmar que el listado mantiene filtros activos.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-READ-01-06',
        text: 'Abrir el detalle de una solicitud desde el boton de la columna Detalles.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'PD-DETAIL-01',
    module: 'pagosDobles',
    submodule: 'detalle',
    title: 'Detalle de solicitud',
    goal: 'Validar que el detalle muestra datos, documentos, observaciones y acciones correctas.',
    suggestedUser: 'pagosDobles',
    negativeUser: 'habilitaciones',
    route: '/recaudaciones/pagos_dobles/solicitudes',
    permissions: ['pagosDobles.read', 'pagosDobles.update'],
    expected: 'El operador puede revisar datos/documentos y ve acciones solo si la solicitud esta En revision.',
    steps: [
      {
        id: 'PD-DETAIL-01-01',
        text: 'Entrar con Pagos dobles y abrir una solicitud En revision.',
        checkpoint: { type: 'permissions', permissions: ['pagosDobles.read', 'pagosDobles.update'] }
      },
      {
        id: 'PD-DETAIL-01-02',
        text: 'Confirmar que el detalle muestra numero R..., estado, nombre completo, DNI, CUIT, cuenta, domicilio, telefono y mail.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-DETAIL-01-03',
        text: 'Abrir la vista previa de cada documento presentado y confirmar que corresponde al nombre del documento.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-DETAIL-01-04',
        text: 'Presionar Ver observaciones. Confirmar que si no hay observaciones se muestra "No hay observaciones para mostrar".',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-DETAIL-01-05',
        text: 'Confirmar que Aprobar solicitud y Rechazar solicitud aparecen solo si el estado es En revision y el usuario tiene pagosDobles.update.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'PD-APPROVE-01',
    module: 'pagosDobles',
    submodule: 'aprobar',
    title: 'Aprobar solicitud',
    goal: 'Aprobar una solicitud en revision y confirmar estado, observaciones y mail automatico.',
    suggestedUser: 'pagosDobles',
    negativeUser: null,
    route: '/recaudaciones/pagos_dobles/solicitudes',
    permissions: ['pagosDobles.update'],
    expected: 'La solicitud pasa a Aprobada, registra observacion y envia mail pagosDobles.aprobada.',
    steps: [
      {
        id: 'PD-APPROVE-01-01',
        text: 'Entrar con Pagos dobles y abrir una solicitud con estado En revision.',
        checkpoint: { type: 'permissions', permissions: ['pagosDobles.update'] }
      },
      {
        id: 'PD-APPROVE-01-02',
        text: 'Presionar Aprobar solicitud. En el modal dejar "Aprobar sin comentario adicional" y confirmar que Aceptar esta habilitado.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-APPROVE-01-03',
        text: 'Cambiar a "Agregar comentario", dejar el comentario vacio y confirmar que Aceptar se deshabilita.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-APPROVE-01-04',
        text: 'Cargar comentario "Aprobado QA pagos dobles" y presionar Aceptar.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-APPROVE-01-05',
        text: 'Confirmar modal "Tramite aprobado", estado Aprobada y observacion con fecha/comentario.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-APPROVE-01-06',
        text: 'Confirmar recepcion del mail automatico pagosDobles.aprobada en el correo del solicitante.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'PD-REJECT-01',
    module: 'pagosDobles',
    submodule: 'rechazar',
    title: 'Rechazar solicitud',
    goal: 'Rechazar una solicitud en revision y validar motivos obligatorios, estado y mail automatico.',
    suggestedUser: 'pagosDobles',
    negativeUser: null,
    route: '/recaudaciones/pagos_dobles/solicitudes',
    permissions: ['pagosDobles.update'],
    expected: 'La solicitud pasa a Rechazada, guarda motivo y envia mail pagosDobles.rechazada.',
    steps: [
      {
        id: 'PD-REJECT-01-01',
        text: 'Entrar con Pagos dobles y abrir una solicitud con estado En revision distinta a la usada para aprobar.',
        checkpoint: { type: 'permissions', permissions: ['pagosDobles.update'] }
      },
      {
        id: 'PD-REJECT-01-02',
        text: 'Presionar Rechazar solicitud. Confirmar que Enviar esta deshabilitado si no se selecciona motivo.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-REJECT-01-03',
        text: 'Seleccionar motivo "Otro" y dejar el textarea vacio. Confirmar que Enviar sigue deshabilitado.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-REJECT-01-04',
        text: 'Cargar motivo Otro = "Comprobantes no verificables QA" y presionar Enviar.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-REJECT-01-05',
        text: 'Confirmar estado Rechazada y observacion "Solicitud rechazada: Comprobantes no verificables QA".',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-REJECT-01-06',
        text: 'Confirmar recepcion del mail automatico pagosDobles.rechazada en el correo del solicitante.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'PD-PERM-01',
    module: 'pagosDobles',
    modules: ['pagosDobles', 'security'],
    submodule: 'read-sin-update',
    title: 'Lectura sin update',
    goal: 'Validar que lectura no alcanza para aprobar o rechazar solicitudes.',
    suggestedUser: 'pagosDobles',
    negativeUser: null,
    route: '/recaudaciones/pagos_dobles/solicitudes',
    permissions: ['pagosDobles.read'],
    expected: 'Un usuario sin pagosDobles.update puede ver, pero no cambiar estados.',
    steps: [
      {
        id: 'PD-PERM-01-01',
        text: 'Preparar o asignar un usuario QA con pagosDobles.read pero sin pagosDobles.update.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PERM-01-02',
        text: 'Entrar con ese usuario y abrir /recaudaciones/pagos_dobles/solicitudes.',
        checkpoint: { type: 'route', path: '/recaudaciones/pagos_dobles/solicitudes' }
      },
      {
        id: 'PD-PERM-01-03',
        text: 'Abrir una solicitud En revision. Confirmar que no aparecen Aprobar solicitud ni Rechazar solicitud.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-PERM-01-04',
        text: 'Desde la consola del navegador en el detalle, pegar: await $nuxt.$axios.$put(`/pagosDobles/${$nuxt.$route.params.id}`, { pago: { status: "Aprobada", observaciones: "QA intento sin pagosDobles.update" } }).then(() => "BUG: update permitida sin pagosDobles.update").catch(e => ({ status: e.response && e.response.status, message: e.response && e.response.data && e.response.data.message })); Confirmar status 403.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'PD-EXPORT-01',
    module: 'pagosDobles',
    submodule: 'export',
    title: 'Pagos dobles exportacion no disponible',
    goal: 'Confirmar el estado actual de la exportacion de pagos dobles: el permiso existe, pero la bandeja no expone una accion de exportacion masiva.',
    suggestedUser: 'pagosDoblesJefe',
    negativeUser: 'pagosDobles',
    route: '/recaudaciones/pagos_dobles/solicitudes',
    permissions: ['pagosDobles.export'],
    expected: 'Aunque el usuario tenga pagosDobles.export, la bandeja no muestra exportacion masiva. Si producto espera exportar desde esta pantalla, registrar faltante funcional.',
    steps: [
      {
        id: 'PD-EXPORT-01-01',
        text: 'Entrar con Pagos dobles jefe o usuario con permisos completos, incluyendo pagosDobles.export.',
        checkpoint: { type: 'permissions', permissions: ['pagosDobles.export'] }
      },
      {
        id: 'PD-EXPORT-01-02',
        text: 'Abrir el listado de solicitudes.',
        checkpoint: { type: 'route', path: '/recaudaciones/pagos_dobles/solicitudes' }
      },
      {
        id: 'PD-EXPORT-01-03',
        text: 'Aplicar filtros por CUIT y estado. Confirmar que no aparece boton, menu ni accion de exportacion masiva en la bandeja, aun teniendo pagosDobles.export.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-EXPORT-01-04',
        text: 'Entrar con rol Pagos dobles operativo sin pagosDobles.export y confirmar que la pantalla se ve igual respecto de exportacion: tampoco aparece ninguna accion.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'PD-SEC-01',
    module: 'pagosDobles',
    modules: ['pagosDobles', 'security'],
    submodule: 'backend-403',
    title: 'Seguridad backend pagos dobles',
    goal: 'Confirmar que el backend bloquea acciones sensibles aunque se fuerce la request.',
    suggestedUser: 'pagosDobles',
    negativeUser: null,
    route: '/recaudaciones/pagos_dobles/solicitudes',
    permissions: ['pagosDobles.read'],
    expected: 'Requests de update/export sin permiso devuelven 403 y no cambian estado ni entregan datos.',
    steps: [
      {
        id: 'PD-SEC-01-01',
        text: 'Entrar con un usuario que tenga pagosDobles.read pero no pagosDobles.update ni pagosDobles.export.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-SEC-01-02',
        text: 'Desde la consola del navegador en el detalle, pegar: await $nuxt.$axios.$put(`/pagosDobles/${$nuxt.$route.params.id}`, { pago: { status: "Aprobada", observaciones: "QA intento backend sin update" } }).then(() => "BUG: update permitida sin pagosDobles.update").catch(e => ({ status: e.response && e.response.status, message: e.response && e.response.data && e.response.data.message }));',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-SEC-01-03',
        text: 'Confirmar respuesta 403 y que al refrescar el detalle la solicitud conserva su estado original.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-SEC-01-04',
        text: 'Desde la consola del navegador en el detalle, pegar: await $nuxt.$axios.$get(`/pagosDobles/descargar/${$nuxt.$route.params.id}`, { responseType: "blob" }).then(() => "BUG: descarga permitida sin pagosDobles.export").catch(e => ({ status: e.response && e.response.status, message: e.response && e.response.data && e.response.data.message })); Confirmar status 403 o bloqueo equivalente.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'PD-MAIL-01',
    module: 'pagosDobles',
    modules: ['pagosDobles', 'public'],
    submodule: 'mails',
    title: 'Mails automaticos pagos dobles',
    goal: 'Confirmar los mails del circuito base de pagos dobles: recibida, aprobada y rechazada.',
    suggestedUser: 'pagosDobles',
    negativeUser: null,
    route: '/recaudaciones/pagos_dobles/solicitudes',
    permissions: ['pagosDobles.update'],
    expected: 'Cada rama envia el template correcto al destinatario del solicitante.',
    steps: [
      {
        id: 'PD-MAIL-01-01',
        text: 'Crear una solicitud publica usando una casilla real de QA accesible por el tester y confirmar mail pagosDobles.solicitud_recibida con numero R...',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-MAIL-01-02',
        text: 'Aprobar una solicitud cargada con una casilla real de QA accesible por el tester y confirmar mail pagosDobles.aprobada con numero de tramite y fecha.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-MAIL-01-03',
        text: 'Rechazar una solicitud cargada con una casilla real de QA accesible por el tester usando motivo "Los documentos no son legibles" y confirmar mail pagosDobles.rechazada con el motivo.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'PD-MAIL-01-04',
        text: 'Guardar evidencia de asunto, destinatario, template/contenido y horario aproximado de cada mail.',
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
    id: 'AA-PUBLIC-01',
    module: 'abiertoAnual',
    modules: ['abiertoAnual', 'public'],
    submodule: 'publico-home',
    title: 'Home publica e inicio del tramite',
    goal: 'Validar que la pagina publica de Abierto Anual informa el beneficio y solo deja iniciar la carga despues de aceptar la advertencia.',
    suggestedUser: null,
    negativeUser: null,
    route: '/comercio/abierto_anual',
    permissions: [],
    expected: 'La informacion publica carga sin login, los acordeones se abren, el boton Iniciar Tramite muestra la advertencia y solo permite continuar cuando se marca el check.',
    steps: [
      {
        id: 'AA-PUBLIC-01-01',
        text: 'Cerrar sesion o usar una ventana sin usuario municipal.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-01-02',
        text: 'Abrir /comercio/abierto_anual.',
        checkpoint: { type: 'route', path: '/comercio/abierto_anual' }
      },
      {
        id: 'AA-PUBLIC-01-03',
        text: 'Confirmar que se ve el banner "Comercio Abierto Anual", el carrousel de periodos/requisitos y las secciones desplegables del beneficio.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-01-04',
        text: 'Abrir al menos dos secciones: "Que requisitos se necesitan..." y "Que documentacion se necesita...". Confirmar que se despliegan sin romper el layout y que mencionan los periodos Mayo, Agosto, Octubre y rectificacion de Noviembre.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-01-05',
        text: 'Presionar Iniciar Tramite. Confirmar que aparece el popup IMPORTANTE y que el boton Aceptar esta deshabilitado mientras no se marque "Ya tengo todos los documentos digitalizados...".',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-01-06',
        text: 'Marcar el check del popup y presionar Aceptar. Confirmar que navega a /comercio/abierto_anual/form.',
        checkpoint: { type: 'route', path: '/comercio/abierto_anual/form' }
      }
    ]
  },
  {
    id: 'AA-PUBLIC-02',
    module: 'abiertoAnual',
    modules: ['abiertoAnual', 'public'],
    submodule: 'publico-validacion-datos',
    title: 'Validaciones CUIT y legajo',
    goal: 'Validar los controles basicos del formulario publico antes de buscar el comercio en el maestro.',
    suggestedUser: null,
    negativeUser: null,
    route: '/comercio/abierto_anual/form',
    permissions: [],
    expected: 'El formulario no permite avanzar con CUIT incompleto, CUIT no numerico o legajo vacio/no numerico; solo acepta datos numericos con longitud valida.',
    steps: [
      {
        id: 'AA-PUBLIC-02-01',
        text: 'Abrir /comercio/abierto_anual/form sin login municipal.',
        checkpoint: { type: 'route', path: '/comercio/abierto_anual/form' }
      },
      {
        id: 'AA-PUBLIC-02-02',
        text: 'Sin cargar ningun dato, presionar Aceptar. Confirmar que aparece validacion de CUIT/CUIM y legajo requeridos o popup de datos no validos.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-02-03',
        text: 'En CUIT/CUIM cargar 123 y en legajo cargar 100. Presionar Aceptar. Confirmar que el CUIT queda invalido porque no tiene 11 digitos.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-02-04',
        text: 'En CUIT/CUIM cargar 20123456789 y en legajo escribir ABC-000123. Confirmar que el campo visible de legajo elimina letras y guiones, y que internamente queda 123.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-02-05',
        text: 'Presionar el icono de ayuda junto a N de legajo comercial. Confirmar que abre el modal de informacion adicional con imagen de ejemplo de cedula/notificacion y boton de cierre.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'AA-PUBLIC-03',
    module: 'abiertoAnual',
    modules: ['abiertoAnual', 'public'],
    submodule: 'publico-comercio-no-encontrado',
    title: 'Comercio no encontrado',
    goal: 'Validar la rama donde el CUIT y legajo no existen en el maestro comercial.',
    suggestedUser: null,
    negativeUser: null,
    route: '/comercio/abierto_anual/form',
    permissions: [],
    expected: 'Con datos numericos inexistentes, el sistema no crea tramite y muestra el popup "No hemos podido encontrar tu comercio".',
    steps: [
      {
        id: 'AA-PUBLIC-03-01',
        text: 'Abrir /comercio/abierto_anual/form sin login municipal.',
        checkpoint: { type: 'route', path: '/comercio/abierto_anual/form' }
      },
      {
        id: 'AA-PUBLIC-03-02',
        text: 'Cargar CUIT/CUIM = 20999999999 y Legajo comercial = 999999. Usar datos que QA sepa que no existen en maestro comercial.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-03-03',
        text: 'Presionar Aceptar. Confirmar que aparece el popup "No hemos podido encontrar tu comercio" y que no navega a periodos.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-03-04',
        text: 'Cerrar el popup con Aceptar. Confirmar que los campos siguen editables para corregir datos.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'AA-PUBLIC-04',
    module: 'abiertoAnual',
    modules: ['abiertoAnual', 'public'],
    submodule: 'publico-ingreso-valido',
    title: 'Ingreso valido a periodos',
    goal: 'Validar que un comercio existente puede crear o recuperar su registro de Abierto Anual y acceder a la pantalla de carga por periodos.',
    suggestedUser: null,
    negativeUser: null,
    route: '/comercio/abierto_anual/form',
    permissions: [],
    expected: 'Con CUIT y legajo existentes, el ciudadano llega a /comercio/abierto_anual/periodos y ve las tarjetas de Periodo 1, Periodo 2 y Periodo 3.',
    steps: [
      {
        id: 'AA-PUBLIC-04-01',
        text: 'Preparar un CUIT/CUIM y N de legajo existentes en maestro comercial. Si QA no tiene uno, pedirlo al area o crearlo en maestro comercial antes de ejecutar el caso.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-04-02',
        text: 'Abrir /comercio/abierto_anual/form sin login municipal.',
        checkpoint: { type: 'route', path: '/comercio/abierto_anual/form' }
      },
      {
        id: 'AA-PUBLIC-04-03',
        text: 'Cargar el CUIT/CUIM real sin guiones y el legajo comercial real. Presionar Aceptar.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-04-04',
        text: 'Confirmar que navega a /comercio/abierto_anual/periodos.',
        checkpoint: { type: 'route', path: '/comercio/abierto_anual/periodos' }
      },
      {
        id: 'AA-PUBLIC-04-05',
        text: 'Confirmar que se muestran CUIT y Legajo comercial cargados, mensaje de DFE o aviso de falta de DFE, y tres tarjetas: Periodo 1 Mayo, Periodo 2 Agosto y Periodo 3 Octubre.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-04-06',
        text: 'Volver a /comercio/abierto_anual/form, cargar los mismos datos y aceptar otra vez. Confirmar que recupera el mismo registro en lugar de crear un duplicado visible para el ciudadano.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'AA-PUBLIC-05',
    module: 'abiertoAnual',
    modules: ['abiertoAnual', 'public'],
    submodule: 'publico-estados-periodo',
    title: 'Estados visibles por periodo',
    goal: 'Validar que el ciudadano entiende cada estado de las tarjetas de periodo y que los textos coinciden con el comportamiento esperado.',
    suggestedUser: null,
    negativeUser: null,
    route: '/comercio/abierto_anual/periodos',
    permissions: [],
    expected: 'Cada estado muestra texto claro: Incompleto antes de ventana, vencido, habilitado para subir, En revision, Correcto, Incorrecto y Rectificacion cuando corresponde.',
    steps: [
      {
        id: 'AA-PUBLIC-05-01',
        text: 'Entrar a /comercio/abierto_anual/periodos con un comercio valido, como en AA-PUBLIC-04.',
        checkpoint: { type: 'route', path: '/comercio/abierto_anual/periodos' }
      },
      {
        id: 'AA-PUBLIC-05-02',
        text: 'Revisar las tres tarjetas. Para cada periodo registrar en notas el texto de estado que se ve: todavia no habilitada, cargada con exito/en revision, correcta, incorrecta, vencida, habilitada para subir o rectificacion.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-05-03',
        text: 'Si una tarjeta esta "En revision", confirmar que explica que ARVIGE verificara la factura y que si hay errores se notificara por DFE o debera revisarse esta misma pagina.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-05-04',
        text: 'Si una tarjeta esta "Correcto", confirmar que dice que la factura cargada es correcta y muestra fecha de carga.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-05-05',
        text: 'Si una tarjeta esta "Incorrecto", confirmar que muestra el motivo de rechazo y avisa que en Noviembre se puede rectificar.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-05-06',
        text: 'Si las tres tarjetas estan en Correcto, confirmar que desaparece la carga y aparece el mensaje "Las facturas se recibieron correctamente" con la lista de controles que revisara ARVIGE.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'AA-PUBLIC-06',
    module: 'abiertoAnual',
    modules: ['abiertoAnual', 'public'],
    submodule: 'publico-carga-factura',
    title: 'Carga publica de factura',
    goal: 'Validar la carga de una factura en un periodo habilitado o en rectificacion.',
    suggestedUser: null,
    negativeUser: null,
    route: '/comercio/abierto_anual/periodos',
    permissions: [],
    expected: 'Cuando el periodo esta habilitado, se puede seleccionar PDF/imagen, completar captcha, enviar y el periodo queda En revision.',
    steps: [
      {
        id: 'AA-PUBLIC-06-01',
        text: 'Preparar un archivo PDF o imagen legible menor a 15MB para usar como factura de prueba. No usar datos sensibles reales salvo que QA tenga autorizacion.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-06-02',
        text: 'Ingresar con un comercio valido y llegar a /comercio/abierto_anual/periodos.',
        checkpoint: { type: 'route', path: '/comercio/abierto_anual/periodos' }
      },
      {
        id: 'AA-PUBLIC-06-03',
        text: 'Buscar un periodo que muestre boton Enviar o Rectificar. Si ninguno esta habilitado, usar DevTools > Abierto anual o /admin/abierto-anual con abiertoAnual.admin para abrir una ventana que incluya la fecha actual y volver a este paso.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-06-04',
        text: 'Presionar Enviar o Rectificar sin seleccionar archivo. Confirmar que aparece la validacion "Debe seleccionar un archivo valido" y no abre el captcha.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-06-05',
        text: 'Seleccionar el PDF o imagen de prueba. Presionar Enviar o Rectificar. Confirmar que se abre el modal "Completa para continuar" con captcha.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-06-06',
        text: 'Intentar continuar sin completar captcha. Confirmar que el boton de envio del modal esta deshabilitado o muestra validacion.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-06-07',
        text: 'Completar captcha y enviar. Esperar la animacion de carga sin cerrar la pagina.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-06-08',
        text: 'Confirmar que la tarjeta queda en "La documentacion ha subido con exito" / En revision y que al reingresar con el mismo CUIT y legajo el estado se mantiene.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'AA-PUBLIC-07',
    module: 'abiertoAnual',
    modules: ['abiertoAnual', 'public'],
    submodule: 'publico-periodo-cerrado',
    title: 'Sitio publico cerrado',
    goal: 'Validar el comportamiento cuando la configuracion publica indica que el plazo de Abierto Anual esta cerrado.',
    suggestedUser: 'abiertoAnualJefe',
    negativeUser: null,
    route: '/comercio/abierto_anual',
    permissions: ['abiertoAnual.admin'],
    expected: 'Si popUpAbiertoAnualCerrado esta activo, la home y el formulario muestran el popup de plazo expirado y no confunden al ciudadano.',
    steps: [
      {
        id: 'AA-PUBLIC-07-01',
        text: 'Entrar con Abierto anual jefe o admin. Desde DevTools > Configuracion del sistema, activar temporalmente la opcion de sitio cerrado de Abierto Anual si existe en esa consola. Si la opcion no esta expuesta, marcar este paso bloqueado e indicar "flag no administrable desde UI".',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-07-02',
        text: 'Cerrar sesion o abrir una ventana sin login y entrar a /comercio/abierto_anual.',
        checkpoint: { type: 'route', path: '/comercio/abierto_anual' }
      },
      {
        id: 'AA-PUBLIC-07-03',
        text: 'Confirmar que aparece el popup IMPORTANTE con el texto de plazo expirado y contacto de ARVIGE.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PUBLIC-07-04',
        text: 'Entrar a /comercio/abierto_anual/form y confirmar que el popup cerrado tambien aparece en el formulario.',
        checkpoint: { type: 'route', path: '/comercio/abierto_anual/form' }
      },
      {
        id: 'AA-PUBLIC-07-05',
        text: 'Restaurar la configuracion original del sitio cerrado para no afectar otras pruebas.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'AA-READ-01',
    module: 'abiertoAnual',
    submodule: 'backoffice-listado',
    title: 'Listado interno y filtros',
    goal: 'Validar que un usuario con abiertoAnual.read puede ver registros, filtrar por CUIT y filtrar por estado de cada periodo.',
    suggestedUser: 'abiertoAnualLectura',
    negativeUser: 'noPermissions',
    route: '/comercio/abierto_anual/registros',
    permissions: ['abiertoAnual.read'],
    expected: 'El listado carga, los filtros reducen resultados correctamente y el usuario puede entrar al detalle sin ver acciones de gestion.',
    steps: [
      {
        id: 'AA-READ-01-01',
        text: 'Entrar con un usuario que tenga abiertoAnual.read y no tenga abiertoAnual.update ni abiertoAnual.export.',
        checkpoint: { type: 'permissions', permissions: ['abiertoAnual.read'] }
      },
      {
        id: 'AA-READ-01-02',
        text: 'Abrir /comercio/abierto_anual/registros.',
        checkpoint: { type: 'route', path: '/comercio/abierto_anual/registros' }
      },
      {
        id: 'AA-READ-01-03',
        text: 'Confirmar que el listado muestra columnas CUIT, Legajo comercial, Facturas enviadas y Detalles. Si no hay registros, crear uno desde el flujo publico antes de continuar.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-READ-01-04',
        text: 'Buscar por un CUIT parcial que exista. Confirmar que la tabla queda solo con registros cuyo CUIT contiene ese valor. Borrar el filtro y confirmar que vuelve el listado completo.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-READ-01-05',
        text: 'Probar filtros de Periodo 1, Periodo 2 y Periodo 3 con los estados Incompleto, En revision, Incorrecto y Correcto. Confirmar que cada filtro solo muestra registros con ese estado en el periodo elegido.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-READ-01-06',
        text: 'Confirmar que no aparece el boton Exportar CSV porque el usuario no tiene abiertoAnual.export.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-READ-01-07',
        text: 'Abrir el detalle de un registro. Confirmar que se ven las tres tarjetas de periodo, pero no aparecen botones Aprobar, Rechazar ni lapiz de rectificacion manual.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'AA-EXPORT-01',
    module: 'abiertoAnual',
    submodule: 'backoffice-export',
    title: 'Exportacion CSV',
    goal: 'Validar que la exportacion CSV aparece solo con abiertoAnual.export y descarga los campos esperados.',
    suggestedUser: 'abiertoAnualExportador',
    negativeUser: 'abiertoAnualLectura',
    route: '/comercio/abierto_anual/registros',
    permissions: ['abiertoAnual.read', 'abiertoAnual.export'],
    expected: 'El usuario exportador ve Exportar CSV y descarga comercio_abierto_anual.csv con CUIT, legajo, status y observaciones por periodo.',
    steps: [
      {
        id: 'AA-EXPORT-01-01',
        text: 'Entrar con un usuario que tenga abiertoAnual.read y abiertoAnual.export.',
        checkpoint: { type: 'permissions', permissions: ['abiertoAnual.export'] }
      },
      {
        id: 'AA-EXPORT-01-02',
        text: 'Abrir /comercio/abierto_anual/registros.',
        checkpoint: { type: 'route', path: '/comercio/abierto_anual/registros' }
      },
      {
        id: 'AA-EXPORT-01-03',
        text: 'Confirmar que aparece el boton Exportar CSV.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-EXPORT-01-04',
        text: 'Presionar Exportar CSV. Confirmar que descarga comercio_abierto_anual.csv.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-EXPORT-01-05',
        text: 'Abrir el CSV descargado y confirmar encabezados: CUIT; Legajo comercial; Status1; Observaciones1; Status2; Observaciones2; Status3; Observaciones3.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-EXPORT-01-06',
        text: 'Entrar con un usuario de solo lectura y confirmar que el boton Exportar CSV no aparece.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'AA-REVIEW-01',
    module: 'abiertoAnual',
    submodule: 'backoffice-aprobar',
    title: 'Aprobar factura',
    goal: 'Validar que el operador puede marcar una factura En revision como Correcto.',
    suggestedUser: 'abiertoAnualOperador',
    negativeUser: 'abiertoAnualLectura',
    route: '/comercio/abierto_anual/registros',
    permissions: ['abiertoAnual.read', 'abiertoAnual.update'],
    expected: 'Una factura En revision puede aprobarse, queda Correcto y el ciudadano ve el periodo como correcto al reingresar.',
    steps: [
      {
        id: 'AA-REVIEW-01-01',
        text: 'Preparar un registro con al menos un periodo en estado En revision. Si no existe, ejecutar AA-PUBLIC-06 para subir una factura de prueba.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-REVIEW-01-02',
        text: 'Entrar con un usuario que tenga abiertoAnual.read y abiertoAnual.update.',
        checkpoint: { type: 'permissions', permissions: ['abiertoAnual.update'] }
      },
      {
        id: 'AA-REVIEW-01-03',
        text: 'Abrir /comercio/abierto_anual/registros y entrar al detalle del registro preparado.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-REVIEW-01-04',
        text: 'En la tarjeta del periodo En revision, presionar el boton de vista previa y confirmar que la factura se puede abrir o que se informa claramente si el archivo no existe en S3.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-REVIEW-01-05',
        text: 'Presionar Aprobar. Confirmar que aparece la pantalla de confirmacion "Estas por indicar que la factura es correcta".',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-REVIEW-01-06',
        text: 'Presionar Aceptar. Confirmar que la tarjeta cambia a Estado: Correcto.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-REVIEW-01-07',
        text: 'Reingresar como ciudadano con el mismo CUIT y legajo. Confirmar que ese periodo dice que la factura cargada es correcta y muestra fecha de carga.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'AA-REJECT-01',
    module: 'abiertoAnual',
    submodule: 'backoffice-rechazar',
    title: 'Rechazar factura con motivo',
    goal: 'Validar que el operador puede marcar una factura En revision como Incorrecto con un motivo visible para el ciudadano.',
    suggestedUser: 'abiertoAnualOperador',
    negativeUser: 'abiertoAnualLectura',
    route: '/comercio/abierto_anual/registros',
    permissions: ['abiertoAnual.read', 'abiertoAnual.update'],
    expected: 'Una factura En revision puede rechazarse con motivo, queda Incorrecto y el ciudadano ve el motivo al reingresar.',
    steps: [
      {
        id: 'AA-REJECT-01-01',
        text: 'Preparar un registro con al menos un periodo en estado En revision. Si no existe, ejecutar AA-PUBLIC-06 para subir una factura de prueba.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-REJECT-01-02',
        text: 'Entrar con Abierto anual operador.',
        checkpoint: { type: 'permissions', permissions: ['abiertoAnual.update'] }
      },
      {
        id: 'AA-REJECT-01-03',
        text: 'Abrir el detalle del registro preparado desde /comercio/abierto_anual/registros.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-REJECT-01-04',
        text: 'En una tarjeta En revision, presionar Rechazar. Confirmar que aparece la lista de motivos de rechazo.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-REJECT-01-05',
        text: 'Sin elegir motivo, confirmar que Aceptar esta deshabilitado.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-REJECT-01-06',
        text: 'Presionar "Ver mas" y confirmar que se muestran mas motivos. Elegir "La factura no corresponde al periodo solicitado.".',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-REJECT-01-07',
        text: 'Presionar Aceptar. En la pantalla de confirmacion, confirmar que el motivo seleccionado aparece en el texto.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-REJECT-01-08',
        text: 'Presionar Aceptar nuevamente. Confirmar que la tarjeta queda Estado: Incorrecto y muestra el motivo.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-REJECT-01-09',
        text: 'Reingresar como ciudadano con el mismo CUIT y legajo. Confirmar que el periodo muestra Incorrecto y el motivo "La factura no corresponde al periodo solicitado.".',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'AA-RECT-01',
    module: 'abiertoAnual',
    submodule: 'backoffice-rectificacion',
    title: 'Rectificacion manual',
    goal: 'Validar que el operador puede habilitar rectificacion manual en un periodo Correcto, Incorrecto o vencido.',
    suggestedUser: 'abiertoAnualOperador',
    negativeUser: 'abiertoAnualLectura',
    route: '/comercio/abierto_anual/registros',
    permissions: ['abiertoAnual.read', 'abiertoAnual.update'],
    expected: 'El lapiz de rectificacion pide confirmacion, marca el periodo como rectificable y el ciudadano puede volver a cargar archivo.',
    steps: [
      {
        id: 'AA-RECT-01-01',
        text: 'Preparar un registro con un periodo en Correcto, Incorrecto o Incompleto vencido. Registrar CUIT, legajo y periodo en notas.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-RECT-01-02',
        text: 'Entrar con Abierto anual operador y abrir el detalle del registro.',
        checkpoint: { type: 'permissions', permissions: ['abiertoAnual.update'] }
      },
      {
        id: 'AA-RECT-01-03',
        text: 'En la tarjeta del periodo preparado, presionar el icono de lapiz. Confirmar que aparece la pantalla "Estas a punto de dar una rectificacion manual".',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-RECT-01-04',
        text: 'Presionar Cancelar. Confirmar que la tarjeta vuelve al estado anterior y no se habilita rectificacion.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-RECT-01-05',
        text: 'Volver a presionar el lapiz y esta vez presionar Aceptar. Confirmar que la tarjeta queda en modo Rectificacion o que el estado permite una nueva carga.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-RECT-01-06',
        text: 'Reingresar como ciudadano con el mismo CUIT y legajo. Confirmar que ese periodo muestra boton Rectificar y permite seleccionar archivo.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'AA-ADMIN-01',
    module: 'abiertoAnual',
    submodule: 'admin-periodos',
    title: 'Administrar periodos y rectificacion',
    goal: 'Validar que abiertoAnual.admin puede cambiar ventanas de carga y rectificacion global desde la pantalla de administracion.',
    suggestedUser: 'abiertoAnualJefe',
    negativeUser: 'abiertoAnualOperador',
    route: '/admin/abierto-anual',
    permissions: ['abiertoAnual.admin'],
    expected: 'El admin carga configuracion, detecta cambios, confirma guardado, persiste ventanas y rectificacion global; un operador sin admin no accede.',
    steps: [
      {
        id: 'AA-ADMIN-01-01',
        text: 'Entrar con Abierto anual jefe o usuario con abiertoAnual.admin.',
        checkpoint: { type: 'permissions', permissions: ['abiertoAnual.admin'] }
      },
      {
        id: 'AA-ADMIN-01-02',
        text: 'Abrir /admin/abierto-anual.',
        checkpoint: { type: 'route', path: '/admin/abierto-anual' }
      },
      {
        id: 'AA-ADMIN-01-03',
        text: 'Anotar en notas las fechas actuales de Periodo 1, Periodo 2, Periodo 3 y el estado de Rectificacion global para poder restaurarlas al final.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-ADMIN-01-04',
        text: 'Cambiar temporalmente Periodo 1 para que incluya la fecha actual: Inicio = fecha de ayer, Final = fecha de manana. Confirmar que Guardar cambios se habilita.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-ADMIN-01-05',
        text: 'Presionar Deshacer. Confirmar que las fechas vuelven a los valores originales y Guardar cambios queda deshabilitado.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-ADMIN-01-06',
        text: 'Repetir el cambio temporal y activar/desactivar Rectificacion global. Presionar Guardar cambios, confirmar el modal y verificar toast de exito.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-ADMIN-01-07',
        text: 'Presionar Actualizar o recargar la pagina. Confirmar que los cambios guardados persisten.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-ADMIN-01-08',
        text: 'Restaurar las fechas y rectificacion global originales anotadas en el paso 3. Guardar y confirmar que la configuracion vuelve a quedar como estaba.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-ADMIN-01-09',
        text: 'Entrar con Abierto anual operador, que tiene update pero no admin, e intentar abrir /admin/abierto-anual. Confirmar que no accede o es redirigido.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'AA-DEVTOOLS-01',
    module: 'abiertoAnual',
    submodule: 'devtools-periodos',
    title: 'DevTools Abierto anual',
    goal: 'Validar que la consola de DevTools permite administrar periodos y rectificacion con el mismo permiso abiertoAnual.admin.',
    suggestedUser: 'abiertoAnualJefe',
    negativeUser: 'abiertoAnualOperador',
    route: '/',
    permissions: ['abiertoAnual.admin'],
    expected: 'DevTools muestra la herramienta Abierto anual, permite editar ventanas y rectificacion, y bloquea usuarios sin abiertoAnual.admin.',
    steps: [
      {
        id: 'AA-DEVTOOLS-01-01',
        text: 'Entrar con Abierto anual jefe.',
        checkpoint: { type: 'permissions', permissions: ['abiertoAnual.admin'] }
      },
      {
        id: 'AA-DEVTOOLS-01-02',
        text: 'Abrir el dock DevTools y seleccionar la herramienta Abierto anual.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-DEVTOOLS-01-03',
        text: 'Confirmar que se ven Ventanas de carga, Ano actual, Periodo 1/2/3, Rectificacion global, Deshacer y Guardar configuracion.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-DEVTOOLS-01-04',
        text: 'Cambiar temporalmente una fecha y confirmar que Guardar configuracion se habilita. Presionar Deshacer y confirmar que vuelve al valor anterior.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-DEVTOOLS-01-05',
        text: 'Entrar con Abierto anual operador sin abiertoAnual.admin, abrir DevTools > Abierto anual y confirmar que aparece alerta de permiso o que no permite modificar la configuracion.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'AA-PERM-01',
    module: 'abiertoAnual',
    modules: ['abiertoAnual', 'security'],
    submodule: 'permisos-ui',
    title: 'Permisos UI Abierto Anual',
    goal: 'Validar diferencias visibles entre lectura, operador, exportador y admin.',
    suggestedUser: 'abiertoAnualLectura',
    negativeUser: 'noPermissions',
    route: '/comercio/abierto_anual/registros',
    permissions: ['abiertoAnual.read'],
    expected: 'Cada rol ve solo acciones acordes a sus permisos: lectura, update, export y admin.',
    steps: [
      {
        id: 'AA-PERM-01-01',
        text: 'Entrar con Abierto anual lectura. Confirmar que solo tiene abiertoAnual.read.',
        checkpoint: { type: 'permissions', permissions: ['abiertoAnual.read'] }
      },
      {
        id: 'AA-PERM-01-02',
        text: 'Abrir /comercio/abierto_anual/registros. Confirmar que puede ver listado y detalle, pero no ve Exportar CSV ni acciones Aprobar/Rechazar/Rectificar.',
        checkpoint: { type: 'route', path: '/comercio/abierto_anual/registros' }
      },
      {
        id: 'AA-PERM-01-03',
        text: 'Entrar con Abierto anual operador. Confirmar que ve acciones Aprobar/Rechazar/Rectificar en detalle cuando el estado del periodo lo permite, pero no ve Exportar CSV ni accede a /admin/abierto-anual.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PERM-01-04',
        text: 'Entrar con Abierto anual exportador. Confirmar que ve Exportar CSV, puede abrir detalle, pero no ve Aprobar/Rechazar/Rectificar ni accede a /admin/abierto-anual.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PERM-01-05',
        text: 'Entrar con Abierto anual jefe. Confirmar que ve listado, Exportar CSV, acciones de detalle y administracion de periodos.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-PERM-01-06',
        text: 'Entrar con usuario sin permisos. Intentar abrir /comercio/abierto_anual/registros y confirmar que no ve contenido interno o no puede operar.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'AA-SEC-01',
    module: 'abiertoAnual',
    modules: ['abiertoAnual', 'security'],
    submodule: 'backend-403',
    title: 'Seguridad backend Abierto Anual',
    goal: 'Confirmar que el backend bloquea lectura interna, actualizacion y configuracion aunque se fuerce la request desde consola.',
    suggestedUser: 'abiertoAnualLectura',
    negativeUser: null,
    route: '/comercio/abierto_anual/registros',
    permissions: ['abiertoAnual.read'],
    expected: 'Requests sensibles sin permiso devuelven 403 y no modifican registros ni configuracion.',
    steps: [
      {
        id: 'AA-SEC-01-01',
        text: 'Entrar con un usuario que tenga abiertoAnual.read pero no abiertoAnual.update, abiertoAnual.export ni abiertoAnual.admin.',
        checkpoint: { type: 'permissions', permissions: ['abiertoAnual.read'] }
      },
      {
        id: 'AA-SEC-01-02',
        text: 'Abrir el detalle de un registro de Abierto Anual. Registrar el ID desde la URL o dejar que el comando use $nuxt.$route.params.id.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-SEC-01-03',
        text: 'Desde la consola del navegador en el detalle, pegar: await $nuxt.$axios.$put(`/abiertoAnual/${$nuxt.$route.params.id}`, { tramite: { status: ["Correcto", "Incompleto", "Incompleto"] } }).then(() => "BUG: update permitida sin abiertoAnual.update").catch(e => ({ status: e.response && e.response.status, message: e.response && e.response.data && e.response.data.message })); Confirmar status 403.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-SEC-01-04',
        text: 'Refrescar el detalle y confirmar que el estado de los periodos no cambio por el intento forzado.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-SEC-01-05',
        text: 'Desde la consola, pegar: await $nuxt.$axios.$put("/config/abiertoAnualPeriodos", { periodos: [{ min: "01/05", max: "31/05" }, { min: "01/08", max: "31/08" }, { min: "01/10", max: "31/10" }], rectificacion: { min: "01/11", max: "30/11" }, rectificacionGlobal: false }).then(() => "BUG: config permitida sin abiertoAnual.admin").catch(e => ({ status: e.response && e.response.status, message: e.response && e.response.data && e.response.data.message })); Confirmar status 403.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-SEC-01-06',
        text: 'Entrar con usuario sin permisos y pegar: await $nuxt.$axios.$get("/abiertoAnual").then(() => "BUG: lectura permitida sin abiertoAnual.read").catch(e => ({ status: e.response && e.response.status, message: e.response && e.response.data && e.response.data.message })); Confirmar status 403.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-SEC-01-07',
        text: 'Aclaracion de alcance: /abiertoAnual/buscar/:cuit, POST /abiertoAnual y POST /abiertoAnual/:id son parte del flujo publico. No deben esperarse 403 por falta de login salvo que producto decida cerrarlos.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'AA-DATA-01',
    module: 'abiertoAnual',
    submodule: 'datos-integridad',
    title: 'Integridad de datos del tramite',
    goal: 'Validar que estados, fechas de carga, facturas y observaciones se mantienen coherentes entre ciudadano, backoffice y exportacion.',
    suggestedUser: 'abiertoAnualJefe',
    negativeUser: null,
    route: '/comercio/abierto_anual/registros',
    permissions: ['abiertoAnual.read', 'abiertoAnual.update', 'abiertoAnual.export'],
    expected: 'El mismo registro muestra datos coherentes en periodos publicos, detalle interno y CSV.',
    steps: [
      {
        id: 'AA-DATA-01-01',
        text: 'Elegir un registro con CUIT y legajo conocidos. Registrar en notas el ID, CUIT, legajo y estado de los tres periodos.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-DATA-01-02',
        text: 'Como ciudadano, ingresar con ese CUIT y legajo. Confirmar que los tres estados visibles coinciden con los estados anotados en backoffice.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-DATA-01-03',
        text: 'Si hay un periodo Incorrecto, confirmar que la observacion/motivo en la vista publica coincide con la observacion del detalle interno.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-DATA-01-04',
        text: 'Si hay un periodo Correcto o En revision con factura, abrir la vista previa en backoffice y confirmar que corresponde al periodo esperado.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-DATA-01-05',
        text: 'Exportar CSV y buscar el CUIT del registro. Confirmar que Status1/2/3 y Observaciones1/2/3 coinciden con lo visto en la UI.',
        checkpoint: { type: 'manual' }
      }
    ]
  },
  {
    id: 'AA-REGRESSION-01',
    module: 'abiertoAnual',
    submodule: 'regresion-flujo-completo',
    title: 'Circuito completo minimo',
    goal: 'Ejecutar una pasada corta de punta a punta con un registro de prueba: ingreso publico, carga, revision, exportacion y verificacion ciudadana.',
    suggestedUser: 'abiertoAnualJefe',
    negativeUser: null,
    route: '/comercio/abierto_anual',
    permissions: ['abiertoAnual.read', 'abiertoAnual.update', 'abiertoAnual.export', 'abiertoAnual.admin'],
    expected: 'Un registro de prueba puede pasar de Incompleto a En revision, luego Correcto o Incorrecto, y queda reflejado para ciudadano y CSV.',
    steps: [
      {
        id: 'AA-REGRESSION-01-01',
        text: 'Con Abierto anual jefe, abrir /admin/abierto-anual y configurar temporalmente Periodo 1 para que la fecha actual quede dentro de la ventana. Anotar valores originales.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-REGRESSION-01-02',
        text: 'Sin login municipal, entrar a /comercio/abierto_anual/form con un CUIT y legajo QA existentes. Llegar a periodos.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-REGRESSION-01-03',
        text: 'Subir una factura de prueba menor a 15MB en Periodo 1 y completar captcha. Confirmar que Periodo 1 queda En revision.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-REGRESSION-01-04',
        text: 'Entrar con Abierto anual jefe, abrir el detalle interno del registro y aprobar Periodo 1.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-REGRESSION-01-05',
        text: 'Volver como ciudadano con el mismo CUIT y legajo. Confirmar que Periodo 1 queda Correcto.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-REGRESSION-01-06',
        text: 'Exportar CSV desde /comercio/abierto_anual/registros y confirmar que el registro aparece con Status1 = Correcto.',
        checkpoint: { type: 'manual' }
      },
      {
        id: 'AA-REGRESSION-01-07',
        text: 'Restaurar las fechas originales de Periodo 1 en /admin/abierto-anual para no afectar otras pruebas.',
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
    modules: ['security', 'habilitaciones'],
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
        text: 'Desde la consola del navegador en el detalle de una solicitud, pegar: const id = $nuxt.$route.params.id || prompt("ID de la solicitud"); await $nuxt.$axios.$put(`/habilitaciones/${id}`, { habilitacion: { status: "Finalizada", observaciones: "QA intento sin permiso sensible" } }).then(() => "BUG: accion permitida sin permiso").catch(e => ({ status: e.response && e.response.status, message: e.response && e.response.data && e.response.data.message }));',
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
    modules: ['public', 'habilitaciones', 'turnos'],
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

function caseModules(testCase) {
  return Array.from(new Set([
    testCase.module,
    ...((testCase.modules || []))
  ].filter(Boolean)))
}

function caseBelongsToModule(testCase, moduleKey) {
  return caseModules(testCase).includes(moduleKey)
}

function userByKey(key) {
  return TEST_USERS[key] || null
}

module.exports = {
  TEST_USERS,
  MODULES,
  CASES,
  caseById,
  caseModules,
  caseBelongsToModule,
  moduleByKey,
  userByKey
}
