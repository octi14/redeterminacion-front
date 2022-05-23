<template>
  <div class="obra-feed">
    <!-- <b-nav-text class="fs-5" variant="primary" align="center"> Obras públicas </b-nav-text> -->
    <transition-group name="list" tag="div" class="row">
      <div
        v-for="certificado in certificados"
        :key="certificado.id"
        class="transition-col col-6 col-lg-10 mb-1"
      >
        <CertificadoCard :certificado="certificado" :obraId="obraId" class="h-100 col-lg-10" />
      </div>
      <!-- <div class="table-responsive col-md-12" v-for="table in tables" :key="table.id">
        <b-table hover head-variant="dark" :items="items" :fields="fields"></b-table>
      </div>
      <template slot="actions" slot-scope="data">
        <b-button class="btn btn-dark" @click="update(data)" :ref="'btn' + data.index">Update</b-button>
      </template> -->
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    obraId: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      lastLength: false,
      items: [],
    }
  },
  async fetch() {
    await this.$store.dispatch('certificados/getAll')
    this.items = this.certificados
    console.log(this.items)

    // consulto si no hay más recetas para traer
    // const newLength = this.$store.state.certificados.latest.length
    // this.all = newLength === this.lastLength
    // this.lastLength = newLength
  },
  // fetchOnServer: false,
  computed: {
    loading() {
      return this.$fetchState.pending
    },
    certificados() {
      return this.$store.state.certificados.latest
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
