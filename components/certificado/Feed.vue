<template>
  <div class="certificado-feed mx-auto col">
    <div v-if="certificados">
      <div v-for="(_, index) in certificados" :key="index" class="my-2 text-center">
        <b-button @click="openModal(index)" variant="info" class="col-3 mx-auto">
          Certificado {{ index + 1 }}
        </b-button>
      </div>

      <!-- Modal de Certificado -->
      <CertificadoCard
        v-if="selectedCertificado !== null"
        :certificado="certificados[selectedCertificado]"
        :obra="obra"
        :redet="redets[selectedCertificado]"
        @close="closeModal"
      />
    </div>
    <div v-else>
      <h6>No hay certificados para mostrar</h6>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    obra: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      lastLength: false,
      items: [],
      redets: [],
      selectedCertificado: null, // Índice del certificado seleccionado
    }
  },
  async fetch() {
    await this.$store.dispatch('certificados/search', {
      obra: this.obra.id
      })
    this.items = this.certificados
    await this.$store.dispatch('redeterminaciones/searchByObra', {
      obra: this.obra.id
    })
    this.redets = this.redeterminaciones

    // const newLength = this.$store.state.certificados.latest.length
    // this.all = newLength === this.lastLength
    // this.lastLength = newLength
  },
  fetchOnServer: false,
  computed: {
    loading() {
      return this.$fetchState.pending
    },
    certificados() {
      return this.$store.state.certificados.certifs
    },
    redeterminaciones() {
      return this.$store.state.redeterminaciones.redets
    },
  },
  methods: {
    loadMore() {
      this.$fetch()
    },
    openModal(index) {
      this.selectedCertificado = index;
    },
    closeModal() {
      this.selectedCertificado = null;
    },
  },
}
</script>
