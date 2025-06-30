<template>
<div class="page main-background">
  <Banner title="Pagos dobles" />
  <!-- Comprobante (página 4) -->
  <div v-if="printing">
    <b-card no-body border-variant="success" style="margin-top: 80px" class="printing-modal shadow col-md-5 col-sm-8 mx-auto">
      <b-card-header class="row" header-class="green text-light">
        <h5><b>Comprobante de Solicitud - </b> Comercio</h5>
      </b-card-header>
      <b-card-body class="text-center">
        <div class="row"><b-icon-check scale="1.2" class="icon-orange mt-1"/><h5><b class="text-green ml-1">Día: </b> {{ new Date().toLocaleDateString('es-AR') }}</h5> </div>
        <div class="row"><b-icon-check scale="1.2" class="icon-orange mt-1"/><h5><b class="text-green ml-1">Rubro: </b> {{ inmueble.rubro }}</h5> </div>
        <div class="row"><b-icon-check scale="1.2" class="icon-orange mt-1"/><h5><b class="text-green ml-1">Nro de trámite:</b> {{ nroTramite }}</h5> </div>
        <div class="row"><b-icon-check scale="1.2" class="icon-orange mt-1"/><h5><b class="text-green ml-1">Solicitante: </b> {{ solicitante.nombre }}  {{ solicitante.apellido }}</h5> </div>
        <hr/>
        <p class="" style="text-align: justify"><b-icon-caret-right-fill variant="success"></b-icon-caret-right-fill> Tené en cuenta que el Departamento Comercio puede solicitarte documentación adicional vía correo electrónico.</p>
        <p class="" style="text-align: justify"><b-icon-caret-right-fill variant="success"></b-icon-caret-right-fill> Para consultar el estado de tu trámite ingresá en <a class="external-link" href="https://haciendavgesell.gob.ar/">haciendavgesell.gob.ar</a>, hacé click en el ícono correspondiente y escribí el número asignado en este comprobante.</p>
        <hr/>
        <b-button class="mt-2 btn-orange" v-if="endButton === true" @click="onResetParams">Volver</b-button>
      </b-card-body>
    </b-card>
  </div>
  <b-form @submit.prevent="onSubmitForm" class="my-3" style="margin-left:10px;margin-right:10px">
    <!-- <b-card no-body class="col-8 mt-1 section-card"  style="margin: 0px auto">
      <h5 style="margin-top:0px; margin-bottom: 0px; text-align:center;" ><b-icon-exclamation-circle-fill class="icon-orange"></b-icon-exclamation-circle-fill> El siguiente formulario tiene carácter de declaración jurada.</h5>
    </b-card> -->
  <b-card no-body class="col-8 mt-1 section-card"  style="margin: 0px auto">
    <!-- Sección: Datos del solicitante -->
    <fieldset >
      <legend><h3>Datos del Solicitante <b-icon-question-circle-fill @click="openPopup('DatosDelSolicitante')" font-scale="1" variant="info"></b-icon-question-circle-fill></h3></legend>
    </fieldset>
    <fieldset >
      <b-row>
      <b-col lg="6">
          <b-form-group label="Nombre *" label-for="nombreSolicitante">
            <b-form-input id="nombreSolicitante" v-model="solicitante.nombre"></b-form-input>
            <div v-if="$v.solicitante.nombre.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> El Nombre no puede estar vacío.
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group label="Apellido *" label-for="apellidoSolicitante" >
            <b-form-input id="apellidoSolicitante" v-model="solicitante.apellido"></b-form-input>
            <div v-if="$v.solicitante.apellido.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> El Apellido no puede estar vacío.
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <b-form-group label="DNI / Pasaporte *" label-for="DNISolicitante" >
            <b-form-input id="DNISolicitante" v-model="solicitante.dni"></b-form-input>
            <div v-if="$v.solicitante.dni.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Introduce un DNI válido.
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group label="CUIT *" label-for="cuit" >
            <b-form-input id="cuit" v-model="solicitante.cuit"></b-form-input>
            <div v-if="$v.solicitante.cuit.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Introduce un CUIT válido, sin guiones ni caracteres especiales.
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group label="Número de cuenta" label-for="nro-cuenta" >
        <b-form-input id="nro-cuenta" v-model="solicitante.nroCuenta" ></b-form-input>
        <div v-if="$v.solicitante.nroCuenta.$error" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> El Número de cuenta no puede estar vacío.
        </div>
      </b-form-group>
      <b-form-group label="Domicilio Real y/o Legal *" label-for="domicilio-real" >
        <b-form-input id="domicilio-real" v-model="solicitante.domicilioReal" ></b-form-input>
        <div v-if="$v.solicitante.domicilioReal.$error" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> El Domicilio Real y/o Legal no puede estar vacío.
        </div>
      </b-form-group>
      <b-row>
        <b-col lg="6">
          <b-form-group label="Teléfono *" label-for="telefonoTitular" >
            <b-form-input id="telefonoTitular" v-model="solicitante.telefono" no-wheel ></b-form-input>
            <div v-if="$v.solicitante.telefono.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> El teléfono no puede estar vacío, contener letras o caracteres especiales.
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group label="Código Postal *" label-for="codigoPostal" >
            <b-col lg="4" style="padding-left: 0px;">
              <b-form-input id="codigoPostal" v-model="solicitante.codigoPostal" ></b-form-input>
            </b-col>
            <b-col lg="12" style="padding-left: 0px;">
              <div v-if="$v.solicitante.codigoPostal.$error" class="validation-error">
                <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> El código postal no puede estar vacío, contener letras o caracteres especiales.
              </div>
            </b-col>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <b-form-group label="Localidad *" label-for="localidadSolicitante" >
            <b-form-input id="localidadSolicitante" v-model="solicitante.localidad" ></b-form-input>
            <div v-if="$v.solicitante.localidad.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> La localidad no puede estar vacía.
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group label="Provincia *" label-for="provincia">
            <b-form-select id="provincia" v-model="solicitante.provincia" >
              <option value="" disabled>Selecciona una provincia</option>
              <option v-for="(provincia, index) in provincias" :key="index" :value="provincia">
                {{ provincia }}
              </option>
            </b-form-select>
            <div v-if="$v.solicitante.provincia.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Debe seleccionar una provincia.
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group label="Correo Electrónico *" label-for="mail" >
        <b-form-input id="mail" v-model="solicitante.mail" ></b-form-input>
        <div v-if="$v.solicitante.mail.$error" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Debe introducir un email válido. Ejemplo: nombre@dominio.com
        </div>
      </b-form-group>
      <b-form-group label="Repita el Correo Electrónico *" label-for="mail" >
        <b-form-input id="mail" v-model="solicitante.mail2" ></b-form-input>
        <div v-if="$v.solicitante.mail2.$error" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Los correos deben coincidir.
        </div>
      </b-form-group>
      <!-- <b-form-group label="Seleccioná el caso que corresponda *" label-for="esPropietario">
        <b-form-checkbox v-model="solicitante.esTitular" name="esTitular" >
          <span>Soy o represento al titular del inmueble</span></b-form-checkbox>
        <b-form-checkbox v-model="solicitante.esPropietario" name="esPropietario" >
          <span>Soy o represento al propietario del inmueble</span></b-form-checkbox>
        <div v-if="$v.solicitante.esTitular.$error || $v.solicitante.esPropietario.$error" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Debe seleccionar por lo menos una opción.
        </div>
      </b-form-group> -->
    </fieldset>

    <b-row>
      <b-col lg="6" md="8" sm="8">
        <h5>¿Sos titular del inmueble?</h5>
      </b-col>
      <b-col class="form-check-inline" sm="4">
        <b-col lg="3" sm="3">
          <b-form-radio  id="esTitular-no" v-model="solicitante.esTitular" name="radio-esTitular" checked="checked" value="false"> No</b-form-radio>
        </b-col>
        <b-col lg="3" sm="1">
          <b-form-radio  id="esTitular-si" v-model="solicitante.esTitular" name="radio-esTitular" value="true"> Sí</b-form-radio>
        </b-col>
      </b-col>
    </b-row>
  </b-card>
  <b-card no-body class="col-8 mt-1 section-card" style="margin: 0px auto">
    <fieldset >
      <legend><h3>Carga de Documentación</h3></legend>
      <p>Aquí deberás cargar los documentos requeridos previamente. Tené en cuenta que deben ser <u>legibles</u>, estar subidos en <u>formato de imagen ó pdf</u> y tener un <u>peso máximo de 15 mb</u>.</p>
      <b-row>
        <b-col lg="6">
          <b-form-group label="DNI (Frente) *" label-for="dniFrente">
            <b-form-file v-model="documentos.dniFrente.contenido" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*"
              :state="getFormFieldState('dniFrente')"
              @change="handleDocumentUpdate('dniFrente'); checkDocumentSize('dniFrente', $event)"
              @input="clearFormFieldState('dniFrente')"></b-form-file>
            <div v-if="$v.documentos.dniFrente.contenido.$error || fileTooLargeError.dniFrente" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> {{ fileTooLargeError.dniFrente || 'Debe seleccionar un archivo.' }}
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group label="DNI (Dorso) *" label-for="dniDorso" >
            <b-form-file v-model="documentos.dniDorso.contenido" placeholder="No se seleccionó un archivo." browse-text="Examinar"
            accept=".pdf, image/*"  :state="getFormFieldState('dniDorso')"
            @change="handleDocumentUpdate('dniDorso'); checkDocumentSize('dniDorso', $event)"
            @input="clearFormFieldState('dniDorso')"></b-form-file>
            <div v-if="$v.documentos.dniDorso.contenido.$error || fileTooLargeError.dniDorso" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> {{ fileTooLargeError.dniDorso || 'Debe seleccionar un archivo.' }}
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group>
        <label for="comprobantePago" class="rubro-label">Comprobante de pago
          <!-- <b-icon-question-circle-fill @click="openPopup('ComprobantePago')" font-scale="1" variant="info"></b-icon-question-circle-fill> -->
        </label>
        <b-form-file v-model="documentos.comprobantePago.contenido" placeholder="No se seleccionó un archivo." browse-text="Examinar"
        accept=".pdf, image/*"  :state="getFormFieldState('comprobantePago')"
        @change="handleDocumentUpdate('comprobantePago'); checkDocumentSize('comprobantePago', $event)"
        @input="clearFormFieldState('comprobantePago')"></b-form-file>
        <div v-if="$v.documentos.comprobantePago.contenido.$error || fileTooLargeError.comprobantePago" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> {{ fileTooLargeError.comprobantePago || 'Debe seleccionar un archivo.' }}
        </div>
      </b-form-group>
      <b-form-group>
        <label for="comprobantePago2" class="rubro-label">Comprobante de pago duplicado</label>
        <b-form-file v-model="documentos.comprobantePago2.contenido" placeholder="No se seleccionó un archivo." browse-text="Examinar"
        accept=".pdf, image/*"  :state="getFormFieldState('comprobantePago2')"
        @change="handleDocumentUpdate('comprobantePago2'); checkDocumentSize('comprobantePago2', $event)"
        @input="clearFormFieldState('comprobantePago2')"></b-form-file>
        <div v-if="$v.documentos.comprobantePago2.contenido.$error || fileTooLargeError.comprobantePago2" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> {{ fileTooLargeError.comprobantePago2 || 'Debe seleccionar un archivo.' }}
        </div>
      </b-form-group>

      <!-- Documentos que solo se muestran si NO es titular -->
      <div v-if="solicitante.esTitular !== 'true'">
        <b-form-group>
          <label for="planillaAutorizacion">Planilla de autorización de trámite *</label>
          <b-form-file v-model="documentos.planillaAutorizacion.contenido" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" :state="getFormFieldState('planillaAutorizacion')" @change="checkDocumentSize('planillaAutorizacion', $event)" @input="clearFormFieldState('planillaAutorizacion')"></b-form-file>
          <div v-if="$v.documentos.planillaAutorizacion.contenido.$error || fileTooLargeError.planillaAutorizacion" class="validation-error">
            <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> {{ fileTooLargeError.planillaAutorizacion || 'Debe seleccionar un archivo.' }}
          </div>
        </b-form-group>
        <b-form-group >
          <label for="acreditacionTitularidad"><span> Acreditación de titularidad de la cuenta: Escritura traslativa de Dominio del inmueble / </span>Contrato de locación / Boleto de Compraventa. *</label>
          <b-form-file v-model="documentos.acreditacionTitularidad.contenido" placeholder="No se seleccionó un archivo." browse-text="Examinar"
          accept=".pdf, image/*"  :state="getFormFieldState('acreditacionTitularidad')"
          @change="handleDocumentUpdate('acreditacionTitularidad'); checkDocumentSize('acreditacionTitularidad', $event)"
          @input="clearFormFieldState('acreditacionTitularidad')"></b-form-file>
          <div v-if="$v.documentos.acreditacionTitularidad.contenido.$error || fileTooLargeError.acreditacionTitularidad" class="validation-error">
            <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> {{ fileTooLargeError.acreditacionTitularidad || 'Debe seleccionar un archivo.' }}
          </div>
        </b-form-group>
      </div>
    </fieldset>

    <b-card border-variant="warning" align="center" class="importante-card" >
      <b-card-text>
        <b-row >
          <b-col md="2">
            <b-icon-exclamation-triangle variant="warning" font-scale="5"></b-icon-exclamation-triangle>
            <p class="li-title"><u><b>¡Importante!</b></u></p>
          </b-col>
          <b-col  md="10">
              <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content"><span>Una vez completado el formulario, el Dpto. Recaudaciones se comunicará a través del correo electrónico oficial (<a href="mailto:deptocomercio@gesell.gob.ar" class="external-link" target="_blank" >recaudaciones@gesell.gob.ar</a>).</span></div></div>
              <!-- <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content"><span><b>El trámite de baja comercial será efectivo una vez abonado el importe del mismo y obtenido el certificado respectivo.</b></span></div></div> -->
          </b-col>
        </b-row>
      </b-card-text>
    </b-card>
    <div class="centeredContainer" style="min-width: 304px;">
      <b-form-group>
        <div id="captchaContainer" class="g-recaptcha" :data-sitekey="recaptchaSiteKey"></div>
        <div v-if="captchaError" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Por favor completa la verificación para continuar.
        </div>
      </b-form-group>
    </div>
    <div class="centeredContainer">
      <fieldset>
        <b-button size="lg" @click="onResetParams" variant="danger" class="btn-cancel" >Cancelar</b-button>
        <b-button size="lg" type="submit" variant="success" :disabled="!areAllFieldsComplete" class="" >Enviar</b-button>
      </fieldset>
        <div v-if="!areAllFieldsComplete" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Completar todos los campos marcados con (*).
        </div>
        <div v-if="!areAllFieldsValid" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Por favor, revisa el formulario en busca de errores.
        </div>
    </div>
  </b-card>
  </b-form>
<!-- PopUps -->
<b-modal v-model="showPopupDatosDelSolicitante" title="" :hide-footer="true" @click-outside="showPopupDatosDelSolicitante = false" :header-bg-variant="'success'"  centered>
  <template #modal-header>
    <div class="modal-info">
      <h5>
          <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
          Información Adicional
      </h5>
    </div>
    <button type="button" aria-label="Close" class="close" @click="showPopupDatosDelSolicitante = false">×</button>
  </template>
  <div class="modal-info">
    <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>El interesado futuro comerciante / industrial o afín mayor de 18 años.</p>
    <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>El representante o apoderado/a de la persona interesada con documentación que acredite el carácter de tal.</p>
  </div>
</b-modal>
<b-modal v-model="showPopupNroInmueble" title="" :hide-footer="true" @click-outside="showPopupNroInmueble = false" :header-bg-variant="'success'"  centered>
  <template #modal-header>
    <div class="modal-info">
      <h5>
          <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
          Información Adicional
      </h5>
    </div>
    <button type="button" aria-label="Close" class="close" @click="showPopupNroInmueble = false">×</button>
  </template>
  <div class="modal-info">
    <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>Podés consultar el número enviando un correo electrónico a <a href="mailto:catatro@gesell.gob.ar" target="_blank">catastro@gesell.gob.ar</a>, indicando nomenclatura catastral del bien que se encuentra en la escritura del mismo.</p>
  </div>
</b-modal>
<b-modal v-model="showPopupFormLoading" no-close-on-backdrop title="" :header-bg-variant="'success'" hide-footer centered>
  <template #modal-header>
    <h5 class="centeredContainer">Solicitud en Proceso</h5>
  </template>
  <div class="centeredContainer">
    <p class="popup-link">Tus archivos se están cargando.</p>
    <b-spinner variant="success" style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
    <p>No cierres esta página</p>
  </div>
</b-modal>
<b-modal v-model="showPopupFormOk" title="" ok-only @click-outside="showPopupFormOk = false" :header-bg-variant="'success'" centered>
  <template #modal-header>
    <div class="centeredContainer"><h3>
      <b-icon icon="check-circle-fill" scale="1.5" variant="light"></b-icon>
    </h3></div>
  </template>
  <div class="centeredContainer">
    <p class="modal-subtitle">¡Tu solicitud ha sido enviada exitosamente!</p>
    <p class="">En los próximos días recibirás un correo electrónico del Departamento Comercio Municipal en el que te indicarán cómo continuar. Asegurate de revisar la bandeja de correos no deseados (Spam).</p>
    <p class=""><b>Tu número de trámite es: </b></p>
    <p class="h3"><b> R{{ nroTramite }} </b></p>
    <p class="">Por favor, conservá este número. Será solicitado más adelante.</p>
  </div>
    <div class="centeredContainer" style="padding:0 1rem; padding-top: 1rem; border-top:1px solid #CCC; ">
      <p class="" style="text-align: justify; margin-bottom:0; font-size: 0.75rem "><b-icon-caret-right-fill variant="success"></b-icon-caret-right-fill> Tené en cuenta que el Departamento Comercio puede solicitarte documentación adicional vía correo electrónico.</p>
      <p class="" style="text-align: justify; font-size: 0.75rem; margin-bottom:0; "><b-icon-caret-right-fill variant="success"></b-icon-caret-right-fill> Para consultar el estado de tu trámite ingresá en <a class="external-link" href="https://haciendavgesell.gob.ar/">haciendavgesell.gob.ar</a>, hacé click en el ícono correspondiente y escribí el número asignado en este comprobante.</p>
    </div>
  <template #modal-footer>
    <div class="" style="margin: auto">
      <b-button @click="onResetParams" class="btn-cancel">Volver</b-button>
      <b-button @click="onPrintTicket">Imprimir</b-button>
    </div>
  </template>
</b-modal>
<b-modal v-model="showPopupFormError" title="Error en el envío!" @click-outside="showPopupFormError = false" :header-bg-variant="'danger'" centered>
  <template #modal-header>
    <div class="centeredContainer"><h3>
        <b-icon-exclamation-octagon scale="1.5" variant="light"></b-icon-exclamation-octagon>
    </h3></div>
    <button type="button" aria-label="Close" class="close" @click="showPopupFormError = false">×</button>
  </template>
  <div class="centeredContainer modal-error">
    <p class="modal-subtitle">No hemos podido procesar tu solicitud</p>
    <p class="">Por favor, verificá tu conexión a internet e intentalo nuevamente más tarde.</p>
    <p class="minitext">Si el problema persiste, comunicate con <a target="_blank" href="mailto:deptocmercio@gesell.gob.ar" class="external-link">deptocomercio@gesell.gob.ar</a> para que podamos ayudarte.</p>
  </div>
  <template #modal-footer>
    <div class="" style="margin: auto">
      <b-button @click="showPopupFormError = false" variant="danger" class="btn-cancel" >Aceptar</b-button>
    </div>
  </template>
</b-modal>
</div>
</template>

<script>
import { required, requiredIf, alpha, numeric, email, minLength, maxLength, sameAs } from 'vuelidate/lib/validators';

export default{
    validations() {
    return {
      solicitante: {
        nombre: { required },
        apellido: { required },
        dni: { required, numeric, maxLength: maxLength(9), minLength: minLength(7) },
        cuit: { required, numeric, maxLength: maxLength(12), minLength: minLength(10) },
        nroCuenta: { required },
        domicilioReal: { required },
        telefono: { required, numeric },
        codigoPostal: { required, numeric, maxLength: maxLength(4), minLength: minLength(4) },
        localidad: { required },
        provincia: { required },
        mail: { required, email },
        mail2: { required, email, sameAs: sameAs( function(){return this.solicitante.mail } ) },
        // esPropietario: { requiredIfAtLeastOneChecked: (value) => {
        //     return value || this.solicitante.esTitular;
        //   } },
        // esTitular: { requiredIfAtLeastOneChecked: (value) => {
        //     return value || this.solicitante.esPropietario;
        //   } },
      },
      documentos: {
        //Validaciones compartidas
        dniFrente: { contenido:{ required} },
        dniDorso: { contenido:{ required} },
        planillaAutorizacion: { contenido:{requiredIf: requiredIf(function () {
          return this.solicitante.esTitular !== 'true' })}},
        //Validaciones exclusivas de Habilitación
        comprobantePago: { contenido:{required} },
        comprobantePago2: { contenido:{required } },
        //Validaciones con varias condiciones
        acreditacionTitularidad: { contenido:{ requiredIf: requiredIf(function () {
          return this.solicitante.esTitular !== 'true' })}},
      }
    }
    // Otras validaciones aquí...
  },
  data(){
    return{
      pago1: null,
      pago2: null,
      recaptchaSiteKey: "6LfNxggoAAAAANyfZ5a2Lg_Rx28HX_lINDYX7AU-",
      captchaResponse: null,
      captchaError: false,
      captchaResponse: null,
      captchaError: false,
      maxFileSize: 15 * 1024 * 1024, // 15MB in bytes,
      fileTooLargeError: {},
      TEST_submit: true,
      provincias: [
        'CABA','Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy',
        'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz',
        'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán'
      ],
      nroTramite: null,
      nroLegajo: 0,
      solicitante: {
        nombre: '',
        apellido: '',
        dni: '',
        cuit: '',
        nroCuenta: '',
        domicilioReal: '',
        telefono: '',
        codigoPostal: '',
        localidad: '',
        provincia: '',
        mail: '',
        esTitular: false,
        esPropietario: false,
      },
      documentos: {
        planillaAutorizacion: {
          nombreDocumento: 'Planilla de autorización de trámite',
          contenido: null
        },
        dniFrente:{
          nombreDocumento: 'DNI (Frente)',
          contenido: null
        },
        dniDorso:{
          nombreDocumento: 'DNI (Dorso)',
          contenido: null
        },
        comprobantePago:{
          nombreDocumento: 'Comprobante de pago',
          contenido: null
        },
        comprobantePago2:{
          nombreDocumento: 'Comprobante de pago duplicado',
          contenido: null
        },
        acreditacionTitularidad:{
          nombreDocumento: 'Acreditación de titularidad: Escritura traslativa de Dominio del inmueble / Contrato de locación / Boleto de Compraventa',
          contenido: null
        }
      },
      formFieldStates: {
        planillaAutorizacion: null,
        dniFrente: null,
        dniDorso: null,
        comprobantePago: null,
        comprobantePago2: null,
        acreditacionTitularidad: null,
      },
      showPopupDatosDelSolicitante: false,
      showPopupNroInmueble: false,
      showPopupFormOk: false,
      showPopupFormLoading: false,
      showPopupFormError: false,
      printing: false,
      endButton: false,
    }
  },
  mounted() {
    //CAMBIAR EL SITEKEY POR UNO DE VERDAD
    grecaptcha.ready(() => {
    grecaptcha.render('captchaContainer', {
      sitekey: this.recaptchaSiteKey,
      });
    });
  },
  methods: {
    blobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
      });
    },
    isCaptchaOK(){
        console.log("isCAPTCHAOK?? = " + (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length > 0));
        this.captchaError = !(typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length > 0);
        if(this.TEST_submit) return true;
        return !this.captchaError;
    },
    openPopup(type) {
      // Lógica para abrir el popup correspondiente según el tipo (A, B, C, D)
      if (type === 'A') {
        console.log("ShowPopup A")
        this.showPopupA = true;
      } else if (type === 'B') {
        this.showPopupB = true;
      } else if (type === 'C') {
        this.showPopupC = true;
      } else if (type === 'D') {
        this.showPopupD = true;
      } else if (type === 'E') {
        this.showPopupE = true;
      } else if (type === 'FormLoading') {
        this.showPopupFormLoading = true;
      } else if (type === 'FormError') {
        this.showPopupFormError = true;
      } else if (type === 'NroInmueble'){
        this.showPopupNroInmueble = true;
      }
    },
    getFormFieldState(fieldName) {
      return this.formFieldStates[fieldName];
    },
    clearFormFieldState(fieldName) {
      this.formFieldStates[fieldName] = null;
    },
    areAllFieldsComplete() {
      if (this.TEST_submit){
          return true;
      }
      else{
        const baseFields = this.solicitante.nombre && this.solicitante.apellido && this.solicitante.dni && this.solicitante.cuit && this.solicitante.domicilioReal &&
              this.solicitante.telefono && this.solicitante.codigoPostal && this.solicitante.localidad && this.solicitante.provincia && this.solicitante.mail &&
              this.documentos.dniFrente && this.documentos.dniDorso &&
              (this.documentos.comprobantePago) &&
              (this.documentos.comprobantePago2);

        // Solo requerir documentos adicionales si NO es titular del inmueble
        const noEsTitular = this.solicitante.esTitular !== 'true';
        const documentosAdicionales = noEsTitular ?
          (this.documentos.planillaAutorizacion && this.documentos.acreditacionTitularidad) : true;

        return baseFields && documentosAdicionales;
      }
    },
    areAllFieldsValid(){
      console.log("areAllFieldsValid() CALLED");
      if(this.areAllFieldsComplete){
        console.log("areAllFieldsValid(): this.$v.$invalid: " + this.$v.$invalid + " Object.values(this.fileTooLargeError).some(error => !!error): " + Object.values(this.fileTooLargeError).some(error => !!error));
        return !this.$v.$invalid && !Object.values(this.fileTooLargeError).some(error => !!error)
      }
      return true;
    },
    LoguearValidaciones(){
      console.log("Validaciones compartidas ");
      console.log("this.$v.solicitante.nombre.$error: " + this.$v.solicitante.nombre.$error);
      console.log("this.$v.solicitante.apellido.$error: " + this.$v.solicitante.apellido.$error);
      console.log("this.$v.solicitante.dni.$error: " + this.$v.solicitante.dni.$error);
      console.log("this.$v.solicitante.cuit.$error: " + this.$v.solicitante.cuit.$error);
      console.log("this.$v.solicitante.domicilioReal.$error: " + this.$v.solicitante.domicilioReal.$error);
      console.log("this.$v.solicitante.telefono.$error: " + this.$v.solicitante.telefono.$error);
      console.log("this.$v.solicitante.codigoPostal.$error: " + this.$v.solicitante.codigoPostal.$error);
      console.log("this.$v.solicitante.localidad.$error: " + this.$v.solicitante.localidad.$error);
      console.log("this.$v.solicitante.provincia.$error: " + this.$v.solicitante.provincia.$error);
      console.log("this.$v.solicitante.mail.$error: " + this.$v.solicitante.mail.$error);
      console.log("this.$v.solicitante.mail2.$error: " + this.$v.solicitante.mail2.$error);

      console.log("Documentos compartidos ");
      console.log("this.$v.documentos.dniFrente.contenido.$error: " + this.$v.documentos.dniFrente.contenido.$error);
      console.log("this.$v.documentos.dniDorso.contenido.$error: " + this.$v.documentos.dniDorso.contenido.$error);
      console.log("this.solicitante.esApoderado: " + this.solicitante.esApoderado);
      console.log("this.$v.documentos.planillaAutorizacion.contenido.$error: " + this.$v.documentos.planillaAutorizacion.contenido.$error);
      console.log("this.$v.documentos.acreditacionTitularidad.contenido.$error: " + this.$v.documentos.acreditacionTitularidad.contenido.$error);
      console.log("this.$v.documentos.comprobantePago.contenido.$error: " + this.$v.documentos.comprobantePago.contenido.$error);
      console.log("this.solicitante.esTitular: " + this.solicitante.esTitular);
      console.log("this.solicitante.esPropietario: " + this.solicitante.esPropietario);
      // console.log("this.$v.nroLegajo.$error: " + this.$v.nroLegajo.$error);
      console.log("this.solicitante.esTitular: " + this.solicitante.esTitular);
    },
    async onSubmitForm() {
      this.$v.$touch(); // Marca los campos como tocados para mostrar los errores
      this.LoguearValidaciones()
      if (!this.$v.$invalid && !Object.values(this.fileTooLargeError).some(error => !!error) && this.isCaptchaOK()) {
        // Si no hay errores, envía el formulario
        try {
          this.openPopup('FormLoading');
          const documentosParaGuardar = {};
          // Recorrer los campos en this.documentos
          for (const campo in this.documentos) {
            const nombreDoc = this.documentos[campo].nombreDocumento;
            const contenidoDoc = this.documentos[campo].contenido;

            if (contenidoDoc instanceof Blob) {
              // Verificar que el campo sea un Blob válido (archivo PDF seleccionado)
              const fileBlob = new Blob([contenidoDoc], { type: contenidoDoc.type });

                // Agregar el archivo PDF a documentosParaGuardar
                documentosParaGuardar[campo] = {
                  nombreDocumento: nombreDoc,
                  contenido: {
                    data: await this.blobToBase64(fileBlob),
                    contentType: contenidoDoc.type,
                  }
                };
              }
            }
          const pagoDoble = {
            documentos: documentosParaGuardar,
            solicitante: this.solicitante
          };
          // habilitacion.nroTramite = nroTramite
          const response = await this.$store.dispatch('pagosDobles/create', {
            pagoDoble,
          });
          //console.log(response.data)
          this.nroTramite = response.data
          this.openPopup('FormOk');
        } catch (e) {
          console.log(e)
          this.openPopup('FormError');
        }
      }
    },
    handleDocumentUpdate(fieldName) {
      const contenidoDoc = this.documentos[fieldName];


      if (contenidoDoc instanceof Blob) {
        // Verificar que el campo sea un Blob válido (archivo PDF o imagen seleccionado)
        const fileBlob = new Blob([contenidoDoc], { type: contenidoDoc.type });

        // Agregar el archivo PDF o imagen a documentosParaGuardar
        this.documentos[fieldName] = {
          name: contenidoDoc.name,
          contentType: contenidoDoc.type,
          file: fileBlob,
        };
      }
    },
    checkDocumentSize(field, event){
      //console.log('checkDocumentSize CALLED');
      const file = event.target.files[0];

      //console.log('event.target.files[0]: ' + event.target.files[0]);

      //console.log('file.size: ' + file.size + '> this.maxFileSize: ' + this.maxFileSize);
       if (file && file.size > this.maxFileSize) {
        // El archivo excede el tamaño máximo permitido
        this.fileTooLargeError[field] = 'Tu archivo pesa '+ (file.size/1024/1024).toFixed(2) + 'MB'+ ', superando el límite de peso permitido (' + this.maxFileSize/1024/1024 + 'MB'+ '). Reducilo y volvé a cargarlo.' ;
        return;
      }else
      this.fileTooLargeError[field] = null
    },
    async onResetParams(){
      await this.$router.push('/recaudaciones/pagos_dobles')
    }
  },
}
</script>

<style scoped>
@media (max-width: 1200px) {
  .col-8{
    max-width: 80%;
  }
}
@media (max-width: 720px) {
  h5{
    font-size: 1.15rem;
  }
  .form-check-inline{
    margin-right: 0;
  }
}
@media (max-width: 480px) {
  .col-8{
    max-width: 90%;
  }
}
#captchaContainer{
  margin-bottom: 1rem;
}
.printing-modal .card-header h5{
  color: white !important;
}
.printing-modal h5{
  margin: 0 0 0.5rem;
}
.green{
    background-color:#0b6919;
  }
.btn-orange{
  background-color:#eb8a0a !important;
  border: none;
}
.text-green{
  color:#0c6919;
}
.centeredContainer{
  width:  auto;
  margin: auto;
  text-align: center;
}
.centeredContainer button{
  width: 40%;
  font-size: 1rem;
  padding-right: 0;
  padding-left: 0;
}
.centeredContainer fieldset{
  margin: 0 auto;
  width: 20rem;
}
p, .li-content{
  font-family: Calibri, 'Trebuchet MS', sans-serif;
}
.validation-error {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}
.icon-orange{
  color: #E27910;
}
.icon-green{
  color: #0c681a;
}
ul{
  list-style-type: none; /* Elimina los puntos por defecto */
  padding: 0;
}
.btn{
  background-color: #0c681a;
  border-color: #0c681a;
}
.btn:hover{
  background-color: green;
  border-color: green;
}
.btn.disabled{
  background-color: #619D6A;
  border-color: #619D6A;
}
.btn.disabled:hover{
  background-color: #619D6A;
  border-color: #619D6A;
}
.btn-cancel:hover{
  background-color: #f09658;
  border-color: #f09658;
}
.btn-cancel{
  background-color: #e53749;
  border-color: #e53749;
}
.centeredContainer{
  width:  auto;
  margin: auto;
  text-align: center;
}
.centeredContainer button{
  width: 40%;
  font-size: 1rem;
  padding-right: 0;
  padding-left: 0;
}
.modal-dialog{
  max-width: 600px;
}
.modal-body{
  padding: 1.5rem 1rem;
}
.modal h5, .modal h3{
  color: white !important;
  font-weight: bold;
  font-size: 1.5rem;
}
.modal .modal-subtitle{
  color: #0c681a !important;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 15px;
  padding-top: 0;
}
.modal-content .bg-danger{
  background-color: #e53749 !important;
}
.modal-content .bg-success{
  background-color: #0c681a !important;
}
.modal-error .modal-subtitle{
  color: #e53749 !important;
}
.modal-error p{
  color: black;
  font-weight: 500;
  padding: 0 1rem;
}
.modal-error .minitext{
  font-size: 0.75rem;
  font-weight: 100;
}
.popupApoderado{
  padding-left: 6%;
}
.modal-info h3{
  color: #0c681a !important;
  font-size: 1.6rem;
  padding-bottom: 0.5rem;
  margin-top: 0;
}
.modal-info h5{
  font-size: 1.5rem;
  padding: 0.75rem 0;
  margin: 0;
}
.modal-info h6{
  font-size: 1.25rem;
  font-weight: bold;
  color: #0c681a;
  margin: 1rem 0;
}
.modal-info .destacado{
  border-bottom: 2px solid #ccc;
  border-top: 2px solid #ccc;
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: #666;
}
.modal-info .bi-question-circle{
  margin-right: 1rem;
  padding-right: 0.5rem;
  border-right: 1px solid #FFF;
}
.modal-info p, .modal-info .bi-caret-right-fill{
  display: inline-block;
}
.modal-info .bi-caret-right-fill{
  margin-right: 1rem;
  color: #f09658;
  vertical-align: top;
  margin-top: 0.35rem;
  font-size: 1.05rem;
}
.modal-info ul b, .modal-info a, .popupApoderado b{
  color: #0c681a;
}
.modal-info p{
  color: #666;
}
.modal-plano .parrafo{
  border-top: #ccc 1px solid;
  padding-top: 1rem;
  margin-top: 1rem;
}
.modal-plano .parrafo p{
  margin-bottom: 0.5rem;
}
.modal-plano h6{
  margin-top: 0;
}
.modal-plano p{
  margin-bottom: 0;
}
.popupApoderado b{
  font-weight: 600;
}
.btn{
  padding: 0.5rem 3rem;
  font-weight: 500;
}
form .card{
  margin-top: 20px !important;
  padding: 20px;
  border-radius: 1rem;
}
.section-card{
  box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.75);
  -webkit-box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.75);
  -moz-box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.75);
}
form p{
  font-weight: 600;
  color: #666;
}
h3{
  font-weight: bold;
  color: #0c681a !important;
  margin: 1rem 0;
}
h5{
  margin: 1rem 0;
  color: #0c681a ;
}
.modal-title{
  font-weight: bold;
}
/* Selector para ocultar las flechas en los inputs numéricos */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Opcional: Estilos adicionales para los inputs numéricos */
input[type="number"] {
  -moz-appearance: textfield; /* Firefox */
  appearance: textfield; /* Otros navegadores */
  width: 100%; /* Ajusta el ancho según tus necesidades */
  padding: 0.375rem 0.75rem; /* Ajusta el padding según tus necesidades */
}
.popup-link, .external-link {
  color: #0c681a;
}
.rubro-label{
  width: 98%;
}
.rubro-label a{
  margin-left: 10px;
}
.form-check-inline div{
  margin-right: 10px;
}
.bi-question-circle-fill{
  cursor: pointer;
}
.titularOpropietario{
  margin-bottom: 1rem;
}
.titularOpropietario p{
  display: inline-flex;
}
.titularOpropietario .custom-switch{
  margin: 0 0.5rem;
}
.importante-card{
  padding: 0;
  margin-bottom: 1.5rem;
  margin-top: 0 !important;
}
.importante-card .li-content{
  text-align: left;
  margin-bottom: 1rem;
}
.importante-card .li-content span{
  font-weight: 500;
}
.importante-card .card-body{
  padding-bottom: 0.25rem;
}
.importante-card .col-md-2 .li-title{
  margin-bottom: 1rem;
}
.li-icon, .li-title{
  font-weight: 600;
  color: #0c681a;
}
.li-icon, .li-content{
  display: inline-block;
}
.li-title{
  margin-bottom: 0.3rem;
}
.li-icon{
  margin-right: 1%;
  vertical-align: top;
}
.li-row{
  display: flex;
  width: 100%;
}
.li-content .li-row{
  margin-top: 0;
}
.li-icon, .li-content{
  display: inline-block;
}
.li-p{
  margin-bottom: 1rem;
}

@media only screen and (min-width: 640px) {
  .layout {
    display: flex;
  }
}
</style>
