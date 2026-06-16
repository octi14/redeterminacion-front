<template>
  <div class="date-range-selector">
    <!-- Botones de rango rápido -->
    <div class="quick-range-buttons mb-3">
      <b-button-group size="sm">
        <b-button
          v-for="range in quickRanges"
          :key="range.label"
          :variant="selectedQuickRange === range.value ? 'primary' : 'outline-primary'"
          @click="selectQuickRange(range.value)"
          class="quick-range-btn"
        >
          {{ range.label }}
        </b-button>
      </b-button-group>
    </div>

    <!-- Selectores de fecha personalizados -->
    <div class="custom-date-range">
      <b-row>
        <b-col md="5">
          <label class="form-label">Fecha inicio:</label>
          <b-form-datepicker
            v-model="fechaInicio"
            :max="fechaFin || new Date()"
            placeholder="Seleccionar fecha inicio"
            class="date-picker"
            menu-class="datepicker-dropdown"
            calendar-width="100%"
            locale="es"
            @input="onDateChange"
          />
        </b-col>
        <b-col md="2" class="d-flex align-items-end justify-content-center">
          <span class="date-separator">hasta</span>
        </b-col>
        <b-col md="5">
          <label class="form-label">Fecha fin:</label>
          <b-form-datepicker
            v-model="fechaFin"
            :min="fechaInicio"
            :max="new Date()"
            placeholder="Seleccionar fecha fin"
            class="date-picker"
            menu-class="datepicker-dropdown"
            calendar-width="100%"
            locale="es"
            @input="onDateChange"
          />
        </b-col>
      </b-row>
    </div>

    <!-- Información del rango seleccionado -->
    <div class="selected-range-info mt-3">
      <b-badge variant="info" class="mr-2">
        <i class="bi bi-calendar3 mr-1"></i>
        {{ formatRangeInfo() }}
      </b-badge>
      <b-badge variant="secondary" v-if="daysDifference">
        {{ daysDifference }} días
      </b-badge>
    </div>

    <!-- Botones de acción -->
    <div class="action-buttons mt-3">
      <b-button
        variant="success"
        size="sm"
        @click="applyDateRange"
        :disabled="!isValidRange"
        class="mr-2"
        :class="{ 'pulse-animation': isValidRange }"
      >
        <i class="bi bi-check-circle mr-1"></i>
        Aplicar Filtro
        <b-spinner v-if="applying" small class="ml-2"></b-spinner>
      </b-button>
      <b-button
        variant="outline-secondary"
        size="sm"
        @click="resetToDefault"
        :disabled="applying"
      >
        <i class="bi bi-arrow-clockwise mr-1"></i>
        Restablecer
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DateRangeSelector',
  props: {
    defaultRange: {
      type: String,
      default: 'last30days'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fechaInicio: null,
      fechaFin: null,
      selectedQuickRange: this.defaultRange,
      applying: false,
      quickRanges: [
        { label: 'Hoy', value: 'today' },
        { label: 'Ayer', value: 'yesterday' },
        { label: 'Últimos 7 días', value: 'last7days' },
        { label: 'Últimos 30 días', value: 'last30days' },
        { label: 'Último mes', value: 'lastmonth' },
        { label: 'Último trimestre', value: 'lastquarter' },
        { label: 'Último año', value: 'lastyear' },
        { label: 'Personalizado', value: 'custom' }
      ]
    }
  },
  computed: {
    isValidRange() {
      if (!this.fechaInicio || !this.fechaFin) return false

      // Asegurar que las fechas sean objetos Date válidos
      const startDate = this.fechaInicio instanceof Date ? this.fechaInicio : new Date(this.fechaInicio)
      const endDate = this.fechaFin instanceof Date ? this.fechaFin : new Date(this.fechaFin)

      // Verificar que las fechas sean válidas
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return false

      return startDate <= endDate
    },
    daysDifference() {
      if (!this.fechaInicio || !this.fechaFin) return 0

      // Asegurar que las fechas sean objetos Date válidos
      const startDate = this.fechaInicio instanceof Date ? this.fechaInicio : new Date(this.fechaInicio)
      const endDate = this.fechaFin instanceof Date ? this.fechaFin : new Date(this.fechaFin)

      // Verificar que las fechas sean válidas
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0

      const diffTime = endDate - startDate
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    }
  },
  mounted() {
    // No inicializar ningún rango por defecto - mostrar todos los datos sin filtros
    // this.initializeDefaultRange()
  },
  methods: {
    initializeDefaultRange() {
      this.selectQuickRange(this.defaultRange)
    },

    selectQuickRange(range) {
      this.selectedQuickRange = range
      const today = new Date()

      switch (range) {
        case 'today':
          this.fechaInicio = new Date(today)
          this.fechaFin = new Date(today)
          break
        case 'yesterday':
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)
          this.fechaInicio = yesterday
          this.fechaFin = yesterday
          break
        case 'last7days':
          this.fechaInicio = new Date(today)
          this.fechaInicio.setDate(this.fechaInicio.getDate() - 6)
          this.fechaFin = new Date(today)
          break
        case 'last30days':
          this.fechaInicio = new Date(today)
          this.fechaInicio.setDate(this.fechaInicio.getDate() - 29)
          this.fechaFin = new Date(today)
          break
        case 'lastmonth':
          const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
          const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
          this.fechaInicio = lastMonth
          this.fechaFin = lastMonthEnd
          break
        case 'lastquarter':
          const quarter = Math.floor(today.getMonth() / 3)
          const lastQuarterStart = new Date(today.getFullYear(), (quarter - 1) * 3, 1)
          const lastQuarterEnd = new Date(today.getFullYear(), quarter * 3, 0)
          this.fechaInicio = lastQuarterStart
          this.fechaFin = lastQuarterEnd
          break
        case 'lastyear':
          const lastYear = new Date(today.getFullYear() - 1, 0, 1)
          const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31)
          this.fechaInicio = lastYear
          this.fechaFin = lastYearEnd
          break
        case 'custom':
          // No hacer nada, permitir selección manual
          break
      }

      if (range !== 'custom') {
        this.onDateChange()
      }
    },

    onDateChange() {
      // Si se selecciona una fecha manualmente, cambiar a "Personalizado"
      if (this.selectedQuickRange !== 'custom') {
        this.selectedQuickRange = 'custom'
      }
    },

    async applyDateRange() {
      if (this.isValidRange) {
        this.applying = true

        try {
          // Simular un pequeño delay para mostrar el spinner
          await new Promise(resolve => setTimeout(resolve, 500))

          this.$emit('date-range-changed', {
            startDate: this.fechaInicio,
            endDate: this.fechaFin,
            range: this.selectedQuickRange,
            days: this.daysDifference
          })
        } finally {
          this.applying = false
        }
      }
    },

    resetToDefault() {
      this.selectQuickRange(this.defaultRange)
      this.applyDateRange()
    },

    formatRangeInfo() {
      if (!this.fechaInicio || !this.fechaFin) return 'Selecciona un rango'

      // Asegurar que las fechas sean objetos Date
      const startDate = this.fechaInicio instanceof Date ? this.fechaInicio : new Date(this.fechaInicio)
      const endDate = this.fechaFin instanceof Date ? this.fechaFin : new Date(this.fechaFin)

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

      return `${start} - ${end}`
    }
  }
}
</script>

<style scoped>
.date-range-selector {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  position: relative;
  overflow: visible;
}

.quick-range-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.quick-range-btn {
  border-radius: 20px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.quick-range-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.custom-date-range {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #dee2e6;
  position: relative;
  overflow: visible;
}

.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
}

.date-picker {
  border-radius: 6px;
  border: 1px solid #ced4da;
  transition: all 0.2s ease;
  position: relative;
}

.date-picker:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Estilos para el dropdown del calendario */
.datepicker-dropdown {
  z-index: 1050 !important;
  position: absolute !important;
}

/* Asegurar que el calendario no se corte */
::v-deep .b-form-datepicker {
  position: relative;
  width: 100%;
}

::v-deep .b-form-datepicker .dropdown-menu {
  z-index: 1050 !important;
  position: absolute !important;
  transform: none !important;
  margin-top: 0.25rem !important;
  min-width: 290px;
  max-width: 100%;
}

/* Asegurar que el calendario se muestre correctamente */
::v-deep .b-calendar {
  z-index: 1050 !important;
  width: 100%;
}

/* Asegurar que el input del datepicker tenga el ancho correcto */
::v-deep .b-form-datepicker .form-control {
  width: 100%;
}

/* Asegurar que el dropdown no se corte en contenedores con overflow */
::v-deep .b-form-datepicker .dropdown {
  position: static;
}

::v-deep .b-form-datepicker .dropdown-menu.show {
  display: block !important;
  position: absolute !important;
  top: 100% !important;
  left: 0 !important;
  right: auto !important;
  transform: translateY(0) !important;
  will-change: transform;
}

/* Asegurar que el contenedor del dropdown tenga el contexto correcto */
::v-deep .b-form-datepicker > .dropdown {
  position: relative;
  display: block;
  width: 100%;
}

.date-separator {
  color: #6c757d;
  font-weight: 500;
  font-size: 0.9rem;
}

.selected-range-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Animaciones */
.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(40, 167, 69, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(40, 167, 69, 0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .quick-range-buttons {
    justify-content: center;
  }

  .quick-range-btn {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }

  .action-buttons {
    justify-content: center;
  }
}
</style>
