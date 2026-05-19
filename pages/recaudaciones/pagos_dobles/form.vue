<template>
<div class="page main-background">
  <Banner title="Pagos dobles" />
  <!-- Comprobante (pÃ¡gina 4) -->
  <div v-if="printing">
    <b-card no-body border-variant="success" style="margin-top: 80px" class="printing-modal shadow col-md-5 col-sm-8 mx-auto">
      <b-card-header class="row" header-class="green text-light">
        <h5><b>Comprobante de Solicitud - </b> Recaudaciones</h5>
      </b-card-header>
      <b-card-body class="text-center">
        <div class="row"><i class="bi bi-check"></i><h5><b class="text-green ml-1">DÃ­a: </b> {{ new Date().toLocaleDateString('es-AR') }}</h5> </div>

        <div class="row"><i class="bi bi-check"></i><h5><b class="text-green ml-1">Nro de trÃ¡mite:</b> R{{ nroTramite }}</h5> </div>
        <div class="row"><i class="bi bi-check"></i><h5><b class="text-green ml-1">Solicitante: </b> {{ solicitante.nombre }}  {{ solicitante.apellido }}</h5> </div>
        <hr/>
        <p class="" style="text-align: justify"><i class="bi bi-caret-right-fill text-success"></i> TenÃ© en cuenta que el Departamento Recaudaciones puede solicitarte documentaciÃ³n adicional vÃ­a correo electrÃ³nico.</p>

        <hr/>
        <b-button class="mt-2 btn-orange" v-if="endButton === true" @click="onResetParams">Volver</b-button>
      </b-card-body>
    </b-card>
  </div>

  <b-form @submit.prevent="onSubmitForm" class="my-3" style="margin-left:10px;margin-right:10px" v-else>
    <!-- <b-card no-body class="col-8 mt-1 section-card"  style="margin: 0px auto">
      <h5 style="margin-top:0px; margin-bottom: 0px; text-align:center;" ><i class="bi bi-exclamation-circle-fill"></i> El siguiente formulario tiene carÃ¡cter de declaraciÃ³n jurada.</h5>
    </b-card> -->
  <b-card no-body class="col-8 mt-1 section-card"  style="margin: 0px auto">
    <!-- SecciÃ³n: Datos del solicitante -->
    <fieldset >
      <legend><h3>Datos del Solicitante <i class="bi bi-question-circle-fill text-info" style="font-size: 1em"></i></h3></legend>
    </fieldset>
    <fieldset >
      <b-row>
      <b-col lg="6">
          <b-form-group label="Nombre *" label-for="nombreSolicitante">
            <b-form-input id="nombreSolicitante" v-model="solicitante.nombre" @blur="$v.solicitante.nombre.$touch()"></b-form-input>
            <div v-if="$v.solicitante.nombre.$error" class="validation-error">
              <i class="bi bi-exclamation-octagon text-danger"></i> El Nombre no puede estar vacÃ­o.
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group label="Apellido *" label-for="apellidoSolicitante" >
            <b-form-input id="apellidoSolicitante" v-model="solicitante.apellido" @blur="$v.solicitante.apellido.$touch()"></b-form-input>
            <div v-if="$v.solicitante.apellido.$error" class="validation-error">
              <i class="bi bi-exclamation-octagon text-danger"></i> El Apellido no puede estar vacÃ­o.
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <b-form-group label="DNI / Pasaporte *" label-for="DNISolicitante" >
            <b-form-input id="DNISolicitante" v-model="solicitante.dni" @blur="$v.solicitante.dni.$touch()"></b-form-input>
            <div v-if="$v.solicitante.dni.$error" class="validation-error">
              <i class="bi bi-exclamation-octagon text-danger"></i> Introduce un DNI vÃ¡lido.
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group label="CUIT *" label-for="cuit" >
            <b-form-input id="cuit" v-model="solicitante.cuit" @blur="$v.solicitante.cuit.$touch()"></b-form-input>
            <div v-if="$v.solicitante.cuit.$error" class="validation-error">
              <i class="bi bi-exclamation-octagon text-danger"></i> Introduce un CUIT vÃ¡lido, sin guiones ni caracteres especiales.
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group label="NÃºmero de cuenta" label-for="nro-cuenta" >
        <b-form-input id="nro-cuenta" v-model="solicitante.nroCuenta" @blur="$v.solicitante.nroCuenta.$touch()"></b-form-input>
        <div v-if="$v.solicitante.nroCuenta.$error" class="validation-error">
          <i class="bi bi-exclamation-octagon text-danger"></i> El NÃºmero de cuenta no puede estar vacÃ­o.
        </div>
      </b-form-group>
      <b-form-group label="Domicilio Real y/o Legal *" label-for="domicilio-real" >
        <b-form-input id="domicilio-real" v-model="solicitante.domicilioReal" @blur="$v.solicitante.domicilioReal.$touch()"></b-form-input>
        <div v-if="$v.solicitante.domicilioReal.$error" class="validation-error">
          <i class="bi bi-exclamation-octagon text-danger"></i> El Domicilio Real y/o Legal no puede estar vacÃ­o.
        </div>
      </b-form-group>
      <b-row>
        <b-col lg="6">
          <b-form-group label="TelÃ©fono *" label-for="telefonoTitular" >
            <b-form-input id="telefonoTitular" v-model="solicitante.telefono" no-wheel @blur="$v.solicitante.telefono.$touch()"></b-form-input>
            <div v-if="$v.solicitante.telefono.$error" class="validation-error">
              <i class="bi bi-exclamation-octagon text-danger"></i> El telÃ©fono no puede estar vacÃ­o, contener letras o caracteres especiales.
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group label="CÃ³digo Postal *" label-for="codigoPostal" >
            <b-col lg="4" style="padding-left: 0px;">
              <b-form-input id="codigoPostal" v-model="solicitante.codigoPostal" @blur="$v.solicitante.codigoPostal.$touch()"></b-form-input>
            </b-col>
            <b-col lg="12" style="padding-left: 0px;">
              <div v-if="$v.solicitante.codigoPostal.$error" class="validation-error">
                <i class="bi bi-exclamation-octagon text-danger"></i> El cÃ³digo postal no puede estar vacÃ­o, contener letras o caracteres especiales.
              </div>
            </b-col>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <b-form-group label="Localidad *" label-for="localidadSolicitante" >
            <b-form-input id="localidadSolicitante" v-model="solicitante.localidad" @blur="$v.solicitante.localidad.$touch()"></b-form-input>
            <div v-if="$v.solicitante.localidad.$error" class="validation-error">
              <i class="bi bi-exclamation-octagon text-danger"></i> La localidad no puede estar vacÃ­a.
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group label="Provincia *" label-for="provincia">
            <b-form-select id="provincia" v-model="solicitante.provincia" @change="$v.solicitante.provincia.$touch()">
              <option value="" disabled>Selecciona una provincia</option>
              <option v-for="(provincia, index) in provincias" :key="index" :value="provincia">
                {{ provincia }}
              </option>
            </b-form-select>
            <div v-if="$v.solicitante.provincia.$error" class="validation-error">
              <i class="bi bi-exclamation-octagon text-danger"></i> Debe seleccionar una provincia.
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group label="Correo ElectrÃ³nico *" label-for="mail" >
        <b-form-input id="mail" v-model="solicitante.mail" @blur="$v.solicitante.mail.$touch()"></b-form-input>
        <div v-if="$v.solicitante.mail.$error" class="validation-error">
          <i class="bi bi-exclamation-octagon text-danger"></i> Debe introducir un email vÃ¡lido. Ejemplo: nombre@dominio.com
        </div>
      </b-form-group>
      <b-form-group label="Repita el Correo ElectrÃ³nico *" label-for="mail" >
        <b-form-input id="mail" v-model="solicitante.mail2" @blur="$v.solicitante.mail2.$touch()"></b-form-input>
        <div v-if="$v.solicitante.mail2.$error" class="validation-error">
          <i class="bi bi-exclamation-octagon text-danger"></i> Los correos deben coincidir.
        </div>
      </b-form-group>
      <!-- <b-form-group label="SeleccionÃ¡ el caso que corresponda *" label-for="esPropietario">
        <b-form-checkbox v-model="solicitante.esTitular" name="esTitular" >
          <span>Soy o represento al titular del inmueble</span></b-form-checkbox>
        <b-form-checkbox v-model="solicitante.esPropietario" name="esPropietario" >
          <span>Soy o represento al propietario del inmueble</span></b-form-checkbox>
        <div v-if="$v.solicitante.esTitular.$error || $v.solicitante.esPropietario.$error" class="validation-error">
          <i class="bi bi-exclamation-octagon text-danger"></i> Debe seleccionar por lo menos una opciÃ³n.
        </div>
      </b-form-group> -->
    </fieldset>

    <b-row>
      <b-col lg="6" md="8" sm="8">
        <h5>Â¿Sos titular del inmueble?</h5>
      </b-col>
      <b-col class="form-check-inline" sm="4">
        <b-col lg="3" sm="3">
          <b-form-radio  id="esTitular-no" v-model="solicitante.esTitular" name="radio-esTitular" checked="checked" value="false"> No</b-form-radio>
        </b-col>
        <b-col lg="3" sm="1">
          <b-form-radio  id="esTitular-si" v-model="solicitante.esTitular" name="radio-esTitular" value="true"> SÃ­</b-form-radio>
        </b-col>
      </b-col>
    </b-row>
  </b-card>
  <b-card no-body class="col-8 mt-1 section-card" style="margin: 0px auto">
    <fieldset >
      <legend><h3>Carga de DocumentaciÃ³n</h3></legend>
      <p>AquÃ­ deberÃ¡s cargar los documentos requeridos previamente. TenÃ© en cuenta que deben ser <u>legibles</u>, estar subidos en <u>formato de imagen Ã³ pdf</u> y tener un <u>peso mÃ¡ximo de 15 mb</u>.</p>
      <b-row>
        <b-col lg="6">
          <b-form-group label="DNI (Frente) *" label-for="dniFrente">
            <b-form-file v-model="documentos.dniFrente.contenido" placeholder="No se seleccionÃ³ un archivo." browse-text="Examinar" accept=".pdf, image/*"
              :state="getFormFieldState('dniFrente')"
              @change="handleDocumentUpdate('dniFrente'); checkDocumentSize('dniFrente', $event); $v.documentos.dniFrente.contenido.$touch()"
              @input="clearFormFieldState('dniFrente')"></b-form-file>
            <div v-if="$v.documentos.dniFrente.contenido.$error || fileTooLargeError.dniFrente" class="validation-error">
              <i class="bi bi-exclamation-octagon text-danger"></i> {{ fileTooLargeError.dniFrente || 'Debe seleccionar un archivo.' }}
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group label="DNI (Dorso) *" label-for="dniDorso" >
            <b-form-file v-model="documentos.dniDorso.contenido" placeholder="No se seleccionÃ³ un archivo." browse-text="Examinar"
            accept=".pdf, image/*"  :state="getFormFieldState('dniDorso')"
            @change="handleDocumentUpdate('dniDorso'); checkDocumentSize('dniDorso', $event); $v.documentos.dniDorso.contenido.$touch()"
            @input="clearFormFieldState('dniDorso')"></b-form-file>
            <div v-if="$v.documentos.dniDorso.contenido.$error || fileTooLargeError.dniDorso" class="validation-error">
              <i class="bi bi-exclamation-octagon text-danger"></i> {{ fileTooLargeError.dniDorso || 'Debe seleccionar un archivo.' }}
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group>
        <label for="comprobantePago" class="rubro-label">Comprobante de pago *
          <!-- <i class="bi bi-question-circle-fill text-info" style="font-size: 1em"></i> -->
        </label>
        <b-form-file v-model="documentos.comprobantePago.contenido" placeholder="No se seleccionÃ³ un archivo." browse-text="Examinar"
        accept=".pdf, image/*"  :state="getFormFieldState('comprobantePago')"
        @change="handleDocumentUpdate('comprobantePago'); checkDocumentSize('comprobantePago', $event); $v.documentos.comprobantePago.contenido.$touch()"
        @input="clearFormFieldState('comprobantePago')"></b-form-file>
        <div v-if="$v.documentos.comprobantePago.contenido.$error || fileTooLargeError.comprobantePago" class="validation-error">
          <i class="bi bi-exclamation-octagon text-danger"></i> {{ fileTooLargeError.comprobantePago || 'Debe seleccionar un archivo.' }}
        </div>
      </b-form-group>
      <b-form-group>
        <label for="comprobantePago2" class="rubro-label">Comprobante de pago duplicado *</label>
        <b-form-file v-model="documentos.comprobantePago2.contenido" placeholder="No se seleccionÃ³ un archivo." browse-text="Examinar"
        accept=".pdf, image/*"  :state="getFormFieldState('comprobantePago2')"
        @change="handleDocumentUpdate('comprobantePago2'); checkDocumentSize('comprobantePago2', $event); $v.documentos.comprobantePago2.contenido.$touch()"
        @input="clearFormFieldState('comprobantePago2')"></b-form-file>
        <div v-if="$v.documentos.comprobantePago2.contenido.$error || fileTooLargeError.comprobantePago2" class="validation-error">
          <i class="bi bi-exclamation-octagon text-danger"></i> {{ fileTooLargeError.comprobantePago2 || 'Debe seleccionar un archivo.' }}
        </div>
      </b-form-group>

      <!-- Documentos que solo se muestran si NO es titular -->
      <div v-if="solicitante.esTitular !== 'true'">
        <b-form-group>
          <label for="planillaAutorizacion">Planilla de autorizaciÃ³n de trÃ¡mite *</label>
          <b-form-file v-model="documentos.planillaAutorizacion.contenido" placeholder="No se seleccionÃ³ un archivo." browse-text="Examinar" accept=".pdf, image/*" :state="getFormFieldState('planillaAutorizacion')" @change="checkDocumentSize('planillaAutorizacion', $event); $v.documentos.planillaAutorizacion.contenido.$touch()" @input="clearFormFieldState('planillaAutorizacion')"></b-form-file>
          <div v-if="$v.documentos.planillaAutorizacion.contenido.$error || fileTooLargeError.planillaAutorizacion" class="validation-error">
            <i class="bi bi-exclamation-octagon text-danger"></i> {{ fileTooLargeError.planillaAutorizacion || 'Debe seleccionar un archivo.' }}
          </div>
        </b-form-group>
        <b-form-group >
          <label for="acreditacionTitularidad"><span> AcreditaciÃ³n de titularidad de la cuenta: Escritura traslativa de Dominio del inmueble / </span>Contrato de locaciÃ³n / Boleto de Compraventa. *</label>
          <b-form-file v-model="documentos.acreditacionTitularidad.contenido" placeholder="No se seleccionÃ³ un archivo." browse-text="Examinar"
          accept=".pdf, image/*"  :state="getFormFieldState('acreditacionTitularidad')"
          @change="handleDocumentUpdate('acreditacionTitularidad'); checkDocumentSize('acreditacionTitularidad', $event); $v.documentos.acreditacionTitularidad.contenido.$touch()"
          @input="clearFormFieldState('acreditacionTitularidad')"></b-form-file>
          <div v-if="$v.documentos.acreditacionTitularidad.contenido.$error || fileTooLargeError.acreditacionTitularidad" class="validation-error">
            <i class="bi bi-exclamation-octagon text-danger"></i> {{ fileTooLargeError.acreditacionTitularidad || 'Debe seleccionar un archivo.' }}
          </div>
        </b-form-group>
      </div>
    </fieldset>

    <b-card border-variant="warning" align="center" class="importante-card" >
      <b-card-text>
        <b-row >
          <b-col md="2">
            <i class="bi bi-exclamation-triangle text-warning" style="font-size: 5em"></i>
            <p class="li-title"><u><b>Â¡Importante!</b></u></p>
          </b-col>
          <b-col  md="10">
              <div class="li-row"><div class="li-icon"><i class="bi bi-caret-right-fill" style="font-size: 1em"></i></div><div class="li-content"><span>Una vez completado el formulario, el Dpto. Recaudaciones se comunicarÃ¡ a travÃ©s del correo electrÃ³nico oficial (<a href="mailto:deptocomercio@gesell.gob.ar" class="external-link" target="_blank" >recaudaciones@gesell.gob.ar</a>).</span></div></div>
              <!-- <div class="li-row"><div class="li-icon"><i class="bi bi-caret-right-fill" style="font-size: 1em"></i></div><div class="li-content"><span><b>El trÃ¡mite de baja comercial serÃ¡ efectivo una vez abonado el importe del mismo y obtenido el certificado respectivo.</b></span></div></div> -->
          </b-col>
        </b-row>
      </b-card-text>
    </b-card>
    <div class="centeredContainer" style="min-width: 304px;">
      <b-form-group>
        <div id="captchaContainer" class="g-recaptcha" :data-sitekey="recaptchaSiteKey"></div>
        <div v-if="captchaError" class="validation-error">
          <i class="bi bi-exclamation-octagon text-danger"></i> Por favor completa la verificaciÃ³n para continuar.
        </div>
      </b-form-group>
    </div>
    <div class="centeredContainer">
      <fieldset>
        <b-button size="lg" @click="onResetParams" variant="danger" class="btn-cancel" >Cancelar</b-button>
        <b-button size="lg" type="submit" variant="success" :disabled="!areAllFieldsComplete || formSubmitted" class="" >
          <span v-if="formSubmitted">Enviado</span>
          <span v-else>Enviar</span>
        </b-button>
      </fieldset>
        <div v-if="!areAllFieldsComplete" class="validation-error">
          <i class="bi bi-exclamation-octagon text-danger"></i> Completar todos los campos marcados con (*).
        </div>
        <div v-if="!areAllFieldsValid" class="validation-error">
          <i class="bi bi-exclamation-octagon text-danger"></i> Por favor, revisa el formulario en busca de errores.
        </div>
        <div v-if="formSubmitted" class="validation-success">
          <i class="bi bi-check-circle text-success"></i> Tu solicitud ha sido enviada exitosamente. No es necesario enviarla nuevamente.
        </div>
    </div>
  </b-card>
  </b-form>
<!-- PopUps -->
<b-modal v-model="showPopupDatosDelSolicitante" title="" :hide-footer="true" @click-outside="showPopupDatosDelSolicitante = false" :header-bg-variant="'success'"  centered>
  <template #modal-header>
    <div class="modal-info">
      <h5>
          <i class="bi bi-question-circle text-light"></i>
          InformaciÃ³n Adicional
      </h5>
    </div>
    <button type="button" aria-label="Close" class="close" @click="showPopupDatosDelSolicitante = false">Ã—</button>
  </template>
  <div class="modal-info">
    <p><i class="bi bi-caret-right-fill"></i>El interesado futuro comerciante / industrial o afÃ­n mayor de 18 aÃ±os.</p>
    <p><i class="bi bi-caret-right-fill"></i>El representante o apoderado/a de la persona interesada con documentaciÃ³n que acredite el carÃ¡cter de tal.</p>
  </div>
</b-modal>
<b-modal v-model="showPopupNroInmueble" title="" :hide-footer="true" @click-outside="showPopupNroInmueble = false" :header-bg-variant="'success'"  centered>
  <template #modal-header>
    <div class="modal-info">
      <h5>
          <i class="bi bi-question-circle text-light"></i>
          InformaciÃ³n Adicional
      </h5>
    </div>
    <button type="button" aria-label="Close" class="close" @click="showPopupNroInmueble = false">Ã—</button>
  </template>
  <div class="modal-info">
    <p><i class="bi bi-caret-right-fill"></i>PodÃ©s consultar el nÃºmero enviando un correo electrÃ³nico a <a href="mailto:catatro@gesell.gob.ar" target="_blank">catastro@gesell.gob.ar</a>, indicando nomenclatura catastral del bien que se encuentra en la escritura del mismo.</p>
  </div>
</b-modal>
<b-modal v-model="showPopupFormLoading" no-close-on-backdrop title="" :header-bg-variant="'success'" hide-footer centered>
  <template #modal-header>
    <h5 class="centeredContainer">Solicitud en Proceso</h5>
  </template>
  <div class="centeredContainer">
    <p class="popup-link">Tus archivos se estÃ¡n cargando.</p>
    <b-spinner variant="success" style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
    <p>No cierres esta pÃ¡gina</p>
  </div>
</b-modal>
<b-modal v-model="showPopupFormOk" title="" ok-only @click-outside="onPopupClose" @ok="onPopupClose" :header-bg-variant="'success'" centered>
  <template #modal-header>
    <div class="centeredContainer"><h3>
      <i class="bi bi-check-circle-fill text-light"></i>
    </h3></div>
  </template>
  <div class="centeredContainer">
    <p class="modal-subtitle">Â¡Tu solicitud ha sido enviada exitosamente!</p>
    <p class="">Se ha enviado automÃ¡ticamente un correo electrÃ³nico a tu direcciÃ³n de email con los datos de tu trÃ¡mite. En los prÃ³ximos dÃ­as recibirÃ¡s otro correo del Departamento Recaudaciones Municipal indicÃ¡ndote cÃ³mo continuar. Asegurate de revisar la bandeja de correos no deseados (Spam).</p>
    <p class=""><b>Tu nÃºmero de trÃ¡mite es: </b></p>
    <p class="h3"><b> R{{ nroTramite }} </b></p>
    <p class="">Por favor, conservÃ¡ este nÃºmero. SerÃ¡ solicitado mÃ¡s adelante.</p>
  </div>
    <div class="centeredContainer" style="padding:0 1rem; padding-top: 1rem; border-top:1px solid #CCC; ">
      <p class="" style="text-align: justify; margin-bottom:0; font-size: 0.75rem "><i class="bi bi-caret-right-fill text-success"></i> TenÃ© en cuenta que el Departamento Recaudaciones puede solicitarte documentaciÃ³n adicional vÃ­a correo electrÃ³nico.</p>
      <p class="" style="text-align: justify; font-size: 0.75rem; margin-bottom:0; "><i class="bi bi-caret-right-fill text-success"></i> Para consultar el estado de tu trÃ¡mite ingresÃ¡ en <a class="external-link" href="https://haciendavgesell.gob.ar/">haciendavgesell.gob.ar</a>, hacÃ© click en el Ã­cono correspondiente y escribÃ­ el nÃºmero asignado en este comprobante.</p>
    </div>
  <template #modal-footer>
    <div class="" style="margin: auto">
      <b-button @click="onResetParams" class="btn-cancel">Volver</b-button>
      <b-button @click="onPrintTicket" variant="success">Imprimir</b-button>
    </div>
  </template>
</b-modal>
<b-modal v-model="showPopupFormError" title="Error en el envÃ­o!" @click-outside="showPopupFormError = false" :header-bg-variant="'danger'" centered>
  <template #modal-header>
    <div class="centeredContainer"><h3>
        <i class="bi bi-exclamation-octagon text-light"></i>
    </h3></div>
    <button type="button" aria-label="Close" class="close" @click="showPopupFormError = false">Ã—</button>
  </template>
  <div class="centeredContainer modal-error">
    <p class="modal-subtitle">No hemos podido procesar tu solicitud</p>
    <p class="">Por favor, verificÃ¡ tu conexiÃ³n a internet e intentalo nuevamente mÃ¡s tarde.</p>
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
import { required, requiredIf, alpha, numeric, email, minLength, maxLength, sameAs } from '@vuelidate/validators';
import MailerService from '~/service/mailer.js'

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
        //Validaciones exclusivas de HabilitaciÃ³n
        comprobantePago: { contenido:{required} },
        comprobantePago2: { contenido:{required } },
        //Validaciones con varias condiciones
        acreditacionTitularidad: { contenido:{ requiredIf: requiredIf(function () {
          return this.solicitante.esTitular !== 'true' })}},
      }
    }
    // Otras validaciones aquÃ­...
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
      provincias: [
        'CABA','Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'CÃ³rdoba', 'Corrientes', 'Entre RÃ­os', 'Formosa', 'Jujuy',
        'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'NeuquÃ©n', 'RÃ­o Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz',
        'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'TucumÃ¡n'
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
          nombreDocumento: 'Planilla de autorizaciÃ³n de trÃ¡mite',
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
          nombreDocumento: 'AcreditaciÃ³n de titularidad: Escritura traslativa de Dominio del inmueble / Contrato de locaciÃ³n / Boleto de Compraventa',
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
      formSubmitted: false, // Control para prevenir envÃ­os duplicados
    }
  },
  computed: {
    areAllFieldsComplete() {

      // Usar Vuelidate para verificar que todos los campos requeridos estÃ©n completos
      // Primero verificamos que no haya errores de validaciÃ³n
      if (this.$v.$invalid) {
        return false;
      }

      // Verificar errores de archivos demasiado grandes
      if (Object.values(this.fileTooLargeError).some(error => !!error)) {
        return false;
      }

      // Verificar campos bÃ¡sicos del solicitante
      const camposSolicitante =
        this.solicitante.nombre &&
        this.solicitante.apellido &&
        this.solicitante.dni &&
        this.solicitante.cuit &&
        this.solicitante.nroCuenta &&
        this.solicitante.domicilioReal &&
        this.solicitante.telefono &&
        this.solicitante.codigoPostal &&
        this.solicitante.localidad &&
        this.solicitante.provincia &&
        this.solicitante.mail &&
        this.solicitante.mail2;

      if (!camposSolicitante) return false;

      // Verificar documentos siempre requeridos
      const documentosBasicos =
        this.documentos.dniFrente.contenido &&
        this.documentos.dniDorso.contenido &&
        this.documentos.comprobantePago.contenido &&
        this.documentos.comprobantePago2.contenido;

      if (!documentosBasicos) return false;

      // Verificar documentos condicionales segÃºn si es titular o no
      const noEsTitular = this.solicitante.esTitular !== 'true';
      if (noEsTitular) {
        const documentosAdicionales =
          this.documentos.planillaAutorizacion.contenido &&
          this.documentos.acreditacionTitularidad.contenido;
        if (!documentosAdicionales) return false;
      }

      return true;
    },
    areAllFieldsValid(){
      if(this.areAllFieldsComplete){
        return !this.$v.$invalid && !Object.values(this.fileTooLargeError).some(error => !!error)
      }
      return true;
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
        return !this.captchaError;
    },
    openPopup(type) {
      // LÃ³gica para abrir el popup correspondiente segÃºn el tipo (A, B, C, D)
      if (type === 'A') {
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
      } else if (type === 'FormOk') {
        this.showPopupFormOk = true;
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
    async onSubmitForm() {
      this.$v.$touch(); // Marca los campos como tocados para mostrar los errores

      if (!this.$v.$invalid && !Object.values(this.fileTooLargeError).some(error => !!error) && this.isCaptchaOK() && !this.formSubmitted) {
        // Si no hay errores y el formulario no fue enviado previamente, envÃ­a el formulario
        this.formSubmitted = true; // Marcar como enviado para prevenir duplicados
        try {
          this.openPopup('FormLoading');
          const documentosParaGuardar = {};
          // Recorrer los campos en this.documentos
          for (const campo in this.documentos) {
            const nombreDoc = this.documentos[campo].nombreDocumento;
            const contenidoDoc = this.documentos[campo].contenido;

            if (contenidoDoc instanceof Blob) {
              // Verificar que el campo sea un Blob vÃ¡lido (archivo PDF seleccionado)
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

          // Usar el store como en tramites/form.vue
          const response = await this.$store.dispatch('pagosDobles/create', {
            pagoDoble,
          });

          await MailerService.enviarCorreo(this.$axios, {
            destinatario: this.solicitante.mail,
            asunto: 'Solicitud de pago doble recibida',
            mensaje: `Estimado/a contribuyente,
            Su reclamo por pago doble ha sido registrado correctamente.
            En los prÃ³ximos dÃ­as recibirÃ¡ un correo electrÃ³nico del Departamento Recaudaciones Municipal en el que le indicarÃ¡n cÃ³mo continuar.
            AsegÃºrese de revisar la bandeja de correos no deseados (Spam).`
          });
          this.nroTramite = response.data
          this.showPopupFormLoading = false;
          this.openPopup('FormOk');

        } catch (e) {
          console.error('Error al enviar el formulario:', e);
          this.showPopupFormLoading = false; // Cerrar popup de carga
          this.showPopupFormError = true;
        }
      } else {
        console.log('Validaciones fallaron - no se envÃ­a el formulario');
      }
    },
    handleDocumentUpdate(fieldName) {
      const contenidoDoc = this.documentos[fieldName];


      if (contenidoDoc instanceof Blob) {
        // Verificar que el campo sea un Blob vÃ¡lido (archivo PDF o imagen seleccionado)
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
      //('checkDocumentSize CALLED');
      const file = event.target.files[0];

      //('event.target.files[0]: ' + event.target.files[0]);

      //('file.size: ' + file.size + '> this.maxFileSize: ' + this.maxFileSize);
       if (file && file.size > this.maxFileSize) {
        // El archivo excede el tamaÃ±o mÃ¡ximo permitido
        this.fileTooLargeError[field] = 'Tu archivo pesa '+ (file.size/1024/1024).toFixed(2) + 'MB'+ ', superando el lÃ­mite de peso permitido (' + this.maxFileSize/1024/1024 + 'MB'+ '). Reducilo y volvÃ© a cargarlo.' ;
        return;
      }else
      this.fileTooLargeError[field] = null
    },
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      },
    async onPrintTicket() {
        this.showPopupFormOk = false;
        this.printing = true;
        await this.wait(500);
        print();
        await this.wait(500);
        this.endButton = true;
      },
    async onResetParams(){
      await this.$router.push('/recaudaciones/pagos_dobles')
      this.showPopupFormOk = false;
      this.showPopupFormLoading = false;
      this.printing = false;
      this.endButton = false;
      this.nroTramite = null;
      this.nroLegajo = 0;
      this.formSubmitted = false; // Resetear estado de envÃ­o
      this.solicitante = {
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
        mail2: '',
        esTitular: false,
        esPropietario: false,
      }
      this.documentos = {
        planillaAutorizacion: {
          nombreDocumento: 'Planilla de autorizaciÃ³n de trÃ¡mite',
          contenido: null
        },
        dniFrente: {
          nombreDocumento: 'DNI (Frente)',
          contenido: null
        },
        dniDorso: {
          nombreDocumento: 'DNI (Dorso)',
          contenido: null
        },
        comprobantePago: {
          nombreDocumento: 'Comprobante de pago',
          contenido: null
        },
        comprobantePago2: {
          nombreDocumento: 'Comprobante de pago duplicado',
          contenido: null
        },
        acreditacionTitularidad: {
          nombreDocumento: 'AcreditaciÃ³n de titularidad: Escritura traslativa de Dominio del inmueble / Contrato de locaciÃ³n / Boleto de Compraventa',
          contenido: null
        }
      }
    },
    async onPopupClose() {
      // Reutilizar la lÃ³gica de reset para evitar duplicaciÃ³n de cÃ³digo
      await this.onResetParams();
    },
    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    async onPrintTicket() {
      this.showPopupFormOk = false;
      this.showPopupFormLoading = false;
      this.printing = true;
      await this.wait(500);
      print();
      await this.wait(500);
      this.endButton = true;
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
}

.validation-success {
  color: #28a745;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  font-weight: 500;
}
ul{
  list-style-type: none; /* Elimina los puntos por defecto */
  padding: 0;
}
.btn.disabled{
  background-color: #619D6A;
  border-color: #619D6A;
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

