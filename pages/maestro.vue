<template>
  <div class="page main-background">
    <Banner title="Maestro comercial"/>
    <div class="form mx-auto mt-5">
      <b-form-group class="col-5 mx-6 mx-auto mt-4" label-class="text-success h6">
        <label for="inputCUIT" class="bv-no-focus-ring col-form-label pt-0 text-success h6">
          <b-icon-search></b-icon-search> Buscar por CUIT
        </label>
        <b-form-input
          id="inputCUIT"
          v-model="inputCUIT"
          placeholder="Ingresá un CUIT"
          @input="filtrarPorCUIT"
          type="text"
        />
      </b-form-group>
      <span class="text-center">Cargar maestro</span>
      <b-form class="col justify-content-center">
        <b-form-file v-model="file" class="row col-4 mx-auto" accept="csv" type="file" placeholder="No has seleccionado un archivo." @change="handleFileUpload"/>
        <b-button @click="onSubirMaestro" variant="success" class="mt-4">Subir archivo</b-button>
      </b-form>
    </div>
    <b-table per-page="10" head-row-variant="warning" class="col-md-10 white col-sm-8 mx-auto mt-4 shadow-card" :items="paginatedItems" :fields="fields">
      <template #cell(detalles)="row">
        <b-button variant="outline-secondary" size="sm" title="Editar" @click="editarMaestro(row.item)">
          <b-icon-pen size="sm"/>
        </b-button>
      </template>
    </b-table>
    <b-pagination class="mt-4" :total-rows="filteredItems.length" :per-page="perPage" v-model="currentPage" align="center" @input="onPageChange"></b-pagination>

    <b-modal id="modalEditarMaestro" hide-header-close v-model="editing" header-bg-variant="secondary" title="Editar maestro comercial" title-class="h5 text-light mx-auto" hide-footer centered>
      <MaestroComercialForm
        v-if="editing"
        v-on:show="fetch"
        :item="editarItem"
        :create="false"
        @submit="onSubmitEditMaestro"
        @reset="editing = false"
      ></MaestroComercialForm>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      file: null,
      currentPage: 1,
      perPage: 10,
      editing: false,
      inputCUIT: '',
      fields: [
        { key: 'cuit', label: 'CUIT' },
        { key: 'legajo', label: 'Legajo comercial' },
        { key: 'telefono', label: 'Número de teléfono' },
        { key: 'denominacion', label: 'Denominación' },
        { key: 'mail', label: 'Mail' },
        { key: 'titular', label: 'Titular' },
        { key: 'dfe', label: 'DFE' },
        { key: 'detalles' }
      ],
    };
  },
  async fetch() {
    await this.$store.dispatch('maestro/get');
  },
  computed: {
    maestro() {
      return this.$store.state.maestro.all;
    },
    filteredItems() {
      let items = this.maestro;

      if (this.inputCUIT) {
        items = items.filter(item => item.cuit && String(item.cuit).includes(this.inputCUIT));
      }

      return items;
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = this.currentPage * this.perPage;
      return this.filteredItems.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.perPage);
    }
  },
  methods: {
    editarMaestro(item) {
      this.$bvModal.show('modalEditarMaestro');
      this.editarItem = item;
    },
    onPageChange(newPage) {
      this.currentPage = newPage;
    },
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    async onSubirMaestro() {
      const userToken = this.$store.state.user.token;
      const file = await this.readFileContent(this.file);

      await this.$store.dispatch('maestro/create', { file });
    },
    async readFileContent(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target.result);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsText(file);
      });
    },
    filtrarPorCUIT() {
      this.currentPage = 1;
    }
  }
};
</script>
