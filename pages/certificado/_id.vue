<template>
  <div class="page">
    <template v-if="certificado">
      <div class="container my-1 col-sm-12">
        <div class="row">
          <div class="col">
            <h1 class="h2 text-center">{{ certificado.certificacion }}</h1>
            <h4 class="h4 text-center">Fecha: {{ certificado.fecha }}</h4>
          <div class="container my-1">
          <!-- Edit -->
          <!-- <ObraForm
            v-show="editing"
            :obra="obra"
            @submit="onSubmitEditObra"
            @reset="editing = false"
          ></ObraForm> -->
          <CertificadoForm
          v-show="adding"
          :obra="obra"
          @submit="onSubmitCreateCertif">
          </CertificadoForm>
          <!-- View -->

            <b-button class="col-md-3 badge-success"
              variant="info"
              @click="agregarCertif"
            >
              Agregar certificado
            </b-button>

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

            <b-modal id="bv-modal-example" hide-footer>
              <template #modal-title>
                Eliminar certificado
              </template>
              <div class="d-block text-center">
                <h3>Está seguro de que desea eliminar este certificado?</h3>
              </div>
              <b-button class="mt-3" variant="danger" block @click="onSubmitDelete">Si</b-button>
              <b-button class="mt-3" variant="secondary" block @click="$bvModal.hide('bv-modal-example')">No</b-button>
            </b-modal>
          </div>
        </div>
            <div class="container">
              <div class="layout">
                <p class="col col-main">
                  <strong>Certificación</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>{{ certificado.certificacion }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Fecha</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>${{ certificado.fecha }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Factura</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>{{ certificado.factura }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Fecha cancelación</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>${{ certificado.fecha_cancelacion }}</a>
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
      editing: false,
      adding: false,
      certificado: null,
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
        await this.$store.dispatch('certificados/create', {
          certificado,
          userToken,
        })
        // this.editing = false
        // await this.$router.push('/')
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
