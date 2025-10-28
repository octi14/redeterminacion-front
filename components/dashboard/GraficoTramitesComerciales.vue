<template>
  <div class="grafico-tramites-comerciales">
    <div class="header-section">
      <h4 class="section-title">
        <i class="bi bi-graph-up-arrow mr-2"></i>
        Trámites Comerciales por Mes
      </h4>
      <p class="section-subtitle">Comparación de trámites finalizados: Julio-Octubre 2024 vs 2025</p>
    </div>

    <!-- Controles del gráfico -->
    <div class="row mb-4">
      <div class="col-md-12">
        <b-form-group label="Filtros por Tipo de Solicitud">
          <b-form-checkbox-group
            v-model="tiposSolicitudFiltrados"
            :options="tiposSolicitudDisponibles"
            buttons
            button-variant="outline-secondary"
            size="sm"
          />
        </b-form-group>
      </div>
    </div>

    <!-- Resumen de datos -->
    <div class="row mb-4">
      <div class="col-md-6">
        <b-card class="summary-card">
          <template #header>
            <h6 class="mb-0">
              <i class="bi bi-calendar-check mr-2"></i>
              Período 2024
            </h6>
          </template>
          <div class="summary-content">
            <div class="summary-item">
              <span class="summary-label">Total trámites:</span>
              <span class="summary-value">{{ totalTramites2024 }}</span>
            </div>
          </div>
        </b-card>
      </div>
      <div class="col-md-6">
        <b-card class="summary-card">
          <template #header>
            <h6 class="mb-0">
              <i class="bi bi-calendar-check mr-2"></i>
              Período 2025
            </h6>
          </template>
          <div class="summary-content">
            <div class="summary-item">
              <span class="summary-label">Total trámites:</span>
              <span class="summary-value">{{ totalTramites2025 }}</span>
            </div>
          </div>
        </b-card>
      </div>
    </div>

    <!-- Gráfico principal -->
    <div class="row">
      <div class="col-12">
        <b-card class="chart-card">
          <template #header>
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="bi bi-bar-chart mr-2"></i>
                Comparación de Trámites Comerciales
              </h5>
              <div class="chart-controls">
                <b-button
                  variant="outline-primary"
                  size="sm"
                  @click="exportarGrafico"
                >
                  <i class="bi bi-download mr-1"></i>
                  Exportar
                </b-button>
              </div>
            </div>
          </template>

          <div class="chart-container">
            <canvas ref="chartCanvas" width="400" height="200"></canvas>
          </div>

          <!-- Leyenda personalizada -->
          <div class="chart-legend mt-3">
            <div class="legend-item">
              <div class="legend-color" style="background-color: #28a745;"></div>
              <span>2024</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #007bff;"></div>
              <span>2025</span>
            </div>
          </div>
        </b-card>
      </div>
    </div>

    <!-- Tabla de datos detallados -->
    <div class="row mt-4">
      <div class="col-12">
        <b-card class="table-card">
          <template #header>
            <h5 class="mb-0">
              <i class="bi bi-table mr-2"></i>
              Datos Detallados por Mes y Tipo de Solicitud
            </h5>
          </template>

          <div class="table-responsive">
            <table class="table table-hover">
              <thead class="table-header">
                <tr>
                  <th>Mes</th>
                  <th>Año</th>
                  <th v-for="tipo in tiposSolicitudDisponibles" :key="tipo">
                    {{ tipo }}
                  </th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="mes in meses" :key="mes">
                  <td class="font-weight-bold">{{ mes }}</td>
                  <td>
                    <div class="year-comparison">
                      <div class="year-2024">
                        <span class="year-label">2024:</span>
                        <span class="year-value">{{ (datosTabla[mes] && datosTabla[mes]['2024'] && datosTabla[mes]['2024'].total) || 0 }}</span>
                      </div>
                      <div class="year-2025">
                        <span class="year-label">2025:</span>
                        <span class="year-value">{{ (datosTabla[mes] && datosTabla[mes]['2025'] && datosTabla[mes]['2025'].total) || 0 }}</span>
                      </div>
                    </div>
                  </td>
                  <td v-for="tipo in tiposSolicitudDisponibles" :key="tipo">
                    <div class="tipo-comparison">
                      <div class="tipo-2024">
                        <span class="tipo-value">{{ (datosTabla[mes] && datosTabla[mes]['2024'] && datosTabla[mes]['2024'].tipos && datosTabla[mes]['2024'].tipos[tipo]) || 0 }}</span>
                      </div>
                      <div class="tipo-2025">
                        <span class="tipo-value">{{ (datosTabla[mes] && datosTabla[mes]['2025'] && datosTabla[mes]['2025'].tipos && datosTabla[mes]['2025'].tipos[tipo]) || 0 }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="font-weight-bold">
                    <div class="total-comparison">
                      <div class="total-2024">
                        <span class="total-value">{{ (datosTabla[mes] && datosTabla[mes]['2024'] && datosTabla[mes]['2024'].total) || 0 }}</span>
                      </div>
                      <div class="total-2025">
                        <span class="total-value">{{ (datosTabla[mes] && datosTabla[mes]['2025'] && datosTabla[mes]['2025'].total) || 0 }}</span>
                      </div>
                    </div>
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
import Chart from '~/plugins/chart.js'

export default {
  name: 'GraficoTramitesComerciales',
  props: {
    habilitaciones: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tiposSolicitudFiltrados: [],
      chart: null,
      meses: ['Julio', 'Agosto', 'Septiembre', 'Octubre']
    }
  },
  computed: {
    tiposSolicitudDisponibles() {
      if (!this.habilitaciones || this.habilitaciones.length === 0) return []

      const tipos = [...new Set(this.habilitaciones.map(h => h.tipoSolicitud).filter(Boolean))]
      return tipos.sort()
    },
    habilitacionesFiltradas() {
      if (!this.habilitaciones || this.habilitaciones.length === 0) return []

      let filtradas = this.habilitaciones.filter(h => h.status === 'Finalizada')

      if (this.tiposSolicitudFiltrados.length > 0) {
        filtradas = filtradas.filter(h => this.tiposSolicitudFiltrados.includes(h.tipoSolicitud))
      }

      return filtradas
    },
    datosGrafico() {
      const datos = {
        2024: { julio: 0, agosto: 0, septiembre: 0, octubre: 0 },
        2025: { julio: 0, agosto: 0, septiembre: 0, octubre: 0 }
      }

      this.habilitacionesFiltradas.forEach(habilitacion => {
        const fecha = new Date(habilitacion.createdAt)
        const año = fecha.getFullYear()
        const mes = fecha.getMonth() + 1 // getMonth() devuelve 0-11

        if (año === 2024 || año === 2025) {
          switch (mes) {
            case 7: datos[año].julio++; break
            case 8: datos[año].agosto++; break
            case 9: datos[año].septiembre++; break
            case 10: datos[año].octubre++; break
          }
        }
      })

      return datos
    },
    datosTabla() {
      const datos = {}

      this.meses.forEach(mes => {
        datos[mes] = {
          '2024': { total: 0, tipos: {} },
          '2025': { total: 0, tipos: {} }
        }

        // Inicializar tipos de solicitud
        this.tiposSolicitudDisponibles.forEach(tipo => {
          datos[mes]['2024'].tipos[tipo] = 0
          datos[mes]['2025'].tipos[tipo] = 0
        })
      })

      this.habilitacionesFiltradas.forEach(habilitacion => {
        const fecha = new Date(habilitacion.createdAt)
        const año = fecha.getFullYear()
        const mes = fecha.getMonth() + 1

        if (año === 2024 || año === 2025) {
          let mesNombre = ''
          switch (mes) {
            case 7: mesNombre = 'Julio'; break
            case 8: mesNombre = 'Agosto'; break
            case 9: mesNombre = 'Septiembre'; break
            case 10: mesNombre = 'Octubre'; break
          }

          if (mesNombre) {
            datos[mesNombre][año.toString()].total++
            if (habilitacion.tipoSolicitud) {
              datos[mesNombre][año.toString()].tipos[habilitacion.tipoSolicitud]++
            }
          }
        }
      })

      return datos
    },
    totalTramites2024() {
      return this.datosGrafico[2024].julio + this.datosGrafico[2024].agosto +
             this.datosGrafico[2024].septiembre + this.datosGrafico[2024].octubre
    },
    totalTramites2025() {
      return this.datosGrafico[2025].julio + this.datosGrafico[2025].agosto +
             this.datosGrafico[2025].septiembre + this.datosGrafico[2025].octubre
    }
  },
  watch: {
    habilitacionesFiltradas: {
      handler() {
        this.$nextTick(() => {
          this.crearGrafico()
        })
      },
      immediate: true
    },
    tiposSolicitudFiltrados() {
      this.actualizarGrafico()
    }
  },
  mounted() {
    // Inicializar con todos los tipos seleccionados
    this.tiposSolicitudFiltrados = [...this.tiposSolicitudDisponibles]
  },
  methods: {
    crearGrafico() {
      if (this.chart) {
        this.chart.destroy()
      }

      if (this.habilitacionesFiltradas.length === 0) return

      const ctx = this.$refs.chartCanvas
      if (!ctx) return

      const datos = this.datosGrafico

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.meses,
          datasets: [
            {
              label: '2024',
              data: [
                datos[2024].julio,
                datos[2024].agosto,
                datos[2024].septiembre,
                datos[2024].octubre
              ],
              backgroundColor: '#28a745',
              borderColor: '#28a745',
              borderWidth: 2
            },
            {
              label: '2025',
              data: [
                datos[2025].julio,
                datos[2025].agosto,
                datos[2025].septiembre,
                datos[2025].octubre
              ],
              backgroundColor: '#007bff',
              borderColor: '#007bff',
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false // Usamos nuestra propia leyenda
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              callbacks: {
                title: function(context) {
                  return context[0].label
                },
                label: function(context) {
                  return `${context.dataset.label}: ${context.parsed.y} trámites`
                }
              }
            },
            datalabels: {
              display: true,
              color: '#ffffff',
              font: {
                weight: 'bold',
                size: 12
              },
              formatter: function(value, context) {
                return value > 0 ? value : ''
              },
              anchor: 'center',
              align: 'center'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          }
        }
      })
    },
    actualizarGrafico() {
      this.$nextTick(() => {
        this.crearGrafico()
      })
    },
    exportarGrafico() {
      if (!this.chart) return

      const url = this.chart.toBase64Image()
      const link = document.createElement('a')
      link.download = `tramites-comerciales-${new Date().toISOString().split('T')[0]}.png`
      link.href = url
      link.click()
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy()
    }
  }
}
</script>

<style scoped>
.grafico-tramites-comerciales {
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

.summary-content {
  padding: 0.5rem 0;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.summary-item:last-child {
  margin-bottom: 0;
}

.summary-label {
  color: #6c757d;
  font-size: 0.9rem;
}

.summary-value {
  color: #495057;
  font-weight: 600;
  font-size: 1.1rem;
}

.chart-card {
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
}

.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 3px;
}

.table-card {
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
}

.table-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.year-comparison,
.tipo-comparison,
.total-comparison {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.year-2024,
.tipo-2024,
.total-2024 {
  color: #28a745;
  font-weight: 600;
}

.year-2025,
.tipo-2025,
.total-2025 {
  color: #007bff;
  font-weight: 600;
}

.year-label,
.tipo-label {
  font-size: 0.8rem;
  font-weight: normal;
}

.year-value,
.tipo-value,
.total-value {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .chart-container {
    height: 300px;
  }

  .chart-legend {
    flex-direction: column;
    gap: 1rem;
  }

  .year-comparison,
  .tipo-comparison,
  .total-comparison {
    flex-direction: row;
    gap: 1rem;
  }
}
</style>
