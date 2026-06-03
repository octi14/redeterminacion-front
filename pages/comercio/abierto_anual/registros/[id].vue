<template>
    <div class="page main-background">
      <Banner title="Detalles de solicitud"/>
      <LoadingState
        v-if="loading"
        size="lg"
        variant="primary"
      />
      <!-- Datos del solicitante -->
      <template v-if="tramite && adminArvige">
        <div class="title-row text-center mx-auto">
          <p class="h5 mt-3 mb-0"> Número de legajo: <b> {{ tramite.nroLegajo }}  </b></p>
          <p class="h5 mt-3 mb-0"> CUIT: <b> {{ tramite.cuit }}  </b></p>
        </div>
        <!--Datos de facturas-->
        <div class="row no-gutters justify-content-center abierto-anual-registros-cards">
          <b-col v-for="(periodo, index) in periodosEstado" :key="index" cols="12" sm="10" md="6" lg="4" xl="4">
              <AbiertoAnualAdminCard
              :id="index"
              :periodo="index"
              :estado="periodo"
              :fecha="Array.isArray(tramite.fechasCarga) ? tramite.fechasCarga[index] : null"
              :observaciones="observacionPeriodo(index)"
              />
          </b-col>
        </div>
      </template>

      <div class="page-btn-volver-wrap">
        <NuxtLink to="/comercio/abierto_anual/registros">
          <b-button variant="primary" size="sm" class="page-btn-volver">Volver</b-button>
        </NuxtLink>
      </div>

      <BModal v-model="showObservaciones" header-bg-variant="primary" title="Observaciones" title-class="text-light" no-footer centered>
        <p v-html="observaciones"></p>
      </BModal>

    </div>
  </template>

  <script>
  import AbiertoAnualAdminCard from '~/components/comercio/AbiertoAnualAdminCard.vue';
  export default {
    components: {
      AbiertoAnualAdminCard
    },
    data() {
      return {
        statusClasses: {
          'Incompleto': 'text-disabled',
          'En revisión': 'text-lightblue',
          'Incorrecto': 'text-danger',
          'Correcto': 'text-success',
        },
        periodos: [
        ],
        showRectificacion: false,
        showPrevApprove: false,
        showApprove: false,
        showAprobarBaja: false,
        showFinalizar: false,
        showRejectPopup: false,
        showSolicitarDoc: false,
        showObservaciones: false,
        tramite: null,
        loading: true,
        observaciones: '',
        showDocumentoModal: false,
        DocumentoModalTitle: "",
      }
    },
    computed: {
      adminArvige(){
        const admin = useUserStore().admin
        return admin == "arvige" || admin == "master"
      },
      periodosEstado() {
        if (Array.isArray(this.tramite?.status) && this.tramite.status.length) {
          return this.tramite.status
        }
        return ['Incompleto', 'Incompleto', 'Incompleto']
      },
    },
    async mounted() {
      await this.loadTramite()
    },
    activated() {
      this.loadTramite()
    },
    methods: {
      async loadTramite() {
        this.loading = true
        try {
          await useConfigStore().getAbiertoAnualPeriodos();
          const tramiteId = this.$route.params.id
          await useAbiertoAnualStore().getSingle({
            id: tramiteId,
          })
          this.tramite = useAbiertoAnualStore().single
          if (this.tramite?.id) {
            await useFacturasStore().getById({
              id: this.tramite.id,
            })
          }
        } finally {
          this.loading = false
        }
      },
      getStatusClass(status) {
        return this.statusClasses[status] || '';
      },
      wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      },
      onRectificacion(){
        this.showRectificacion = true
      },
      onSolicitarDocumentacion(){
        this.showSolicitarDoc = true
      },
      onAprobarBaja(){
        this.showAprobarBaja = true
      },
      async onAprobarSolicitud(){
        this.showPrevApprove = true
      },
      onFinalizarSolicitud(){
        this.showFinalizar = true
      },
      onShowObservaciones(){
        if(this.tramite?.observaciones){
          const observaciones = typeof this.tramite?.observaciones === 'string'
            ? this.tramite.observaciones
            : ''
          this.observaciones = observaciones.split('-').join('<br>')
        }else{
          this.observaciones = "No hay observaciones para mostrar."
        }
        this.showObservaciones = true
      },
      observacionPeriodo(index) {
        if (Array.isArray(this.tramite?.facturas) && this.tramite.facturas[index]) {
          return this.tramite.facturas[index].observaciones || ''
        }
        return ''
      },
      onResetEdit() {
        this.editing = false
      },
      format(value) {
          if(value){
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          }else{
            return 0
          }
      },
    },
  }
  </script>

  <style scoped>
  .title-row {
    width: 96%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 2rem;
    text-align: center;
  }

  @media (max-width: 720px){
    .section-subtitle{
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
    .subtitle{
      font-size: 24px !important;
    }
    .sangria{
      margin-left: 0 !important;
    }
    .card{
      width: 90% !important;
      margin-left: 5% !important;
      margin-right: 5% !important;
    }
    .btn{
      width: 9rem !important;
    }
    .bi-exclamation-circle{
      margin: 1rem auto !important;
      width: 100%;
    }
  }
  .modal-dialog {
    max-width: 80% !important;
  }

  /* Responsive: */

  /* etc */
  .iconoAdvertencia {
    position: relative;
    display: inline-block;
  }

  /* Estilo del texto de advertencia */
  .textoHover {
    position: absolute;
    top: -60px; /* Ajusta la posición vertical del texto */
    left: 20px; /* Ajusta la posición horizontal del texto */
    background-color: #fff;
    color: #000;
    padding: 5px;
    width: 450px;
    border-radius: 5px;
    z-index: 1; /* Asegura que esté encima del ícono */
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3); /* Agrega una sombra */
  }

  .text-loading{
    color: #0eb7b2ab;
  }

  /* body {
    margin: 1.5em;
  } */

  .abierto-anual-registros-cards > .col {
    padding: 0.5rem;
    margin: 0;
    display: flex;
    justify-content: center;
  }
  </style>
