<template>
  <div v-if="adminMaster || adminArvige" class="page main-background">
    <Banner title="Maestro comercial"/>
    <div class="maestro-toolbar mx-auto mt-4">
      <b-form-group class="maestro-toolbar__search" label-class="text-success h6">
        <label for="inputCUIT" class="bv-no-focus-ring col-form-label pt-0 text-success h6">
          <i class="bi bi-search"></i> Buscar por CUIT
        </label>
        <b-form-input
          id="inputCUIT"
          v-model="inputCUIT"
          placeholder="Ingresá un CUIT"
          @input="filtrarPorCUIT"
          type="text"
        />
      </b-form-group>

      <div class="maestro-upload">
        <p class="maestro-upload__title">Cargar maestro</p>
        <b-form class="maestro-upload__form">
          <b-form-file
            v-model="file"
            class="maestro-upload__file"
            accept="csv"
            type="file"
            placeholder="No has seleccionado un archivo."
            @change="handleFileUpload"
          />
          <b-button size="sm" @click="onSubirMaestro" variant="success" class="maestro-upload__btn">
            Subir archivo
          </b-button>
        </b-form>
      </div>
    </div>
    <b-table per-page="10" head-row-variant="warning" class="internal-use-table internal-use-wide white mt-4 shadow-card" :items="paginatedItems" :fields="fields" :busy="loading">
      <template #table-busy>
        <LoadingState text="Cargando..." variant="primary" />
      </template>
      <template #cell(detalles)="row">
        <b-button variant="outline-secondary" size="sm" title="Editar" @click="editarMaestro(row.item)">
          <i class="bi bi-pen"></i>
        </b-button>
      </template>
    </b-table>
    <b-pagination v-if="!loading" class="internal-use-pagination internal-use-wide mt-4" :total-rows="filteredItems.length" :per-page="perPage" v-model="currentPage" align="center" @input="onPageChange"></b-pagination>

    <BModal id="modalEditarMaestro" no-header-close v-model="editing" header-bg-variant="secondary" title="Editar maestro comercial" title-class="h5 text-light mx-auto" no-footer centered>
      <MaestroComercialForm
        v-if="editing"
        v-on:show="loadMaestro"
        :item="editarItem"
        :create="false"
        @submit="onSubmitEditMaestro"
        @reset="editing = false"
      ></MaestroComercialForm>
    </BModal>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['authenticated', 'require-admin'],
  adminRoles: ['arvige', 'master'],
})
</script>

<script>
export default {
  data() {
    return {
      file: null,
      currentPage: 1,
      perPage: 10,
      editing: false,
      inputCUIT: '',
      loading: true,
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
  async mounted() {
    await this.loadMaestro()
  },
  computed: {
    maestro() {
      return useMaestroStore().all;
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
    },
    adminMaster(){
      return useUserStore().admin == "master"
    },
    adminArvige(){
      const admin = useUserStore().admin
      return admin == "arvige" || admin == "master"
    }
  },
  methods: {
    async loadMaestro() {
      this.loading = true
      try {
        await useMaestroStore().get()
      } finally {
        this.loading = false
      }
    },
    editarMaestro(item) {
      this.editarItem = item;
      this.editing = true;
    },
    onPageChange(newPage) {
      this.currentPage = newPage;
    },
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    async onSubirMaestro() {
      const userToken = useUserStore().token;
      const file = await this.readFileContent(this.file);

      await useMaestroStore().create({ file });
      await this.loadMaestro()
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

<style scoped>
.maestro-toolbar {
  width: 100%;
  max-width: min(92rem, 96vw);
  margin-left: auto;
  margin-right: auto;
}

.maestro-toolbar__search {
  max-width: 20rem;
  margin-left: auto;
  margin-right: auto;
}

.maestro-upload {
  max-width: 22rem;
  margin: 1.25rem auto 0;
  padding: 1rem 1.25rem;
  text-align: center;
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
}

.maestro-upload__title {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #0c681a;
}

.maestro-upload__form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.maestro-upload__file {
  width: 100%;
  max-width: 18rem;
}

.maestro-upload__btn {
  min-width: 9rem;
}
</style>
