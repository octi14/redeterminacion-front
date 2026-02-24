<template>
  <div class="grafico-finalizaciones-por-anio">
    <b-card class="shadow-sm h-100">
      <template #header>
        <div class="d-flex align-items-center justify-content-between flex-wrap">
          <div class="d-flex align-items-center">
            <i :class="[icono || 'bi bi-check-circle-fill', 'mr-2', 'text-primary']"></i>
            <div class="title-group">
              <strong>{{ titulo }}</strong>
              <small class="text-muted d-block">Año {{ anio }} · Basado en fecha de finalización</small>
            </div>
          </div>
          <b-badge :variant="badgeVariant" class="mt-2 mt-md-0">
            {{ totalFinalizaciones }} finalizaciones
          </b-badge>
        </div>
      </template>

      <div v-if="tramitesFinalizados.length === 0" class="text-center py-4">
        <i class="bi bi-inbox text-muted" style="font-size: 2.5rem;"></i>
        <p class="mt-3 mb-1 text-muted">No se registraron finalizaciones en {{ anio }}</p>
        <small class="text-muted">
          {{ mensajeSinDatos }}
        </small>
      </div>

      <div v-else>
        <div class="chart-container">
          <canvas ref="chartCanvas"></canvas>
        </div>

        <div class="summary mt-4 pt-3 border-top">
          <b-row>
            <b-col cols="12" md="6" class="mb-3 mb-md-0">
              <div class="metric-card border rounded p-3">
                <div class="metric-label text-muted">Mes con más finalizaciones</div>
                <div class="metric-value text-success">{{ mesMayorActividad }}</div>
              </div>
            </b-col>
            <b-col cols="12" md="6">
              <div class="metric-card border rounded p-3">
                <div class="metric-label text-muted">Última finalización registrada</div>
                <div class="metric-value text-info">{{ ultimaFinalizacion }}</div>
              </div>
            </b-col>
          </b-row>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
import Chart from '~/plugins/chart.js'

const FINALIZACION_PATTERNS = [
  /Se finaliza(?: la solicitud)?(?: el)?(?: trámite)?(?: [^0-9]*)?(\d{1,2}\/\d{1,2}\/\d{2,4})(?:\s+(\d{1,2}:\d{2}(?::\d{2})?))?/gi,
  /Finalización[^0-9]*(\d{1,2}\/\d{1,2}\/\d{2,4})/gi,
  /Renovación finalizada[^0-9]*(\d{1,2}\/\d{1,2}\/\d{2,4})/gi,
  /Reempadronamiento finalizado[^0-9]*(\d{1,2}\/\d{1,2}\/\d{2,4})/gi
]

export default {
  name: 'GraficoFinalizacionesPorAnio',
  props: {
    habilitaciones: {
      type: Array,
      default: () => []
    },
    anio: {
      type: Number,
      required: true
    },
    titulo: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: '#28a745'
    },
    backgroundColor: {
      type: String,
      default: 'rgba(40, 167, 69, 0.25)'
    },
    soloRenovaciones: {
      type: Boolean,
      default: false
    },
    incluirRenovaciones: {
      type: Boolean,
      default: true
    },
    icono: {
      type: String,
      default: 'bi bi-check-circle-fill'
    },
    badgeVariant: {
      type: String,
      default: 'primary'
    }
  },
  data() {
    return {
      chart: null,
      meses: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ]
    }
  },
  computed: {
    tramitesFinalizados() {
      if (!Array.isArray(this.habilitaciones) || this.habilitaciones.length === 0) {
        return []
      }

      const inicioAnio = new Date(this.anio, 0, 1)
      const finAnio = new Date(this.anio, 11, 31, 23, 59, 59, 999)

      return this.habilitaciones.filter(tramite => {
        if (!tramite || tramite.status !== 'Finalizada') return false

        const esRenovacion = this.esRenovacion(tramite)
        if (this.soloRenovaciones && !esRenovacion) return false
        if (!this.soloRenovaciones && !this.incluirRenovaciones && esRenovacion) return false

        const fechaFinalizacion = this.obtenerFechaFinalizacion(tramite)
        if (!fechaFinalizacion) return false

        return fechaFinalizacion >= inicioAnio && fechaFinalizacion <= finAnio
      })
    },

    datosPorMes() {
      const datos = Array(12).fill(0)

      this.tramitesFinalizados.forEach(tramite => {
        const fechaFinalizacion = this.obtenerFechaFinalizacion(tramite)
        if (!fechaFinalizacion) return

        const mes = fechaFinalizacion.getMonth()
        if (mes >= 0 && mes < 12) {
          datos[mes] += 1
        }
      })

      return datos
    },

    totalFinalizaciones() {
      return this.tramitesFinalizados.length
    },

    mesMayorActividad() {
      if (!this.totalFinalizaciones) return '-'

      const maxValor = Math.max(...this.datosPorMes)
      if (maxValor === 0) return '-'

      const indice = this.datosPorMes.indexOf(maxValor)
      return `${this.meses[indice]} (${maxValor})`
    },

    ultimaFinalizacion() {
      if (!this.tramitesFinalizados.length) return '-'

      const fechas = this.tramitesFinalizados
        .map(tramite => this.obtenerFechaFinalizacion(tramite))
        .filter(Boolean)
        .sort((a, b) => b.getTime() - a.getTime())

      if (!fechas.length) return '-'

      return fechas[0].toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'long'
      })
    },

    mensajeSinDatos() {
      if (this.soloRenovaciones) {
        return `No se registraron renovaciones finalizadas durante ${this.anio}.`
      }

      if (!this.incluirRenovaciones) {
        return `No se registraron habilitaciones nuevas finalizadas durante ${this.anio}.`
      }

      return `No se registraron solicitudes finalizadas durante ${this.anio}.`
    }
  },
  watch: {
    habilitaciones: {
      handler() {
        this.$nextTick(() => {
          this.actualizarGrafico()
        })
      },
      deep: true
    },
    anio() {
      this.actualizarGrafico()
    },
    soloRenovaciones() {
      this.actualizarGrafico()
    },
    incluirRenovaciones() {
      this.actualizarGrafico()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.crearGrafico()
    })
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy()
      this.chart = null
    }
  },
  methods: {
    normalizarAnio(anio) {
      if (anio >= 1000) return anio
      if (anio >= 50) return 1900 + anio
      return 2000 + anio
    },
    construirFechaDesdeStrings(fechaStr, horaStr) {
      if (!fechaStr) return null

      const partesFecha = fechaStr.split('/').map(parte => parte.trim())
      if (partesFecha.length !== 3) return null

      const [diaStr, mesStr, anioStr] = partesFecha
      const dia = parseInt(diaStr, 10)
      const mes = parseInt(mesStr, 10)
      let anio = parseInt(anioStr, 10)

      if (Number.isNaN(dia) || Number.isNaN(mes) || Number.isNaN(anio)) return null

      anio = this.normalizarAnio(anio)

      let horas = 0
      let minutos = 0
      let segundos = 0

      if (horaStr) {
        const partesHora = horaStr.split(':').map(parte => parseInt(parte, 10))
        if (partesHora.length >= 1 && !Number.isNaN(partesHora[0])) horas = partesHora[0]
        if (partesHora.length >= 2 && !Number.isNaN(partesHora[1])) minutos = partesHora[1]
        if (partesHora.length >= 3 && !Number.isNaN(partesHora[2])) segundos = partesHora[2]
      }

      const fecha = new Date(anio, mes - 1, dia, horas, minutos, segundos)
      return Number.isNaN(fecha.getTime()) ? null : fecha
    },
    extraerFechaDesdeObservaciones(tramite) {
      const observaciones = tramite?.observaciones
      if (!observaciones || typeof observaciones !== 'string') return null

      let fechaEncontrada = null

      for (const pattern of FINALIZACION_PATTERNS) {
        const coincidencias = [...observaciones.matchAll(pattern)]
        if (coincidencias.length > 0) {
          const ultimaCoincidencia = coincidencias[coincidencias.length - 1]
          const [, fechaStr, horaStr] = ultimaCoincidencia
          const fecha = this.construirFechaDesdeStrings(fechaStr, horaStr)
          if (fecha) {
            fechaEncontrada = fecha
          }
        }
      }

      return fechaEncontrada
    },
    esRenovacion(tramite) {
      const tipo = (tramite?.tipoSolicitud || '').toString().toLowerCase()
      return tipo.includes('renovación') || tipo.includes('renovacion')
    },

    obtenerFechaFinalizacion(tramite) {
      const posiblesFechas = [
        tramite?.finalizadaAtISO,
        tramite?.finalizadaAt,
        this.extraerFechaDesdeObservaciones(tramite),
        tramite?.updatedAtISO,
        tramite?.updatedAt,
        tramite?.fechaFinalizacion,
        tramite?.fechaEstado,
        tramite?.createdAtISO // último recurso si no hay nada más
      ]

      for (const fecha of posiblesFechas) {
        const fechaParseada = this.parsearFecha(fecha)
        if (fechaParseada) {
          return fechaParseada
        }
      }

      return null
    },

    parsearFecha(fecha) {
      if (!fecha) return null

      if (fecha instanceof Date) {
        return isNaN(fecha.getTime()) ? null : fecha
      }

      if (typeof fecha === 'number') {
        const fechaNumero = new Date(fecha)
        return isNaN(fechaNumero.getTime()) ? null : fechaNumero
      }

      if (typeof fecha === 'string') {
        if (!fecha.trim()) return null

        // Formato DD/MM/AAAA
        if (fecha.includes('/')) {
          const partes = fecha.split('/')
          if (partes.length === 3) {
            const [dia, mes, anio] = partes.map(part => parseInt(part, 10))
            if (!isNaN(dia) && !isNaN(mes) && !isNaN(anio)) {
              const fechaConstruida = new Date(this.normalizarAnio(anio), mes - 1, dia)
              if (!isNaN(fechaConstruida.getTime())) {
                return fechaConstruida
              }
            }
          }
        }

        const fechaISO = new Date(fecha)
        if (!isNaN(fechaISO.getTime())) {
          return fechaISO
        }
      }

      return null
    },

    crearGrafico() {
      if (!this.$refs.chartCanvas) return

      if (this.chart) {
        this.chart.destroy()
        this.chart = null
      }

      const ctx = this.$refs.chartCanvas.getContext('2d')
      if (!ctx) return

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.meses,
          datasets: [
            {
              label: `Finalizaciones ${this.anio}`,
              data: this.datosPorMes,
              backgroundColor: this.backgroundColor,
              borderColor: this.color,
              borderWidth: 2,
              maxBarThickness: 32
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 32,
              right: 16,
              left: 8,
              bottom: 16
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: context => `${context.parsed.y} finalizaciones`
              }
            },
            datalabels: {
              color: '#212529',
              anchor: 'end',
              align: 'end',
              offset: -8,
              formatter: value => (value > 0 ? value : ''),
              font: {
                weight: 'bold'
              },
              clamp: true,
              clip: false
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      })
    },

    actualizarGrafico() {
      if (!this.$refs.chartCanvas) return

      if (!this.chart) {
        this.crearGrafico()
        return
      }

      this.chart.data.datasets[0].data = this.datosPorMes
      this.chart.update()
    }
  }
}
</script>

<style scoped>
.grafico-finalizaciones-por-anio {
  height: 100%;
}

.chart-container {
  position: relative;
  height: 320px;
}

.metric-card {
  background: #f8f9fa;
}

.metric-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 1.2rem;
  font-weight: 700;
}

@media (max-width: 768px) {
  .chart-container {
    height: 260px;
  }
}
</style>

