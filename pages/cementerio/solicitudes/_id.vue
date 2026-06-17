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
          <div class="monthly-payment-row">
            <strong>Comprobante de pago:</strong>
            <FilePreview v-if="comprobanteMensualUrl" :url="comprobanteMensualUrl" title="Comprobante de pago mensual" />
            <span v-else class="text-danger">No se recibio un comprobante mensual.</span>
            <div class="monthly-payment-row__actions">
              <b-button size="sm" :variant="revisionMensualButtonVariant('APROBADO')" :class="revisionMensualButtonClass('APROBADO')" :title="revisionMensualButtonTitle('APROBADO')" :aria-label="revisionMensualButtonTitle('APROBADO')" :disabled="procesando" @click="revisarMensual('APROBADO')"><b-icon-check-lg /></b-button>
              <b-button size="sm" :variant="revisionMensualButtonVariant('RECHAZADO')" :class="revisionMensualButtonClass('RECHAZADO')" :title="revisionMensualButtonTitle('RECHAZADO')" :aria-label="revisionMensualButtonTitle('RECHAZADO')" :disabled="procesando" @click="revisarMensual('RECHAZADO')"><b-icon-x font-scale="1.25" /></b-button>
            </div>
          </div>
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
            <template #cell(fechaDefuncion)="row">{{ fechaDefuncion(row.item) }}</template>
            <template #cell(fallecido)="row">{{ nombreFallecido(row.item) }}</template>
            <template #cell(importe)="row">
              <b-badge v-if="row.item.condicionPago === 'EXENTO'" variant="info">Exento</b-badge>
              <span v-else>{{ moneda(row.item.precioAplicado) }}</span>
            </template>
            <template #cell(comprobante)="row">
              <FilePreview v-if="comprobanteUrl(row.item)" :url="comprobanteUrl(row.item)" title="Comprobante de pago o exencion" />
              <span v-else class="text-danger">Sin archivo</span>
            </template>
            <template #cell(certificadoDefuncion)="row">
              <FilePreview v-if="certificadoDefuncionUrl(row.item)" :url="certificadoDefuncionUrl(row.item)" title="Certificado de defuncion" icon="file-earmark-medical" />
              <span v-else class="text-danger">Sin archivo</span>
            </template>
            <template #cell(acciones)="row">
              <b-button size="sm" variant="link" class="text-primary" title="Ver detalle" aria-label="Ver detalle" :disabled="procesando" @click="abrirDetalle(row.item)">
                <b-icon-search />
              </b-button>
              <b-button size="sm" :variant="revisionButtonVariant(row.item, 'APROBADO')" :class="revisionButtonClass(row.item, 'APROBADO')" :title="revisionButtonTitle(row.item, 'APROBADO')" :aria-label="revisionButtonTitle(row.item, 'APROBADO')" :disabled="procesando" @click="revisarIndividual(row.item, 'APROBADO')">
                <b-icon-check-lg />
              </b-button>
              <b-button size="sm" :variant="revisionButtonVariant(row.item, 'RECHAZADO')" :class="revisionButtonClass(row.item, 'RECHAZADO')" :title="revisionButtonTitle(row.item, 'RECHAZADO')" :aria-label="revisionButtonTitle(row.item, 'RECHAZADO')" :disabled="procesando" @click="revisarIndividual(row.item, 'RECHAZADO')">
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
import FilePreview from '~/components/common/FilePreview.vue'
import { formatCurrency, formatPeriodLabel, getStatusVariant } from '~/utils/cementerio'

export default {
  components: { PeriodSummary, LoadingOverlay, ListPagination, DeceasedDetailModal, FilePreview },
  middleware: ['authenticated', 'cementerioRecaudaciones'],
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
      { key: 'fechaDefuncion', label: 'Fecha defuncion' },
      { key: 'fallecido', label: 'Fallecido' },
      { key: 'importe', label: 'Condición / importe' },
      { key: 'comprobante', label: 'Comprobante' },
      { key: 'certificadoDefuncion', label: 'Certificado' },
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
    comprobanteMensualUrl() {
      return this.periodo && this.periodo.comprobantePagoMensual && this.periodo.comprobantePagoMensual.url
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
      }).sort(this.sortByNewest)
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
    fechaDefuncion(item) {
      const value = item && item.obito && item.obito.fechaDefuncion
      return value ? new Date(value).toLocaleDateString('es-AR') : '-'
    },
    comprobanteUrl(item) {
      const doc = item && item.documentos && item.documentos.comprobantePagoTasa
      return doc && doc.url
    },
    certificadoDefuncionUrl(item) {
      const doc = item && item.documentos && item.documentos.certificadoDefuncion
      return doc && doc.url
    },
    revisionButtonVariant(item, estado) {
      const actual = item.estadoRevisionPago || 'PENDIENTE'
      if (actual === estado) return estado === 'APROBADO' ? 'success' : 'danger'
      if (actual === 'PENDIENTE') return estado === 'APROBADO' ? 'outline-success' : 'outline-danger'
      return 'outline-secondary'
    },
    revisionButtonClass(item, estado) {
      const actual = item.estadoRevisionPago || 'PENDIENTE'
      return {
        'revision-button--pending': actual === 'PENDIENTE',
        'revision-button--inactive': actual !== 'PENDIENTE' && actual !== estado,
      }
    },
    revisionButtonTitle(item, estado) {
      const actual = item.estadoRevisionPago || 'PENDIENTE'
      const accion = estado === 'APROBADO' ? 'Aprobar' : 'Rechazar'
      if (actual === 'PENDIENTE') return `${accion} - pendiente de revision`
      if (actual === estado) return estado === 'APROBADO' ? 'Aprobado' : 'Rechazado'
      return `${accion} - ya marcado como ${this.estadoLabel(actual)}`
    },
    revisionMensualButtonVariant(estado) {
      const actual = this.periodo.estadoRevisionPagoMensual || 'PENDIENTE'
      if (actual === estado) return estado === 'APROBADO' ? 'success' : 'danger'
      if (actual === 'PENDIENTE') return estado === 'APROBADO' ? 'outline-success' : 'outline-danger'
      return 'outline-secondary'
    },
    revisionMensualButtonClass(estado) {
      const actual = this.periodo.estadoRevisionPagoMensual || 'PENDIENTE'
      return {
        'revision-button--pending': actual === 'PENDIENTE',
        'revision-button--inactive': actual !== 'PENDIENTE' && actual !== estado,
      }
    },
    revisionMensualButtonTitle(estado) {
      const actual = this.periodo.estadoRevisionPagoMensual || 'PENDIENTE'
      const accion = estado === 'APROBADO' ? 'Aprobar' : 'Rechazar'
      if (actual === 'PENDIENTE') return `${accion} - pendiente de revision`
      if (actual === estado) return estado === 'APROBADO' ? 'Aprobado' : 'Rechazado'
      return `${accion} - ya marcado como ${this.estadoLabel(actual)}`
    },
    sortByNewest(a, b) {
      return this.itemDateValue(b) - this.itemDateValue(a)
    },
    itemDateValue(item) {
      const value = item && (item.createdAt || item.fechaCreacion || item._id)
      if (!value) return 0
      const date = new Date(value)
      if (!Number.isNaN(date.getTime())) return date.getTime()
      if (typeof value === 'string' && value.length >= 8) {
        return parseInt(value.substring(0, 8), 16) * 1000 || 0
      }
      return 0
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

<style scoped>
.monthly-payment-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  border-top: 1px solid #e9ecef;
  margin-top: 0.75rem;
  padding-top: 0.85rem;
}

.monthly-payment-row__actions {
  display: flex;
  gap: 0.35rem;
  margin-left: auto;
}

.revision-button--pending {
  background-color: #fff;
}

.revision-button--inactive {
  opacity: 0.45;
}

@media (max-width: 768px) {
  .monthly-payment-row {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .monthly-payment-row__actions {
    margin-left: 0;
    width: 100%;
  }
}
</style>
