<template>
  <div id="results-page">
    <template v-if="searchParamsIsInitialized">
      <ContainersSection title="Resultados de Búsqueda">
        <div v-if="searchResults.length" class="row">
          <div
            v-for="obra in searchResults"
            :key="obra._id"
            class="col-6 col-lg-12 mb-4"
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
      <ContainersSection title="No se hizo ninguna busqueda">
        <b-alert variant="primary" show>
          No se hizo ninguna búsqueda.
          <nuxt-link to="/">Volver al inicio</nuxt-link>.
        </b-alert>
      </ContainersSection>
    </template>
  </div>
</template>

<script>
export default {
  computed: {
    // ingredients() {
    //   return this.$store.state.ingredients.list
    // },
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
    // ingredient(id) {
    //   return this.ingredients.find((e) => e.id === id)
    // },
  },
}
</script>

<style type="text/css"></style>
