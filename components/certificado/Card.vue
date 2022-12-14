<template>
  <div class="mx-auto">
    <b-button class="mx-auto my-2 justify-content-center" variant="info" @click="toggleShow">
      {{ visible ? "Ocultar" : "Mostrar"}}
    </b-button>
    <b-card no-body class="certificado-card col-md-12 text-center" v-if="visible">
      <div class="row">
        <!-- <NuxtLink :to="{ name: 'certificado-id', params: { id: certificado.id } }">
          <img :src="certificado.image" class="card-img-top" :alt="certificado.name" />
        </NuxtLink> -->
        <NuxtLink v-if="!certificado.redeterminado && isAdmin" class="text-center col" :to="{ name: 'redeterminaciones-id', params: { id: certificado.id } }">
          <b-button variant="success" class="my-1 col-sm-3" > Redeterminar  </b-button>
        </NuxtLink>
        <strong v-if="certificado.redeterminado" class="text-center col"> Redeterminado el {{ formatDate(certificado.redeterminado.substr(0,10)) }} </strong>
        <b-dropdown variant="outline-primary">
          <b-dropdown-item @click="eliminarRedet"> Eliminar redeterminación </b-dropdown-item>
          <b-dropdown-item @click="eliminarCert" variant="danger"> Eliminar certificado </b-dropdown-item>
        </b-dropdown>
      </div>
      <b-card-body class="col-md-12 text-center">
        <b-form-group  v-for="(_, index) in certificado.items" :key="index">
          <!-- <NuxtLink :to="{ name: 'certificado-id', props: { id: certificado.id } }"> -->
            <strong class="h5 mx-auto"> Item {{index +1 }}: {{ certificado.items[index].item }}</strong>
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
import certificado from '~/service/certificado'
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
    async eliminarCert(){
      try {
        const userToken = this.$store.state.user.token
        const certificado = this.certificado
        const obra = this.obra
        for(var i=0; i< obra.certificados.length; i++){
          if(obra.certificados[i] == certificado.id){
            obra.certificados.splice(i, 1)
            i = 0
          }
        }
        await this.$store.dispatch('obras/update',{
          obra,
          userToken
        })
        await this.$store.dispatch('certificados/delete', {
          certificado
        })
        this.$bvToast.toast('Eliminada correctamente', {
          title: '',
          variant: 'success',
          appendToast: true,
          solid: true,
        })
        await this.$router.push('/')
        // this.editing = false
      } catch (e) {
        this.$bvToast.toast('Error eliminando', {
          title: 'Error',
          variant: 'danger',
          appendToast: true,
          solid: true,
        })
      }
    },
    async eliminarRedet(){
      try {
        // const userToken = this.$store.state.user.token
        const redeterminacion = this.redet
        const userToken = this.$store.state.user.token

        await this.$store.dispatch('redeterminaciones/delete', {
          redeterminacion,
          userToken
        })
        this.$bvToast.toast('Eliminada correctamente', {
          title: '',
          variant: 'success',
          appendToast: true,
          solid: true,
        })
        await this.$router.push('/')
        // this.editing = false
      } catch (e) {
        this.$bvToast.toast('Error eliminando', {
          title: 'Error',
          variant: 'danger',
          appendToast: true,
          solid: true,
        })
      }
    }
    // isAdmin(){
    //   return (this.$store.state.user.admin == true) || (this.$store.state.user.admin == "true")
    // },
  },
}
</script>

<style>
.col h6{
  margin-bottom: 0%;
}
</style>
