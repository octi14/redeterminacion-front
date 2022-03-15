<template>
  <div class="obra-feed">
    <b-nav-text class="fs-3" variant="primary"> Obras públicas </b-nav-text>
    <transition-group name="list" tag="div" class="row">
      <div
        v-for="obra in obras"
        :key="obra.id"
        class="transition-col col-6 col-lg-4 mb-2"
      >
        <ObraCard :obra="obra" class="h-100" />
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lastLength: false,
    }
  },
  async fetch() {
    await this.$store.dispatch('obras/getAll')

    // consulto si no hay más recetas para traer
    const newLength = this.$store.state.obras.latest.length
    this.all = newLength === this.lastLength
    this.lastLength = newLength
  },
  fetchOnServer: false,
  computed: {
    loadingRecipes() {
      return this.$fetchState.pending
    },
    obras() {
      console.log(this.$store.state.obras.latest)
      return this.$store.state.obras.latest
    },
  },
  methods: {
    loadMoreRecipes() {
      this.$fetch()
    },
  },
}
</script>

<style>
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
