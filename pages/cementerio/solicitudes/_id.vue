<template>
  <div class="page main-background">
    <Banner title="Revisión de declaración jurada" subtitle="Recaudaciones" />
    <LoadingOverlay :show="$fetchState.pending || procesando" :message="mensajeEspera" />
    <b-container class="py-4">
      <b-alert v-if="loadError" show variant="danger">{{ loadError }}</b-alert>
      <template v-if="periodo">
        <b-card class="shadow-card mb-4">
          <b-row align-v="center">
            <b-col>
              <h2 class="text-success">{{ funerariaNombre }}</h2>
              <p class="mb-0">Período {{ periodoLabel(periodo) }}</p>
            </b-col>
            <b-col cols="auto">
              <b-badge :variant="statusVariant(periodo.estado)" pill>{{ estadoLabel(periodo.estado) }}</b-badge>
            </b-col>
          </b-row>
          <PeriodSummary class="mt-4" :periodo="periodo" />
        </b-card>

        <b-card class="shadow-card mb-4">
          <h3 class="text-success">Comprobante mensual</h3>
          <b-row align-v="center">
            <b-col>
              <a v-if="periodo.comprobantePagoMensual && periodo.comprobantePagoMensual.url" :href="periodo.comprobantePagoMensual.url" target="_blank" title="Ver comprobante" aria-label="Ver comprobante">
                <b-icon-file-earmark-text font-scale="1.25" />
              </a>
              <span v-else class="text-danger">No se recibió un comprobante mensual.</span>
            </b-col>
            <b-col cols="auto">
              <b-badge :variant="statusVariant(periodo.estadoRevisionPagoMensual)">
                {{ estadoLabel(periodo.estadoRevisionPagoMensual || 'PENDIENTE') }}
              </b-badge>
              <b-button size="sm" variant="success" title="Aprobar" aria-label="Aprobar" :disabled="procesando" @click="revisarMensual('APROBADO')"><b-icon-check-lg /></b-button>
              <b-button size="sm" variant="danger" title="Rechazar" aria-label="Rechazar" :disabled="procesando" @click="revisarMensual('RECHAZADO')"><b-icon-x font-scale="1.25" /></b-button>
            </b-col>
          </b-row>
        </b-card>

        <b-card class="shadow-card mb-4">
          <h3 class="text-success mb-3">Pagos y exenciones individuales</h3>
          <b-row>
            <b-col md="6">
              <b-form-group label="Buscar fallecido">
                <b-form-input v-model="busqueda" placeholder="Nombre, apellido o documento" />
              </b-form-group>
            </b-col>
            <b-col md="3">
              <b-form-group label="Condición">
                <b-form-select v-model="condicion" :options="condicionOptions" />
              </b-form-group>
            </b-col>
            <b-col md="3">
              <b-form-group label="Estado de revisión">
                <b-form-select v-model="estadoRevision" :options="revisionOptions" />
              </b-form-group>
            </b-col>
          </b-row>
          <b-table responsive hover :items="fallecidosPaginados" :fields="fields" show-empty empty-text="Sin fallecidos que coincidan con los filtros">
            <template #cell(fallecido)="row">{{ nombreFallecido(row.item) }}</template>
            <template #cell(importe)="row">
              <b-badge v-if="row.item.condicionPago === 'EXENTO'" variant="info">Exento</b-badge>
              <span v-else>{{ moneda(row.item.precioAplicado) }}</span>
            </template>
            <template #cell(comprobante)="row">
              <a v-if="comprobanteUrl(row.item)" :href="comprobanteUrl(row.item)" target="_blank" title="Ver archivo" aria-label="Ver archivo"><b-icon-file-earmark-text font-scale="1.25" /></a>
              <span v-else class="text-danger">Sin archivo</span>
            </template>
            <template #cell(estadoRevisionPago)="row">
              <b-badge :variant="statusVariant(row.item.estadoRevisionPago || 'PENDIENTE')">
                {{ estadoLabel(row.item.estadoRevisionPago || 'PENDIENTE') }}
              </b-badge>
            </template>
            <template #cell(acciones)="row">
              <b-button size="sm" variant="link" class="text-primary" title="Ver detalle" aria-label="Ver detalle" :disabled="procesando" @click="abrirDetalle(row.item)">
                <b-icon-search />
              </b-button>
              <b-button size="sm" variant="outline-success" title="Aprobar" aria-label="Aprobar" :disabled="procesando" @click="revisarIndividual(row.item, 'APROBADO')">
                <b-icon-check-lg />
              </b-button>
              <b-button size="sm" variant="outline-danger" title="Rechazar" aria-label="Rechazar" :disabled="procesando" @click="revisarIndividual(row.item, 'RECHAZADO')">
                <b-icon-x font-scale="1.25" />
              </b-button>
            </template>
          </b-table>
          <ListPagination v-model="currentPage" :total-rows="fallecidosFiltrados.length" :per-page="perPage" />
        </b-card>

        <b-alert v-if="!puedeAprobar" show variant="info">
          Para aprobar el período deben estar aprobados todos los comprobantes individuales y el comprobante mensual.
        </b-alert>
        <div class="text-center mb-4">
          <b-button variant="secondary" to="/cementerio/solicitudes">Volver</b-button>
          <b-button variant="success" title="Aprobar período" aria-label="Aprobar período" :disabled="!puedeAprobar || procesando" @click="resolver('APROBADO')"><b-icon-check-lg /></b-button>
          <b-button variant="danger" title="Rechazar período" aria-label="Rechazar período" :disabled="procesando" @click="resolver('RECHAZADO')"><b-icon-x font-scale="1.25" /></b-button>
        </div>
      </template>
    </b-container>
    <DeceasedDetailModal v-model="showDetalle" :fallecido="fallecidoDetalle" />
  </div>
</template>

<script>
import PeriodSummary from '~/components/cementerio/PeriodSummary.vue'
import LoadingOverlay from '~/components/cementerio/LoadingOverlay.vue'
import ListPagination from '~/components/cementerio/ListPagination.vue'
import DeceasedDetailModal from '~/components/cementerio/DeceasedDetailModal.vue'
import { formatCurrency, formatPeriodLabel, getStatusVariant } from '~/utils/cementerio'

export default {
  components: { PeriodSummary, LoadingOverlay, ListPagination, DeceasedDetailModal },
  middleware: ['authenticated', 'recaudaciones'],
  data: () => ({
    loadError: '',
    procesando: false,
    mensajeEspera: 'Cargando la declaración jurada...',
    busqueda: '',
    condicion: '',
    estadoRevision: '',
    currentPage: 1,
    perPage: 10,
    showDetalle: false,
    fallecidoDetalle: null,
    fields: [
      { key: 'fallecido', label: 'Fallecido' },
      { key: 'importe', label: 'Condición / importe' },
      { key: 'comprobante', label: 'Comprobante' },
      { key: 'estadoRevisionPago', label: 'Revisión' },
      { key: 'acciones', label: '' },
    ],
  }),
  async fetch() {
    try {
      await this.$store.dispatch('cementerio/getPeriodo', { id: this.$route.params.id })
    } catch (error) {
      this.loadError = error.message || 'No se pudo cargar la declaración.'
    }
  },
  computed: {
    periodo() {
      return this.$store.state.cementerio.periodo
    },
    funerariaNombre() {
      return this.periodo && this.periodo.funeraria && this.periodo.funeraria.nombre || 'Funeraria'
    },
    puedeAprobar() {
      if (!this.periodo || this.periodo.estadoRevisionPagoMensual !== 'APROBADO') return false
      return (this.periodo.fallecidos || []).every(item => item.estadoRevisionPago === 'APROBADO')
    },
    fallecidosFiltrados() {
      const term = this.busqueda.trim().toLowerCase()
      return (this.periodo && this.periodo.fallecidos || []).filter(item => {
        const obito = item.obito || {}
        const searchable = [obito.nombre, obito.apellido, obito.numeroDocumento].filter(Boolean).join(' ').toLowerCase()
        return (!term || searchable.includes(term))
          && (!this.condicion || item.condicionPago === this.condicion)
          && (!this.estadoRevision || (item.estadoRevisionPago || 'PENDIENTE') === this.estadoRevision)
      })
    },
    fallecidosPaginados() {
      const start = (this.currentPage - 1) * this.perPage
      return this.fallecidosFiltrados.slice(start, start + this.perPage)
    },
    condicionOptions() {
      return [
        { value: '', text: 'Todas' },
        { value: 'PAGO', text: 'Pago' },
        { value: 'EXENTO', text: 'Exento' },
      ]
    },
    revisionOptions() {
      return [
        { value: '', text: 'Todos' },
        { value: 'PENDIENTE', text: 'Pendientes' },
        { value: 'APROBADO', text: 'Aprobados' },
        { value: 'RECHAZADO', text: 'Rechazados' },
      ]
    },
  },
  watch: {
    busqueda() {
      this.currentPage = 1
    },
    condicion() {
      this.currentPage = 1
    },
    estadoRevision() {
      this.currentPage = 1
    },
    fallecidosFiltrados(items) {
      this.currentPage = Math.min(this.currentPage, Math.max(1, Math.ceil(items.length / this.perPage)))
    },
  },
  methods: {
    moneda: formatCurrency,
    periodoLabel: formatPeriodLabel,
    statusVariant: getStatusVariant,
    notify(message, variant = 'success') {
      this.$bvToast.toast(message, { variant, solid: true, appendToast: true })
    },
    estadoLabel(value) {
      return String(value || '').replaceAll('_', ' ').toLowerCase()
    },
    nombreFallecido(item) {
      return [item.obito && item.obito.apellido, item.obito && item.obito.nombre].filter(Boolean).join(', ')
    },
    comprobanteUrl(item) {
      const doc = item.documentos && item.documentos.comprobantePagoTasa
      return doc && doc.url
    },
    abrirDetalle(item) {
      this.fallecidoDetalle = item
      this.showDetalle = true
    },
    async revisarIndividual(item, estado) {
      await this.runAction(
        `Guardando la revisión del comprobante de ${this.nombreFallecido(item)}...`,
        'La revisión individual fue guardada.',
        () => this.$store.dispatch('cementerio/revisarPago', {
          periodoId: this.periodo.id || this.periodo._id,
          fallecidoId: item.id || item._id,
          estado,
        }),
      )
    },
    async revisarMensual(estado) {
      await this.runAction(
        'Guardando la revisión del comprobante mensual...',
        'La revisión del comprobante mensual fue guardada.',
        () => this.$store.dispatch('cementerio/revisarPagoMensual', {
          periodoId: this.periodo.id || this.periodo._id,
          estado,
        }),
      )
    },
    async resolver(estado) {
      await this.runAction(
        estado === 'APROBADO' ? 'Aprobando el período...' : 'Rechazando el período...',
        estado === 'APROBADO' ? 'El período fue aprobado.' : 'El período fue rechazado.',
        () => this.$store.dispatch('cementerio/resolverPeriodo', {
          id: this.periodo.id || this.periodo._id,
          estado,
        }),
      )
    },
    async runAction(message, successMessage, action) {
      if (this.procesando) return
      this.procesando = true
      this.mensajeEspera = message
      try {
        await action()
        this.notify(successMessage)
        await this.$fetch()
      } catch (error) {
        this.notify(error.message || 'No se pudo completar la acción.', 'danger')
      } finally {
        this.procesando = false
      }
    },
  },
}
</script>
