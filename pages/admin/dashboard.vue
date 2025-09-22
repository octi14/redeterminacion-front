<template>
  <div class="page dashboard-container">
    <div class="container-fluid py-4 mt-5" v-if="isAdminMaster">
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
    <b-alert variant="info" dismissible class="mb-4">
      <i class="bi bi-info-circle-fill mr-2"></i>
      <strong>Información:</strong> Este dashboard muestra estadísticas reales obtenidas de los endpoints existentes.
      Algunos datos como información de usuarios y documentos S3 requieren endpoints adicionales en el backend.
    </b-alert>

    <!-- Contenido Principal con Pestañas -->
    <div v-if="!loading || estadisticasGenerales">
      <DashboardTabs
        :modulos="estadisticasModulos"
        :estadisticas-generales="estadisticasGenerales"
        :estadisticas-usuarios="estadisticasUsuarios"
      />
    </div>
    </div>
  </div>
</template>

<script>
import DashboardTabs from '~/components/dashboard/DashboardTabs.vue'

export default {
  name: 'DashboardAdmin',
  components: {
    DashboardTabs
  },
  data() {
    return {
      error: null
    }
  },
  computed: {
    loading() {
      return this.$store.state.estadisticas.loading
    },
    estadisticasGenerales() {
      return this.$store.state.estadisticas.estadisticasGenerales
    },
    estadisticasModulos() {
      return this.$store.state.estadisticas.estadisticasModulos
    },
    estadisticasUsuarios() {
      return this.$store.state.estadisticas.estadisticasUsuarios
    },
    isAdminMaster() {
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
      } catch (error) {
        this.error = 'Error al cargar las estadísticas. Verifique la conexión con el servidor.'
        console.error('Error cargando estadísticas:', error)
      }
    },
    async actualizarDatos() {
      await this.cargarDatos()
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
</style>
