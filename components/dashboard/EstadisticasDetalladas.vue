<template>
  <div>
    <h4 class="section-title">
      <i class="bi bi-bar-chart-line mr-2"></i>
      Análisis Detallado por Módulo
    </h4>

    <!-- Comercio Detallado -->
    <b-card class="mb-4 dashboard-card" v-if="modulos?.comercio">
      <template #header>
        <div class="d-flex align-items-center">
          <i class="bi bi-shop-fill text-primary mr-2"></i>
          <strong>Comercio - Análisis Detallado</strong>
        </div>
      </template>

      <b-row>
        <b-col md="2" class="mb-3">
          <h6 class="text-dark mb-2 font-weight-bold">Por Estado</h6>
          <div v-for="(count, status) in modulos.comercio.porStatus" :key="status" class="d-flex justify-content-between mb-1">
            <span class="badge badge-light text-dark">{{ status }}</span>
            <strong class="text-primary">{{ count }}</strong>
          </div>
        </b-col>

        <b-col md="2" class="mb-3">
          <h6 class="text-dark mb-2 font-weight-bold">Top Rubros</h6>
          <div v-for="[rubro, count] in topRubros" :key="rubro" class="d-flex justify-content-between mb-1">
            <span class="text-truncate text-dark" :title="rubro">{{ rubro }}</span>
            <strong class="text-primary">{{ count }}</strong>
          </div>
        </b-col>

        <b-col md="2" class="mb-3">
          <h6 class="text-dark mb-2 font-weight-bold">Por Tipo Solicitud</h6>
          <div v-for="[tipo, count] in modulos.comercio.porTipoSolicitud" :key="tipo" class="d-flex justify-content-between mb-1">
            <span class="text-truncate text-dark" :title="tipo">{{ tipo }}</span>
            <strong class="text-primary">{{ count }}</strong>
          </div>
        </b-col>

        <b-col md="2" class="mb-3">
          <h6 class="text-dark mb-2 font-weight-bold">Por Localidad del Inmueble</h6>
          <div v-for="[localidad, count] in modulos.comercio.porLocalidadInmueble" :key="localidad" class="d-flex justify-content-between mb-1">
            <span class="text-truncate text-dark" :title="localidad">{{ localidad }}</span>
            <strong class="text-primary">{{ count }}</strong>
          </div>
        </b-col>

        <b-col md="2" class="mb-3">
          <h6 class="text-dark mb-2 font-weight-bold">Por Localidad del Solicitante</h6>
          <div v-for="[localidad, count] in topLocalidadesSolicitante" :key="localidad" class="d-flex justify-content-between mb-1">
            <span class="text-truncate text-dark" :title="localidad">{{ localidad }}</span>
            <strong class="text-primary">{{ count }}</strong>
          </div>
        </b-col>

      </b-row>

      <div class="mt-3 pt-3 border-top">
        <small class="text-dark">
          <i class="bi bi-info-circle mr-1"></i>
          Total: {{ modulos.comercio.total }} | Últimos 30 días: {{ modulos.comercio.ultimos30Dias }}
        </small>
      </div>
    </b-card>

    <!-- Todos los Rubros de Comercio -->
    <b-card class="mb-4 dashboard-card" v-if="modulos?.comercio && rubrosAgrupados.length > 0">
      <template #header>
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <i class="bi bi-list-ul text-primary mr-2"></i>
            <strong>Todos los Rubros - Trámites por Rubro</strong>
          </div>
          <b-badge variant="primary">{{ totalTramites }} trámites</b-badge>
        </div>
      </template>

      <div v-for="(grupo, grupoIndex) in rubrosAgrupadosPaginados" :key="grupoIndex" class="mb-4">
        <h6 class="text-dark mb-3 font-weight-bold border-bottom pb-2">
          <i class="bi bi-folder-fill mr-2"></i>{{ grupo.categoria }}
          <b-badge variant="secondary" class="ml-2">{{ grupo.totalTramites }}</b-badge>
        </h6>
        <div class="table-responsive">
          <b-table
            :items="grupo.rubros"
            :fields="rubrosFields"
            striped
            hover
            small
            class="mb-0"
          >
            <template #cell(rubro)="data">
              <span :title="data.value">{{ data.value }}</span>
            </template>
            <template #cell(cantidad)="data">
              <strong class="text-primary">{{ data.value }}</strong>
            </template>
          </b-table>
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
        <div>
          <small class="text-muted">
            Mostrando categoría {{ (currentPageRubros - 1) * perPageRubros + 1 }} -
            {{ Math.min(currentPageRubros * perPageRubros, rubrosAgrupados.length) }}
            de {{ rubrosAgrupados.length }} categorías
          </small>
        </div>
        <b-pagination
          v-model="currentPageRubros"
          :total-rows="rubrosAgrupados.length"
          :per-page="perPageRubros"
          size="sm"
          class="mb-0"
        />
      </div>
    </b-card>

    <!-- Abierto Anual Detallado -->
    <b-card class="mb-4 dashboard-card" v-if="modulos?.abiertoAnual">
      <template #header>
        <div class="d-flex align-items-center">
          <i class="bi bi-calendar-year-fill text-info mr-2"></i>
          <strong>Abierto Anual - Análisis Detallado</strong>
        </div>
      </template>

      <b-row>
        <b-col md="12" class="mb-3">
          <h6 class="text-dark mb-1 font-weight-bold">Por Estado</h6>
          <div v-for="[status, count] in modulos.abiertoAnual.porEstado" :key="status" class="d-flex align-items-center mb-2">
            <div class="d-flex align-items-center">
              <span v-for="(estado, index) in status.split(',')" :key="index" class="mr-1" :style="{ color: estadoColor(estado.trim()) }">
                <b-iconstack :title="estado.trim()">
                  <b-icon-circle variant="dark"></b-icon-circle>
                  <b-icon icon="circle-fill"></b-icon>
                </b-iconstack>
              </span>
            </div>
            <strong class="text-info ml-3">{{ count }}</strong>
          </div>
        </b-col>
      </b-row>

      <div class="mt-3 pt-3 border-top">
        <small class="text-dark">
          <i class="bi bi-info-circle mr-1"></i>
          Total: {{ modulos.abiertoAnual.total }} | Últimos 30 días: {{ modulos.abiertoAnual.ultimos30Dias }}
        </small>
      </div>
    </b-card>

    <!-- Obras Detallado -->
    <b-card class="mb-4 dashboard-card" v-if="modulos?.obras">
      <template #header>
        <div class="d-flex align-items-center">
          <i class="bi bi-building-fill text-success mr-2"></i>
          <strong>Obras - Análisis Detallado</strong>
        </div>
      </template>

      <b-row>
        <b-col md="6" class="mb-3">
          <h6 class="text-dark mb-2 font-weight-bold">Porcentaje de Ejecución</h6>
          <div class="d-flex justify-content-between mb-1">
            <span class="text-dark">Promedio:</span>
            <strong class="text-success">{{ modulos.obras.ejecucion?.porcentajePromedio || 0 }}%</strong>
          </div>
          <div class="d-flex justify-content-between mb-1">
            <span class="text-dark">Con certificados:</span>
            <strong class="text-success">{{ modulos.obras.ejecucion?.conCertificados || 0 }}</strong>
          </div>
          <div class="d-flex justify-content-between mb-1">
            <span class="text-dark">Sin certificados:</span>
            <strong class="text-success">{{ modulos.obras.ejecucion?.sinCertificados || 0 }}</strong>
          </div>
        </b-col>
        <b-col md="6" class="mb-3">
          <h6 class="text-dark mb-2 font-weight-bold">Cotización</h6>
          <div class="d-flex justify-content-between mb-1">
            <span class="text-dark">Promedio:</span>
            <strong class="text-primary">${{ formatearNumero(modulos.obras.cotizacionPromedio || 0) }}</strong>
          </div>
          <div class="d-flex justify-content-between mb-1">
            <span class="text-dark">Total:</span>
            <strong class="text-primary">${{ formatearNumero((modulos.obras.cotizacionPromedio || 0) * (modulos.obras.total || 0)) }}</strong>
          </div>
        </b-col>
      </b-row>

      <div class="mt-3 pt-3 border-top">
        <small class="text-dark">
          <i class="bi bi-info-circle mr-1"></i>
          Total: {{ modulos.obras.total }} | Últimos 30 días: {{ modulos.obras.ultimos30Dias }}
        </small>
      </div>
    </b-card>

    <!-- Pagos Dobles Detallado -->
    <b-card class="mb-4 dashboard-card" v-if="modulos?.recaudaciones">
      <template #header>
        <div class="d-flex align-items-center">
          <i class="bi bi-cash-stack-fill text-warning mr-2"></i>
          <strong>Pagos Dobles - Análisis Detallado</strong>
        </div>
      </template>

      <b-row>
        <b-col md="4" class="mb-3">
          <h6 class="text-dark mb-2 font-weight-bold">Por Estado</h6>
          <div v-for="(count, status) in modulos.recaudaciones.porStatus" :key="status" class="d-flex justify-content-between mb-1">
            <span class="badge badge-light text-dark">{{ status }}</span>
            <strong class="text-warning">{{ count }}</strong>
          </div>
        </b-col>

        <b-col md="4" class="mb-3">
          <h6 class="text-dark mb-2 font-weight-bold">Por Localidad</h6>
          <div v-for="[localidad, count] in modulos.recaudaciones.porLocalidad" :key="localidad" class="d-flex justify-content-between mb-1">
            <span class="text-truncate text-dark" :title="localidad">{{ localidad }}</span>
            <strong class="text-warning">{{ count }}</strong>
          </div>
        </b-col>

      </b-row>

      <div class="mt-3 pt-3 border-top">
        <small class="text-dark">
          <i class="bi bi-info-circle mr-1"></i>
          Total: {{ modulos.recaudaciones.total }} | Últimos 30 días: {{ modulos.recaudaciones.ultimos30Dias }}
        </small>
      </div>
    </b-card>


    <!-- Combustible Detallado -->
    <b-card class="mb-4 dashboard-card" v-if="modulos?.combustible">
      <template #header>
        <div class="d-flex align-items-center">
          <i class="bi bi-fuel-pump-fill text-danger mr-2"></i>
          <strong>Combustible - Análisis Detallado</strong>
        </div>
      </template>

      <b-row>
        <b-col md="4" class="mb-3">
          <h6 class="text-dark mb-2 font-weight-bold">Estadísticas de Vales</h6>
          <div class="d-flex justify-content-between mb-1">
            <span class="text-dark">Total vales:</span>
            <strong class="text-danger">{{ modulos.combustible.totalVales || 0 }}</strong>
          </div>
          <div class="d-flex justify-content-between mb-1">
            <span class="text-dark">Consumidos:</span>
            <strong class="text-warning">{{ modulos.combustible.valesConsumidos || 0 }}</strong>
          </div>
          <div class="d-flex justify-content-between mb-1">
            <span class="text-dark">Disponibles:</span>
            <strong class="text-success">{{ modulos.combustible.valesDisponibles || 0 }}</strong>
          </div>
          <div class="d-flex justify-content-between mb-1">
            <span class="text-dark">Anulados:</span>
            <strong class="text-secondary">{{ modulos.combustible.valesAnulados || 0 }}</strong>
          </div>
          <div class="d-flex justify-content-between mb-1">
            <span class="text-dark">Promedio vale:</span>
            <strong class="text-info">${{ formatearNumeroArgentino(modulos.combustible.valorPromedioVale || 0) }}</strong>
          </div>
        </b-col>

        <b-col md="4" class="mb-3">
          <h6 class="text-dark mb-2 font-weight-bold">Por Tipo Combustible</h6>
          <div v-for="tipo in modulos.combustible.porTipoCombustible" :key="tipo.tipo" class="d-flex justify-content-between mb-1">
            <span class="text-truncate text-dark" :title="tipo.tipo">{{ tipo.tipo }}</span>
            <strong class="text-danger">{{ tipo.total }}</strong>
          </div>
        </b-col>

        <b-col md="4" class="mb-3">
          <h6 class="text-dark mb-2 font-weight-bold">Resumen General</h6>
          <div class="d-flex justify-content-between mb-1">
            <span class="text-dark">Total órdenes:</span>
            <strong class="text-danger">{{ modulos.combustible.total || 0 }}</strong>
          </div>
          <div class="d-flex justify-content-between mb-1">
            <span class="text-dark">Últimos 30 días:</span>
            <strong class="text-warning">{{ modulos.combustible.ultimos30Dias || 0 }}</strong>
          </div>
        </b-col>

      </b-row>

      <b-row class="mt-3">
        <b-col md="12" class="mb-3">
          <h6 class="text-dark mb-2 font-weight-bold">Resumen Financiero</h6>
          <div class="row">
            <div class="col-md-3">
              <div class="d-flex justify-content-between mb-1">
                <span class="text-dark">Total órdenes:</span>
                <strong class="text-danger">${{ formatearNumeroArgentino(modulos.combustible.montoTotalOrdenes || 0) }}</strong>
              </div>
            </div>
            <div class="col-md-3">
              <div class="d-flex justify-content-between mb-1">
                <span class="text-dark">Saldo restante órdenes:</span>
                <div class="text-right">
                  <strong class="text-danger">${{ formatearNumeroArgentino(modulos.combustible.saldoRestanteVales || 0) }}</strong>
                  <small class="text-muted d-block">
                    <i class="bi bi-info-circle mr-1"></i>
                    {{ modulos.combustible.metodoCalculoSaldo === 'ordenes' ? 'Calculado desde órdenes' : 'Calculado desde vales disponibles' }}
                  </small>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="d-flex justify-content-between mb-1">
                <span class="text-dark">Vales generados:</span>
                <strong class="text-danger">{{ modulos.combustible.totalValesGenerados || 0 }}</strong>
              </div>
            </div>
            <div class="col-md-3">
              <div class="d-flex justify-content-between mb-1">
                <span class="text-dark">Promedio vales/orden:</span>
                <strong class="text-danger">{{ (modulos.combustible.promedioValesPorOrden || 0).toFixed(1) }}</strong>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-3">
              <div class="d-flex justify-content-between mb-1">
                <span class="text-dark">Monto promedio orden:</span>
                <strong class="text-danger">${{ formatearNumeroArgentino(modulos.combustible.montoPromedioOrden || 0) }}</strong>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>

      <div class="mt-3 pt-3 border-top">
        <small class="text-dark">
          <i class="bi bi-info-circle mr-1"></i>
          Total: {{ modulos.combustible.total }} | Últimos 30 días: {{ modulos.combustible.ultimos30Dias }}
        </small>
      </div>
    </b-card>

    <!-- Turnos Detallado -->
    <b-card class="mb-4 dashboard-card" v-if="modulos?.turnos">
      <template #header>
        <div class="d-flex align-items-center">
          <i class="bi bi-calendar-check-fill text-warning mr-2"></i>
          <strong>Turnos - Análisis Detallado</strong>
        </div>
      </template>

      <b-row>
        <b-col md="6" class="mb-3">
          <h6 class="text-dark mb-3 font-weight-bold">Por Estado</h6>
          <div v-for="(count, status) in modulos.turnos.porStatus" :key="status" class="d-flex justify-content-between align-items-center mb-2">
            <span class="text-dark">{{ status }}</span>
            <strong class="text-warning h5">{{ count }}</strong>
          </div>
        </b-col>

        <b-col md="6" class="mb-3">
          <h6 class="text-dark mb-3 font-weight-bold">Por Tipo de Trámite</h6>
          <div v-for="(count, tipo) in modulos.turnos.porTipoTramite" :key="tipo" class="d-flex justify-content-between align-items-center mb-2">
            <span class="text-truncate text-dark" :title="tipo">{{ tipo }}</span>
            <strong class="text-warning h5">{{ count }}</strong>
          </div>
        </b-col>
      </b-row>

      <div class="mt-3 pt-3 border-top">
        <small class="text-dark">
          <i class="bi bi-info-circle mr-1"></i>
          Total: {{ modulos.turnos.total }} | Últimos 30 días: {{ modulos.turnos.ultimos30Dias }}
        </small>
      </div>
    </b-card>

  </div>
</template>

<script>
export default {
  name: 'EstadisticasDetalladas',
  props: {
    modulos: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      currentPageRubros: 1,
      perPageRubros: 10,
      rubrosFields: [
        {
          key: 'rubro',
          label: 'Rubro',
          sortable: true,
          thClass: 'text-left',
          tdClass: 'text-left'
        },
        {
          key: 'cantidad',
          label: 'Cantidad de Trámites',
          sortable: true,
          thClass: 'text-right',
          tdClass: 'text-right'
        }
      ],
      categoriasRubros: {
        'HOTELERÍA': [
          'apart-hotel', 'cabaña', 'cama y desayuno', 'casa o departamento con servicios',
          'glamping', 'hostel', 'hotel', 'hostería', 'hotel boutique', 'residencial'
        ],
        'GASTRONÓMICOS': [
          'café-concert', 'cafetería', 'bar', 'casa de té', 'panchería', 'hamburguesería',
          'peña', 'restaurante', 'pizzería'
        ],
        'ELABORADOS': [
          'comidas para llevar', 'heladería', 'panadería',
          'elaboración y venta de pan'
        ],
        'FRESCOS / CÁRNICOS': [
          'carnicería', 'pescadería', 'venta de productos de granja'
        ],
        'VENTA DE ARTÍCULOS REGIONALES': [
          'venta de artículos regionales', 'elaboración y venta de alfajores', 'chocolates',
          'elaboración y venta de bebidas alcohólicas artesanales'
        ],
        'OTROS': [] // Para rubros que no encajan en las categorías anteriores
      }
    }
  },
  computed: {
            topRubros() {
              if (!this.modulos.comercio?.porRubroCompleto) return []
              return this.modulos.comercio.porRubroCompleto.slice(0, 10)
            },
    topLocalidadesSolicitante() {
      if (!this.modulos.comercio?.porLocalidadSolicitante) return []
      return this.modulos.comercio.porLocalidadSolicitante.slice(0, 10)
    },
    todosLosRubros() {
      if (!this.modulos.comercio?.porRubroCompleto) return []
      return this.modulos.comercio.porRubroCompleto.map(([rubro, cantidad]) => ({
        rubro,
        cantidad
      }))
    },
    rubrosAgrupados() {
      if (!this.modulos.comercio?.porRubroCompleto) return []

      const grupos = {}

      // Inicializar grupos
      Object.keys(this.categoriasRubros).forEach(categoria => {
        grupos[categoria] = []
      })

      // Agrupar rubros
      this.modulos.comercio.porRubroCompleto.forEach(([rubro, cantidad]) => {
        let categoriaEncontrada = false
        const rubroNormalizado = this.normalizarTexto(rubro)

        // Buscar en cada categoría (excepto OTROS)
        for (const [categoria, rubrosCategoria] of Object.entries(this.categoriasRubros)) {
          if (categoria === 'OTROS') continue

          // Buscar coincidencia exacta o parcial
          const encontrado = rubrosCategoria.some(rubroCategoria => {
            const categoriaNormalizada = this.normalizarTexto(rubroCategoria)
            // Coincidencia exacta o si el rubro contiene palabras clave de la categoría
            return rubroNormalizado === categoriaNormalizada ||
                   rubroNormalizado.includes(categoriaNormalizada) ||
                   categoriaNormalizada.includes(rubroNormalizado)
          })

          if (encontrado) {
            grupos[categoria].push({ rubro, cantidad })
            categoriaEncontrada = true
            break
          }
        }

        // Si no se encontró categoría, poner en OTROS
        if (!categoriaEncontrada) {
          grupos['OTROS'].push({ rubro, cantidad })
        }
      })

      // Convertir a array y ordenar por cantidad total de trámites
      const categoriasOrdenadas = Object.entries(grupos)
        .filter(([categoria, rubros]) => rubros.length > 0)
        .map(([categoria, rubros]) => ({
          categoria,
          rubros: rubros.sort((a, b) => b.cantidad - a.cantidad),
          totalTramites: rubros.reduce((sum, r) => sum + r.cantidad, 0)
        }))
        .sort((a, b) => {
          // Si una es OTROS, siempre va al final
          if (a.categoria === 'OTROS') return 1
          if (b.categoria === 'OTROS') return -1
          // Ordenar por total de trámites (mayor a menor)
          return b.totalTramites - a.totalTramites
        })

      return categoriasOrdenadas
    },
    rubrosAgrupadosPaginados() {
      const inicio = (this.currentPageRubros - 1) * this.perPageRubros
      const fin = inicio + this.perPageRubros
      return this.rubrosAgrupados.slice(inicio, fin)
    },
    totalTramites() {
      if (!this.modulos.comercio?.porRubroCompleto) return 0
      return this.modulos.comercio.porRubroCompleto.reduce((sum, [, cantidad]) => sum + cantidad, 0)
    }
  },
  methods: {
    formatearNumero(numero) {
      if (!numero || isNaN(numero)) return '0'
      return new Intl.NumberFormat('es-AR').format(Math.round(numero))
    },
    formatearNumeroArgentino(numero) {
      if (!numero || isNaN(numero)) return '0'
      return new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(numero)
    },
    estadoColor(estado) {
      switch (estado) {
        case 'Incorrecto':
          return 'red'
        case 'Correcto':
          return 'green'
        case 'En revisión':
          return '#FADD1A'
        default:
          return 'lightgrey'
      }
    },
    normalizarTexto(texto) {
      if (!texto) return ''
      return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .trim()
    }
  }
}
</script>

<style scoped>
.dashboard-card {
  background: white;
  border-radius: 15px;
  border: none;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.dashboard-card .card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 2px solid #dee2e6;
  border-radius: 15px 15px 0 0 !important;
  padding: 1.25rem 1.5rem;
}

.dashboard-card .card-header h4, .dashboard-card .card-header h5 {
  margin: 0;
  font-weight: 600;
  color: #495057;
}

.dashboard-card .card-header i {
  font-size: 1.2em;
}

.dashboard-card .card-body {
  padding: 1.5rem;
}

.section-title {
  color: #495057;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

.section-title i {
  color: #28a745;
  margin-right: 0.5rem;
}

.badge {
  font-size: 0.75rem;
}

.text-truncate {
  max-width: 150px;
}

</style>
