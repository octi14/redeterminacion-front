<template>
  <div class="date-range-selector">
    <!-- Botones de rango rápido -->
    <div class="quick-range-buttons mb-3">
      <b-button-group size="sm">
        <b-button
          v-for="range in quickRanges"
          :key="range.value"
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
      >
        <i class="bi bi-check-circle mr-1"></i>
        Aplicar Filtro
      </b-button>
      <b-button
        variant="outline-secondary"
        size="sm"
        @click="resetToDefault"
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
    }
  },
  data() {
    return {
      fechaInicio: null,
      fechaFin: null,
      selectedQuickRange: this.defaultRange,
      quickRanges: [
        { label: 'Hoy', value: 'today' },
        { label: 'Ayer', value: 'yesterday' },
        { label: 'Últimos 7 días', value: 'last7days' },
        { label: 'Últimos 30 días', value: 'last30days' },
        { label: 'Último mes', value: 'lastmonth' },
        { label: 'Personalizado', value: 'custom' }
      ]
    }
  },
  computed: {
    isValidRange() {
      if (!this.fechaInicio || !this.fechaFin) return false

      const startDate = this.fechaInicio instanceof Date ? this.fechaInicio : new Date(this.fechaInicio)
      const endDate = this.fechaFin instanceof Date ? this.fechaFin : new Date(this.fechaFin)

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return false

      return startDate <= endDate
    },
    daysDifference() {
      if (!this.fechaInicio || !this.fechaFin) return 0

      const startDate = this.fechaInicio instanceof Date ? this.fechaInicio : new Date(this.fechaInicio)
      const endDate = this.fechaFin instanceof Date ? this.fechaFin : new Date(this.fechaFin)

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0

      const diffTime = endDate - startDate
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    }
  },
  mounted() {
    this.selectQuickRange(this.defaultRange)
  },
  methods: {
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
        case 'custom':
          // No hacer nada, permitir selección manual
          break
      }

      if (range !== 'custom') {
        this.applyDateRange()
      }
    },

    onDateChange() {
      if (this.selectedQuickRange !== 'custom') {
        this.selectedQuickRange = 'custom'
      }
    },

    applyDateRange() {
      if (this.isValidRange) {
        this.$emit('date-range-changed', {
          startDate: this.fechaInicio,
          endDate: this.fechaFin,
          range: this.selectedQuickRange,
          days: this.daysDifference
        })
      }
    },

    resetToDefault() {
      this.selectQuickRange(this.defaultRange)
    },

    formatRangeInfo() {
      if (!this.fechaInicio || !this.fechaFin) return 'Selecciona un rango'

      const startDate = this.fechaInicio instanceof Date ? this.fechaInicio : new Date(this.fechaInicio)
      const endDate = this.fechaFin instanceof Date ? this.fechaFin : new Date(this.fechaFin)

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
}

.date-picker:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
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
