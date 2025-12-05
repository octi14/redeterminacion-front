<template>
  <div class="page main-background">
    <Banner title="Certificados de defunción" subtitle="Uso interno" />
    <div class="col-10 mx-auto" v-if="adminCementerio">
      <b-row>
        <b-form-group class="col-4 mx-6 mx-auto mt-4" label-class="text-success h6">
          <label for="inputCUIT" class="bv-no-focus-ring col-form-label pt-0 text-success h6">
            <b-icon-search></b-icon-search> Buscar por CUIT
          </label>
          <b-form-input id="inputCUIT" v-model="inputCUIT" placeholder="Ingresá el CUIT" @input="filtrarPorCuit" type="text" />
        </b-form-group>
        <b-form-group class="col-4 mx-6 mx-auto mt-4" label-class="text-success h6">
          <label for="selectedEstado" class="bv-no-focus-ring col-form-label pt-0 text-success h6"><b-icon-funnel-fill></b-icon-funnel-fill> Filtrar por Estado</label>
          <b-form-select plain v-model="selectedEstado">
            <option value="">Todos</option>
            <option v-for="estado in estados" :value="estado" :key="estado">{{ estado }}</option>
          </b-form-select>
        </b-form-group>
      </b-row>
      <b-form-checkbox class="text-center" v-model="hideFinalizados">Ocultar Finalizados/Rechazados</b-form-checkbox>
    </div>

    <b-table per-page="10" head-row-variant="warning" class="col-md-10 white col-sm-8 mx-auto mt-4 shadow-card" :items="paginatedItems" :fields="fields">
      <template #cell(estado)="row">
        <div :class="row.item.estadoColor"><b>{{ row.value }}</b></div>
      </template>
    </b-table>
    <b-pagination class="mt-4" :total-rows="filteredItems.length" :per-page="perPage" v-model="currentPage" align="center" @input="onPageChange"></b-pagination>
  </div>
</template>

<script>
export default{
  middleware: ['authenticated'],
  data() {
    return {
      hideFinalizados: false,
      inputCUIT: "",
      items: [],
      selectedEstado: '',
      currentPage: 1,
      perPage: 10,
      fields: [
        { key: 'createdAt', label: 'Fecha de solicitud' },
        { key: 'cuit', label: 'CUIT funeraria' },
        { key: 'responsable', label: 'Responsable' },
        { key: 'mail', label: 'Mail' },
        { key: 'estado', label: 'Estado' },
      ],
      estados: ['Rechazada','En revisión', 'Aprobada']
    };
  },
  async fetch() {
    await this.$store.dispatch('cementerio/getAll')
    this.items = this.certificados
    this.items?.forEach(item => {
      switch (item.estado) {
        case 'En revisión': item.estadoColor = 'text-primary'; break;
        case 'Rechazada': item.estadoColor = 'text-danger'; break;
        case 'Aprobada': item.estadoColor = 'text-darkgreen'; break;
        default: item.estadoColor = 'text-secondary';
      }
    });
  },
  computed: {
    certificados(){
      return this.$store.state.cementerio.all
    },
    paginatedItems() {
      if (!this.filteredItems || this.filteredItems.length === 0) return [];
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredItems.slice(start, end);
    },
    filteredItems() {
      let items = this.items;
      if (this.hideFinalizados) {
        items = items.filter(item => !["Rechazada", "Finalizada"].includes(item.estado));
      }
      if (this.inputCUIT) {
        items = items.filter(item => item.cuit && String(item.cuit).includes(this.inputCUIT));
      }
      if (this.selectedEstado) {
        items = items.filter(item => item.estado === this.selectedEstado);
      }
      return items;
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.perPage);
    },
    adminCementerio() {
      return this.$store.state.user.admin === "cementerio" || this.$store.state.user.admin == "master"
    },
  },
  methods: {
    onPageChange(newPage) {
      this.currentPage = newPage;
    },
  },
}
</script>



