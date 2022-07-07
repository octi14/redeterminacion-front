<template>
  <div class="certificado-feed my-5 justify-content-center">
    <div class="layout">
      <CertificadoFeed />
      <b-button @click="onReturn" variant="primary"> Volver </b-button>
    </div>
  </div>
</template>


<script>
import about from "../about.vue"
export default {
  components: { about },
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
    await this.$store.dispatch('certificados/getAll')
    this.items = this.certificados
    // console.log(this.items)

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
    onReturn() {
      this.$router.push("/")
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
