<template>
  <div class="page my-4">
    <template v-if="certificado">
      <div class="container mx-auto">
        <div class="row mx-auto" v-if="obra">
          <div class="col mx-auto">
            <div class="container mx-auto">
          <!-- View -->
              <h2 class="mx-auto text-center"> Redeterminar certificado </h2>

              <b-form class="col mx-auto">
                <h5 class="col-main"> Acta de inicio: {{ this.obra.acta_inicio }} </h5>
                <h6> Fecha de última redeterminación: </h6>
                <b-form-input class="col-md-2" v-model="fechaAnterior" type="date"> </b-form-input>
                <p> En caso de ser la primera redeterminación, se tomará como índice origen el correspondiente al mes de inicio de la obra. </p>
                <hr/>
                <h6> Fecha de cancelación: </h6>
                <b-form-input class="col-md-2" v-model="fechaCancelacion" type="date"> </b-form-input>
              </b-form>
              <b-button variant="primary" @click="onApplyIndex"> Aplicar índices </b-button>
            </div>
          </div>
          <div class="container mx-auto" v-for="(_,index) in certificado.items" :key="index">
            <div class="layout">
                <strong class="row h5">{{index +1}}. {{ certificado.items[index].item }}</strong>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Saldo original</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>${{ format(certificado.items[index].saldo) }}</a>
              </p>
            </div>
            <br>
            <div v-if="!obraUvi">
              <div class="layout">
                <p class="col col-main">
                  <strong>Proporcional materiales</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>${{ format(ponderar(certificado.items[index].saldo, obra.ponderacion[0].porcentaje)) }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Proporcional gastos generales</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>${{ format(ponderar(certificado.items[index].saldo, obra.ponderacion[1].porcentaje)) }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Proporcional mano de obra</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>${{ format(ponderar(certificado.items[index].saldo, obra.ponderacion[2].porcentaje)) }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Proporcional equipos</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>${{ format(ponderar(certificado.items[index].saldo, obra.ponderacion[3].porcentaje)) }}</a>
                </p>
              </div>
              <br>
            </div>
            <!-- <hr/> -->

            <div v-if="!obraUvi">
              <div class="layout">
                <p class="col col-main">
                  <strong>Redeterminación materiales </strong> <br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>$ {{ format(redeterminarMateriales(ponderar(certificado.items[index].saldo, obra.ponderacion[0].porcentaje))) }} </a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Redeterminación gastos generales </strong>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>$ {{ format(redeterminarGenerales(ponderar(certificado.items[index].saldo, obra.ponderacion[1].porcentaje))) }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Redeterminación mano de obra </strong>
                  <p class="col col-complementary" role="complementary">
                    <a>$ {{ format(redeterminarManoObra(ponderar(certificado.items[index].saldo, obra.ponderacion[2].porcentaje))) }}
                    </a>
                  </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Redeterminación equipos </strong>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>$ {{ format(redeterminarEquipos(ponderar(certificado.items[index].saldo, obra.ponderacion[3].porcentaje))) }} </a>
                </p>
              </div>
            </div>
            <!-- <div class="layout">
              <p class="col col-main">
                <strong class="h4">Total redeterminado </strong>
                <p class="col col-complementary">$ {{ totales[index] }} </p>
            </div> -->
            <hr />
          </div>
          <b-button variant="success" @click="onGuardar"> Guardar </b-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import CertificadoService from '~/service/certificado'

export default {
  data() {
    return {
      certificado: null,
      obra: null,

      obraUvi: false,

      fechaAnterior: null,
      fechaCancelacion: null,

      origenMateriales: 0,
      destinoMateriales: 0,
      origenManoObra: 0,
      destinoManoObra: 0,
      origenGenerales: 0,
      destinoGenerales: 0,
      origenEquipos: 0,
      destinoEquipos: 0,

      totales: [],

      redeterminacion: [],
    }
  },
  async fetch() {
    const certificadoId = this.$route.params.id
    await this.$store.dispatch('certificados/getSingle',{
      id: certificadoId,
    })
    this.certificado = this.$store.state.certificados.single
    const obraId = this.certificado.obra
    await this.$store.dispatch('obras/getSingle', {
      id: obraId,
    })
    this.obra = this.$store.state.obras.single
    for (var i = 0; i < this.obra.items.length; i++) {
      this.totales.push(0)
    }
    this.obraUvi = (this.obra.ponderacion[0].porcentaje == null)
  },
  fetchOnServer: false,
  activated() {
    this.certificado = null
    this.obra = null
    this.$fetch()
  },
  methods: {
    async onSubmitDelete() {
      try {
        const userToken = this.$store.state.user.token
        const id = this.$route.params.id

        await this.$store.dispatch('obras/delete', {
          id: id,
          userToken,
        })
        this.$bvToast.toast('Eliminada correctamente', {
          title: '',
          variant: 'success',
          appendToast: true,
          solid: true,
        })
        await this.$router.push('/')
      } catch (e) {
        this.$bvToast.toast('Error Editando', {
          title: '',
          variant: 'danger',
          appendToast: true,
          solid: true,
        })
      }
      this.$set(this, 'editing', false)
    },
    onResetEdit() {
      this.editing = false
    },
    ponderar(saldo, ponderacion) {
      return (saldo * ponderacion) / 100
    },
    format(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    async onApplyIndex(){
      var mes = new Date(this.obra.acta_inicio).getUTCMonth() +1
      var año = new Date(this.obra.acta_inicio).getFullYear()
      if(this.fechaAnterior){
        const otroMes = new Date(this.fechaAnterior).getUTCMonth() +1
        const otroAño = new Date(this.fechaAnterior).getFullYear()
        await this.$store.dispatch('indices/search', {
          mes: otroMes,
          año: otroAño,
        })
      } else {
        await this.$store.dispatch('indices/search', {
          mes: mes,
          año: año,
        })
      }
      this.origenMateriales = this.$store.state.indices.indices[0].valor
      this.origenGenerales = this.$store.state.indices.indices[1].valor
      this.origenManoObra = this.$store.state.indices.indices[2].valor
      this.origenEquipos = this.$store.state.indices.indices[3].valor
      const mes2 = new Date(this.fechaCancelacion).getUTCMonth() +1
      const año2 = new Date(this.fechaCancelacion).getFullYear()
      await this.$store.dispatch('indices/search', {
        mes: mes2,
        año: año2,
      })
      this.destinoMateriales = this.$store.state.indices.indices[0].valor
      this.destinoGenerales = this.$store.state.indices.indices[1].valor
      this.destinoManoObra = this.$store.state.indices.indices[2].valor
      this.destinoEquipos = this.$store.state.indices.indices[3].valor

    },
    redeterminarMateriales(monto) {
      return monto * ( (this.destinoMateriales/this.origenMateriales) -1)
    },
    redeterminarGenerales(monto) {
      return monto * ( (this.destinoGenerales/this.origenGenerales) -1)
    },
    redeterminarManoObra(monto) {
      return monto * ( (this.destinoManoObra/this.origenManoObra) -1)
    },
    redeterminarEquipos(monto) {
      return monto * ( (this.destinoEquipos/this.origenEquipos) -1)
    },
    async onGuardar(){
      for (var i = 0; i < this.certificado.items.length; i++) {
        this.redeterminacion.push({
          item: this.certificado.items[i].item,
          saldo: this.obra.items[i].saldo,
          materiales: this.redeterminarMateriales(this.ponderar(this.certificado.items[i].saldo, this.obra.ponderacion[0].porcentaje)),
          generales: this.redeterminarGenerales(this.ponderar(this.certificado.items[i].saldo,this.obra.ponderacion[1].porcentaje)),
          manoObra: this.redeterminarManoObra(this.ponderar(this.certificado.items[i].saldo,this.obra.ponderacion[2].porcentaje)),
          equipos: this.redeterminarEquipos(this.ponderar(this.certificado.items[i].saldo,this.obra.ponderacion[3].porcentaje)),
        })
      }
      try {
        const userToken = this.$store.state.user.token
        await this.$store.dispatch('redeterminaciones/create', {
          obra: this.obra.id,
          certificado: this.certificado.id,
          items: this.redeterminacion,
          userToken,
        })
        this.$bvToast.toast('Creada correctamente', {
          title: 'Creada',
          variant: 'success',
          appendToast: true,
          solid: true,
        })
        await this.$router.push('/obra/feed')
      } catch (e) {
        this.$bvToast.toast('Error creando la redeterminación', {
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

<style type="text/css">
/* Layout: */

.col-main {
  flex: 1;
}

.col-complementary {
  flex: 1;
}

.col strong{
  margin-bottom: 0%;
}
/* Responsive: */

@media only screen and (min-width: 640px) {
  .layout {
    display: flex;
  }
}

/* etc */

/* body {
  margin: 1.5em;
} */

.container {
  max-width: 70em;
  margin-right: auto;
  margin-left: auto;
}

.col {
  padding: 1em;
  margin: 0 2px 2px 0;
}


</style>
