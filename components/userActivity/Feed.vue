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
        <div class="activity-grid">
          <div
            v-for="activity in activitiesList"
            :key="activity.id"
            class="activity-item"
          >
          <div class="activity-content">
            <!-- Primera fila: Avatar, Usuario, Tipo de actividad, Fecha -->
            <div class="activity-row activity-main">
              <div class="user-info">
                <b-avatar
                  :text="getInitials(activity.userId)"
                  variant="primary"
                  size="sm"
                  class="mr-3"
                />
                <div class="user-details">
                  <div class="user-name">{{ getDisplayName(activity.userId) }}</div>
                  <div class="activity-type">
                    <b-badge
                      :variant="getActivityVariant(activity.actionType)"
                      class="text-uppercase"
                      style="font-size: 0.7rem; padding: 0.25rem 0.5rem;"
                    >
                      {{ activity.actionType }}
                    </b-badge>
                  </div>
                </div>
              </div>
              <div class="activity-meta">
                <div class="timestamp">{{ formatDate(activity.timestamp) }}</div>
              </div>
            </div>

            <!-- Segunda fila: Resultado de la acción -->
            <div class="activity-row activity-result">
              <div class="result-content">
                <span :class="getResultClass(activity.actionResult)" class="result-text">
                  {{ activity.actionResult }}
                </span>
              </div>
            </div>

            <!-- Tercera fila: URL (si existe) -->
            <div v-if="activity.visitedUrl" class="activity-row activity-url">
              <div class="url-content">
                <b-icon-link class="url-icon" />
                <a :href="activity.visitedUrl" target="_blank" class="url-link">
                  {{ truncateUrl(activity.visitedUrl) }}
                </a>
              </div>
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

    getDisplayName(userId) {
      if (!userId) return 'Usuario'
      // Extraer solo la parte antes del @ para mostrar
      return userId.split('@')[0]
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

.activity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 12px;
  padding: 4px;
}

.activity-item {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #fff;
  transition: all 0.2s ease;
  min-height: 120px;
}

.activity-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transform: translateY(-1px);
}

.activity-content {
  padding: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Filas de actividad */
.activity-row {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.activity-row:last-child {
  margin-bottom: 0;
}

/* Fila principal: Avatar, Usuario, Tipo, Fecha */
.activity-main {
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.user-info {
  display: flex;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.2;
  margin-bottom: 3px;
}

.activity-type {
  margin-top: 3px;
}

.activity-meta {
  text-align: right;
  flex-shrink: 0;
  margin-left: 12px;
}

.timestamp {
  font-size: 0.75rem;
  color: #6c757d;
  white-space: nowrap;
}

/* Fila de resultado */
.activity-result {
  margin-left: 40px; /* Alineado con el texto del usuario */
  margin-bottom: 6px;
}

.result-content {
  flex: 1;
}

.result-text {
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Fila de URL */
.activity-url {
  margin-left: 40px; /* Alineado con el texto del usuario */
  margin-top: auto; /* Empujar hacia abajo */
}

.url-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.url-icon {
  font-size: 0.75rem;
  color: #6c757d;
  margin-right: 6px;
  flex-shrink: 0;
}

.url-link {
  font-size: 0.7rem;
  color: #007bff;
  text-decoration: none;
  word-break: break-all;
  flex: 1;
  min-width: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.url-link:hover {
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
@media (max-width: 1200px) {
  .activity-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .activity-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .activity-main {
    flex-direction: column;
    align-items: flex-start;
  }

  .activity-meta {
    margin-left: 0;
    margin-top: 4px;
    text-align: left;
    align-self: flex-end;
  }

  .activity-result,
  .activity-url {
    margin-left: 0;
  }

  .activity-content {
    padding: 10px;
  }

  .user-info {
    width: 100%;
  }

  .user-details {
    flex: 1;
  }

  .activity-type {
    margin-top: 4px;
  }
}
</style>
