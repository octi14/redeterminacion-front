<template>
  <div class="mx-auto">
    <b-button class="mx-auto my-2 justify-content-center" variant="info" @click="toggleShow">
      {{ visible ? "Ocultar" : "Mostrar"}}
    </b-button>
    <b-card no-body class="certificado-card col-md-12 text-center" v-if="visible">
      <!-- <NuxtLink :to="{ name: 'certificado-id', params: { id: certificado.id } }">
        <img :src="certificado.image" class="card-img-top" :alt="certificado.name" />
      </NuxtLink> -->
      <NuxtLink v-if="!certificado.redeterminado && isAdmin" class="row-sm-2" :to="{ name: 'redeterminaciones-id', params: { id: certificado.id } }">
        <b-button variant="success" class="my-1 col-sm-5" > Redeterminar  </b-button>
      </NuxtLink>
      <strong v-if="certificado.redeterminado"> Redeterminado el {{ formatDate(certificado.redeterminado.substr(0,10)) }} </strong>
      <b-card-body class="col-md-12 text-center">
        <b-form-group  v-for="(_, index) in certificado.items" :key="index">
          <!-- <NuxtLink :to="{ name: 'certificado-id', props: { id: certificado.id } }"> -->
            <strong class="h5"> Item {{index +1 }}: {{ certificado.items[index].item }}</strong>
          <!-- </NuxtLink> -->
          <h6>Contratado: ${{ format(redondear(certificado.items[index].contratado)) }}</h6>
          <h6>Anticipo: ${{ format(redondear(certificado.items[index].anticipo)) }}</h6>
          <h6>Avance: {{ certificado.items[index].avance }}%</h6>
          <h6>Saldo: ${{ format(redondear(certificado.items[index].saldo)) }}</h6>
          <strong v-if="certificado.redeterminado">Saldo redeterminado: ${{ format(redondear(totalRedet(redet.items[index]))) }}  </strong>
          <!-- <h5>{{ certificado.fecha_contrato }}</h5> -->
        </b-form-group>
      </b-card-body>
    </b-card>
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
    redet: {
      type: Object,
    },
  },
  data() {
    return {
      visible: false,
    }
  },
  computed: {
    isAdmin(){
      return Boolean(this.$store.state.user.admin == "true")
    },
  },
  methods: {
    redondear(numero) {
      return Number(numero).toFixed(2)
    },
    format(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    formatDate(value) {
      return value.toString().replace(/^(0?[1-9]|[12][0-9]|2[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/g,".")
    },
    toggleShow(){
      this.visible = !this.visible
    },
    totalRedet(item){
      return item.materiales + item.generales + item.manoObra + item.equipos
    },
    isAdmin(){
      return (this.$store.state.user.admin == true) || (this.$store.state.user.admin == "true")
    },
  },
}
</script>

<style>
.col h6{
  margin-bottom: 0%;
}
</style>
