<template>
  <div class="page main-background">
    <Banner title="Buscador de trámites" subtitle="MUNICIPALIDAD DE VILLA GESELL" />
    <SiteSearch
      :initial-query="activeQuery"
      live
      @query-change="onQueryChange"
    />

    <section
      class="search-results mx-auto"
      aria-live="polite"
    >
      <div v-if="results.length > 0">
        <p class="search-results-count mb-2">
          <template v-if="activeQuery">
            {{ results.length }} resultado{{ results.length === 1 ? '' : 's' }} para "{{ activeQuery }}"
          </template>
          <template v-else>
            {{ results.length }} trámite{{ results.length === 1 ? '' : 's' }} disponible{{ results.length === 1 ? '' : 's' }}
          </template>
        </p>
        <div class="search-results-list">
          <SearchResultItem
            v-for="item in results"
            :key="item.id"
            :title="item.title"
            :description="item.description"
            :to="item.to"
            :section="item.section"
            :external="item.external"
          />
        </div>
      </div>

      <div v-else-if="activeQuery" class="search-results-empty text-center">
        <p class="mb-0">No se encontraron resultados para "{{ activeQuery }}".</p>
      </div>
    </section>

    <div class="page-btn-volver-wrap w-100">
      <b-button variant="primary" size="sm" class="page-btn-volver" @click="$router.push('/')">
        Volver
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const { search, visibleItems } = useSiteSearch()
    return { searchItems: search, visibleItems }
  },
  data() {
    return {
      activeQuery: '',
      results: [],
    }
  },
  watch: {
    '$route.query.q': {
      immediate: true,
      handler(query) {
        this.applyQuery((query || '').trim())
      },
    },
  },
  methods: {
    applyQuery(query) {
      this.activeQuery = query
      this.results = query ? this.searchItems(query) : this.visibleItems
    },
    onQueryChange(query) {
      const trimmed = (query || '').trim()
      this.applyQuery(trimmed)

      const nextQuery = trimmed ? { q: trimmed } : {}
      const currentQuery = this.$route.query.q
        ? { q: String(this.$route.query.q).trim() }
        : {}

      if (JSON.stringify(nextQuery) !== JSON.stringify(currentQuery)) {
        this.$router.replace({ path: '/buscar', query: nextQuery })
      }
    },
  },
}
</script>

<style scoped>
.search-results {
  width: 100%;
  max-width: 960px;
  margin-top: 1.25rem;
  padding: 0 1.75rem 1.5rem;
}

.search-results-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-results-count {
  color: #495057;
  font-size: 0.95rem;
}

.search-results-empty {
  color: #495057;
}

@media (max-width: 575.98px) {
  .search-results {
    padding: 0 1.25rem 1.25rem;
  }
}
</style>
