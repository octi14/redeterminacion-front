<template>
  <div class="multimedia-feed">
    <div class="row col-11 mx-auto mt-3 justify-content-center text-center">
      <b-input
        type="text"
        class="col-6"
        v-model="search"
        @input="handleSearchInput"
        placeholder="Buscar..."
      />
      <div class="col-1">
        <b-button @click="clearSearch">Limpiar</b-button>
      </div>
    </div>
    <b-card class="shadow-card mx-auto mt-4 col-md-8 col-sm-10" v-if="items.length > 0 && filteredItems.length == 0 && search == '' ">
      <div
        v-for="item in paginatedItems"
        :key="item.id"
      >
        <MultimediaCard :item="item" />
      </div>
    </b-card>
    <b-card class="shadow-card mx-auto mt-4 col-md-8 col-sm-10" v-if="filteredItems.length > 0">
      <!-- <div class="mx-auto text-center">
        <h4> Lista de archivos </h4>
      </div> -->
      <div
        v-for="item in filteredPaginatedItems"
        :key="item.id"
      >
        <MultimediaCard :item="item" />
      </div>
    </b-card>
    <div class="mx-auto text-center mt-5" v-if="items.length == 0">
      <h5> Cargando... </h5>
    </div>
    <div class="mx-auto text-center mt-5" v-if="filteredItems.length === 0 && search != ''">
      <h5> No se encontraron resultados para "{{ search }}" </h5>
    </div>
    <b-pagination class="mt-4" v-if="filteredItems.length" :total-rows="items.length" :per-page="perPage" v-model="currentPage" align="center" @input="onPageChange"></b-pagination>
  </div>
</template>

<script>
export default {
  props: {
    keyword: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isAdding: false,
      lastLength: false,
      items: [],
      filteredItems: [], // Nueva propiedad de datos para los elementos filtrados
      search: '', // Nueva variable para la búsqueda
      currentPage: 1,
      perPage: 10,
      totalPages: 0
    }
  },
  async fetch() {
    // Usar una promesa para esperar a que la acción se complete
    await new Promise((resolve) => {
      this.$store.dispatch('multimedias/search', {
        categoria: this.keyword,
      }).then(() => {
        resolve();
      });
    });
    this.items = this.multimedias
    if (this.items) {
      // Llama a la mutación para ordenar los elementos
      this.$store.commit('multimedias/sortItemsByName');
    }

    const perPage = 10; // Number of items per page
    this.totalPages = Math.ceil(this.items.length / perPage);

    // Actualizar los elementos filtrados cuando la búsqueda ha terminado
    this.filterItems();
    // consulto si no hay más para traer
    // const newLength = this.$store.state.obras.latest.length
    // this.all = newLength === this.lastLength
    // this.lastLength = newLength
  },
  watch: {
    // Observar los cambios en la variable search y activar la búsqueda
    search(nuevaBusqueda) {
      this.filterItems(nuevaBusqueda);
    },
  },
  // fetchOnServer: false,
  computed: {
    loading() {
      return this.$fetchState.pending
    },
    multimedias() {
      return this.$store.state.multimedias.multimedias
    },
    isAdmin(){
      return Boolean(this.$store.state.user.admin == "true")
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.items.slice(start, end);
    },
    filteredPaginatedItems() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredItems.slice(start, end);
    }

  },
  methods: {
    loadMore() {
      this.$fetch()
    },
    sortItems() {
      this.items.sort((a, b) => {
        // Comparar los nombres de los elementos
        const nameA = a.nombre.toLowerCase();
        const nameB = b.nombre.toLowerCase();

        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
    },
    filterItems(palabraClave = this.search) {
      const terminoBusqueda = palabraClave.trim().toLowerCase();
      this.filteredItems = this.items.filter(item => {
        // Personaliza la lógica de filtrado según tus necesidades.
        // Por ejemplo, puedes buscar una palabra clave en una propiedad específica del objeto 'item'.
        return item.nombre.toLowerCase().includes(terminoBusqueda);
      });

      this.totalPages = Math.ceil(this.filteredItems.length / this.perPage);

      // Reiniciar currentPage a la primera página después de filtrar
      this.currentPage = 1;
    },
    // Manejar la entrada de búsqueda en el campo de entrada
    handleSearchInput() {
      // Llamar a filterItems() solo después de un retraso para evitar búsquedas innecesarias en cada pulsación de tecla
      // Aquí, esperamos 300 milisegundos antes de activar la búsqueda
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.filterItems(this.search);
      }, 300);
    },
    // Limpiar el campo de búsqueda
    clearSearch() {
      this.search = '';
    },
    onPageChange(newPage) {
      this.currentPage = newPage;
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  },
}
</script>

<style>
.pagination-button{
  height: 30px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
