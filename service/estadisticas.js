// Importar servicios existentes
const HabilitacionService = require('./habilitacion')
const ObraService = require('./obra')
const TurnoService = require('./turno')
const PagoDobleService = require('./pagoDoble')
const IndiceService = require('./indice')
const MultimediaService = require('./multimedia')
const AbiertoAnualService = require('./abiertoAnual')
const CertificadoService = require('./certificado')
const CombustibleService = require('./combustible')

const FINALIZACION_PATTERNS = [
  /Se finaliza(?: la solicitud)?(?: el)?(?: trámite)?(?: [^0-9]*)?(\d{1,2}\/\d{1,2}\/\d{2,4})(?:\s+(\d{1,2}:\d{2}(?::\d{2})?))?/gi,
  /Finalización[^0-9]*(\d{1,2}\/\d{1,2}\/\d{2,4})/gi,
  /Renovación finalizada[^0-9]*(\d{1,2}\/\d{1,2}\/\d{2,4})/gi,
  /Reempadronamiento finalizado[^0-9]*(\d{1,2}\/\d{1,2}\/\d{2,4})/gi
]

const normalizarAnio = (anio) => {
  if (anio >= 1000) return anio
  if (anio >= 50) return 1900 + anio
  return 2000 + anio
}

const construirFecha = (fechaStr, horaStr) => {
  if (!fechaStr) return null

  const partesFecha = fechaStr.split('/').map(parte => parte.trim())
  if (partesFecha.length !== 3) return null

  const [diaStr, mesStr, anioStr] = partesFecha
  const dia = parseInt(diaStr, 10)
  const mes = parseInt(mesStr, 10)
  let anio = parseInt(anioStr, 10)

  if (Number.isNaN(dia) || Number.isNaN(mes) || Number.isNaN(anio)) return null

  anio = normalizarAnio(anio)

  let horas = 0
  let minutos = 0
  let segundos = 0

  if (horaStr) {
    const partesHora = horaStr.split(':').map(parte => parseInt(parte, 10))
    if (partesHora.length >= 1 && !Number.isNaN(partesHora[0])) horas = partesHora[0]
    if (partesHora.length >= 2 && !Number.isNaN(partesHora[1])) minutos = partesHora[1]
    if (partesHora.length >= 3 && !Number.isNaN(partesHora[2])) segundos = partesHora[2]
  }

  const fecha = new Date(anio, mes - 1, dia, horas, minutos, segundos)
  return Number.isNaN(fecha.getTime()) ? null : fecha
}

const extraerFechaFinalizacion = (observaciones) => {
  if (!observaciones || typeof observaciones !== 'string') {
    return { finalizadaAt: null, finalizadaAtISO: null }
  }

  let fechaEncontrada = null

  for (const pattern of FINALIZACION_PATTERNS) {
    const coincidencias = [...observaciones.matchAll(pattern)]
    if (coincidencias.length > 0) {
      const ultimaCoincidencia = coincidencias[coincidencias.length - 1]
      const [, fechaStr, horaStr] = ultimaCoincidencia
      const fecha = construirFecha(fechaStr, horaStr)
      if (fecha) {
        fechaEncontrada = fecha
      }
    }
  }

  if (!fechaEncontrada) {
    return { finalizadaAt: null, finalizadaAtISO: null }
  }

  return {
    finalizadaAt: fechaEncontrada.toLocaleDateString('es-AR'),
    finalizadaAtISO: fechaEncontrada.toISOString()
  }
}

const construirFechasFinalizacion = (item) => {
  const { finalizadaAt, finalizadaAtISO } = extraerFechaFinalizacion(item?.observaciones)
  if (finalizadaAtISO) {
    return { finalizadaAt, finalizadaAtISO }
  }

  if (item?.status === 'Finalizada' && item?.updatedAt) {
    const fecha = new Date(item.updatedAt)
    if (!Number.isNaN(fecha.getTime())) {
      return {
        finalizadaAt: fecha.toLocaleDateString('es-AR'),
        finalizadaAtISO: fecha.toISOString()
      }
    }
  }

  return { finalizadaAt: null, finalizadaAtISO: null }
}


// Función helper para normalizar nombres de localidades
const normalizarLocalidad = (localidad) => {
  if (!localidad || typeof localidad !== 'string') return null

  // Normalización más agresiva para unificar variaciones de la misma localidad
  let localidadNormalizada = localidad
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ') // Reemplazar múltiples espacios por uno solo
    .replace(/\([^)]*\)/g, '') // Eliminar códigos postales entre paréntesis como (7165)
    .replace(/\d+/g, '') // Eliminar números sueltos
    .replace(/\s*-\s*/g, ' ') // Reemplazar guiones por espacios
    .replace(/\s*,\s*/g, ' ') // Reemplazar comas por espacios
    .replace(/\s+/g, ' ') // Reemplazar múltiples espacios por uno solo
    .trim()
    .split(' ')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1)) // Capitalizar cada palabra
    .join(' ')
    .replace(/\s+/g, ' ') // Limpiar espacios finales
    .trim()

  // Casos específicos conocidos para unificar variaciones
  const casosEspeciales = {
    'Villa Gesell': 'Villa Gesell',
    'Villa Gesell Villa Gesell': 'Villa Gesell', // Caso "Villa Gesell - Villa Gesell"
    'Villa Gesll': 'Villa Gesell', // Error tipográfico sin la 'e'
    'Mar De Las Pampas': 'Mar de las Pampas',
    'Las Gaviotas': 'Las Gaviotas',
    'Mar Azul': 'Mar Azul',
    'Colonia Marina': 'Colonia Marina',
    'Mar Del Plata': 'Mar del Plata',
    'Mar Del Tuyu': 'Mar del Tuyú',
    'Pinamar': 'Pinamar',
    'Carilo': 'Cariló',
    'San Bernardo': 'San Bernardo',
    'Santa Teresita': 'Santa Teresita',
    'Las Toninas': 'Las Toninas',
    'La Costa': 'La Costa',
    // Casos específicos para Buenos Aires
    'Ciudad Autonoma De Buenos Aires': 'CABA',
    'Ciudad Autónoma De Buenos Aires': 'CABA',
    'Capital Federal': 'CABA',
    'Caba': 'CABA',
    'Buenos Aires': 'CABA'
  }

  // Aplicar casos especiales si existe
  for (const [variacion, estandar] of Object.entries(casosEspeciales)) {
    if (localidadNormalizada.toLowerCase().includes(variacion.toLowerCase())) {
      localidadNormalizada = estandar
      break
    }
  }

  return localidadNormalizada
}

// Función helper para clasificar localidades por región (Partido de Villa Gesell vs Fuera)
const clasificarLocalidadPorRegion = (localidad) => {
  if (!localidad || typeof localidad !== 'string') return 'Fuera de Villa Gesell'

  const localidadNormalizada = normalizarLocalidad(localidad)

  // Localidades del Partido de Villa Gesell
  const localidadesVillaGesell = [
    'Villa Gesell',
    'Mar de las Pampas',
    'Las Gaviotas',
    'Mar Azul',
    'Colonia Marina'
  ]

  // Verificar si la localidad pertenece al Partido de Villa Gesell
  const esDelPartido = localidadesVillaGesell.some(loc =>
    localidadNormalizada.toLowerCase().includes(loc.toLowerCase())
  )

  return esDelPartido ? 'Partido de Villa Gesell' : 'Fuera de Villa Gesell'
}


// Función helper para normalizar nombres de proveedores
const normalizarProveedor = (proveedor) => {
  if (!proveedor || typeof proveedor !== 'string') return null

  return proveedor
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ') // Reemplazar múltiples espacios por uno solo
    .replace(/^\d+\s*-\s*/, '') // Eliminar números al inicio seguidos de guión
    .replace(/^\d+\s*/, '') // Eliminar números al inicio
    .split(' ')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1)) // Capitalizar cada palabra
    .join(' ')
}

// Función helper para parsear fechas de diferentes formatos sin modificar los servicios existentes
const parsearFechaSegura = (fechaInput) => {
  if (!fechaInput) return null

  // Si ya es un objeto Date válido
  if (fechaInput instanceof Date && !isNaN(fechaInput.getTime())) {
    return fechaInput
  }

  // Si es string, intentar diferentes formatos
  if (typeof fechaInput === 'string') {
    // Formato DD/MM/YYYY o DD/M/YYYY (desde habilitaciones)
    if (fechaInput.includes('/')) {
      const partes = fechaInput.split('/')
      if (partes.length === 3) {
        const [dia, mes, año] = partes
        const diaNum = parseInt(dia)
        const mesNum = parseInt(mes)
        const añoNum = parseInt(año)

        // Validar que los números sean válidos
        if (diaNum >= 1 && diaNum <= 31 && mesNum >= 1 && mesNum <= 12 && añoNum >= 2000 && añoNum <= 2100) {
          const fecha = new Date(añoNum, mesNum - 1, diaNum)
          if (!isNaN(fecha.getTime())) {
            return fecha
          }
        }
      }
    }

    // Formato ISO (YYYY-MM-DD)
    if (fechaInput.includes('-') && fechaInput.length >= 10) {
      const fecha = new Date(fechaInput)
      if (!isNaN(fecha.getTime())) {
        return fecha
      }
    }

    // Intentar parseo directo como último recurso
    const fecha = new Date(fechaInput)
    if (!isNaN(fecha.getTime())) {
      return fecha
    }
  }

  // Si no se pudo parsear, devolver null
  return null
}

// Función auxiliar para normalizar fechas y evitar inconsistencias
const normalizarFecha = (fecha) => {
  if (!fecha) return null

  // Si ya es un objeto Date válido, usarlo directamente
  if (fecha instanceof Date && !isNaN(fecha.getTime())) {
    const fechaNormalizada = new Date(fecha)
    fechaNormalizada.setHours(0, 0, 0, 0)
    return fechaNormalizada
  }

  // Intentar parsear con la función segura
  const fechaParsed = parsearFechaSegura(fecha)
  if (!fechaParsed) {
    console.warn('No se pudo parsear fecha:', fecha)
    return null
  }

  // Normalizar a inicio del día para comparaciones consistentes
  const fechaNormalizada = new Date(fechaParsed)
  fechaNormalizada.setHours(0, 0, 0, 0)
  return fechaNormalizada
}

// Función helper para contar documentos (corregida)
const contarDocumentos = (item, tipoModulo) => {
  let totalDocumentos = 0
  let tieneDocumentos = false

  // Solo contar documentos según el tipo de módulo
  if (tipoModulo === 'abiertoAnual') {
    // Solo facturas para abierto anual
    if (item.facturas && Array.isArray(item.facturas)) {
      totalDocumentos += item.facturas.length
      if (item.facturas.length > 0) tieneDocumentos = true
    }
  } else if (tipoModulo === 'pagosDobles') {
    // Solo documentos para pagos dobles
    if (item.documentos && Array.isArray(item.documentos)) {
      totalDocumentos += item.documentos.length
      if (item.documentos.length > 0) tieneDocumentos = true
    }
  }
  // No contar documentos para habilitaciones, obras ni certificados

  return { totalDocumentos, tieneDocumentos }
}

// Función helper para calcular estadísticas de combustible (órdenes + vales)
const calcularEstadisticasCombustible = (ordenes, vales) => {
  console.log('🚀 Iniciando cálculo estadísticas combustible:', {
    ordenesCount: ordenes.length,
    valesCount: vales.length,
    ordenesSample: ordenes.slice(0, 2), // Primeras 2 órdenes
    valesSample: vales.slice(0, 2) // Primeros 2 vales
  })

  console.log('🚀 Valores específicos iniciales:', {
    'ordenes.length ===': ordenes.length,
    'vales.length ===': vales.length,
    '¿ordenes es array?': Array.isArray(ordenes),
    '¿vales es array?': Array.isArray(vales)
  })

  const estadisticasOrdenes = calcularEstadisticasOrdenesCompra(ordenes)

  // Calcular estadísticas de vales (manejo robusto de diferentes tipos de datos)
  const totalVales = vales.length

  // Función helper para determinar si un vale está consumido
  const esValeConsumido = (vale) => {
    const consumido = vale.consumido
    if (consumido === true || consumido === 1 || consumido === 'true' || consumido === '1') {
      return true
    }
    return false
  }

  // Función helper para determinar si un vale está anulado
  const esValeAnulado = (vale) => {
    const anulado = vale.anulado
    if (anulado === true || anulado === 1 || anulado === 'true' || anulado === '1') {
      return true
    }
    return false
  }

  // Lógica corregida: los anulados tienen prioridad
  const valesAnulados = vales.filter(esValeAnulado).length
  const valesConsumidos = vales.filter(vale => esValeConsumido(vale) && !esValeAnulado(vale)).length
  const valesDisponibles = vales.filter(vale => !esValeConsumido(vale) && !esValeAnulado(vale)).length

  // Debug específico para vales consumidos y anulados
  console.log('🔍 Debug vales consumidos y anulados:', {
    totalVales,
    valesConsumidos,
    valesDisponibles,
    valesAnulados,
    sumaTotal: valesConsumidos + valesDisponibles + valesAnulados,
    coincideConTotal: (valesConsumidos + valesDisponibles + valesAnulados) === totalVales,
    valesConConsumidoTrue: vales.filter(vale => vale.consumido === true),
    valesConConsumidoFalse: vales.filter(vale => vale.consumido === false),
    valesConConsumidoUndefined: vales.filter(vale => vale.consumido === undefined),
    valesConConsumidoNull: vales.filter(vale => vale.consumido === null),
    valesConConsumidoString: vales.filter(vale => typeof vale.consumido === 'string'),
    valesConConsumidoNuevoMetodo: vales.filter(esValeConsumido),
    valesConAnuladoTrue: vales.filter(vale => vale.anulado === true),
    valesConAnuladoFalse: vales.filter(vale => vale.anulado === false),
    valesConAnuladoUndefined: vales.filter(vale => vale.anulado === undefined),
    valesConAnuladoNull: vales.filter(vale => vale.anulado === null),
    valesConAnuladoString: vales.filter(vale => typeof vale.anulado === 'string'),
    valesConAnuladoNuevoMetodo: vales.filter(esValeAnulado),
    muestraVales: vales.slice(0, 10).map(vale => ({
      id: vale.id,
      consumido: vale.consumido,
      tipoConsumido: typeof vale.consumido,
      esConsumidoNuevoMetodo: esValeConsumido(vale),
      anulado: vale.anulado,
      tipoAnulado: typeof vale.anulado,
      esAnuladoNuevoMetodo: esValeAnulado(vale)
    }))
  })

  // Usar directamente el saldo restante de las órdenes (ya calculado por el backend)
  const saldoRestanteVales = ordenes.reduce((total, orden) => {
    if (Array.isArray(orden.saldos)) {
      const saldoOrden = orden.saldos.reduce((sum, saldo) => {
        // El saldo ya viene calculado por el backend (monto original - vales emitidos)
        const valorSaldo = saldo?.saldo || saldo || 0
        return sum + (parseFloat(valorSaldo) || 0)
      }, 0)
      return total + saldoOrden
    }
    return total
  }, 0)

  // Método de cálculo: saldo restante directo de órdenes
  const metodoCalculoSaldo = 'saldo_restante_ordenes'
  const saldoDesdeOrdenes = saldoRestanteVales

  console.log('✅ Saldo restante calculado directamente desde órdenes:', {
    saldoRestanteVales,
    ordenesCount: ordenes.length,
    ordenesSample: ordenes.slice(0, 2).map(o => ({
      id: o.id,
      nroOrden: o.nroOrden,
      saldos: o.saldos
    }))
  })

  // Calcular valor promedio de vales
  const valorPromedioVale = totalVales > 0
    ? vales.reduce((total, vale) => total + (parseFloat(vale.monto) || 0), 0) / totalVales
    : 0

  // Calcular promedio de vales por orden de compra
  const promedioValesPorOrden = ordenes.length > 0
    ? totalVales / ordenes.length
    : 0

  console.log('🔢 Debug promedio vales/orden:', {
    totalVales,
    totalOrdenes: ordenes.length,
    promedioValesPorOrden,
    estadisticasOrdenesTotal: estadisticasOrdenes.totalOrdenes,
    ordenesArray: ordenes,
    valesArray: vales.slice(0, 3) // Solo los primeros 3 vales para no saturar el log
  })

  console.log('🔢 Valores específicos:', {
    'totalVales ===': totalVales,
    'ordenes.length ===': ordenes.length,
    'promedioValesPorOrden ===': promedioValesPorOrden,
    '¿Es totalVales > 0?': totalVales > 0,
    '¿Es ordenes.length > 0?': ordenes.length > 0
  })

  // Calcular monto promedio por orden de compra
  const montoPromedioOrden = ordenes.length > 0
    ? estadisticasOrdenes.montoTotalOrdenes / ordenes.length
    : 0

  // Calcular fecha de inicio de emisión de vales (fecha más antigua)
  const fechasVales = vales
    .map(vale => vale.fechaEmision || vale.createdAt || vale.fechaCreacion)
    .filter(fecha => fecha)
    .map(fecha => new Date(fecha))
    .filter(fecha => !isNaN(fecha.getTime()))

  const fechaInicioEmisionVales = fechasVales.length > 0
    ? new Date(Math.min(...fechasVales.map(f => f.getTime())))
    : null

  console.log('📅 Debug fecha inicio emisión vales:', {
    fechasValesCount: fechasVales.length,
    fechaInicioEmisionVales: fechaInicioEmisionVales,
    fechaInicioFormateada: fechaInicioEmisionVales ? fechaInicioEmisionVales.toLocaleDateString('es-AR') : 'N/A',
    valesSample: vales.slice(0, 3).map(v => ({
      id: v.id,
      fechaEmision: v.fechaEmision,
      createdAt: v.createdAt,
      fechaCreacion: v.fechaCreacion
    }))
  })


  // Calcular estadísticas por tipo de combustible (excluyendo vales anulados)
  const porTipoCombustible = vales.reduce((acc, vale) => {
    const tipo = vale.tipoCombustible || 'Sin especificar'
    if (!acc[tipo]) {
      acc[tipo] = {
        total: 0,
        consumidos: 0,
        disponibles: 0,
        montoTotal: 0,
        montoDisponible: 0
      }
    }

    // Solo contar vales no anulados
    if (!esValeAnulado(vale)) {
      acc[tipo].total += 1
      acc[tipo].montoTotal += parseFloat(vale.monto) || 0

      if (esValeConsumido(vale)) {
        acc[tipo].consumidos += 1
      } else {
        acc[tipo].disponibles += 1
        acc[tipo].montoDisponible += parseFloat(vale.monto) || 0
      }
    }
    return acc
  }, {})

  // Calcular estadísticas por área (excluyendo vales anulados)
  const porArea = vales.reduce((acc, vale) => {
    const area = vale.area || 'Sin especificar'
    if (!acc[area]) {
      acc[area] = {
        total: 0,
        consumidos: 0,
        disponibles: 0,
        montoTotal: 0,
        montoDisponible: 0,
        saldoRestante: 0
      }
    }

    // Solo contar vales no anulados
    if (!esValeAnulado(vale)) {
      acc[area].total += 1
      acc[area].montoTotal += parseFloat(vale.monto) || 0

      if (esValeConsumido(vale)) {
        acc[area].consumidos += 1
      } else {
        acc[area].disponibles += 1
        acc[area].montoDisponible += parseFloat(vale.monto) || 0
      }
    }
    return acc
  }, {})

  // Calcular saldo restante por área usando directamente el saldo restante de las órdenes
  Object.keys(porArea).forEach(area => {
    // Usar directamente el saldo restante de las órdenes para esta área
    const saldoRestanteArea = ordenes
      .filter(orden => orden.area === area)
      .reduce((total, orden) => {
        if (Array.isArray(orden.saldos)) {
          const saldoOrden = orden.saldos.reduce((sum, saldo) => {
            // El saldo ya viene calculado por el backend
            const valorSaldo = saldo?.saldo || saldo || 0
            return sum + (parseFloat(valorSaldo) || 0)
          }, 0)
          return total + saldoOrden
        }
        return total
      }, 0)

    porArea[area].saldoRestante = saldoRestanteArea
  })

  return {
    // Estadísticas de órdenes (existentes)
    totalOrdenes: estadisticasOrdenes.totalOrdenes,
    montoTotalOrdenes: estadisticasOrdenes.montoTotalOrdenes,
    montoTotalSaldos: estadisticasOrdenes.montoTotalSaldos,
    totalValesGenerados: estadisticasOrdenes.totalValesGenerados,
    porProveedor: estadisticasOrdenes.porProveedor,
    porArea: estadisticasOrdenes.porArea,

    // Nuevas estadísticas de vales
    totalVales,
    valesConsumidos,
    valesDisponibles,
    valesAnulados,
    saldoRestanteVales,
    metodoCalculoSaldo,
    saldoDesdeOrdenes,
    valorPromedioVale,
    promedioValesPorOrden,
    montoPromedioOrden,
    fechaInicioEmisionVales,
    porTipoCombustible: Object.entries(porTipoCombustible).map(([tipo, stats]) => ({
      tipo,
      total: stats.total,
      consumidos: stats.consumidos,
      disponibles: stats.disponibles,
      montoTotal: stats.montoTotal,
      montoDisponible: stats.montoDisponible
    })).sort((a, b) => b.total - a.total),
    porAreaVales: Object.entries(porArea).map(([area, stats]) => ({
      area,
      total: stats.total,
      consumidos: stats.consumidos,
      disponibles: stats.disponibles,
      montoTotal: stats.montoTotal,
      montoDisponible: stats.montoDisponible
    })).sort((a, b) => b.total - a.total)
  }
}

// Función helper para calcular estadísticas de órdenes de compra
const calcularEstadisticasOrdenesCompra = (ordenes) => {
  const totalOrdenes = ordenes.length
  let montoTotalOrdenes = 0
  let montoTotalSaldos = 0
  let totalValesGenerados = 0

  const porProveedor = ordenes.reduce((acc, orden) => {
    const proveedorNormalizado = normalizarProveedor(orden.proveedor)
    if (proveedorNormalizado) {
      if (!acc[proveedorNormalizado]) {
        acc[proveedorNormalizado] = {
          cantidadOrdenes: 0,
          montoTotal: 0,
          saldoRestante: 0,
          valesGenerados: 0
        }
      }
      acc[proveedorNormalizado].cantidadOrdenes += 1

      // Sumar montos (array)
      if (Array.isArray(orden.montos)) {
        const montoOrden = orden.montos.reduce((sum, monto) => sum + parseFloat(monto?.monto || monto || 0), 0)
        acc[proveedorNormalizado].montoTotal += montoOrden
      }

      // Sumar saldos (array)
      if (Array.isArray(orden.saldos)) {
        const saldoOrden = orden.saldos.reduce((sum, saldo) => sum + parseFloat(saldo?.saldo || saldo || 0), 0)
        acc[proveedorNormalizado].saldoRestante += saldoOrden
      }

      acc[proveedorNormalizado].valesGenerados += orden.vales || 0
    }
    return acc
  }, {})

  const porArea = ordenes.reduce((acc, orden) => {
    if (orden.area) {
      if (!acc[orden.area]) {
        acc[orden.area] = {
          cantidad: 0,
          montoTotal: 0,
          valesGenerados: 0
        }
      }
      acc[orden.area].cantidad += 1

      if (Array.isArray(orden.montos)) {
        const montoOrden = orden.montos.reduce((sum, monto) => sum + parseFloat(monto?.monto || monto || 0), 0)
        acc[orden.area].montoTotal += montoOrden
      }

      acc[orden.area].valesGenerados += orden.vales || 0
    }
    return acc
  }, {})

  // Calcular totales generales
  ordenes.forEach(orden => {
    if (Array.isArray(orden.montos)) {
      const montoOrden = orden.montos.reduce((sum, monto) => sum + parseFloat(monto?.monto || monto || 0), 0)
      montoTotalOrdenes += montoOrden
    }

    if (Array.isArray(orden.saldos)) {
      const saldoOrden = orden.saldos.reduce((sum, saldo) => sum + parseFloat(saldo?.saldo || saldo || 0), 0)
      montoTotalSaldos += saldoOrden
    }

    totalValesGenerados += orden.vales || 0
  })

  return {
    totalOrdenes,
    montoTotalOrdenes,
    montoTotalSaldos,
    totalValesGenerados,
    porProveedor: Object.entries(porProveedor).map(([nombre, stats]) => ({
      nombre,
      cantidadOrdenes: stats.cantidadOrdenes,
      montoTotal: stats.montoTotal,
      saldoRestante: stats.saldoRestante,
      valesGenerados: stats.valesGenerados
    })).sort((a, b) => b.cantidadOrdenes - a.cantidadOrdenes),
    porArea: Object.entries(porArea).map(([nombre, stats]) => ({
      nombre,
      cantidad: stats.cantidad,
      montoTotal: stats.montoTotal,
      valesGenerados: stats.valesGenerados
    })).sort((a, b) => b.cantidad - a.cantidad).slice(0, 10)
  }
}

// Función helper para calcular porcentaje de ejecución de obras
const calcularEjecucionObra = (obra) => {
  if (!obra.certificados || !Array.isArray(obra.certificados) || obra.certificados.length === 0) {
    return 0
  }

  let totalAvance = 0
  let totalItems = 0

  obra.certificados.forEach(certificado => {
    if (certificado.items && Array.isArray(certificado.items)) {
      certificado.items.forEach(itemCert => {
        // Verificar que el avance sea un número válido
        const avance = parseFloat(itemCert.avance)
        if (!isNaN(avance) && avance >= 0 && avance <= 100) {
          totalAvance += avance
          totalItems += 1
        }
      })
    }
  })

  const porcentajePromedio = totalItems > 0 ? totalAvance / totalItems : 0


  return Math.round(porcentajePromedio * 100) / 100 // Redondear a 2 decimales
}



// Función auxiliar para calcular estadísticas detalladas por módulo
const calcularEstadisticasDetalladas = (items, tipo, valesCombustible = [], certificados = [], datosSinFiltrar = null) => {
  const ahora = new Date()
  const hace30Dias = new Date(ahora.getTime() - (30 * 24 * 60 * 60 * 1000))

  const total = items.length
  const ultimos30Dias = items.filter(item => {
    const fechaCreacion = new Date(item.createdAt)
    return fechaCreacion >= hace30Dias
  }).length

  // Debug específico para últimos 30 días
  if (tipo === 'combustible') {
    console.log('📅 Debug últimos 30 días combustible:', {
      ahora: ahora.toISOString(),
      hace30Dias: hace30Dias.toISOString(),
      totalOrdenes: items.length,
      ultimos30Dias,
      ordenesRecientes: items.slice(0, 5).map(orden => ({
        id: orden.id,
        nroOrden: orden.nroOrden,
        createdAt: orden.createdAt,
        fechaCreacionParsed: new Date(orden.createdAt).toISOString(),
        esReciente: new Date(orden.createdAt) >= hace30Dias
      }))
    })
  }

  // Estadísticas específicas por tipo
  let estadisticasEspecificas = {}

  if (tipo === 'habilitaciones') {
    const porStatus = items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1
      return acc
    }, {})

    const porRubro = items.reduce((acc, item) => {
      acc[item.rubro] = (acc[item.rubro] || 0) + 1
      return acc
    }, {})

    const porTipoSolicitud = items.reduce((acc, item) => {
      if (item.tipoSolicitud) {
        acc[item.tipoSolicitud] = (acc[item.tipoSolicitud] || 0) + 1
      }
      return acc
    }, {})

    const porLocalidadInmueble = items.reduce((acc, item) => {
      const localidadNormalizada = normalizarLocalidad(item.localidad)
      if (localidadNormalizada) {
        acc[localidadNormalizada] = (acc[localidadNormalizada] || 0) + 1
      }
      return acc
    }, {})

    const porLocalidadSolicitante = items.reduce((acc, item) => {
      const localidadNormalizada = normalizarLocalidad(item.localidadSolicitante)
      if (localidadNormalizada) {
        acc[localidadNormalizada] = (acc[localidadNormalizada] || 0) + 1
      }
      return acc
    }, {})

    // Preparar localidades para el gráfico: top 9 + "Otros"
    const localidadesOrdenadas = Object.entries(porLocalidadSolicitante)
      .sort((a, b) => b[1] - a[1])

    const topLocalidades = localidadesOrdenadas.slice(0, 9)
    const restoLocalidades = localidadesOrdenadas.slice(9)
    const totalResto = restoLocalidades.reduce((sum, [, count]) => sum + count, 0)

    const porLocalidadSolicitanteGrafico = [...topLocalidades]
    if (totalResto > 0) {
      porLocalidadSolicitanteGrafico.push(['Otros', totalResto])
    }

    const porRegionSolicitante = items.reduce((acc, item) => {
      const region = clasificarLocalidadPorRegion(item.localidadSolicitante)
      acc[region] = (acc[region] || 0) + 1
      return acc
    }, {})

    // Calcular estadísticas por mes de ingreso usando función helper segura
    // NOTA: Para habilitaciones, el gráfico de trámites por mes se calcula con TODOS los datos
    // (sin filtrar) para mantener la tendencia histórica completa
    const datosParaGrafico = datosSinFiltrar && tipo === 'habilitaciones' ? datosSinFiltrar : items
    const porMesIngreso = datosParaGrafico.reduce((acc, item) => {
      const fechaCreacion = parsearFechaSegura(item.createdAt)
      if (fechaCreacion) {
        const año = fechaCreacion.getFullYear()
        const mes = fechaCreacion.getMonth() + 1 // getMonth() devuelve 0-11, necesitamos 1-12
        const clave = `${año}-${mes.toString().padStart(2, '0')}`
        const nombreMes = fechaCreacion.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })

        if (!acc[clave]) {
          acc[clave] = {
            mes: nombreMes,
            clave: clave,
            cantidad: 0
          }
        }
        acc[clave].cantidad += 1
      }
      return acc
    }, {})

    // Ordenar por clave (año-mes) y convertir a array
    const porMesIngresoArray = Object.values(porMesIngreso)
      .sort((a, b) => a.clave.localeCompare(b.clave))

    // Calcular trámites en revisión (pendientes)
    const enRevision = porStatus['En revisión'] || 0

    // Agrupar rubros: top 9 + "Otros"
    const rubrosOrdenados = Object.entries(porRubro).sort((a, b) => b[1] - a[1])
    const topRubros = rubrosOrdenados.slice(0, 9)
    const otrosRubros = rubrosOrdenados.slice(9)
    const totalOtros = otrosRubros.reduce((sum, [, cantidad]) => sum + cantidad, 0)

    const rubrosParaGrafico = [...topRubros]
    if (totalOtros > 0) {
      rubrosParaGrafico.push(['Otros', totalOtros])
    }

    estadisticasEspecificas = {
      porStatus,
      pendientes: enRevision, // Agregar campo pendientes que cuenta los "En revisión"
      porRubro: rubrosParaGrafico, // Top 9 + "Otros" para gráfico de torta
      porRubroCompleto: Object.entries(porRubro).sort((a, b) => b[1] - a[1]), // Todos los rubros para tabla detallada
      porTipoSolicitud: Object.entries(porTipoSolicitud).sort((a, b) => b[1] - a[1]).slice(0, 10),
      porLocalidadInmueble: Object.entries(porLocalidadInmueble).sort((a, b) => b[1] - a[1]).slice(0, 10),
      porLocalidadSolicitante: Object.entries(porLocalidadSolicitante).sort((a, b) => b[1] - a[1]), // Sin limitación para gráficos de torta
      porLocalidadSolicitanteGrafico: porLocalidadSolicitanteGrafico, // Top 9 + "Otros" para gráfico de torta
      porRegionSolicitante: Object.entries(porRegionSolicitante).sort((a, b) => b[1] - a[1]), // Para gráfico de torta por región
      porMesIngreso: porMesIngresoArray
    }
  } else if (tipo === 'obras') {

    // Estadísticas de porcentaje de ejecución mejoradas
    // Calcular estadísticas de ejecución sumando todos los avances de items
    let totalAvanceItems = 0
    let totalItemsCount = 0
    let obrasConCertificados = 0
    let obrasSinCertificados = 0


    // Crear un mapa de certificados por ID para acceso rápido
    const certificadosMap = new Map()
    certificados.forEach(cert => {
      if (cert.id || cert._id) {
        certificadosMap.set(cert.id || cert._id, cert)
      }
    })

    const ejecucionStats = items.reduce((acc, item) => {
      if (!item.certificados || !Array.isArray(item.certificados) || item.certificados.length === 0) {
        obrasSinCertificados += 1
        acc.sinCertificados += 1
        return acc
      }

      obrasConCertificados += 1
      acc.conCertificados += 1

      // Procesar cada certificado de esta obra
      item.certificados.forEach((certificadoId, certIndex) => {
        // Si certificadoId es un objeto con items, usarlo directamente
        // Si es un string/ID, buscar en el mapa de certificados
        let certificado = null

        if (typeof certificadoId === 'object' && certificadoId.items) {
          certificado = certificadoId
        } else if (typeof certificadoId === 'string') {
          certificado = certificadosMap.get(certificadoId)
        }

        if (certificado && certificado.items && Array.isArray(certificado.items)) {

          certificado.items.forEach((itemCert, itemIndex) => {
            // El avance puede venir como número o string
            let avance = itemCert.avance

            // Si es string, intentar convertirlo a número
            if (typeof avance === 'string') {
              avance = parseFloat(avance)
            }

            // Si es número válido entre 0 y 100
            if (!isNaN(avance) && avance >= 0 && avance <= 100) {
              totalAvanceItems += avance
              totalItemsCount += 1

              // Categorizar por rangos de ejecución individual
              if (avance === 0) acc.sinEjecucion += 1
              else if (avance < 25) acc.inicio += 1
              else if (avance < 50) acc.enProgreso += 1
              else if (avance < 75) acc.avanzado += 1
              else if (avance < 100) acc.casiCompleto += 1
              else acc.completo += 1
            } else {
            }
          })
        }
      })

      return acc
    }, {
      conCertificados: 0,
      sinCertificados: 0,
      sinEjecucion: 0,
      inicio: 0,
      enProgreso: 0,
      avanzado: 0,
      casiCompleto: 0,
      completo: 0
    })

    // Calcular porcentaje total basado en la suma de todos los avances de items
    ejecucionStats.porcentajePromedio = totalItemsCount > 0
      ? (totalAvanceItems / totalItemsCount).toFixed(2)
      : 0

    // Calcular cotización promedio de obras
    const cotizacionesStats = items.reduce((acc, item) => {
      if (item.cotizacion !== undefined && item.cotizacion !== null && !isNaN(parseFloat(item.cotizacion))) {
        const cotizacion = parseFloat(item.cotizacion)
        if (cotizacion > 0) {
          acc.totalCotizaciones += cotizacion
          acc.obrasConCotizacion += 1
        }
      }
      return acc
    }, { totalCotizaciones: 0, obrasConCotizacion: 0 })

    const cotizacionPromedio = cotizacionesStats.obrasConCotizacion > 0
      ? (cotizacionesStats.totalCotizaciones / cotizacionesStats.obrasConCotizacion).toFixed(2)
      : 0


    estadisticasEspecificas = {
      ejecucion: ejecucionStats,
      cotizacionPromedio: parseFloat(cotizacionPromedio)
    }
  } else if (tipo === 'pagosDobles') {
    const porStatus = items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1
      return acc
    }, {})

    const porLocalidad = items.reduce((acc, item) => {
      const localidadNormalizada = normalizarLocalidad(item.localidad)
      if (localidadNormalizada) {
        acc[localidadNormalizada] = (acc[localidadNormalizada] || 0) + 1
      }
      return acc
    }, {})

    estadisticasEspecificas = {
      porStatus,
      porLocalidad: Object.entries(porLocalidad).sort((a, b) => b[1] - a[1]).slice(0, 5)
    }
  } else if (tipo === 'turnos') {
    const porStatus = items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1
      return acc
    }, {})

    const porTipoTramite = items.reduce((acc, item) => {
      const tipo = item.tipoTramite || 'Sin especificar'
      acc[tipo] = (acc[tipo] || 0) + 1
      return acc
    }, {})

    // Calcular estadísticas de enriquecimiento
    const turnosSinTipo = items.filter(item => !item.tipoTramite || item.tipoTramite === 'Sin especificar').length
    const turnosConTipo = items.length - turnosSinTipo

    console.log('📊 Estadísticas de turnos:', {
      totalTurnos: items.length,
      turnosConTipo,
      turnosSinTipo,
      porTipoTramite: Object.entries(porTipoTramite).sort((a, b) => b[1] - a[1])
    })

    estadisticasEspecificas = {
      porStatus,
      porTipoTramite,
      turnosConTipo,
      turnosSinTipo,
      porcentajeEnriquecimiento: items.length > 0 ? ((turnosConTipo / items.length) * 100).toFixed(1) : 0
    }
  } else if (tipo === 'combustible') {
    console.log('🔍 Debug combustible en calcularEstadisticasDetalladas:', {
      itemsCount: items.length,
      valesCombustibleCount: valesCombustible.length,
      itemsSample: items.slice(0, 2),
      valesCombustibleSample: valesCombustible.slice(0, 2)
    })
    const estadisticasCombustible = calcularEstadisticasCombustible(items, valesCombustible)

    estadisticasEspecificas = {
      totalOrdenes: estadisticasCombustible.totalOrdenes,
      montoTotalOrdenes: estadisticasCombustible.montoTotalOrdenes,
      montoTotalSaldos: estadisticasCombustible.montoTotalSaldos,
      totalValesGenerados: estadisticasCombustible.totalValesGenerados,
      porProveedor: estadisticasCombustible.porProveedor,
      porArea: estadisticasCombustible.porArea,
      // Nuevas estadísticas de vales
      totalVales: estadisticasCombustible.totalVales,
      valesConsumidos: estadisticasCombustible.valesConsumidos,
      valesDisponibles: estadisticasCombustible.valesDisponibles,
      valesAnulados: estadisticasCombustible.valesAnulados,
      saldoRestanteVales: estadisticasCombustible.saldoRestanteVales,
      metodoCalculoSaldo: estadisticasCombustible.metodoCalculoSaldo,
      saldoDesdeOrdenes: estadisticasCombustible.saldoDesdeOrdenes,
      valorPromedioVale: estadisticasCombustible.valorPromedioVale,
      promedioValesPorOrden: estadisticasCombustible.promedioValesPorOrden,
      montoPromedioOrden: estadisticasCombustible.montoPromedioOrden,
      fechaInicioEmisionVales: estadisticasCombustible.fechaInicioEmisionVales,
      porTipoCombustible: estadisticasCombustible.porTipoCombustible,
      porAreaVales: estadisticasCombustible.porAreaVales,
      // Incluir vales individuales para el componente de patentes
      vales: valesCombustible
    }
  } else if (tipo === 'abiertoAnual') {
    // Estadísticas específicas para abierto anual
    const porEstado = items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1
      return acc
    }, {})

    const porCuit = items.reduce((acc, item) => {
      if (item.cuit) {
        acc[item.cuit] = (acc[item.cuit] || 0) + 1
      }
      return acc
    }, {})

    // Calcular estadísticas por período basado en el array status
    const porPeriodo = {}

    // Configurar períodos (incluyendo Período 3 para vista completa)
    const añoActual = new Date().getFullYear()
    const periodosConfig = [
      { numero: 1, nombre: `Período 1 (01/05/${añoActual} - 31/05/${añoActual})`, index: 0 },
      { numero: 2, nombre: `Período 2 (01/08/${añoActual} - 31/08/${añoActual})`, index: 1 },
      { numero: 3, nombre: `Período 3 (01/10/${añoActual} - 31/10/${añoActual})`, index: 2 }
    ]

    // Inicializar estructura de períodos
    periodosConfig.forEach(periodo => {
      porPeriodo[periodo.nombre] = {
        conFacturas: 0,
        sinFacturas: 0,
        total: 0
      }
    })

    // Contadores para debugging
    let itemsProcesados = 0
    let itemsConStatusValido = 0
    let itemsContadosEnAlgunPeriodo = 0
    let itemsSinStatusArray = 0
    let itemsConFechaInvalida = 0

    // Procesar cada item - CORREGIDO: cada item se cuenta una sola vez por período
    items.forEach(item => {
      itemsProcesados++

      if (item.status && Array.isArray(item.status)) {
        itemsConStatusValido++
        let itemContadoEnAlgunPeriodo = false

        // Procesar cada período según el array status
        item.status.forEach((estadoPeriodo, index) => {
          // Procesar períodos 1, 2 y 3 (indices 0, 1 y 2)
          if (index < 3 && periodosConfig[index]) {
            const periodoNombre = periodosConfig[index].nombre
            const periodoConfig = periodosConfig[index]

            // Verificar si el item se creó dentro de este período usando función helper
            const fechaCreacion = parsearFechaSegura(item.createdAt)
            if (!fechaCreacion) {
              itemsConFechaInvalida++
              return
            }

            // Definir fechas de inicio y fin del período
            const matchInicio = periodoConfig.nombre.match(/01\/(\d{2})\/(\d{4})/)
            const matchFin = periodoConfig.nombre.match(/31\/(\d{2})\/(\d{4})/)

            if (!matchInicio || !matchFin) {
              return
            }

            const [, mesInicio, añoInicio] = matchInicio
            const [, mesFin, añoFin] = matchFin

            const fechaInicioPeriodo = new Date(añoInicio, mesInicio - 1, 1)
            const fechaFinPeriodo = new Date(añoFin, mesFin - 1, 31, 23, 59, 59, 999)

            // CORRECCIÓN: Solo contar si el item se creó antes o dentro del período (pero no después)
            // Y solo si el estado del período está definido (no undefined/null)
            if (fechaCreacion <= fechaFinPeriodo && estadoPeriodo !== undefined && estadoPeriodo !== null) {
              porPeriodo[periodoNombre].total += 1
              itemContadoEnAlgunPeriodo = true

              // Verificar el estado del período
              const estado = estadoPeriodo && typeof estadoPeriodo === 'string'
                ? estadoPeriodo.toLowerCase()
                : 'unknown'

              if (estado === 'incompleto') {
                porPeriodo[periodoNombre].sinFacturas += 1
              } else {
                porPeriodo[periodoNombre].conFacturas += 1
              }
            }
          }
        })

        // Contar si el item fue contado en algún período
        if (itemContadoEnAlgunPeriodo) {
          itemsContadosEnAlgunPeriodo++
        }
      } else {
        itemsSinStatusArray++
      }
    })


    // Análisis de rechazos por motivo y período
    const rechazosPorMotivoYPeriodo = {}
    const motivosRechazo = [
      'La factura no corresponde al período solicitado.',
      'La factura no corresponde al Legajo y/o CUIT/CUIM.',
      'El documento no es legible o está dañado.',
      'El documento no es una factura.',
      'El contribuyente cambió de categoría tributaria.',
      'El contribuyente cambió de categoría tirbutaria.', // Error tipográfico en el frontend
      'La facturacion no es compatible con las reglamentaciones de AFIP.',
      'La factura no corresponde a una venta efectivamente efectuada.'
    ]

    // Inicializar estructura para rechazos por motivo y período
    motivosRechazo.forEach(motivo => {
      rechazosPorMotivoYPeriodo[motivo] = { 'Período 1': 0, 'Período 2': 0, 'Período 3': 0 }
    })

    // Debug: Contar observaciones únicas encontradas
    const observacionesEncontradas = new Set()
    let rechazosProcesados = 0
    let rechazosSinObservaciones = 0

    // Analizar rechazos por motivo y período
    items.forEach(item => {
      if (Array.isArray(item.status)) {
        item.status.forEach((estadoPeriodo, indexPeriodo) => {
          if (estadoPeriodo === 'Incorrecto' && item.facturas && item.facturas[indexPeriodo]) {
            rechazosProcesados++
            const observaciones = item.facturas[indexPeriodo].observaciones
            if (observaciones) {
              observacionesEncontradas.add(observaciones)
              if (rechazosPorMotivoYPeriodo[observaciones]) {
                const periodoNombre = `Período ${indexPeriodo + 1}`
                rechazosPorMotivoYPeriodo[observaciones][periodoNombre]++
              } else {
                // Si no está en la lista de motivos conocidos, agregarlo
                rechazosPorMotivoYPeriodo[observaciones] = { 'Período 1': 0, 'Período 2': 0, 'Período 3': 0 }
                const periodoNombre = `Período ${indexPeriodo + 1}`
                rechazosPorMotivoYPeriodo[observaciones][periodoNombre]++
              }
            } else {
              rechazosSinObservaciones++
            }
          }
        })
      }
    })


    // Análisis específicos solicitados (actualizados para tercer período)
    let rechazoCategoriaPeroCargaronPosteriormente = 0
    let noPudieronCargarFueraTermino = 0
    let cargaronPeriodo1NoPeriodosPosteriores = 0
    let llegaronTardePeriodo1PeroSubieronPosteriormente = 0
    let llegaronATiempoPeroNoSubieron = {
      'Período 1 (Mayo)': 0,
      'Período 2 (Agosto)': 0,
      'Período 3 (Octubre)': 0
    }

    // Contador de cuántos llegaron tarde por período
    const llegaronTardePorPeriodo = {
      'Período 1 (Mayo)': 0,
      'Período 2 (Agosto)': 0,
      'Período 3 (Octubre)': 0
    }

    items.forEach(item => {
      if (Array.isArray(item.status)) {
        // 1. Rechazados por cambio de categoría pero cargaron posteriormente
        // Verificar si fue rechazado en período 1 o 2 por cambio de categoría
        const rechazadoPorCategoriaPeriodo1 = item.status[0] === 'Incorrecto' &&
          item.facturas &&
          item.facturas[0] &&
          (item.facturas[0].observaciones === 'El contribuyente cambió de categoría tributaria.' ||
           item.facturas[0].observaciones === 'El contribuyente cambió de categoría tirbutaria.')

        const rechazadoPorCategoriaPeriodo2 = item.status[1] === 'Incorrecto' &&
          item.facturas &&
          item.facturas[1] &&
          (item.facturas[1].observaciones === 'El contribuyente cambió de categoría tributaria.' ||
           item.facturas[1].observaciones === 'El contribuyente cambió de categoría tirbutaria.')

        // Si fue rechazado por cambio de categoría en período 1 o 2, pero cargó en períodos posteriores
        if ((rechazadoPorCategoriaPeriodo1 || rechazadoPorCategoriaPeriodo2)) {
          // Verificar si cargó en algún período posterior al rechazo
          const cargoPosteriormente = (rechazadoPorCategoriaPeriodo1 && (item.status[1] !== 'Incompleto' || item.status[2] !== 'Incompleto')) ||
                                    (rechazadoPorCategoriaPeriodo2 && item.status[2] !== 'Incompleto')

          if (cargoPosteriormente) {
            rechazoCategoriaPeroCargaronPosteriormente++
          }
        }

        // 2. No pudieron cargar facturas en algún período por haber creado su cuenta fuera de término
        const fechaCreacion = parsearFechaSegura(item.createdAt)
        if (fechaCreacion) {
          // Definir fechas de períodos para verificar si creó cuenta fuera de término
          const añoActual = new Date().getFullYear()
          const fechasPeriodos = [
            { inicio: new Date(añoActual, 4, 1), fin: new Date(añoActual, 4, 31), nombre: 'Período 1 (Mayo)', index: 0 }, // Mayo
            { inicio: new Date(añoActual, 7, 1), fin: new Date(añoActual, 7, 31), nombre: 'Período 2 (Agosto)', index: 1 }, // Agosto
            { inicio: new Date(añoActual, 9, 1), fin: new Date(añoActual, 9, 31), nombre: 'Período 3 (Octubre)', index: 2 }  // Octubre
          ]

          let creacionFueraTermino = false

          // Verificar para cada período si llegó tarde
          fechasPeriodos.forEach(fechas => {
            if (fechaCreacion > fechas.fin) {
              creacionFueraTermino = true
              // Llegó tarde a este período, verificar si no pudo cargar
              if (item.status[fechas.index] === 'Incompleto') {
                llegaronTardePorPeriodo[fechas.nombre]++
              }
            }
          })

          if (creacionFueraTermino) {
            // Verificar si no pudieron cargar en algún período
            const tieneAlgunPeriodoIncompleto = item.status.some(estado => estado === 'Incompleto')
            if (tieneAlgunPeriodoIncompleto) {
              noPudieronCargarFueraTermino++
            }
          }
        }

        // 3. Cargaron en período 1 pero no en períodos posteriores
        if (item.status[0] === 'Correcto' &&
            (item.status[1] === 'Incompleto' && item.status[2] === 'Incompleto')) {
          cargaronPeriodo1NoPeriodosPosteriores++
        }

        // 4. Llegaron tarde al período 1 pero subieron en períodos posteriores (incluye período 3)
        const fechaCreacion2 = parsearFechaSegura(item.createdAt)
        if (fechaCreacion2) {
          const añoActual = new Date().getFullYear()
          const finPeriodo1 = new Date(añoActual, 4, 31) // 31 de Mayo

          // Verificar si llegó tarde al período 1 (creó cuenta después del 31 de mayo)
          if (fechaCreacion2 > finPeriodo1) {
            // Verificar si subió algo en períodos posteriores (período 2 o 3)
            const subioEnPeriodosPosteriores = item.status[1] !== 'Incompleto' || item.status[2] !== 'Incompleto'
            if (subioEnPeriodosPosteriores) {
              llegaronTardePeriodo1PeroSubieronPosteriormente++
            }
          }
        }

        // 5. Llegaron a tiempo para cada período pero no subieron nada
        const fechaCreacion3 = parsearFechaSegura(item.createdAt)
        if (fechaCreacion3) {
          const añoActual = new Date().getFullYear()

          // Definir rangos de fechas para cada período (incluyendo meses intermedios)
          const rangosPeriodos = [
            {
              inicio: new Date(añoActual, 4, 1),
              fin: new Date(añoActual, 4, 31),
              nombre: 'Período 1 (Mayo)',
              index: 0
            }, // 1-31 Mayo
            {
              inicio: new Date(añoActual, 5, 1), // 1 Junio
              fin: new Date(añoActual, 7, 31),   // 31 Agosto
              nombre: 'Período 2 (Agosto)',
              index: 1
            }, // 1 Junio - 31 Agosto
            {
              inicio: new Date(añoActual, 8, 1), // 1 Septiembre
              fin: new Date(añoActual, 9, 31),   // 31 Octubre
              nombre: 'Período 3 (Octubre)',
              index: 2
            }  // 1 Septiembre - 31 Octubre
          ]

          // Para cada período, verificar si creó cuenta en el rango correspondiente pero no subió nada
          rangosPeriodos.forEach(rango => {
            // Creó cuenta en el rango de fechas correspondiente a este período
            if (fechaCreacion3 >= rango.inicio && fechaCreacion3 <= rango.fin) {
              // Pero no subió nada (estado es Incompleto)
              if (item.status[rango.index] === 'Incompleto') {
                llegaronATiempoPeroNoSubieron[rango.nombre]++
              }
            }
          })
        }
      }
    })

    estadisticasEspecificas = {
      porEstado: Object.entries(porEstado).sort((a, b) => b[1] - a[1]),
      porCuit: Object.entries(porCuit).sort((a, b) => b[1] - a[1]).slice(0, 10),
      porPeriodo: Object.entries(porPeriodo).map(([periodo, datos]) => ({
        periodo,
        conFacturas: datos.conFacturas,
        sinFacturas: datos.sinFacturas,
        total: datos.total
      })).sort((a, b) => a.periodo.localeCompare(b.periodo)),
      rechazosPorMotivoYPeriodo: rechazosPorMotivoYPeriodo,
      analisisEspecificos: {
        rechazoCategoriaPeroCargaronPosteriormente,
        noPudieronCargarFueraTermino,
        cargaronPeriodo1NoPeriodosPosteriores,
        llegaronTardePeriodo1PeroSubieronPosteriormente,
        llegaronTardePorPeriodo: llegaronTardePorPeriodo,
        llegaronATiempoPeroNoSubieron: llegaronATiempoPeroNoSubieron
      }
    }
  } else if (tipo === 'indices') {
    console.log('🔍 Debug índices en calcularEstadisticasDetalladas:', {
      itemsCount: items.length,
      itemsSample: items.slice(0, 2)
    })

    // Calcular evolución temporal de índices
    const evolucionTemporal = {}

    // Agrupar índices por categoría
    items.forEach(indice => {
      const categoria = indice.categoria || 'sin_categoria'
      if (!evolucionTemporal[categoria]) {
        evolucionTemporal[categoria] = []
      }

      evolucionTemporal[categoria].push({
        año: indice.año,
        mes: indice.mes,
        valor: parseFloat(indice.valor) || 0,
        periodo: `${indice.año}-${String(indice.mes).padStart(2, '0')}`
      })
    })

    // Ordenar cada categoría por año y mes
    Object.keys(evolucionTemporal).forEach(categoria => {
      evolucionTemporal[categoria].sort((a, b) => {
        if (a.año !== b.año) return a.año - b.año
        return a.mes - b.mes
      })
    })

    console.log('✅ Evolución temporal calculada:', {
      categorias: Object.keys(evolucionTemporal),
      totalIndices: items.length,
      evolucionSample: Object.keys(evolucionTemporal).slice(0, 2).reduce((acc, cat) => {
        acc[cat] = evolucionTemporal[cat].slice(0, 3)
        return acc
      }, {})
    })

    estadisticasEspecificas = {
      evolucionTemporal
    }
  }

  return {
    total,
    ultimos30Dias,
    ...estadisticasEspecificas
  }
}

module.exports = {


  // Obtener estadísticas por módulo usando endpoints existentes
  // Obtener datos raw sin filtros (una sola vez)
  getRawData: async (axios) => {
    try {
      const [
        habilitaciones,
        obras,
        turnos,
        pagosDobles,
        indices,
        multimedias,
        abiertoAnual,
        certificados,
        combustible,
        valesCombustible
      ] = await Promise.all([
        HabilitacionService.getAll(axios).catch(() => []),
        ObraService.getLatest(axios).catch(() => []),
        TurnoService.getAll(axios).catch(() => []),
        PagoDobleService.getAll(axios).catch(() => []),
        IndiceService.getLatest(axios).catch(() => []),
        MultimediaService.getLatest(axios).catch(() => []),
        AbiertoAnualService.getAll(axios).catch(() => []),
        CertificadoService.getLatest(axios).catch(() => []),
        CombustibleService.getLatest(axios).catch(() => []),
        CombustibleService.getAllVales(axios).catch(() => [])
      ])

      // Para obtener datos completos de obras (incluyendo certificados)
      let obrasCompletas = []
      try {
        const obrasResponse = await axios.$get('/obras')
        obrasCompletas = obrasResponse.data.map(item => ({
          id: item._id,
          expediente: item.expediente,
          objeto: item.objeto,
          presup_oficial: item.presup_oficial,
          adjudicado: item.adjudicado,
          proveedor: item.proveedor,
          cotizacion: item.cotizacion,
          items: item.items,
          certificados: item.certificados, // ✅ Incluir certificados completos
          garantia_contrato: item.garantia_contrato,
          adjudicacion: item.adjudicacion,
          contrato: item.contrato,
          fecha_contrato: item.fecha_contrato,
          acta_inicio: item.acta_inicio,
          ordenanza: item.ordenanza,
          decreto: item.decreto,
          plazo_obra: item.plazo_obra,
          anticipo_finan: item.anticipo_finan,
          ponderacion: item.ponderacion,
          createdAt: new Date(item.createdAt)
        }))
      } catch (error) {
        console.warn('No se pudieron obtener datos completos de obras:', error)
        obrasCompletas = obras
      }

      // Para obtener datos extendidos de habilitaciones (incluyendo localidad del solicitante)
      let habilitacionesExtendidas = []
      try {
        const habilitacionesResponse = await axios.$get('/habilitaciones')
        habilitacionesExtendidas = habilitacionesResponse.data.map(item => {
          const { finalizadaAt, finalizadaAtISO } = construirFechasFinalizacion(item)

          return {
            id: item._id,
            tipoSolicitud: item.solicitante?.tipoSolicitud,
            dni: item.solicitante?.dni,
            cuit: item.solicitante?.cuit,
            nroLegajo: item.nroLegajo,
            mail: item.solicitante?.mail,
            rubro: item.inmueble?.rubro,
            localidad: item.inmueble?.localidad,
            telefono: item.solicitante?.telefono,
            status: item.status,
            observaciones: item.observaciones,
            nroTramite: item.nroSolicitud,
            nroExpediente: item.nroExpediente,
            createdAt: new Date(item.createdAt).toLocaleDateString('es-AR'),
            createdAtISO: item.createdAt,
            updatedAt: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('es-AR') : null,
            updatedAtISO: item.updatedAt || null,
            finalizadaAt,
            finalizadaAtISO,
            localidadSolicitante: item.solicitante?.localidad || null
          }
        })
      } catch (error) {
        console.warn('No se pudieron obtener datos extendidos de habilitaciones:', error)
        habilitacionesExtendidas = habilitaciones
      }

      // Enriquecer turnos con tipo de solicitud desde trámites comerciales
      let turnosEnriquecidos = turnos
      try {
        // Crear un mapa de trámites por nroTramite para búsqueda rápida
        const tramitesMap = new Map()
        habilitacionesExtendidas.forEach(tramite => {
          if (tramite.nroTramite) {
            tramitesMap.set(tramite.nroTramite, tramite)
          }
        })

        // Enriquecer turnos con información del trámite comercial
        turnosEnriquecidos = turnos.map(turno => {
          const tramiteAsociado = tramitesMap.get(turno.nroTramite)
          return {
            ...turno,
            tipoSolicitud: tramiteAsociado?.tipoSolicitud || 'No especificado'
          }
        })
      } catch (error) {
        console.warn('No se pudieron enriquecer los turnos:', error)
        turnosEnriquecidos = turnos
      }

      // Devolver solo los datos raw, sin calcular estadísticas
      return {
        habilitaciones: habilitacionesExtendidas || [],
        obras: obrasCompletas || [],
        turnos: turnosEnriquecidos || [],
        pagosDobles: pagosDobles || [],
        indices: indices || [],
        multimedias: multimedias || [],
        abiertoAnual: abiertoAnual || [],
        certificados: certificados || [],
        combustible: combustible || [],
        valesCombustible: valesCombustible || []
      }
    } catch (error) {
      console.error('Error al obtener datos raw:', error)
      throw error
    }
  },

  // Obtener estadísticas de usuarios desde endpoint no declarado
  getEstadisticasUsuarios: async (axios) => {
    try {
      // Hacer petición directa al endpoint de usuarios que no está declarado en axios
      const response = await axios.$get('https://redeterminacion-back.herokuapp.com/users')
      const usuarios = Array.isArray(response) ? response : (response.data || [])


      // Calcular estadísticas de usuarios basado en la estructura real
      const totalUsuarios = usuarios.length

      // Contar usuarios activos (asumiendo que si tienen username están activos)
      const usuariosActivos = usuarios.filter(usuario => usuario.username && usuario.username.trim() !== '').length

      // Contar usuarios por año de creación
      const porAño = usuarios.reduce((acc, usuario) => {
        if (usuario.createdAt) {
          const fechaCreacion = new Date(usuario.createdAt)
          const año = fechaCreacion.getFullYear()

          if (año === 2023) {
            acc.año2023 = (acc.año2023 || 0) + 1
          } else if (año === 2024) {
            acc.año2024 = (acc.año2024 || 0) + 1
          } else if (año === 2025) {
            acc.año2025 = (acc.año2025 || 0) + 1
          }
        }
        return acc
      }, { año2023: 0, año2024: 0, año2025: 0 })

      // Contar por rol usando el campo admin
      const porRol = usuarios.reduce((acc, usuario) => {
        // El campo admin contiene el tipo de admin en minúscula
        const tipoAdmin = usuario.admin

        if (tipoAdmin === true || tipoAdmin === 'true' || tipoAdmin === 'master') {
          acc.master = (acc.master || 0) + 1
        } else if (tipoAdmin === 'hacienda') {
          acc.hacienda = (acc.hacienda || 0) + 1
        } else if (tipoAdmin === 'comercio') {
          acc.comercio = (acc.comercio || 0) + 1
        } else if (tipoAdmin === 'arvige') {
          acc.arvige = (acc.arvige || 0) + 1
        } else if (tipoAdmin === 'inspeccion') {
          acc.inspeccion = (acc.inspeccion || 0) + 1
        } else if (tipoAdmin === 'recaudaciones') {
          acc.recaudaciones = (acc.recaudaciones || 0) + 1
        } else if (tipoAdmin === 'modernizacion') {
          acc.modernizacion = (acc.modernizacion || 0) + 1
        } else if (tipoAdmin === 'compras') {
          acc.compras = (acc.compras || 0) + 1
        } else if (tipoAdmin === 'cultura') {
          acc.cultura = (acc.cultura || 0) + 1
        } else {
          // Si no coincide con ningún tipo conocido, lo clasificamos como otros
          acc.otros = (acc.otros || 0) + 1
        }
        return acc
      }, {})


      return {
        activos: usuariosActivos,
        total: totalUsuarios,
        porRol,
        porAño
      }
    } catch (error) {
      console.error('Error al obtener estadísticas de usuarios:', error);
      // Si falla, retornar datos simulados
      return {
        activos: 0,
        total: 0,
        porRol: {
          master: 0,
          hacienda: 0,
          comercio: 0,
          arvige: 0,
          inspeccion: 0,
          recaudaciones: 0,
          modernizacion: 0,
          compras: 0,
          cultura: 0,
          otros: 0
        },
        porAño: {
          año2023: 0,
          año2024: 0,
          año2025: 0
        }
      }
    }
  },

  // Obtener estadísticas desde datos raw (sin filtro)
  getEstadisticasPorModuloFromRaw: async (rawData) => {
    try {
      const {
        habilitaciones = [],
        obras = [],
        turnos = [],
        pagosDobles = [],
        indices = [],
        multimedias = [],
        abiertoAnual = [],
        certificados = [],
        combustible = [],
        valesCombustible = []
      } = rawData || {}

      // Calcular estadísticas detalladas por módulo
      const comercio = calcularEstadisticasDetalladas(habilitaciones, 'habilitaciones')
      const abiertoAnualStats = calcularEstadisticasDetalladas(abiertoAnual, 'abiertoAnual')
      const estadisticasObras = calcularEstadisticasDetalladas(obras, 'obras', [], certificados)
      const estadisticasPagosDobles = calcularEstadisticasDetalladas(pagosDobles, 'pagosDobles')
      const estadisticasCombustible = calcularEstadisticasDetalladas(combustible, 'combustible', valesCombustible)
      const estadisticasTurnos = calcularEstadisticasDetalladas(turnos, 'turnos')
      const estadisticasIndices = calcularEstadisticasDetalladas(indices, 'indices')
      const estadisticasMultimedias = calcularEstadisticasDetalladas(multimedias, 'multimedias')
      const estadisticasCertificados = calcularEstadisticasDetalladas(certificados, 'certificados')

      return {
        comercio,
        abiertoAnual: abiertoAnualStats,
        obras: estadisticasObras,
        recaudaciones: estadisticasPagosDobles,
        combustible: estadisticasCombustible,
        turnos: estadisticasTurnos,
        indices: estadisticasIndices,
        multimedias: estadisticasMultimedias,
        certificados: estadisticasCertificados
      }
    } catch (error) {
      console.error('Error al calcular estadísticas desde datos raw:', error)
      throw error
    }
  },

  // Obtener estadísticas filtradas por fecha desde datos raw
  getEstadisticasPorModuloFiltered: async (rawData, { startDate, endDate }) => {
    try {
      const {
        habilitaciones = [],
        obras = [],
        turnos = [],
        pagosDobles = [],
        indices = [],
        multimedias = [],
        abiertoAnual = [],
        certificados = [],
        combustible = [],
        valesCombustible = []
      } = rawData || {}

      // Función helper para filtrar por fecha con normalización
      const filtrarPorFecha = (items, dateField = 'createdAt') => {
        if (!Array.isArray(items)) return []
        return items.filter(item => {
          if (!item || !item[dateField]) return false

          // Normalizar fechas para comparación consistente
          const itemDate = normalizarFecha(item[dateField])
          const startDateNormalized = normalizarFecha(startDate)
          const endDateNormalized = normalizarFecha(endDate)

          if (!itemDate || !startDateNormalized || !endDateNormalized) {
            console.warn('Fecha inválida en filtrado:', {
              itemId: item.id,
              dateField,
              itemDate: item[dateField],
              parsedDate: itemDate,
              startDate,
              endDate
            })
            return false
          }

          return itemDate >= startDateNormalized && itemDate <= endDateNormalized
        })
      }

      // Debug: Verificar formatos de fecha en los datos
      console.log('🔍 Debug formatos de fecha:', {
        habilitaciones: habilitaciones.slice(0, 2).map(h => ({ id: h.id, createdAt: h.createdAt, type: typeof h.createdAt })),
        obras: obras.slice(0, 2).map(o => ({ id: o.id, createdAt: o.createdAt, type: typeof o.createdAt })),
        turnos: turnos.slice(0, 2).map(t => ({ id: t.id, createdAt: t.createdAt, type: typeof t.createdAt })),
        pagosDobles: pagosDobles.slice(0, 2).map(p => ({ id: p.id, createdAt: p.createdAt, type: typeof p.createdAt })),
        combustible: combustible.slice(0, 2).map(c => ({ id: c.id, createdAt: c.createdAt, type: typeof c.createdAt }))
      })

      // Filtrar solo los módulos específicos que queremos filtrar por fecha:
      // ✅ Comercio (habilitaciones) - SÍ filtrar
      // ✅ Obras - SÍ filtrar
      // ✅ Turnos - SÍ filtrar
      // ✅ Recaudaciones (pagos dobles) - SÍ filtrar
      // ✅ Combustible - SÍ filtrar
      // ❌ Índices - NO filtrar (mantener todos)
      // ❌ Multimedia - NO filtrar (mantener todos)
      // ❌ Abierto Anual - NO filtrar (mantener todos)
      // ❌ Certificados - NO filtrar (mantener todos)
      // ❌ Usuarios - NO filtrar (mantener todos)

      const habilitacionesFiltradas = filtrarPorFecha(habilitaciones)
      const obrasFiltradas = filtrarPorFecha(obras)
      const turnosFiltrados = filtrarPorFecha(turnos)
      const pagosDoblesFiltrados = filtrarPorFecha(pagosDobles)
      const combustibleFiltrado = filtrarPorFecha(combustible)
      const valesCombustibleFiltrados = filtrarPorFecha(valesCombustible)

      // Mantener sin filtrar: índices, multimedia, abierto anual, certificados
      const indicesFiltrados = indices
      const multimediasFiltradas = multimedias
      const abiertoAnualFiltrado = abiertoAnual
      const certificadosFiltrados = certificados

      // Calcular estadísticas con datos filtrados
      // Para comercio: usar datos filtrados pero pasar datos sin filtrar para el gráfico de trámites por mes
      const comercio = calcularEstadisticasDetalladas(habilitacionesFiltradas, 'habilitaciones', [], [], habilitaciones)
      const abiertoAnualStats = calcularEstadisticasDetalladas(abiertoAnualFiltrado, 'abiertoAnual')
      const estadisticasObras = calcularEstadisticasDetalladas(obrasFiltradas, 'obras', [], certificadosFiltrados)
      const estadisticasPagosDobles = calcularEstadisticasDetalladas(pagosDoblesFiltrados, 'pagosDobles')
      const estadisticasCombustible = calcularEstadisticasDetalladas(combustibleFiltrado, 'combustible', valesCombustibleFiltrados)
      const estadisticasTurnos = calcularEstadisticasDetalladas(turnosFiltrados, 'turnos')
      const estadisticasIndices = calcularEstadisticasDetalladas(indicesFiltrados, 'indices')
      const estadisticasMultimedias = calcularEstadisticasDetalladas(multimediasFiltradas, 'multimedias')
      const estadisticasCertificados = calcularEstadisticasDetalladas(certificadosFiltrados, 'certificados')

      return {
        comercio,
        abiertoAnual: abiertoAnualStats,
        obras: estadisticasObras,
        recaudaciones: estadisticasPagosDobles,
        combustible: estadisticasCombustible,
        turnos: estadisticasTurnos,
        indices: estadisticasIndices,
        multimedias: estadisticasMultimedias,
        certificados: estadisticasCertificados
      }
    } catch (error) {
      console.error('Error al calcular estadísticas filtradas:', error)
      throw error
    }
  }

};
