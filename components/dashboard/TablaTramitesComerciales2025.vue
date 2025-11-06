<template>
  <div class="tabla-tramites-comerciales-2025">
    <b-card class="mb-4 shadow-sm">
      <template #header>
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <i class="bi bi-table text-primary mr-2"></i>
            <strong>Trámites Comerciales {{ anio }} - Por Mes y Tipo de Trámite</strong>
          </div>
          <b-badge variant="info" class="ml-2">
            Total: {{ totalTramites }}
          </b-badge>
        </div>
      </template>

      <div v-if="loading" class="text-center py-4">
        <b-spinner variant="primary" label="Cargando..."></b-spinner>
        <p class="mt-2 text-muted">Cargando datos...</p>
      </div>

      <div v-else-if="tablaDatos.length === 0" class="text-center py-4">
        <i class="bi bi-inbox text-muted" style="font-size: 3rem;"></i>
        <p class="mt-2 text-muted">No hay trámites comerciales para {{ anio }}</p>
      </div>

      <div v-else>
        <b-table
          :items="tablaDatos"
          :fields="fields"
          striped
          hover
          responsive
          class="tramites-table"
          :busy="loading"
        >
          <template #cell(mes)="row">
            <strong class="text-primary">{{ row.value }}</strong>
          </template>

          <template #cell(habilitacion)="row">
            <b-badge variant="success" pill>
              {{ row.value || 0 }}
            </b-badge>
          </template>

          <template #cell(baja)="row">
            <b-badge variant="danger" pill>
              {{ row.value || 0 }}
            </b-badge>
          </template>

          <template #cell(renovacion)="row">
            <b-badge variant="warning" pill>
              {{ row.value || 0 }}
            </b-badge>
          </template>

          <template #cell(reempadronamiento)="row">
            <b-badge variant="info" pill>
              {{ row.value || 0 }}
            </b-badge>
          </template>

          <template #cell(cambioTitular)="row">
            <b-badge variant="secondary" pill>
              {{ row.value || 0 }}
            </b-badge>
          </template>

          <template #cell(total)="row">
            <strong class="text-dark">{{ row.value }}</strong>
          </template>
        </b-table>

        <!-- Resumen por tipo de trámite -->
        <div class="mt-4">
          <h5 class="mb-3">
            <i class="bi bi-graph-up text-success mr-2"></i>
            Resumen por Tipo de Trámite
          </h5>
          <b-row>
            <b-col md="2" sm="4" class="mb-3">
              <div class="text-center p-3 border rounded bg-light">
                <div class="h4 text-success font-weight-bold mb-1">{{ resumenTotales.habilitacion }}</div>
                <div class="text-muted small">Habilitación</div>
              </div>
            </b-col>
            <b-col md="2" sm="4" class="mb-3">
              <div class="text-center p-3 border rounded bg-light">
                <div class="h4 text-danger font-weight-bold mb-1">{{ resumenTotales.baja }}</div>
                <div class="text-muted small">Baja</div>
              </div>
            </b-col>
            <b-col md="2" sm="4" class="mb-3">
              <div class="text-center p-3 border rounded bg-light">
                <div class="h4 text-warning font-weight-bold mb-1">{{ resumenTotales.renovacion }}</div>
                <div class="text-muted small">Renovación</div>
              </div>
            </b-col>
            <b-col md="2" sm="4" class="mb-3">
              <div class="text-center p-3 border rounded bg-light">
                <div class="h4 text-info font-weight-bold mb-1">{{ resumenTotales.reempadronamiento }}</div>
                <div class="text-muted small">Reempadronamiento</div>
              </div>
            </b-col>
            <b-col md="2" sm="4" class="mb-3">
              <div class="text-center p-3 border rounded bg-light">
                <div class="h4 text-secondary font-weight-bold mb-1">{{ resumenTotales.cambioTitular }}</div>
                <div class="text-muted small">Cambio de Titular</div>
              </div>
            </b-col>
          </b-row>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'TablaTramitesComerciales2025',
  props: {
    habilitaciones: {
      type: Array,
      default: () => []
    },
    anio: {
      type: Number,
      default: 2025
    }
  },
  data() {
    return {
      loading: false,
      fields: [
        {
          key: 'mes',
          label: 'Mes',
          sortable: true,
          thClass: 'text-center',
          tdClass: 'text-center'
        },
        {
          key: 'habilitacion',
          label: 'Habilitación',
          sortable: true,
          thClass: 'text-center',
          tdClass: 'text-center'
        },
        {
          key: 'baja',
          label: 'Baja',
          sortable: true,
          thClass: 'text-center',
          tdClass: 'text-center'
        },
        {
          key: 'renovacion',
          label: 'Renovación',
          sortable: true,
          thClass: 'text-center',
          tdClass: 'text-center'
        },
        {
          key: 'reempadronamiento',
          label: 'Reempadronamiento',
          sortable: true,
          thClass: 'text-center',
          tdClass: 'text-center'
        },
        {
          key: 'cambioTitular',
          label: 'Cambio de Titular',
          sortable: true,
          thClass: 'text-center',
          tdClass: 'text-center'
        },
        {
          key: 'total',
          label: 'Total',
          sortable: true,
          thClass: 'text-center bg-primary text-white',
          tdClass: 'text-center font-weight-bold'
        }
      ]
    }
  },
  computed: {
    // Filtrar habilitaciones del año especificado
    tramitesAnio() {
      if (!this.habilitaciones || this.habilitaciones.length === 0) {
        return []
      }

      return this.habilitaciones.filter(tramite => {
        if (!tramite.createdAt) return false

        const fecha = this.convertirFecha(tramite.createdAt)
        if (!fecha) return false

        // Verificar que sea del año especificado
        return fecha.getFullYear() === this.anio
      })
    },

    // Agrupar por mes y tipo de trámite
    tablaDatos() {
      const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ]

      // Inicializar estructura de datos por mes
      const datosPorMes = {}
      meses.forEach((mes, index) => {
        datosPorMes[index + 1] = {
          mes: mes,
          mesNumero: index + 1,
          habilitacion: 0,
          baja: 0,
          renovacion: 0,
          reempadronamiento: 0,
          cambioTitular: 0,
          total: 0
        }
      })

      // Procesar cada trámite
      this.tramitesAnio.forEach(tramite => {
        if (!tramite.createdAt || !tramite.tipoSolicitud) return

        const fecha = this.convertirFecha(tramite.createdAt)
        if (!fecha) return

        const mes = fecha.getMonth() + 1 // getMonth() devuelve 0-11

        if (!datosPorMes[mes]) return

        // Normalizar tipo de solicitud
        const tipoTramite = this.normalizarTipoTramite(tramite.tipoSolicitud)

        // Incrementar contador según el tipo
        if (datosPorMes[mes][tipoTramite] !== undefined) {
          datosPorMes[mes][tipoTramite]++
          datosPorMes[mes].total++
        }
      })

      // Convertir objeto a array y filtrar meses con datos
      return Object.values(datosPorMes)
        .filter(item => item.total > 0)
        .sort((a, b) => a.mesNumero - b.mesNumero)
    },

    // Total de trámites
    totalTramites() {
      return this.tramitesAnio.length
    },

    // Resumen total por tipo de trámite
    resumenTotales() {
      const resumen = {
        habilitacion: 0,
        baja: 0,
        renovacion: 0,
        reempadronamiento: 0,
        cambioTitular: 0
      }

      this.tramitesAnio.forEach(tramite => {
        if (!tramite.tipoSolicitud) return

        const tipoTramite = this.normalizarTipoTramite(tramite.tipoSolicitud)

        if (resumen[tipoTramite] !== undefined) {
          resumen[tipoTramite]++
        }
      })

      return resumen
    }
  },
  methods: {
    // Normalizar el nombre del tipo de trámite
    normalizarTipoTramite(tipo) {
      const tipos = {
        'Habilitación': 'habilitacion',
        'Baja': 'baja',
        'Renovación': 'renovacion',
        'Reempadronamiento': 'reempadronamiento',
        'Cambio de Titular': 'cambioTitular'
      }

      return tipos[tipo] || tipo.toLowerCase()
    },

    // Convertir fecha a objeto Date
    convertirFecha(createdAt) {
      if (!createdAt) return null

      let fecha

      // Convertir createdAt a Date dependiendo del formato
      if (typeof createdAt === 'string') {
        // Si es string con formato DD/MM/YYYY o ISO
        if (createdAt.includes('/')) {
          // Formato DD/MM/YYYY
          const partes = createdAt.split('/')
          if (partes.length === 3) {
            fecha = new Date(partes[2], partes[1] - 1, partes[0])
          } else {
            fecha = new Date(createdAt)
          }
        } else {
          // Formato ISO u otro
          fecha = new Date(createdAt)
        }
      } else if (createdAt instanceof Date) {
        fecha = createdAt
      } else {
        // Si tiene formato de timestamp o objeto con propiedades
        fecha = new Date(createdAt)
      }

      // Verificar que sea una fecha válida
      if (!(fecha instanceof Date) || isNaN(fecha.getTime())) {
        return null
      }

      return fecha
    }
  }
}
</script>

<style scoped>
.tabla-tramites-comerciales-2025 {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tramites-table {
  font-size: 0.9rem;
}

.tramites-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
}

.tramites-table tbody tr:hover {
  background-color: #f1f3f5;
  transition: background-color 0.2s;
}

.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}
</style>
