<template>
  <div class="estadisticas-por-patente">
    <div class="header-section">
      <h4 class="section-title">
        <i class="bi bi-car-front-fill mr-2"></i>
        Consumo por Patente
      </h4>
    </div>

    <!-- Resumen General -->
    <div class="row mb-4">
      <div class="col-md-12">
        <b-card class="summary-card">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="bi bi-graph-up text-primary mr-2"></i>
              <h5 class="mb-0">Resumen por Patente</h5>
            </div>
          </template>

          <div class="row">
            <div class="col-md-3 col-sm-6 mb-3">
              <div class="stat-card">
                <div class="stat-icon bg-primary">
                  <i class="bi bi-car-front"></i>
                </div>
                <div class="stat-content">
                  <h3 class="stat-number">{{ totalPatentes }}</h3>
                  <p class="stat-label">Patentes Activas</p>
                </div>
              </div>
            </div>

            <div class="col-md-3 col-sm-6 mb-3">
              <div class="stat-card">
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
              <div class="stat-card">
                <div class="stat-icon bg-warning">
                  <i class="bi bi-currency-dollar"></i>
                </div>
                <div class="stat-content">
                  <h3 class="stat-number">{{ formatCurrency(totalMonto) }}</h3>
                  <p class="stat-label">Monto Total Emitido</p>
                </div>
              </div>
            </div>

            <div class="col-md-3 col-sm-6 mb-3">
              <div class="stat-card">
                <div class="stat-icon bg-info">
                  <i class="bi bi-speedometer2"></i>
                </div>
                <div class="stat-content">
                  <h3 class="stat-number">{{ formatCurrency(promedioPorPatente) }}</h3>
                  <p class="stat-label">Promedio por Patente</p>
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
                <h5 class="mb-0">Detalle por Patente</h5>
              </div>
              <div class="table-controls">
                <b-form-input
                  v-model="searchTerm"
                  placeholder="Buscar patente..."
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
                  <th>Patente</th>
                  <th>Vales Emitidos</th>
                  <th>Monto Total</th>
                  <th>Promedio por Vale</th>
                  <th>Última Emisión</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="patente in filteredPatentes"
                  :key="patente.dominio"
                  class="table-row"
                  :class="{ 'sin-patente-row': patente.dominio === 'SIN PATENTE ASIGNADA' }"
                >
                  <td class="patente-name">
                    <div class="d-flex align-items-center">
                      <div class="patente-icon">
                        <i :class="patente.dominio === 'SIN PATENTE ASIGNADA' ? 'bi bi-question-circle' : 'bi bi-car-front'"></i>
                      </div>
                      <span class="font-weight-bold">{{ patente.dominio }}</span>
                    </div>
                  </td>
                  <td class="text-center">
                    <span class="badge badge-primary">{{ patente.totalVales }}</span>
                  </td>
                  <td class="text-right font-weight-bold">
                    {{ formatCurrency(patente.montoTotal) }}
                  </td>
                  <td class="text-right">
                    {{ formatCurrency(patente.promedioPorVale) }}
                  </td>
                  <td class="text-center">
                    <span class="text-muted">{{ formatDate(patente.ultimaEmision) }}</span>
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
  name: 'EstadisticasPorPatente',
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
    datosPorPatente() {
      // Debug: verificar qué datos están llegando
      console.log('🔍 Datos de combustible para patentes:', this.datosCombustible)

      // Procesar vales consumidos por patente
      if (!this.datosCombustible || !this.datosCombustible.vales) {
        console.log('⚠️ No hay datos de vales de combustible')
        return []
      }

      const valesEmitidos = this.datosCombustible.vales.filter(vale =>
        !vale.anulado
      )

      console.log('📊 Vales emitidos (no anulados) encontrados:', valesEmitidos.length)

      // Agrupar por patente (incluyendo vales sin patente)
      const patentesMap = new Map()

      valesEmitidos.forEach(vale => {
        const dominio = vale.dominio || 'SIN PATENTE ASIGNADA'
        if (!patentesMap.has(dominio)) {
          patentesMap.set(dominio, {
            dominio,
            totalVales: 0,
            montoTotal: 0,
            fechasConsumo: []
          })
        }

        const patenteData = patentesMap.get(dominio)
        patenteData.totalVales += 1
        patenteData.montoTotal += parseFloat(vale.monto) || 0
        patenteData.fechasConsumo.push(new Date(vale.fechaEmision))
      })

      // Convertir a array y calcular estadísticas adicionales
      const patentes = Array.from(patentesMap.values()).map(patente => {
        const promedioPorVale = patente.totalVales > 0
          ? patente.montoTotal / patente.totalVales
          : 0

        const ultimaEmision = patente.fechasConsumo.length > 0
          ? new Date(Math.max(...patente.fechasConsumo.map(d => d.getTime())))
          : null

        return {
          ...patente,
          promedioPorVale,
          ultimaEmision
        }
      }).sort((a, b) => b.montoTotal - a.montoTotal)

      console.log('✅ Patentes procesadas:', patentes)
      return patentes
    },
    totalPatentes() {
      return this.datosPorPatente.length
    },
    totalVales() {
      return this.datosPorPatente.reduce((total, patente) => total + patente.totalVales, 0)
    },
    totalMonto() {
      return this.datosPorPatente.reduce((total, patente) => total + patente.montoTotal, 0)
    },
    promedioPorPatente() {
      return this.totalPatentes > 0 ? this.totalMonto / this.totalPatentes : 0
    },
    filteredPatentes() {
      if (!this.searchTerm) return this.datosPorPatente
      return this.datosPorPatente.filter(patente =>
        patente.dominio.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    }
  },
  methods: {
    formatCurrency(value) {
      if (!value) return "$0"
      return `$${value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('es-AR')
    }
  }
}
</script>

<style scoped>
.estadisticas-por-patente {
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

.patente-name {
  font-weight: 600;
}

.patente-icon {
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

.sin-patente-row {
  background-color: #fff3cd !important;
  border-left: 4px solid #ffc107;
}

.sin-patente-row:hover {
  background-color: #ffeaa7 !important;
}

.sin-patente-row .patente-icon {
  background: #ffc107 !important;
  color: #856404 !important;
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
