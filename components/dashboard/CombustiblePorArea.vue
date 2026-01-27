<template>
  <div class="combustible-por-area">
    <div class="header-section">
      <h4 class="section-title">
        <i class="bi bi-building-fill mr-2"></i>
        Emisión de vales de combustible por Área
      </h4>
    </div>

    <!-- Resumen General -->
    <div class="row mb-4">
      <div class="col-md-12">
        <b-card class="summary-card">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="bi bi-graph-up text-primary mr-2"></i>
              <h5 class="mb-0">Resumen General</h5>
            </div>
          </template>

          <div class="row">
            <div class="col-md-3 col-sm-6 mb-3">
              <div class="stat-block">
                <div class="stat-icon bg-primary">
                  <i class="bi bi-building"></i>
                </div>
                <div class="stat-content">
                  <h3 class="stat-number">{{ totalAreas }}</h3>
                  <p class="stat-label">Áreas Activas</p>
                </div>
              </div>
            </div>

            <div class="col-md-3 col-sm-6 mb-3">
              <div class="stat-block">
                <div class="stat-icon bg-success">
                  <i class="bi bi-fuel-pump"></i>
                </div>
                <div class="stat-content">
                  <h3 class="stat-number">{{ totalVales }}</h3>
                  <p class="stat-label">Vales Emitidos</p>
                </div>
              </div>
            </div>

            <div class="col-md-3 col-sm-6 mb-3">
              <div class="stat-block">
                <div class="stat-icon bg-warning">
                  <i class="bi bi-currency-dollar"></i>
                </div>
                <div class="stat-content">
                  <h3 class="stat-number">{{ formatCurrency(totalMonto) }}</h3>
                  <p class="stat-label">Monto Total Emitido</p>
                </div>
              </div>
            </div>

          </div>
        </b-card>
      </div>
    </div>


    <!-- Tabla Detallada -->
    <div class="row">
      <div class="col-md-12">
        <b-card class="table-card">
          <template #header>
            <div class="d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center">
                <i class="bi bi-table text-primary mr-2"></i>
                <h5 class="mb-0">Detalle por Área</h5>
              </div>
              <div class="table-controls">
                <b-form-input
                  v-model="searchTerm"
                  placeholder="Buscar área..."
                  size="sm"
                  class="search-input"
                />
              </div>
            </div>
          </template>

          <div class="table-responsive">
            <table class="table table-hover">
              <thead class="table-header">
                <tr>
                  <th>Área</th>
                  <th>Vales Emitidos</th>
                  <th>Monto Total Emitido</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="area in filteredAreas"
                  :key="area.nombre"
                  class="table-row"
                >
                  <td class="area-name">
                    <div class="d-flex align-items-center">
                      <div class="area-icon">
                        <i class="bi bi-building"></i>
                      </div>
                      <span>{{ area.nombre }}</span>
                    </div>
                  </td>
                  <td class="text-center">
                    <span class="badge badge-primary">{{ area.vales }}</span>
                  </td>
                  <td class="text-right font-weight-bold">
                    {{ formatCurrency(area.monto) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CombustiblePorArea',
  props: {
    datosCombustible: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      searchTerm: ''
    }
  },
  computed: {
    datosPorArea() {
      // Debug: verificar qué datos están llegando
      console.log('🔍 Datos de combustible recibidos:', this.datosCombustible)

      // Usar los datos de vales por área (porAreaVales) que contienen la información de emisión
      if (!this.datosCombustible || !this.datosCombustible.porAreaVales) {
        console.log('⚠️ No hay datos de combustible o porAreaVales')
        return []
      }

      console.log('📊 Datos porAreaVales disponibles:', this.datosCombustible.porAreaVales)

      // Los datos de porAreaVales contienen la información de los vales emitidos por área
      const areas = this.datosCombustible.porAreaVales.map(area => {
        return {
          nombre: area.area,
          vales: area.total || 0,
          monto: area.montoTotal || 0
        }
      }).sort((a, b) => (b.monto || 0) - (a.monto || 0))

      console.log('✅ Áreas procesadas:', areas)
      return areas
    },
    totalAreas() {
      return this.datosPorArea.length
    },
    totalVales() {
      return this.datosPorArea.reduce((total, area) => total + (area.vales || 0), 0)
    },
    totalMonto() {
      return this.datosPorArea.reduce((total, area) => total + (area.monto || 0), 0)
    },
    filteredAreas() {
      if (!this.searchTerm) return this.datosPorArea
      return this.datosPorArea.filter(area =>
        area.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    }
  },
  methods: {
    formatCurrency(value) {
      if (!value) return "$0"
      return `$${value.toLocaleString('es-AR')}`
    }
  }
}
</script>

<style scoped>
.combustible-por-area {
  padding: 1rem 0;
}

.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.ranking-list {
  max-height: 400px;
  overflow-y: auto;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.2s ease;
}

.ranking-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.rank-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  margin-right: 1rem;
}

.rank-1 .rank-number { background: #FFD700; }
.rank-2 .rank-number { background: #C0C0C0; }
.rank-3 .rank-number { background: #CD7F32; }
.rank-4 .rank-number, .rank-5 .rank-number { background: #6c757d; }

.rank-content {
  flex: 1;
}

.rank-name {
  font-weight: 600;
  margin: 0;
  color: #495057;
}

.rank-value {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0;
}

.rank-percentage {
  font-weight: bold;
  color: #28a745;
}

.table-row:hover {
  background-color: #f8f9fa;
}

.area-name {
  font-weight: 600;
}

.area-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  color: #6c757d;
}

.badge {
  font-size: 0.8rem;
  padding: 0.4rem 0.6rem;
}

@media (max-width: 768px) {
  .ranking-item {
    flex-direction: column;
    text-align: center;
  }

  .rank-number {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
}
</style>
