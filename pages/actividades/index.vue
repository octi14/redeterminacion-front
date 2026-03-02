<template>
  <div class="page container-fluid">
    <Banner title="Actividad de Usuarios" />
    <div class="row" v-if="adminMaster">
      <div class="col-12">

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
                <label>Filtrar por rango de fechas:</label>
                <div class="d-flex align-items-center">
                  <b-form-datepicker
                    v-model="startDate"
                    placeholder="Fecha inicio"
                    :max="endDate || new Date()"
                    class="mr-2"
                    size="sm"
                  />
                  <span class="mx-2 text-muted">hasta</span>
                  <b-form-datepicker
                    v-model="endDate"
                    placeholder="Fecha fin"
                    :min="startDate"
                    :max="new Date()"
                    size="sm"
                  />
                </div>
                <div class="mt-2">
                  <b-button
                    variant="primary"
                    size="sm"
                    @click="applyDateFilter"
                    :disabled="!startDate || !endDate"
                    class="mr-2"
                  >
                    Aplicar Filtro
                  </b-button>
                  <b-button
                    variant="outline-secondary"
                    size="sm"
                    @click="clearDateFilter"
                    :disabled="!selectedDateRange"
                  >
                    Limpiar
                  </b-button>
                </div>
                <div v-if="selectedDateRange" class="mt-2">
                  <b-badge variant="info">
                    {{ formatDateRange(selectedDateRange) }}
                  </b-badge>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="paginationFilter">Elementos por página:</label>
                <b-form-select
                  id="paginationFilter"
                  v-model="itemsPerPage"
                  :options="paginationOptions"
                  @change="changeItemsPerPage"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Row: Active Sessions (30%) + Activity Feed (70%) -->
        <div class="row">
          <!-- Active Sessions Column (30%) -->
          <div class="col-lg-4 col-md-12 mb-4">
            <ActiveSessions :activities="allActivities" />
          </div>

          <!-- Activity Feed Column (70%) -->
          <div class="col-lg-8 col-md-12">
            <div class="activity-section">
              <UserActivityFeed
                :limit="itemsPerPage"
                :show-recent="showRecent"
                :date-range="selectedDateRange"
                :activities="paginatedActivities"
              />
            </div>
          </div>
        </div>

        <!-- Paginación -->
        <div v-if="totalPages > 1" class="pagination-section mt-4">
          <div class="d-flex justify-content-between align-items-center">
            <div class="pagination-info">
              <span class="text-muted">
                Mostrando {{ ((currentPage - 1) * itemsPerPage) + 1 }} -
                {{ Math.min(currentPage * itemsPerPage, totalActivities) }}
                de {{ totalActivities }} actividades
              </span>
            </div>

            <div class="pagination-controls">
              <b-pagination
                v-model="currentPage"
                :total-rows="totalActivities"
                :per-page="itemsPerPage"
                :limit="5"
                size="sm"
                @change="changePage"
                class="mb-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ActiveSessions from '@/components/userActivity/ActiveSessions.vue'

export default {
  name: 'ActividadesPage',
  middleware: 'authenticated',
  components: {
    ActiveSessions
  },

  data() {
    return {
      selectedActivity: null,
      userFilter: '',
      dateFilter: null,
      limit: 50,
      showRecent: false, // Cambiar a false para mostrar todas las actividades por defecto
      selectedDateRange: null,
      startDate: null,
      endDate: null,
      currentPage: 1, // Agregar paginación
      itemsPerPage: 50,

      activityOptions: [
        { value: null, text: 'Todas las actividades' },
        { value: 'LogIn', text: 'Inicio de sesión' },
        { value: 'User Logout', text: 'Cierre de sesión' },
        { value: 'Abrir Trámite', text: 'Abrir Trámite' },
        { value: 'Abrir Turno', text: 'Abrir Turno' },
        { value: 'Aprobar', text: 'Aprobar trámite' },
        { value: 'Finalizar Trámite', text: 'Finalizar trámite' },
        { value: 'Rechazar Solicitud', text: 'Rechazar' },
        { value: 'Crear', text: 'Crear' },
        { value: 'Editar', text: 'Editar' },
        { value: 'Eliminar', text: 'Eliminar' },
        { value: 'Ver Observaciones', text: 'Visualización' }
      ],

      limitOptions: [
        { value: 25, text: '25 actividades' },
        { value: 50, text: '50 actividades' },
        { value: 100, text: '100 actividades' },
        { value: 200, text: '200 actividades' }
      ],

      paginationOptions: [
        { value: 10, text: '10 por página' },
        { value: 25, text: '25 por página' },
        { value: 50, text: '50 por página' },
        { value: 100, text: '100 por página' }
      ]
    }
  },

  computed: {
    ...mapState('userActivities', ['all', 'recent', 'filtered']),

    breadcrumbItems() {
      return [
        { text: 'Inicio', to: '/' },
        { text: 'Actividades', active: true }
      ]
    },

    // Actividades completas para el componente de sesiones activas
    allActivities() {
      return this.all || []
    },

    // Obtener las actividades actuales (filtradas o no)
    currentActivities() {
      if (this.selectedDateRange) {
        return this.filtered
      }
      return this.showRecent ? this.recent : this.all
    },

    // Aplicar filtros locales a las actividades
    filteredActivities() {
      let activities = this.currentActivities

      // Filtrar por tipo de actividad
      if (this.selectedActivity) {
        activities = activities.filter(activity =>
          activity.actionType === this.selectedActivity
        )
      }

      // Filtrar por usuario
      if (this.userFilter) {
        const filter = this.userFilter.toLowerCase()
        activities = activities.filter(activity =>
          activity.userId && activity.userId.toLowerCase().includes(filter)
        )
      }

      return activities
    },

    // Paginación
    totalPages() {
      return Math.ceil(this.filteredActivities.length / this.itemsPerPage)
    },

    paginatedActivities() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredActivities.slice(start, end)
    },

    totalActivities() {
      return this.filteredActivities.length
    },

    adminMaster(){
      return this.$store.state.user.admin == "master"
    }

  },

  async mounted() {
    await this.loadActivities()
  },

  watch: {
    selectedActivity() {
      // Los filtros se aplican automáticamente a través de computed properties
    },
    userFilter() {
      // Los filtros se aplican automáticamente a través de computed properties
    }
  },

  methods: {
    ...mapActions('userActivities', ['getAll', 'getRecent', 'getFiltered']),

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

    // Métodos de paginación
    changePage(page) {
      this.currentPage = page
    },

    changeItemsPerPage() {
      this.currentPage = 1 // Reset a la primera página
    },

    goToFirstPage() {
      this.currentPage = 1
    },

    goToLastPage() {
      this.currentPage = this.totalPages
    },

    goToPreviousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },

    goToNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },

    async applyDateFilter() {
      if (this.startDate && this.endDate) {
        this.selectedDateRange = {
          startDate: this.startDate,
          endDate: this.endDate
        }

        // Cargar actividades filtradas
        try {
          const result = await this.getFiltered({
            startDate: this.startDate,
            endDate: this.endDate,
            limit: this.limit
          })

          this.$bvToast.toast('Filtro de fechas aplicado', {
            title: 'Filtro Aplicado',
            variant: 'success',
            solid: true,
            toaster: 'b-toaster-top-right'
          })
        } catch (error) {
          console.error('Error aplicando filtro de fechas:', error)
          this.$bvToast.toast('Error al aplicar el filtro de fechas', {
            title: 'Error',
            variant: 'danger',
            solid: true,
            toaster: 'b-toaster-top-right'
          })
        }
      }
    },

    async clearDateFilter() {
      this.selectedDateRange = null
      this.startDate = null
      this.endDate = null

      // Recargar actividades normales
      await this.loadActivities()

      this.$bvToast.toast('Filtro de fechas removido', {
        title: 'Filtro Removido',
        variant: 'info',
        solid: true,
        toaster: 'b-toaster-top-right'
      })
    },

    formatDateRange(dateRange) {
      if (!dateRange || !dateRange.startDate || !dateRange.endDate) return ''

      try {
        const startDate = dateRange.startDate instanceof Date ? dateRange.startDate : new Date(dateRange.startDate)
        const endDate = dateRange.endDate instanceof Date ? dateRange.endDate : new Date(dateRange.endDate)

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

        return `${start} - ${end}`
      } catch (error) {
        console.warn('Error formateando rango de fechas:', error)
        return 'Error en fechas'
      }
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


.activity-section {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  padding: 1.5rem;
}

.pagination-section {
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  padding: 1rem;
}

.pagination-info {
  font-size: 0.9rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
}

/* Responsive */
@media (max-width: 768px) {
  .filters-section {
    padding: 1rem;
  }

  .pagination-section .d-flex {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination-controls {
    justify-content: center;
  }
}
</style>
