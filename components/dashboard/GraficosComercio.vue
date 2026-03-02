<template>
  <div>
    <h4 class="section-title">
      <i class="bi bi-pie-chart-fill mr-2"></i>
      Análisis de Trámites Comerciales
    </h4>

    <!-- Gráfico de Barras por Mes -->
    <b-row>
      <b-col md="12" class="mb-4">
        <b-card class="h-100">
          <template #header>
            <h6 class="mb-0">
              <i class="bi bi-bar-chart-fill mr-2"></i>
              Trámites por Mes de Ingreso
            </h6>
          </template>

          <div v-if="tramitesPorMes.length > 0" class="chart-container-large">
            <canvas ref="chartTramitesPorMes"></canvas>
          </div>
          <div v-else class="text-center text-muted py-4">
            <i class="bi bi-graph-down display-4"></i>
            <p class="mt-2">No hay datos disponibles</p>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <b-row>

      <!-- Gráfico por Rubro -->
      <b-col md="6" class="mb-4">
        <b-card class="h-100">
          <template #header>
            <h6 class="mb-0">
              <i class="bi bi-tags-fill mr-2"></i>
              Por Rubro
            </h6>
          </template>

          <div v-if="rubros.length > 0" class="chart-container">
            <canvas ref="chartRubros"></canvas>
          </div>
          <div v-else class="text-center text-muted py-4">
            <i class="bi bi-graph-down display-4"></i>
            <p class="mt-2">No hay datos disponibles</p>
          </div>
        </b-card>
      </b-col>

      <!-- Gráfico por Tipo de Solicitud -->
      <b-col md="6" class="mb-4">
        <b-card class="h-100">
          <template #header>
            <h6 class="mb-0">
              <i class="bi bi-list-ul mr-2"></i>
              Por Tipo de Solicitud
            </h6>
          </template>

          <div v-if="tiposSolicitud.length > 0" class="chart-container">
            <canvas ref="chartTiposSolicitud"></canvas>
          </div>
          <div v-else class="text-center text-muted py-4">
            <i class="bi bi-graph-down display-4"></i>
            <p class="mt-2">No hay datos disponibles</p>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <b-row>
      <!-- Gráfico por Localidad del Solicitante -->
      <b-col md="6" class="mb-4">
        <b-card class="h-100">
          <template #header>
            <h6 class="mb-0">
              <i class="bi bi-geo-alt-fill mr-2"></i>
              Por Localidad del Solicitante
            </h6>
          </template>

          <div v-if="localidadesSolicitante.length > 0" class="chart-container">
            <canvas ref="chartLocalidadesSolicitante"></canvas>
          </div>
          <div v-else class="text-center text-muted py-4">
            <i class="bi bi-graph-down display-4"></i>
            <p class="mt-2">No hay datos disponibles</p>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <b-row>
      <!-- Gráfico por Región del Solicitante -->
      <b-col md="6" class="mb-4">
        <b-card class="h-100">
          <template #header>
            <h6 class="mb-0">
              <i class="bi bi-map-fill mr-2"></i>
              Por Región del Solicitante
            </h6>
          </template>

          <div v-if="regionesSolicitante.length > 0" class="chart-container">
            <canvas ref="chartRegionesSolicitante"></canvas>
          </div>
          <div v-else class="text-center text-muted py-4">
            <i class="bi bi-graph-down display-4"></i>
            <p class="mt-2">No hay datos disponibles</p>
          </div>
        </b-card>
      </b-col>

      <!-- Gráfico por Estado -->
      <b-col md="6" class="mb-4">
        <b-card class="h-100">
          <template #header>
            <h6 class="mb-0">
              <i class="bi bi-check-circle-fill mr-2"></i>
              Por Estado
            </h6>
          </template>

          <div v-if="estados.length > 0" class="chart-container">
            <canvas ref="chartEstados"></canvas>
          </div>
          <div v-else class="text-center text-muted py-4">
            <i class="bi bi-graph-down display-4"></i>
            <p class="mt-2">No hay datos disponibles</p>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Chart from '~/plugins/chart.js'

export default {
  name: 'GraficosComercio',
  props: {
    estadisticasComercio: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      chartTramitesPorMes: null,
      chartRubros: null,
      chartTiposSolicitud: null,
      chartLocalidadesSolicitante: null,
      chartRegionesSolicitante: null,
      chartEstados: null
    }
  },
  computed: {
    tramitesPorMes() {
      if (!this.estadisticasComercio.porMesIngreso) return []
      const todosLosMeses = this.estadisticasComercio.porMesIngreso
      // Mostrar solo los últimos 18 meses
      return todosLosMeses.slice(-18)
    },
    rubros() {
      if (!this.estadisticasComercio.porRubro) return []
      return this.estadisticasComercio.porRubro.map(item => ({
        label: item[0],
        value: item[1]
      }))
    },
    tiposSolicitud() {
      if (!this.estadisticasComercio.porTipoSolicitud) return []
      return this.estadisticasComercio.porTipoSolicitud.map(item => ({
        label: item[0],
        value: item[1]
      }))
    },
    localidadesSolicitante() {
      if (!this.estadisticasComercio.porLocalidadSolicitanteGrafico) return []
      return this.estadisticasComercio.porLocalidadSolicitanteGrafico.map(item => ({
        label: item[0],
        value: item[1]
      }))
    },
    regionesSolicitante() {
      if (!this.estadisticasComercio.porRegionSolicitante) return []
      return this.estadisticasComercio.porRegionSolicitante.map(item => ({
        label: item[0],
        value: item[1]
      }))
    },
    estados() {
      if (!this.estadisticasComercio.porStatus) return []
      return Object.entries(this.estadisticasComercio.porStatus).map(([estado, cantidad]) => ({
        label: estado,
        value: cantidad
      }))
    }
  },
  watch: {
    tramitesPorMes: {
      handler() {
        this.$nextTick(() => {
          this.createChartTramitesPorMes()
        })
      },
      immediate: true
    },
    rubros: {
      handler() {
        this.$nextTick(() => {
          this.createChartRubros()
        })
      },
      immediate: true
    },
    tiposSolicitud: {
      handler() {
        this.$nextTick(() => {
          this.createChartTiposSolicitud()
        })
      },
      immediate: true
    },
    localidadesSolicitante: {
      handler() {
        this.$nextTick(() => {
          this.createChartLocalidadesSolicitante()
        })
      },
      immediate: true
    },
    regionesSolicitante: {
      handler() {
        this.$nextTick(() => {
          this.createChartRegionesSolicitante()
        })
      },
      immediate: true
    },
    estados: {
      handler() {
        this.$nextTick(() => {
          this.createChartEstados()
        })
      },
      immediate: true
    }
  },
  methods: {
    createChartTramitesPorMes() {
      if (this.chartTramitesPorMes) {
        this.chartTramitesPorMes.destroy()
      }

      if (this.tramitesPorMes.length === 0) return

      const ctx = this.$refs.chartTramitesPorMes
      if (!ctx) return

      this.chartTramitesPorMes = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.tramitesPorMes.map(item => item.mes),
          datasets: [{
            label: 'Trámites Ingresados',
            data: this.tramitesPorMes.map(item => item.cantidad),
            backgroundColor: '#17a2b8',
            borderColor: '#138496',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Mes',
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
                text: 'Número de Trámites',
                font: {
                  size: 14,
                  weight: 'bold'
                }
              },
              ticks: {
                stepSize: 1
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                title: function(context) {
                  return context[0].label
                },
                label: function(context) {
                  return `Trámites: ${context.parsed.y}`
                }
              }
            }
          }
        }
      })
    },

    createChartRubros() {
      if (this.chartRubros) {
        this.chartRubros.destroy()
      }

      if (this.rubros.length === 0) return

      const ctx = this.$refs.chartRubros
      if (!ctx) return

      // Generar colores dinámicamente, asignando gris a "Otros"
      const colores = this.rubros.map(item => {
        return item.label === 'Otros' ? '#6c757d' : null
      })

      // Colores predefinidos para los rubros principales
      const coloresDisponibles = [
        '#28a745', '#17a2b8', '#ffc107', '#dc3545', '#6f42c1',
        '#fd7e14', '#20c997', '#e83e8c', '#343a40'
      ]

      let colorIndex = 0
      const coloresFinales = colores.map((color, index) => {
        if (color === null) {
          return coloresDisponibles[colorIndex++ % coloresDisponibles.length]
        }
        return color
      })

      this.chartRubros = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.rubros.map(item => item.label),
          datasets: [{
            data: this.rubros.map(item => item.value),
            backgroundColor: coloresFinales,
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true,
                generateLabels: (chart) => {
                  const data = chart.data
                  if (data.labels.length && data.datasets.length) {
                    const dataset = data.datasets[0]
                    const total = dataset.data.reduce((a, b) => a + b, 0)
                    return data.labels.map((label, index) => {
                      const value = dataset.data[index]
                      const percentage = ((value / total) * 100).toFixed(1)
                      return {
                        text: `${label}: ${value} (${percentage}%)`,
                        fillStyle: dataset.backgroundColor[index],
                        strokeStyle: dataset.borderColor || '#fff',
                        lineWidth: dataset.borderWidth || 0,
                        pointStyle: 'circle',
                        hidden: false,
                        index: index
                      }
                    })
                  }
                  return []
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || ''
                  const value = context.parsed
                  const total = context.dataset.data.reduce((a, b) => a + b, 0)
                  const percentage = ((value / total) * 100).toFixed(1)
                  return `${label}: ${value} (${percentage}%)`
                }
              }
            }
          }
        }
      })
    },

    createChartTiposSolicitud() {
      if (this.chartTiposSolicitud) {
        this.chartTiposSolicitud.destroy()
      }

      if (this.tiposSolicitud.length === 0) return

      const ctx = this.$refs.chartTiposSolicitud
      if (!ctx) return

      this.chartTiposSolicitud = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.tiposSolicitud.map(item => item.label),
          datasets: [{
            data: this.tiposSolicitud.map(item => item.value),
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
              '#FF6384',
              '#C9CBCF'
            ],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true,
                generateLabels: (chart) => {
                  const data = chart.data
                  if (data.labels.length && data.datasets.length) {
                    const dataset = data.datasets[0]
                    const total = dataset.data.reduce((a, b) => a + b, 0)
                    return data.labels.map((label, index) => {
                      const value = dataset.data[index]
                      const percentage = ((value / total) * 100).toFixed(1)
                      return {
                        text: `${label}: ${value} (${percentage}%)`,
                        fillStyle: dataset.backgroundColor[index],
                        strokeStyle: dataset.borderColor || '#fff',
                        lineWidth: dataset.borderWidth || 0,
                        pointStyle: 'circle',
                        hidden: false,
                        index: index
                      }
                    })
                  }
                  return []
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || ''
                  const value = context.parsed
                  const total = context.dataset.data.reduce((a, b) => a + b, 0)
                  const percentage = ((value / total) * 100).toFixed(1)
                  return `${label}: ${value} (${percentage}%)`
                }
              }
            }
          }
        }
      })
    },

    createChartLocalidadesSolicitante() {
      if (this.chartLocalidadesSolicitante) {
        this.chartLocalidadesSolicitante.destroy()
      }

      if (this.localidadesSolicitante.length === 0) return

      const ctx = this.$refs.chartLocalidadesSolicitante
      if (!ctx) return

      this.chartLocalidadesSolicitante = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.localidadesSolicitante.map(item => item.label),
          datasets: [{
            data: this.localidadesSolicitante.map(item => item.value),
            backgroundColor: [
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#C9CBCF',
              '#4BC0C0'
            ],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true,
                generateLabels: (chart) => {
                  const data = chart.data
                  if (data.labels.length && data.datasets.length) {
                    const dataset = data.datasets[0]
                    const total = dataset.data.reduce((a, b) => a + b, 0)
                    return data.labels.map((label, index) => {
                      const value = dataset.data[index]
                      const percentage = ((value / total) * 100).toFixed(1)
                      return {
                        text: `${label}: ${value} (${percentage}%)`,
                        fillStyle: dataset.backgroundColor[index],
                        strokeStyle: dataset.borderColor || '#fff',
                        lineWidth: dataset.borderWidth || 0,
                        pointStyle: 'circle',
                        hidden: false,
                        index: index
                      }
                    })
                  }
                  return []
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || ''
                  const value = context.parsed
                  const total = context.dataset.data.reduce((a, b) => a + b, 0)
                  const percentage = ((value / total) * 100).toFixed(1)
                  return `${label}: ${value} (${percentage}%)`
                }
              }
            }
          }
        }
      })
    },

    createChartRegionesSolicitante() {
      if (this.chartRegionesSolicitante) {
        this.chartRegionesSolicitante.destroy()
      }

      if (this.regionesSolicitante.length === 0) return

      const ctx = this.$refs.chartRegionesSolicitante
      if (!ctx) return

      // Colores específicos para las regiones
      const regionColors = {
        'Partido de Villa Gesell': '#28a745', // Verde para Villa Gesell
        'Fuera de Villa Gesell': '#dc3545'    // Rojo para fuera
      }

      this.chartRegionesSolicitante = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.regionesSolicitante.map(item => item.label),
          datasets: [{
            data: this.regionesSolicitante.map(item => item.value),
            backgroundColor: this.regionesSolicitante.map(item =>
              regionColors[item.label] || '#6c757d'
            ),
            borderWidth: 3,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true,
                font: {
                  size: 14,
                  weight: 'bold'
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || ''
                  const value = context.parsed
                  const total = context.dataset.data.reduce((a, b) => a + b, 0)
                  const percentage = ((value / total) * 100).toFixed(1)
                  return `${label}: ${value} trámites (${percentage}%)`
                }
              }
            }
          }
        }
      })
    },

    createChartEstados() {
      if (this.chartEstados) {
        this.chartEstados.destroy()
      }

      if (this.estados.length === 0) return

      const ctx = this.$refs.chartEstados
      if (!ctx) return

      // Colores específicos para estados
      const estadoColors = {
        'En revisión': '#36A2EB',
        'Finalizada': '#4BC0C0',
        'Rechazada': '#FF6384',
        'Rectificación': '#FFCE56',
        'Esperando turno': '#9966FF',
        'Esperando inspección': '#FF9F40',
        'Inspeccionado': '#4BC0C0',
        'Esperando documentación': '#4BC0C0',
        'Prórroga 1': '#C9CBCF',
        'Prórroga 2': '#C9CBCF'
      }

      this.chartEstados = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.estados.map(item => item.label),
          datasets: [{
            data: this.estados.map(item => item.value),
            backgroundColor: this.estados.map(item =>
              estadoColors[item.label] || '#C9CBCF'
            ),
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true,
                generateLabels: (chart) => {
                  const data = chart.data
                  if (data.labels.length && data.datasets.length) {
                    const dataset = data.datasets[0]
                    const total = dataset.data.reduce((a, b) => a + b, 0)
                    return data.labels.map((label, index) => {
                      const value = dataset.data[index]
                      const percentage = ((value / total) * 100).toFixed(1)
                      return {
                        text: `${label}: ${value} (${percentage}%)`,
                        fillStyle: dataset.backgroundColor[index],
                        strokeStyle: dataset.borderColor || '#fff',
                        lineWidth: dataset.borderWidth || 0,
                        pointStyle: 'circle',
                        hidden: false,
                        index: index
                      }
                    })
                  }
                  return []
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || ''
                  const value = context.parsed
                  const total = context.dataset.data.reduce((a, b) => a + b, 0)
                  const percentage = ((value / total) * 100).toFixed(1)
                  return `${label}: ${value} (${percentage}%)`
                }
              }
            }
          }
        }
      })
    }
  },
  beforeDestroy() {
    if (this.chartTramitesPorMes) {
      this.chartTramitesPorMes.destroy()
    }
    if (this.chartRubros) {
      this.chartRubros.destroy()
    }
    if (this.chartTiposSolicitud) {
      this.chartTiposSolicitud.destroy()
    }
    if (this.chartLocalidadesSolicitante) {
      this.chartLocalidadesSolicitante.destroy()
    }
    if (this.chartRegionesSolicitante) {
      this.chartRegionesSolicitante.destroy()
    }
    if (this.chartEstados) {
      this.chartEstados.destroy()
    }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}

.chart-container-large {
  position: relative;
  height: 400px;
  width: 100%;
}

.section-title {
  color: #495057;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

.section-title i {
  color: #28a745;
  margin-right: 0.5rem;
}

.card {
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}

.card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
  border-radius: 15px 15px 0 0 !important;
}

.card-header h6 {
  color: #495057;
  font-weight: 600;
}

.card-header i {
  color: #28a745;
}
</style>
