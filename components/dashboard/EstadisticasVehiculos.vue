<template>
  <div class="estadisticas-vehiculos">
    <div class="header-section">
      <h4 class="section-title">
        <i class="bi bi-car-front-fill mr-2"></i>
        Estadísticas de Vehículos
      </h4>
      <p class="section-subtitle">Análisis de vehículos por área municipal</p>
    </div>

    <!-- Resumen General -->
    <div class="row mb-4">
      <div class="col-md-12">
        <b-card class="summary-card">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="bi bi-graph-up text-primary mr-2"></i>
              <h5 class="mb-0">Resumen de Vehículos</h5>
            </div>
          </template>

          <div class="row">
            <div class="col-md-4 col-sm-6 mb-3">
              <div class="stat-card">
                <div class="stat-icon bg-primary">
                  <i class="bi bi-car-front"></i>
                </div>
                <div class="stat-content">
                  <h3 class="stat-number">{{ totalVehiculos }}</h3>
                  <p class="stat-label">Total de Vehículos</p>
                </div>
              </div>
            </div>

            <div class="col-md-4 col-sm-6 mb-3">
              <div class="stat-card">
                <div class="stat-icon bg-success">
                  <i class="bi bi-building"></i>
                </div>
                <div class="stat-content">
                  <h3 class="stat-number">{{ totalAreas }}</h3>
                  <p class="stat-label">Áreas con Vehículos</p>
                </div>
              </div>
            </div>

            <div class="col-md-4 col-sm-6 mb-3">
              <div class="stat-card">
                <div class="stat-icon bg-info">
                  <i class="bi bi-speedometer2"></i>
                </div>
                <div class="stat-content">
                  <h3 class="stat-number">{{ promedioPorArea }}</h3>
                  <p class="stat-label">Promedio por Área</p>
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
                  <th>Total Vehículos</th>
                  <th>Porcentaje</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="area in filteredAreas"
                  :key="area.area"
                  class="table-row"
                >
                  <td class="area-name">
                    <div class="d-flex align-items-center">
                      <div class="area-icon">
                        <i class="bi bi-building"></i>
                      </div>
                      <span class="font-weight-bold">{{ area.area }}</span>
                    </div>
                  </td>
                  <td class="text-center">
                    <span class="badge badge-primary">{{ area.total }}</span>
                  </td>
                  <td class="text-right">
                    {{ area.porcentaje }}%
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
  name: 'EstadisticasVehiculos',
  props: {
    vehiculos: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchTerm: ''
    }
  },
  computed: {
    vehiculosPorArea() {
      if (!this.vehiculos || this.vehiculos.length === 0) {
        console.log('⚠️ No hay datos de vehículos')
        return []
      }

      console.log('📊 Vehículos recibidos:', this.vehiculos.length)

      // Agrupar vehículos por área
      const areasMap = new Map()

      this.vehiculos.forEach(vehiculo => {
        const area = vehiculo.area || 'Sin Área Asignada'
        if (!areasMap.has(area)) {
          areasMap.set(area, {
            area,
            total: 0
          })
        }
        areasMap.get(area).total += 1
      })

      // Convertir a array y calcular porcentajes
      const areas = Array.from(areasMap.values()).map(area => {
        const porcentaje = this.totalVehiculos > 0
          ? ((area.total / this.totalVehiculos) * 100).toFixed(1)
          : 0
        return {
          ...area,
          porcentaje: parseFloat(porcentaje)
        }
      }).sort((a, b) => b.total - a.total)

      console.log('✅ Áreas procesadas:', areas)
      return areas
    },
    totalVehiculos() {
      return this.vehiculos ? this.vehiculos.length : 0
    },
    totalAreas() {
      return this.vehiculosPorArea.length
    },
    promedioPorArea() {
      return this.totalAreas > 0 ? Math.round(this.totalVehiculos / this.totalAreas) : 0
    },
    filteredAreas() {
      if (!this.searchTerm) return this.vehiculosPorArea
      return this.vehiculosPorArea.filter(area =>
        area.area.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.estadisticas-vehiculos {
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

.summary-card {
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: white;
  font-size: 1.2rem;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
  color: #495057;
}

.stat-label {
  color: #6c757d;
  margin: 0;
  font-size: 0.9rem;
}

.table-card {
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
}

.table-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
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

.search-input {
  border-radius: 20px;
  border: 1px solid #ced4da;
}

.search-input:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.badge {
  font-size: 0.8rem;
  padding: 0.4rem 0.6rem;
}

@media (max-width: 768px) {
  .stat-card {
    flex-direction: column;
    text-align: center;
  }

  .stat-icon {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
}
</style>
