<template>
  <b-modal :visible="value" size="lg" title="Detalle del fallecido y comprobante" hide-footer @input="$emit('input', $event)">
    <template v-if="fallecido">
      <b-row>
        <b-col md="6"><Detail label="Fallecido" :value="nombreFallecido" /></b-col>
        <b-col md="6"><Detail label="Documento" :value="documento" /></b-col>
        <b-col md="6"><Detail label="Fecha de defunción" :value="fechaDefuncion" /></b-col>
        <b-col md="6"><Detail label="Tipo de sepultura" :value="sepultura" /></b-col>
        <b-col md="6"><Detail label="Condición" :value="condicion" /></b-col>
        <b-col md="6"><Detail label="Importe" :value="importe" /></b-col>
        <b-col md="6">
          <Detail label="Estado de revisión">
            <b-badge :variant="statusVariant(fallecido.estadoRevisionPago || 'PENDIENTE')">
              {{ estadoLabel(fallecido.estadoRevisionPago || 'PENDIENTE') }}
            </b-badge>
          </Detail>
        </b-col>
        <b-col md="6">
          <Detail label="Comprobante de pago o exención">
            <a v-if="comprobanteUrl" :href="comprobanteUrl" target="_blank" title="Ver archivo" aria-label="Ver archivo"><b-icon-file-earmark-text font-scale="1.25" /></a>
            <span v-else class="text-muted">Sin archivo</span>
          </Detail>
        </b-col>
        <b-col cols="12" v-if="fallecido.observacionRevisionPago">
          <Detail label="Observación de revisión" :value="fallecido.observacionRevisionPago" />
        </b-col>
      </b-row>
      <div class="text-right mt-3">
        <b-button variant="secondary" @click="$emit('input', false)">Cerrar</b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { TIPOS_SEPULTURA } from '~/config/cementerio'
import { formatCurrency, getStatusVariant } from '~/utils/cementerio'
import Detail from '~/components/cementerio/DetailField.vue'

export default {
  components: { Detail },
  props: {
    value: { type: Boolean, default: false },
    fallecido: { type: Object, default: null },
  },
  computed: {
    nombreFallecido() {
      const obito = this.fallecido && this.fallecido.obito || {}
      return [obito.apellido, obito.nombre].filter(Boolean).join(', ')
    },
    documento() {
      const obito = this.fallecido && this.fallecido.obito || {}
      return [obito.tipoDocumento, obito.numeroDocumento].filter(Boolean).join(' ')
    },
    fechaDefuncion() {
      const value = this.fallecido && this.fallecido.obito && this.fallecido.obito.fechaDefuncion
      return value ? new Date(value).toLocaleDateString('es-AR') : '-'
    },
    sepultura() {
      const value = this.fallecido && this.fallecido.tipoSepultura
      return (TIPOS_SEPULTURA.find(tipo => tipo.value === value) || {}).text || value
    },
    condicion() {
      return this.fallecido && this.fallecido.condicionPago === 'EXENTO' ? 'Exento' : 'Pago'
    },
    importe() {
      const amount = this.fallecido && this.fallecido.condicionPago === 'EXENTO' ? 0 : this.fallecido && this.fallecido.precioAplicado
      return formatCurrency(amount)
    },
    comprobanteUrl() {
      const doc = this.fallecido && this.fallecido.documentos && this.fallecido.documentos.comprobantePagoTasa
      return doc && doc.url
    },
  },
  methods: {
    statusVariant: getStatusVariant,
    estadoLabel(value) {
      return String(value || '').replaceAll('_', ' ').toLowerCase()
    },
  },
}
</script>
