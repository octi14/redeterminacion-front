<template>
  <b-card no-body class="certificado-card">
    <!-- <NuxtLink :to="{ name: 'certificado-id', params: { id: certificado.id } }">
      <img :src="certificado.image" class="card-img-top" :alt="certificado.name" />
    </NuxtLink> -->
    <b-card-body class="text-center">
      <!-- <NuxtLink :to="{ name: 'certificado-id', props: { id: certificado.id } }"> -->
        <h2 class="h4">{{ certificado.certificacion }}</h2>
      <!-- </NuxtLink> -->
      <h5>Fecha: {{ certificado.fecha }}</h5>
      <h5>Factura: {{ certificado.factura }}</h5>
      <h5>OP: {{ certificado.op }}</h5>
      <h5>Fecha cancelación: {{ certificado.fecha_cancelacion }}</h5>

      <!-- <h5>{{ certificado.fecha_contrato }}</h5> -->
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  props: {
    obraId: {
      type: Object,
      required: true,
    },
    certificado: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    tag(id) {
      return this.$store.getters['tags/getTagById'](id)
    },
  },
}
</script>
