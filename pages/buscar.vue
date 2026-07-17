<template>
  <div class="page main-background">
    <Banner title="Buscador de trámites" subtitle="MUNICIPALIDAD DE VILLA GESELL" />
    <SiteSearch :initial-query="submittedQuery" />

    <section
      v-if="hasQuery"
      class="search-results mx-auto"
      aria-live="polite"
    >
      <div v-if="results.length > 0">
        <p class="search-results-count mb-2">
          {{ results.length }} resultado{{ results.length === 1 ? '' : 's' }} para "{{ submittedQuery }}"
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

      <div v-else class="search-results-empty text-center">
        <p class="mb-0">No se encontraron resultados para "{{ submittedQuery }}".</p>
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
    const { search } = useSiteSearch()
    return { searchItems: search }
  },
  data() {
    return {
      submittedQuery: '',
      results: [],
    }
  },
  computed: {
    hasQuery() {
      return !!this.submittedQuery
    },
  },
  watch: {
    '$route.query.q': {
      immediate: true,
      handler(query) {
        const trimmed = (query || '').trim()
        this.submittedQuery = trimmed
        this.results = trimmed ? this.searchItems(trimmed) : []
      },
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
