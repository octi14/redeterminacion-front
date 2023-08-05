<template>
  <div class="page">
    <Banner title="Detalles de solicitud"/>
    <div v-if="!habilitacion" class="text-center mt-3">
      <h2> Cargando </h2>
      <h4> Por favor espere unos segundos </h4>
    </div>
    <!-- Datos del solicitante -->
    <template v-if="habilitacion">
      <div class="row justify-content-center mt-3">
        <p class="h4">         Número de trámite: <b> {{ habilitacion.nroTramite }}  </b></p>
      </div>
      <div class="row justify-content-center mt-3">

        <p class="h4"> Estado:
          <h4 class="text-primary ml-1" v-if="habilitacion.status === 'En revisión'">{{ habilitacion.status }} </h4>
          <h4 class="text-success ml-1" v-if="habilitacion.status === 'Aprobada'">{{ habilitacion.status }} </h4>
          <h4 class="text-danger ml-1" v-if="habilitacion.status === 'Rechazada'">{{ habilitacion.status }} </h4>
          <h4 class="text-secondary ml-1" v-if="habilitacion.status === 'Pendiente'">{{ habilitacion.status }} </h4>
      </div>
      <div class="row col-10 mx-auto justify-content-center">
        <b-button @click="onAprobarSolicitud" variant="success" pill class="btn-4 mt-3 mx-1"> Aprobar solicitud </b-button>
        <b-button @click="onRechazarSolicitud" variant="success" pill class="btn-3 mt-3 mx-1"> Rechazar solicitud </b-button>
      </div>
      <div class="container col-md-6 col-sm-8 card shadow-lg mt-4 mx-auto">
          <div class="col mx-auto">
            <div class="container text-center mx-auto">
              <h2 class="text-success mt-2"><b> Datos del solicitante </b></h2>
              <hr/>
            </div>
          </div>
          <div class="container mx-auto">
            <div class="layout">
              <p class="col col-main">
                <strong>Nombre</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ habilitacion.nombre + " " + habilitacion.apellido}}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Número de documento</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ habilitacion.dni }}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>CUIT</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ habilitacion.cuit }}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Razón social</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ habilitacion.razonSocial || "No posee" }}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Domicilio</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ habilitacion.domicilioReal + " (C.P. " + habilitacion.codigoPostal + "), " + habilitacion.localidad + ", " + habilitacion.provincia }}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Número de teléfono</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ habilitacion.telefono }}</a>
              </p>
            </div>
            <br>
          </div>
        </div>
    </template>
    <!-- Datos del inmueble -->
    <template v-if="habilitacion">
      <div class="container col-md-6 col-sm-8 card shadow-lg mt-4 mx-auto">
          <div class="col mx-auto">
            <div class="container text-center mx-auto">
              <h2 class="text-success mt-2"><b> Datos del inmueble </b></h2>
              <hr/>
            </div>
          </div>
          <div class="container justify-content-center mx-auto">
            <div class="layout">
              <p class="col col-main">
                <strong>Domicilio solicitado</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ habilitacion.calleInmueble + " " + habilitacion.nro + ", " + habilitacion.localidadInmueble}}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Nombre de fantasía</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ habilitacion.nombreFantasia || "No tiene" }}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Rubro solicitado</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ habilitacion.rubro }}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Desea ocupar espacio público</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ habilitacion.espacioPublico ? 'Si' : 'No' }}</a>
              </p>
            </div>
            <br>
          </div>
        </div>
    </template>
    <!-- Documentación -->
    <template v-if="habilitacion">
      <div class="container col-md-6 col-sm-8 card shadow-lg mt-4 mb-3 mx-auto">
        <!-- Resto del contenido del componente -->
        <div class="col mx-auto">
          <div class="container text-center mx-auto">
            <h2 class="text-success mt-2"><b> Documentación presentada </b></h2>
            <hr/>
          </div>
        </div>
        <!-- Mostrar los enlaces a los documentos -->
        <div class="container justify-content-center mx-auto" v-if="habilitacion">
          <div v-for="(documento, nombreDocumento) in cleanDocumentos" :key="nombreDocumento">
            <div class="layout" v-if="cleanDocumentos">
              <p class="col col-main">
                <strong>{{ documentoNames[nombreDocumento] }}</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <b-button @click="openDocumento(documento)" variant="outline-primary" pill>
                  <b-icon icon="eye"></b-icon>
                  Ver
                </b-button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mb-3">
        <NuxtLink to="/comercio/solicitudes">
          <b-button variant="primary">Volver</b-button>
        </NuxtLink>
      </div>
    </template>

    <!-- Modals -->
    <b-modal v-model="showRejectPopup" hide-footer :header-bg-variant="'danger'" centered>
        <template #modal-header>
          <div class="confirmation-popup-header mx-auto">
            <b-icon-exclamation-triangle scale="2" variant="light" />
          </div>
        </template>
        <div class="confirmation-popup-body">
          <h2 class="icon-orange text-center"><b>Rechazar solicitud</b></h2>
          <p>La solicitud será rechazada. Se notificará al solicitante a través de su correo electrónico.</p>
          <p>Observaciones:  </p>
          <b-form-textarea v-model="observaciones" type="text" />
          <div class="text-center mt-3">
            <b-btn variant="primary" @click="onSendReject()" >
                Enviar
            </b-btn>
          </div>
        </div>
    </b-modal>

    <b-modal v-model="showPrevApprove" hide-footer :header-bg-variant="'secondary'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-exclamation-triangle scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h2 class="icon-orange text-center"><b>Aprobar solicitud</b></h2>
        <p>La solicitud será aceptada. Debes indicar si el comercio requiere inspección, y notificar al solicitante a través de su correo electrónico.</p>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="documentCheckbox" v-model="inspeccion"/>
            <label class="form-check-label" for="documentCheckbox">El comercio requiere inspección</label>
        </div>
        <div class="text-center mt-3">
          <b-btn variant="primary" @click="onSendApprove()" >
              Enviar
          </b-btn>
        </div>
      </div>
    </b-modal>

    <b-modal v-model="showApprove" hide-footer :header-bg-variant="'success'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-check-circle scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h3 class="icon-orange text-center"><b>Aprobar solicitud</b></h3>
        <p>La solicitud fue aprobada con éxito. Se deberá notificar al solicitante a través de su correo electrónico.</p>
        <div class="text-center mt-3">
          <b-btn variant="primary" @click="showApprove = false" >
              Aceptar
          </b-btn>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>

export default {
  data() {
    return {
      inspeccion: false,
      showPrevApprove: false,
      showApprove: false,
      showRejectPopup: false,
      habilitacion: null,
      observaciones: '',
      documentoNames: {
        planillaAutorizacion: 'Planilla de Autorización',
        dniFrente: 'DNI Frente',
        dniDorso: 'DNI Dorso',
        constanciaCuit: 'Constancia de CUIT',
        constanciaIngresosBrutos: 'Constancia de Ingresos Brutos',
        actaPersonaJuridica: 'Acta de Persona Jurídica',
        actaDirectorio: 'Acta de Directorio',
        libreDeudaUrbana: 'Libre Deuda Urbana',
        tituloPropiedad: 'Título de Propiedad',
        plano: 'Plano',
        certificadoDomicilio: 'Certificado de Domicilio',
        croquis: 'Croquis',
        // Agrega los demás nombres de documentos aquí
      },
    }
  },
  computed: {
    cleanDocumentos() {
      if(this.habilitacion){
        // Filtrar los documentos para eliminar el campo "_id"
        return Object.entries(this.habilitacion.documentos).reduce((acc, [key, value]) => {
          if (key !== '_id') {
            acc[key] = value;
          }
          return acc;
        }, {});
      }
    },
  },
  async fetch() {
    const habilitacionId = this.$route.params.id
    await this.$store.dispatch('habilitaciones/getSingle',{
      id: habilitacionId,
    })
    this.habilitacion = this.$store.state.habilitaciones.single
  },
  fetchOnServer: false,
  activated() {
    this.$fetch()
  },
  methods: {
    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    async onAprobarSolicitud(){
      this.showPrevApprove = true
    },
    async onSendApprove(){
      const habilitacion = {
        status: 'Aprobada'
      }
      if(this.inspeccion){
        habilitacion.status = "Pendiente"
      }
      const id = this.habilitacion.id
      const userToken = this.$store.state.user.token
      await this.$store.dispatch('habilitaciones/update', {
        id,
        habilitacion,
        userToken,
      })
      this.wait(300)
      this.showPrevApprove = false
      this.$fetch()
      this.showApprove = true
    },
    onRechazarSolicitud(){
      this.showRejectPopup = true
    },
    async onSendReject(){
      const habilitacion = {
        observaciones: this.observaciones,
        status: 'Rechazada'
      }
      const id = this.habilitacion.id
      const userToken = this.$store.state.user.token
      await this.$store.dispatch('habilitaciones/update', {
        id,
        habilitacion,
        userToken,
      })
      this.wait(300)
      this.observaciones = ''
      this.$fetch()
      this.showRejectPopup = false
    },
    openDocumento(documento) {
      const arrayBufferView = new Uint8Array(documento.data.data);
      const blob = new Blob([arrayBufferView], { type: documento.contentType });
      const fileURL = URL.createObjectURL(blob);

      // Abrir el PDF en una nueva pestaña utilizando <embed>
      const embed = document.createElement('embed');
      embed.setAttribute('type', 'application/pdf');
      embed.setAttribute('src', fileURL);
      embed.setAttribute('width', '100%');
      embed.setAttribute('height', '120%');

      const newWindow = window.open('', '_blank');
      newWindow.document.body.appendChild(embed);
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
    max-width: 90%;
    margin: auto;
  }
}

/* etc */

/* body {
  margin: 1.5em;
} */

.col {
  padding: 0.4em;
  margin: 0 2px 2px 40px;
}
</style>
