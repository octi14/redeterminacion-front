<template>
  <div class="page main-background">
    <Banner title="Detalles de solicitud"/>
    <div v-if="!habilitacion" class="text-center mt-3">
      <h2> Cargando </h2>
      <h4> Por favor espere unos segundos </h4>
    </div>
    <!-- Datos del solicitante -->
    <template v-if="habilitacion">
      <div class="flex col" style="width: 96%">
        <div class="row justify-content-center mt-3">
          <p class="h5"> Número de trámite: <b> {{ habilitacion.nroTramite }}  </b></p>
          <span v-if="mostrarIconoAdvertencia" class="iconoAdvertencia">
            <b-icon-exclamation-circle-fill scale="1.3" class="text-secondary ml-3" v-on:mouseover="showAdvertencia = true" v-on:mouseleave="showAdvertencia = false" />
            <span v-if="showAdvertencia" class="textoHover">El plazo administrativo del trámite está por vencer o se encuentra vencido.</span>
          </span>
        </div>
        <div class="row justify-content-center mt-3">
          <p class="h5"> Tipo de trámite: <b> {{ habilitacion.tipoSolicitud }}  </b></p>
        </div>
        <div class="row justify-content-center mt-3">
          <div class="h5 row"> Estado:
            <h5 :class="getStatusClass(habilitacion.status)" class="ml-2"> {{ habilitacion.status }}</h5>
          </div>
        </div>
        <div class="row justify-content-center" v-if="habilitacion.status === 'Finalizada' || habilitacion.tipoSolicitud === 'Baja'">
          <div class="h5 row"> Número de expediente: <b class="text-success ml-1"> {{ habilitacion.nroExpediente }} </b> </div>
        </div>
      </div>
      <!--Botones-->
      <div class="row col-10 mx-auto justify-content-center" v-if="jefeComercio">
        <b-button @click="onSolicitarDocumentacion" variant="success" pill class="btn-4 mt-3 mx-1" v-if="habilitacion.status === 'Inspeccionado'"> Solicitar documentación </b-button>
        <b-button @click="onAprobarBaja" variant="success" pill class="btn-4 mt-3 mx-1" v-if="baja && (habilitacion.status === 'En revisión' || habilitacion.status === 'Rectificación')"> Aprobar solicitud </b-button>
        <b-button @click="onAprobarSolicitud" variant="success" pill class="btn-4 mt-3 mx-1" v-if="!baja && habilitacion.status==='En revisión'"> Aprobar solicitud </b-button>
        <b-button @click="onRectificacion" variant="secondary " pill class="btn-4 mt-3 mx-1" v-if="habilitacion.status === 'En revisión'"> Rectificación </b-button>
        <b-button @click="onFinalizarSolicitud" variant="success" pill class="btn-4 mt-3 mx-1" v-if="habilitacion.status === 'Esperando documentación'"> Finalizar solicitud </b-button>
        <b-button @click="onRestablecer" variant="secondary" pill class="btn-4 mt-3 mx-1" v-if="habilitacion.status != 'En revisión' && habilitacion.status != 'Rectificación'"> Volver a estado En Revisión </b-button>
        <b-button @click="onRechazarSolicitud" pill class="btn-3 mt-3 mx-1"> Rechazar solicitud </b-button>
        <b-button @click="onShowObservaciones" variant="primary" pill class="btn-2 mt-3 mx-1"> Ver observaciones </b-button>
      </div>
      <!--Datos del solicitante-->
      <b-card no-body class="container col-md-6 col-sm-8 shadow-card mt-4 mx-auto">
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
            <div class="layout">
              <p class="col col-main">
                <strong>Mail</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ habilitacion.mail }}</a>
              </p>
            </div>
            <br>
          </div>
      </b-card>
    </template>
    <!-- Datos del inmueble -->
    <template v-if="habilitacion">
      <div class="container col-md-6 col-sm-8 card shadow-card mt-4 mx-auto">
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
                <a>
                  {{ habilitacion.calleInmueble }} {{ habilitacion.nro }}
                  {{ habilitacion.nroLocal ? " , local " + habilitacion.nroLocal : "" }}
                  {{ ", " + habilitacion.localidadInmueble}}
                </a>
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
            <div class="layout" v-if="!baja">
              <p class="col col-main">
                <strong v-if="habilitacion.espacioPublico">Uso de espacio público: </strong><br>
              </p>
            </div>
            <div class="layout" v-if="!baja">
              <p class="col col-main">
                <strong class="text-primary">- Mesas y sillas: </strong> <b-icon-check-circle-fill variant="info" v-if="habilitacion.mesas"></b-icon-check-circle-fill>
                  <b-icon-x-circle-fill variant="danger" v-else></b-icon-x-circle-fill><br>
              </p>
            </div>
            <div class="layout" v-if="!baja">
              <p class="col col-main">
                <strong class="text-primary">- Marquesina: </strong> <b-icon-check-circle-fill variant="info" v-if="habilitacion.marquesina"></b-icon-check-circle-fill>
                  <b-icon-x-circle-fill variant="danger" v-else></b-icon-x-circle-fill><br>
              </p>
            </div>
            <div class="layout" v-if="!baja">
              <p class="col col-main">
                <strong class="text-primary">- Carteles: </strong> <b-icon-check-circle-fill variant="info" v-if="habilitacion.carteles"></b-icon-check-circle-fill>
                  <b-icon-x-circle-fill variant="danger" v-else></b-icon-x-circle-fill><br>
              </p>
            </div>
            <div class="layout" v-if="!baja">
              <p class="col col-main">
                <strong class="text-primary">- Mercadería: </strong> <b-icon-check-circle-fill variant="info" v-if="habilitacion.espacioPublico"></b-icon-check-circle-fill>
                  <b-icon-x-circle-fill variant="danger" v-else></b-icon-x-circle-fill><br>
              </p>
            </div>
            <div  v-if="habilitacion.serviciosHoteleria && !baja">
              <div class="layout">
                <strong class="col col-main">Servicios de hotelería:</strong>
              </div>
              <div class="layout" v-for="(item, index) in habilitacion.serviciosHoteleria" :key="index">
                <p class="col col-main">
                  <strong class="text-primary">- {{ item.servicio }}</strong>
                  <b-icon-check-circle-fill variant="info" v-if="item.value"></b-icon-check-circle-fill>
                  <b-icon-x-circle-fill variant="danger" v-else></b-icon-x-circle-fill>
                </p>
              </div>
              <div class="layout" v-if="habilitacion.otrosServicios" style="border:1px solid #CCC">
                <p class="col col-main ml-5">"<i>{{ habilitacion.otrosServicios }}</i>"</p>
              </div>
            </div>
            <br>
          </div>
        </div>
    </template>
    <!-- Documentación -->
    <template v-if="habilitacion">
      <div class="container col-md-6 col-sm-8 card shadow-card mt-4 mb-3 mx-auto">
        <!-- Resto del contenido del componente -->
        <div class="col mx-auto">
          <div class="container text-center mx-auto">
            <h2 class="text-success mt-2"><b> Documentación presentada </b></h2>
            <hr/>
          </div>
        </div>
        <!-- Mostrar los enlaces a los documentos -->
        <div class="container justify-content-center mx-auto" v-if="documentos">
          <div v-for="(documento, nombreDocumento) in cleanDocumentos" :key="nombreDocumento">
            <div class="layout" v-if="cleanDocumentos && documento">
              <p class="col col-main">
                <strong>{{ documentoNames[nombreDocumento] }}</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <b-button size="sm" @click="openDocumento(documento, documentoNames[nombreDocumento])" variant="outline-primary" pill>
                  <b-icon icon="eye" scale="1.2"></b-icon>
                  Ver
                </b-button>
              </p>
            </div>
          </div>
        </div>
        <div class="justify-content-center mx-auto" v-else>
          <p class="h4 text-loading text-center"> Cargando... </p>
          <div class="row justify-content-center mb-3">
            <b-spinner variant="success"></b-spinner>
          </div>
        </div>
      </div>
    </template>

    <!-- Turno (de existir) -->
    <template v-if="habilitacion && turno">
      <div class="container col-md-6 col-sm-8 card shadow-card mt-4 mb-3 mx-auto">
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
    <!--Modal previo a rechazar el turno-->
    <b-modal v-model="showRejectPopup" hide-footer :header-bg-variant="'danger'" centered>
        <template #modal-header>
          <div class="confirmation-popup-header mx-auto">
            <b-icon-envelope scale="2" variant="light" />
          </div>
        </template>
        <div class="confirmation-popup-body">
          <h2 class="icon-orange text-danger text-center"><b>Rechazar solicitud</b></h2>
          <p>La solicitud será rechazada. Recordá notificar al solicitante a través de su correo electrónico indicando los motivos.</p>
          <p>Observaciones:  </p>
          <b-form-textarea v-model="observaciones" required type="text" />
          <div class="text-center mt-3">
            <b-btn variant="danger" @click="onSendReject()" >
                Enviar
            </b-btn>
          </div>
        </div>
    </b-modal>

    <!--Modal solicitar rectificación de datos-->
    <b-modal v-model="showRectificacion" hide-footer :header-bg-variant="'secondary'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-exclamation-octagon scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h2 class="icon-orange text-secondary text-center"><b>Rectificación de datos</b></h2>
        <hr/>
        <p>Se solicitará una rectificación de datos o de documentación. Recordá notificar al solicitante a través de su correo electrónico indicando los motivos.</p>
        <div class="text-center mt-3">
          <b-btn variant="secondary" @click="onSendRectificacion()" >
              Aceptar
          </b-btn>
        </div>
      </div>
    </b-modal>

    <!--Modal previo a aprobar(con y sin inspección)-->
    <b-modal v-model="showPrevApprove" hide-footer :header-bg-variant="'secondary'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-envelope scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h2 class="icon-orange text-secondary text-center"><b>Aprobar solicitud</b></h2>
        <hr/>
        <h5 class="mb-3 text-center mr-3"> <b-icon-exclamation-octagon scale="0.8" variant="secondary"/><b> ¿El comercio requiere inspección? </b> </h5>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="documentCheckbox" v-model="inspeccion"/>
            <label class="form-check-label" for="documentCheckbox"><b> Si. </b> Enviá un mail indicando que la persona deberá solamente pedir un Turno Web para Inspección Comercial.</label>
        </div>
        <div class="text-center mt-3">
          <b-btn variant="primary" @click="onSendApprove()" >
              Aceptar
          </b-btn>
        </div>
      </div>
    </b-modal>

    <!--Modal previo a aprobar una baja-->
    <b-modal v-model="showAprobarBaja" hide-footer :header-bg-variant="'secondary'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-check-circle scale="2" variant="light" class="my-2" />
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h2 class="icon-orange text-secondary text-center"><b>Aprobar solicitud</b></h2>
        <p style="margin: 3%"> Se aprobará la solicitud. Se deberá  enviar un mail al solicitante indicando que en el plazo de 7 días hábiles:</p>
        <ul>
          <li>  Abone el canon previsto para el rubro. </li>
          <li>  Concurra al Departamento de Comercio con la documentación original y el libro de actas. </li>
        </ul>
        <hr/>
        <div class="text-center mt-3">
          <b-btn variant="primary" @click="onSendApprove()" >
              Aceptar
          </b-btn>
        </div>
      </div>
    </b-modal>

    <!--Modal solicitud aprobada-->
    <b-modal v-model="showApprove" hide-footer :header-bg-variant="'success'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-envelope scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h3 class="icon-orange text-success text-center"><b>Aprobar solicitud</b></h3>
        <p>La solicitud fue aprobada con éxito. Se deberá  enviar un correo electrónico al solicitante indicando que en el plazo de 7 días hábiles:</p>
        <ul>
          <li v-if="!baja">  Abone el canon de Habilitación Comercial previsto para el rubro. </li>
          <li v-if="baja"> Abone el canon previsto para el rubro.</li>
          <li>  Concurra al Departamento de Comercio con la documentación original y el Libro de Actas. </li>
          <li v-if="!baja">  Constituya el Domicilio Fiscal Electrónico (DFE). </li>
        </ul>
        <div class="text-center mt-3">
          <b-btn variant="success" @click="showApprove = false" >
              Aceptar
          </b-btn>
        </div>
      </div>
    </b-modal>

    <!--Modal solicitar documentación(inspección aprobada)-->
    <b-modal v-model="showSolicitarDoc" hide-footer :header-bg-variant="'success'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-envelope scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h3 class="icon-orange text-success text-center"><b>Solicitar documentación</b></h3>
        <p>La solicitud fue aprobada con éxito. Se deberá  enviar un correo electrónico al solicitante indicando que en el plazo de 7 días hábiles:</p>
        <ul>
          <li>  Abone el canon de Habilitación Comercial previsto para el rubro. </li>
          <li>  Concurra al Departamento de Comercio con la documentación original. </li>
          <li>  Constituya el Domicilio Fiscal Electrónico (DFE). </li>
        </ul>
        <div class="text-center mt-3">
          <b-btn variant="success" @click="onSendSolicitar" >
              Aceptar
          </b-btn>
        </div>
      </div>
    </b-modal>

    <!--Modal finalizar trámite y colocar el número de expediente-->
    <b-modal v-model="showFinalizar" hide-footer :header-bg-variant="'success'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-check-circle scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body" v-if="!baja">
        <h3 class="text-success text-center"><b>Finalizar trámite</b></h3>
        <p>El trámite será finalizado.</p>
        <p> Ingresa el número de expediente asignado a este trámite: </p>
        <div class="row mx-auto">
        <p class="mr-2"> 4124 -</p>
        <b-form-input class="col-3" type="number" no-wheel size="sm" v-model="nroExpediente1"/><a class="mx-3"> / </a>
        <b-form-input size="sm" type="number" no-wheel class="col-3" v-model="nroExpediente2"/>
        </div>
        <small> Recordá que más adelante podrás consultar los datos proporcionados en la sección de búsqueda. </small>
        <div class="text-center mt-3">
          <b-btn variant="success" :disabled="!nroExpediente1 || !nroExpediente2" @click="onSendFinalizar" >
              Aceptar
          </b-btn>
        </div>
      </div>
      <div v-else>
        <h3 class="text-success text-center"><b>Finalizar trámite</b></h3>
        <p>El trámite será finalizado. El comercio será dado de baja, y se agregarán los documentos al expediente original. </p>
        <small> Recordá que más adelante podrás consultar los datos proporcionados en la sección de búsqueda. </small>
        <div class="text-center mt-3">
          <b-btn variant="success" @click="onSendFinalizar" >
              Aceptar
          </b-btn>
        </div>
      </div>
    </b-modal>

    <b-modal v-model="showObservaciones" header-bg-variant="primary" title="Observaciones" title-class="text-light" hide-footer centered>
      <p v-html="observaciones"></p>
    </b-modal>

    <b-modal v-model="showDocumentoModal" id="documento-modal" hide-footer centered>
      <template #modal-header>
        <h3 class="icon-orange text-primary text-center"><b>{{ DocumentoModalTitle }}</b></h3>
      </template>
      <div class="modal-body">
        
      </div>
    </b-modal>

  </div>
</template>

<script>
export default {
  data() {
    return {
      statusClasses: {
        'En revisión': 'text-primary',
        'Rectificación': 'text-lightblue',
        'Esperando turno': 'text-secondary',
        'Esperando inspección': 'text-secondary',
        'Prórroga 1': 'text-secondary',
        'Prórroga 2': 'text-secondary',
        'Inspeccionado': 'text-lightgreen',
        'Esperando documentación': 'text-success',
        'Rechazada': 'text-danger',
        'Finalizada': 'text-darkgreen'
      },
      inspeccion: false,
      showAdvertencia: false,
      showRectificacion: false,
      showPrevApprove: false,
      showApprove: false,
      showAprobarBaja: false,
      showFinalizar: false,
      showRejectPopup: false,
      showSolicitarDoc: false,
      showObservaciones: false,
      habilitacion: null,
      documentos: null,
      turno: null,
      observaciones: '',
      nroExpediente1: null,
      nroExpediente2: null,
      documentoNames: {
        planillaAutorizacion: 'Planilla de Autorización / Apoderamiento',
        dniFrente: 'DNI Frente',
        dniDorso: 'DNI Dorso',
        constanciaCuit: 'Constancia de CUIT',
        constanciaIngresosBrutos: 'Constancia de Ingresos Brutos',
        actaPersonaJuridica: 'Acta de Persona Jurídica',
        actaDirectorio: 'Acta de Directorio',
        libreDeudaUrbana: 'Libre Deuda Tasa Urbana',
        tituloPropiedad: 'Título de Propiedad / Contrato de locación',
        plano: 'Plano / Informe técnico',
        certificadoDomicilio: 'Certificado de Domicilio Ingresos Brutos',
        croquis: 'Croquis',
        // Agrega los demás nombres de documentos aquí
      },
      showDocumentoModal: false,
      DocumentoModalTitle: "",
    }
  },
  computed: {
    mostrarIconoAdvertencia() {
      if(this.habilitacion){
        const fechaCreacion = this.habilitacion.createdAt;
        const fechaActual = new Date();
        const diferenciaDias = Math.floor((fechaActual - fechaCreacion) / (1000 * 60 * 60 * 24)); // Diferencia en días
        
        return diferenciaDias >= 25 && this.habilitacion.status !== 'Finalizada' && this.habilitacion.status !== 'Rechazada'
      }else{
        return false
      }
    },
    baja(){
      return this.habilitacion && this.habilitacion.tipoSolicitud === "Baja"
    },
    cleanDocumentos() {
      if(this.habilitacion && this.documentos){
        // Filtrar los documentos para eliminar el campo "_id"
        return Object.entries(this.documentos).reduce((acc, [key, value]) => {
          if (key !== '_id') {
            acc[key] = value;
          }
          return acc;
        }, {});
      }
    },
    adminComercio(){
      return this.$store.state.user.admin == "comercio" || this.$store.state.user.admin == "master"
    },
    jefeComercio(){
      return (this.$store.state.user.username === "myriamalonso@gesell.gob.ar"
              || this.$store.state.user.username === "mariaelisabetbahlcke@gesell.gob.ar"
              || this.$store.state.user.username === "lujanperez@gesell.gob.ar") || this.$store.state.user.admin == "master"
    },
  },
  async fetch() {
    const habilitacionId = this.$route.params.id
    await this.$store.dispatch('habilitaciones/getSingle',{
      id: habilitacionId,
    })
    this.habilitacion = this.$store.state.habilitaciones.single

    const nroTramite = this.habilitacion.nroTramite
    await this.$store.dispatch('turnos/getSingle', { nroTramite })
    this.turno = this.$store.state.turnos.single

    await this.$store.dispatch('documentos/getById', {
      id: habilitacionId,
    })
    this.documentos = this.$store.state.documentos.all
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
    async onSendRectificacion(){
      const observaciones = this.habilitacion.observaciones
      const habilitacion = {
        status: 'Rectificación',
        observaciones: observaciones + " - " + "Solicita rectificación el día " + new Date().toLocaleDateString('es-AR')
      }
      const id = this.habilitacion.id
      const userToken = this.$store.state.user.token
      await this.$store.dispatch('habilitaciones/update', {
        id,
        habilitacion,
      })
      this.habilitacion.status = habilitacion.status
      this.showRectificacion = false
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
      var nroExpediente = ''
      if(!this.baja){
        nroExpediente = "4124-" + this.nroExpediente1 + "/" + this.nroExpediente2
      }else{
        nroExpediente = this.habilitacion.nroExpediente
      }
      const observaciones = this.habilitacion.observaciones || ""
      const habilitacion = {
        status: 'Finalizada',
        nroExpediente: nroExpediente,
        observaciones: observaciones + " - " + "Se finaliza el trámite el día " + new Date().toLocaleDateString('es-AR')
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
      const observaciones = this.habilitacion.observaciones || " "
      const habilitacion = {
        status: 'Esperando documentación',
        observaciones: observaciones + " - " + "Se aprueba la solicitud el " + new Date().toLocaleDateString('es-AR') + " " + new Date().toLocaleTimeString()
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
      this.habilitacion.status = habilitacion.status
      this.showPrevApprove = false
      if(this.baja){
        this.showAprobarBaja = false
      }
      this.showApprove = true
    },
    onRechazarSolicitud(){
      this.showRejectPopup = true
    },
    async onSendReject(){
      const observaciones = this.habilitacion.observaciones || " "
      const habilitacion = {
        observaciones: observaciones + " - " + "Solicitud rechazada: " + this.observaciones + " " + new Date().toLocaleDateString(),
        status: 'Rechazada'
      }
      const id = this.habilitacion.id
      const userToken = this.$store.state.user.token
      await this.$store.dispatch('habilitaciones/update', {
        id,
        habilitacion,
      })
      this.wait(300)
      this.habilitacion.status = habilitacion.status
      this.observaciones = ''
      this.showRejectPopup = false
    },
    openDocumento(documento, nombreDocumento) {
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
.modal-dialog {
  max-width: 80% !important;
}

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
