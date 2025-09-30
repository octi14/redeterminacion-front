<template>
  <div class="user-activity-feed">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0">
        <b-icon-list-task class="mr-2" />
        Actividad de Usuarios
      </h4>
      <div class="d-flex align-items-center">
        <b-button
          variant="outline-primary"
          size="sm"
          @click="refreshActivities"
          :disabled="loading"
        >
          <b-icon-arrow-clockwise :class="{ 'spinning': loading }" />
          Actualizar
        </b-button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading && activitiesList.length === 0" class="text-center py-4">
      <b-spinner type="border" variant="primary" />
      <p class="mt-2 text-muted">Cargando actividades...</p>
    </div>

    <!-- Error state -->
    <b-alert v-if="error" variant="danger" show dismissible @dismissed="clearError">
      {{ error }}
    </b-alert>

    <!-- Activities list -->
    <div v-if="!loading || activitiesList.length > 0">
      <div v-if="activitiesList.length === 0" class="text-center py-5">
        <b-icon-inbox class="text-muted" size="3rem" />
        <p class="text-muted mt-3">No hay actividades registradas</p>
      </div>

      <div v-else class="activity-list">
        <div
          v-for="activity in activitiesList"
          :key="activity.id"
          class="activity-item"
        >
          <div class="activity-content">
            <div class="activity-header">
              <div class="user-info">
                <b-avatar
                  :text="getInitials(activity.userId)"
                  variant="primary"
                  size="sm"
                  class="mr-2"
                />
                <div>
                  <div class="user-name">{{ activity.userId }}</div>
                  <small class="text-muted">{{ formatDate(activity.timestamp) }}</small>
                </div>
              </div>
              <div class="activity-badge">
                <b-badge
                  :variant="getActivityVariant(activity.actionType)"
                  class="text-uppercase"
                  style="font-size: 0.7rem; padding: 0.25rem 0.5rem;"
                >
                  {{ activity.actionType }}
                </b-badge>
              </div>
            </div>

            <div class="activity-body">
              <div class="activity-summary">
                <span :class="getResultClass(activity.actionResult)" class="result-text">
                  {{ activity.actionResult }}
                </span>
                <span v-if="activity.visitedUrl" class="url-info">
                  <a :href="activity.visitedUrl" target="_blank" class="text-primary">
                    {{ truncateUrl(activity.visitedUrl) }}
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'UserActivityFeed',
  props: {
    limit: {
      type: Number,
      default: 50
    },
    showRecent: {
      type: Boolean,
      default: true
    },
    dateRange: {
      type: Object,
      default: null
    },
    activities: {
      type: Array,
      default: null
    }
  },

  computed: {
    ...mapState('userActivities', ['all', 'recent', 'filtered', 'loading', 'error']),

    activitiesList() {
      // Si se pasan actividades como prop, usarlas
      if (this.activities) {
        return this.activities.slice(0, this.limit)
      }

      // Si no, usar el store
      if (this.dateRange) {
        return this.filtered
      }
      return this.showRecent ? this.recent : this.all
    }
  },

  async mounted() {
    await this.loadActivities()
  },

  watch: {
    dateRange: {
      handler() {
        this.loadActivities()
      },
      deep: true
    }
  },

  methods: {
    ...mapActions('userActivities', ['getAll', 'getRecent', 'getFiltered', 'clearError']),

    async loadActivities() {
      // Si se pasan actividades como prop, no cargar desde el store
      if (this.activities) {
        return
      }

      if (this.dateRange && this.dateRange.startDate && this.dateRange.endDate) {
        await this.getFiltered({
          startDate: this.dateRange.startDate,
          endDate: this.dateRange.endDate,
          limit: this.limit
        })
      } else if (this.showRecent) {
        await this.getRecent({ limit: this.limit })
      } else {
        await this.getAll()
      }
    },

    async refreshActivities() {
      await this.loadActivities()
    },

    getInitials(userId) {
      if (!userId) return 'U'
      // Extraer la parte antes del @ para las iniciales
      const name = userId.split('@')[0]
      return name.charAt(0).toUpperCase()
    },

    formatDate(timestamp) {
      const date = new Date(timestamp)

      // Verificar que la fecha sea válida
      if (isNaN(date.getTime())) {
        return 'Fecha inválida'
      }

      // Mostrar siempre el horario
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    getActivityVariant(actionType) {
      const variants = {
        'LogIn': 'success',
        'LogOut': 'secondary',
        'Create': 'primary',
        'Update': 'warning',
        'Delete': 'danger',
        'View': 'info',
        'Download': 'info',
        'Upload': 'primary',
        'Aprobar Renovación': 'success',
        'Rechazar': 'danger',
        'Crear': 'primary',
        'Editar': 'warning',
        'Eliminar': 'danger'
      }
      return variants[actionType] || 'secondary'
    },

    getResultClass(actionResult) {
      if (actionResult.toLowerCase().includes('aprobada') || actionResult.toLowerCase().includes('exitoso') || actionResult.toLowerCase().includes('success')) {
        return 'text-success'
      }
      if (actionResult.toLowerCase().includes('rechazada') || actionResult.toLowerCase().includes('error') || actionResult.toLowerCase().includes('fallo')) {
        return 'text-danger'
      }
      return 'text-muted'
    },

    formatFullDate(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    },

    truncateUrl(url) {
      if (!url) return ''
      if (url.length > 50) {
        return url.substring(0, 47) + '...'
      }
      return url
    }
  }
}
</script>

<style scoped>
.user-activity-feed {
  max-width: 100%;
}

.activity-list {
  max-height: 600px;
  overflow-y: auto;
}

.activity-item {
  border: 1px solid #e9ecef;
  border-radius: 6px;
  margin-bottom: 8px;
  background: #fff;
  transition: all 0.2s ease;
}

.activity-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transform: translateY(-1px);
}

.activity-content {
  padding: 12px;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.2;
}

.activity-body {
  margin-bottom: 0;
}

.activity-summary {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.result-text {
  font-size: 0.9rem;
  font-weight: 500;
}

.url-info {
  font-size: 0.8rem;
}

.url-info a {
  text-decoration: none;
}

.url-info a:hover {
  text-decoration: underline;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .activity-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .activity-badge {
    margin-top: 8px;
  }

  .activity-content {
    padding: 12px;
  }
}
</style>
