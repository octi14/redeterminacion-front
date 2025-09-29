<template>
  <div class="user-activity-feed">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0">
        <b-icon-activity class="mr-2" />
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
    <div v-if="loading && activities.length === 0" class="text-center py-4">
      <b-spinner type="border" variant="primary" />
      <p class="mt-2 text-muted">Cargando actividades...</p>
    </div>

    <!-- Error state -->
    <b-alert v-if="error" variant="danger" show dismissible @dismissed="clearError">
      {{ error }}
    </b-alert>

    <!-- Activities list -->
    <div v-if="!loading || activities.length > 0">
      <div v-if="activities.length === 0" class="text-center py-5">
        <b-icon-inbox class="text-muted" size="3rem" />
        <p class="text-muted mt-3">No hay actividades registradas</p>
      </div>

      <div v-else class="activity-list">
        <div
          v-for="activity in activities"
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
                  <strong>{{ activity.userId }}</strong>
                  <small class="text-muted d-block">
                    {{ formatDate(activity.timestamp) }}
                  </small>
                </div>
              </div>
              <div class="activity-badge">
                <b-badge
                  :variant="getActivityVariant(activity.actionType)"
                  class="text-uppercase"
                >
                  {{ activity.actionType }}
                </b-badge>
              </div>
            </div>

            <div class="activity-body">
              <p class="mb-1">
                <strong>Tipo de Acción:</strong> {{ activity.actionType }}
              </p>
              <p class="mb-1">
                <strong>Resultado:</strong>
                <span :class="getResultClass(activity.actionResult)">
                  {{ activity.actionResult }}
                </span>
              </p>
              <div v-if="activity.visitedUrl" class="activity-details">
                <small class="text-muted">
                  <strong>URL:</strong>
                  <a :href="activity.visitedUrl" target="_blank" class="text-primary">
                    {{ truncateUrl(activity.visitedUrl) }}
                  </a>
                </small>
              </div>
            </div>

            <div class="activity-footer">
              <small class="text-muted">
                <b-icon-clock class="mr-1" />
                {{ formatFullDate(activity.timestamp) }}
              </small>
              <small v-if="activity.sessionId" class="text-muted ml-3">
                <b-icon-key class="mr-1" />
                Sesión: {{ activity.sessionId }}
              </small>
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
    }
  },

  computed: {
    ...mapState('userActivities', ['all', 'recent', 'loading', 'error']),

    activities() {
      return this.showRecent ? this.recent : this.all
    }
  },

  async mounted() {
    await this.loadActivities()
  },

  methods: {
    ...mapActions('userActivities', ['getAll', 'getRecent', 'clearError']),

    async loadActivities() {
      if (this.showRecent) {
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
      const now = new Date()
      const diff = now - date

      // Menos de 1 minuto
      if (diff < 60000) {
        return 'Hace un momento'
      }

      // Menos de 1 hora
      if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000)
        return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
      }

      // Menos de 24 horas
      if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000)
        return `Hace ${hours} hora${hours > 1 ? 's' : ''}`
      }

      // Más de 24 horas
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
  border-radius: 8px;
  margin-bottom: 12px;
  background: #fff;
  transition: all 0.2s ease;
}

.activity-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transform: translateY(-1px);
}

.activity-content {
  padding: 16px;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.user-info {
  display: flex;
  align-items: center;
}

.activity-body {
  margin-bottom: 12px;
}

.activity-body p {
  margin-bottom: 4px;
  font-size: 0.9rem;
}

.activity-details {
  margin-top: 8px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #007bff;
}

.activity-footer {
  border-top: 1px solid #e9ecef;
  padding-top: 8px;
  margin-top: 8px;
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
