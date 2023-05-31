<template>
  <div class="tutoriales-feed mx-auto mt-5">
    <div class="mx-auto text-center mt-4">
      <h4> Lista de archivos </h4>
    </div>
    <div
      v-for="item in items"
      :key="item.id"
    >
      <MultimediaCard :item="item" />
    </div>
    <div class="text-center mt-3 float-lg-end">
      <NuxtLink to="/modernizacion">
        <b-button variant="success"> Volver </b-button>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAdding: false,
      lastLength: false,
      items: [],
    }
  },
  async fetch() {
    await this.$store.dispatch('multimedias/search',{
      categoria: 'Procedimientos',
    })
    this.items = this.multimedias
    this.updateComponent
    // consulto si no hay más para traer
    // const newLength = this.$store.state.obras.latest.length
    // this.all = newLength === this.lastLength
    // this.lastLength = newLength
  },
  // fetchOnServer: false,
  computed: {
    loading() {
      return this.$fetchState.pending
    },
    updateComponent(){
      this.$fetch()
    },
    multimedias() {
      return this.$store.state.multimedias.multimedias
    },
    isAdmin(){
      return Boolean(this.$store.state.user.admin == "true")
    },
  },
  methods: {
    loadMore() {
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
