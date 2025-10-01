<template>
  <div class="active-sessions">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">
        <b-icon-people-fill class="mr-2" />
        Sesiones Activas
      </h4>
      <div class="d-flex align-items-center">
        <b-badge :variant="activeSessions.length > 0 ? 'success' : 'secondary'" class="mr-2" pill>
          {{ activeSessions.length }} usuario{{ activeSessions.length !== 1 ? 's' : '' }}
        </b-badge>
        <b-button
          variant="outline-primary"
          size="sm"
          @click="refreshSessions"
          :disabled="loading"
        >
          <b-icon-arrow-clockwise :class="{ 'spinning': loading }" />
          Actualizar
        </b-button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading && activeSessions.length === 0" class="text-center py-4">
      <b-spinner type="border" variant="primary" />
      <p class="mt-2 text-muted">Cargando sesiones activas...</p>
    </div>

    <!-- Error state -->
    <b-alert v-if="error" variant="danger" show dismissible @dismissed="error = null">
      {{ error }}
    </b-alert>

    <!-- Active sessions list -->
    <div v-if="!loading || activeSessions.length > 0">
      <div v-if="activeSessions.length === 0" class="text-center py-4 bg-light rounded">
        <b-icon-person-x class="text-muted" size="2rem" />
        <p class="text-muted mt-2 mb-0">No hay usuarios con sesiones activas</p>
      </div>

      <div v-else class="sessions-list">
        <b-card
          v-for="session in activeSessions"
          :key="session.userId"
          class="session-card mb-2"
        >
          <div class="session-content">
            <div class="d-flex align-items-center mb-2">
              <b-avatar
                :text="getInitials(session.userId)"
                variant="success"
                size="md"
                class="mr-3"
              />
              <div class="flex-grow-1">
                <div class="user-name font-weight-bold">
                  {{ getDisplayName(session.userId) }}
                </div>
                <div class="user-email text-muted small">
                  {{ session.userId }}
                </div>
                <div v-if="session.area" class="user-area mt-1">
                  <b-badge :variant="getAreaBadgeVariant(session.area)" pill class="text-uppercase" style="font-size: 0.7rem;">
                    {{ formatAreaName(session.area) }}
                  </b-badge>
                </div>
              </div>
            </div>
            <div class="session-info">
              <div class="session-status mb-2">
                <b-badge variant="success" pill class="w-100">
                  <b-icon-circle-fill class="mr-1" style="font-size: 0.5rem;" />
                  Sesión activa
                </b-badge>
              </div>
              <div class="session-time text-muted small mb-1">
                <strong>Último login:</strong><br/>
                {{ formatDate(session.lastLogin) }}
              </div>
              <div class="text-muted small">
                <strong>Tiempo activo:</strong><br/>
                {{ formatTimeAgo(session.lastLogin) }}
              </div>
            </div>
          </div>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
const UserService = require('@/service/user')

export default {
  name: 'ActiveSessions',
  props: {
    activities: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      error: null,
      activeSessions: [],
      users: []
    }
  },
  watch: {
    activities: {
      handler() {
        this.calculateActiveSessions()
      },
      immediate: true,
      deep: true
    }
  },
  async mounted() {
    await this.loadUsers()
    this.calculateActiveSessions()
  },
  methods: {
    async loadUsers() {
      try {
        this.users = await UserService.getAll(this.$axios)
      } catch (error) {
        console.error('Error al cargar usuarios:', error)
        this.users = []
      }
    },

    getUserArea(userId) {
      const user = this.users.find(u => u.username === userId)
      return user ? user.admin : null
    },

    calculateActiveSessions() {
      try {
        const userSessions = {}

        // Ordenar actividades por timestamp descendente
        const sortedActivities = [...this.activities].sort((a, b) => {
          return new Date(b.timestamp) - new Date(a.timestamp)
        })

        // Procesar actividades para cada usuario
        sortedActivities.forEach(activity => {
          const userId = activity.userId

          // Si no hemos procesado este usuario aún
          if (!userSessions[userId]) {
            userSessions[userId] = {
              userId,
              lastLogin: null,
              lastLogout: null,
              hasActiveSession: false
            }
          }

          // Registrar el último login si aún no lo hemos encontrado
          if (!userSessions[userId].lastLogin && this.isLoginAction(activity.actionType)) {
            userSessions[userId].lastLogin = activity.timestamp
          }

          // Registrar el último logout si aún no lo hemos encontrado
          if (!userSessions[userId].lastLogout && this.isLogoutAction(activity.actionType)) {
            userSessions[userId].lastLogout = activity.timestamp
          }
        })

        // Determinar qué usuarios tienen sesión activa
        this.activeSessions = Object.values(userSessions)
          .filter(session => {
            // Tiene sesión activa si:
            // 1. Tiene un login registrado
            // 2. No tiene logout O el logout es anterior al login
            if (!session.lastLogin) return false

            if (!session.lastLogout) return true

            return new Date(session.lastLogin) > new Date(session.lastLogout)
          })
          .map(session => ({
            ...session,
            area: this.getUserArea(session.userId)
          }))
          .sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin)) // Ordenar por login más reciente

      } catch (error) {
        console.error('Error al calcular sesiones activas:', error)
        this.error = 'Error al procesar sesiones activas'
        this.activeSessions = []
      }
    },

    isLoginAction(actionType) {
      const loginActions = ['LogIn', 'Login', 'login', 'LOG IN', 'INICIO DE SESIÓN']
      return loginActions.some(action =>
        actionType && actionType.toLowerCase().includes(action.toLowerCase())
      )
    },

    isLogoutAction(actionType) {
      const logoutActions = ['LogOut', 'Logout', 'logout', 'LOG OUT', 'User Logout', 'CERRAR SESIÓN']
      return logoutActions.some(action =>
        actionType && actionType.toLowerCase().includes(action.toLowerCase())
      )
    },

    async refreshSessions() {
      this.loading = true
      await this.loadUsers()
      await new Promise(resolve => setTimeout(resolve, 500))
      this.calculateActiveSessions()
      this.loading = false
    },

    getInitials(userId) {
      if (!userId) return 'U'
      const name = userId.split('@')[0]
      return name.charAt(0).toUpperCase()
    },

    getDisplayName(userId) {
      if (!userId) return 'Usuario'
      return userId.split('@')[0]
    },

    formatDate(timestamp) {
      if (!timestamp) return 'N/A'
      const date = new Date(timestamp)

      if (isNaN(date.getTime())) {
        return 'Fecha inválida'
      }

      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    formatTimeAgo(timestamp) {
      if (!timestamp) return 'N/A'
      const date = new Date(timestamp)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMins / 60)
      const diffDays = Math.floor(diffHours / 24)

      if (diffMins < 1) return 'hace unos segundos'
      if (diffMins < 60) return `hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`
      if (diffHours < 24) return `hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`
      return `hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`
    },

    formatAreaName(area) {
      const areaNames = {
        'master': 'Master',
        'hacienda': 'Hacienda',
        'comercio': 'Comercio',
        'arvige': 'ARVIGE',
        'modernizacion': 'Modernización',
        'inspeccion': 'Inspección',
        'recaudaciones': 'Recaudaciones',
        'compras': 'Compras',
        'cultura': 'Cultura'
      }
      return areaNames[area] || area
    },

    getAreaBadgeVariant(area) {
      const variants = {
        'master': 'danger',
        'hacienda': 'primary',
        'comercio': 'info',
        'arvige': 'warning',
        'modernizacion': 'secondary',
        'inspeccion': 'dark',
        'recaudaciones': 'success',
        'compras': 'primary',
        'cultura': 'info'
      }
      return variants[area] || 'secondary'
    }
  }
}
</script>

<style scoped>
.active-sessions {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sessions-list {
  max-height: calc(100vh - 400px);
  min-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
}

.session-card {
  transition: all 0.2s ease;
  border: 1px solid #e0e0e0;
}

.session-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.session-content {
  display: flex;
  flex-direction: column;
}

.user-name {
  color: #333;
  font-size: 0.95rem;
  line-height: 1.2;
}

.user-email {
  font-size: 0.75rem;
  word-break: break-all;
}

.session-info {
  padding-left: 0;
}

.session-time {
  font-size: 0.8rem;
  line-height: 1.4;
}

.session-status .badge {
  font-size: 0.75rem;
  padding: 0.4rem 0.6rem;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Scrollbar personalizado */
.sessions-list::-webkit-scrollbar {
  width: 6px;
}

.sessions-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.sessions-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.sessions-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

