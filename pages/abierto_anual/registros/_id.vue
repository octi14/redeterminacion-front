<template>
    <div class="page main-background">
      <Banner title="Detalles de solicitud"/>
      <div v-if="!tramite" class="text-center mt-3">
        <h2> Cargando </h2>
        <h4> Por favor espere unos segundos </h4>
      </div>
      <!-- Datos del solicitante -->
      <template v-if="tramite">
        <div class="flex col title-row" style="width: 96%">
          <div class="row justify-content-center mt-3">
            <p class="h5"> Número de legajo: <b> {{ tramite.nroLegajo }}  </b></p>
          </div>
          <div class="row justify-content-center mt-3">
            <p class="h5"> CUIT: <b> {{ tramite.cuit }}  </b></p>
          </div>
        </div>
        <!--Datos de facturas-->
        <div class="row justify-content-center">
          <b-col v-for="(periodo, index) in tramite.status" :key="index" cols="12" sm="8" md="6" lg="4" xl="4">
              <AbiertoAnualAdminCard
              :id="index"
              :periodo="index"
              :estado="periodo"
              :fecha="tramite.fechasCarga[index]"
              :observaciones="tramite.observaciones"
              />
          </b-col>
        </div>
      </template>

      <div class="text-center mt-3">
        <NuxtLink to="/abierto_anual/registros">
          <b-button variant="primary">Volver</b-button>
        </NuxtLink>
      </div>

      <b-modal v-model="showObservaciones" header-bg-variant="primary" title="Observaciones" title-class="text-light" hide-footer centered>
        <p v-html="observaciones"></p>
      </b-modal>

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
        observaciones: '',
        showDocumentoModal: false,
        DocumentoModalTitle: "",
      }
    },
    computed: {
      adminComercio(){
        return this.$store.state.user.admin == "comercio" || this.$store.state.user.admin == "master"
      },
      facturas(){
        return this.$store.state.facturas.all
      }
    },
    async fetch() {
      const tramiteId = this.$route.params.id
      await this.$store.dispatch('abiertoAnual/getSingle',{
        id: tramiteId,
      })
      this.tramite = this.$store.state.abiertoAnual.single

      await this.$store.dispatch('facturas/getById', {
        id: tramiteId,
      })

    },
    fetchOnServer: false,
    activated() {
      this.$fetch()
    },
    methods: {
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
        if(this.habilitacion.observaciones){
          this.observaciones = this.habilitacion.observaciones.split('-').join('<br>')
        }else{
          this.observaciones = "No hay observaciones para mostrar."
        }
        this.showObservaciones = true
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
    .title-row {
      margin-left: 0 !important;
      margin-right: 0 !important;
      margin-bottom: 2rem !important;
    }
  }
  .modal-dialog {
    max-width: 80% !important;
  }

  .col-main {
    flex: 1;
  }

  .col-complementary {
    flex: 1;
  }

  .icon-orange{
    color: #E27910;
  }

  .col strong{
    margin-bottom: 0%;
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

  .col {
    padding: 0.4em;
    margin: 0 2px 2px 40px;
  }
  </style>
