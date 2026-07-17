<template>
  <section class="search-hero main-background" aria-labelledby="site-search-label">
    <div class="search-hero-inner mx-auto">
      <label
        id="site-search-label"
        :for="inputId"
        class="search-hero-label"
      >
        ¿Qué trámite estás buscando?
      </label>

      <form class="search-hero-form" @submit.prevent="runSearch">
        <div class="search-hero-controls">
          <b-form-input
            :id="inputId"
            v-model="query"
            type="search"
            class="search-hero-input"
            placeholder="Ej: habilitación, pagos dobles, normativa..."
            autocomplete="off"
            @keydown.esc="clearSearch"
          />
          <b-button
            type="submit"
            variant="primary"
            class="search-hero-submit"
          >
            <i class="bi bi-search me-1" aria-hidden="true" />
            Buscar
          </b-button>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    initialQuery: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      query: this.initialQuery,
      inputId: `site-search-${Math.random().toString(36).slice(2, 9)}`,
    }
  },
  watch: {
    initialQuery(value) {
      this.query = value || ''
    },
  },
  methods: {
    runSearch() {
      const trimmed = this.query.trim()
      if (!trimmed) {
        this.clearSearch()
        return
      }

      this.$router.push({
        path: '/buscar',
        query: { q: trimmed },
      })
    },
    clearSearch() {
      this.query = ''
    },
  },
}
</script>

<style scoped>
.search-hero {
  width: 100%;
  padding: 1.5rem 1.25rem 1.75rem;
}

.search-hero-inner {
  width: 100%;
  max-width: 960px;
  padding: 0 0.5rem;
}

.search-hero-label {
  display: block;
  margin-bottom: 0.65rem;
  font-weight: 600;
  color: #0b6819;
}

.search-hero-form {
  width: 100%;
}

.search-hero-controls {
  display: flex;
  align-items: stretch;
  width: 100%;
}

.search-hero-input {
  flex: 1 1 auto;
  min-width: 0;
  border: none;
  border-radius: 0.375rem 0 0 0.375rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  box-shadow: none;
}

.search-hero-input:focus {
  box-shadow: none;
  border-color: transparent;
}

.search-hero-submit {
  flex: 0 0 auto;
  border-radius: 0 0.375rem 0.375rem 0;
  padding: 0.75rem 1.25rem;
  font-weight: 700;
  white-space: nowrap;
  background-color: #2a43a1;
  border-color: #2a43a1;
}

.search-hero-submit:hover,
.search-hero-submit:focus {
  background-color: #223687;
  border-color: #223687;
}

@media (max-width: 575.98px) {
  .search-hero {
    padding: 1.25rem 1rem 1.5rem;
  }

  .search-hero-label {
    font-size: 0.95rem;
  }

  .search-hero-input {
    font-size: 0.95rem;
    padding: 0.65rem 0.85rem;
  }

  .search-hero-submit {
    padding: 0.65rem 0.9rem;
    font-size: 0.95rem;
  }
}
</style>
