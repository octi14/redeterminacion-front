<template>
  <div class="page main-background">
    <Banner title="Declaración jurada de fallecidos" />
    <LoadingOverlay :show="$fetchState.pending || enviando" :message="mensajeEspera" />

    <b-container class="py-4">
      <b-alert v-if="loadError" show variant="danger">
        No se pudieron cargar los períodos. {{ loadError }}
      </b-alert>

      <b-card class="shadow-card mb-4 hero-card">
        <b-row align-v="center">
          <b-col md="8">
            <div class="text-muted mb-1">Funeraria</div>
            <h2 class="text-success mb-2">{{ funerariaNombre }}</h2>
            <b-form-select
              v-if="esMaster"
              v-model="funerariaSeleccionada"
              class="mb-3"
              :options="funerarias"
            />
            <p class="mb-0">
              Administrá los fallecidos y las declaraciones juradas mensuales de la funeraria.
            </p>
          </b-col>
          <b-col md="4" class="text-md-right mt-3 mt-md-0">
            <b-button variant="success" size="lg" :to="nuevoFallecidoRoute" :disabled="esMaster && !funerariaSeleccionada">
              <b-icon-plus-circle class="mr-1" /> Nuevo fallecido
            </b-button>
          </b-col>
        </b-row>
      </b-card>

      <b-alert
        v-for="periodo in pendientesConfirmacion"
        :key="periodo.id || periodo._id"
        show
        variant="warning"
        class="shadow-card"
      >
        <b-row align-v="center">
          <b-col>
            <strong>La declaración de {{ periodoLabel(periodo) }} está lista para confirmar.</strong>
            Revisá el resumen y adjuntá el comprobante del pago mensual.
          </b-col>
          <b-col cols="auto">
            <b-button variant="warning" @click="abrirConfirmacion(periodo)">Revisar y confirmar</b-button>
          </b-col>
        </b-row>
      </b-alert>

      <b-card v-if="periodoAbierto" class="shadow-card mb-4">
        <b-row align-v="center" class="mb-3">
          <b-col>
            <h3 class="text-success mb-1">Período actual: {{ periodoLabel(periodoAbierto) }}</h3>
            <div class="text-muted">
              Desde {{ fecha(periodoAbierto.fechaInicio) }} hasta {{ fecha(periodoAbierto.fechaFin) }}
            </div>
          </b-col>
          <b-col cols="auto">
            <b-badge variant="success" pill>Abierto</b-badge>
          </b-col>
        </b-row>
        <PeriodSummary :periodo="periodoAbierto" />
        <b-row class="mt-3">
          <b-col md="6">
            <b-form-group label="Buscar fallecido">
              <b-form-input v-model="fallecidosBusqueda" placeholder="Nombre, apellido o documento" />
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Sepultura">
              <b-form-select v-model="fallecidosSepultura" :options="sepulturaFilterOptions" />
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Condición">
              <b-form-select v-model="fallecidosCondicion" :options="condicionFilterOptions" />
            </b-form-group>
          </b-col>
        </b-row>
        <b-table
          class="mt-3"
          responsive
          striped
          hover
          :items="fallecidosPaginados"
          :fields="fallecidosFields"
          empty-text="Todavía no hay fallecidos cargados en este período."
          show-empty
        >
          <template #cell(nombre)="row">{{ nombreFallecido(row.item) }}</template>
          <template #cell(tipoSepultura)="row">{{ sepulturaLabel(row.item.tipoSepultura) }}</template>
          <template #cell(importe)="row">
            <b-badge v-if="row.item.condicionPago === 'EXENTO'" variant="info">Exento</b-badge>
            <span v-else>{{ moneda(row.item.precioAplicado) }}</span>
          </template>
          <template #cell(acciones)="row">
            <b-button size="sm" variant="link" class="text-primary" title="Editar" aria-label="Editar" :to="`/cementerio/certificado_defuncion/form?id=${row.item.id || row.item._id}`">
              <b-icon-pencil />
            </b-button>
          </template>
        </b-table>
        <ListPagination v-model="fallecidosPage" :total-rows="fallecidosFiltrados.length" :per-page="perPage" />
      </b-card>

      <b-card class="shadow-card">
        <h3 class="text-success mb-3">Declaraciones anteriores</h3>
        <b-row>
          <b-col md="6">
            <b-form-group label="Buscar declaración">
              <b-form-input v-model="periodosBusqueda" placeholder="Funeraria, mes o año" />
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Estado">
              <b-form-select v-model="periodosEstado" :options="periodoEstadoOptions" />
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Año">
              <b-form-select v-model="periodosAnio" :options="periodoAnioOptions" />
            </b-form-group>
          </b-col>
        </b-row>
        <b-table
          responsive
          hover
          :items="periodosPaginados"
          :fields="periodosFields"
          empty-text="No hay declaraciones anteriores."
          show-empty
        >
          <template #cell(periodo)="row">{{ periodoLabel(row.item) }}</template>
          <template #cell(funeraria)="row">{{ row.item.funeraria && row.item.funeraria.nombre || funerariaNombre }}</template>
          <template #cell(total)="row">{{ moneda(row.item.total) }}</template>
          <template #cell(estado)="row">
            <b-badge :variant="statusVariant(row.item.estado)">{{ estadoLabel(row.item.estado) }}</b-badge>
          </template>
          <template #cell(acciones)="row">
            <b-button size="sm" variant="link" class="text-primary" title="Ver detalle" aria-label="Ver detalle" @click="abrirDetallePeriodo(row.item)">
              <b-icon-search />
            </b-button>
          </template>
        </b-table>
        <ListPagination v-model="periodosPage" :total-rows="periodosFiltrados.length" :per-page="perPage" />
      </b-card>
    </b-container>

    <b-modal v-model="showConfirmacion" title="Confirmar declaración jurada" size="lg" hide-footer>
      <template v-if="periodoSeleccionado">
        <p>
          Al confirmar, el período <strong>{{ periodoLabel(periodoSeleccionado) }}</strong> quedará bloqueado
          y será enviado a Recaudaciones.
        </p>
        <PeriodSummary :periodo="periodoSeleccionado" />
        <b-form-group class="mt-4" label="Comprobante de pago o transferencia mensual *">
          <b-form-file
            v-model="comprobanteMensual"
            accept=".pdf,image/*"
            browse-text="Examinar"
            placeholder="Seleccioná un archivo"
          />
        </b-form-group>
        <div class="text-right">
          <b-button variant="secondary" :disabled="enviando" @click="showConfirmacion = false">Cancelar</b-button>
          <b-button variant="success" :disabled="!comprobanteMensual || enviando" @click="confirmarPeriodo">
            <b-spinner v-if="enviando" small class="mr-2" />
            {{ enviando ? 'Confirmando...' : 'Confirmar período' }}
          </b-button>
        </div>
      </template>
    </b-modal>
    <DeclarationDetailModal v-model="showDetallePeriodo" :periodo="periodoDetalle" />
  </div>
</template>

<script>
import { TIPOS_SEPULTURA, ESTADOS_PERIODO } from '~/config/cementerio'
import { formatCurrency, formatPeriodLabel, getStatusVariant } from '~/utils/cementerio'
import PeriodSummary from '~/components/cementerio/PeriodSummary.vue'
import LoadingOverlay from '~/components/cementerio/LoadingOverlay.vue'
import ListPagination from '~/components/cementerio/ListPagination.vue'
import DeclarationDetailModal from '~/components/cementerio/DeclarationDetailModal.vue'

export default {
  components: { PeriodSummary, LoadingOverlay, ListPagination, DeclarationDetailModal },
  middleware: ['authenticated', 'cementerio'],
  data() {
    return {
      loadError: '',
      funerariaSeleccionada: '',
      showConfirmacion: false,
      showDetallePeriodo: false,
      periodoSeleccionado: null,
      periodoDetalle: null,
      comprobanteMensual: null,
      enviando: false,
      mensajeEspera: 'Cargando períodos y declaraciones juradas...',
      perPage: 10,
      fallecidosPage: 1,
      fallecidosBusqueda: '',
      fallecidosSepultura: '',
      fallecidosCondicion: '',
      periodosPage: 1,
      periodosBusqueda: '',
      periodosEstado: '',
      periodosAnio: '',
      fallecidosFields: [
        { key: 'nombre', label: 'Fallecido' },
        { key: 'tipoSepultura', label: 'Sepultura' },
        { key: 'importe', label: 'Condición / importe' },
        { key: 'acciones', label: '' },
      ],
      periodosFields: [
        { key: 'periodo', label: 'Período' },
        { key: 'funeraria', label: 'Funeraria' },
        { key: 'cantidadFallecidos', label: 'Fallecidos' },
        { key: 'total', label: 'Total' },
        { key: 'estado', label: 'Estado' },
        { key: 'acciones', label: '' },
      ],
    }
  },
  async fetch() {
    this.mensajeEspera = 'Cargando períodos y declaraciones juradas...'
    try {
      const action = this.$store.state.user.admin === 'master' ? 'cementerio/getPeriodos' : 'cementerio/getMisPeriodos'
      await this.$store.dispatch(action)
      if (this.esMaster && !this.funerariaSeleccionada && this.funerarias.length) {
        this.funerariaSeleccionada = this.funerarias[0].value
      }
    } catch (error) {
      this.loadError = error.message || 'El backend todavía no implementa el circuito mensual.'
    }
  },
  computed: {
    esMaster() {
      return this.$store.state.user.admin === 'master'
    },
    todosLosPeriodos() {
      return this.$store.state.cementerio.periodos || []
    },
    funerarias() {
      const unique = new Map()
      this.todosLosPeriodos.forEach(periodo => {
        const funeraria = periodo.funeraria || {}
        const id = funeraria.id || funeraria._id || periodo.funerariaId
        if (id && !unique.has(id)) unique.set(id, { value: id, text: funeraria.nombre || funeraria.cuit || id })
      })
      return [...unique.values()]
    },
    periodos() {
      if (!this.esMaster || !this.funerariaSeleccionada) return this.todosLosPeriodos
      return this.todosLosPeriodos.filter(periodo => {
        const funeraria = periodo.funeraria || {}
        return (funeraria.id || funeraria._id || periodo.funerariaId) === this.funerariaSeleccionada
      })
    },
    periodoAbierto() {
      return this.periodos.find(periodo => periodo.estado === ESTADOS_PERIODO.ABIERTO)
    },
    pendientesConfirmacion() {
      return this.periodos.filter(periodo => periodo.estado === ESTADOS_PERIODO.PENDIENTE_CONFIRMACION)
    },
    periodosAnteriores() {
      return this.periodos
        .filter(periodo => periodo.estado !== ESTADOS_PERIODO.ABIERTO)
        .map(periodo => ({ ...periodo, cantidadFallecidos: periodo.cantidadFallecidos || (periodo.fallecidos || []).length }))
    },
    fallecidosFiltrados() {
      const term = this.fallecidosBusqueda.trim().toLowerCase()
      return (this.periodoAbierto && this.periodoAbierto.fallecidos || []).filter(item => {
        const obito = item.obito || {}
        const searchable = [obito.nombre, obito.apellido, obito.numeroDocumento].filter(Boolean).join(' ').toLowerCase()
        return (!term || searchable.includes(term))
          && (!this.fallecidosSepultura || item.tipoSepultura === this.fallecidosSepultura)
          && (!this.fallecidosCondicion || item.condicionPago === this.fallecidosCondicion)
      })
    },
    fallecidosPaginados() {
      return this.paginate(this.fallecidosFiltrados, this.fallecidosPage)
    },
    sepulturaFilterOptions() {
      return [{ value: '', text: 'Todas' }, ...TIPOS_SEPULTURA.map(item => ({ value: item.value, text: item.text }))]
    },
    condicionFilterOptions() {
      return [
        { value: '', text: 'Todas' },
        { value: 'PAGO', text: 'Pago' },
        { value: 'EXENTO', text: 'Exento' },
      ]
    },
    periodoEstadoOptions() {
      return [
        { value: '', text: 'Todos' },
        { value: 'PENDIENTE_CONFIRMACION', text: 'Pendiente de confirmación' },
        { value: 'EN_PROCESO', text: 'En proceso' },
        { value: 'APROBADO', text: 'Aprobado' },
        { value: 'RECHAZADO', text: 'Rechazado' },
      ]
    },
    periodoAnioOptions() {
      const years = [...new Set(this.periodosAnteriores.map(item => item.anio).filter(Boolean))].sort((a, b) => b - a)
      return [{ value: '', text: 'Todos' }, ...years.map(value => ({ value, text: String(value) }))]
    },
    periodosFiltrados() {
      const term = this.periodosBusqueda.trim().toLowerCase()
      return this.periodosAnteriores.filter(item => {
        const searchable = [
          this.periodoLabel(item),
          item.funeraria && item.funeraria.nombre,
          item.funeraria && item.funeraria.cuit,
        ].filter(Boolean).join(' ').toLowerCase()
        return (!term || searchable.includes(term))
          && (!this.periodosEstado || item.estado === this.periodosEstado)
          && (!this.periodosAnio || item.anio === this.periodosAnio)
      })
    },
    periodosPaginados() {
      return this.paginate(this.periodosFiltrados, this.periodosPage)
    },
    funerariaNombre() {
      const periodo = this.periodoAbierto || this.periodos[0]
      return periodo && periodo.funeraria && periodo.funeraria.nombre || 'Funeraria sin asignar'
    },
    nuevoFallecidoRoute() {
      return this.esMaster
        ? { path: '/cementerio/certificado_defuncion/form', query: { funerariaId: this.funerariaSeleccionada } }
        : '/cementerio/certificado_defuncion/form'
    },
  },
  watch: {
    fallecidosBusqueda() {
      this.fallecidosPage = 1
    },
    fallecidosSepultura() {
      this.fallecidosPage = 1
    },
    fallecidosCondicion() {
      this.fallecidosPage = 1
    },
    periodosBusqueda() {
      this.periodosPage = 1
    },
    periodosEstado() {
      this.periodosPage = 1
    },
    periodosAnio() {
      this.periodosPage = 1
    },
    funerariaSeleccionada() {
      this.fallecidosPage = 1
      this.periodosPage = 1
    },
    fallecidosFiltrados(items) {
      this.fallecidosPage = this.validPage(this.fallecidosPage, items.length)
    },
    periodosFiltrados(items) {
      this.periodosPage = this.validPage(this.periodosPage, items.length)
    },
  },
  methods: {
    moneda: formatCurrency,
    periodoLabel: formatPeriodLabel,
    statusVariant: getStatusVariant,
    notify(message, variant = 'success') {
      this.$bvToast.toast(message, { variant, solid: true, appendToast: true })
    },
    paginate(items, page) {
      const start = (page - 1) * this.perPage
      return items.slice(start, start + this.perPage)
    },
    validPage(page, totalRows) {
      return Math.min(page, Math.max(1, Math.ceil(totalRows / this.perPage)))
    },
    fecha(value) {
      return value ? new Date(value).toLocaleDateString('es-AR') : '-'
    },
    nombreFallecido(item) {
      return [item.obito && item.obito.apellido, item.obito && item.obito.nombre].filter(Boolean).join(', ')
    },
    sepulturaLabel(value) {
      return (TIPOS_SEPULTURA.find(tipo => tipo.value === value) || {}).text || value
    },
    estadoLabel(estado) {
      return String(estado || '').replaceAll('_', ' ').toLowerCase()
    },
    abrirConfirmacion(periodo) {
      this.periodoSeleccionado = periodo
      this.comprobanteMensual = null
      this.showConfirmacion = true
    },
    abrirDetallePeriodo(periodo) {
      this.periodoDetalle = periodo
      this.showDetallePeriodo = true
    },
    blobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = () => resolve(reader.result.split(',')[1])
        reader.onerror = reject
      })
    },
    async confirmarPeriodo() {
      if (this.enviando) return
      this.enviando = true
      this.mensajeEspera = 'Confirmando el período y cargando el comprobante mensual...'
      try {
        const comprobantePagoMensual = {
          nombre: this.comprobanteMensual.name,
          contentType: this.comprobanteMensual.type,
          data: await this.blobToBase64(this.comprobanteMensual),
        }
        await this.$store.dispatch('cementerio/confirmarPeriodo', {
          id: this.periodoSeleccionado.id || this.periodoSeleccionado._id,
          comprobantePagoMensual,
        })
        this.showConfirmacion = false
        this.notify('El período fue confirmado y enviado a Recaudaciones.')
        await this.$fetch()
      } catch (error) {
        this.notify(error.message || 'No se pudo confirmar el período.', 'danger')
      } finally {
        this.enviando = false
      }
    },
  },
}
</script>

<style scoped>
.hero-card { border-left: 5px solid #19a02d; }
.badge { font-size: 0.85rem; text-transform: capitalize; }
</style>
