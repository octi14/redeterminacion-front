<template>
  <div class="estadisticas-por-patente">
    <div class="header-section">
      <h4 class="section-title">
        <i class="bi bi-car-front-fill mr-2"></i>
        Consumo por Patente
      </h4>
      <p class="section-subtitle">Top 10 vehículos con mayor consumo de combustible</p>
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
                  <p class="stat-label">Vales Consumidos</p>
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
                  <p class="stat-label">Monto Total Consumido</p>
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

    <!-- Gráfico de Barras por Patente -->
    <div class="row mb-4">
      <div class="col-md-8">
        <b-card class="chart-card">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="bi bi-bar-chart-fill text-success mr-2"></i>
              <h5 class="mb-0">Consumo por Patente</h5>
            </div>
          </template>

          <div class="chart-container">
            <canvas ref="chartConsumoPorPatente"></canvas>
          </div>
        </b-card>
      </div>

      <div class="col-md-4">
        <b-card class="ranking-card">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="bi bi-trophy-fill text-warning mr-2"></i>
              <h5 class="mb-0">Top 10 Patentes</h5>
            </div>
          </template>

          <div class="ranking-list">
            <div
              v-for="(patente, index) in topPatentes"
              :key="patente.dominio"
              class="ranking-item"
              :class="`rank-${index + 1}`"
            >
              <div class="rank-number">{{ index + 1 }}</div>
              <div class="rank-content">
                <h6 class="rank-name">{{ patente.dominio }}</h6>
                <p class="rank-value">{{ formatCurrency(patente.montoTotal) }}</p>
                <small class="rank-details">{{ patente.totalVales }} vales</small>
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
                  <th>Vales Consumidos</th>
                  <th>Monto Total</th>
                  <th>Promedio por Vale</th>
                  <th>Último Consumo</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="patente in filteredPatentes"
                  :key="patente.dominio"
                  class="table-row"
                >
                  <td class="patente-name">
                    <div class="d-flex align-items-center">
                      <div class="patente-icon">
                        <i class="bi bi-car-front"></i>
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
                    <span class="text-muted">{{ formatDate(patente.ultimoConsumo) }}</span>
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
  name: 'EstadisticasPorPatente',
  props: {
    datosCombustible: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      searchTerm: '',
      chartConsumoPorPatente: null
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

      const valesConsumidos = this.datosCombustible.vales.filter(vale =>
        vale.consumido && vale.dominio && !vale.anulado
      )

      console.log('📊 Vales consumidos encontrados:', valesConsumidos.length)

      // Agrupar por patente
      const patentesMap = new Map()

      valesConsumidos.forEach(vale => {
        const dominio = vale.dominio
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

        const ultimoConsumo = patente.fechasConsumo.length > 0
          ? new Date(Math.max(...patente.fechasConsumo.map(d => d.getTime())))
          : null

        return {
          ...patente,
          promedioPorVale,
          ultimoConsumo
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
    topPatentes() {
      return this.datosPorPatente.slice(0, 10)
    },
    filteredPatentes() {
      if (!this.searchTerm) return this.datosPorPatente
      return this.datosPorPatente.filter(patente =>
        patente.dominio.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    }
  },
  watch: {
    datosPorPatente: {
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
      if (this.chartConsumoPorPatente) {
        this.chartConsumoPorPatente.destroy()
      }

      if (this.datosPorPatente.length === 0) return

      const ctx = this.$refs.chartConsumoPorPatente
      if (!ctx) return

      const labels = this.topPatentes.map(patente => patente.dominio)
      const data = this.topPatentes.map(patente => patente.montoTotal)

      this.chartConsumoPorPatente = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Monto Consumido',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            borderRadius: 8,
          }]
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
                text: 'Patentes',
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
    formatCurrency(value) {
      if (!value) return "$0"
      return `$${value.toLocaleString('es-AR')}`
    },
    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('es-AR')
    }
  },
  beforeDestroy() {
    if (this.chartConsumoPorPatente) {
      this.chartConsumoPorPatente.destroy()
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
  max-height: 500px;
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
.rank-4 .rank-number, .rank-5 .rank-number,
.rank-6 .rank-number, .rank-7 .rank-number,
.rank-8 .rank-number, .rank-9 .rank-number,
.rank-10 .rank-number { background: #6c757d; }

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

.rank-details {
  font-size: 0.8rem;
  color: #6c757d;
  margin: 0;
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
