<template>
  <div class="page dashboard-container">
    <div class="container-fluid py-4 mt-4" v-if="adminMaster">
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

    <!-- Loading State -->
    <div v-if="loading && !estadisticasGenerales" class="text-center py-5">
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

    <!-- Contenido Principal con Pestañas -->
    <div v-if="!loading || estadisticasModulos">
      <DashboardTabs
        :modulos="estadisticasModulos"
        :estadisticas-usuarios="estadisticasUsuarios"
        :vehiculos="vehiculos"
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
    estadisticasUsuarios() {
      return this.$store.state.estadisticas.estadisticasUsuarios
    },
    vehiculos() {
      return this.$store.state.vehiculos.all || []
    },
    adminMaster() {
      return this.$store.state.user.admin === 'master'
    }
  },
  async mounted() {
    // Cargar datos iniciales
    await this.cargarDatos()
  },
  methods: {
    async cargarDatos() {
      try {
        await this.$store.dispatch('estadisticas/fetchAllEstadisticas')
        await this.$store.dispatch('vehiculos/getAll')
      } catch (error) {
        this.error = 'Error al cargar las estadísticas. Verifique la conexión con el servidor.'
        console.error('Error cargando estadísticas:', error)
      }
    },
    async actualizarDatos() {
      await this.cargarDatos()
    },
    onDateRangeChanged(dateRange) {
      this.selectedDateRange = dateRange
      console.log('Rango de fechas seleccionado:', dateRange)

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
      await this.cargarDatos()
    },

    async cargarDatosConFiltro(dateRange) {
      try {
        // Mostrar loading
        this.$store.commit('estadisticas/setLoading', true)

        // Aquí puedes implementar la lógica para filtrar por fechas
        // Por ejemplo, pasar los parámetros de fecha al store
        await this.$store.dispatch('estadisticas/fetchAllEstadisticas', {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        })

        console.log('Datos recargados con filtro:', {
          desde: dateRange.startDate,
          hasta: dateRange.endDate,
          días: dateRange.days
        })

      } catch (error) {
        this.error = 'Error al aplicar el filtro de fechas'
        console.error('Error aplicando filtro:', error)

        this.$bvToast.toast('Error al aplicar el filtro', {
          title: 'Error',
          variant: 'danger',
          solid: true,
          toaster: 'b-toaster-top-right'
        })
      }
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
/* Estilos específicos para el Dashboard */
.dashboard-container {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

.dashboard-header {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(40, 167, 69, 0.3);
}

.dashboard-header h2 {
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.dashboard-header p {
  opacity: 0.9;
  margin-bottom: 0;
}

.btn-refresh {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border: none;
  border-radius: 25px;
  padding: 0.5rem 1.5rem;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-refresh:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.4);
}

.btn-refresh:disabled {
  opacity: 0.6;
  transform: none;
  box-shadow: none;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.container-fluid {
  padding-top: 80px; /* Espacio para el navbar fijo */
}

.fade-in {
  animation: fadeIn 0.6s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.alert-info {
  border-radius: 15px;
  border: none;
  background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
  color: #0c5460;
}

.alert-info .alert-heading {
  color: #0c5460;
  font-weight: 600;
}

.alert-danger {
  border-radius: 15px;
  border: none;
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  color: #721c24;
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
}

.date-range-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
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
