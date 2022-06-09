<template>
  <div class="page">
    <template v-if="certificado">
      <div class="container mx-auto">
        <div class="row mx-auto" v-if="obra">
          <div class="col mx-auto">
          <div class="container mx-auto">
          <!-- Edit -->
          <!-- <CertificadoForm
          v-show="adding"
          :obra="obra"
          @submit="onSubmitCreateCertif">
          </CertificadoForm> -->
          <!-- View -->
          <h2 class="mx-auto text-center"> Redeterminar certificado </h2>

            <!-- <b-button class="col-md-3 badge-success"
              variant="info"
              @click="agregarCertif"
            >
              Agregar certificado
            </b-button> -->
          <b-form class="col mx-auto">
            <h5> Acta de inicio: {{ this.obra.acta_inicio }} </h5>
            <h6> Introducir fecha de cancelación </h6>
            <b-form-input class="col-md-2" placeholder="Mes" v-model="indiceDestino"> </b-form-input>
            <b-form-input class="col-md-2" placeholder="Año" v-model="indiceDestino"> </b-form-input>
            <p> Los importes se calcularán teniendo en cuenta la variación entre los índices de los meses de cancelación y de acta de inicio. </p>
            <b-button type="submit" variant="primary"> Aplicar índices </b-button>
          </b-form>
          <div class="row mx-auto">
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

          </div>

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
            <div class="container" v-for="item in certificado.items" :key="item.id">
              <div class="layout">
                <a class="col mx-auto" role="complementary">
                  <h4>{{ item.item }}</h4>
                </a>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Saldo original</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>${{ format(item.saldo) }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Proporcional materiales</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>${{ format(ponderar(item.saldo, obra.ponderacion[0].porcentaje)) }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Proporcional mano de obra</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>${{ format(ponderar(item.saldo, obra.ponderacion[1].porcentaje)) }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Proporcional combustible</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>${{ format(ponderar(item.saldo, obra.ponderacion[2].porcentaje)) }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Proporcional gastos generales</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>${{ format(ponderar(item.saldo, obra.ponderacion[3].porcentaje)) }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Saldo redeterminado</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>${{ item.saldo }} </a>
                </p>
              </div>

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
      fechaDestino: null,
      indiceOrigen: null,
      indiceDestino: null,
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
  },
  fetchOnServer: false,
  computed: {
    // formattedDate() {
    //   const formatter = new Intl.DateTimeFormat('es-AR', {
    //     dateStyle: 'full',
    //     timeStyle: 'short',
    //   })
    //   return formatter.format(this.obra.fecha_contrato)
    // },
  },
  activated() {
    this.certificado = null
    this.obra = null
    this.$fetch()
  },
  methods: {
    agregarCertif() {
      this.adding = !this.adding
    },
    editObra() {
      this.editing = true
    },
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
