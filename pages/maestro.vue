<template>
  <div class="page main-background">
    <Banner title="Maestro comercial"/>
    <div class="form mx-auto mt-5">
      <span class="text-center">Cargar maestro</span>
      <b-form class="col justify-content-center" >
        <b-form-file v-model="file" class="row col-4 mx-auto" accept="csv" type="file" placeholder="No has seleccionado un archivo." @change="handleFileUpload"/>
        <b-button @click="onSubirMaestro" variant="success" class="mt-4">Subir archivo</b-button>
      </b-form>
    </div>
    <b-table per-page="10" head-row-variant="warning" class="col-md-10 white col-sm-8 mx-auto mt-4 shadow-card" :items="paginatedMaestro" :fields="fields">
    </b-table>
    <b-pagination class="mt-4" :total-rows="maestro.length" :per-page="perPage" v-model="currentPage" align="center" @input="onPageChange"></b-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      file: null,
      currentPage: 1,
      perPage: 10,
      fields: [
        {
          key: 'cuit',
          label: 'CUIT'
        },
        {
          key: 'legajo',
          label: 'Legajo comercial',
        },
        {
          key: 'telefono',
          label: 'Número de teléfono',
        },
        {
          key: 'denominacion',
          label: 'Denominación',
        },
        {
          key: 'mail',
          label: 'Mail',
        },
        {
          key: 'titular',
          label: 'Titular',
        },
        {
          key: 'dfe',
          label: 'DFE',
        },
      ],
    };
  },
  computed: {
    maestro(){
      return this.$store.state.maestro.all
    },
    paginatedMaestro() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.maestro.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.maestro.length / this.perPage);
    },
  },
  async fetch(){
    await this.$store.dispatch('maestro/get')
  },
  methods: {
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
        reader.readAsText(file); // Cambia readAsDataURL por readAsText
      });
    },
  }
};
</script>
