<template>
  <div id="results-page" class="mt-5">
    <template v-if="searchParamsIsInitialized">
      <ContainersSection title="Resultados de Búsqueda">
        <div v-if="searchResults.length" class="row mt-5">
          <div
            v-for="obra in searchResults"
            :key="obra._id"
            class="col-6 col-lg-12"
          >
            <ObraCard :obra="obra" />
          </div>
        </div>
        <div v-else>
          <b-alert show variant="info">No hay resultados para mostrar</b-alert>
        </div>
      </ContainersSection>
    </template>
    <template v-else>
      <ContainersSection>
        <b-alert variant="primary" show>
          No se hizo ninguna búsqueda.
          <nuxt-link to="/redeterminacion">Volver al inicio</nuxt-link>.
        </b-alert>
      </ContainersSection>
    </template>
  </div>
</template>

<script>
export default {
  computed: {
    searchResults() {
      return this.$store.state.search.results
    },
    searchParams() {
      return this.$store.state.search.params
    },
    searchParamsIsInitialized() {
      return Object.values(this.searchParams).some(Boolean)
    },
  },
  methods: {
  },
}
</script>

<style type="text/css"></style>
