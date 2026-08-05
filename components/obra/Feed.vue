<template>
  <div class="obra-feed">
    <b-form-group class="col-md-3 col-sm-8 mx-auto mt-4" label-class="text-success h6">
      <label for="selectedAdjudicado" class="bv-no-focus-ring col-form-label pt-0 text-success h6"><i class="bi bi-funnel-fill"></i> Filtrar por empresa</label>
      <b-form-select plain v-model="selectedAdjudicado" @change="filterItems()">
        <option value="">Todos</option>
        <option v-for="adjudicado in adjudicados" :value="adjudicado" :key="adjudicado">{{ adjudicado }}</option>
      </b-form-select>
    </b-form-group>
    <div class="obra-feed-search d-flex flex-wrap justify-content-center align-items-center gap-2 mt-3 mx-auto">
      <b-form-input
        type="text"
        class="obra-feed-search-input"
        v-model="search"
        @input="handleSearchInput"
        placeholder="Buscar..."
      />
      <b-button class="flex-shrink-0" @click="clearSearch">Limpiar</b-button>
    </div>
    <div class="mx-auto mt-5 col-md-8 col-sm-10" v-if="items.length > 0 && filteredItems.length === 0 && search === '' ">
      <div
        v-for="item in paginatedItems"
        :key="item.id"
        class="transition-col col-12 col-lg"
      >
        <ObraCard :obra="item" />
      </div>
    </div>
    <div class="mx-auto mt-5 col-md-8 col-sm-10" v-if="filteredItems.length > 0">
      <div
        v-for="item in filteredPaginatedItems"
        :key="item.id"
        class="transition-col col-12 col-lg"
      >
        <ObraCard :obra="item" />
      </div>
    </div>
    <b-pagination
      class="mt-4"
      v-if="filteredItems.length"
      :total-rows="filteredItems.length"
      :per-page="perPage"
      v-model="currentPage"
      align="center"
    />
    <div class="mx-auto text-center mt-5" v-if="filteredItems.length === 0 && search != ''">
      <h5> No se encontraron resultados para "{{ search }}" </h5>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      filteredItems: [],
      search: '',
      selectedAdjudicado: '',
      currentPage: 1,
      perPage: 5,
    }
  },
  async mounted() {
    await useObrasStore().getAll()
    this.items = this.obras
    this.filterItems()
  },
  watch: {
    search(nuevaBusqueda) {
      this.filterItems(nuevaBusqueda)
    },
  },
  computed: {
    obras() {
      return useObrasStore().latest
    },
    adjudicados() {
      const adjudicados = new Set(this.items.map((item) => item.adjudicado))
      return Array.from(adjudicados)
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      return this.items.slice(start, end)
    },
    filteredPaginatedItems() {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      return this.filteredItems.slice(start, end)
    },
  },
  methods: {
    filterItems(palabraClave = this.search) {
      const terminoBusqueda = palabraClave.trim().toLowerCase()
      this.filteredItems = this.items.filter((item) => {
        const objetoIncluyeTermino = item.objeto.toLowerCase().includes(terminoBusqueda)
        const adjudicadoCoincide = this.selectedAdjudicado === '' || item.adjudicado === this.selectedAdjudicado
        return objetoIncluyeTermino && adjudicadoCoincide
      })
      this.currentPage = 1
    },
    handleSearchInput() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.filterItems(this.search)
      }, 300)
    },
    clearSearch() {
      this.search = ''
    },
  },
}
</script>

<style scoped>
.obra-feed-search {
  max-width: 28rem;
  width: 100%;
  padding: 0 1rem;
}

.obra-feed-search-input {
  flex: 1 1 12rem;
  min-width: 10rem;
  max-width: 20rem;
}
</style>
