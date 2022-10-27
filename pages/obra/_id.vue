<template>
  <div class="page background">
    <div v-if="obra">
      <div class="container my-4 col-sm-12">
        <div class="row">
          <div class="col">
            <h1 class="h2 text-center">{{ obra.objeto }}</h1>
            <h4 class="h4 text-center">Adjudicado: {{ obra.adjudicado }}</h4>
          <div class="container my-1">
          <!-- Edit -->
          <ObraForm
            v-show="editing"
            :obra="obra"
            @submit="onSubmitEditObra"
            @reset="editing = false"
          ></ObraForm>
          <CertificadoForm
          v-show="adding"
          :obra="obra"
          @submit="onSubmitCreateCertif">
          </CertificadoForm>
          <CertificadoFeed
          v-show="watchingCertif"
          :obra="obra">
          </CertificadoFeed>
          <ObraProgress
          v-show="watchingProgress"
          :obra="obra">
          </ObraProgress>
          <!-- View -->
          <div v-show="!editing" class="row justify-content-center">

            <b-button class="col-md-3 badge-success"
              variant="info"
              @click="onShowCertif"
            >
            {{ watchingCertif ? 'Ocultar' : 'Ver' }} certificados
            </b-button>


            <b-button v-if="!adding" class="col-md-3 badge-success"
              variant="info"
              @click="mostrarAvance">
              {{ watchingProgress ? 'Ocultar' : 'Ver' }} avance
            </b-button>

            <b-button v-if="isAdmin" class="col-md-3 badge-success"
              variant="info"
              @click="agregarCertif"
            >
            {{ adding ? 'Volver' : 'Agregar certificado' }}
            </b-button>

            <b-button v-if="!adding && isAdmin" class="col-md-3 badge-success"
              variant="info"
              @click="editObra"
            >
              Editar
            </b-button>


            <b-button
              v-if="!adding && isAdmin"
              class="col-md-3"
              block
              variant="danger"
              @click="$bvModal.show('bv-modal-example')"
            >
              Eliminar
            </b-button>

            <b-modal id="bv-modal-example" hide-footer>
              <template #modal-title>
                Eliminar archivo
              </template>
              <div class="d-block text-center">
                <h4>Está seguro de que desea eliminar este archivo?</h4>
                <h6>Al eliminar un archivo, se eliminarán todos sus certificados y redeterminaciones. </h6>
              </div>
              <b-button class="mt-3" variant="danger" block @click="onSubmitDelete(); $bvModal.hide('bv-modal-example')">Si</b-button>
              <b-button class="mt-3" variant="secondary" block @click="$bvModal.hide('bv-modal-example')">No</b-button>
            </b-modal>
          </div>
        </div>
            <div class="card shadow-lg col-8 mx-auto" v-if="!adding && !editing">
              <div class="layout">
                <p class="col col-main">
                  <strong>Expediente</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>{{ obra.expediente }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Cotización</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>${{ format(obra.cotizacion) }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Proveedor</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>{{ obra.proveedor }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Presupuesto oficial</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>${{ format(obra.presup_oficial) }}</a>
                </p>
              </div>

              <div>
                <div class="container" v-if="watchItems">
                  <b-button variant="outline-dark" class="my-3" @click="watchItems = !watchItems"> Ocultar Items </b-button>
                  <div class="layout" v-for="(_,index) in obra.items" :key="index">
                    <p class="col col-main">
                      <strong class="h6"> - {{index +1}}. {{obra.items[index].item}} </strong>
                    </p>
                    <p class="col col-complementary" role="complementary">
                      <a> ${{ format(obra.items[index].monto) }} </a>
                    </p>
                  </div>
                </div>
                <div v-else class="my-1 ml-4 mt-3">
                  <b-button variant="outline-dark" @click="watchItems = !watchItems"> Ver Items </b-button>
                </div>
              </div>

              <div class="layout">
                <p class="col col-main">
                  <strong>Garantía Contrato</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>${{ format((obra.cotizacion * obra.garantia_contrato) /100) }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Adjudicación</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>{{ obra.adjudicacion }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Contrato</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>{{ obra.contrato }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Fecha de contrato</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>{{ obra.fecha_contrato }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Acta de inicio</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>{{ obra.acta_inicio }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Ordenanza</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>{{ obra.ordenanza }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Decreto</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>{{ obra.decreto }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Plazo de obra</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>{{ obra.plazo_obra }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Anticipo financiero</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>${{ format(obra.anticipo_finan) }}</a>
                </p>
              </div>
            </div>

            <!-- <h2 class="h3">Instrucciones</h2>
            <template v-for="(step, index) in recipe.instructions">
              <div
                :key="step.description"
                class="recipe-step my-2 py-2 border-bottom"
              >
                <h3 class="h4 py-2 sticky-top bg-white">
                  Paso {{ index + 1 }}{{ step.title ? `: ${step.title}` : '' }}
                </h3>
                <div class="recipe-step-content">
                  <b-img v-if="step.image" fluid-grow :src="step.image" />
                  <p>{{ step.description }}</p>
                </div>
              </div>
            </template> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ObraService from '~/service/obra'

export default {
  middleware: ['authenticated'],
  data() {
    return {
      watchingCertif: false,
      watchingProgress: false,
      watchItems: false,
      editing: false,
      adding: false,
      obra: null,
    }
  },
  async fetch() {
    const obraId = this.$route.params.id
    this.obra = await ObraService.getSingle(this.$axios, {
      id: obraId,
    })
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
    isAdmin(){
      return Boolean(this.$store.state.user.admin == "true")
    },
  },
  activated() {
    this.obra = null
    this.watchingCertif = false
    this.editing = false
    this.adding = false
    this.$fetch()
  },
  methods: {
    agregarCertif() {
      this.adding = !this.adding
    },
    editObra() {
      this.editing = true
    },
    onShowCertif() {
      this.watchingCertif = !this.watchingCertif
    },
    async mostrarAvance() {
      this.watchingProgress = !this.watchingProgress
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
        await this.$router.push('/')
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
    format(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    isAdmin(){
      return (this.$store.state.user.admin == true) || (this.$store.state.user.admin == "true")
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

/* .container {
  max-width: 60em;
  margin-right: auto;
  margin-left: auto;
} */

.col {
  padding: 1em;
  margin: 0 2px 2px 0;
}


</style>
