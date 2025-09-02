<template>
  <div class="page main-background">
    <Banner title="Detalles de solicitud"/>
    <div v-if="!habilitacion" class="text-center mt-3">
      <h2> Cargando </h2>
      <h4> Por favor espere unos segundos </h4>
    </div>
    <!-- Datos generales -->
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
        <div class="col mx-auto" v-if="habilitacion.status === 'Finalizada' || !esHabilitacion">
          <div class="h5 row justify-content-center"> Número de expediente: <b class="text-success ml-1"> {{ habilitacion.nroExpediente }} </b> </div>
          <div class="h5 row justify-content-center" v-if="!esHabilitacion"> Alcance: <b class="text-success ml-1"> {{ habilitacion.alcance }} </b> </div>
          <div class="h5 row justify-content-center" v-if="!esHabilitacion"> Legajo: <b class="text-success ml-1"> {{ habilitacion.nroLegajo }} </b> </div>
        </div>
      </div>
      <!--Botones-->
      <div class="row col-10 mx-auto justify-content-center" v-if="jefeComercio">
        <b-button @click="onShowSolicitarDocumentacion" variant="success" class="btn-4 mt-3 mx-1" v-if="habilitacion && habilitacion.status === 'Inspeccionado'"> Solicitar documentación </b-button>
        <!-- <b-button @click="onShowRectificacion" variant="secondary " class="btn-4 mt-3 mx-1" v-if="habilitacion && habilitacion.status === 'En revisión'"> Rectificación </b-button> -->
        <b-button @click="onShowFinalizarSolicitud" variant="success" class="btn-4 mt-3 mx-1" v-if="(!renovacion && !reempadronamiento) && habilitacion && (habilitacion.status === 'Esperando documentación' || habilitacion.status === 'Esperando pago')"> Finalizar solicitud </b-button>
        <b-button @click="onShowFinalizarRenovacion" variant="success" class="btn-4 mt-3 mx-1" v-if="(renovacion || reempadronamiento) && habilitacion && habilitacion.status === 'Esperando documentación'"> Finalizar solicitud </b-button>
        <b-button @click="onRestablecer" variant="secondary" class="btn-4 mt-3 mx-1" v-if="adminMaster && habilitacion && habilitacion.status != 'En revisión'"> Volver a estado En Revisión </b-button>
        <b-button @click="onShowObservaciones" variant="primary" class="btn-2 mt-3 mx-1"> Ver observaciones </b-button>
        <b-button @click="onDescargarHabilitacion(); registrarActividad('Descargar Trámite', 'Trámite Descargado', habilitacion.nroTramite)" v-if="adminComercio || adminArvige || adminModernizacion" variant="success" class="btn-4 mt-3 mx-1">
          <b-icon icon="download" class="mr-1"></b-icon> Descargar trámite
        </b-button>
      </div>

      <!--Datos del solicitante-->
      <b-card no-body class="container col-md-6 col-sm-8 shadow-card mt-4 mx-auto">
          <div class="col mx-auto">
            <div class="container text-center mx-auto">
              <div class="row align-items-center">
                <div class="col">
                  <h2 class="text-success mt-2"><b> Datos del solicitante </b></h2>
                </div>
                <!-- Controles de revisión para datos del solicitante -->
                <div class="col-auto" v-if="jefeComercio && habilitacion && habilitacion.status === 'En revisión'">
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="revisionSolicitante" id="solicitanteCorrecto"
                           value="correcto" v-model="revisionSolicitante" @change="actualizarRevision('solicitante')">
                    <label class="form-check-label text-success" for="solicitanteCorrecto">
                      <b-icon-check-circle-fill></b-icon-check-circle-fill>
                    </label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="revisionSolicitante" id="solicitanteIncorrecto"
                           value="incorrecto" v-model="revisionSolicitante" @change="actualizarRevision('solicitante')">
                    <label class="form-check-label text-danger" for="solicitanteIncorrecto">
                      <b-icon-x-circle-fill></b-icon-x-circle-fill>
                    </label>
                  </div>
                </div>
              </div>
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
              <div class="row align-items-center">
                <div class="col">
                  <h2 class="text-success mt-2"><b> Datos del inmueble </b></h2>
                </div>
                <!-- Controles de revisión para datos del inmueble -->
                <div class="col-auto" v-if="jefeComercio && habilitacion && habilitacion.status === 'En revisión'">
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="revisionInmueble" id="inmuebleCorrecto"
                           value="correcto" v-model="revisionInmueble" @change="actualizarRevision('inmueble')">
                    <label class="form-check-label text-success" for="inmuebleCorrecto">
                      <b-icon-check-circle-fill></b-icon-check-circle-fill>
                    </label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="revisionInmueble" id="inmuebleIncorrecto"
                           value="incorrecto" v-model="revisionInmueble" @change="actualizarRevision('inmueble')">
                    <label class="form-check-label text-danger" for="inmuebleIncorrecto">
                      <b-icon-x-circle-fill></b-icon-x-circle-fill>
                    </label>
                  </div>
                </div>
              </div>
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
            <div class="layout">
              <p class="col col-main">
                <strong>Descripción del rubro</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ habilitacion.descripcionRubro }}</a>
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
                <strong class="text-primary">- Mercadería: </strong> <b-icon-check-circle-fill variant="info" v-if="habilitacion.mercaderia"></b-icon-check-circle-fill>
                  <b-icon-x-circle-fill variant="danger" v-else></b-icon-x-circle-fill><br>
              </p>
            </div>
            <div v-if="!baja && hoteleria">
              <div class="layout" v-if="!baja">
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
            <br>
          </div>
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
        <div class="container justify-content-center mx-auto mb-3" v-if="documentos">
          <!-- Header con controles de revisión -->
          <div class="row mb-2" v-if="jefeComercio && habilitacion && habilitacion.status === 'En revisión'">
            <div class="col-8">
              <strong>Documento</strong>
            </div>
            <div class="col-2 text-center">
              <strong>Ver</strong>
            </div>
            <div class="col-2 text-center">
              <strong>Revisión</strong>
              <div class="mt-1 d-flex justify-content-center">
                <span class="text-success mr-3">
                  <b-icon-check-circle-fill></b-icon-check-circle-fill>
                </span>
                <span class="text-danger mr-3">
                  <b-icon-x-circle-fill></b-icon-x-circle-fill>
                </span>
              </div>
            </div>
          </div>

          <div v-for="(documento, nombreDocumento, index) in documentos" :key="nombreDocumento">
            <div class="row align-items-center py-1" v-if="documento">
              <div class="col-8">
                <strong>{{ nombreDocumento }}</strong>
              </div>
              <div class="col-2 text-center">
                <b-button size="sm" @click="openDocumento(documento, nombreDocumento)" variant="outline-primary" pill>
                  <b-icon icon="eye-fill" scale="1.2"></b-icon>
                </b-button>
              </div>
              <!-- Controles de revisión para cada documento -->
              <div class="col-2 text-center" v-if="jefeComercio && habilitacion && habilitacion.status === 'En revisión'">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio"
                         :name="'revisionDoc_' + nombreDocumento"
                         :id="'docCorrecto_' + nombreDocumento"
                         value="correcto"
                         v-model="revisionDocumentos[nombreDocumento]"
                         @change="actualizarRevision('documento', nombreDocumento)">
                  <label class="form-check-label" :for="'docCorrecto_' + nombreDocumento">
                  </label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio"
                         :name="'revisionDoc_' + nombreDocumento"
                         :id="'docIncorrecto_' + nombreDocumento"
                         value="incorrecto"
                         v-model="revisionDocumentos[nombreDocumento]"
                         @change="actualizarRevision('documento', nombreDocumento)">
                  <label class="form-check-label" :for="'docIncorrecto_' + nombreDocumento">
                  </label>
                </div>
              </div>
            </div>
            <!-- Línea separadora entre documentos -->
            <hr v-if="documento && index < Object.keys(documentos).length - 1" class="my-1" style="border-color: #dee2e6; border-width: 1px;">
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

    <!-- Botón Finalizar Revisión - Prominente y en su propia fila -->
    <div class="text-center my-4" v-if="jefeComercio && habilitacion && habilitacion.status === 'En revisión'">
      <b-button @click="onFinalizarRevision" variant="success" class="px-4 py-2">
        <b-icon-check-circle-fill class="mr-2"></b-icon-check-circle-fill>
        Finalizar Revisión
      </b-button>
    </div>

    <!-- Botón Volver - Abajo -->
    <div class="text-center my-3">
      <NuxtLink to="/comercio/solicitudes">
        <b-button variant="primary" class="mx-2">Volver</b-button>
      </NuxtLink>
    </div>

    <!-- Modals -->
    <!--Modal previo a rechazar el trámite-->
    <b-modal v-model="showRejectPopup" hide-footer :header-bg-variant="'danger'" centered>
        <template #modal-header>
          <div class="confirmation-popup-header mx-auto">
            <b-icon-envelope scale="2" variant="light" />
          </div>
        </template>
        <div class="confirmation-popup-body">
          <h2 class="icon-orange text-danger text-center"><b>Rechazar solicitud</b></h2>
          <p>La solicitud será rechazada automáticamente. Se enviará un correo electrónico al solicitante con los motivos del rechazo.</p>

          <!-- Elementos marcados como incorrectos -->
          <div v-if="elementosIncorrectos.length > 0" class="mt-3">
            <h6 class="text-danger"><b>Elementos marcados como incorrectos:</b></h6>
            <ul class="text-left">
              <li v-for="elemento in elementosIncorrectos" :key="elemento" class="mb-1">
                {{ elemento }}
              </li>
            </ul>
          </div>

          <!-- <p>Observaciones:  </p>
          <b-form-textarea v-model="observaciones" required type="text" /> -->

          <div class="text-center mt-3">
            <b-btn variant="danger" @click="onSendReject()" >
                Confirmar Rechazo
            </b-btn>
          </div>
        </div>
    </b-modal>

    <!--Modal solicitar rectificación de datos-->
    <!-- <b-modal v-model="showRectificacion" hide-footer :header-bg-variant="'secondary'" centered>
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
    </b-modal> -->

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
            <label class="form-check-label" for="documentCheckbox"><b> Si. </b> Se enviará automáticamente un mail indicando que la persona deberá pedir un Turno Web para Inspección Comercial.</label>
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
        <p style="margin: 3%" class="text-center">  Se enviará automáticamente un mail al solicitante indicando que el
           trámite está aprobado y que deberá concurrir al Departamento Comercio con la documentación original y
           efectuar el pago de las deudas de tasas previstas para el rubro.</p>
        <hr/>
        <div class="text-center mt-3">
          <b-btn variant="primary" @click="onSendAprobarBaja()" >
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
        <h3 class="icon-orange text-success text-center" v-if="!baja"><b>Aprobar solicitud</b></h3>
        <h3 class="icon-orange text-success text-center" v-else><b>Trámite finalizado</b></h3>

        <p v-if="!baja">La solicitud fue aprobada con éxito. Se envió un correo electrónico al solicitante indicando que en el plazo de 10 días hábiles:</p>
        <p style="text-align: center" v-else>Se envió un correo electrónico al solicitante indicando que el trámite ha sido finalizado.</p>
        <ul>
          <!-- <li v-if="!baja">  Abone la tasa de Habilitación Comercial prevista para el rubro. </li> -->
          <li v-if="!baja"> Abone la tasa prevista para el rubro.</li>
          <li v-if="!baja && inspeccion"> Solicite un turno web para inspección comercial.</li>
          <li v-if="!baja && !inspeccion">  Concurra al Departamento de Comercio con la documentación original y el Libro de Actas. </li>
          <li v-if="!baja">  Constituya el Domicilio Fiscal Electrónico (DFE). </li>
        </ul>
        <div class="text-center mt-3">
          <b-btn variant="success" @click="showApprove = false">
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
        <p>La inspección fue aprobada con éxito. Se enviará automáticamente un correo electrónico al solicitante indicando que en el plazo de 10 días hábiles:</p>
        <ul>
          <li>  Abone la tasa prevista para el rubro. </li>
          <li>  Concurra al Departamento Comercio con la documentación original. </li>
          <li>  Constituya el Domicilio Fiscal Electrónico (DFE). </li>
        </ul>
        <div class="text-center mt-3">
          <b-btn variant="success" @click="onSendSolicitar()" >
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
      <div class="confirmation-popup-body">
        <h3 class="text-success text-center"><b>Finalizar trámite</b></h3>
        <p>El trámite será finalizado.</p>
        <p> Ingresa el número de expediente asignado a este trámite: </p>
        <div class="expediente-form-container">
          <div class="form-group mb-3">
            <label class="form-label">
              <b-icon-caret-right-fill class="icon-orange me-2"/>
              <strong>Número de expediente:</strong>
            </label>
            <div class="expediente-input-group">
              <span class="expediente-prefix">4124 -</span>
              <b-form-input
                class="expediente-input"
                type="number"
                no-wheel
                size="sm"
                v-model="nroExpediente1"
                placeholder="Número"
              />
              <span class="expediente-separator">/</span>
              <b-form-input
                class="expediente-input"
                size="sm"
                type="number"
                no-wheel
                v-model="nroExpediente2"
                placeholder="Año"
              />
            </div>
          </div>

          <div class="form-group mb-3" v-if="!esHabilitacion">
            <label class="form-label">
              <b-icon-caret-right-fill class="icon-orange me-2"/>
              <strong>Alcance:</strong>
            </label>
            <b-form-input
              class="alcance-input"
              type="number"
              no-wheel
              size="sm"
              v-model="alcance"
              placeholder="Ingrese el alcance"
            />
          </div>
        </div>
        <small> Recordá que más adelante podrás consultar los datos proporcionados en la sección de búsqueda. </small>
        <div class="text-center mt-3">
          <b-btn variant="success" :disabled="!nroExpediente1 || !nroExpediente2" @click="onSendFinalizar();" >
              Aceptar
          </b-btn>
        </div>
      </div>
    </b-modal>

    <!--Modal finalizar trámite y colocar el número de expediente-->
    <b-modal v-model="showFinalizarRenovacion" hide-footer :header-bg-variant="'success'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-check-circle scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body" v-if="!baja">
        <h3 class="text-success text-center"><b>Finalizar trámite</b></h3>
        <p>El trámite será finalizado.</p>
        <p> Ingresa el número de expediente asignado a este trámite: </p>
        <div class="expediente-form-container">
          <div class="form-group mb-3">
            <label class="form-label">
              <b-icon-caret-right-fill class="icon-orange me-2"/>
              <strong>Número de expediente:</strong>
            </label>
            <div class="expediente-input-group">
              <span class="expediente-prefix">4124 -</span>
              <b-form-input
                class="expediente-input"
                type="number"
                no-wheel
                size="sm"
                v-model="nroExpediente1"
                placeholder="Número"
              />
              <span class="expediente-separator">/</span>
              <b-form-input
                class="expediente-input"
                size="sm"
                type="number"
                no-wheel
                v-model="nroExpediente2"
                placeholder="Año"
              />
            </div>
          </div>

          <div class="form-group mb-3">
            <label class="form-label">
              <b-icon-caret-right-fill class="icon-orange me-2"/>
              <strong>Alcance:</strong>
            </label>
            <b-form-input
              class="alcance-input"
              type="number"
              no-wheel
              size="sm"
              v-model="alcance"
              placeholder="Ingrese el alcance"
            />
          </div>
        </div>
        <small> Recordá que más adelante podrás consultar los datos proporcionados en la sección de búsqueda. </small>
        <div class="text-center mt-3">
          <b-btn variant="success" :disabled="!nroExpediente1 || !nroExpediente2 || !alcance" @click="onSendFinalizarRenovacion()" >
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
        <h3 class="icon-orange text-primary text-center"><b>{{ DocumentoModalTitle + " - " + habilitacion.nroTramite }}</b></h3>
      </template>
      <div class="modal-body">

      </div>
    </b-modal>

    <!--Modal revisión incompleta-->
    <b-modal v-model="showRevisionIncompleta" hide-footer :header-bg-variant="'warning'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-exclamation-triangle scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body text-center">
        <h3 class="text-warning text-center mb-4"><b>Revisión Incompleta</b></h3>
        <p style="color:black">No has revisado todo el trámite.</p>
        <p style="color:black">Por favor, completa la revisión de todos los elementos antes de finalizar.</p>
        <small>Debes revisar los datos del solicitante, datos del inmueble y todos los documentos presentados.</small>
        <div class="text-center mt-4">
          <b-btn variant="warning" @click="showRevisionIncompleta = false">
              Aceptar
          </b-btn>
        </div>
      </div>
    </b-modal>

    <!--Modal rechazo automático-->
    <b-modal v-model="showRechazoAutomatico" hide-footer :header-bg-variant="'danger'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-exclamation-triangle scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body text-center">
        <h3 class="text-danger text-center mb-4"><b>Rechazo Automático</b></h3>
        <p class="font-weight-bold" style="color:black; font-size: 1.1rem;">Se detectó al menos un documento o dato incorrecto.</p>
        <p style="color:black">El trámite será rechazado automáticamente al finalizar la revisión.</p>
        <small>Revisá todos los elementos marcados como incorrectos<br/> antes de continuar.</small>
        <div class="text-center mt-4">
          <b-btn variant="danger" @click="showRechazoAutomatico = false">
              Aceptar
          </b-btn>
        </div>
      </div>
    </b-modal>

  </div>
</template>

<script>
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import MailerService from "@/service/mailer.js";

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
        'Esperando pago': 'text-success',
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
      showFinalizarRenovacion: false,
      showRejectPopup: false,
      showSolicitarDoc: false,
      showRestoreDefault: false,
      showObservaciones: false,
      habilitacion: null,
      turno: null,
      observaciones: '',
      nroExpediente1: null,
      nroExpediente2: null,
      alcance: null,
      showDocumentoModal: false,
      DocumentoModalTitle: "",
      showRevisionIncompleta: false,
      showRechazoAutomatico: false,
      // Variables para el sistema de revisión
      revisionSolicitante: null,
      revisionInmueble: null,
      revisionDocumentos: {},
      rechazoAutomaticoMostrado: false,
      elementosIncorrectos: [],
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
    esHabilitacion(){
      return this.habilitacion && this.habilitacion.tipoSolicitud === "Habilitación"
    },
    renovacion(){
      return this.habilitacion && this.habilitacion.tipoSolicitud === "Renovación"
    },
    reempadronamiento(){
      return this.habilitacion && this.habilitacion.tipoSolicitud === "Reempadronamiento"
    },

    adminComercio(){
      return this.$store.state.user.admin == "comercio" || this.$store.state.user.admin == "master"
    },
    adminArvige(){
      return this.$store.state.user.admin == "arvige" || this.$store.state.user.admin == "master"
    },
    adminModernizacion(){
      return this.$store.state.user.admin == "modernizacion" || this.$store.state.user.admin == "master"
    },
    adminMaster(){
      return this.$store.state.user.admin == "master"
    },
    jefeComercio(){
      return (this.$store.state.user.username === "myriamalonso@gesell.gob.ar"
              || this.$store.state.user.username === "nataliamegias@gesell.gob.ar"
              || this.$store.state.user.username === "mariaelisabetbahlcke@gesell.gob.ar") || this.$store.state.user.admin == "master"
    },
    hoteleria(){
      for (const item of this.habilitacion.serviciosHoteleria) {
        if (item.value !== false) {
          return true;
        }
      }
      return false;
    },
    documentos(){
      return this.$store.state.documentos.all
    },

        elementosIncorrectos() {
      const elementos = [];

      // Verificar datos del solicitante
      if (this.revisionSolicitante === 'incorrecto') {
        elementos.push('Datos del solicitante');
      }

      // Verificar datos del inmueble
      if (this.revisionInmueble === 'incorrecto') {
        elementos.push('Datos del inmueble');
      }

      // Verificar documentos incorrectos
      if (this.revisionDocumentos) {
        Object.entries(this.revisionDocumentos).forEach(([nombreDocumento, valor]) => {
          if (valor === 'incorrecto') {
            elementos.push(nombreDocumento);
          }
        });
      }

      console.log('Elementos incorrectos:', elementos);
      return elementos;
    }
  },
  async fetch() {
    const habilitacionId = this.$route.params.id
    await this.$store.dispatch('habilitaciones/getSingle',{
      id: habilitacionId,
    })
    this.habilitacion = this.$store.state.habilitaciones.single

    // Verificar que habilitacion existe antes de acceder a sus propiedades
    if (!this.habilitacion) {
      console.error('No se pudo cargar la habilitación')
      return
    }

    const nroTramite = this.habilitacion.nroTramite
    await this.$store.dispatch('turnos/getSingle', { nroTramite })
    this.turno = this.$store.state.turnos.single

    await this.$store.dispatch('documentos/getById', {
      id: habilitacionId,
    })
  },
  fetchOnServer: false,
  activated() {
    this.$fetch()
  },
  methods: {
    async registrarActividad(evento, result, nroSolicitud){
      const userId = this.$store.state.user.username; // Reemplaza con el ID del usuario real
      const actionType = evento;
      const actionResult = "Trámite nro " + nroSolicitud + ' ' + result;

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
    onShowRectificacion(){
      this.showRectificacion = true
    },
    onShowSolicitarDocumentacion(){
      this.showSolicitarDoc = true
    },
    onShowAprobarBaja(){
      this.showAprobarBaja = true
    },
    async onShowAprobarSolicitud(){
      this.showPrevApprove = true
    },
    onShowFinalizarSolicitud(){
      this.showFinalizar = true
    },
    onShowFinalizarRenovacion(){
      this.showFinalizarRenovacion = true
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
      const observaciones = this.habilitacion.observaciones || ""
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
      this.registrarActividad('Rectificar Trámite', 'Rectificación Solicitada', this.habilitacion.nroTramite)
      this.wait(300)
      this.habilitacion.status = habilitacion.status
      this.showRectificacion = false
    },
    async onSendSolicitar(){
      const observaciones = this.habilitacion.observaciones || ""

      const habilitacion = {
        status: 'Esperando documentación',
        observaciones: observaciones + " - " + "Se solicita documentación el día " + new Date().toLocaleDateString('es-AR')
      }
      const id = this.habilitacion.id
      const userToken = this.$store.state.user.token
      await this.$store.dispatch('habilitaciones/update', {
        id,
        habilitacion,
      })
      this.registrarActividad('Solicitar Documentación', 'Documentación Solicitada', this.habilitacion.nroTramite)

      // --- Enviar correo al solicitante ---
      try {
        if (!this.habilitacion.mail) {
          console.error('No se encontró el email del solicitante')
          this.$bvToast.toast('No se pudo enviar el correo: email del solicitante no disponible.', { variant: 'danger' })
          return
        }

        const destinatario = this.habilitacion.mail
        const asunto = `Documentación requerida - Trámite N° ${this.habilitacion.nroTramite}`
        const mensaje = `Estimado/a contribuyente,

Su trámite comercial requiere que presente los originales de los documentos que envió online.

Número de trámite: ${this.habilitacion.nroTramite}
Tipo de solicitud: ${this.habilitacion.tipoSolicitud}
Rubro: ${this.habilitacion.rubro}

Por favor, presente los documentos originales en el Departamento Comercio MVGesell para continuar con el trámite.

Si tiene dudas o necesita más información, por favor comuníquese con el Departamento Comercio MVGesell (deptocomercio@gesell.gob.ar).`

        await MailerService.enviarCorreo(this.$axios, { destinatario, asunto, mensaje })
        this.$bvToast.toast('Correo de solicitud de documentación enviado al solicitante.', { variant: 'success' })
      } catch (e) {
        this.$bvToast.toast('No se pudo enviar el correo de solicitud de documentación.', { variant: 'danger' })
      }

      this.wait(300)
      this.habilitacion.status = habilitacion.status
      this.showSolicitarDoc = false
    },
    async onSendFinalizar(){
      var nroExpediente = ''
      var alcance = ''
      if(this.baja){
        alcance = this.alcance
      }
      nroExpediente = "4124-" + this.nroExpediente1 + "/" + this.nroExpediente2
      const observaciones = this.habilitacion.observaciones || ""
      const habilitacion = {
        status: 'Finalizada',
        nroExpediente: nroExpediente,
        alcance: alcance,
        observaciones: observaciones + " - " + "Se finaliza el trámite el día " + new Date().toLocaleDateString('es-AR')
      }
      const id = this.habilitacion.id
      const userToken = this.$store.state.user.token
      await this.$store.dispatch('habilitaciones/update', {
        id,
        habilitacion,
      })
      if(this.baja){
        this.registrarActividad('Finalizar Baja', 'Trámite Cerrado. Expediente: ' + nroExpediente + ". Alcance: " + alcance, this.habilitacion.nroTramite)
      }else{
        this.registrarActividad('Finalizar Habilitación', 'Trámite Cerrado. Expediente: ' + nroExpediente + ". Alcance: " + alcance, this.habilitacion.nroTramite)
      }

      // --- Enviar correo al solicitante ---
      try {
        if (!this.habilitacion.mail) {
          console.error('No se encontró el email del solicitante para finalización')
          this.$bvToast.toast('No se pudo enviar el correo: email del solicitante no disponible.', { variant: 'danger' })
        } else {
          const destinatario = this.habilitacion.mail
          const asunto = `Trámite comercial finalizado - N° ${this.habilitacion.nroTramite}`
          const mensaje = `Estimado/a contribuyente,

Su trámite comercial ha sido finalizado exitosamente.

Número de trámite: ${this.habilitacion.nroTramite}
Tipo de solicitud: ${this.habilitacion.tipoSolicitud}
Rubro: ${this.habilitacion.rubro}
Número de expediente: ${nroExpediente}${alcance ? '\nAlcance: ' + alcance : ''}

El trámite ha sido culminado exitosamente. Recuerde que en el plazo de 10 dias hábiles deberá acreditar
los originales de la documentación en el Departamento Comercio sito en Avda 3 N° 820 Planta Baja - Villa Gesell.`

          await MailerService.enviarCorreo(this.$axios, { destinatario, asunto, mensaje })
          this.$bvToast.toast('Correo de finalización enviado al solicitante.', { variant: 'success' })
        }
      } catch (e) {
        this.$bvToast.toast('No se pudo enviar el correo de finalización.', { variant: 'danger' })
      }

      this.wait(300)
      this.habilitacion.status = habilitacion.status
      this.showFinalizar = false
      if(this.baja){
        this.showApprove = true
      }
    },
    onRestablecer(){
      this.showRestoreDefault = !this.showRestoreDefault
    },
    async onSendRestablecer(){

      const observaciones = this.habilitacion.observaciones || ""
      const habilitacion = {
        status: 'En revisión',
        observaciones: observaciones + " - " + "Se restablece el trámite a 'En revisión' el día " + new Date().toLocaleDateString('es-AR')
      }

      const id = this.habilitacion.id
      const userToken = this.$store.state.user.token
      await this.$store.dispatch('habilitaciones/update', {
        id,
        habilitacion,
      })
      this.registrarActividad('Volver a En Revisión', 'Solicitud Reestablecida. Observaciones: ' + observaciones, this.habilitacion.nroTramite)
      this.wait(300)
      this.habilitacion.status = habilitacion.status
      this.showRestoreDefault = false
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
      this.registrarActividad('Aprobar Habilitación', 'Habilitación Aprobada. Inspeccion: ' + this.inspeccion, this.habilitacion.nroTramite)

      // --- Enviar correo al solicitante ---
      try {
        if (!this.habilitacion.mail) {
          console.error('No se encontró el email del solicitante')
          this.$bvToast.toast('No se pudo enviar el correo: email del solicitante no disponible.', { variant: 'danger' })
          return
        }

        const destinatario = this.habilitacion.mail
        let asunto, mensaje

        if (this.inspeccion) {
          asunto = `Solicitud de trámite comercial aprobada - Requiere inspección - N° ${this.habilitacion.nroTramite}`
          mensaje = `Estimado/a contribuyente,

Su solicitud de trámite comercial ha sido aprobada exitosamente. Ha finalizado la etapa de revisión y la documentación presentada es correcta.

Importante: Su comercio requiere inspección para continuar con el trámite.

Número de trámite: ${this.habilitacion.nroTramite}
Tipo de solicitud: ${this.habilitacion.tipoSolicitud}
Rubro: ${this.habilitacion.rubro}

Para continuar con el trámite, debe solicitar un turno para inspección comercial en la página de turnos web.
Puede acceder a la página de turnos en: https://haciendavgesell.gob.ar/comercio/turnos .`
        } else {
          asunto = `Solicitud de trámite comercial aprobada - N° ${this.habilitacion.nroTramite}`
          mensaje = `Estimado/a contribuyente,

Su solicitud de trámite comercial ha sido aprobada exitosamente.

Número de trámite: ${this.habilitacion.nroTramite}
Tipo de solicitud: ${this.habilitacion.tipoSolicitud}
Rubro: ${this.habilitacion.rubro}

Para completar el trámite, en el plazo de 10 días hábiles debe:

• Concurrir al Departamento Comercio MVGesell con los originales de los documentos presentados online
y proceder al pago de la Tasa de Habilitacion pertinente.
• Constituir el Domicilio Fiscal Electrónico (DFE) solicitando datos a dirarvige@gesell.gob.ar.`
        }

        await MailerService.enviarCorreo(this.$axios, { destinatario, asunto, mensaje })
        this.$bvToast.toast('Correo de aprobación enviado al solicitante.', { variant: 'success' })
      } catch (e) {
        this.$bvToast.toast('No se pudo enviar el correo de aprobación.', { variant: 'danger' })
      }

      this.wait(300)
      this.habilitacion.status = habilitacion.status
      this.showPrevApprove = false
      this.showApprove = true
    },
    async onSendAprobarBaja(){
      const observaciones = this.habilitacion.observaciones || " "
      const nroExpediente = "4124 - " + this.nroExpediente1 + "/" + this.nroExpediente2
      const alcance = this.alcance
      const habilitacion = {
        status: 'Esperando pago',
        nroExpediente: nroExpediente,
        alcance: alcance,
        observaciones: observaciones + " - " + "Se aprueba la solicitud el " + new Date().toLocaleDateString('es-AR') + " " + new Date().toLocaleTimeString() + ". Esperando pago."
      }
      const id = this.habilitacion.id
      const userToken = this.$store.state.user.token
      await this.$store.dispatch('habilitaciones/update', {
        id,
        habilitacion,
      })
      this.registrarActividad('Aprobar Baja', 'Baja Aprobada', this.habilitacion.nroTramite)

      // --- Enviar correo al solicitante ---
      try {
        if (!this.habilitacion.mail) {
          console.error('No se encontró el email del solicitante para aprobación de baja')
          this.$bvToast.toast('No se pudo enviar el correo: email del solicitante no disponible.', { variant: 'danger' })
          return
        }

        const destinatario = this.habilitacion.mail
        const asunto = `Solicitud de baja aprobada - N° ${this.habilitacion.nroTramite}`
        const mensaje = `Estimado/a contribuyente,

Su solicitud de baja ha sido aprobada exitosamente.

Número de trámite: ${this.habilitacion.nroTramite}
Tipo de solicitud: ${this.habilitacion.tipoSolicitud}
Rubro: ${this.habilitacion.rubro}

Para completar el trámite, debe abonar los cánones correspondientes en el Departamento Comercio MVGesell. Una vez realizado el pago, se le notificará la finalización del trámite.

Si tiene dudas o necesita más información, por favor comuníquese con el Departamento Comercio MVGesell (deptocomercio@gesell.gob.ar).`

        await MailerService.enviarCorreo(this.$axios, { destinatario, asunto, mensaje })
        this.$bvToast.toast('Correo de aprobación de baja enviado al solicitante.', { variant: 'success' })
      } catch (e) {
        this.$bvToast.toast('No se pudo enviar el correo de aprobación de baja.', { variant: 'danger' })
      }

      this.wait(300)
      this.habilitacion.status = habilitacion.status
      this.showPrevApprove = false
      if(this.baja){
        this.showAprobarBaja = false
      }
    },
    async onSendFinalizarRenovacion(){
      const observaciones = this.habilitacion.observaciones || " "
      const nroExpediente = "4124 - " + this.nroExpediente1 + "/" + this.nroExpediente2
      const alcance = this.alcance
      const habilitacion = {
        status: 'Finalizada',
        nroExpediente: nroExpediente,
        alcance: alcance,
        observaciones: observaciones + " - " + "Se finaliza la solicitud el " + new Date().toLocaleDateString('es-AR') + " " + new Date().toLocaleTimeString()
      }
      const id = this.habilitacion.id
      const userToken = this.$store.state.user.token
      await this.$store.dispatch('habilitaciones/update', {
        id,
        habilitacion,
      })
      if(this.reempadronamiento){
        this.registrarActividad('Finalizar Reempadronamiento', 'Reempadronamiento Finalizado', this.habilitacion.nroTramite)
      }else{
        this.registrarActividad('Finalizar Renovación', 'Renovación Finalizada', this.habilitacion.nroTramite)
      }

      // --- Enviar correo al solicitante ---
      try {
        if (!this.habilitacion.mail) {
          console.error('No se encontró el email del solicitante para finalización de renovación')
          this.$bvToast.toast('No se pudo enviar el correo: email del solicitante no disponible.', { variant: 'danger' })
        } else {
          const destinatario = this.habilitacion.mail
          const tipoTramite = this.reempadronamiento ? 'reempadronamiento' : 'renovación'
          const asunto = `${tipoTramite.charAt(0).toUpperCase() + tipoTramite.slice(1)} finalizada - N° ${this.habilitacion.nroTramite}`
          const mensaje = `Estimado/a contribuyente,

Su trámite de ${tipoTramite} ha sido finalizado exitosamente.

Número de trámite: ${this.habilitacion.nroTramite}
Tipo de solicitud: ${this.habilitacion.tipoSolicitud}
Rubro: ${this.habilitacion.rubro}
Número de expediente: ${nroExpediente}
Alcance: ${alcance}

El trámite está completo. En los próximos días recibirá la documentación correspondiente.

Si tiene dudas o necesita más información, por favor comuníquese con el Departamento Comercio MVGesell (renovacioncomercial@gesell.gob.ar).`

          await MailerService.enviarCorreo(this.$axios, { destinatario, asunto, mensaje })
          this.$bvToast.toast(`Correo de finalización de ${tipoTramite} enviado al solicitante.`, { variant: 'success' })
        }
      } catch (e) {
        this.$bvToast.toast('No se pudo enviar el correo de finalización.', { variant: 'danger' })
      }

      this.wait(300)
      this.habilitacion.status = habilitacion.status
      this.showPrevApprove = false
      // this.showApprove = true
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
      this.registrarActividad('Rechazar Solicitud', 'Rechazado por: ' + observaciones, this.habilitacion.nroTramite)

      // --- Enviar correo al solicitante ---
      try {
        if (!this.habilitacion.mail) {
          console.error('No se encontró el email del solicitante para rechazo')
          this.$bvToast.toast('No se pudo enviar el correo: email del solicitante no disponible.', { variant: 'danger' })
          return
        }

        const destinatario = this.habilitacion.mail
        const asunto = `Solicitud de trámite comercial rechazada - N° ${this.habilitacion.nroTramite}`

        // Construir la lista de elementos incorrectos
        let elementosIncorrectosTexto = ''
        if (this.elementosIncorrectos && this.elementosIncorrectos.length > 0) {
          elementosIncorrectosTexto = `
${this.elementosIncorrectos.map(elemento => `• ${elemento}`).join('\n')}`
        }

        const mensaje = `Estimado/a contribuyente,

Su solicitud de trámite comercial ha sido rechazada.

Número de trámite: ${this.habilitacion.nroTramite}
Tipo de solicitud: ${this.habilitacion.tipoSolicitud}
Rubro: ${this.habilitacion.rubro}

Se han detectado elementos incorrectos en la documentación presentada, los cuales se detallan a continuación:
${elementosIncorrectosTexto}

Deberá volver a presentar la solicitud una vez subsanados los errores detectados.

Importante: La documentación que adjunte debe ser legible y en formato PDF o imagen.`
        await MailerService.enviarCorreo(this.$axios, { destinatario, asunto, mensaje })
        this.$bvToast.toast('Correo de rechazo enviado al solicitante.', { variant: 'success' })
      } catch (e) {
        this.$bvToast.toast('No se pudo enviar el correo de rechazo.', { variant: 'danger' })
      }

      this.wait(300)
      this.habilitacion.status = habilitacion.status
      this.observaciones = ''
      this.showRejectPopup = false
    },
    async onDescargarHabilitacion() {
      try {
        const id = this.habilitacion.id;

        // Obtenemos los datos y documentos de la habilitación del store
        const habilitacion = this.habilitacion;
        const documentos = this.documentos || {};

        const zip = new JSZip();

        // Convertir los datos de la habilitación a Excel
        const datosHabilitacion = XLSX.utils.json_to_sheet([habilitacion]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, datosHabilitacion, 'Datos_Habilitacion');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        zip.file('datos_habilitacion.xlsx', excelBuffer);

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

        const nroTramite = this.habilitacion.nroTramite; // Cambiamos a nroTramite

        // Generar y descargar el archivo zip
        const zipContent = await zip.generateAsync({ type: 'blob' });
        saveAs(zipContent, `Habilitacion_${nroTramite}.zip`);
      } catch (error) {
        console.error('Error al descargar la habilitación:', error);
      }
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
    openDocumento(documento, nombreDocumento) {
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

        // Método unificado para el sistema de revisión
    actualizarRevision(tipo, valor = null) {
      // Actualizar la lista de elementos incorrectos
      this.actualizarElementosIncorrectos();
      // Aquí se puede agregar lógica para guardar en el backend
      this.verificarRechazoAutomatico();
    },

    // Método para actualizar la lista de elementos incorrectos
    actualizarElementosIncorrectos() {
      const elementos = [];

      // Verificar datos del solicitante
      if (this.revisionSolicitante === 'incorrecto') {
        elementos.push('Datos del solicitante');
      }

      // Verificar datos del inmueble
      if (this.revisionInmueble === 'incorrecto') {
        elementos.push('Datos del inmueble');
      }

      // Verificar documentos incorrectos
      if (this.revisionDocumentos) {
        Object.entries(this.revisionDocumentos).forEach(([nombreDocumento, valor]) => {
          if (valor === 'incorrecto') {
            elementos.push(nombreDocumento);
          }
        });
      }

      this.elementosIncorrectos = elementos;
      console.log('Elementos incorrectos actualizados:', elementos);
    },

    verificarRechazoAutomatico() {
      // Verificar si hay algún documento marcado como incorrecto
      const hayDocumentoIncorrecto = Object.values(this.revisionDocumentos).some(valor => valor === 'incorrecto');

      // Verificar si hay datos incorrectos
      const hayDatosIncorrectos = this.revisionSolicitante === 'incorrecto' || this.revisionInmueble === 'incorrecto';

      if ((hayDocumentoIncorrecto || hayDatosIncorrectos) && !this.rechazoAutomaticoMostrado) {
        // Mostrar modal de rechazo automático solo la primera vez
        this.showRechazoAutomatico = true;
        this.rechazoAutomaticoMostrado = true;
      }
    },

    // Método para resetear el flag de rechazo automático
    resetearRechazoAutomatico() {
      this.rechazoAutomaticoMostrado = false;
    },

    onFinalizarRevision() {
      // Verificar si se han revisado todos los elementos
      const solicitanteRevisado = this.revisionSolicitante !== null;
      const inmuebleRevisado = this.revisionInmueble !== null;

      // Contar documentos revisados
      const documentosRevisados = Object.values(this.revisionDocumentos).filter(valor => valor !== null && valor !== undefined).length;
      const totalDocumentos = Object.keys(this.documentos || {}).length;

      // Verificar si faltan elementos por revisar
      if (!solicitanteRevisado || !inmuebleRevisado || documentosRevisados < totalDocumentos) {
        this.showRevisionIncompleta = true;
        return;
      }

      // Verificar si hay algo incorrecto
      const hayDocumentoIncorrecto = Object.values(this.revisionDocumentos).some(valor => valor === 'incorrecto');
      const hayDatosIncorrectos = this.revisionSolicitante === 'incorrecto' || this.revisionInmueble === 'incorrecto';

      if (hayDocumentoIncorrecto || hayDatosIncorrectos) {
        // Actualizar lista de elementos incorrectos antes de mostrar el modal
        this.actualizarElementosIncorrectos();
        // Mostrar popup de rechazo
        console.log('Abriendo modal de rechazo con elementos incorrectos:', this.elementosIncorrectos);
        this.onRechazarSolicitud();
      } else {
        // Mostrar popup de aprobación según el tipo de trámite
        if (this.baja) {
          this.onShowAprobarBaja();
        } else {
          this.onShowAprobarSolicitud();
        }
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

/* Estilos para los controles de revisión */
.form-check-inline {
  margin-right: 0.5rem;
}

.form-check-input:checked {
  background-color: #28a745;
  border-color: #28a745;
}

.form-check-input[value="incorrecto"]:checked {
  background-color: #dc3545;
  border-color: #dc3545;
}

.form-check-label {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Estilos para los iconos de revisión */
.form-check-label .bi-check-circle-fill {
  color: #28a745;
}

.form-check-label .bi-x-circle-fill {
  color: #dc3545;
}

/* Estilos para la sección de expediente y alcance */
.expediente-form-container {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  border: 1px solid #e9ecef;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.expediente-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.expediente-prefix {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
  white-space: nowrap;
}

.expediente-input {
  flex: 1;
  min-width: 100px;
  max-width: 120px;
}

.expediente-separator {
  font-weight: 600;
  color: #6c757d;
  font-size: 1rem;
  margin: 0 0.5rem;
}

.alcance-input {
  width: 100%;
  max-width: 150px;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .expediente-input-group {
    flex-direction: column;
    align-items: stretch;
  }

  .expediente-input {
    max-width: 100%;
  }

  .expediente-separator {
    text-align: center;
    margin: 0.5rem 0;
  }

  .alcance-input {
    max-width: 100%;
  }
}
</style>
