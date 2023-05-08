<template>
  <div class="tutoriales-feed mt-5">
    <div class="col text-center">
      <b-button variant="primary" @click="agregarArchivo" v-if="!isAdding"> Nuevo </b-button>
      <TutorialForm v-else @reset="agregarArchivo"/>
    </div>
    <!-- <b-nav-text class="text-center col-md-12 mt-4 " variant="primary">
      <strong class="h2"> Archivos mas recientes </strong>
    </b-nav-text> -->
    <!-- <transition-group name="list" tag="div" class="col mt-3"> -->
      <div class="mx-auto text-center mt-4">
        <h4> Lista de archivos </h4>
      </div>
      <div
        v-for="item in items"
        :key="item.id"
      >
        <TutorialCard :item="item" />
      </div>
      <!-- <b-table class="col-11 mx-auto" fixed hover head-variant="dark" :items="items" :fields="fields"></b-table>
      <template slot="my-link" slot-scope="data">
        <a :href="data.item.link">link</a>
      </template> -->
    <!-- </transition-group> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAdding: false,
      lastLength: false,
      items: [],
      tables: [{
        id: 1,
      }],
      fields: [
        {
          key: "nombre",
          label: "Nombre"
        },
        {
          key: "link",
          label: "Link"
        },
      ]
    }
  },
  async fetch() {
    await this.$store.dispatch('multimedias/getAll')
    this.items = this.multimedias

    // consulto si no hay más recetas para traer
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
      return this.$store.state.multimedias.latest
    },
  },
  methods: {
    loadMore() {
      this.$fetch()
    },
    agregarArchivo() {
      this.isAdding = !this.isAdding
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
