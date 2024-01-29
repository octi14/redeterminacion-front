<template>
  <div class="mx-auto">
    <b-button class="mx-auto my-2 justify-content-center" variant="info" @click="toggleShow">
      {{ visible ? "Ocultar" : "Mostrar"}}
    </b-button>
    <b-card no-body class="certificado-card shadow-card mb-4 col-md-12 text-center" v-if="visible && certificado">
      <div class="row">
        <NuxtLink v-if="!certificado.redeterminado" class="text-center col" :to="{ name: 'redeterminaciones-id', params: { id: certificado.id } }">
          <b-button variant="success" class="my-1 col-sm-3" > Redeterminar  </b-button>
        </NuxtLink>
        <strong v-if="certificado.redeterminado" class="text-center col"> Redeterminado el {{ certificado.redeterminado }} </strong>
        <b-dropdown variant="outline-primary">
          <b-dropdown-item @click="eliminarRedet"> Eliminar redeterminación </b-dropdown-item>
          <b-dropdown-item @click="eliminarCert" variant="danger"> Eliminar certificado </b-dropdown-item>
        </b-dropdown>
      </div>
      <b-card-body class="col-md-12 text-center">
        <b-form-group v-for="(_, index) in certificado.items" :key="index">
          <strong class="h5 mx-auto"> Item {{ index + 1 }}: {{ certificado.items[index].item }}</strong>
          <h6>Contratado: ${{ format(redondear(certificado.items[index].contratado)) }}</h6>
          <h6 v-if="!obraUvi">Anticipo: ${{ format(redondear(certificado.items[index].anticipo)) }}</h6>
          <h6>Avance: {{ certificado.items[index].avance }}%</h6>
          <h6 v-if="!obraUvi">Saldo: ${{ format(redondear(certificado.items[index].saldo)) }}</h6>
          <h6 v-else>Saldo: ${{ format(redondear((certificado.items[index].contratado - certificado.items[index].anticipo) * (certificado.items[index].avance/100))) }}</h6>
          <strong v-if="certificado.redeterminado && redet && redet.items && redet.items[index]">
            Saldo redeterminado: ${{ format(redondear(totalRedet(redet.items[index]))) }}
          </strong>
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
      obraUvi: false,
    }
  },
  async fetch() {
    this.obraUvi = (this.obra.ponderacion[0].porcentaje == null)
  },
  computed: {
    isAdmin(){
      return Boolean(this.$store.state.user.admin == "true")
    },
    adminHacienda(){
      return this.$store.state.user.admin == "hacienda"
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
    toggleShow(){
      this.visible = !this.visible
    },
    totalRedet(item) {
      const materiales = Number(item.materiales) || 0;
      const generales = Number(item.generales) || 0;
      const manoObra = Number(item.manoObra) || 0;
      const equipos = Number(item.equipos) || 0;
      const uvi = Number(item.uvi) || 0;

      return materiales + generales + manoObra + equipos + uvi;
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
      } catch (e) {
        this.$bvToast.toast('Error eliminando', {
          title: 'Error',
          variant: 'danger',
          appendToast: true,
          solid: true,
        })
      }
    },
  },
}
</script>

<style>
.col h6{
  margin-bottom: 0%;
}
</style>
