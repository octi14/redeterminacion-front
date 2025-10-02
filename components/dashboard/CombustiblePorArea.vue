<template>
  <div class="combustible-por-area">
    <div class="header-section">
      <h4 class="section-title">
        <i class="bi bi-building-fill mr-2"></i>
        Emisión de vales de combustible por Área
      </h4>
      <p class="section-subtitle">Análisis detallado de la emisión de combustible por área municipal</p>
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
              <div class="stat-card">
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

          </div>
        </b-card>
      </div>
    </div>

    <!-- Gráfico de Barras por Área -->
    <div class="row mb-4">
      <div class="col-md-8">
        <b-card class="chart-card">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="bi bi-bar-chart-fill text-success mr-2"></i>
              <h5 class="mb-0">Emisión por Área</h5>
            </div>
          </template>

          <div class="chart-container">
            <canvas ref="chartConsumoPorArea"></canvas>
          </div>
        </b-card>
      </div>

      <div class="col-md-4">
        <b-card class="ranking-card">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="bi bi-trophy-fill text-warning mr-2"></i>
              <h5 class="mb-0">Top 5 Áreas</h5>
            </div>
          </template>

          <div class="ranking-list">
            <div
              v-for="(area, index) in topAreas"
              :key="area.nombre"
              class="ranking-item"
              :class="`rank-${index + 1}`"
            >
              <div class="rank-number">{{ index + 1 }}</div>
              <div class="rank-content">
                <h6 class="rank-name">{{ area.nombre }}</h6>
                <p class="rank-value">{{ formatCurrency(area.monto) }}</p>
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
                  <th>Saldo Restante</th>
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
                  <td class="text-right">
                    {{ formatCurrency(area.saldo) }}
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
import { Chart } from 'chart.js'

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
      searchTerm: '',
      chartConsumoPorArea: null
    }
  },
  computed: {
    datosPorArea() {
      // Debug: verificar qué datos están llegando
      console.log('🔍 Datos de combustible recibidos:', this.datosCombustible)

      // Usar los datos de emisión (órdenes) en lugar de consumo (vales)
      if (!this.datosCombustible || !this.datosCombustible.porArea) {
        console.log('⚠️ No hay datos de combustible o porArea')
        return []
      }

      console.log('📊 Datos porArea disponibles:', this.datosCombustible.porArea)

      // Los datos ya vienen procesados desde el backend con nombres de áreas
      const areas = this.datosCombustible.porArea.map(area => {
        return {
          nombre: area.nombre,
          vales: area.valesGenerados || 0,
          monto: area.montoTotal || 0,
          saldo: area.saldoRestante || 0
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
    topAreas() {
      return [...this.datosPorArea]
        .sort((a, b) => b.monto - a.monto)
        .slice(0, 5)
    },
    filteredAreas() {
      if (!this.searchTerm) return this.datosPorArea
      return this.datosPorArea.filter(area =>
        area.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    }
  },
  watch: {
    datosPorArea: {
      handler() {
        this.$nextTick(() => {
          this.createChart()
        })
      },
      immediate: true
    }
  },
  methods: {
    createChart() {
      if (this.chartConsumoPorArea) {
        this.chartConsumoPorArea.destroy()
      }

      if (this.datosPorArea.length === 0) return

      const ctx = this.$refs.chartConsumoPorArea
      if (!ctx) return

      const labels = this.datosPorArea.map(area => area.nombre)
      const montos = this.datosPorArea.map(area => area.monto || 0)
      const saldos = this.datosPorArea.map(area => area.saldo || 0)

      this.chartConsumoPorArea = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Monto Total Emitido',
              data: montos,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              borderRadius: 8,
            },
            {
              label: 'Saldo Restante',
              data: saldos,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
              borderRadius: 8,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                usePointStyle: true,
                padding: 20
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const area = this.datosPorArea[context.dataIndex]
                  let label = context.dataset.label || ''
                  if (label) {
                    label += ': '
                  }
                  if (context.parsed.y !== null) {
                    label += `$${context.parsed.y.toLocaleString('es-AR')}`
                  }
                  return label
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Áreas',
                font: {
                  size: 14,
                  weight: 'bold'
                }
              },
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Monto ($)',
                font: {
                  size: 14,
                  weight: 'bold'
                }
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString('es-AR')
                }
              }
            }
          }
        }
      })
    },
    generateColors(count) {
      const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
      ]
      return colors.slice(0, count)
    },
    darkenColor(color, percent) {
      const num = parseInt(color.replace("#", ""), 16)
      const amt = Math.round(2.55 * percent)
      const R = (num >> 16) - amt
      const G = (num >> 8 & 0x00FF) - amt
      const B = (num & 0x0000FF) - amt
      return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
    },
    formatCurrency(value) {
      if (!value) return "$0"
      return `$${value.toLocaleString('es-AR')}`
    },
  },
  beforeDestroy() {
    if (this.chartConsumoPorArea) {
      this.chartConsumoPorArea.destroy()
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

.chart-card, .ranking-card, .table-card {
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
}

.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
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
