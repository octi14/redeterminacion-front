<template>
  <div class="page">
    <Banner title="Tutoriales" />
    <div class="row justify-content-center" style="height: 50%">
      <div class="text-center mx-5 my-auto">
        <NuxtLink to="/tutoriales/mail-institucional">
          <b-icon-folder class="h1 landing-icon" /> <br />
          <h3> Mail institucional </h3>
        </NuxtLink>
      </div>
      <div class="text-center mx-5 my-auto">
        <NuxtLink to="/tutoriales/gde">
          <b-icon-folder class="h1 landing-icon" /> <br />
          <h3> Sistema GDE </h3>
        </NuxtLink>
      </div>
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
      categoria: 'Tutoriales',
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
