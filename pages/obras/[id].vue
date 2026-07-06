<template>
  <div class="page main-background">
    <Banner title="Detalle de obra"/>
    <div v-if="obra">
      <div class="my-3 col-sm-12">
        <div class="row">
          <div class="col">
            <h1 class="h2 text-center">{{ obra.objeto }}</h1>
            <h4 class="h4 text-center">Adjudicado: {{ obra.adjudicado }}</h4>
            <!-- Buttons -->
            <div class="my-1">
              <div v-show="!editing && adminHacienda" class="row mt-4 mb-4 justify-content-center">
                <div class="col-12 d-flex flex-wrap justify-content-center">
                  <b-button class="fixed-size-button btn-4 mb-2 mx-2" :variant="button.variant" v-for="(button, index) in filteredButtons" :key="index" @click="button.action">
                    {{ button.label }}
                  </b-button>
                </div>
              </div>
            </div>

            <BModal size="lg" v-model="editing" header-bg-variant="info" no-footer title="Editar Obra">
              <ObraForm :obra="obra" @submit="onSubmitEditObra" @reset="editing = false"/>
            </BModal>
            <BModal header-bg-variant="info" no-footer v-model="adding" title="Asignar certificado a esta obra">
              <CertificadoForm
                :obra="obra"
                @submit="onSubmitCreateCertif"/>
            </BModal>
            <CertificadoFeed
              v-show="watchingCertif"
              :obra="obra"/>
            <BModal id="obraProgressModal" v-model="watchingProgress" header-bg-variant="info" title="Avance de la Obra" size="lg" no-footer>
              <ObraProgress class="mx-auto" :obra="obra"/>
            </BModal>

            <!-- Body -->
            <div class="card shadow-card col-md-6 col-sm-12 mx-auto" v-if="!adding && !editing">
              <div class="col-12 mx-auto mt-3 mb-4">
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
            <!--Modal Eliminar archivo-->
            <BModal v-model="showDeleteModal" centered header-bg-variant="danger">
              <template #header>
                <div class="centeredContainer mx-auto my-2">
                  <i class="bi bi-trash-fill text-light"></i>
                </div>
              </template>
              <div class="d-block text-center">
                <h4 class="text-danger"><b> Eliminar obra </b></h4>
                <h5>Está seguro de que desea eliminar esta obra?</h5>
                <p class="small">Al eliminar una obra, se eliminarán todos sus certificados y redeterminaciones. </p>
              </div>
              <template #footer>
                <div class="row mx-auto">
                  <b-button class="mt-2 mx-1" variant="success" @click="onSubmitDelete(); showDeleteModal = false">Eliminar</b-button>
                  <b-button class="mt-2" variant="danger" @click="showDeleteModal = false">Cancelar</b-button>
                </div>
              </template>
            </BModal>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['authenticated', 'require-admin'],
  adminRoles: ['hacienda', 'master'],
})
</script>

<script>
export default {
  setup(){ const { showToast } = useProjectToast(); return { showToast } },
  data() {
    return {
      watchingCertif: false,
      watchingProgress: false,
      watchItems: false,
      editing: false,
      adding: false,
      showDeleteModal: false,
    }
  },
  async mounted() {
    await this.loadObra()
  },
  computed: {
    obra(){
      return useObrasStore().single
    },
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
          variant: this.watchingProgress ? "danger" : "success",
          label: this.watchingProgress ? "Ocultar avance" : "Ver avance",
          action: this.toggleProgress
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
          action: () => { this.showDeleteModal = true }
        }
      ].filter(button => this.shouldShowButton(button));
    },
    isAdmin(){
      return Boolean(useUserStore().admin == "true")
    },
    adminHacienda(){
      const admin = useUserStore().admin
      return admin == "hacienda" || admin == "master"
    },
  },
  activated() {
    this.watchingCertif = false
    this.editing = false
    this.adding = false
    this.showDeleteModal = false
    void this.loadObra()
  },
  methods: {
    async loadObra() {
      const obraId = this.$route.params.id
      await useObrasStore().getSingle({
        id: obraId,
      })
    },
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
    toggleProgress() {
      this.watchingProgress = !this.watchingProgress;
    },
    async onSubmitEditObra({ obra }) {
      try {
        const userToken = useUserStore().token
        await useObrasStore().update({
          obra,
          userToken,
        })
        // this.editing = false
        this.showToast('', {
          title: 'Archivo actualizado.',
          variant: 'success',
          appendToast: true,
          solid: true,
        })
        await this.$router.push('/')
      } catch (e) {
        this.showToast('Error Editando. Intente cerrar sesión e iniciar nuevamente.', {
          title: 'Error',
          variant: 'danger',
          appendToast: true,
          solid: true,
        })
      }
    },
    async onSubmitCreateCertif({ certificado }) {
      try {
        const userToken = useUserStore().token
        const verifiedCert = await useCertificadosStore().create({
          certificado,
          userToken,
        })
        this.obra.certificados.push(verifiedCert.id)
        const obra = this.obra
        await useObrasStore().update({
          obra,
          userToken,
        })
        // this.editing = false
        await this.$router.push('/')
      } catch (e) {
        this.showToast('Error Editando. Intente cerrar sesión e iniciar nuevamente.', {
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
        const userToken = useUserStore().token
        const id = this.$route.params.id

        await useObrasStore().delete({
          id: id,
          userToken,
        })
        this.showToast('Eliminada correctamente', {
          title: '',
          variant: 'success',
          appendToast: true,
          solid: true,
        })
        await this.$router.push('/')
      } catch (e) {
        this.showToast('Error Editando. Intente cerrar sesión e iniciar nuevamente.', {
          title: '',
          variant: 'danger',
          appendToast: true,
          solid: true,
        })
      }
      this.editing = false
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


.centeredContainer{
    width:  auto;
    margin: auto;
    text-align: center;
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
