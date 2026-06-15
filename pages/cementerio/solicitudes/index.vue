<template>
  <div class="page main-background">
    <Banner title="Declaraciones juradas de cementerio" subtitle="Recaudaciones" />
    <LoadingOverlay :show="$fetchState.pending" message="Cargando declaraciones para revisión..." />
    <b-container class="py-4">
      <b-alert v-if="loadError" show variant="danger">{{ loadError }}</b-alert>
      <b-card class="shadow-card mb-4">
        <b-row>
          <b-col md="6">
            <b-form-group label="Buscar declaración">
              <b-form-input v-model="busqueda" placeholder="Funeraria, CUIT o período" />
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Estado">
              <b-form-select v-model="estado" :options="estados" />
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Año">
              <b-form-select v-model="anio" :options="anioOptions" />
            </b-form-group>
          </b-col>
        </b-row>
      </b-card>
      <b-table
        responsive
        hover
        striped
        class="shadow-card white"
        :items="paginados"
        :fields="fields"
        show-empty
        empty-text="No hay declaraciones para revisar."
      >
        <template #cell(periodo)="row">{{ periodoLabel(row.item) }}</template>
        <template #cell(funeraria)="row">{{ funeraria(row.item) }}</template>
        <template #cell(total)="row">{{ moneda(row.item.total) }}</template>
        <template #cell(estado)="row">
          <b-badge :variant="statusVariant(row.item.estado)">{{ estadoLabel(row.item.estado) }}</b-badge>
        </template>
        <template #cell(detalle)="row">
          <b-button size="sm" variant="link" class="text-primary" title="Ver detalle" aria-label="Ver detalle" @click="abrirDetalle(row.item)">
            <b-icon-search />
          </b-button>
          <b-button size="sm" variant="outline-primary" :to="`/cementerio/solicitudes/${row.item.id || row.item._id}`">
            Revisar
          </b-button>
        </template>
      </b-table>
      <ListPagination v-model="currentPage" :total-rows="filtrados.length" :per-page="perPage" />
    </b-container>
    <DeclarationDetailModal v-model="showDetalle" :periodo="periodoDetalle" />
  </div>
</template>

<script>
import { formatCurrency, formatPeriodLabel, getStatusVariant } from '~/utils/cementerio'
import LoadingOverlay from '~/components/cementerio/LoadingOverlay.vue'
import ListPagination from '~/components/cementerio/ListPagination.vue'
import DeclarationDetailModal from '~/components/cementerio/DeclarationDetailModal.vue'

export default {
  components: { LoadingOverlay, ListPagination, DeclarationDetailModal },
  middleware: ['authenticated', 'recaudaciones'],
  data: () => ({
    loadError: '',
    busqueda: '',
    estado: 'EN_PROCESO',
    anio: '',
    currentPage: 1,
    perPage: 10,
    showDetalle: false,
    periodoDetalle: null,
    estados: [
      { value: '', text: 'Todos' },
      { value: 'EN_PROCESO', text: 'En proceso' },
      { value: 'APROBADO', text: 'Aprobados' },
      { value: 'RECHAZADO', text: 'Rechazados' },
    ],
    fields: [
      { key: 'periodo', label: 'Período' },
      { key: 'funeraria', label: 'Funeraria' },
      { key: 'cantidadFallecidos', label: 'Fallecidos' },
      { key: 'total', label: 'Total declarado' },
      { key: 'estado', label: 'Estado' },
      { key: 'detalle', label: '' },
    ],
  }),
  async fetch() {
    try {
      await this.$store.dispatch('cementerio/getPeriodos')
    } catch (error) {
      this.loadError = error.message || 'No se pudieron cargar las declaraciones.'
    }
  },
  computed: {
    periodos() {
      return (this.$store.state.cementerio.periodos || []).map(periodo => ({
        ...periodo,
        cantidadFallecidos: periodo.cantidadFallecidos || (periodo.fallecidos || []).length,
      }))
    },
    filtrados() {
      const term = this.busqueda.trim().toLowerCase()
      return this.periodos.filter(periodo => {
        const matchesEstado = !this.estado || periodo.estado === this.estado
        const matchesAnio = !this.anio || periodo.anio === this.anio
        const searchable = [this.funeraria(periodo), this.periodoLabel(periodo)].join(' ').toLowerCase()
        const matchesBusqueda = !term || searchable.includes(term)
        return matchesEstado && matchesAnio && matchesBusqueda
      })
    },
    paginados() {
      const start = (this.currentPage - 1) * this.perPage
      return this.filtrados.slice(start, start + this.perPage)
    },
    anioOptions() {
      const years = [...new Set(this.periodos.map(periodo => periodo.anio).filter(Boolean))].sort((a, b) => b - a)
      return [{ value: '', text: 'Todos' }, ...years.map(value => ({ value, text: String(value) }))]
    },
  },
  watch: {
    busqueda() {
      this.currentPage = 1
    },
    estado() {
      this.currentPage = 1
    },
    anio() {
      this.currentPage = 1
    },
    filtrados(items) {
      this.currentPage = Math.min(this.currentPage, Math.max(1, Math.ceil(items.length / this.perPage)))
    },
  },
  methods: {
    moneda: formatCurrency,
    periodoLabel: formatPeriodLabel,
    statusVariant: getStatusVariant,
    funeraria(periodo) {
      const item = periodo.funeraria || {}
      return [item.nombre, item.cuit].filter(Boolean).join(' - ') || 'Sin funeraria'
    },
    estadoLabel(value) {
      return String(value || '').replaceAll('_', ' ').toLowerCase()
    },
    abrirDetalle(periodo) {
      this.periodoDetalle = periodo
      this.showDetalle = true
    },
  },
}
</script>
