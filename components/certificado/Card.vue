<template>
  <b-card no-body class="certificado-card">
    <!-- <NuxtLink :to="{ name: 'certificado-id', params: { id: certificado.id } }">
      <img :src="certificado.image" class="card-img-top" :alt="certificado.name" />
    </NuxtLink> -->
    <b-card-body class="text-center">
      <b-form-group  v-for="item in certificado.items" :key="item.id">
        <!-- <NuxtLink :to="{ name: 'certificado-id', props: { id: certificado.id } }"> -->
          <strong class="h5">{{ item.item }}</strong>
        <!-- </NuxtLink> -->
        <h6>Contratado: ${{ redondear(item.contratado) }}</h6>
        <h6>Anticipo: ${{ redondear(item.anticipo) }}</h6>
        <h6>Avance: {{ redondear(item.avance) }}%</h6>
        <h6>Saldo: ${{ redondear(item.saldo) }}</h6>
        <!-- <h5>{{ certificado.fecha_contrato }}</h5> -->
      </b-form-group>
      <b-button @click="onRedeterminar"> Redeterminar </b-button>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  props: {
    obra: {
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
    redondear(numero) {
      return Number(numero).toFixed(2)
    },
    onRedeterminar() {
    }
  },
}
</script>
