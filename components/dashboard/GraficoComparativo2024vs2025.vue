<template>
  <div class="grafico-comparativo-2024-2025">
    <b-card class="mb-4 shadow-sm">
      <template #header>
        <div class="d-flex align-items-center justify-content-between flex-wrap">
          <div>
            <i class="bi bi-graph-up text-primary mr-2"></i>
            <strong>Comparación de Trámites Comerciales: 2024 vs 2025</strong>
          </div>
          <b-badge variant="info" class="ml-2 mt-2 mt-md-0">
            Total 2024: {{ total2024 }} | Total 2025: {{ total2025 }}
          </b-badge>
        </div>
      </template>

      <div v-if="loading" class="text-center py-4">
        <b-spinner variant="primary" label="Cargando..."></b-spinner>
        <p class="mt-2 text-muted">Cargando datos del gráfico...</p>
      </div>

      <div v-else-if="chartData.labels.length === 0 || (chartData.datasets[0].data.every(d => d === 0) && chartData.datasets[1].data.every(d => d === 0))" class="text-center py-4">
        <i class="bi bi-inbox text-muted" style="font-size: 3rem;"></i>
        <p class="mt-2 text-muted">No hay datos suficientes para mostrar la comparación</p>
      </div>

      <div v-else>
        <div style="position: relative; height: 400px; width: 100%;">
          <canvas ref="comparativeChart" style="max-height: 400px;"></canvas>
        </div>

      </div>
    </b-card>
  </div>
</template>

<script>
import Chart from '~/plugins/chart.js'

export default {
  name: 'GraficoComparativo2024vs2025',
  props: {
    habilitaciones: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      chart: null,
      chartData: {
        labels: [],
        datasets: [
          {
            label: '2024',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointHoverBackgroundColor: 'rgba(54, 162, 235, 1)',
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 3
          },
          {
            label: '2025',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointHoverBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 3
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 15,
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + context.parsed.y + ' trámites'
              }
            }
          },
          datalabels: {
            display: true,
            color: '#212529',
            anchor: function(context) {
              try {
                if (!context.chart || !context.chart.data || !context.chart.data.datasets) {
                  return 'end'
                }
                const dataIndex = context.dataIndex
                const datasets = context.chart.data.datasets
                
                if (datasets.length < 2) return 'end'
                
                const value0 = datasets[0].data[dataIndex] || 0
                const value1 = datasets[1].data[dataIndex] || 0
                const currentValue = context.parsed.y || 0
                const currentDatasetIndex = context.datasetIndex
                
                if (currentDatasetIndex === 0) {
                  return currentValue >= value1 ? 'end' : 'start'
                } else {
                  return currentValue >= value0 ? 'end' : 'start'
                }
              } catch (e) {
                console.error('Error en anchor:', e)
                return 'end'
              }
            },
            align: function(context) {
              try {
                if (!context.chart || !context.chart.data || !context.chart.data.datasets) {
                  return 'top'
                }
                const dataIndex = context.dataIndex
                const datasets = context.chart.data.datasets
                
                if (datasets.length < 2) return 'top'
                
                const value0 = datasets[0].data[dataIndex] || 0
                const value1 = datasets[1].data[dataIndex] || 0
                const currentValue = context.parsed.y || 0
                const currentDatasetIndex = context.datasetIndex
                
                if (currentDatasetIndex === 0) {
                  return currentValue >= value1 ? 'top' : 'bottom'
                } else {
                  return currentValue >= value0 ? 'top' : 'bottom'
                }
              } catch (e) {
                console.error('Error en align:', e)
                return 'top'
              }
            },
            offset: function(context) {
              try {
                if (!context.chart || !context.chart.data || !context.chart.data.datasets) {
                  return 8
                }
                const dataIndex = context.dataIndex
                const datasets = context.chart.data.datasets
                
                if (datasets.length < 2) return 8
                
                const value0 = datasets[0].data[dataIndex] || 0
                const value1 = datasets[1].data[dataIndex] || 0
                const currentValue = context.parsed.y || 0
                const currentDatasetIndex = context.datasetIndex
                
                if (currentDatasetIndex === 0) {
                  return currentValue >= value1 ? 8 : -8
                } else {
                  return currentValue >= value0 ? 8 : -8
                }
              } catch (e) {
                console.error('Error en offset:', e)
                return 8
              }
            },
            formatter: function(value, context) {
              if (context && context.parsed && context.parsed.y !== undefined) {
                return context.parsed.y > 0 ? context.parsed.y : ''
              }
              return value > 0 ? value : ''
            },
            font: {
              weight: 'bold',
              size: 11
            },
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: {
              top: 4,
              bottom: 4,
              left: 6,
              right: 6
            },
            borderRadius: 4,
            borderWidth: 1,
            borderColor: function(context) {
              const datasetIndex = context.datasetIndex || 0
              return datasetIndex === 0 ? 'rgba(54, 162, 235, 0.5)' : 'rgba(75, 192, 192, 0.5)'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                return Math.floor(value)
              }
            },
            title: {
              display: true,
              text: 'Cantidad de Trámites',
              font: {
                size: 12,
                weight: 'bold'
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Mes',
              font: {
                size: 12,
                weight: 'bold'
              }
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    }
  },
  computed: {
    // Obtener mes actual (noviembre = 11)
    mesActual() {
      return new Date().getMonth() + 1
    },

    // Texto para mostrar el rango de meses
    mesesAMostrarTexto() {
      const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ]
      return meses[this.mesActual - 1] || 'Noviembre'
    },

    // Filtrar trámites por año
    tramites2024() {
      return this.filtrarPorAnio(2024)
    },

    tramites2025() {
      return this.filtrarPorAnio(2025)
    },

    // Agrupar por mes
    datosPorMes2024() {
      return this.agruparPorMes(this.tramites2024)
    },

    datosPorMes2025() {
      return this.agruparPorMes(this.tramites2025)
    },

    // Totales
    total2024() {
      return this.tramites2024.length
    },

    total2025() {
      return this.tramites2025.length
    }
  },
  watch: {
    habilitaciones: {
      handler() {
        this.$nextTick(() => {
          this.actualizarGrafico()
        })
      },
      deep: true,
      immediate: false
    }
  },
  async mounted() {
    await this.$nextTick()
    await this.crearGrafico()
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy()
      this.chart = null
    }
  },
  methods: {
    // Filtrar trámites por año
    filtrarPorAnio(anio) {
      if (!this.habilitaciones || this.habilitaciones.length === 0) {
        return []
      }

      return this.habilitaciones.filter(tramite => {
        if (!tramite.createdAt) return false

        const fecha = this.convertirFecha(tramite.createdAt)
        if (!fecha) return false

        return fecha.getFullYear() === anio
      })
    },

    // Agrupar trámites por mes
    agruparPorMes(tramites) {
      const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ]

      const datosPorMes = {}
      meses.forEach((mes, index) => {
        datosPorMes[index + 1] = {
          mes: mes,
          mesNumero: index + 1,
          total: 0
        }
      })

      tramites.forEach(tramite => {
        if (!tramite.createdAt) return

        const fecha = this.convertirFecha(tramite.createdAt)
        if (!fecha) return

        const mes = fecha.getMonth() + 1
        if (datosPorMes[mes]) {
          datosPorMes[mes].total++
        }
      })

      return Object.values(datosPorMes)
    },

    // Convertir fecha a objeto Date
    convertirFecha(createdAt) {
      if (!createdAt) return null

      let fecha

      if (typeof createdAt === 'string') {
        if (createdAt.includes('/')) {
          const partes = createdAt.split('/')
          if (partes.length === 3) {
            fecha = new Date(partes[2], partes[1] - 1, partes[0])
          } else {
            fecha = new Date(createdAt)
          }
        } else {
          fecha = new Date(createdAt)
        }
      } else if (createdAt instanceof Date) {
        fecha = createdAt
      } else {
        fecha = new Date(createdAt)
      }

      if (!(fecha instanceof Date) || isNaN(fecha.getTime())) {
        return null
      }

      return fecha
    },

    // Actualizar datos del gráfico
    actualizarGrafico() {
      const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ]

      // Mostrar todos los meses del año
      this.chartData.labels = meses

      // Datos para 2024 - mapear todos los meses usando mesNumero
      const datos2024 = meses.map((mes, index) => {
        const mesNumero = index + 1
        const mesData = this.datosPorMes2024.find(d => d.mesNumero === mesNumero)
        return mesData ? mesData.total : 0
      })

      // Datos para 2025 - mapear todos los meses usando mesNumero
      const datos2025 = meses.map((mes, index) => {
        const mesNumero = index + 1
        const mesData = this.datosPorMes2025.find(d => d.mesNumero === mesNumero)
        return mesData ? mesData.total : 0
      })

      this.chartData.datasets[0].data = datos2024
      this.chartData.datasets[1].data = datos2025

      if (this.chart) {
        this.chart.update()
      }
    },

    // Crear el gráfico
    async crearGrafico() {
      // Esperar a que el canvas esté disponible
      await this.$nextTick()
      
      if (!this.$refs.comparativeChart) {
        console.warn('Canvas no encontrado, reintentando...')
        setTimeout(() => this.crearGrafico(), 100)
        return
      }

      const ctx = this.$refs.comparativeChart.getContext('2d')
      if (!ctx) {
        console.error('No se pudo obtener el contexto del canvas')
        return
      }

      // Destruir gráfico anterior si existe
      if (this.chart) {
        this.chart.destroy()
        this.chart = null
      }

      // Actualizar datos antes de crear el gráfico
      this.actualizarGrafico()

      // Crear nuevo gráfico
      try {
        this.chart = new Chart(ctx, {
          type: 'line',
          data: this.chartData,
          options: this.chartOptions
        })
      } catch (error) {
        console.error('Error al crear el gráfico:', error)
      }
    }
  }
}
</script>

<style scoped>
.grafico-comparativo-2024-2025 {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

canvas {
  max-height: 400px !important;
  height: 400px !important;
  margin: 20px 0;
  width: 100% !important;
}

.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}
</style>
