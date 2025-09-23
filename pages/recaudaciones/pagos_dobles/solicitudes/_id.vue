<template>
  <div class="page main-background">
    <Banner title="Detalles de solicitud"/>
    <div v-if="!pago" class="text-center mt-3">
      <h2> Cargando </h2>
      <h4> Por favor espere unos segundos </h4>
    </div>
    <!-- Datos del solicitante -->
    <template v-if="pago">
      <div class="flex col" style="width: 96%">
        <div class="row justify-content-center mt-3">
          <p class="h5"> Número de trámite: <b> R{{ pago.nroTramite }}  </b></p>
        </div>
        <div class="row justify-content-center mt-3">
          <div class="h5 row"> Estado:
            <h5 :class="getStatusClass(pago.status)" class="ml-2"> {{ pago.status }}</h5>
          </div>
        </div>
        <div class="col mx-auto" v-if="pago.status === 'Finalizada'">
          <div class="h5 row justify-content-center"> Número de expediente: <b class="text-success ml-1"> {{ pago.nroExpediente }} </b> </div>
          <div class="h5 row justify-content-center"> Alcance: <b class="text-success ml-1"> {{ pago.alcance }} </b> </div>
        </div>
      </div>
      <!--Botones-->
      <div class="row col-10 mx-auto justify-content-center">
        <b-button @click="onShowAprobarSolicitud" variant="success" class="btn-4 mt-3 mx-1" v-if="pago.status==='En revisión'"> Aprobar solicitud </b-button>
        <!-- <b-button @click="onRestablecer" variant="secondary" class="btn-4 mt-3 mx-1" v-if="pago.status != 'En revisión'"> Volver a estado En Revisión </b-button> -->
        <b-button @click="onRechazarSolicitud" class="btn-3 mt-3 mx-1"> Rechazar solicitud </b-button>
        <b-button @click="onShowObservaciones" variant="primary" class="btn-2 mt-3 mx-1"> Ver observaciones </b-button>
      </div>
      <!-- <div class="row no-gutters">
        <b-button @click="onDescargarHabilitacion(); registrarActividad('Descargar Trámite', 'Trámite Descargado', pago.nroTramite)" v-if="adminComercio || adminArvige || adminModernizacion" variant="success" class="btn-4 mx-auto mt-3 mx-1">
          <b-icon icon="download" class="mr-1"></b-icon> Descargar trámite
        </b-button>
      </div> -->

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
                <a>{{ pago.nombre + " " + pago.apellido}}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Número de documento</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ pago.dni }}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>CUIT</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ pago.cuit }}</a>
              </p>
            </div>
                        <div class="layout">
              <p class="col col-main">
                <strong>Número de cuenta</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ pago.nroCuenta }}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Domicilio</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ pago.domicilioReal + " (C.P. " + pago.codigoPostal + "), " + pago.localidad + ", " + pago.provincia }}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Número de teléfono</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ pago.telefono }}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Mail</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ pago.mail }}</a>
              </p>
            </div>
            <br>
          </div>
      </b-card>
    </template>
    <!-- Documentación -->
    <template v-if="pago">
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
          <div v-for="(documento, nombreDocumento) in documentos" :key="nombreDocumento">
            <div class="layout" v-if="documento">
              <p class="col col-main">
                <strong>{{ nombreDocumento }}</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <b-button size="sm" @click="openDocumento(documento, nombreDocumento)" variant="outline-primary" pill>
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

    <div class="text-center mb-3">
      <NuxtLink to="/recaudaciones/pagos_dobles/solicitudes">
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
          <p>La solicitud será rechazada. Se enviará automáticamente un correo electrónico al solicitante con el motivo del rechazo.</p>
          <p>Motivos de rechazo:</p>
          <b-form-radio-group v-model="motivoRechazo" :options="motivosRechazo" name="motivo-rechazo" />
          <div class="text-center mt-3">
            <b-btn variant="danger" @click="onSendReject()" :disabled="!motivoRechazo">
                Enviar
            </b-btn>
          </div>
        </div>
    </b-modal>

    <!--Modal previo a aprobar(con y sin inspección)-->
    <b-modal v-model="showPrevApprove" hide-footer :header-bg-variant="'secondary'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-check-circle scale="2" variant="light" class="my-2" />
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h2 class="icon-orange text-secondary text-center"><b>Aprobar solicitud</b></h2>
        <p style="margin: 3%"> Se aprobará la solicitud. Se enviará automáticamente un correo electrónico al solicitante informando la aprobación. </p>
        <div class="text-center mt-3">
          <b-btn variant="primary" @click="onSendApprove()">
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
        <h3 class="icon-orange text-success text-center"><b>Trámite aprobado</b></h3>
        <p style="text-align: center">La solicitud ha sido aprobada exitosamente. Se ha enviado un correo electrónico al solicitante informando la aprobación.</p>
        <div class="text-center mt-3">
          <b-btn variant="success" @click="showApprove = false">
              Aceptar
          </b-btn>
        </div>
      </div>
    </b-modal>

    <!--Modal volver a erstado En revisión-->
    <b-modal v-model="showRestoreDefault" hide-footer :header-bg-variant="'secondary'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-exclamation-triangle scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body text-center">
        <h3 class="text-secondary text-center mb-4"><b>Volver a En Revisión</b></h3>
        <p style="color:black"> ¿Estás seguro/a de que deseas volver el trámite a “En revisión”? </p>
        <small>Esta acción es permanente y reinicia el proceso de verificación del trámite.</small>
        <div class="text-center mt-4">
          <b-btn variant="success" @click="onSendRestablecer()" >
              Aceptar
          </b-btn>
          <b-btn variant="danger" @click="onRestablecer" >
              Cancelar
          </b-btn>
        </div>
      </div>
    </b-modal>

    <b-modal v-model="showObservaciones" header-bg-variant="primary" title="Observaciones" title-class="text-light" hide-footer centered>
      <p v-html="observaciones"></p>
    </b-modal>

    <b-modal v-model="showDocumentoModal" id="documento-modal" hide-footer centered>
      <template #modal-header>
        <h3 class="icon-orange text-primary text-center"><b>{{ DocumentoModalTitle + " - " + pago.nroTramite }}</b></h3>
      </template>
      <div class="modal-body">

      </div>
    </b-modal>

    <!-- Modal para archivos HEIC -->
    <b-modal v-model="showHeicModal" header-bg-variant="warning" title="Archivo no compatible" title-class="text-light" hide-footer centered>
      <div class="text-center">
        <b-icon-exclamation-triangle-fill variant="warning" scale="3" class="my-3"></b-icon-exclamation-triangle-fill>
        <h5 class="my-3">Este archivo no pudo ser abierto desde el navegador</h5>
        <p class="mb-4">El formato HEIC no es compatible con tu navegador.<br/> Podés descargar el archivo para visualizarlo en tu dispositivo.</p>
        <b-button @click="downloadHeicFile" variant="success" class="mr-2 btn-download-heic">
          <b-icon-download></b-icon-download> Descargar
        </b-button>
        <b-button @click="showHeicModal = false" variant="secondary">
          Cerrar
        </b-button>
      </div>
    </b-modal>

  </div>
</template>

<script>
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import MailerService from '~/service/mailer.js'

export default {
  data() {
    return {
      statusClasses: {
        'En revisión': 'text-primary',
        'Rechazada': 'text-danger',
        'Aprobada': 'text-darkgreen'
      },
      showPrevApprove: false,
      showApprove: false,
      showRejectPopup: false,
      showRestoreDefault: false,
      showObservaciones: false,
      pago: null,
      observaciones: '',
      showDocumentoModal: false,
      DocumentoModalTitle: "",
      motivoRechazo: '',
      showHeicModal: false,
      currentDocumento: null,
      motivosRechazo: [
        'No corresponde a una cuenta urbana',
        'Los documentos no son legibles',
        'Los comprobantes no indican el pago duplicado de la misma cuenta'
      ],
    }
  },
  computed: {
    adminComercio(){
      return this.$store.state.user.admin == "comercio" || this.$store.state.user.admin == "master"
    },
    documentos(){
      return this.$store.state.documentos.all
    }
  },
  async fetch() {
    const pagoId = this.$route.params.id
    await this.$store.dispatch('pagosDobles/getSingle',{
      id: pagoId,
    })
    this.pago = this.$store.state.pagosDobles.single

    await this.$store.dispatch('documentos/getPagosById', {
      id: pagoId,
    })

  },
  fetchOnServer: false,
  activated() {
    this.$fetch()
  },
  methods: {
    isValidBase64(str) {
      try {
        return btoa(atob(str)) === str;
      } catch (e) {
        return false;
      }
    },

    async registrarActividad(evento, result, nroSolicitud){
      const userId = this.$store.state.user.username; // Reemplaza con el ID del usuario real
      const actionType = evento;
      const actionResult = "Reclamo de pago doble nro " + nroSolicitud + ' ' + result;

      try {
          await this.$logUserActivity(userId, actionType, actionResult);
      } catch (error) {
          console.error('Error al registrar la actividad:', error);
      }
    },
    getStatusClass(status) {
      return this.statusClasses[status] || '';
    },
    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    async onShowAprobarSolicitud(){
      this.showPrevApprove = true
    },
    onShowObservaciones(){
      if(this.pago.observaciones){
        this.observaciones = this.pago.observaciones.split('-').join('<br>')
      }else{
        this.observaciones = "No hay observaciones para mostrar."
      }
      this.showObservaciones = true
    },
    async onSendApprove(){
      const observaciones = this.pago.observaciones || " "
      const pago = {
        status: 'Aprobada',
        observaciones: observaciones + " - " + "Se aprueba la solicitud el " + new Date().toLocaleDateString('es-AR') + " " + new Date().toLocaleTimeString()
      }
      const id = this.pago.id
      const userToken = this.$store.state.user.token
      await this.$store.dispatch('pagosDobles/update', {
        id,
        pago,
      })
      this.registrarActividad('Aprobar reclamo por pago doble', 'Reclamo por Pago doble Aprobado.')
      this.wait(300)
      this.pago.status = pago.status
      this.showPrevApprove = false
      this.showApprove = true

      // --- Enviar correo al solicitante ---
      try {
        const destinatario = this.pago.mail || this.pago.solicitante?.mail
        const asunto = `Aprobación de reclamo de pago doble N° R${this.pago.nroTramite}`
        const mensaje = `Estimado/a contribuyente,

Su reclamo de pago doble ha sido aprobado exitosamente.
Su documentación será procesada y recibirá las instrucciones correspondientes en los próximos días.

Número de trámite: R${this.pago.nroTramite}
Fecha de aprobación: ${new Date().toLocaleDateString('es-AR')}



Si tiene dudas o necesita más información, por favor comuníquese con el Departamento Recaudaciones Municipal (recaudaciones@gesell.gob.ar).`
        await MailerService.enviarCorreo(this.$axios, { destinatario, asunto, mensaje })
        this.$bvToast.toast('Correo de aprobación enviado al solicitante.', { variant: 'success' })
      } catch (e) {
        this.$bvToast.toast('No se pudo enviar el correo de aprobación.', { variant: 'danger' })
      }
    },
    onRechazarSolicitud(){
      this.showRejectPopup = true
    },
    async onSendReject(){
      const observaciones = this.pago.observaciones || " "
      const pago = {
        observaciones: observaciones + " - " + "Solicitud rechazada: " + this.motivoRechazo + " " + new Date().toLocaleDateString(),
        status: 'Rechazada'
      }
      const id = this.pago.id
      await this.$store.dispatch('pagosDobles/update', {
        id,
        pago,
      })
      this.registrarActividad('Rechazar Solicitud', 'Rechazado por: ' + this.motivoRechazo, this.pago.nroTramite)
      this.wait(300)
      this.pago.status = pago.status

      // --- Enviar correo al solicitante ---
      try {
        const destinatario = this.pago.mail || this.pago.solicitante?.mail
        const asunto = `Rechazo de solicitud de pago doble N° R${this.pago.nroTramite}`
        const mensaje = `Estimado/a contribuyente,

Su reclamo de pago doble ha sido rechazado por el siguiente motivo:
${this.motivoRechazo}

Si tiene dudas o necesita más información, por favor comuníquese con el Departamento Recaudaciones Municipal (recaudaciones@gesell.gob.ar).`
        await MailerService.enviarCorreo(this.$axios, { destinatario, asunto, mensaje })
        this.$bvToast.toast('Correo de rechazo enviado al solicitante.', { variant: 'success' })
      } catch (e) {
        this.$bvToast.toast('No se pudo enviar el correo de rechazo.', { variant: 'danger' })
      }

      this.motivoRechazo = ''
      this.showRejectPopup = false
    },
    async onDescargarHabilitacion() {
      try {
        const id = this.pago.id;

        // Obtenemos los datos y documentos de la habilitación del store
        const pago = this.pago;
        const documentos = this.documentos || {};

        const zip = new JSZip();

        // Convertir los datos de la habilitación a Excel
        const datosHabilitacion = XLSX.utils.json_to_sheet([pago]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, datosHabilitacion, 'Datos_Habilitacion');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        zip.file('datos_pago.xlsx', excelBuffer);

        // Función para decodificar base64 y crear un buffer
        const crearBufferDesdeBase64 = (base64Data) => {
          const decodedData = atob(base64Data);
          const arrayBuffer = new ArrayBuffer(decodedData.length);
          const arrayBufferView = new Uint8Array(arrayBuffer);

          for (let i = 0; i < decodedData.length; i++) {
            arrayBufferView[i] = decodedData.charCodeAt(i);
          }

          return arrayBuffer;
        };

        // Función para obtener la extensión del archivo a partir del contentType
        const obtenerExtension = (contentType) => {
          switch (contentType) {
            case 'application/pdf':
              return '.pdf';
            case 'image/jpeg':
              return '.jpg';
            case 'image/png':
              return '.png';
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
              return '.docx';
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
              return '.xlsx';
            // Añadir otros tipos de contenido según sea necesario
            default:
              return '';
          }
        };

        // Añadir documentos al zip, reemplazando caracteres especiales y añadiendo extensión
        Object.entries(documentos).forEach(([key, doc], index) => {
          let { data, filename, contentType } = doc;

          if (data) {
            // Reemplazar caracteres que puedan causar problemas en nombres de archivo
            filename = filename.replace(/[\/\\?%*:|"<>]/g, '_');

            // Obtener la extensión del archivo
            const extension = obtenerExtension(contentType);
            const nombreConExtension = `${filename}${extension}`;

            console.log(`Añadiendo documento ${index + 1}: ${nombreConExtension}`);

            // Decodificar el contenido de Base64 a ArrayBuffer y añadirlo al zip
            const buffer = crearBufferDesdeBase64(data);
            zip.file(nombreConExtension, buffer, { binary: true });
          } else {
            console.warn(`El documento ${filename} no tiene contenido.`);
          }
        });

        const nroTramite = this.pago.nroTramite; // Cambiamos a nroTramite

        // Generar y descargar el archivo zip
        const zipContent = await zip.generateAsync({ type: 'blob' });
        saveAs(zipContent, `Habilitacion_${nroTramite}.zip`);
      } catch (error) {
        console.error('Error al descargar la habilitación:', error);
      }
    },
    openDocumento(documento, nombreDocumento) {
      if (!this.isValidBase64(documento.data)) {
        console.error('La cadena Base64 no es válida');
        return;
      }

      // Verificar si es un archivo HEIC
      if (documento.contentType === 'image/heic' || documento.contentType === 'image/heif' ||
          (documento.filename && documento.filename.toLowerCase().endsWith('.heic'))) {
        this.showHeicModal = true;
        this.currentDocumento = documento;
        return;
      }

      const decodedData = atob(documento.data); // Decodificar la data de Base64

      const arrayBuffer = new ArrayBuffer(decodedData.length);
      const arrayBufferView = new Uint8Array(arrayBuffer);

      for (let i = 0; i < decodedData.length; i++) {
        arrayBufferView[i] = decodedData.charCodeAt(i);
      }

      const blob = new Blob([arrayBuffer], { type: documento.contentType });
      const fileURL = URL.createObjectURL(blob);

      const newWindow = window.open('', '_blank');
      newWindow.document.title = documento.filename || `Documento: ${nombreDocumento}`;

      if (documento.contentType === 'application/pdf') {
        const embed = document.createElement('embed');
        embed.setAttribute('type', 'application/pdf');
        embed.setAttribute('src', fileURL);
        embed.setAttribute('width', '100%');
        embed.setAttribute('height', '100%');
        newWindow.document.body.appendChild(embed);
      } else if (documento.contentType.startsWith('image/')) {
        const img = document.createElement('img');
        img.setAttribute('src', fileURL);
        img.setAttribute('width', 'auto');
        img.setAttribute('height', 'auto');
        newWindow.document.body.appendChild(img);
      } else if (
        documento.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        documento.contentType === 'application/msword'
      ) {
        // Crear un link de descarga automática
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = documento.filename || 'documento.docx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.log('Formato de contenido no compatible');
      }
    },

    downloadHeicFile() {
      if (!this.currentDocumento) {
        console.error('No hay documento HEIC para descargar');
        return;
      }

      try {
        // Decodificar la data de Base64
        const decodedData = atob(this.currentDocumento.data);
        const arrayBuffer = new Uint8Array(decodedData.length);

        for (let i = 0; i < decodedData.length; i++) {
          arrayBuffer[i] = decodedData.charCodeAt(i);
        }

        // Crear el blob con el tipo MIME correcto para HEIC
        const blob = new Blob([arrayBuffer], {
          type: this.currentDocumento.contentType || 'image/heic'
        });

        // Crear el enlace de descarga
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = this.currentDocumento.filename || 'archivo.heic';
        a.style.display = 'none';

        // Agregar al DOM, hacer clic y limpiar
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Liberar la URL del objeto
        URL.revokeObjectURL(a.href);

        // Cerrar el modal
        this.showHeicModal = false;

      } catch (error) {
        console.error('Error al descargar el archivo HEIC:', error);
        this.$bvToast.toast('Error al descargar el archivo', {
          variant: 'danger',
          title: 'Error'
        });
      }
    },

    onRestablecer(){
      this.showRestoreDefault = !this.showRestoreDefault
    },
    async onSendRestablecer(){

      const observaciones = this.pago.observaciones || ""
      const pago = {
        status: 'En revisión',
        observaciones: observaciones + " - " + "Se restablece el trámite a 'En revisión' el día " + new Date().toLocaleDateString('es-AR')
      }

      const id = this.pago.id
      const userToken = this.$store.state.user.token
      await this.$store.dispatch('pagosDobles/update', {
        id,
        pago,
      })
      this.registrarActividad('Volver a En Revisión', 'Solicitud Reestablecida. Observaciones: ' + observaciones, this.pago.nroTramite)
      this.wait(300)
      this.pago.status = pago.status
      this.showRestoreDefault = false
    },
    onResetEdit() {
      this.editing = false
    },
  },
}
</script>

<style scoped>
.expediente-input {
  border-radius: 6px;
  transition: all 0.3s ease;
}

.expediente-input:focus {
  border-color: #a0bd0a;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.expediente-label {
  font-weight: 400;
  color: #495057;
  margin-bottom: 8px;
}

.expediente-text {
  font-weight: 500;
  color: #6c757d;
  font-size: 0.95rem;
}

.expediente-container {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin: 10px 0;
  border: 1px solid #dee2e6;
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
