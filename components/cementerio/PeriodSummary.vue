<template>
  <b-row>
    <b-col md="4" class="mb-2">
      <div class="summary-box">
        <small>Fallecidos</small>
        <strong>{{ fallecidos.length }}</strong>
      </div>
    </b-col>
    <b-col md="4" class="mb-2">
      <div class="summary-box">
        <small>Exentos</small>
        <strong>{{ exentos }}</strong>
      </div>
    </b-col>
    <b-col md="4" class="mb-2">
      <div class="summary-box">
        <small>Total a abonar</small>
        <strong>{{ moneda(total) }}</strong>
      </div>
    </b-col>
    <b-col cols="12" class="mt-2">
      <b-table small responsive :items="detalle" :fields="fields" show-empty empty-text="Sin ingresos">
        <template #cell(total)="row">{{ moneda(row.item.total) }}</template>
      </b-table>
    </b-col>
  </b-row>
</template>

<script>
import { TIPOS_SEPULTURA } from '~/config/cementerio'
import { formatCurrency } from '~/utils/cementerio'

export default {
  props: {
    periodo: { type: Object, required: true },
  },
  data: () => ({
    fields: [
      { key: 'tipo', label: 'Tipo de sepultura' },
      { key: 'pagos', label: 'Pagos' },
      { key: 'exentos', label: 'Exentos' },
      { key: 'total', label: 'Subtotal' },
    ],
  }),
  computed: {
    fallecidos() {
      return this.periodo.fallecidos || []
    },
    exentos() {
      return this.fallecidos.filter(item => item.condicionPago === 'EXENTO').length
    },
    total() {
      return this.periodo.total !== undefined
        ? this.periodo.total
        : this.fallecidos.reduce((total, item) => total + (item.condicionPago === 'EXENTO' ? 0 : Number(item.precioAplicado || 0)), 0)
    },
    detalle() {
      return TIPOS_SEPULTURA.map(tipo => {
        const items = this.fallecidos.filter(item => item.tipoSepultura === tipo.value)
        const pagos = items.filter(item => item.condicionPago !== 'EXENTO')
        return {
          tipo: tipo.text,
          pagos: pagos.length,
          exentos: items.length - pagos.length,
          total: pagos.reduce((total, item) => total + Number(item.precioAplicado || tipo.precio), 0),
        }
      })
    },
  },
  methods: { moneda: formatCurrency },
}
</script>

<style scoped>
.summary-box {
  background: #f4f8f4;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}
.summary-box strong { color: #0c681a; font-size: 1.35rem; }
</style>
