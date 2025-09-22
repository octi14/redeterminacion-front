<template>
  <div>
    <h4 class="section-title">
      <i class="bi bi-bar-chart-fill mr-2"></i>
      Análisis de Abierto Anual
    </h4>

    <!-- Gráfico de Barras Consolidado -->
    <b-row>
      <b-col md="12" class="mb-4">
        <b-card class="h-100">
          <template #header>
            <h6 class="mb-0">
              <i class="bi bi-bar-chart-fill mr-2"></i>
              Contribuyentes por Período
            </h6>
          </template>

          <div v-if="periodos.length > 0" class="chart-container-large">
            <canvas ref="chartBarrasConsolidado"></canvas>
          </div>
          <div v-else class="text-center text-muted py-4">
            <i class="bi bi-graph-down display-4"></i>
            <p class="mt-2">No hay datos disponibles</p>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <!-- Resumen de Períodos -->
    <b-row>
      <b-col md="12" class="mb-4">
        <b-card class="h-100">
          <template #header>
            <h6 class="mb-0">
              <i class="bi bi-calendar-range-fill mr-2"></i>
              Resumen por Período
            </h6>
          </template>

          <div v-if="periodos.length > 0" class="periodo-summary">
            <div v-for="periodo in periodos" :key="periodo.periodo" class="periodo-item mb-3">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0 text-primary">{{ periodo.periodo }}</h6>
                <span class="badge badge-info">{{ periodo.total }} total</span>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-success">
                  <i class="bi bi-check-circle-fill mr-1"></i>
                  Con facturas: {{ periodo.conFacturas }}
                </span>
                <span class="text-danger">
                  <i class="bi bi-x-circle-fill mr-1"></i>
                  Sin facturas: {{ periodo.sinFacturas }}
                </span>
              </div>
              <div class="progress mt-2" style="height: 8px;">
                <div
                  class="progress-bar bg-success"
                  :style="{ width: (periodo.conFacturas / periodo.total * 100) + '%' }"
                ></div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-muted py-4">
            <i class="bi bi-graph-down display-4"></i>
            <p class="mt-2">No hay datos disponibles</p>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <!-- Análisis de Rechazos por Motivo y Período -->
    <b-row>
      <b-col md="12" class="mb-4">
        <b-card class="h-100">
          <template #header>
            <h6 class="mb-0">
              <i class="bi bi-exclamation-triangle-fill mr-2"></i>
              Rechazos por Motivo y Período
            </h6>
          </template>

          <div v-if="rechazosPorMotivo.length > 0" class="rechazos-summary">
            <div v-for="motivo in rechazosPorMotivo" :key="motivo.motivo" class="motivo-item mb-3">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0 text-warning">{{ motivo.motivo }}</h6>
                <span class="badge badge-warning">{{ motivo.total }} total</span>
              </div>
              <div class="row">
                <div class="col-4">
                  <div class="text-center">
                    <div class="periodo-count text-primary">
                      <strong>{{ motivo.periodo1 }}</strong>
                    </div>
                    <small class="text-muted">Período 1</small>
                  </div>
                </div>
                <div class="col-4">
                  <div class="text-center">
                    <div class="periodo-count text-info">
                      <strong>{{ motivo.periodo2 }}</strong>
                    </div>
                    <small class="text-muted">Período 2</small>
                  </div>
                </div>
                <div class="col-4">
                  <div class="text-center">
                    <div class="periodo-count text-secondary">
                      <strong>{{ motivo.periodo3 }}</strong>
                    </div>
                    <small class="text-muted">Período 3</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-muted py-4">
            <i class="bi bi-check-circle display-4"></i>
            <p class="mt-2">No hay rechazos registrados</p>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <!-- Análisis Específicos -->
    <b-row>
      <b-col md="12" class="mb-4">
        <b-card class="h-100">
          <template #header>
            <h6 class="mb-0">
              <i class="bi bi-search mr-2"></i>
              Análisis Específicos
            </h6>
          </template>

          <div v-if="analisisEspecificos" class="analisis-summary">
            <div class="analisis-item mb-3 p-3 border rounded">
              <div class="d-flex align-items-center">
                <i class="bi bi-arrow-clockwise text-primary mr-3" style="font-size: 1.5rem;"></i>
                <div>
                  <h6 class="mb-1 text-primary">Rechazados por cambio de categoría pero cargaron en período 2</h6>
                  <p class="mb-0 text-muted">Contribuyentes que fueron rechazados en el primer período por cambio de categoría tributaria, pero igual cargaron facturas en el segundo período.</p>
                </div>
                <div class="ml-auto">
                  <span class="badge badge-primary badge-lg">{{ analisisEspecificos.rechazoCategoriaPeroCargoPeriodo2 }}</span>
                </div>
              </div>
            </div>

            <div class="analisis-item mb-3 p-3 border rounded">
              <div class="d-flex align-items-center">
                <i class="bi bi-calendar-x text-warning mr-3" style="font-size: 1.5rem;"></i>
                <div>
                  <h6 class="mb-1 text-warning">No pudieron cargar por crear cuenta fuera de término</h6>
                  <p class="mb-0 text-muted">Contribuyentes que crearon su cuenta después del cierre de algún período y no pudieron cargar facturas en períodos anteriores.</p>
                </div>
                <div class="ml-auto">
                  <span class="badge badge-warning badge-lg">{{ analisisEspecificos.noPudieronCargarFueraTermino }}</span>
                </div>
              </div>
            </div>

            <div class="analisis-item mb-3 p-3 border rounded">
              <div class="d-flex align-items-center">
                <i class="bi bi-pause-circle text-danger mr-3" style="font-size: 1.5rem;"></i>
                <div>
                  <h6 class="mb-1 text-danger">Cargaron en período 1 pero no en período 2</h6>
                  <p class="mb-0 text-muted">Contribuyentes que cargaron y fueron aprobados en el primer período, pero no subieron nada en el segundo período.</p>
                </div>
                <div class="ml-auto">
                  <span class="badge badge-danger badge-lg">{{ analisisEspecificos.cargaronPeriodo1NoPeriodo2 }}</span>
                </div>
              </div>
            </div>

            <div class="analisis-item mb-3 p-3 border rounded">
              <div class="d-flex align-items-center">
                <i class="bi bi-arrow-right-circle text-success mr-3" style="font-size: 1.5rem;"></i>
                <div>
                  <h6 class="mb-1 text-success">Llegaron tarde al período 1 pero subieron después</h6>
                  <p class="mb-0 text-muted">Contribuyentes que crearon su cuenta después del cierre del primer período, pero igual subieron facturas en períodos posteriores.</p>
                </div>
                <div class="ml-auto">
                  <span class="badge badge-success badge-lg">{{ analisisEspecificos.llegaronTardePeriodo1PeroSubieronDespues }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-muted py-4">
            <i class="bi bi-graph-down display-4"></i>
            <p class="mt-2">No hay datos de análisis disponibles</p>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <!-- Cantidad de Llegaron Tarde por Período -->
    <b-row>
      <b-col md="12" class="mb-4">
        <b-card class="h-100">
          <template #header>
            <h6 class="mb-0">
              <i class="bi bi-clock-history mr-2"></i>
              Contribuyentes que Llegaron Tarde por Período
            </h6>
          </template>

          <div v-if="analisisEspecificos && analisisEspecificos.llegaronTardePorPeriodo" class="llegaron-tarde-summary">
            <div class="row">
              <div v-for="(cantidad, nombrePeriodo) in analisisEspecificos.llegaronTardePorPeriodo" :key="nombrePeriodo" class="col-md-4 mb-3">
                <div class="periodo-tarde text-center p-3">
                  <div class="periodo-count mb-2">
                    <strong class="text-info" style="font-size: 2rem;">{{ cantidad }}</strong>
                  </div>
                  <h6 class="mb-1 text-info">{{ nombrePeriodo }}</h6>
                  <small class="text-muted">contribuyentes llegaron tarde</small>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-muted py-4">
            <i class="bi bi-graph-down display-4"></i>
            <p class="mt-2">No hay datos de análisis disponibles</p>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <!-- Cantidad de Crearon Cuenta en el Rango del Período pero No Subieron -->
    <b-row>
      <b-col md="12" class="mb-4">
        <b-card class="h-100">
          <template #header>
            <h6 class="mb-0">
              <i class="bi bi-clock mr-2"></i>
              Contribuyentes que Crearon Cuenta en el Rango del Período pero No Subieron
            </h6>
          </template>

          <div v-if="analisisEspecificos && analisisEspecificos.llegaronATiempoPeroNoSubieron" class="llegaron-tiempo-summary">
            <div class="row">
              <div v-for="(cantidad, nombrePeriodo) in analisisEspecificos.llegaronATiempoPeroNoSubieron" :key="nombrePeriodo" class="col-md-4 mb-3">
                <div class="periodo-tiempo text-center p-3">
                  <div class="periodo-count mb-2">
                    <strong class="text-secondary" style="font-size: 2rem;">{{ cantidad }}</strong>
                  </div>
                  <h6 class="mb-1 text-secondary">{{ nombrePeriodo }}</h6>
                  <small class="text-muted">
                    <span v-if="nombrePeriodo.includes('Mayo')">crearon cuenta en mayo</span>
                    <span v-else-if="nombrePeriodo.includes('Agosto')">crearon cuenta entre junio-agosto</span>
                    <span v-else-if="nombrePeriodo.includes('Octubre')">crearon cuenta entre septiembre-octubre</span>
                    <span v-else>crearon cuenta en el período</span>
                    <br>pero no subieron
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-muted py-4">
            <i class="bi bi-graph-down display-4"></i>
            <p class="mt-2">No hay datos de análisis disponibles</p>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'GraficosAbiertoAnual',
  props: {
    estadisticasAbiertoAnual: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      chartBarrasConsolidado: null
    }
  },
  computed: {
    periodos() {
      if (!this.estadisticasAbiertoAnual.porPeriodo) return []
      return this.estadisticasAbiertoAnual.porPeriodo
    },
    rechazosPorMotivo() {
      if (!this.estadisticasAbiertoAnual.rechazosPorMotivoYPeriodo) return []

      const rechazos = this.estadisticasAbiertoAnual.rechazosPorMotivoYPeriodo
      return Object.entries(rechazos)
        .filter(([motivo, periodos]) => {
          // Solo mostrar motivos que tengan al menos un rechazo
          return periodos['Período 1'] > 0 || periodos['Período 2'] > 0 || periodos['Período 3'] > 0
        })
        .map(([motivo, periodos]) => ({
          motivo,
          periodo1: periodos['Período 1'],
          periodo2: periodos['Período 2'],
          periodo3: periodos['Período 3'],
          total: periodos['Período 1'] + periodos['Período 2'] + periodos['Período 3']
        }))
        .sort((a, b) => b.total - a.total)
    },
    analisisEspecificos() {
      return this.estadisticasAbiertoAnual.analisisEspecificos || null
    },
    datosBarras() {
      if (!this.periodos.length) return { labels: [], datasets: [] }

      const labels = this.periodos.map(periodo => {
        // Extraer solo el número del período para mostrar en el eje X
        const match = periodo.periodo.match(/Período (\d+)/)
        return match ? `Período ${match[1]}` : periodo.periodo
      })

      const conFacturas = this.periodos.map(periodo => periodo.conFacturas)
      const sinFacturas = this.periodos.map(periodo => periodo.sinFacturas)

      return {
        labels,
        datasets: [
          {
            label: 'Con Facturas',
            data: conFacturas,
            backgroundColor: '#28a745',
            borderColor: '#1e7e34',
            borderWidth: 2
          },
          {
            label: 'Sin Facturas',
            data: sinFacturas,
            backgroundColor: '#dc3545',
            borderColor: '#bd2130',
            borderWidth: 2
          }
        ]
      }
    }
  },
  watch: {
    periodos: {
      handler() {
        this.$nextTick(() => {
          this.createChartBarras()
        })
      },
      immediate: true
    }
  },
  methods: {
    createChartBarras() {
      if (this.chartBarrasConsolidado) {
        this.chartBarrasConsolidado.destroy()
      }

      if (this.periodos.length === 0) return

      const ctx = this.$refs.chartBarrasConsolidado
      if (!ctx) return

      this.chartBarrasConsolidado = new this.$chart(ctx, {
        type: 'bar',
        data: this.datosBarras,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: false,
              title: {
                display: true,
                text: 'Períodos',
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
              stacked: false,
              beginAtZero: true,
              title: {
                display: true,
                text: 'Número de Contribuyentes',
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
              position: 'top',
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
              mode: 'index',
              intersect: false,
              callbacks: {
                title: function(context) {
                  return `Período ${context[0].label}`
                },
                label: function(context) {
                  const label = context.dataset.label || ''
                  const value = context.parsed.y
                  return `${label}: ${value} contribuyentes`
                },
                afterBody: function(context) {
                  const conFacturas = context.find(c => c.dataset.label === 'Con Facturas')?.parsed.y || 0
                  const sinFacturas = context.find(c => c.dataset.label === 'Sin Facturas')?.parsed.y || 0
                  const total = conFacturas + sinFacturas
                  if (total > 0) {
                    const porcentajeCon = ((conFacturas / total) * 100).toFixed(1)
                    const porcentajeSin = ((sinFacturas / total) * 100).toFixed(1)
                    return [
                      '',
                      `Total: ${total} contribuyentes`,
                      `Con facturas: ${porcentajeCon}%`,
                      `Sin facturas: ${porcentajeSin}%`
                    ]
                  }
                  return ''
                }
              }
            }
          },
          interaction: {
            mode: 'index',
            intersect: false
          }
        }
      })
    }
  },
  beforeDestroy() {
    if (this.chartBarrasConsolidado) {
      this.chartBarrasConsolidado.destroy()
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

.chart-container-small {
  position: relative;
  height: 250px;
  width: 100%;
}

.periodo-summary {
  max-height: 400px;
  overflow-y: auto;
}

.periodo-item {
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
}

.progress {
  border-radius: 4px;
}

.badge {
  font-size: 0.75rem;
}

.section-title {
  color: #495057;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

.section-title i {
  color: #17a2b8;
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
  color: #17a2b8;
}

.rechazos-summary {
  max-height: 500px;
  overflow-y: auto;
}

.motivo-item {
  padding: 1rem;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  background: #fff8e1;
}

.periodo-count {
  font-size: 1.5rem;
  font-weight: bold;
}

.analisis-summary {
  max-height: 600px;
  overflow-y: auto;
}

.analisis-item {
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.analisis-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.badge-lg {
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
}

.badge-primary {
  background-color: #007bff;
}

.badge-warning {
  background-color: #ffc107;
  color: #212529;
}

.badge-danger {
  background-color: #dc3545;
}

.badge-success {
  background-color: #28a745;
}

.llegaron-tarde-summary {
  max-height: 400px;
  overflow-y: auto;
}

.periodo-tarde {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.periodo-tarde:hover {
  background: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.llegaron-tiempo-summary {
  max-height: 400px;
  overflow-y: auto;
}

.periodo-tiempo {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.periodo-tiempo:hover {
  background: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
