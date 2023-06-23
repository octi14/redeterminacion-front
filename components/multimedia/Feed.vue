<template>
  <div class="multimedia-feed">
    <b-card class="shadow-lg mx-auto mt-5 col-6" v-if="items.length > 0">
      <div class="mx-auto text-center">
        <h4> Lista de archivos </h4>
      </div>
      <div
        v-for="item in items"
        :key="item.id"
      >
        <MultimediaCard :item="item" />
      </div>
    </b-card>
    <div class="mx-auto text-center mt-5" v-else>
      <h5> No hay archivos actualmente. </h5>
    </div>
    <div class="text-center mt-5 float-lg-end">
      <NuxtLink to="/modernizacion">
        <b-button variant="success"> Volver </b-button>
      </NuxtLink>
    </div>
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
      isAdding: false,
      lastLength: false,
      items: [],
    }
  },
  async fetch() {
    await this.$store.dispatch('multimedias/search',{
      categoria: this.keyword,
    })
    this.items = this.multimedias

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
