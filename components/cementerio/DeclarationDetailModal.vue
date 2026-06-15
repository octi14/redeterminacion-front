<template>
  <b-modal :visible="value" size="xl" title="Detalle de declaración jurada" hide-footer @input="$emit('input', $event)">
    <template v-if="periodo">
      <b-row align-v="center" class="mb-3">
        <b-col>
          <h4 class="text-success mb-1">{{ funerariaNombre }}</h4>
          <div>Período {{ periodoLabel(periodo) }}</div>
          <small class="text-muted">{{ fecha(periodo.fechaInicio) }} al {{ fecha(periodo.fechaFin) }}</small>
        </b-col>
        <b-col cols="auto">
          <b-badge :variant="statusVariant(periodo.estado)" pill>{{ estadoLabel(periodo.estado) }}</b-badge>
        </b-col>
      </b-row>

      <PeriodSummary :periodo="periodo" />

      <b-card class="mb-3" body-class="py-3">
        <b-row align-v="center">
          <b-col>
            <strong>Comprobante mensual:</strong>
            <a v-if="comprobanteMensualUrl" :href="comprobanteMensualUrl" target="_blank" title="Ver archivo" aria-label="Ver archivo"><b-icon-file-earmark-text font-scale="1.25" /></a>
            <span v-else class="text-muted">Sin archivo</span>
          </b-col>
          <b-col cols="auto">
            <b-badge :variant="statusVariant(periodo.estadoRevisionPagoMensual || 'PENDIENTE')">
              {{ estadoLabel(periodo.estadoRevisionPagoMensual || 'PENDIENTE') }}
            </b-badge>
          </b-col>
        </b-row>
      </b-card>

      <h5 class="text-success">Detalle de fallecidos</h5>
      <b-table responsive hover striped :items="fallecidosPaginados" :fields="fields" show-empty empty-text="Sin fallecidos">
        <template #cell(fallecido)="row">{{ nombreFallecido(row.item) }}</template>
        <template #cell(documento)="row">{{ documento(row.item) }}</template>
        <template #cell(tipoSepultura)="row">{{ sepulturaLabel(row.item.tipoSepultura) }}</template>
        <template #cell(importe)="row">
          <b-badge v-if="row.item.condicionPago === 'EXENTO'" variant="info">Exento</b-badge>
          <span v-else>{{ moneda(row.item.precioAplicado) }}</span>
        </template>
        <template #cell(estadoRevisionPago)="row">
          <b-badge :variant="statusVariant(row.item.estadoRevisionPago || 'PENDIENTE')">
            {{ estadoLabel(row.item.estadoRevisionPago || 'PENDIENTE') }}
          </b-badge>
        </template>
        <template #cell(comprobante)="row">
          <a v-if="comprobanteUrl(row.item)" :href="comprobanteUrl(row.item)" target="_blank" title="Ver archivo" aria-label="Ver archivo"><b-icon-file-earmark-text font-scale="1.25" /></a>
          <span v-else class="text-muted">Sin archivo</span>
        </template>
        <template #cell(acciones)="row">
          <b-button size="sm" variant="link" class="text-primary" title="Ver detalle" aria-label="Ver detalle" @click="abrirDetalleFallecido(row.item)">
            <b-icon-search />
          </b-button>
        </template>
      </b-table>
      <ListPagination v-model="currentPage" :total-rows="fallecidos.length" :per-page="perPage" />

      <div class="text-right mt-4">
        <b-button variant="secondary" @click="$emit('input', false)">Cerrar</b-button>
      </div>
    </template>
    <DeceasedDetailModal v-model="showDetalleFallecido" :fallecido="fallecidoDetalle" />
  </b-modal>
</template>

<script>
import { TIPOS_SEPULTURA } from '~/config/cementerio'
import { formatCurrency, formatPeriodLabel, getStatusVariant } from '~/utils/cementerio'
import PeriodSummary from '~/components/cementerio/PeriodSummary.vue'
import ListPagination from '~/components/cementerio/ListPagination.vue'
import DeceasedDetailModal from '~/components/cementerio/DeceasedDetailModal.vue'

export default {
  components: { PeriodSummary, ListPagination, DeceasedDetailModal },
  props: {
    value: { type: Boolean, default: false },
    periodo: { type: Object, default: null },
  },
  data: () => ({
    currentPage: 1,
    perPage: 10,
    showDetalleFallecido: false,
    fallecidoDetalle: null,
    fields: [
      { key: 'fallecido', label: 'Fallecido' },
      { key: 'documento', label: 'Documento' },
      { key: 'tipoSepultura', label: 'Sepultura' },
      { key: 'importe', label: 'Condición / importe' },
      { key: 'estadoRevisionPago', label: 'Revisión' },
      { key: 'comprobante', label: 'Comprobante' },
      { key: 'acciones', label: '' },
    ],
  }),
  computed: {
    fallecidos() {
      return this.periodo && this.periodo.fallecidos || []
    },
    fallecidosPaginados() {
      const start = (this.currentPage - 1) * this.perPage
      return this.fallecidos.slice(start, start + this.perPage)
    },
    funerariaNombre() {
      const funeraria = this.periodo && this.periodo.funeraria || {}
      return [funeraria.nombre, funeraria.cuit].filter(Boolean).join(' - ') || 'Funeraria'
    },
    comprobanteMensualUrl() {
      return this.periodo && this.periodo.comprobantePagoMensual && this.periodo.comprobantePagoMensual.url
    },
  },
  watch: {
    periodo() {
      this.currentPage = 1
      this.showDetalleFallecido = false
      this.fallecidoDetalle = null
    },
    value(show) {
      if (show) {
        this.currentPage = 1
      } else {
        this.showDetalleFallecido = false
        this.fallecidoDetalle = null
      }
    },
  },
  methods: {
    moneda: formatCurrency,
    periodoLabel: formatPeriodLabel,
    statusVariant: getStatusVariant,
    fecha(value) {
      return value ? new Date(value).toLocaleDateString('es-AR') : '-'
    },
    estadoLabel(value) {
      return String(value || '').replaceAll('_', ' ').toLowerCase()
    },
    nombreFallecido(item) {
      return [item.obito && item.obito.apellido, item.obito && item.obito.nombre].filter(Boolean).join(', ')
    },
    documento(item) {
      const obito = item.obito || {}
      return [obito.tipoDocumento, obito.numeroDocumento].filter(Boolean).join(' ')
    },
    sepulturaLabel(value) {
      return (TIPOS_SEPULTURA.find(tipo => tipo.value === value) || {}).text || value
    },
    comprobanteUrl(item) {
      const doc = item.documentos && item.documentos.comprobantePagoTasa
      return doc && doc.url
    },
    abrirDetalleFallecido(item) {
      this.fallecidoDetalle = item
      this.showDetalleFallecido = true
    },
  },
}
</script>
