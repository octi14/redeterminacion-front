<template>
  <div class="obra-feed">
    <b-nav-text class="text-center col-md-12" variant="primary">
      <strong class="h2"> Archivos mas recientes </strong>
    </b-nav-text>
    <transition-group name="list" tag="div" class="col mt-3">
      <div
        v-for="obra in obras"
        :key="obra.id"
        class="transition-col col-12 col-lg"
      >
        <ObraCard :obra="obra" />
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lastLength: false,
      items: [],
      tables: [{
        id: 1,
      }],
      fields: [
        {
          key: "objeto",
          label: "Objeto"
        },
        {
          key: "adjudicado",
          label: "Adjudicado"
        },
        {
          key: "fecha_contrato",
          label: "Fecha Contrato"
        }
      ]
    }
  },
  async fetch() {
    await this.$store.dispatch('obras/getAll')
    this.items = this.obras

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
    obras() {
      return this.$store.state.obras.latest
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
