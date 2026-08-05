# Casos de prueba simplificados para roles y permisos

Objetivo: validar que el RBAC funciona en todo el sitio sin testear cada boton duplicado. La regla es probar una pantalla y una API por cada tipo de permiso: `read`, `update`, `export`, `manage`, wildcard `*` y acceso publico.

## Usuarios minimos para QA

Crear o usar estos usuarios de prueba:

| Usuario | Rol / permisos esperados |
| --- | --- |
| Sin login | Sin token |
| Sin permisos | Usuario valido sin roles experimentales ni legacy |
| Master legacy | `admin: master` |
| Admin experimental | rol `admin`, permisos `*` |
| Habilitaciones | rol `habilitaciones` |
| Habilitaciones jefe | rol `habilitaciones_jefe` |
| Pagos dobles | rol `pagos_dobles` |
| Pagos dobles jefe | rol `pagos_dobles_jefe` |
| Cementerio funeraria | rol `cementerio_funeraria` |
| Cementerio funeraria jefe | rol `cementerio_funeraria_jefe` |
| Cementerio revision | rol `cementerio_review` |
| Cementerio admin | rol `cementerio_admin` |
| Compras | rol `compras` |
| Compras jefe | rol `compras_jefe` |
| Hacienda jefe | rol `hacienda_jefe` |
| Modernizacion | rol `modernizacion` |
| Abierto anual jefe | rol `abierto_anual_jefe` |

## Smoke de autenticacion y resolucion de permisos

| ID | Caso | Pasos | Resultado esperado |
| --- | --- | --- | --- |
| AUTH-01 | Sin token | Entrar a una pantalla privada y llamar una API privada. | UI no muestra contenido privado. API devuelve `401`. |
| AUTH-02 | Token de usuario borrado/inexistente | Loguear, borrar usuario en DB o usar token viejo, refrescar. | API devuelve `Usuario no encontrado.` y el front limpia sesion. |
| AUTH-03 | Usuario sin permisos | Loguear usuario valido sin roles. | No ve menus privados. APIs privadas devuelven `403`. |
| AUTH-04 | Admin experimental | Loguear rol `admin`. | Ve todos los menus y puede ejecutar acciones protegidas. |
| AUTH-05 | Master legacy | Loguear `admin: master`. | Puede administrar usuarios/roles, pero no obtiene automaticamente permisos operativos salvo los que tenga por rol experimental. |
| AUTH-06 | Cambio de rol | Asignar y quitar un rol desde admin, volver a loguear. | Los menus y permisos cambian segun el rol actual. |

## Navegacion y menus

| ID | Caso | Usuario | Validar |
| --- | --- | --- | --- |
| NAV-01 | Menu privado sin permisos | Sin permisos | No aparecen Obras, Indices, Comercio, Recaudaciones admin, Cementerio, Compras, Usuarios ni Dashboard. |
| NAV-02 | Menu por area | Cada rol operativo | Solo aparece el menu de su area. |
| NAV-03 | Acceso directo bloqueado | Cada rol operativo | Pegar URL de otra area; no debe cargar datos ni permitir acciones. |
| NAV-04 | Publico | Sin login | Home, buscador de tramites, listado de tramites y consultas publicas de boletas deben seguir accesibles. |

## Matriz minima por modulo

| Modulo | Usuario permitido | Debe poder | Usuario negativo | Debe fallar |
| --- | --- | --- | --- | --- |
| Usuarios / Roles | Master legacy o Admin | Ver usuarios, listar roles, asignar/quitar roles | Habilitaciones | Menu oculto y API `/experimental-rbac/*` en `403` |
| Habilitaciones | Habilitaciones | Ver solicitudes y editar datos comunes | Pagos dobles | Acceso/API en `403` |
| Habilitaciones export/status | Habilitaciones jefe | Exportar, cambiar estado, visibilidad si corresponde | Habilitaciones | Botones ocultos y API en `403` |
| Turnos | Turnos | Ver turnos | Habilitaciones sin `turnos.update` | No puede modificar/eliminar turnos |
| Pagos dobles | Pagos dobles | Ver y actualizar solicitudes | Habilitaciones | Acceso/API en `403` |
| Pagos dobles export | Pagos dobles jefe | Exportar listado | Pagos dobles | Boton oculto y API en `403` |
| Cementerio funeraria | Cementerio funeraria | Ver/cargar sus periodos/documentos de su funeraria | Pagos dobles | Acceso/API en `403` |
| Cementerio confirmacion | Cementerio funeraria jefe | Confirmar periodo con comprobante mensual | Cementerio funeraria | Boton oculto y API en `403` |
| Cementerio revision | Cementerio revision | Ver todas las declaraciones y aprobar/rechazar comprobantes/periodos | Cementerio funeraria | No ve revision global |
| Cementerio admin | Cementerio admin | Administrar funerarias y asociar usuarios | Cementerio revision | Menu oculto y API en `403` |
| Compras | Compras | Ver/crear/editar/borrar ordenes sin vales | Habilitaciones | Acceso/API en `403` |
| Compras con vales | Compras jefe | Gestionar vales, vehiculos y dashboard | Compras | No puede gestionar vales/vehiculos |
| Hacienda / Obras / Indices | Hacienda jefe | Ver y editar obras/indices, dashboard/actividad si aplica | Modernizacion | Acceso/API en `403` |
| Abierto anual | Abierto anual jefe | Ver, gestionar y exportar registros | Abierto anual | No exporta |
| Maestro comercial | Maestro comercial | Ver y subir maestro | Habilitaciones | Acceso/API en `403` |
| Modernizacion | Modernizacion | Ver/gestionar multimedia/tutoriales/notas | Pagos dobles | Acceso/API en `403` |
| Boletas admin | Admin o permiso `boletas.manage` | Subir, analizar, publicar, habilitar/deshabilitar cargas | Hacienda sin `boletas.manage` | Menu oculto y API `/tasas/importaciones/*` en `403` |

## Pruebas funcionales por tipo de permiso

### `read`

1. Entrar con un rol que tenga `*.read`.
2. Confirmar que ve el menu y la pantalla carga datos.
3. Entrar con un rol de otra area.
4. Confirmar que el menu no aparece y la API responde `403`.

Aplicar a: `habilitaciones.read`, `pagosDobles.read`, `cementerio.read`, `compras.ordenes.read`, `compras.vales.read`, `obras.read`, `indices.read`, `abiertoAnual.read`, `maestroComercial.read`, `activities.read`, `dashboard.read`.

### `update`

1. Con rol operativo, ejecutar una modificacion simple.
2. Con rol solo lectura o de otra area, intentar la misma accion desde UI o API.
3. Confirmar boton oculto/deshabilitado y API `403`.

Aplicar a: `habilitaciones.update`, `turnos.update`, `pagosDobles.update`, `cementerio.update`, `cementerio.confirm`, `cementerio.review`, `compras.ordenes.update`, `compras.vales.update`, `obras.update`, `indices.update`, `abiertoAnual.update`, `maestroComercial.update`, `modernizacion.update`.

### `export`

1. Con rol jefe, verificar boton de exportacion y descarga.
2. Con rol operativo base, verificar boton oculto.
3. Llamar endpoint de exportacion si existe y confirmar `403`.

Aplicar a: `habilitaciones.export`, `pagosDobles.export`, `abiertoAnual.export`, `obras.export`.

### `manage`

1. Con permiso `users.manage`, administrar usuarios/roles.
2. Con permiso `boletas.manage`, administrar importaciones de boletas.
3. Con permiso `compras.vehiculos.manage`, administrar vehiculos.
4. Con permiso `cementerio.admin`, administrar funerarias y asociar usuarios.
5. Con usuarios sin esos permisos, confirmar menu oculto y API `403`.

## Casos criticos de seguridad

| ID | Caso | Resultado esperado |
| --- | --- | --- |
| SEC-01 | Ocultar boton no alcanza | Si se fuerza la request manualmente sin permiso, backend devuelve `403`. |
| SEC-02 | Wildcard | Un usuario con `*` pasa todos los `requirePermission`. |
| SEC-03 | Rol inactivo | Si un rol experimental queda `active: false`, sus permisos no se aplican. |
| SEC-04 | Asignacion removida | Si se remueve un rol, el usuario pierde permisos al volver a iniciar sesion. |
| SEC-05 | Permisos duplicados | Un usuario con permisos por legacy y experimental no rompe login ni duplica permisos visibles. |
| SEC-06 | Cross-area | Un rol de un area nunca puede leer ni modificar recursos de otra area. |
| SEC-07 | Publico no regresiona | Formularios publicos, tramites publicos y consulta/descarga publica de boletas no piden login. |

## Checklist final de aceptacion

- [ ] Todos los roles operativos ven solo su menu.
- [ ] Todos los roles operativos cargan datos de su area.
- [ ] Las acciones de escritura fallan con `403` para usuarios sin `update`.
- [ ] Las exportaciones fallan con `403` para usuarios sin `export`.
- [ ] Admin con `*` puede operar todo.
- [ ] Master legacy puede administrar usuarios/roles.
- [ ] Usuario sin permisos no ve contenido privado.
- [ ] Accesos publicos siguen funcionando sin login.
- [ ] Token viejo o usuario inexistente limpia sesion en el front.
