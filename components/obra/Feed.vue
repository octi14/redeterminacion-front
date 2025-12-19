<template>
  <div class="obra-feed">
    <b-form-group class="col-md-3 col-sm-8 mx-auto mt-4" label-class="text-success h6">
      <label for="selectedAdjudicado" class="bv-no-focus-ring col-form-label pt-0 text-success h6"><b-icon-funnel-fill></b-icon-funnel-fill> Filtrar por empresa</label>
      <b-form-select plain v-model="selectedAdjudicado" @change="filterItems()">
        <option value="">Todos</option>
        <option v-for="adjudicado in adjudicados" :value="adjudicado" :key="adjudicado">{{ adjudicado }}</option>
      </b-form-select>
    </b-form-group>
    <!--Buscador-->
    <div class="row mt-5 justify-content-center text-center">
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
    <!--Feed buscador vacío-->
    <div class="mx-auto mt-5 col-md-8 col-sm-10" v-if="items.length > 0 && filteredItems.length === 0 && search === '' ">
      <div
        v-for="item in paginatedItems"
        :key="item.id"
        class="transition-col col-12 col-lg"
      >
        <ObraCard :obra="item" />
      </div>
    </div>
    <!--Feed de la búsqueda-->
    <div class="mx-auto mt-5 col-md-8 col-sm-10" v-if="filteredItems.length > 0">
      <div
        v-for="item in filteredPaginatedItems"
        :key="item.id"
        class="transition-col col-12 col-lg"
      >
        <ObraCard :obra="item" />
      </div>
    </div>
    <!--Paginación-->
    <b-pagination class="mt-4" v-if="filteredItems.length || filteredPaginatedItems.length" :total-rows="filteredItems.length" :per-page="perPage" v-model="currentPage" align="center" @input="onPageChange"></b-pagination>
    <!--Div No hay obras para mostrar-->
    <div class="mx-auto text-center mt-5" v-if="filteredItems.length === 0 && search != ''">
      <h5> No se encontraron resultados para "{{ search }}" </h5>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lastLength: false,
      items: [],
      filteredItems: [], // Nueva propiedad de datos para los elementos filtrados
      search: '', // Nueva variable para la búsqueda
      adjudicadoFilter: '', // Nuevo filtro por el campo "adjudicado"
      selectedAdjudicado: '', // Nuevo filtro por "adjudicado"
      currentPage: 1,
      perPage: 5,
      totalPages: 0,
      tables: [{
        id: 1,
      }],
      fields: [
        {
          key: "objeto",
          label: "Objeto"
        },
        {
          key: "adjudicado",
          label: "Adjudicado"
        },
        {
          key: "fecha_contrato",
          label: "Fecha Contrato"
        }
      ]
    }
  },
  async fetch() {
    await this.$store.dispatch('obras/getAll')
    this.items = this.obras

    const perPage = 5; // Number of items per page
    this.totalPages = Math.ceil(this.items.length / perPage);

    // Actualizar los elementos filtrados cuando la búsqueda ha terminado
    this.filterItems();
    // consulto si no hay más para traer
    // const newLength = this.$store.state.obras.latest.length
    // this.all = newLength === this.lastLength
    // this.lastLength = newLength
  },
  // fetchOnServer: false,
  watch: {
    // Observar los cambios en la variable search y activar la búsqueda
    search(nuevaBusqueda) {
      this.filterItems(nuevaBusqueda);
    },
  },
  computed: {
    loading() {
      return this.$fetchState.pending
    },
    obras() {
      return this.$store.state.obras.latest
    },
    adjudicados() {
      const adjudicados = new Set(this.items.map(item => item.adjudicado));
      return Array.from(adjudicados);
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
    filterItems(palabraClave = this.search) {
      const terminoBusqueda = palabraClave.trim().toLowerCase();
      this.filteredItems = this.items.filter(item => {
        const objetoIncluyeTermino = item.objeto.toLowerCase().includes(terminoBusqueda);
        const adjudicadoCoincide = this.selectedAdjudicado === '' || item.adjudicado === this.selectedAdjudicado;
        return objetoIncluyeTermino && adjudicadoCoincide;
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

