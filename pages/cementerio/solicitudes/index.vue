<template>
  <div class="page main-background">
    <Banner title="Certificados de defunción" subtitle="Uso interno" />
    <div class="internal-use-toolbar" v-if="adminCementerio">
      <b-row>
        <b-form-group class="col-4 mx-6 mx-auto mt-4" label-class="text-success h6">
          <label for="inputCUIT" class="bv-no-focus-ring col-form-label pt-0 text-success h6">
            <i class="bi bi-search"></i> Buscar por CUIT
          </label>
          <b-form-input id="inputCUIT" v-model="inputCUIT" placeholder="Ingresá el CUIT" @input="filtrarPorCuit" type="text" />
        </b-form-group>
        <b-form-group class="col-4 mx-6 mx-auto mt-4" label-class="text-success h6">
          <label for="selectedEstado" class="bv-no-focus-ring col-form-label pt-0 text-success h6"><i class="bi bi-funnel-fill"></i> Filtrar por Estado</label>
          <b-form-select plain v-model="selectedEstado">
            <option value="">Todos</option>
            <option v-for="estado in estados" :value="estado" :key="estado">{{ estado }}</option>
          </b-form-select>
        </b-form-group>
      </b-row>
      <b-form-checkbox class="text-center" v-model="hideFinalizados">Ocultar Finalizados/Rechazados</b-form-checkbox>
    </div>

    <b-table
      per-page="10"
      head-row-variant="warning"
      class="internal-use-table white mt-4 shadow-card"
      :items="paginatedItems"
      :fields="fields"
      :busy="loading"
    >
      <template #table-busy>
        <LoadingState text="Cargando..." variant="primary" />
      </template>
      <template #cell(estado)="row">
        <div :class="row.item.estadoColor"><b>{{ row.value }}</b></div>
      </template>
      <template #cell(detalles)="row">
        <NuxtLink :to="`/cementerio/solicitudes/${row.item.id}`">
          <b-button variant="outline-secondary" size="sm" title="Editar">
            <i class="bi bi-pen"></i>
          </b-button>
        </NuxtLink>
      </template>
    </b-table>
    <b-pagination v-if="!loading" class="mt-4" :total-rows="filteredItems.length" :per-page="perPage" v-model="currentPage" align="center" @input="onPageChange"></b-pagination>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['authenticated', 'require-admin'],
  adminRoles: ['cementerio', 'master'],
})
</script>

<script>
export default{
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
        { key: 'detalles' },
      ],
      estados: ['Rechazada','En revisión', 'Aprobada'],
      loading: true,
    };
  },
  async mounted() {
    await this.loadSolicitudes()
  },
  computed: {
    certificados(){
      return useCementerioStore().all
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
        // En Cementerio los "finalizados" son los que ya fueron aprobados o rechazados.
        items = items.filter(item => !["Rechazada", "Aprobada", "Finalizada"].includes(item.estado));
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
      const admin = useUserStore().admin
      return admin === "cementerio" || admin == "master"
    },
  },
  methods: {
    async loadSolicitudes() {
      this.loading = true
      try {
        await useCementerioStore().getAll()
        this.items = this.certificados
        this.items?.forEach(item => {
          switch (item.estado) {
            case 'En revisión': item.estadoColor = 'text-primary'; break;
            case 'Rechazada': item.estadoColor = 'text-danger'; break;
            case 'Aprobada': item.estadoColor = 'text-darkgreen'; break;
            default: item.estadoColor = 'text-secondary';
          }
        });
      } finally {
        this.loading = false
      }
    },
    filtrarPorCuit() {
      this.currentPage = 1
    },
    onPageChange(newPage) {
      this.currentPage = newPage;
    },
  },
}
</script>



