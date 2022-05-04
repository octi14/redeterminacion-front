<template>
  <div class="obra-feed">
    <!-- <b-nav-text class="fs-5" variant="primary" align="center"> Obras públicas </b-nav-text> -->
    <transition-group name="list" tag="div" class="row">
      <!-- <div
        v-for="obra in obras"
        :key="obra.id"
        class="transition-col col-6 col-lg-4 mb-2"
      >
        <ObraCard :obra="obra" class="h-100" />
      </div> -->
      <div class="table-responsive col-md-12" v-for="table in tables" :key="table.id">
        <b-table hover head-variant="dark" :items="items" :fields="fields"></b-table>
      </div>
      <template slot="actions" slot-scope="data">
        <b-button class="btn btn-dark" @click="update(data)" :ref="'btn' + data.index">Update</b-button>
      </template>
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
    console.log(this.items)

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
