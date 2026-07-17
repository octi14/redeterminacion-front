<template>
  <a
    v-if="isExternalLink"
    :href="to"
    target="_blank"
    rel="noopener noreferrer"
    class="search-result-link"
  >
    <div
      class="d-flex w-100 white shadow-card search-result-card align-items-center"
      :class="{ 'search-result-card--compact': compact }"
    >
      <div class="text-start my-auto flex-grow-1 search-result-text" :class="{ 'search-result-text--compact': compact }">
        <span v-if="section" class="search-result-badge">{{ section }}</span>
        <component :is="compact ? 'h6' : 'h3'" class="landing-text search-result-title mb-1"><b>{{ title }}</b></component>
        <p v-if="compact" class="mb-0 search-result-description">{{ description }}</p>
        <h6 v-else class="mb-0 search-result-description">{{ description }}</h6>
      </div>
    </div>
  </a>
  <NuxtLink v-else :to="to" class="search-result-link">
    <div
      class="d-flex w-100 white shadow-card search-result-card align-items-center"
      :class="{ 'search-result-card--compact': compact }"
    >
      <div class="text-start my-auto flex-grow-1 search-result-text" :class="{ 'search-result-text--compact': compact }">
        <span v-if="section" class="search-result-badge">{{ section }}</span>
        <component :is="compact ? 'h6' : 'h3'" class="landing-text search-result-title mb-1"><b>{{ title }}</b></component>
        <p v-if="compact" class="mb-0 search-result-description">{{ description }}</p>
        <h6 v-else class="mb-0 search-result-description">{{ description }}</h6>
      </div>
    </div>
  </NuxtLink>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    to: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      default: '',
    },
    external: {
      type: Boolean,
      default: false,
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isExternalLink() {
      return this.external || /^https?:\/\//i.test(this.to)
    },
  },
}
</script>

<style scoped>
.search-result-link {
  color: inherit;
  display: block;
  width: 100%;
  text-decoration: none !important;
}

.search-result-link:hover,
.search-result-link:focus,
.search-result-link:focus-visible,
.search-result-link:active,
.search-result-link:visited {
  color: inherit;
  text-decoration: none !important;
}

.search-result-link :is(h3, h6, b, p, span, small) {
  text-decoration: none !important;
}

.search-result-card {
  padding: 0.5rem 0;
  border: 1px solid rgba(12, 104, 26, 0.15);
  border-radius: 0.375rem;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}

.search-result-link:hover .search-result-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.search-result-text {
  padding: 0.75rem 1.25rem;
}

.search-result-badge {
  display: inline-block;
  margin-bottom: 0.45rem;
  padding: 0.15rem 0.55rem;
  border-radius: 0.25rem;
  background-color: rgba(12, 104, 26, 0.12);
  color: #0c681a;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.3;
  text-transform: uppercase;
}

.search-result-title {
  line-height: 1.25;
}

.search-result-description {
  color: #6c757d;
  font-weight: 400;
}

.search-result-card--compact {
  padding: 0;
  box-shadow: none;
  border-color: rgba(12, 104, 26, 0.1);
}

.search-result-text--compact {
  padding: 0.5rem 0.75rem;
}

.search-result-card--compact .search-result-badge {
  font-size: 0.7rem;
  margin-bottom: 0.3rem;
  padding: 0.1rem 0.45rem;
}

.search-result-card--compact .search-result-title {
  font-size: 0.95rem;
}

.search-result-card--compact .search-result-description {
  font-size: 0.8rem;
}

@media (max-width: 767.98px) {
  .search-result-text {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .search-result-text--compact {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}
</style>
