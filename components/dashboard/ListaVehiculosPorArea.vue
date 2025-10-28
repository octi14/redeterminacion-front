<template>
  <div class="lista-vehiculos-por-area">
    <div class="header-section">
      <h4 class="section-title">
        <i class="bi bi-list-ul mr-2"></i>
        Lista de Vehículos por Área
      </h4>
      <p class="section-subtitle">Vehículos municipales organizados por área de trabajo</p>
    </div>

    <!-- Controles de búsqueda y filtrado -->
    <div class="row mb-4">
      <div class="col-md-6">
        <b-form-input
          v-model="searchTerm"
          placeholder="Buscar por patente o área..."
          class="search-input"
        >
          <template #prepend>
            <i class="bi bi-search"></i>
          </template>
        </b-form-input>
      </div>
      <div class="col-md-3">
        <b-form-select
          v-model="selectedArea"
          :options="areaOptions"
          class="area-select"
        >
          <template #first>
            <b-form-select-option :value="null">Todas las áreas</b-form-select-option>
          </template>
        </b-form-select>
      </div>
      <div class="col-md-3">
        <b-button
          variant="outline-secondary"
          size="lg"
          @click="clearFilters"
          class="clear-btn"
        >
          <i class="bi bi-x-circle mr-1"></i>
          Limpiar Filtros
        </b-button>
      </div>
    </div>

    <!-- Resumen de resultados -->
    <div class="row mb-3">
      <div class="col-12">
        <b-alert variant="info" show class="summary-alert">
          <i class="bi bi-info-circle mr-2"></i>
          <strong>Mostrando {{ filteredVehiculos.length }} de {{ totalVehiculos }} vehículos</strong>
          <span v-if="selectedArea" class="ml-2">en el área: <strong>{{ selectedArea }}</strong></span>
        </b-alert>
      </div>
    </div>

    <!-- Lista de vehículos agrupados por área -->
    <div class="vehiculos-container">
      <div
        v-for="area in areasConVehiculos"
        :key="area.nombre"
        class="area-group mb-4"
      >
        <!-- Header del área -->
        <div class="area-header">
          <div class="area-info">
            <div class="area-icon">
              <i class="bi bi-building"></i>
            </div>
            <div class="area-details">
              <h5 class="area-name">{{ area.nombre }}</h5>
              <p class="area-count">{{ area.vehiculos.length }} vehículo(s)</p>
            </div>
          </div>
          <div class="area-actions">
            <b-button
              variant="outline-primary"
              size="sm"
              @click="toggleArea(area.nombre)"
              class="toggle-btn"
            >
              <i class="bi" :class="area.expanded ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
              {{ area.expanded ? 'Ocultar' : 'Mostrar' }}
            </b-button>
          </div>
        </div>

        <!-- Lista de vehículos del área -->
        <b-collapse :id="`area-${area.nombre}`" v-model="area.expanded">
          <div class="vehiculos-list">
            <div class="row">
              <div
                v-for="vehiculo in area.vehiculos"
                :key="vehiculo.id"
                class="col-md-4 col-sm-6 col-12 mb-3"
              >
                <div class="vehiculo-item">
                  <div class="vehiculo-info">
                    <div class="vehiculo-icon">
                      <i class="bi bi-car-front-fill"></i>
                    </div>
                    <div class="vehiculo-details">
                      <h6 class="vehiculo-patente">{{ vehiculo.patente }}</h6>
                      <small class="vehiculo-id">ID: {{ vehiculo.id }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-collapse>
      </div>

      <!-- Mensaje cuando no hay vehículos -->
      <div v-if="filteredVehiculos.length === 0" class="no-vehiculos">
        <div class="no-vehiculos-content">
          <i class="bi bi-car-front text-muted"></i>
          <h5 class="text-muted">No se encontraron vehículos</h5>
          <p class="text-muted">
            {{ searchTerm || selectedArea ? 'Intenta ajustar los filtros de búsqueda' : 'No hay vehículos registrados en el sistema' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListaVehiculosPorArea',
  props: {
    vehiculos: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchTerm: '',
      selectedArea: null,
      areasExpanded: {}
    }
  },
  computed: {
    totalVehiculos() {
      return this.vehiculos ? this.vehiculos.length : 0
    },
    areaOptions() {
      if (!this.vehiculos || this.vehiculos.length === 0) return []

      const areas = [...new Set(this.vehiculos.map(v => v.area).filter(Boolean))]
      return areas.map(area => ({
        value: area,
        text: area
      }))
    },
    filteredVehiculos() {
      if (!this.vehiculos || this.vehiculos.length === 0) return []

      let filtered = this.vehiculos

      // Filtrar por área seleccionada
      if (this.selectedArea) {
        filtered = filtered.filter(v => v.area === this.selectedArea)
      }

      // Filtrar por término de búsqueda
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase()
        filtered = filtered.filter(v =>
          v.patente.toLowerCase().includes(term) ||
          (v.area && v.area.toLowerCase().includes(term))
        )
      }

      return filtered
    },
    areasConVehiculos() {
      if (this.filteredVehiculos.length === 0) return []

      // Agrupar vehículos por área
      const areasMap = new Map()

      this.filteredVehiculos.forEach(vehiculo => {
        const area = vehiculo.area || 'Sin Área Asignada'
        if (!areasMap.has(area)) {
          areasMap.set(area, {
            nombre: area,
            vehiculos: [],
            expanded: this.areasExpanded[area] || false
          })
        }
        areasMap.get(area).vehiculos.push(vehiculo)
      })

      // Convertir a array y ordenar por cantidad de vehículos
      return Array.from(areasMap.values()).sort((a, b) => b.vehiculos.length - a.vehiculos.length)
    }
  },
  methods: {
    toggleArea(areaNombre) {
      this.$set(this.areasExpanded, areaNombre, !this.areasExpanded[areaNombre])
    },
    clearFilters() {
      this.searchTerm = ''
      this.selectedArea = null
    }
  },
  mounted() {
    // Expandir todas las áreas por defecto
    if (this.vehiculos && this.vehiculos.length > 0) {
      const areas = [...new Set(this.vehiculos.map(v => v.area).filter(Boolean))]
      areas.forEach(area => {
        this.$set(this.areasExpanded, area, true)
      })
    }
  }
}
</script>

<style scoped>
.lista-vehiculos-por-area {
  padding: 1rem 0;
}

.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  color: #495057;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
}

.search-input {
  border-radius: 25px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.area-select {
  border-radius: 25px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.area-select:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.clear-btn {
  border-radius: 25px;
  border: 2px solid #6c757d;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background-color: #6c757d;
  border-color: #6c757d;
}

.summary-alert {
  border-radius: 15px;
  border: none;
  background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
  color: #0c5460;
}

.area-group {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.area-group:hover {
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.area-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dee2e6;
}

.area-info {
  display: flex;
  align-items: center;
}

.area-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: white;
  font-size: 1.2rem;
}

.area-details {
  flex: 1;
}

.area-name {
  margin: 0;
  color: #495057;
  font-weight: 600;
}

.area-count {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.toggle-btn {
  border-radius: 20px;
  border: 2px solid #007bff;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background-color: #007bff;
  border-color: #007bff;
}

.vehiculos-list {
  padding: 1rem 1.5rem;
}

.vehiculo-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  height: 100%;
  min-height: 80px;
}

.vehiculo-item:hover {
  background: #e9ecef;
  border-color: #28a745;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.vehiculo-info {
  display: flex;
  align-items: center;
}

.vehiculo-icon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: white;
  font-size: 1rem;
}

.vehiculo-details {
  flex: 1;
}

.vehiculo-patente {
  margin: 0;
  color: #495057;
  font-weight: 600;
  font-size: 1.1rem;
}

.vehiculo-id {
  color: #6c757d;
  font-size: 0.8rem;
}


.no-vehiculos {
  text-align: center;
  padding: 3rem 1rem;
}

.no-vehiculos-content i {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-vehiculos-content h5 {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .area-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .area-actions {
    margin-top: 1rem;
    width: 100%;
  }

  .toggle-btn {
    width: 100%;
  }

  .vehiculo-item {
    min-height: 70px;
    padding: 0.75rem;
  }

  .vehiculo-icon {
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
  }

  .vehiculo-patente {
    font-size: 1rem;
  }

  .vehiculo-id {
    font-size: 0.75rem;
  }
}
</style>
