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
  async mounted() {
    await this.loadCertificados()
  },
  computed: {
    certificados() {
      return useCertificadosStore().certifs
    },
    redeterminaciones() {
      return useRedeterminacionesStore().redets
    },
  },
  methods: {
    async loadCertificados() {
      await useCertificadosStore().search({
        obra: this.obra.id,
      })
      this.items = this.certificados
      await useRedeterminacionesStore().searchByObra({
        obra: this.obra.id,
      })
      this.redets = this.redeterminaciones
    },
    loadMore() {
      void this.loadCertificados()
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
