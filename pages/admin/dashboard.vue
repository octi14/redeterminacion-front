<template>
  <div class="page main-background dashboard-container">
    <!-- Sin permisos: cartel de sección no disponible -->
    <div v-if="!adminMaster" class="dashboard-no-access">
      <div class="no-access-card">
        <div class="no-access-icon">
          <i class="bi bi-shield-lock-fill"></i>
        </div>
        <h1 class="no-access-title">Esta sección no está disponible</h1>
        <p class="no-access-subtitle">No tenés acceso a esta sección.</p>
        <NuxtLink to="/" class="btn btn-back-home">
          <i class="bi bi-house-door-fill mr-2"></i>
          Volver al inicio
        </NuxtLink>
      </div>
    </div>

    <div class="container-fluid py-4 mt-4" v-else>
      <!-- Header del Dashboard -->
      <div class="dashboard-header fade-in">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h2 class="mb-1">
              <i class="bi bi-speedometer2 mr-2"></i>
              Dashboard de Estadísticas
            </h2>
            <p class="mb-0">Panel de control administrativo</p>
          </div>
          <div>
            <button
              class="btn btn-refresh"
              @click="actualizarDatos"
              :disabled="loading"
            >
              <i class="bi bi-arrow-clockwise mr-1" :class="{ 'spinning': loading }"></i>
              Actualizar
            </button>
          </div>
        </div>
      </div>

    <!-- Loading State: solo cuando está cargando y aún no llegó ningún módulo -->
    <div v-if="loading && !tieneAlgunModulo" class="text-center py-5">
      <b-spinner variant="primary" label="Cargando..."></b-spinner>
      <p class="mt-3 text-muted">Cargando estadísticas del sistema...</p>
    </div>

    <!-- Error State -->
    <b-alert
      v-if="error"
      variant="danger"
      dismissible
      @dismissed="error = null"
      class="mb-4"
    >
      <i class="bi bi-exclamation-triangle-fill mr-2"></i>
      <strong>Error:</strong> {{ error }}
    </b-alert>

    <!-- Información sobre datos disponibles -->
    <b-alert variant="info" dismissible class="mb-4" show>
      <i class="bi bi-info-circle-fill mr-2"></i>
      <strong>Información:</strong> Este dashboard muestra estadísticas reales obtenidas de los endpoints existentes.
      Algunos datos como información de documentos S3 requieren endpoints adicionales en el backend.
    </b-alert>

    <!-- Selector de Rango de Fechas -->
    <div class="date-range-section mb-4">
      <b-card class="date-range-card">
        <template #header>
          <div class="d-flex align-items-center">
            <i class="bi bi-calendar-range text-primary mr-2"></i>
            <strong>Filtrar por Rango de Fechas</strong>
            <b-badge v-if="selectedDateRange" variant="success" class="ml-2">
              <i class="bi bi-funnel mr-1"></i>
              Filtro Activo
            </b-badge>
          </div>
        </template>

        <DateRangeSelector
          @date-range-changed="onDateRangeChanged"
          :default-range="dateRange"
        />

        <!-- Información del filtro activo -->
        <div v-if="selectedDateRange" class="active-filter-info mt-3 p-3 bg-light rounded">
          <div class="d-flex align-items-center mb-2">
            <i class="bi bi-info-circle text-info mr-2"></i>
            <strong>Filtro activo:</strong>
            <span class="ml-2">{{ formatDateRange(selectedDateRange) }}</span>
            <b-button
              variant="outline-danger"
              size="sm"
              class="ml-auto"
              @click="clearDateFilter"
            >
              <i class="bi bi-x-circle mr-1"></i>
              Quitar Filtro
            </b-button>
          </div>

          <!-- Módulos filtrados -->
          <div class="filtered-modules">
            <small class="text-muted d-block mb-1">Módulos filtrados por fecha:</small>
            <div class="d-flex flex-wrap gap-1">
              <b-badge variant="success" class="mr-1">Comercio</b-badge>
              <b-badge variant="success" class="mr-1">Obras</b-badge>
              <b-badge variant="success" class="mr-1">Turnos</b-badge>
              <b-badge variant="success" class="mr-1">Recaudaciones</b-badge>
              <b-badge variant="success" class="mr-1">Combustible</b-badge>
            </div>
          </div>
        </div>
      </b-card>
    </div>

    <!-- Contenido Principal con Pestañas: se muestra en cuanto hay permisos (carga progresiva por pestaña) -->
    <div>
      <DashboardTabs
        :modulos="estadisticasModulos"
        :estadisticas-usuarios="estadisticasUsuarios"
        :vehiculos="vehiculos"
        :habilitaciones="habilitaciones"
        :date-range="selectedDateRange"
      />
    </div>
    </div>
  </div>
</template>

<script>
import DashboardTabs from '~/components/dashboard/DashboardTabs.vue'
import DateRangeSelector from '~/components/dashboard/DateRangeSelector.vue'

export default {
  name: 'DashboardAdmin',
  components: {
    DashboardTabs,
    DateRangeSelector
  },
  data() {
    return {
      error: null,
      dateRange: 'last30days',
      selectedDateRange: null
    }
  },
  computed: {
    loading() {
      return this.$store.state.estadisticas.loading
    },
    estadisticasModulos() {
      return this.$store.state.estadisticas.estadisticasModulos
    },
    tieneAlgunModulo() {
      const modulos = this.$store.state.estadisticas.estadisticasModulos
      return modulos && Object.keys(modulos).length > 0
    },
    estadisticasUsuarios() {
      return this.$store.state.estadisticas.estadisticasUsuarios
    },
    vehiculos() {
      return this.$store.state.vehiculos.all || []
    },
    habilitaciones() {
      return this.$store.state.habilitaciones.all || []
    },
    adminMaster() {
      return this.$store.state.user.admin === 'master'
    }
  },
  mounted() {
    if (this.adminMaster) {
      this.cargarDatos()
    }
  },
  methods: {
    cargarDatos(payload = {}) {
      this.$store.dispatch('estadisticas/fetchAllEstadisticas', payload).catch((err) => {
        this.error = 'Error al cargar las estadísticas. Verifique la conexión con el servidor.'
        console.error('Error cargando estadísticas:', err)
      })
      this.$store.dispatch('vehiculos/getAll').catch(() => {})
      this.$store.dispatch('habilitaciones/getAll').catch(() => {})
    },
    actualizarDatos() {
      this.cargarDatos()
    },
    onDateRangeChanged(dateRange) {
      this.selectedDateRange = dateRange

      // Mostrar toast de confirmación
      this.$bvToast.toast('Filtro de fechas aplicado correctamente', {
        title: 'Filtro Aplicado',
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-top-right'
      })

      // Recargar datos con el nuevo filtro
      this.cargarDatosConFiltro(dateRange)
    },

    formatDateRange(dateRange) {
      if (!dateRange || !dateRange.startDate || !dateRange.endDate) return ''

      // Asegurar que las fechas sean objetos Date
      const startDate = dateRange.startDate instanceof Date ? dateRange.startDate : new Date(dateRange.startDate)
      const endDate = dateRange.endDate instanceof Date ? dateRange.endDate : new Date(dateRange.endDate)

      // Verificar que las fechas sean válidas
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return 'Fechas inválidas'
      }

      const start = startDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      const end = endDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })

      return `${start} - ${end} (${dateRange.days} días)`
    },

    async clearDateFilter() {
      this.selectedDateRange = null

      this.$bvToast.toast('Filtro de fechas removido', {
        title: 'Filtro Removido',
        variant: 'info',
        solid: true,
        toaster: 'b-toaster-top-right'
      })

      // Recargar datos sin filtro
      this.cargarDatos()
    },

    cargarDatosConFiltro(dateRange) {
      this.$store.dispatch('estadisticas/fetchAllEstadisticas', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      }).catch((error) => {
        this.error = 'Error al aplicar el filtro de fechas'
        console.error('Error aplicando filtro:', error)
        this.$bvToast.toast('Error al aplicar el filtro', {
          title: 'Error',
          variant: 'danger',
          solid: true,
          toaster: 'b-toaster-top-right'
        })
      })
    },
  },
  head() {
    return {
      title: 'Dashboard Admin - Hacienda Villa Gesell'
    }
  }
}
</script>

<style scoped>
.container-fluid {
  padding-top: 80px; /* Espacio para el navbar fijo */
}

/* Cartel de sección no disponible (solo adminMaster) */
.dashboard-no-access {
  min-height: calc(100vh - 80px);
  padding-top: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-access-card {
  max-width: 520px;
  padding: 3rem 2.5rem;
  text-align: center;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
  animation: noAccessFadeIn 0.5s ease-out;
}

@keyframes noAccessFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.no-access-icon {
  margin-bottom: 1.5rem;
}

.no-access-icon i {
  font-size: 4.5rem;
  color: #64748b;
  opacity: 0.9;
  display: inline-block;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.no-access-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.no-access-subtitle {
  font-size: 1.05rem;
  color: #475569;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.btn-back-home {
  display: inline-flex;
  align-items: center;
  padding: 0.6rem 1.25rem;
  background: linear-gradient(135deg, #0f766e 0%, #115e59 100%);
  color: #fff !important;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 14px rgba(15, 118, 110, 0.35);
}

.btn-back-home:hover {
  color: #fff !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(15, 118, 110, 0.45);
}

/* Estilos para el selector de fechas */
.date-range-section {
  animation: slideInDown 0.5s ease-out;
}

.date-range-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 15px;
  border: none;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
}

.date-range-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.date-range-card .card-body {
  position: relative;
  overflow: visible;
}

.date-range-card .card-header {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border-radius: 15px 15px 0 0 !important;
  border: none;
  padding: 1rem 1.5rem;
}

.date-range-card .card-header i {
  font-size: 1.2em;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
