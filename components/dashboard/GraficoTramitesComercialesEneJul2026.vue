<template>
  <div class="informe-2026">
    <section class="informe-bloque">
      <div class="bloque-head">
        <div>
          <h2>1. Cantidad y porcentaje por tipo de trámite</h2>
          <p class="subtitulo">Enero a septiembre 2026</p>
        </div>
        <b-button v-if="total2026" variant="outline-primary" size="sm" @click="exportar('tipo', 'tipo-ene-sep-2026', 'Cantidad y porcentaje por tipo de trámite', 'Enero a septiembre 2026')">
          Exportar PNG
        </b-button>
      </div>
      <div v-if="!total2026" class="vacio">Sin trámites entre enero y septiembre de 2026</div>
      <div v-else class="pie-layout">
        <div class="pie-col">
          <div class="pie-canvas">
            <canvas ref="chartTipo"></canvas>
          </div>
        </div>
        <ul class="leyenda">
          <li v-for="fila in filasTipo2026" :key="fila.key">
            <span class="swatch" :style="{ background: fila.color }"></span>
            <span>{{ fila.pie }} ({{ fila.pct }}) - {{ fila.total }} trámites</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="informe-bloque">
      <div class="bloque-head">
        <div>
          <h2>2. Comparación de solicitudes recibidas por mes</h2>
          <p class="subtitulo">Enero a septiembre 2026</p>
        </div>
        <b-button v-if="total2026" variant="outline-primary" size="sm" @click="exportar('mes2026', 'por-mes-ene-sep-2026', 'Comparación de solicitudes comerciales recibidas por mes', 'Enero a septiembre 2026')">
          Exportar PNG
        </b-button>
      </div>
      <div v-if="!total2026" class="vacio">Sin trámites entre enero y septiembre de 2026</div>
      <template v-else>
        <div class="bar-canvas bar-canvas-alta">
          <canvas ref="chartMes2026"></canvas>
        </div>
        <div class="table-responsive mt-3">
          <table class="tabla-comparacion">
            <thead>
              <tr>
                <th>Referencia</th>
                <th>Tipo de trámite</th>
                <th v-for="mes in meses9" :key="mes">{{ mes }}</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fila in filasTipo2026Tabla" :key="fila.key">
                <td><span class="swatch" :style="{ background: fila.color }"></span></td>
                <td class="text-left">{{ fila.tabla }}</td>
                <td v-for="(n, i) in fila.porMes" :key="i">{{ n }}</td>
                <td class="font-weight-bold">{{ fila.total }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </section>

    <section class="informe-bloque">
      <div class="bloque-head">
        <div>
          <h2>3. Comparación de solicitudes recibidas por mes</h2>
          <p class="subtitulo">Enero a diciembre 2025</p>
        </div>
        <b-button v-if="total2025" variant="outline-primary" size="sm" @click="exportar('mes2025', 'por-mes-2025', 'Comparación de solicitudes comerciales recibidas por mes', 'Enero a diciembre 2025')">
          Exportar PNG
        </b-button>
      </div>
      <div v-if="!total2025" class="vacio">Sin trámites en 2025</div>
      <template v-else>
        <div class="bar-canvas bar-canvas-alta">
          <canvas ref="chartMes2025"></canvas>
        </div>
        <div class="table-responsive mt-3">
          <table class="tabla-comparacion">
            <thead>
              <tr>
                <th>Referencia</th>
                <th>Tipo de trámite</th>
                <th v-for="mes in meses12" :key="mes">{{ mes }}</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fila in filasTipo2025Tabla" :key="fila.key">
                <td><span class="swatch" :style="{ background: fila.color }"></span></td>
                <td class="text-left">{{ fila.tabla }}</td>
                <td v-for="(n, i) in fila.porMes" :key="i">{{ n }}</td>
                <td class="font-weight-bold">{{ fila.total }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </section>

    <section class="informe-bloque">
      <div class="bloque-head">
        <div>
          <h2>4. Comparación por tipo entre años</h2>
          <p class="subtitulo">Mes a mes, 2023 a 2026</p>
        </div>
        <b-button v-if="aniosDisponibles.length" variant="outline-primary" size="sm" @click="exportar('anios', `comparacion-anios-${tipoSeleccionado}`, `Comparación mensual de ${metaTipo(tipoSeleccionado).pie}`, 'Años 2023 a 2026')">
          Exportar PNG
        </b-button>
      </div>
      <div class="tipo-switch mb-3">
        <b-button
          v-for="tipo in tiposSelector"
          :key="tipo.key"
          size="sm"
          :variant="tipoSeleccionado === tipo.key ? 'primary' : 'outline-secondary'"
          @click="tipoSeleccionado = tipo.key"
        >
          {{ tipo.tabla }}
        </b-button>
      </div>
      <div v-if="!aniosDisponibles.length" class="vacio">No hay datos para comparar entre 2023 y 2026</div>
      <div v-else class="bar-canvas bar-canvas-alta">
        <canvas ref="chartAnios"></canvas>
      </div>
    </section>

    <section class="informe-bloque">
      <div class="bloque-head">
        <div>
          <h2>5. Trámites recibidos por día</h2>
          <p class="subtitulo">Diciembre 2025 y enero 2026</p>
        </div>
        <div class="acciones">
          <b-button v-if="totalDiario" variant="outline-primary" size="sm" @click="exportar('diario', 'diario-dic2025-ene2026', 'Trámites recibidos por día', 'Diciembre 2025 y enero 2026')">
            Exportar PNG
          </b-button>
          <b-button variant="outline-success" size="sm" @click="exportarExcel('2025-12-01', '2026-01-31', 'tramites-diario-dic2025-ene2026')">
            Excel Dic 25 - Ene 26
          </b-button>
          <b-button variant="outline-success" size="sm" @click="exportarExcel('2025-01-01', '2026-12-31', 'tramites-diario-ene2025-dic2026')">
            Excel Ene 25 - Dic 26
          </b-button>
        </div>
      </div>
      <div v-if="!totalDiario" class="vacio">Sin trámites en diciembre 2025 ni enero 2026</div>
      <div v-else class="bar-canvas bar-canvas-alta">
        <canvas ref="chartDiario"></canvas>
      </div>
    </section>

    <section class="informe-bloque">
      <div class="bloque-head">
        <div>
          <h2>6. Habilitaciones aprobadas</h2>
          <p class="subtitulo">Enero a septiembre 2025 vs enero a septiembre 2026 · solo habilitaciones finalizadas</p>
        </div>
        <b-button v-if="totalAprobadas2025 || totalAprobadas2026" variant="outline-primary" size="sm" @click="exportar('aprobadas', 'habilitaciones-aprobadas-ene-sep-2025-2026', 'Habilitaciones aprobadas', 'Enero a septiembre 2025 vs 2026')">
          Exportar PNG
        </b-button>
      </div>
      <div v-if="!totalAprobadas2025 && !totalAprobadas2026" class="vacio">Sin habilitaciones aprobadas en esos períodos</div>
      <template v-else>
        <p class="subtitulo mb-3">Total 2025: {{ totalAprobadas2025 }} · Total 2026: {{ totalAprobadas2026 }}</p>
        <div class="bar-canvas bar-canvas-alta">
          <canvas ref="chartAprobadas"></canvas>
        </div>
        <div class="table-responsive mt-3">
          <table class="tabla-comparacion">
            <thead>
              <tr>
                <th>Referencia</th>
                <th>Año</th>
                <th v-for="mes in meses9" :key="mes">{{ mes }}</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="swatch" :style="{ background: coloresAnio[2025] }"></span></td>
                <td class="text-left">2025</td>
                <td v-for="(n, i) in aprobadas2025" :key="'25-' + i">{{ n }}</td>
                <td class="font-weight-bold">{{ totalAprobadas2025 }}</td>
              </tr>
              <tr>
                <td><span class="swatch" :style="{ background: coloresAnio[2026] }"></span></td>
                <td class="text-left">2026</td>
                <td v-for="(n, i) in aprobadas2026" :key="'26-' + i">{{ n }}</td>
                <td class="font-weight-bold">{{ totalAprobadas2026 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </section>

    <section class="informe-bloque">
      <div class="bloque-head">
        <div>
          <h2>7. Habilitaciones recibidas</h2>
          <p class="subtitulo">Enero a septiembre 2025 vs enero a septiembre 2026 · todas las habilitaciones</p>
        </div>
        <b-button v-if="totalHab2025 || totalHab2026" variant="outline-primary" size="sm" @click="exportar('habGeneral', 'habilitaciones-ene-sep-2025-2026', 'Habilitaciones recibidas', 'Enero a septiembre 2025 vs 2026')">
          Exportar PNG
        </b-button>
      </div>
      <div v-if="!totalHab2025 && !totalHab2026" class="vacio">Sin habilitaciones en esos períodos</div>
      <template v-else>
        <p class="subtitulo mb-3">Total 2025: {{ totalHab2025 }} · Total 2026: {{ totalHab2026 }}</p>
        <div class="bar-canvas bar-canvas-alta">
          <canvas ref="chartHabGeneral"></canvas>
        </div>
        <div class="table-responsive mt-3">
          <table class="tabla-comparacion">
            <thead>
              <tr>
                <th>Referencia</th>
                <th>Año</th>
                <th v-for="mes in meses9" :key="mes">{{ mes }}</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="swatch" :style="{ background: coloresAnio[2025] }"></span></td>
                <td class="text-left">2025</td>
                <td v-for="(n, i) in hab2025" :key="'h25-' + i">{{ n }}</td>
                <td class="font-weight-bold">{{ totalHab2025 }}</td>
              </tr>
              <tr>
                <td><span class="swatch" :style="{ background: coloresAnio[2026] }"></span></td>
                <td class="text-left">2026</td>
                <td v-for="(n, i) in hab2026" :key="'h26-' + i">{{ n }}</td>
                <td class="font-weight-bold">{{ totalHab2026 }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bloque-head mt-4">
          <div>
            <h3 class="h5 mb-0">Detalle por estado</h3>
            <p class="subtitulo">Mismas habilitaciones, según estado actual</p>
          </div>
          <b-button variant="outline-primary" size="sm" @click="exportar('habEstado', 'habilitaciones-por-estado-ene-sep-2025-2026', 'Habilitaciones por estado', 'Enero a septiembre 2025 vs 2026')">
            Exportar PNG
          </b-button>
        </div>
        <div class="bar-canvas bar-canvas-alta">
          <canvas ref="chartHabEstado"></canvas>
        </div>
        <div class="table-responsive mt-3">
          <table class="tabla-comparacion">
            <thead>
              <tr>
                <th>Estado</th>
                <th>2025</th>
                <th>2026</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fila in filasEstadoHab" :key="fila.estado">
                <td class="text-left">{{ fila.estado }}</td>
                <td>{{ fila.n2025 }}</td>
                <td>{{ fila.n2026 }}</td>
                <td class="font-weight-bold">{{ fila.n2025 + fila.n2026 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </section>
  </div>
</template>

<script>
import Chart from '~/utils/chart-setup.js'
import { loadXlsx } from '~/utils/loadXlsx'
import { saveAsFile } from '~/utils/saveAsFile'

const MESES_12 = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const MESES_9 = MESES_12.slice(0, 9)
const ANIOS = [2023, 2024, 2025, 2026]
const COLORES_ANIO = { 2023: '#5dade2', 2024: '#1a4f72', 2025: '#e67e22', 2026: '#1e6b3a' }
const ORDEN_ESTADO = ['Finalizada', 'En revisión', 'Esperando documentación', 'Esperando turno', 'Esperando inspección', 'Inspeccionado', 'Rectificación', 'Rechazada', 'Prórroga 1', 'Prórroga 2']

const META_TIPO = {
  habilitacion: { pie: 'Habilitaciones', tabla: 'Habilitación', color: '#1a4f72' },
  baja: { pie: 'Bajas', tabla: 'Baja', color: '#e67e22' },
  renovacion: { pie: 'Renovaciones', tabla: 'Renovación', color: '#1e6b3a' },
  reempadronamiento: { pie: 'Reempadronamientos', tabla: 'Reempadronamiento', color: '#5dade2' },
  cambioTitular: { pie: 'Cambios de titularidad', tabla: 'Cambio de Titular', color: '#7d3c98' },
  cambioDomicilio: { pie: 'Cambios de domicilio', tabla: 'Cambio de Domicilio', color: '#16a085' }
}
const ORDEN_PIE = ['habilitacion', 'baja', 'renovacion', 'reempadronamiento', 'cambioTitular', 'cambioDomicilio']
const ORDEN_TABLA = ['baja', 'cambioTitular', 'habilitacion', 'reempadronamiento', 'renovacion', 'cambioDomicilio']
const COLORES_EXTRA = ['#d4ac0d', '#5d6d7e', '#af601a', '#2e86ab']

const INICIO_2026 = new Date(2026, 0, 1)
const FIN_2026 = new Date(2026, 8, 30, 23, 59, 59, 999)
const INICIO_2025 = new Date(2025, 0, 1)
const FIN_2025 = new Date(2025, 11, 31, 23, 59, 59, 999)
const INICIO_2025_SEP = new Date(2025, 0, 1)
const FIN_2025_SEP = new Date(2025, 8, 30, 23, 59, 59, 999)
const INICIO_DIARIO = new Date(2025, 11, 1)
const FIN_DIARIO = new Date(2026, 0, 31, 23, 59, 59, 999)

function formatoPct(valor, total) {
  if (!total) return '0%'
  const pct = Math.round((valor / total) * 1000) / 10
  if (Math.abs(pct - Math.round(pct)) < 0.05) return `${Math.round(pct)}%`
  return `${pct.toFixed(1).replace('.', ',')}%`
}

function isoFecha(fecha) {
  const y = fecha.getFullYear()
  const m = String(fecha.getMonth() + 1).padStart(2, '0')
  const d = String(fecha.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseIso(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export default {
  name: 'GraficoTramitesComercialesEneJul2026',
  props: {
    habilitaciones: { type: Array, default: () => [] }
  },
  data() {
    return { tipoSeleccionado: 'baja' }
  },
  created() {
    this.charts = Object.create(null)
  },
  computed: {
    meses9() { return MESES_9 },
    meses12() { return MESES_12 },
    coloresAnio() { return COLORES_ANIO },
    tiposSelector() {
      return ORDEN_TABLA.map((key) => ({ key, ...META_TIPO[key] }))
    },
    tramites2026() {
      return this.filtrarRango(INICIO_2026, FIN_2026)
    },
    tramites2025() {
      return this.filtrarRango(INICIO_2025, FIN_2025)
    },
    tramitesDiario() {
      return this.filtrarRango(INICIO_DIARIO, FIN_DIARIO)
    },
    total2026() { return this.tramites2026.length },
    total2025() { return this.tramites2025.length },
    totalDiario() { return this.tramitesDiario.length },
    filasTipo2026() {
      return this.filasTipo(this.tramites2026, 9, ORDEN_PIE)
    },
    filasTipo2026Tabla() {
      return this.filasTipo(this.tramites2026, 9, ORDEN_TABLA)
    },
    filasTipo2025Tabla() {
      return this.filasTipo(this.tramites2025, 12, ORDEN_TABLA)
    },
    aniosDisponibles() {
      const set = new Set()
      this.habilitaciones.forEach((t) => {
        const fecha = this.convertirFecha(t.createdAt)
        if (!fecha) return
        const anio = fecha.getFullYear()
        if (ANIOS.includes(anio)) set.add(anio)
      })
      return ANIOS.filter((anio) => set.has(anio))
    },
    porAnioMes() {
      const map = {}
      this.aniosDisponibles.forEach((anio) => { map[anio] = Array(12).fill(0) })
      this.habilitaciones.forEach((t) => {
        const fecha = this.convertirFecha(t.createdAt)
        if (!fecha) return
        const anio = fecha.getFullYear()
        if (!map[anio]) return
        if (this.claveTipo(t.tipoSolicitud) !== this.tipoSeleccionado) return
        map[anio][fecha.getMonth()]++
      })
      return map
    },
    aprobadas2025() {
      return this.conteoAprobadas(INICIO_2025_SEP, FIN_2025_SEP)
    },
    aprobadas2026() {
      return this.conteoAprobadas(INICIO_2026, FIN_2026)
    },
    totalAprobadas2025() {
      return this.aprobadas2025.reduce((a, b) => a + b, 0)
    },
    totalAprobadas2026() {
      return this.aprobadas2026.reduce((a, b) => a + b, 0)
    },
    hab2025() {
      return this.conteoHabilitaciones(INICIO_2025_SEP, FIN_2025_SEP)
    },
    hab2026() {
      return this.conteoHabilitaciones(INICIO_2026, FIN_2026)
    },
    totalHab2025() {
      return this.hab2025.reduce((a, b) => a + b, 0)
    },
    totalHab2026() {
      return this.hab2026.reduce((a, b) => a + b, 0)
    },
    filasEstadoHab() {
      const map = {}
      const sumar = (inicio, fin, campo) => {
        this.habilitaciones.forEach((t) => {
          if (!this.esHabilitacion(t)) return
          const fecha = this.convertirFecha(t.createdAt)
          if (!fecha || fecha < inicio || fecha > fin) return
          const estado = (t.status && String(t.status).trim()) || 'Sin estado'
          if (!map[estado]) map[estado] = { estado, n2025: 0, n2026: 0 }
          map[estado][campo]++
        })
      }
      sumar(INICIO_2025_SEP, FIN_2025_SEP, 'n2025')
      sumar(INICIO_2026, FIN_2026, 'n2026')
      return Object.values(map).sort((a, b) => {
        const ia = ORDEN_ESTADO.indexOf(a.estado)
        const ib = ORDEN_ESTADO.indexOf(b.estado)
        if (ia === -1 && ib === -1) return b.n2025 + b.n2026 - (a.n2025 + a.n2026)
        if (ia === -1) return 1
        if (ib === -1) return -1
        return ia - ib
      })
    },
    puntosDiarios() {
      const map = {}
      for (let d = new Date(INICIO_DIARIO); d <= FIN_DIARIO; d.setDate(d.getDate() + 1)) {
        map[isoFecha(d)] = 0
      }
      this.tramitesDiario.forEach((t) => {
        const fecha = this.convertirFecha(t.createdAt)
        if (!fecha) return
        const k = isoFecha(fecha)
        if (map[k] !== undefined) map[k]++
      })
      return Object.entries(map).map(([iso, total]) => ({
        iso,
        label: `${Number(iso.slice(8, 10))}/${Number(iso.slice(5, 7))}`,
        total
      }))
    }
  },
  watch: {
    habilitaciones: {
      handler() { this.$nextTick(() => this.renderCharts()) },
      deep: true
    },
    tipoSeleccionado() {
      this.$nextTick(() => this.renderUno('anios'))
    }
  },
  mounted() {
    this.$nextTick(() => this.renderCharts())
  },
  beforeUnmount() {
    this.destroyCharts()
  },
  methods: {
    metaTipo(key) {
      return META_TIPO[key] || { pie: key, tabla: key, color: '#6c757d' }
    },
    claveTipo(tipo) {
      const t = (tipo || '').toString().trim().toLowerCase()
      if (t.includes('habilit')) return 'habilitacion'
      if (t.includes('baja')) return 'baja'
      if (t.includes('renov')) return 'renovacion'
      if (t.includes('reempad')) return 'reempadronamiento'
      if (t.includes('titular')) return 'cambioTitular'
      if (t.includes('domicilio')) return 'cambioDomicilio'
      return `otro:${(tipo && String(tipo).trim()) || 'Sin tipo'}`
    },
    convertirFecha(createdAt) {
      if (!createdAt) return null
      let fecha
      if (typeof createdAt === 'string' && createdAt.includes('/')) {
        const partes = createdAt.split('/')
        fecha = partes.length === 3
          ? new Date(Number(partes[2]), Number(partes[1]) - 1, Number(partes[0]))
          : new Date(createdAt)
      } else {
        fecha = new Date(createdAt)
      }
      if (!(fecha instanceof Date) || isNaN(fecha.getTime())) return null
      return fecha
    },
    esHabilitacion(t) {
      return this.claveTipo(t.tipoSolicitud) === 'habilitacion'
    },
    esHabilitacionAprobada(t) {
      return this.esHabilitacion(t) && String(t.status || '').toLowerCase().includes('finaliz')
    },
    conteoHabilitaciones(inicio, fin) {
      const counts = Array(9).fill(0)
      this.habilitaciones.forEach((t) => {
        if (!this.esHabilitacion(t)) return
        const fecha = this.convertirFecha(t.createdAt)
        if (!fecha || fecha < inicio || fecha > fin) return
        const mes = fecha.getMonth()
        if (mes >= 0 && mes <= 8) counts[mes]++
      })
      return counts
    },
    fechaAprobacion(t) {
      return this.convertirFecha(t.finalizadaAtISO || t.finalizadaAt || t.updatedAtISO || t.updatedAt)
    },
    conteoAprobadas(inicio, fin) {
      const counts = Array(9).fill(0)
      this.habilitaciones.forEach((t) => {
        if (!this.esHabilitacionAprobada(t)) return
        const fecha = this.fechaAprobacion(t)
        if (!fecha || fecha < inicio || fecha > fin) return
        const mes = fecha.getMonth()
        if (mes >= 0 && mes <= 8) counts[mes]++
      })
      return counts
    },
    filtrarRango(inicio, fin) {
      if (!this.habilitaciones?.length) return []
      return this.habilitaciones.filter((t) => {
        const fecha = this.convertirFecha(t.createdAt)
        return fecha && fecha >= inicio && fecha <= fin
      })
    },
    filasTipo(tramites, nMeses, orden) {
      const map = {}
      tramites.forEach((t) => {
        const fecha = this.convertirFecha(t.createdAt)
        if (!fecha) return
        const key = this.claveTipo(t.tipoSolicitud)
        if (!map[key]) map[key] = Array(nMeses).fill(0)
        const mes = fecha.getMonth()
        if (mes >= 0 && mes < nMeses) map[key][mes]++
      })
      const keys = [...orden]
      Object.keys(map).forEach((key) => { if (!keys.includes(key)) keys.push(key) })
      let extra = 0
      const total = tramites.length
      return keys.map((key) => {
        const porMes = map[key] || Array(nMeses).fill(0)
        const suma = porMes.reduce((a, b) => a + b, 0)
        const meta = META_TIPO[key] || {
          pie: key.replace(/^otro:/, ''),
          tabla: key.replace(/^otro:/, ''),
          color: COLORES_EXTRA[extra++ % COLORES_EXTRA.length]
        }
        return { key, ...meta, porMes, total: suma, pct: formatoPct(suma, total) }
      }).filter((fila) => fila.total > 0)
    },
    destroyCharts() {
      Object.values(this.charts).forEach((c) => c && c.destroy())
      this.charts = Object.create(null)
    },
    opcionesPie(filas) {
      const total = filas.reduce((a, f) => a + f.total, 0)
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.parsed} trámites (${filas[ctx.dataIndex]?.pct || ''})`
            }
          },
          datalabels: {
            color: '#fff',
            font: { weight: 'bold', size: 14 },
            formatter: (value) => {
              const pct = total ? (value / total) * 100 : 0
              if (pct < 3.5) return ''
              return formatoPct(value, total)
            }
          }
        }
      }
    },
    opcionesBarrasTipo(filas, meses) {
      return {
        type: 'bar',
        data: {
          labels: meses,
          datasets: filas.map((fila) => ({
            label: fila.tabla,
            data: fila.porMes,
            backgroundColor: fila.color,
            maxBarThickness: 22
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            datalabels: { display: false }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#666' } },
            y: {
              beginAtZero: true,
              ticks: { precision: 0, color: '#888' },
              title: { display: true, text: 'Cantidad de solicitudes', color: '#666' },
              grid: { color: '#eceff1' }
            }
          }
        }
      }
    },
    configDe(key) {
      if (key === 'tipo') {
        const filas = this.filasTipo2026
        return {
          type: 'pie',
          data: {
            labels: filas.map((f) => f.pie),
            datasets: [{
              data: filas.map((f) => f.total),
              backgroundColor: filas.map((f) => f.color),
              borderColor: '#fff',
              borderWidth: 2
            }]
          },
          options: this.opcionesPie(filas)
        }
      }
      if (key === 'mes2026') return this.opcionesBarrasTipo(this.filasTipo2026Tabla, MESES_9)
      if (key === 'mes2025') return this.opcionesBarrasTipo(this.filasTipo2025Tabla, MESES_12)
      if (key === 'anios') {
        return {
          type: 'bar',
          data: {
            labels: MESES_12,
            datasets: this.aniosDisponibles.map((anio) => ({
              label: String(anio),
              data: this.porAnioMes[anio],
              backgroundColor: COLORES_ANIO[anio],
              maxBarThickness: 22
            }))
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top', labels: { usePointStyle: true, padding: 16 } },
              datalabels: { display: false }
            },
            scales: {
              x: { grid: { display: false }, ticks: { color: '#666' } },
              y: {
                beginAtZero: true,
                ticks: { precision: 0, color: '#888' },
                title: { display: true, text: 'Cantidad de solicitudes', color: '#666' },
                grid: { color: '#eceff1' }
              }
            }
          }
        }
      }
      if (key === 'aprobadas') {
        return {
          type: 'bar',
          data: {
            labels: MESES_9,
            datasets: [
              {
                label: '2025',
                data: this.aprobadas2025,
                backgroundColor: COLORES_ANIO[2025],
                maxBarThickness: 28
              },
              {
                label: '2026',
                data: this.aprobadas2026,
                backgroundColor: COLORES_ANIO[2026],
                maxBarThickness: 28
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top', labels: { usePointStyle: true, padding: 16 } },
              datalabels: {
                anchor: 'end',
                align: 'end',
                color: '#555',
                font: { weight: 'bold', size: 11 },
                formatter: (v) => (v ? v : '')
              }
            },
            scales: {
              x: { grid: { display: false }, ticks: { color: '#666' } },
              y: {
                beginAtZero: true,
                ticks: { precision: 0, color: '#888' },
                title: { display: true, text: 'Habilitaciones aprobadas', color: '#666' },
                grid: { color: '#eceff1' }
              }
            }
          }
        }
      }
      if (key === 'habGeneral') {
        return {
          type: 'bar',
          data: {
            labels: MESES_9,
            datasets: [
              {
                label: '2025',
                data: this.hab2025,
                backgroundColor: COLORES_ANIO[2025],
                maxBarThickness: 28
              },
              {
                label: '2026',
                data: this.hab2026,
                backgroundColor: COLORES_ANIO[2026],
                maxBarThickness: 28
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top', labels: { usePointStyle: true, padding: 16 } },
              datalabels: {
                anchor: 'end',
                align: 'end',
                color: '#555',
                font: { weight: 'bold', size: 11 },
                formatter: (v) => (v ? v : '')
              }
            },
            scales: {
              x: { grid: { display: false }, ticks: { color: '#666' } },
              y: {
                beginAtZero: true,
                ticks: { precision: 0, color: '#888' },
                title: { display: true, text: 'Habilitaciones recibidas', color: '#666' },
                grid: { color: '#eceff1' }
              }
            }
          }
        }
      }
      if (key === 'habEstado') {
        const filas = this.filasEstadoHab
        return {
          type: 'bar',
          data: {
            labels: filas.map((f) => f.estado),
            datasets: [
              {
                label: '2025',
                data: filas.map((f) => f.n2025),
                backgroundColor: COLORES_ANIO[2025],
                maxBarThickness: 28
              },
              {
                label: '2026',
                data: filas.map((f) => f.n2026),
                backgroundColor: COLORES_ANIO[2026],
                maxBarThickness: 28
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top', labels: { usePointStyle: true, padding: 16 } },
              datalabels: {
                anchor: 'end',
                align: 'end',
                color: '#555',
                font: { weight: 'bold', size: 10 },
                formatter: (v) => (v ? v : '')
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: '#666', maxRotation: 45, minRotation: 0, autoSkip: false }
              },
              y: {
                beginAtZero: true,
                ticks: { precision: 0, color: '#888' },
                title: { display: true, text: 'Cantidad', color: '#666' },
                grid: { color: '#eceff1' }
              }
            }
          }
        }
      }
      if (key === 'diario') {
        return {
          type: 'bar',
          data: {
            labels: this.puntosDiarios.map((p) => p.label),
            datasets: [{
              label: 'Trámites',
              data: this.puntosDiarios.map((p) => p.total),
              backgroundColor: '#1a4f72',
              maxBarThickness: 10
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              datalabels: { display: false }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: {
                  color: '#666',
                  maxRotation: 90,
                  minRotation: 90,
                  autoSkip: true,
                  maxTicksLimit: 16
                }
              },
              y: {
                beginAtZero: true,
                ticks: { precision: 0, color: '#888' },
                title: { display: true, text: 'Cantidad de trámites', color: '#666' },
                grid: { color: '#eceff1' }
              }
            }
          }
        }
      }
      return null
    },
    renderUno(key) {
      if (this.charts[key]) {
        this.charts[key].destroy()
        delete this.charts[key]
      }
      const refMap = {
        tipo: this.$refs.chartTipo,
        mes2026: this.$refs.chartMes2026,
        mes2025: this.$refs.chartMes2025,
        anios: this.$refs.chartAnios,
        diario: this.$refs.chartDiario,
        aprobadas: this.$refs.chartAprobadas,
        habGeneral: this.$refs.chartHabGeneral,
        habEstado: this.$refs.chartHabEstado
      }
      const ref = refMap[key]
      const config = this.configDe(key)
      if (ref && config) this.charts[key] = new Chart(ref, config)
    },
    renderCharts() {
      this.destroyCharts()
      ;['tipo', 'mes2026', 'mes2025', 'anios', 'diario', 'aprobadas', 'habGeneral', 'habEstado'].forEach((key) => this.renderUno(key))
    },
    leyendaDe(key) {
      if (key === 'tipo') {
        return this.filasTipo2026.map((f) => ({
          color: f.color,
          texto: `${f.pie} (${f.pct}) - ${f.total} trámites`
        }))
      }
      if (key === 'anios') {
        return this.aniosDisponibles.map((anio) => ({
          color: COLORES_ANIO[anio],
          texto: String(anio)
        }))
      }
      if (key === 'aprobadas') {
        return [
          { color: COLORES_ANIO[2025], texto: `2025 (${this.totalAprobadas2025})` },
          { color: COLORES_ANIO[2026], texto: `2026 (${this.totalAprobadas2026})` }
        ]
      }
      if (key === 'habGeneral') {
        return [
          { color: COLORES_ANIO[2025], texto: `2025 (${this.totalHab2025})` },
          { color: COLORES_ANIO[2026], texto: `2026 (${this.totalHab2026})` }
        ]
      }
      if (key === 'habEstado') {
        return [
          { color: COLORES_ANIO[2025], texto: `2025 (${this.totalHab2025})` },
          { color: COLORES_ANIO[2026], texto: `2026 (${this.totalHab2026})` }
        ]
      }
      return []
    },
    tablaDe(key) {
      if (key === 'mes2026') return { meses: MESES_9, filas: this.filasTipo2026Tabla }
      if (key === 'mes2025') return { meses: MESES_12, filas: this.filasTipo2025Tabla }
      if (key === 'aprobadas') {
        return {
          meses: MESES_9,
          filas: [
            { color: COLORES_ANIO[2025], tabla: '2025', porMes: this.aprobadas2025, total: this.totalAprobadas2025 },
            { color: COLORES_ANIO[2026], tabla: '2026', porMes: this.aprobadas2026, total: this.totalAprobadas2026 }
          ]
        }
      }
      if (key === 'habGeneral') {
        return {
          meses: MESES_9,
          filas: [
            { color: COLORES_ANIO[2025], tabla: '2025', porMes: this.hab2025, total: this.totalHab2025 },
            { color: COLORES_ANIO[2026], tabla: '2026', porMes: this.hab2026, total: this.totalHab2026 }
          ]
        }
      }
      if (key === 'habEstado') {
        return {
          meses: ['2025', '2026'],
          filas: this.filasEstadoHab.map((f) => ({
            color: '#6c757d',
            tabla: f.estado,
            porMes: [f.n2025, f.n2026],
            total: f.n2025 + f.n2026
          }))
        }
      }
      return null
    },
    envolverTexto(ctx, texto, maxWidth) {
      const palabras = String(texto).split(/\s+/)
      const lineas = []
      let linea = ''
      palabras.forEach((palabra) => {
        const prueba = linea ? `${linea} ${palabra}` : palabra
        if (linea && ctx.measureText(prueba).width > maxWidth) {
          lineas.push(linea)
          linea = palabra
        } else {
          linea = prueba
        }
      })
      if (linea) lineas.push(linea)
      return lineas
    },
    dibujarLeyenda(ctx, items, x, y) {
      const sw = 18
      const sh = 14
      const lineH = 30
      ctx.textBaseline = 'middle'
      ctx.font = '400 16px "Segoe UI", Roboto, sans-serif'
      items.forEach((item, i) => {
        const iy = y + i * lineH
        ctx.fillStyle = item.color
        ctx.fillRect(x, iy - sh / 2, sw, sh)
        ctx.fillStyle = '#444444'
        ctx.fillText(item.texto, x + sw + 10, iy)
      })
    },
    dibujarTabla(ctx, x, y, tableW, meses, filas) {
      const cols = ['Referencia', 'Tipo de trámite', ...meses, 'Total']
      const n = cols.length
      const refW = 88
      const tipoW = 150
      const restW = tableW - refW - tipoW
      const numW = restW / (meses.length + 1)
      const widths = [refW, tipoW, ...meses.map(() => numW), numW]
      const rowH = 30
      const headerH = 32
      ctx.font = '600 12px "Segoe UI", Roboto, sans-serif'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#f3f4f6'
      ctx.fillRect(x, y, tableW, headerH)
      ctx.fillStyle = '#444444'
      let cx = x
      cols.forEach((col, i) => {
        ctx.textAlign = i < 2 ? 'left' : 'center'
        const tx = i < 2 ? cx + 10 : cx + widths[i] / 2
        ctx.fillText(col, tx, y + headerH / 2)
        cx += widths[i]
      })
      filas.forEach((fila, r) => {
        const ry = y + headerH + r * rowH
        if (r % 2) {
          ctx.fillStyle = '#fafafa'
          ctx.fillRect(x, ry, tableW, rowH)
        }
        ctx.strokeStyle = '#e6e6e6'
        ctx.beginPath()
        ctx.moveTo(x, ry + rowH)
        ctx.lineTo(x + tableW, ry + rowH)
        ctx.stroke()
        const valores = ['', fila.tabla, ...fila.porMes, fila.total]
        cx = x
        valores.forEach((valor, i) => {
          if (i === 0) {
            ctx.fillStyle = fila.color
            ctx.fillRect(cx + 16, ry + 8, 22, 14)
          } else {
            ctx.fillStyle = '#444444'
            ctx.font = i === n - 1 ? '700 12px "Segoe UI", Roboto, sans-serif' : '400 12px "Segoe UI", Roboto, sans-serif'
            ctx.textAlign = i === 1 ? 'left' : 'center'
            const tx = i === 1 ? cx + 10 : cx + widths[i] / 2
            ctx.fillText(String(valor), tx, ry + rowH / 2)
          }
          cx += widths[i]
        })
      })
      ctx.textAlign = 'left'
      return headerH + filas.length * rowH
    },
    exportar(key, nombre, titulo, subtitulo = '') {
      const chart = this.charts[key]
      const config = this.configDe(key)
      if (!chart?.canvas || !config) return
      const SCALE = 6
      const chartW = chart.canvas.offsetWidth || chart.width
      const chartH = chart.canvas.offsetHeight || chart.height
      const dest = document.createElement('canvas')
      dest.style.cssText = `position:absolute;left:-9999px;width:${chartW}px;height:${chartH}px`
      document.body.appendChild(dest)
      const clone = new Chart(dest, {
        type: config.type,
        data: config.data,
        options: { ...config.options, responsive: false, animation: false, devicePixelRatio: SCALE }
      })

      const pad = 32
      const titleSize = 28
      const subSize = 18
      const esPie = key === 'tipo'
      const leyenda = this.leyendaDe(key)
      const tabla = this.tablaDe(key)
      const legendW = esPie ? 390 : 0
      const gap = esPie ? 36 : 0
      const innerW = Math.max(chartW + gap + legendW, tabla ? 980 : chartW)
      const totalW = innerW + pad * 2
      const png = document.createElement('canvas')
      const ctx = png.getContext('2d')
      ctx.font = `500 ${titleSize}px "Segoe UI", Roboto, sans-serif`
      const lineasTitulo = this.envolverTexto(ctx, titulo, totalW - pad * 2)
      ctx.font = `400 ${subSize}px "Segoe UI", Roboto, sans-serif`
      const lineasSub = subtitulo ? this.envolverTexto(ctx, subtitulo, totalW - pad * 2) : []
      const headerH = pad
        + lineasTitulo.length * Math.round(titleSize * 1.25)
        + (lineasSub.length ? 8 + lineasSub.length * Math.round(subSize * 1.35) : 0)
        + 20
      const tableH = tabla ? 24 + 32 + tabla.filas.length * 30 : 0
      const totalH = headerH + chartH + tableH + pad

      png.width = totalW * SCALE
      png.height = totalH * SCALE
      ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, totalW, totalH)

      let y = pad + titleSize
      ctx.fillStyle = '#4a4a4a'
      ctx.font = `500 ${titleSize}px "Segoe UI", Roboto, sans-serif`
      ctx.textBaseline = 'alphabetic'
      ctx.textAlign = 'left'
      lineasTitulo.forEach((linea) => {
        ctx.fillText(linea, pad, y)
        y += Math.round(titleSize * 1.25)
      })
      if (lineasSub.length) {
        y += 4
        ctx.fillStyle = '#8a8a8a'
        ctx.font = `400 ${subSize}px "Segoe UI", Roboto, sans-serif`
        lineasSub.forEach((linea) => {
          ctx.fillText(linea, pad, y)
          y += Math.round(subSize * 1.35)
        })
      }

      ctx.drawImage(dest, pad, headerH, chartW, chartH)
      if (esPie && leyenda.length) {
        const leyendaY = headerH + Math.max(0, (chartH - leyenda.length * 30) / 2) + 15
        this.dibujarLeyenda(ctx, leyenda, pad + chartW + gap, leyendaY)
      }
      if (tabla) this.dibujarTabla(ctx, pad, headerH + chartH + 16, innerW, tabla.meses, tabla.filas)

      clone.destroy()
      dest.remove()
      const link = document.createElement('a')
      link.download = `${nombre}.png`
      link.href = png.toDataURL('image/png')
      link.click()
    },
    filasExcel(desdeIso, hastaIso) {
      const inicio = parseIso(desdeIso)
      const fin = new Date(parseIso(hastaIso).getFullYear(), parseIso(hastaIso).getMonth(), parseIso(hastaIso).getDate(), 23, 59, 59, 999)
      const tipos = ORDEN_TABLA.map((key) => ({ key, ...META_TIPO[key] }))
      const map = {}
      for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
        const iso = isoFecha(d)
        map[iso] = { Fecha: iso, Total: 0 }
        tipos.forEach((t) => { map[iso][t.tabla] = 0 })
      }
      this.habilitaciones.forEach((t) => {
        const fecha = this.convertirFecha(t.createdAt)
        if (!fecha || fecha < inicio || fecha > fin) return
        const iso = isoFecha(fecha)
        if (!map[iso]) return
        const meta = META_TIPO[this.claveTipo(t.tipoSolicitud)]
        const col = meta?.tabla || 'Otros'
        if (map[iso][col] === undefined) map[iso][col] = 0
        map[iso][col]++
        map[iso].Total++
      })
      return Object.values(map)
    },
    async exportarExcel(desdeIso, hastaIso, nombre) {
      const XLSX = await loadXlsx()
      const datos = this.filasExcel(desdeIso, hastaIso)
      const hoja = XLSX.utils.json_to_sheet(datos.length ? datos : [{ Fecha: '', Total: 0 }])
      hoja['!cols'] = Object.keys(datos[0] || { Fecha: '', Total: 0 }).map((col) => ({ wch: Math.max(col.length, 12) }))
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, hoja, 'Diario')
      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      await saveAsFile(blob, `${nombre}.xlsx`)
    }
  }
}
</script>

<style scoped>
.informe-2026 {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.informe-bloque {
  background: #fff;
  border-radius: 12px;
  padding: 1rem 1rem 1.25rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}
.bloque-head {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.informe-bloque h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 500;
  color: #4a4a4a;
  line-height: 1.25;
}
.subtitulo {
  margin: 0.35rem 0 0;
  color: #8a8a8a;
  font-size: 0.95rem;
}
.acciones {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.tipo-switch {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.vacio {
  color: #888;
  text-align: center;
  padding: 2rem 0;
}
.pie-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.pie-col { width: 100%; max-width: 420px; }
.pie-canvas {
  position: relative;
  width: 100%;
  height: 280px;
}
.bar-canvas {
  position: relative;
  width: 100%;
  height: 300px;
}
.bar-canvas-alta { height: 340px; }
.leyenda {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  color: #444;
  font-size: 0.95rem;
}
.leyenda li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.swatch {
  width: 18px;
  height: 14px;
  border-radius: 2px;
  flex-shrink: 0;
  display: inline-block;
}
.tabla-comparacion {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
  min-width: 720px;
}
.tabla-comparacion th,
.tabla-comparacion td {
  border-bottom: 1px solid #e6e6e6;
  padding: 0.45rem 0.5rem;
  text-align: center;
  color: #444;
  white-space: nowrap;
}
.tabla-comparacion th { background: #f3f4f6; font-weight: 600; }
.tabla-comparacion td.text-left { text-align: left; }

@media (min-width: 768px) {
  .informe-bloque { padding: 1.5rem 1.75rem 1.75rem; }
  .bloque-head {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
  .informe-bloque h2 { font-size: 1.5rem; }
  .pie-layout {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }
  .pie-col { flex: 1 1 340px; }
  .pie-canvas { height: 340px; }
  .leyenda { flex: 0 1 360px; font-size: 1rem; }
  .bar-canvas { height: 380px; }
  .bar-canvas-alta { height: 420px; }
}
</style>
