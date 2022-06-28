<template>
  <div class="mx-auto row-md-12">
    <b-card no-body class="certificado-card mx-auto" v-if="visible">
      <!-- <NuxtLink :to="{ name: 'certificado-id', params: { id: certificado.id } }">
        <img :src="certificado.image" class="card-img-top" :alt="certificado.name" />
      </NuxtLink> -->
      <b-card-body class="text-center">
        <b-button v-if="visible" variant="info" @click="visible= !visible"> Ocultar </b-button>
        <b-form-group  v-for="(_, index) in certificado.items" :key="index">
          <!-- <NuxtLink :to="{ name: 'certificado-id', props: { id: certificado.id } }"> -->
            <strong class="h5"> Item {{index +1 }}: {{ certificado.items[index].item }}</strong>
          <!-- </NuxtLink> -->
          <h6>Contratado: ${{ format(redondear(certificado.items[index].contratado)) }}</h6>
          <h6>Anticipo: ${{ format(redondear(certificado.items[index].anticipo)) }}</h6>
          <h6>Avance: {{ certificado.items[index].avance }}%</h6>
          <h6>Saldo: ${{ format(redondear(certificado.items[index].saldo)) }}</h6>
          <!-- <h5>{{ certificado.fecha_contrato }}</h5> -->
        </b-form-group>
        <NuxtLink :to="{ name: 'redeterminaciones-id', params: { id: certificado.id } }"> Redeterminar </NuxtLink>
      </b-card-body>
    </b-card>
    <b-button v-else class="mx-auto justify-content-center" variant="info" @click="visible = !visible"> Mostrar </b-button>
  </div>
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
    return {
      visible: false,
    }
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
    },
    format(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
  },
}
</script>
