<template>
  <div class="grafico-tramites-ene-jul-2026">
    <b-card class="mb-4 shadow-sm">
      <template #header>
        <div class="d-flex align-items-center justify-content-between flex-wrap">
          <div>
            <i class="bi bi-clipboard-data text-primary mr-2"></i>
            <strong>Trámites comerciales: 1/1/2026 al 31/7/2026</strong>
          </div>
          <b-badge variant="info" class="ml-2 mt-2 mt-md-0">
            Total: {{ total }}
          </b-badge>
        </div>
      </template>

      <p class="text-muted mb-4">
        Informe de uso único para Comercio. Incluye todos los trámites ingresados en el período (por fecha de creación).
      </p>

      <b-row class="mb-4">
        <b-col md="5" class="mb-3 mb-md-0">
          <b-card class="h-100">
            <template #header>
              <div class="d-flex justify-content-between align-items-center">
                <span>Por estado</span>
                <b-button variant="outline-primary" size="sm" @click="exportar('chartEstado', 'estados-ene-jul-2026')">
                  Exportar
                </b-button>
              </div>
            </template>
            <div v-if="total === 0" class="text-center text-muted py-4">Sin trámites en el período</div>
            <div v-else style="position: relative; height: 420px;">
              <canvas ref="chartEstado"></canvas>
            </div>
          </b-card>
        </b-col>
        <b-col md="7">
          <b-card class="h-100">
            <template #header>
              <div class="d-flex justify-content-between align-items-center">
                <span>Trámites por mes</span>
                <b-button variant="outline-primary" size="sm" @click="exportar('chartMes', 'por-mes-ene-jul-2026')">
                  Exportar
                </b-button>
              </div>
            </template>
            <div v-if="total === 0" class="text-center text-muted py-4">Sin trámites en el período</div>
            <div v-else style="position: relative; height: 420px;">
              <canvas ref="chartMes"></canvas>
            </div>
          </b-card>
        </b-col>
      </b-row>

      <b-row class="mb-4">
        <b-col md="5" class="mb-3 mb-md-0">
          <b-card class="h-100">
            <template #header>
              <div class="d-flex justify-content-between align-items-center">
                <span>Por tipo de trámite (período completo)</span>
                <b-button variant="outline-primary" size="sm" @click="exportar('chartTipo', 'por-tipo-ene-jul-2026')">
                  Exportar
                </b-button>
              </div>
            </template>
            <div v-if="total === 0" class="text-center text-muted py-4">Sin trámites en el período</div>
            <div v-else style="position: relative; height: 300px;">
              <canvas ref="chartTipo"></canvas>
            </div>
          </b-card>
        </b-col>
        <b-col md="7">
          <b-card class="h-100">
            <template #header>
              <div class="d-flex justify-content-between align-items-center">
                <span>Tipo de trámite por mes</span>
                <b-button variant="outline-primary" size="sm" @click="exportar('chartTipoMes', 'tipo-por-mes-ene-jul-2026')">
                  Exportar
                </b-button>
              </div>
            </template>
            <div v-if="total === 0" class="text-center text-muted py-4">Sin trámites en el período</div>
            <template v-else>
              <div style="position: relative; height: 280px;">
                <canvas ref="chartTipoMes"></canvas>
              </div>
              <div class="table-responsive mt-3">
                <table class="table table-sm table-bordered mb-0 tabla-tipo-mes">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th v-for="mes in mesesCortos" :key="mes" class="text-center">{{ mes }}</th>
                      <th class="text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="tipo in tipos" :key="tipo">
                      <td>{{ tipo }}</td>
                      <td v-for="(n, i) in porTipoMes[tipo]" :key="i" class="text-center">{{ n }}</td>
                      <td class="text-center font-weight-bold">{{ porTipoMes[tipo].reduce((a, b) => a + b, 0) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </b-card>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import Chart from '~/utils/chart-setup.js'

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio']
const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul']
const INICIO = new Date(2026, 0, 1)
const FIN = new Date(2026, 6, 31, 23, 59, 59, 999)
const COLORES = ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#6f42c1', '#dc3545', '#fd7e14', '#20c997', '#6c757d', '#e83e8c']

export default {
  name: 'GraficoTramitesComercialesEneJul2026',
  props: {
    habilitaciones: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      charts: {}
    }
  },
  computed: {
    mesesCortos() {
      return MESES_CORTOS
    },
    tramitesPeriodo() {
      if (!this.habilitaciones?.length) return []
      return this.habilitaciones.filter((t) => {
        const fecha = this.convertirFecha(t.createdAt)
        if (!fecha) return false
        return fecha >= INICIO && fecha <= FIN
      })
    },
    total() {
      return this.tramitesPeriodo.length
    },
    porEstado() {
      const map = {}
      this.tramitesPeriodo.forEach((t) => {
        const estado = t.status || 'Sin estado'
        map[estado] = (map[estado] || 0) + 1
      })
      return Object.entries(map).sort((a, b) => b[1] - a[1])
    },
    porMes() {
      const counts = [0, 0, 0, 0, 0, 0, 0]
      this.tramitesPeriodo.forEach((t) => {
        const fecha = this.convertirFecha(t.createdAt)
        if (!fecha) return
        const mes = fecha.getMonth()
        if (mes >= 0 && mes <= 6) counts[mes]++
      })
      return counts
    },
    tipos() {
      const set = new Set()
      this.tramitesPeriodo.forEach((t) => {
        set.add(this.etiquetaTipo(t.tipoSolicitud))
      })
      return [...set].sort()
    },
    porTipo() {
      const map = {}
      this.tipos.forEach((tipo) => { map[tipo] = 0 })
      this.tramitesPeriodo.forEach((t) => {
        const tipo = this.etiquetaTipo(t.tipoSolicitud)
        map[tipo] = (map[tipo] || 0) + 1
      })
      return this.tipos.map((tipo) => map[tipo] || 0)
    },
    porTipoMes() {
      const matriz = {}
      this.tipos.forEach((tipo) => { matriz[tipo] = [0, 0, 0, 0, 0, 0, 0] })
      this.tramitesPeriodo.forEach((t) => {
        const fecha = this.convertirFecha(t.createdAt)
        if (!fecha) return
        const mes = fecha.getMonth()
        if (mes < 0 || mes > 6) return
        const tipo = this.etiquetaTipo(t.tipoSolicitud)
        if (!matriz[tipo]) matriz[tipo] = [0, 0, 0, 0, 0, 0, 0]
        matriz[tipo][mes]++
      })
      return matriz
    }
  },
  watch: {
    tramitesPeriodo: {
      handler() {
        this.$nextTick(() => this.renderCharts())
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => this.renderCharts())
  },
  beforeUnmount() {
    this.destroyCharts()
  },
  methods: {
    etiquetaTipo(tipo) {
      return (tipo && String(tipo).trim()) || 'Sin tipo'
    },
    convertirFecha(createdAt) {
      if (!createdAt) return null
      let fecha
      if (typeof createdAt === 'string') {
        if (createdAt.includes('/')) {
          const partes = createdAt.split('/')
          if (partes.length === 3) {
            fecha = new Date(Number(partes[2]), Number(partes[1]) - 1, Number(partes[0]))
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
      if (!(fecha instanceof Date) || isNaN(fecha.getTime())) return null
      return fecha
    },
    destroyCharts() {
      Object.values(this.charts).forEach((c) => c && c.destroy())
      this.charts = {}
    },
    renderCharts() {
      this.destroyCharts()
      if (this.total === 0) return

      if (this.$refs.chartEstado) {
        this.charts.estado = new Chart(this.$refs.chartEstado, {
          type: 'doughnut',
          data: {
            labels: this.porEstado.map(([k]) => k),
            datasets: [{
              data: this.porEstado.map(([, v]) => v),
              backgroundColor: COLORES
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 14,
                  usePointStyle: true,
                  generateLabels: (chart) => {
                    const data = chart.data
                    if (!data.labels.length || !data.datasets.length) return []
                    const dataset = data.datasets[0]
                    const total = dataset.data.reduce((a, b) => a + b, 0)
                    return data.labels.map((label, index) => {
                      const value = dataset.data[index]
                      const pct = total ? ((value / total) * 100).toFixed(1) : '0.0'
                      return {
                        text: `${label}: ${value} (${pct}%)`,
                        fillStyle: dataset.backgroundColor[index],
                        strokeStyle: '#fff',
                        lineWidth: 1,
                        pointStyle: 'circle',
                        hidden: false,
                        index
                      }
                    })
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: (ctx) => {
                    const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
                    const pct = total ? ((ctx.parsed / total) * 100).toFixed(1) : '0.0'
                    return `${ctx.label}: ${ctx.parsed} trámites (${pct}%)`
                  }
                }
              },
              datalabels: { display: false }
            }
          }
        })
      }

      if (this.$refs.chartMes) {
        this.charts.mes = new Chart(this.$refs.chartMes, {
          type: 'bar',
          data: {
            labels: MESES,
            datasets: [{
              label: 'Trámites',
              data: this.porMes,
              backgroundColor: 'rgba(0, 123, 255, 0.55)',
              borderColor: '#007bff',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
          }
        })
      }

      if (this.$refs.chartTipo) {
        this.charts.tipo = new Chart(this.$refs.chartTipo, {
          type: 'doughnut',
          data: {
            labels: this.tipos,
            datasets: [{
              data: this.porTipo,
              backgroundColor: COLORES
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
          }
        })
      }

      if (this.$refs.chartTipoMes) {
        this.charts.tipoMes = new Chart(this.$refs.chartTipoMes, {
          type: 'bar',
          data: {
            labels: MESES,
            datasets: this.tipos.map((tipo, i) => ({
              label: tipo,
              data: this.porTipoMes[tipo],
              backgroundColor: COLORES[i % COLORES.length],
              maxBarThickness: 28
            }))
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 16,
                  boxWidth: 14,
                  generateLabels: (chart) => chart.data.datasets.map((ds, index) => ({
                    text: `${ds.label} (${ds.data.reduce((a, b) => a + b, 0)})`,
                    fillStyle: ds.backgroundColor,
                    strokeStyle: ds.backgroundColor,
                    hidden: !chart.isDatasetVisible(index),
                    datasetIndex: index
                  }))
                }
              },
              tooltip: {
                callbacks: {
                  title: (items) => items[0]?.label || '',
                  label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`
                }
              },
              datalabels: { display: false }
            },
            scales: {
              x: { stacked: false },
              y: { stacked: false, beginAtZero: true, ticks: { precision: 0 } }
            }
          }
        })
      }
    },
    exportar(refName, nombre) {
      const canvas = this.$refs[refName]
      if (!canvas) return
      const link = document.createElement('a')
      link.download = `${nombre}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
  }
}
</script>

<style scoped>
.tabla-tipo-mes {
  font-size: 0.85rem;
}
.tabla-tipo-mes th,
.tabla-tipo-mes td {
  white-space: nowrap;
}
</style>
