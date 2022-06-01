<template>
  <div class="page">
    <template v-if="obra">
      <!-- <img
        v-if="recipe.image"
        :src="recipe.image"
        :alt="recipe.name"
        style="
          display: block;
          height: 100%;
          max-height: 50vh;
          width: 100%;
          object-fit: cover;
        "
      /> -->
      <div class="container my-1 col-sm-12">
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
          <!-- View -->
          <div v-show="!editing" class="row justify-content-center">

            <b-button class="col-md-3 badge-success"
              variant="info"
              @click="onShowCertif"
            >
              Ver certificados
            </b-button>

            <b-button v-if="!adding" class="col-md-3 badge-success"
              variant="info"
              @click="agregarCertif"
            >
              Agregar certificado
            </b-button>

            <b-button v-else class="col-md-3 badge-success"
              variant="info"
              @click="agregarCertif"
            >
              Volver
            </b-button>

            <b-button v-if="!adding" class="col-md-3 badge-success"
              variant="info"
              @click="editObra"
            >
              Editar
            </b-button>

            <b-button
              v-if="!adding"
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
                <h3>Está seguro de que desea eliminar este archivo?</h3>
              </div>
              <b-button class="mt-3" variant="danger" block @click="onSubmitDelete">Si</b-button>
              <b-button class="mt-3" variant="secondary" block @click="$bvModal.hide('bv-modal-example')">No</b-button>
            </b-modal>
          </div>
        </div>
            <div class="container" v-if="!adding && !editing">
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
                  <a>${{ obra.cotizacion }}</a>
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
                  <a>${{ obra.presup_oficial }}</a>
                </p>
              </div>
              <div>
                <div class="layout" v-for="item in obra.items" :key="item.item">
                  <p class="col col-main">
                    <strong class="h6"> - {{item.item}} </strong>
                  </p>
                  <p class="col col-complementary" role="complementary">
                    <a> ${{item.monto}} </a>
                  </p>
                </div>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Garantía Contrato</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>{{ obra.garantia_contrato }}%</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Adjudicación</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>${{ obra.adjudicacion }}</a>
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
                  <a>{{ obra.anticipo_finan }}</a>
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
    </template>
  </div>
</template>

<script>
import ObraService from '~/service/obra'

export default {
  data() {
    return {
      watchingCertif: false,
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
