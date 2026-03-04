<template>
  <div class="page main-background">
    <!-- <Banner title="Actividad de Usuarios" /> -->
    <Banner/>
    <div class="row" v-if="adminMaster">
      <div class="col-12">

        <!-- Filters and Controls -->
        <div class="filters-section mb-4">
          <div class="filters-section__grid">
            <div class="filter-block filter-block--user">
              <label for="userFilter" class="filter-block__label">Usuario</label>
              <b-form-input
                id="userFilter"
                v-model="userFilter"
                placeholder="Buscar por nombre..."
                class="filter-block__input"
              />
            </div>
            <div class="filter-block filter-block--dates">
              <label class="filter-block__label">Rango de fechas</label>
              <div class="filter-block__dates-row">
                <b-form-datepicker
                  v-model="startDate"
                  placeholder="Desde"
                  :max="endDate || new Date()"
                  size="sm"
                  class="filter-block__datepicker"
                />
                <span class="filter-block__dates-sep">—</span>
                <b-form-datepicker
                  v-model="endDate"
                  placeholder="Hasta"
                  :min="startDate"
                  :max="new Date()"
                  size="sm"
                  class="filter-block__datepicker"
                />
              </div>
              <div class="filter-block__actions mt-2">
                <b-button
                  variant="primary"
                  size="sm"
                  @click="applyDateFilter"
                  :disabled="!startDate || !endDate"
                  class="filter-block__btn"
                >
                  Aplicar
                </b-button>
                <b-button
                  variant="outline-secondary"
                  size="sm"
                  @click="clearDateFilter"
                  :disabled="!selectedDateRange"
                  class="filter-block__btn"
                >
                  Limpiar
                </b-button>
              </div>
              <div v-if="selectedDateRange" class="filter-block__badge mt-2">
                <b-badge variant="info">{{ formatDateRange(selectedDateRange) }}</b-badge>
              </div>
            </div>
            <div class="filter-block filter-block--per-page">
              <label for="paginationFilter" class="filter-block__label">Por página</label>
              <b-form-select
                id="paginationFilter"
                v-model="itemsPerPage"
                :options="paginationOptions"
                @change="changeItemsPerPage"
                class="filter-block__select"
              />
            </div>
            <div class="filter-block filter-block--show-all">
              <label class="filter-block__label filter-block__label--invisible">Acción</label>
              <div v-if="loadMode === 'last30'" class="filter-block__show-all-wrap">
                <b-button
                  variant="outline-primary"
                  size="sm"
                  :disabled="loadingAll"
                  @click="loadAllActivities"
                  class="filter-block__show-all-btn"
                >
                  <b-spinner v-if="loadingAll" small class="mr-1" />
                  Mostrar todas
                </b-button>
              </div>
              <b-badge v-else variant="secondary" class="filter-block__all-badge">
                Mostrando todas
              </b-badge>
            </div>
          </div>
          <div v-if="loadMode === 'last30' && !selectedDateRange" class="filters-section__hint">
            <i class="bi bi-info-circle filters-section__hint-icon"></i>
            <span>Por defecto se muestran solo las actividades de los últimos 30 días. Usa <strong>«Mostrar todas»</strong> para cargar el historial completo.</span>
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
      userFilter: '',
      limit: 50,
      showRecent: false,
      selectedDateRange: null,
      startDate: null,
      endDate: null,
      currentPage: 1,
      itemsPerPage: 50,
      loadMode: 'last30', // 'last30' | 'all'
      loadingAll: false,

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

    // Aplicar filtros locales (solo por usuario)
    filteredActivities() {
      let activities = this.currentActivities
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

  methods: {
    ...mapActions('userActivities', ['getAll', 'getLastDays', 'getFiltered']),

    async loadActivities() {
      await this.getLastDays({ days: 30 })
      this.loadMode = 'last30'
    },

    async loadAllActivities() {
      this.loadingAll = true
      try {
        await this.getAll()
        this.loadMode = 'all'
        this.$bvToast.toast('Se cargaron todas las actividades', {
          title: 'Carga completada',
          variant: 'success',
          solid: true,
          toaster: 'b-toaster-top-right'
        })
      } finally {
        this.loadingAll = false
      }
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

      if (this.loadMode === 'last30') {
        await this.getLastDays({ days: 30 })
      } else {
        await this.getAll()
      }

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

/* --- Filters section --- */
.filters-section {
  background: linear-gradient(to bottom, #fafbfc 0%, #f4f6f8 100%);
  padding: 1.5rem 1.75rem;
  border-radius: 12px;
  border: 1px solid #e8eaed;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.filters-section__grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr 140px 160px;
  gap: 1.5rem 2rem;
  align-items: end;
}

.filter-block__label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #5f6368;
  margin-bottom: 0.4rem;
}

.filter-block__label--invisible {
  visibility: hidden;
  height: 0;
  margin: 0;
  overflow: hidden;
}

.filter-block__input,
.filter-block__select {
  border-radius: 8px;
  border-color: #dadce0;
  font-size: 0.9rem;
}

.filter-block__input:focus,
.filter-block__select:focus {
  border-color: #1a73e8;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
}

.filter-block__dates-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-block__datepicker {
  flex: 1;
  min-width: 120px;
}

.filter-block__dates-sep {
  color: #9aa0a6;
  font-weight: 500;
}

.filter-block__actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-block__btn {
  border-radius: 8px;
  font-weight: 500;
}

.filter-block__show-all-btn {
  width: 100%;
  border-radius: 8px;
  font-weight: 500;
  border-width: 1.5px;
}

.filter-block__all-badge {
  display: inline-block;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 8px;
}

.filters-section__hint {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid #e8eaed;
  font-size: 0.85rem;
  color: #5f6368;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.filters-section__hint-icon {
  color: #1a73e8;
  font-size: 1rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
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
@media (max-width: 992px) {
  .filters-section__grid {
    grid-template-columns: 1fr 1fr;
  }

  .filter-block--dates {
    grid-column: 1 / -1;
  }
}

@media (max-width: 576px) {
  .filters-section {
    padding: 1rem 1.25rem;
  }

  .filters-section__grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .filter-block--dates {
    grid-column: 1;
  }

  .filter-block__show-all-btn {
    max-width: 200px;
  }
}

@media (max-width: 768px) {
  .pagination-section .d-flex {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination-controls {
    justify-content: center;
  }
}
</style>
