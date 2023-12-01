<template>
  <div class="page main-background">
    <Banner title="Detalle de obra"/>
    <div v-if="obra">
      <div class="container my-3 col-sm-12">
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
              <!-- Buttons -->
              <div v-show="!editing" class="row mt-4 mb-4 justify-content-center">
                <div class="col-12 d-flex flex-wrap justify-content-center">
                  <b-button pill class="fixed-size-button btn-4 mb-2 mx-2" :variant="button.variant" v-for="(button, index) in filteredButtons" :key="index" @click="button.action">
                    <b>{{ button.label }}</b>
                  </b-button>
                </div>
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
            <!-- Body -->
            <div class="card shadow-card col-lg-6 col-sm-12 mx-auto" v-if="!adding && !editing">
              <div class="obra-content col-12 mx-auto mt-3 mb-4">
                <div class="layout">
                  <p class="col col-main">
                    <strong style="color:green">Expediente</strong>
                  </p>
                  <p class="col col-complementary" role="complementary">
                    <a>{{ obra.expediente }}</a>
                  </p>
                </div>
                <div class="layout">
                  <p class="col col-main">
                    <strong style="color:green">Cotización</strong>
                  </p>
                  <p class="col col-complementary" role="complementary">
                    <a>${{ format(obra.cotizacion) }}</a>
                  </p>
                </div>
                <div class="layout">
                  <p class="col col-main">
                    <strong style="color:green">Proveedor</strong>
                  </p>
                  <p class="col col-complementary" role="complementary">
                    <a>{{ obra.proveedor }}</a>
                  </p>
                </div>
                <div class="layout">
                  <p class="col col-main">
                    <strong style="color:green">Presupuesto oficial</strong>
                  </p>
                  <p class="col col-complementary" role="complementary">
                    <a>${{ format(obra.presup_oficial) }}</a>
                  </p>
                </div>

                  <div v-if="watchItems">
                    <b-button variant="outline-dark" class="my-3" @click="watchItems = !watchItems"> Ocultar Items </b-button>
                    <div class="layout" v-for="(_,index) in obra.items" :key="index">
                      <p class="col col-main">
                        <strong style="color:green" class="h6"> - {{index +1}}. {{obra.items[index].item}} </strong>
                      </p>
                      <p class="col col-complementary" role="complementary">
                        <a> ${{ format(obra.items[index].monto) }} </a>
                      </p>
                    </div>
                  </div>
                  <div v-else class="my-1 ml-3 mt-3">
                    <b-button variant="outline-dark" @click="watchItems = !watchItems"> Ver Items </b-button>
                  </div>

                <div class="layout">
                  <p class="col col-main">
                    <strong style="color:green">Garantía Contrato</strong>
                  </p>
                  <p class="col col-complementary">
                    <a>${{ format((obra.cotizacion * obra.garantia_contrato) /100) }}</a>
                  </p>
                </div>
                <div class="layout">
                  <p class="col col-main">
                    <strong style="color:green">Adjudicación</strong>
                  </p>
                  <p class="col col-complementary">
                    <a>{{ obra.adjudicacion }}</a>
                  </p>
                </div>
                <div class="layout">
                  <p class="col col-main">
                    <strong style="color:green">Contrato</strong>
                  </p>
                  <p class="col col-complementary">
                    <a>{{ obra.contrato }}</a>
                  </p>
                </div>
                <div class="layout">
                  <p class="col col-main">
                    <strong style="color:green">Fecha de contrato</strong>
                  </p>
                  <p class="col col-complementary">
                    <a>{{ obra.fecha_contrato }}</a>
                  </p>
                </div>
                <div class="layout">
                  <p class="col col-main">
                    <strong style="color:green">Acta de inicio</strong>
                  </p>
                  <p class="col col-complementary">
                    <a>{{ obra.acta_inicio }}</a>
                  </p>
                </div>
                <div class="layout">
                  <p class="col col-main">
                    <strong style="color:green">Ordenanza</strong>
                  </p>
                  <p class="col col-complementary">
                    <a>{{ obra.ordenanza }}</a>
                  </p>
                </div>
                <div class="layout">
                  <p class="col col-main">
                    <strong style="color:green">Decreto</strong>
                  </p>
                  <p class="col col-complementary">
                    <a>{{ obra.decreto }}</a>
                  </p>
                </div>
                <div class="layout">
                  <p class="col col-main">
                    <strong style="color:green">Plazo de obra</strong>
                  </p>
                  <p class="col col-complementary">
                    <a>{{ obra.plazo_obra }}</a>
                  </p>
                </div>
                <div class="layout">
                  <p class="col col-main">
                    <strong style="color:green">Anticipo financiero</strong>
                  </p>
                  <p class="col col-complementary">
                    <a>${{ format(obra.anticipo_finan) }}</a>
                  </p>
                </div>
              </div>
            </div>
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
    filteredButtons() {
      return [
        {
          variant: "success",
          label: this.$data.watchingCertif ? "Ocultar certificados" : "Ver certificados",
          action: this.onShowCertif
        },
        {
          variant: "success",
          label: this.$data.watchingProgress ? "Ocultar avance" : "Ver avance",
          action: this.mostrarAvance
        },
        {
          variant: "success",
          label: this.$data.adding ? "Volver" : "Agregar certificado",
          action: this.agregarCertif
        },
        {
          variant: "success",
          label: "Editar",
          action: this.editObra
        },
        {
          variant: "danger",
          label: "Eliminar",
          action: () => this.$bvModal.show("bv-modal-example")
        }
      ].filter(button => this.shouldShowButton(button));
    },
    isAdmin(){
      return Boolean(this.$store.state.user.admin == "true")
    },
    adminHacienda(){
      return this.$store.state.user.admin == "hacienda"
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
    onShowCertif() {
      this.watchingCertif = !this.watchingCertif
    },
    mostrarAvance() {
      this.watchingProgress = !this.watchingProgress
    },
    agregarCertif() {
      this.adding = !this.adding
    },
    editObra() {
      this.editing = !this.editing
    },
    shouldShowButton(button) {
      if (button.label === "Agregar certificado") {
        return this.adminHacienda && !this.adding;
      } else if (button.label === "Editar") {
        return this.adminHacienda && !this.adding;
      } else if (button.label === "Eliminar") {
        return this.adminHacienda && !this.adding;
      } else {
        return true;
      }
    },
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
        this.$bvToast.toast('Error Editando. Intente cerrar sesión e iniciar nuevamente.', {
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
        const verifiedCert = await this.$store.dispatch('certificados/create', {
          certificado,
          userToken,
        })
        this.obra.certificados.push(verifiedCert.id)
        const obra = this.obra
        await this.$store.dispatch('obras/update', {
          obra,
          userToken,
        })
        // this.editing = false
        await this.$router.push('/')
      } catch (e) {
        this.$bvToast.toast('Error Editando. Intente cerrar sesión e iniciar nuevamente.', {
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
        this.$bvToast.toast('Error Editando. Intente cerrar sesión e iniciar nuevamente.', {
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

/* Responsive: */

@media only screen and (min-width: 640px) {
  .layout {
    display: flex;
  }
}

.fixed-size-button {
  width: 206px; /* Tamaño fijo deseado */
}

@media (max-width: 767px) {
  .fixed-size-button {
    width: 100%; /* Ancho completo en dispositivos móviles */
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
