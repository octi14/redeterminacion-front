<template>
  <div class="multimedia-feed">
    <div class="multimedia-feed-search d-flex flex-wrap justify-content-center align-items-center gap-2 mt-3 mx-auto">
      <b-form-input
        type="text"
        class="multimedia-feed-search-input"
        v-model="search"
        @input="handleSearchInput"
        placeholder="Buscar..."
      />
      <b-button class="flex-shrink-0" @click="clearSearch">Limpiar</b-button>
    </div>

    <div class="mx-auto text-center mt-5" v-if="loading">
      <h5>Cargando...</h5>
    </div>

    <div class="mx-auto text-center mt-5" v-else-if="loadError">
      <h5>No se pudieron cargar los archivos.</h5>
      <p class="text-muted mb-0">Intentá recargar la página.</p>
    </div>

    <b-card
      v-else-if="filteredItems.length > 0"
      class="shadow-card mx-auto mt-4 col-md-8 col-sm-10"
    >
      <div v-for="item in filteredPaginatedItems" :key="item.id">
        <MultimediaCard :item="item" />
      </div>
    </b-card>

    <div class="mx-auto text-center mt-5" v-else-if="loaded && search !== ''">
      <h5>No se encontraron resultados para "{{ search }}"</h5>
    </div>

    <div class="mx-auto text-center mt-5" v-else-if="loaded">
      <h5>No hay archivos en esta categoría.</h5>
    </div>

    <b-pagination
      class="mt-4"
      v-if="!loading && filteredItems.length > 0"
      :total-rows="filteredItems.length"
      :per-page="perPage"
      v-model="currentPage"
      align="center"
    />
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
      items: [],
      filteredItems: [],
      search: '',
      currentPage: 1,
      perPage: 10,
      loading: true,
      loaded: false,
      loadError: false,
      searchTimeout: null,
    }
  },
  async mounted() {
    await this.loadMultimedia()
  },
  watch: {
    search(nuevaBusqueda) {
      this.filterItems(nuevaBusqueda)
    },
    keyword() {
      this.loadMultimedia()
    },
  },
  computed: {
    multimedias() {
      return useMultimediasStore().multimedias
    },
    filteredPaginatedItems() {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      return this.filteredItems.slice(start, end)
    },
  },
  methods: {
    async loadMultimedia() {
      this.loading = true
      this.loadError = false
      this.loaded = false

      try {
        await useMultimediasStore().search({
          categoria: this.keyword,
        })
        this.items = Array.isArray(this.multimedias) ? [...this.multimedias] : []
        if (this.items.length) {
          useMultimediasStore().sortItemsByName()
          this.items = [...this.multimedias]
        }
        this.filterItems()
      } catch (error) {
        console.error('[MultimediaFeed]', error)
        this.items = []
        this.filteredItems = []
        this.loadError = true
      } finally {
        this.loading = false
        this.loaded = true
      }
    },
    filterItems(palabraClave = this.search) {
      const terminoBusqueda = palabraClave.trim().toLowerCase()
      this.filteredItems = this.items.filter((item) =>
        String(item?.nombre || '').toLowerCase().includes(terminoBusqueda),
      )
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
.multimedia-feed-search {
  max-width: 28rem;
  width: 100%;
  padding: 0 1rem;
}

.multimedia-feed-search-input {
  flex: 1 1 12rem;
  min-width: 10rem;
  max-width: 20rem;
}
</style>
