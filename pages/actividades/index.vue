<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <!-- Breadcrumbs -->
        <Breadcrumbs :items="breadcrumbItems" />

        <!-- Page Header -->
        <div class="page-header mb-4">
          <h2 class="page-title">
            <b-icon-activity class="mr-2" />
            Actividad de Usuarios
          </h2>
        </div>

        <!-- Filters and Controls -->
        <div class="filters-section mb-4">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="activityFilter">Filtrar por tipo de actividad:</label>
                <b-form-select
                  id="activityFilter"
                  v-model="selectedActivity"
                  :options="activityOptions"
                  @change="filterActivities"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="userFilter">Filtrar por usuario:</label>
                <b-form-input
                  id="userFilter"
                  v-model="userFilter"
                  placeholder="Buscar por nombre de usuario..."
                  @input="filterActivities"
                />
              </div>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-6">
              <div class="form-group">
                <label for="dateFilter">Filtrar por fecha:</label>
                <b-form-datepicker
                  id="dateFilter"
                  v-model="dateFilter"
                  :max="new Date()"
                  @input="filterActivities"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="limitFilter">Mostrar:</label>
                <b-form-select
                  id="limitFilter"
                  v-model="limit"
                  :options="limitOptions"
                  @change="changeLimit"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics Cards -->
        <div class="stats-section mb-4">
          <div class="row">
            <div class="col-md-3">
              <div class="stat-card">
                <div class="stat-icon">
                  <b-icon-people class="text-primary" />
                </div>
                <div class="stat-content">
                  <h4>{{ totalUsers }}</h4>
                  <p>Usuarios únicos</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card">
                <div class="stat-icon">
                  <b-icon-activity class="text-success" />
                </div>
                <div class="stat-content">
                  <h4>{{ totalActivities }}</h4>
                  <p>Actividades totales</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card">
                <div class="stat-icon">
                  <b-icon-clock class="text-warning" />
                </div>
                <div class="stat-content">
                  <h4>{{ todayActivities }}</h4>
                  <p>Hoy</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card">
                <div class="stat-icon">
                  <b-icon-shield-check class="text-info" />
                </div>
                <div class="stat-content">
                  <h4>{{ loginActivities }}</h4>
                  <p>Inicios de sesión</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Feed -->
        <div class="activity-section">
          <UserActivityFeed
            :limit="limit"
            :show-recent="showRecent"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ActividadesPage',
  middleware: 'authenticated',

  data() {
    return {
      selectedActivity: null,
      userFilter: '',
      dateFilter: null,
      limit: 50,
      showRecent: true,

      activityOptions: [
        { value: null, text: 'Todas las actividades' },
        { value: 'LogIn', text: 'Inicio de sesión' },
        { value: 'LogOut', text: 'Cierre de sesión' },
        { value: 'Aprobar Renovación', text: 'Aprobar Renovación' },
        { value: 'Rechazar', text: 'Rechazar' },
        { value: 'Crear', text: 'Crear' },
        { value: 'Editar', text: 'Editar' },
        { value: 'Eliminar', text: 'Eliminar' },
        { value: 'View', text: 'Visualización' }
      ],

      limitOptions: [
        { value: 25, text: '25 actividades' },
        { value: 50, text: '50 actividades' },
        { value: 100, text: '100 actividades' },
        { value: 200, text: '200 actividades' }
      ]
    }
  },

  computed: {
    ...mapState('userActivities', ['all', 'recent']),

    breadcrumbItems() {
      return [
        { text: 'Inicio', to: '/' },
        { text: 'Actividades', active: true }
      ]
    },

    totalUsers() {
      const users = new Set()
      const activities = this.showRecent ? this.recent : this.all
      activities.forEach(activity => {
        if (activity.userId) {
          users.add(activity.userId)
        }
      })
      return users.size
    },

    totalActivities() {
      return this.showRecent ? this.recent.length : this.all.length
    },

    todayActivities() {
      const today = new Date().toDateString()
      const activities = this.showRecent ? this.recent : this.all
      return activities.filter(activity => {
        return new Date(activity.timestamp).toDateString() === today
      }).length
    },

    loginActivities() {
      const activities = this.showRecent ? this.recent : this.all
      return activities.filter(activity => activity.actionType === 'LogIn').length
    }
  },

  async mounted() {
    await this.loadActivities()
  },

  methods: {
    ...mapActions('userActivities', ['getAll', 'getRecent']),

    async loadActivities() {
      if (this.showRecent) {
        await this.getRecent({ limit: this.limit })
      } else {
        await this.getAll()
      }
    },

    async changeLimit() {
      await this.loadActivities()
    },

    filterActivities() {
      // Esta funcionalidad se puede implementar más adelante
      // para filtrar las actividades en tiempo real
      console.log('Filtrando actividades:', {
        activity: this.selectedActivity,
        user: this.userFilter,
        date: this.dateFilter
      })
    }
  }
}
</script>

<style scoped>
.page-header {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1rem;
}

.page-title {
  color: #495057;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.page-description {
  font-size: 1.1rem;
  margin-bottom: 0;
}

.filters-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.stats-section {
  margin-bottom: 2rem;
}

.stat-card {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.stat-content h4 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: #495057;
}

.stat-content p {
  margin-bottom: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.activity-section {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  padding: 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .filters-section {
    padding: 1rem;
  }

  .stat-card {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .stat-icon {
    font-size: 1.5rem;
    margin-right: 0.75rem;
  }

  .stat-content h4 {
    font-size: 1.5rem;
  }
}
</style>
