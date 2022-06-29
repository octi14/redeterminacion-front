<template>
  <div class="page">
    <template v-if="certificado">
      <div class="container mx-auto">
        <div class="row mx-auto" v-if="obra">
          <div class="col mx-auto">
          <div class="container mx-auto">
          <!-- Edit -->
          <!-- View -->
          <h2 class="mx-auto text-center"> Redeterminar certificado </h2>

            <!-- <b-button class="col-md-3 badge-success"
              variant="info"
              @click="agregarCertif"
            >
              Agregar certificado
            </b-button> -->
          <b-form class="col mx-auto">
            <h5 class="col-main"> Acta de inicio: {{ this.obra.acta_inicio }} </h5>
            <h6> Fecha de última redeterminación: </h6>
            <b-form-input class="col-md-2" placeholder="Mes" v-model="fechaAnterior" type="date"> </b-form-input>
            <p> En caso de ser la primera redeterminación, se tomará como índice origen el correspondiente al mes de inicio de la obra. </p>
            <hr/>
            <h6> Fecha de cancelación: </h6>
            <b-form-input class="col-md-2" placeholder="Mes" v-model="fechaCancelacion" type="date"> </b-form-input>
          </b-form>
          <b-button variant="primary" @click="onApplyIndex"> Aplicar índices </b-button>
          <!-- <div class="row mx-auto">
            <b-button class="col-md-3 badge-success"
              variant="info"
              @click="editObra"
            >
              Editar
            </b-button>

            <b-button
              class="col-md-3"
              block
              variant="danger"
              @click="$bvModal.show('bv-modal-example')"
            >
              Eliminar
            </b-button>

          </div> -->

            <!-- <b-modal id="bv-modal-example" hide-footer>
              <template #modal-title>
                Eliminar certificado
              </template>
              <div class="d-block text-center">
                <h3>Está seguro de que desea eliminar este certificado?</h3>
              </div>
              <b-button class="mt-3" variant="danger" block @click="onSubmitDelete">Si</b-button>
              <b-button class="mt-3" variant="secondary" block @click="$bvModal.hide('bv-modal-example')">No</b-button>
            </b-modal> -->
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
              <!-- <hr/> -->
              <br>
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
              <div class="layout">
                <p class="col col-main">
                  <strong class="h4">Total redeterminado </strong>
                  <p class="col col-complementary">$ {{ totales[index] }} </p>
              </div>
              <hr />
          </div>
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
  },
  fetchOnServer: false,
  activated() {
    this.certificado = null
    this.obra = null
    this.$fetch()
  },
  methods: {
    async onSubmitEditObra({ obra }) {
      try {
        const userToken = this.$store.state.user.token
        await this.$store.dispatch('obras/update', {
          obra,
          userToken,
        })
        // this.editing = false
        this.$bvToast.toast('', {
          title: 'Archivo actualizado.',
          variant: 'success',
          appendToast: true,
          solid: true,
        })
        await this.$router.push('/')
      } catch (e) {
        this.$bvToast.toast('Error Editando', {
          title: 'Error',
          variant: 'danger',
          appendToast: true,
          solid: true,
        })
      }
    },
    async onSubmitCreateCertif({ certificado }) {
      try {
        const userToken = this.$store.state.user.token
        await this.$store.dispatch('certificados/create', {
          certificado,
          userToken,
        })
        // this.editing = false
        // await this.$router.push('/')
      } catch (e) {
        this.$bvToast.toast('Error Editando', {
          title: 'Error',
          variant: 'danger',
          appendToast: true,
          solid: true,
        })
      }
      this.adding = false
    },
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
      const mes = new Date(this.obra.acta_inicio).getUTCMonth() +1
      const año = new Date(this.obra.acta_inicio).getFullYear()
      if(this.fechaAnterior){
        mes = new Date(this.fechaAnterior).getUTCMonth() +1
        año = new Date(this.fechaAnterior).getFullYear()
      }
      await this.$store.dispatch('indices/search', {
        mes: mes,
        año: año,
      })
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
    }
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
