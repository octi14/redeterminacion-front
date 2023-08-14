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

        <div class="h4 row"> Estado:
          <h4 class="text-primary ml-1" v-if="habilitacion.status === 'En revisión'">{{ habilitacion.status }} </h4>
          <h4 class="text-success ml-1" v-if="habilitacion.status === 'Esperando documentación'">{{ habilitacion.status }} </h4>
          <h4 class="text-success ml-1" v-if="habilitacion.status === 'Inspeccionado'">{{ habilitacion.status }} </h4>
          <h4 class="text-success ml-1" v-if="habilitacion.status === 'Aprobada'">{{ habilitacion.status }} </h4>
          <h4 class="text-danger ml-1" v-if="habilitacion.status === 'Rechazada'">{{ habilitacion.status }} </h4>
          <h4 class="text-secondary ml-1" v-if="habilitacion.status === 'Esperando turno'">{{ habilitacion.status }} </h4>
          <h4 class="text-secondary ml-1" v-if="habilitacion.status === 'Esperando inspección'">{{ habilitacion.status }} </h4>
          <h4 class="text-success ml-1" v-if="habilitacion.status === 'Finalizada'">{{ habilitacion.status }} </h4>
        </div>
      </div>
      <div class="row col-10 mx-auto justify-content-center">
        <b-button @click="onSolicitarDocumentacion" variant="success" pill class="btn-4 mt-3 mx-1" v-if="habilitacion.status === 'Inspeccionado'"> Solicitar documentación </b-button>
        <b-button @click="onAprobarSolicitud" variant="success" pill class="btn-4 mt-3 mx-1" v-if="habilitacion.status==='En revisión'"> Aprobar solicitud </b-button>
        <b-button @click="onFinalizarSolicitud" variant="success" pill class="btn-4 mt-3 mx-1" v-if="habilitacion.status === 'Esperando documentación'"> Finalizar solicitud </b-button>
        <b-button @click="onRestablecer" variant="secondary" pill class="btn-4 mt-3 mx-1" v-if="habilitacion.status != 'En revisión'"> Volver a estado En Revisión </b-button>
        <b-button @click="onRechazarSolicitud" variant="success" pill class="btn-3 mt-3 mx-1"> Rechazar solicitud </b-button>
      </div>
      <div v-if="habilitacion.observaciones">
        <p> Observaciones: {{ habilitacion.observaciones }} </p>
      </div>
      <b-card no-body class="container col-md-6 col-sm-8 shadow-lg mt-4 mx-auto">
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
      </b-card>
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
    </template>

    <template v-if="habilitacion && turno">
      <div class="container col-md-6 col-sm-8 card shadow-lg mt-4 mb-3 mx-auto">
        <!-- Resto del contenido del componente -->
        <div class="col mx-auto">
          <div class="container text-center mx-auto">
            <h2 class="text-success mt-2"><b> Turno solicitado </b></h2>
            <hr/>
          </div>
        </div>
          <div class="container mb-3 mx-auto">
            <div class="layout">
              <p class="col col-main">
                <strong>Fecha y hora del turno</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ turno.dia + " " + turno.horario}}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Nombre del solicitante</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ turno.nombre}}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Número de documento</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ turno.dni }}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Domicilio a inspeccionar</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ turno.domicilio }}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Estado</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ turno.status }}</a>
              </p>
            </div>
          </div>
      </div>
    </template>

    <div class="text-center mb-3">
      <NuxtLink to="/comercio/solicitudes">
        <b-button variant="primary">Volver</b-button>
      </NuxtLink>
    </div>

    <!-- Modals -->
    <b-modal v-model="showRejectPopup" hide-footer :header-bg-variant="'danger'" centered>
        <template #modal-header>
          <div class="confirmation-popup-header mx-auto">
            <b-icon-exclamation-triangle scale="2" variant="light" />
          </div>
        </template>
        <div class="confirmation-popup-body">
          <h2 class="icon-orange text-danger text-center"><b>Rechazar solicitud</b></h2>
          <p>La solicitud será rechazada. Recordá notificar al solicitante a través de su correo electrónico.</p>
          <p>Observaciones:  </p>
          <b-form-textarea v-model="observaciones" required type="text" />
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
          <b-icon-check-circle scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h2 class="icon-orange text-secondary text-center"><b>Aprobar solicitud</b></h2>
        <h5 class="mb-3"> <b-icon-exclamation-octagon scale="1.2" variant="secondary"/><b> ¿El comercio requiere inspección? </b> </h5>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="documentCheckbox" v-model="inspeccion"/>
            <label class="form-check-label" for="documentCheckbox"><b> Si. </b> Enviar mail indicando <strong> solamente </strong> que se deberá realizar el Turno Web para Inspección Comercial.</label>
        </div>
        <div class="text-center mt-3">
          <b-btn variant="primary" @click="onSendApprove()" >
              Aceptar
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
        <h3 class="icon-orange text-success text-center"><b>Aprobar solicitud</b></h3>
        <p>La solicitud fue aprobada con éxito. Se deberá  enviar un correo electrónico al solicitante para que:</p>
        <ul>
          <li>  En el plazo de 7 días hábiles concurra al Departamento de Comercio con la documentación original. </li>
          <li>  Abone el canon de Habilitación Comercial previsto para el rubro.. </li>
          <li>  Constituya el DFE. </li>
        </ul>
        <div class="text-center mt-3">
          <b-btn variant="success" @click="showApprove = false" >
              Aceptar
          </b-btn>
        </div>
      </div>
    </b-modal>

    <b-modal v-model="showSolicitarDoc" hide-footer :header-bg-variant="'success'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-check-circle scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h3 class="icon-orange text-success text-center"><b>Solicitar documentación</b></h3>
        <p>La solicitud fue aprobada con éxito. Se deberá  enviar un correo electrónico al solicitante para que:</p>
        <ul>
          <li>  En el plazo de 7 días hábiles concurra al Departamento de Comercio con la documentación original. </li>
          <li>  Abone el canon de Habilitación Comercial previsto para el rubro.. </li>
          <li>  Constituya el DFE. </li>
        </ul>
        <div class="text-center mt-3">
          <b-btn variant="success" @click="onSendSolicitar" >
              Aceptar
          </b-btn>
        </div>
      </div>
    </b-modal>

    <b-modal v-model="showFinalizar" hide-footer :header-bg-variant="'success'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-check-circle scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h3 class="text-success text-center"><b>Finalizar trámite</b></h3>
        <p>El trámite será finalizado.</p>
        <p> Ingresa el número de expediente asignado a este trámite: </p>
        <div class="row mx-auto">
        <p class="mr-2"> 4124 -</p>
        <b-form-input class="col-3" size="sm" v-model="nroExpediente"/><a class="mx-3"> / </a> <b-form-input size="sm" class="col-3" v-model="nroExpediente"/>
        </div>
        <small> Recordá que podés consultar los datos proporcionados en la sección de búsqueda. </small>
        <div class="text-center mt-3">
          <b-btn variant="success" @click="onSendFinalizar" >
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
      showFinalizar: false,
      showRejectPopup: false,
      showSolicitarDoc: false,
      habilitacion: null,
      turno: null,
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

    const nroTramite = this.habilitacion.nroTramite
    await this.$store.dispatch('turnos/getSingle', { nroTramite})
    this.turno = this.$store.state.turnos.single
  },
  fetchOnServer: false,
  activated() {
    this.$fetch()
  },
  methods: {
    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    onSolicitarDocumentacion(){
      this.showSolicitarDoc = true
    },
    async onAprobarSolicitud(){
      this.showPrevApprove = true
    },
    onFinalizarSolicitud(){
      this.showFinalizar = true
    },
    async onSendSolicitar(){
      const habilitacion = {
        status: 'Esperando documentación'
      }
      const id = this.habilitacion.id
      const userToken = this.$store.state.user.token
      await this.$store.dispatch('habilitaciones/update', {
        id,
        habilitacion,
      })
      this.habilitacion.status = habilitacion.status
      this.showSolicitarDoc = false
    },
    async onSendFinalizar(){
      const habilitacion = {
        status: 'Finalizada'
      }
      const id = this.habilitacion.id
      const userToken = this.$store.state.user.token
      await this.$store.dispatch('habilitaciones/update', {
        id,
        habilitacion,
      })
      this.habilitacion.status = habilitacion.status
      this.showFinalizar = false
    },
    async onRestablecer(){
      const habilitacion = {
        status: 'En revisión'
      }
      const id = this.habilitacion.id
      const userToken = this.$store.state.user.token
      await this.$store.dispatch('habilitaciones/update', {
        id,
        habilitacion,
      })
      this.habilitacion.status = habilitacion.status
    },
    async onSendApprove(){
      const habilitacion = {
        status: 'Esperando documentación'
      }
      if(this.inspeccion){
        habilitacion.status = "Esperando turno"
      }
      const id = this.habilitacion.id
      const userToken = this.$store.state.user.token
      await this.$store.dispatch('habilitaciones/update', {
        id,
        habilitacion,
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
