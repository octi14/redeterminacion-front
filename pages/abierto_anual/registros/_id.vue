<template>
    <div class="page main-background">
      <Banner title="Detalles de solicitud"/>
      <div v-if="!tramite" class="text-center mt-3">
        <h2> Cargando </h2>
        <h4> Por favor espere unos segundos </h4>
      </div>
      <!-- Datos del solicitante -->
      <template v-if="tramite">
        <div class="flex col" style="width: 96%">
          <div class="row justify-content-center mt-3">
            <p class="h5"> Número de legajo: <b> {{ tramite.nroLegajo }}  </b></p>
          </div>
          <div class="row justify-content-center mt-3">
            <p class="h5"> CUIT: <b> {{ tramite.cuit }}  </b></p>
          </div>
        </div>
        <!--Datos de facturas-->
        <div class="row justify-content-center">
          <b-col v-for="(periodo, index) in periodos" :key="index" class="col-md-3 col-sm-8 mt-4 mx-2">
              <AbiertoAnualAdminCard
              :id="index"
              :periodo="periodo.periodo"
              :estado="periodo.estado"
              :fecha="periodo.fecha"
              :observaciones="periodo.observaciones"
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
          {
                id: 1001,
                periodo: 1,
                estado: 1,
                fecha: '01/05/2024',
                observaciones: '',
                maxDate: '--/--/--'
            },
            {
                id: 1002,
                periodo: 2,
                estado: 2,
                fecha: '04/05/2024',
                observaciones: '',
                maxDate: '--/--/--'
            },  
            {
                id: 1003,
                periodo: 0,
                estado: 3,
                fecha: '06/05/2024',
                observaciones: '',
                maxDate: '--/--/--'
            },            
            { 
                id: 1004,
                periodo: 2,
                estado: 4,
                fecha: '06/05/2024',
                observaciones: 'observacion ASDF',
                maxDate: '--/--/--'
            },
            {
                id: 1005,
                periodo: 0,
                estado: 5,
                fecha: '11/11/2024',
                observaciones: '',
                maxDate: '--/--/--'
            },
            {
                id: 1006,
                periodo: 1,
                estado: 6,
                fecha: '06/05/2024',
                observaciones: '',
                maxDate: '--/--/--'
            },
            {
                id: 1007,
                periodo: 2,
                estado: 7,
                fecha: '06/05/2024',
                observaciones: '',
                maxDate: '--/--/--'
            },
            {
                id: 1008,
                periodo: 2,
                estado: 8,
                fecha: '06/05/2024',
                observaciones: '',
                maxDate: '--/--/--'
            },
            {
                id: 1009,
                periodo: 2,
                estado: 9,
                fecha: '06/05/2024',
                observaciones: '',
                maxDate: '--/--/--'
            },
            {
                id: 1010,
                periodo: 2,
                estado: 10,
                fecha: '06/05/2024',
                observaciones: '',
                maxDate: '--/--/--'
            },
            {
                id: 1011,
                periodo: 2,
                estado: 11,
                fecha: '06/05/2024',
                observaciones: '',
                maxDate: '--/--/--'
            },
            {
                id: 1012,
                periodo: 2,
                estado: 12,
                fecha: '06/05/2024',
                observaciones: '',
                maxDate: '--/--/--'
            },
            {
                id: 1013,
                periodo: 2,
                estado: 13,
                fecha: '06/05/2024',
                observaciones: '',
                maxDate: '--/--/--'
            },
            {
                id: 1014,
                periodo: 2,
                estado: 14,
                fecha: '06/05/2024',
                observaciones: '',
                maxDate: '--/--/--'
            },
            {
                id: 1015,
                periodo: 2,
                estado: 15,
                fecha: '06/05/2024',
                observaciones: '',
                maxDate: '--/--/--'
            }
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

      //ESTE openDocumento es la prueba fallida de Nico para abrir los docs como modales dentro de la misma pagina
      /*openDocumento(documento, nombreDocumento) {
        const decodedData = atob(documento.data);
        const arrayBuffer = new ArrayBuffer(decodedData.length);
        const arrayBufferView = new Uint8Array(arrayBuffer);

        for (let i = 0; i < decodedData.length; i++) {
          arrayBufferView[i] = decodedData.charCodeAt(i);
        }

        const blob = new Blob([arrayBuffer], { type: documento.contentType });
        const fileURL = URL.createObjectURL(blob);

        this.$bvModal.show('documento-modal'); // Abre el modal
        this.DocumentoModalTitle = nombreDocumento;

        // Utiliza $nextTick para esperar hasta que el componente esté completamente montado
        this.$nextTick(() => {
          const modalContent = document.querySelector('#documento-modal .modal-body'); // Obtén el elemento modal-body

          if (modalContent) {
            if (documento.contentType === 'application/pdf') {
              const embed = document.createElement('iframe');
              embed.setAttribute('type', 'application/pdf');
              embed.setAttribute('src', fileURL);
              embed.setAttribute('width', '100%');
              embed.setAttribute('height', '100%');
              modalContent.appendChild(embed);
            } else if (documento.contentType.startsWith('image/')) {
              const img = document.createElement('img');
              img.setAttribute('src', fileURL);
              img.style.maxWidth = '100%';
              img.style.maxHeight = '100%';
              img.style.display = 'block';
              img.style.margin = 'auto';
              modalContent.appendChild(img);
            } else {
              console.log('Formato de contenido no compatible');
            }
          } else {
            console.log('No se encontró modalContent en el DOM');
          }
        });
      },*/
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

  @media only screen and (min-width: 640px) {
    .layout {
      display: flex;
      max-width: 90%;
      margin: auto;
    }
  }

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
