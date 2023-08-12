<template>
<div class="page">
  <Banner title="Habilitaciones comerciales" />
  <!-- Comprobante (página 4) -->
  <div v-if="printing === true">
    <b-card class="text-center shadow-lg col-md-8 col-sm-12 mx-auto">
      <h1>Comprobante de Solicitud</h1>
      <h4>Departamento de Comercio</h4>
      <h5>Nro de trámite: HAB001</h5>
      <h5>Solicita el turno: {{ solicitante.nombre }} {{ solicitante.apellido }}</h5>
      <h5>CUIT: {{ solicitante.cuit }}</h5>
      <h5>Tipo de Soolicitud: {{ solicitante.tipoSolicitud }}</h5>
      <h5>Rubro: {{ inmueble.rubro }}</h5>
      <b-button v-if="endButton === true" @click="onResetParams" class="btn-cancel">Volver</b-button>
    </b-card>
  </div>  
  <b-form v-else @submit="submitForm" class="my-3" style="margin-left:10px;margin-right:10px">

  <b-card no-body class="col-8 mt-1 section-card"  style="margin: 0px auto">
    <!-- Sección: Datos del solicitante -->
    <fieldset >
      <legend><h3>Datos del Solicitante <b-icon-question-circle-fill @click="openPopup('DatosDelSolicitante')" font-scale="1" variant="info"></b-icon-question-circle-fill></h3></legend>
      <b-form-group label="Tipo de Solicitud *" label-for="tipo-solicitud" >
        <b-form-select title="Por el momento solo se pueden solicitar habilitaciones comerciales." id="tipo-solicitud" v-model="solicitante.tipoSolicitud" disabled required>
            <b-form-select-option selected="selected" value="Habilitación">Habilitar nuevo comercio</b-form-select-option>
        </b-form-select>
      </b-form-group>

    </fieldset>
    <fieldset >
      <b-row>
      <b-col md="6">
          <b-form-group label="Nombre *" label-for="nombreSolicitante" >
            <b-form-input id="nombreSolicitante" v-model="solicitante.nombre" required></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Apellido *" label-for="apellidoSolicitante" >
            <b-form-input id="apellidoSolicitante" v-model="solicitante.apellido" required></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group label="DNI/Pasaporte *" label-for="DNISolicitante" >
            <b-form-input id="DNISolicitante" v-model="solicitante.DNI" required></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="CUIT *" label-for="cuit" >
            <b-form-input id="cuit" v-model="solicitante.cuit" required></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group>
            <label for="razon-social">Razón Social <i>(completar sólo si se trata de una Persona Jurídica)</i></label>
        <b-form-input id="razon-social" v-model="solicitante.razonSocial" ></b-form-input>
      </b-form-group>
      <b-form-group label="Domicilio Real y/o Legal *" label-for="domicilio-real" >
        <b-form-input id="domicilio-real" v-model="solicitante.domicilioReal" required></b-form-input>
      </b-form-group>
      <b-row>
        <b-col md="10">
          <b-form-group label="Teléfono *" label-for="telefonoTitular" >
            <b-form-input id="telefonoTitular" v-model="solicitante.telefono"  type="tel" no-wheel ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="2">
          <b-form-group label="Código Postal *" label-for="codigoPostal" >
            <b-form-input id="codigoPostal" v-model="solicitante.codigoPostal" type="number" required></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group label="Localidad *" label-for="localidadSolicitante" >
            <b-form-input id="localidadSolicitante" v-model="solicitante.localidad" required></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Provincia *" label-for="provincia" >
            <b-form-input id="provincia" v-model="solicitante.provincia" required></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group label="Correo Electrónico *" label-for="mail" >
        <b-form-input id="mail" v-model="solicitante.mail" type="email" required></b-form-input>
      </b-form-group>
    </fieldset>
    <b-row>
      <b-col md="6">
        <h5>¿Sos representante o apoderado/a del solicitante? <b-icon-question-circle-fill @click="openPopup('ApoderadoRepresentante')" font-scale="1" variant="info"></b-icon-question-circle-fill></h5>
      </b-col>
        <div class="form-check-inline">
          <b-col md="3">
            <b-form-radio  id="esApoderado-no" v-model="solicitante.esApoderado" name="radio-esApoderado" checked="checked" value="false"> No</b-form-radio>
          </b-col>
          <b-col md="3">
            <b-form-radio  id="esApoderado-si" v-model="solicitante.esApoderado" name="radio-esApoderado" value="true"> Sí</b-form-radio>
          </b-col>
        </div>
    </b-row>
    <!-- Sección: Datos del Apoderado -->
    <fieldset v-if="solicitante.esApoderado === 'true'">
        <p>En este campo deberás cargar la <a href="https://arvige.gob.ar/lpagos" target="_blank" class="external-link">Planilla de autorización de trámite</a> o el Poder autorizado por escribano que te indicamos que completes previamente.</p>

      <b-form-group v-if="solicitante.esApoderado === 'true'" label="Planilla de autorización de trámite" label-for="documentos.planillaAutorizacion" >
        <b-form-file v-model="documentos.planillaAutorizacion" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" :state="getFormFieldState('planillaAutorizacion')" @input="clearFormFieldState('planillaAutorizacion')"></b-form-file>
      </b-form-group>
    </fieldset>
  </b-card>
  <b-card no-body class="col-8 mt-1 section-card"  style="margin: 0px auto">
    <!-- Sección: Datos del inmueble -->
    <fieldset >
      <legend><h3>Datos del Inmueble</h3></legend>
      <b-row>
        <b-col md="6">
          <b-form-group label="Localidad *" label-for="localidad" >
            <b-form-select id="localidad" v-model="inmueble.localidad" required>
              <option value="">Seleccione...</option>
              <option value="villa-gesell">Villa Gesell</option>
              <option value="mar-de-las-pampas">Mar de las Pampas</option>
              <option value="mar-azul">Mar Azul</option>
              <option value="las-gaviotas">Las Gaviotas</option>
              <option value="colonia-marina">Colonia Marina</option>
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label-for="rubro">
            <label for="rubro" class="rubro-label">Rubro *</label>
            <b-form-select v-model="inmueble.rubro" :options="listaRubros" value-field="nombre" text-field="nombre" @change="handleRubroChange" >
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="8">
          <b-form-group label="Calle *" label-for="direccion-inmueble-calle" >
            <b-form-input id="direccion-inmueble-calle" v-model="inmueble.calle" required></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="2">
          <b-form-group label="" label-for="direccion-inmbueble-nro" >
            <label for="direccion-inmbueble-nro" class="rubro-label">Número * <b-icon-question-circle-fill class="" @click="openPopup('NroInmueble')" font-scale="1" variant="info"></b-icon-question-circle-fill></label>
            <b-form-input id="direccion-inmbueble-nro" v-model="inmueble.nro" type="number" required></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="2">
          <b-form-group label="Nro. de Local" label-for="direccion-inmueble-calle2" >
            <b-form-input id="direccion-inmueble-calle2" v-model="inmueble.nroLocal" placeholder="Ej. local 2/local A" required></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group label="Nombre de Fantasía (En caso de que lo posea)" label-for="nombre-fantasia" >
        <b-form-input id="nombre-fantasia" v-model="inmueble.nombreFantasia"></b-form-input>
      </b-form-group>
    <fieldset  v-if="isHoteleria" key="rubro-146">
      <h5>Servicios exclusivos del rubro {{inmueble.rubro}} *</h5>
      <p>Seleccioná los servicios que brinda tu establecimiento:</p>

        <b-form-group>
        <b-form-checkbox v-for="servicio in inmueble.serviciosHoteleria" :key="servicio.id" :id="`servicio${servicio.id}`" :name="`servicio${servicio.id}`" v-model="servicio.value" scale=1.5 >
          {{ servicio.nombre }}
        </b-form-checkbox>

      </b-form-group>
      <b-form-group v-if="inmueble.serviciosHoteleria[11].value === true" label="Contanos que otros servicios brinda tu establecimiento: " label-for="otrosServicios" >
        <b-form-textarea id="otrosServicios" v-model="inmueble.otrosServicios" rows="2" max-rows="4" type="text" required></b-form-textarea>
      </b-form-group>
    </fieldset>
      <b-form-group v-if="rubroSeleccionado.croquis === true" label="Croquis" label-for="documentos.croquis" >
        <b-form-file v-model="documentos.croquis" placeholder="No se seleccionó un archivo." browse-text="Examinar" required accept=".pdf, image/*" :state="getFormFieldState('croquis')" @input="clearFormFieldState('croquis')"></b-form-file>
      </b-form-group>
      <b-form-group label="" label-for="espaciopublico" style="margin: 0px auto">
            <b-row>
              <b-col md="5">
                <h5>¿Hará uso del espacio público? *</h5>
              </b-col>
              <div class="form-check-inline">
                <b-col md="3">
                  <b-form-radio  id="espaciopublico-no" v-model="inmueble.espacioPublico" name="radio-espacio" checked="checked" value="false"> No</b-form-radio>
                </b-col>
                <b-col md="3">
                  <b-form-radio  id="espaciopublico-si" v-model="inmueble.espacioPublico" name="radio-espacio" value="true"> Sí</b-form-radio>
                </b-col>
            </div>
          </b-row>
      </b-form-group>
    <fieldset v-if="inmueble.espacioPublico === 'true'">
        <p>Indicá cuál de los siguientes ítems posee tu establecimiento:</p>
        <b-form-group label="" label-for="marquesina" style="margin-bottom: 0">
            <b-form-checkbox  id="marquesina" v-model="inmueble.marquesina" scale=1.5>Marquesina - Toldo</b-form-checkbox>
        </b-form-group>
        <b-form-group label="" label-for="mercaderia" style="margin-bottom: 0">
            <b-form-checkbox  id="mercaderia" v-model="inmueble.mercaderia" scale=1.5>Mercadería en la Vía Pública</b-form-checkbox>
        </b-form-group>
        <b-form-group label="" label-for="carteles" style="margin-bottom: 0">
            <b-form-checkbox  id="carteles" v-model="inmueble.carteles" scale=1.5>Carteles</b-form-checkbox>
        </b-form-group>
        <b-form-group label="" label-for="mesas" style="margin-bottom: 0">
            <b-form-checkbox  id="mesas" v-model="inmueble.mesas" scale=1.5>Mesas y Sillas</b-form-checkbox>
        </b-form-group>
      </fieldset>
    </fieldset>

  </b-card>
  <b-card no-body class="col-8 mt-1 section-card" style="margin: 0px auto">
    <fieldset >
      <legend><h3>Carga de Documentación</h3></legend>
      <p>Aquí deberás cargar los documentos requeridos previamente. Tené en cuenta que deben ser <u>legibles</u>, estar subidos en <u>formato de imagen ó pdf</u> y tener un <u>peso máximo de 15 mb</u>.</p>
      <b-row>
        <b-col md="6">
          <b-form-group label="DNI (Frente) *" label-for="dniFrente">
            <b-form-file v-model="documentos.dniFrente" placeholder="No se seleccionó un archivo." browse-text="Examinar"
              accept=".pdf, image/*" required
              :state="getFormFieldState('dniFrente')"
              @change="handleDocumentUpdate('dniFrente')"
              @input="clearFormFieldState('dniFrente')"
            ></b-form-file>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="DNI (Dorso) *" label-for="dniDorso" >
            <b-form-file v-model="documentos.dniDorso" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('dniDorso')" @change="handleDocumentUpdate('dniDorso')" @input="clearFormFieldState('dniDorso')"></b-form-file>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group>
        <label for="constanciaCuit" class="rubro-label">Constancia de CUIT * <b-icon-question-circle-fill @click="openPopup('ConstanciaCUIT')" font-scale="1" variant="info"></b-icon-question-circle-fill></label>
        <b-form-file v-model="documentos.constanciaCuit" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('constanciaCuit')" @change="handleDocumentUpdate('constanciaCuit')" @input="clearFormFieldState('constanciaCuit')"></b-form-file>
      </b-form-group>
      <b-form-group>
        <label for="constanciaIngresosBrutos" class="rubro-label">Constancia de inscripción a Ingresos Brutos <b-icon-question-circle-fill @click="openPopup('ConstanciaIngresosBrutos')" font-scale="1" variant="info"></b-icon-question-circle-fill></label>
        <b-form-file v-model="documentos.constanciaIngresosBrutos" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" :state="getFormFieldState('constanciaIngresosBrutos')" @change="handleDocumentUpdate('constanciaIngresosBrutos')" @input="clearFormFieldState('constanciaIngresosBrutos')"></b-form-file>
      </b-form-group>
      <b-form-group>
        <label for="certificadoDomicilio" class="rubro-label">Certificado de domicilio Ingresos Brutos - Punto de venta Villa Gesell <b-icon-question-circle-fill @click="openPopup('certificadoDomicilio')" font-scale="1" variant="info"></b-icon-question-circle-fill></label>
        <b-form-file v-model="documentos.certificadoDomicilio" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" :state="getFormFieldState('certificadoDomicilio')" @change="handleDocumentUpdate('certificadoDomicilio')" @input="clearFormFieldState('certificadoDomicilio')"></b-form-file>
      </b-form-group>
      <b-form-group>
        <label for="libreDeudaUrbana" class="rubro-label">Libre Deuda de Tasa por Servicios Urbanos <i>(o última factura de pago que indique que la Tasa municipal no registra deuda)</i>. * <b-icon-question-circle-fill @click="openPopup('ConstanciaLibreDeuda')" font-scale="1" variant="info"></b-icon-question-circle-fill></label>
        <b-form-file v-model="documentos.libreDeudaUrbana" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('libreDeudaUrbana')" @change="handleDocumentUpdate('libreDeudaUrbana')" @input="clearFormFieldState('libreDeudaUrbana')"></b-form-file>
      </b-form-group>
      <b-form-group label="Escritura traslativa de Dominio del inmueble / Contrato de locación / Otro *" label-for="tituloPropiedad" >
        <b-form-file v-model="documentos.tituloPropiedad" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" multiple required :state="getFormFieldState('tituloPropiedad')" @change="handleDocumentUpdate('tituloPropiedad')" @input="clearFormFieldState('tituloPropiedad')"></b-form-file>
      </b-form-group>
      <b-form-group >
        <label for="plano" class="rubro-label">Plano o Informe técnico * <b-icon-question-circle-fill @click="openPopup('plano')" font-scale="1" variant="info"></b-icon-question-circle-fill></label>
        <b-form-file v-model="documentos.plano" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('plano')" @change="handleDocumentUpdate('plano')" @input="clearFormFieldState('plano')"></b-form-file>
      </b-form-group>
      <b-row>
        <b-col md="6">
          <h5>¿El iniciante es una Persona Jurídica?</h5>
        </b-col>
        <b-form-group label="" label-for="esPersonaJuridica" style="margin:auto 0">
          <div class="form-check-inline">
            <b-col md="3">
              <b-form-radio  id="esPersonaJuridica-no" v-model="solicitante.esPersonaJuridica" name="radio-esPersonaJuridica" checked="checked" value="false"> No</b-form-radio>
            </b-col>
            <b-col md="3">
              <b-form-radio  id="esPersonaJuridica-si" v-model="solicitante.esPersonaJuridica" name="radio-esPersonaJuridica" value="true"> Sí</b-form-radio>
            </b-col>
          </div>
        </b-form-group>
      </b-row>
      <!-- Sección: Datos del Apoderado -->
    <fieldset v-if="solicitante.esPersonaJuridica === 'true'">
      <p>A continuación deberás cargar la Escritura constitutiva de la Persona Jurídica y el Acta de Directorio actualizada.</p>
      <b-form-group label="Acta de Constitución de Persona Jurídica *" label-for="actaPersonaJuridica" >
        <b-form-file v-model="documentos.actaPersonaJuridica" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('actaPersonaJuridica')" @change="handleDocumentUpdate('actaPersonaJuridica')" @input="clearFormFieldState('actaPersonaJuridica')"></b-form-file>
      </b-form-group>
      <b-form-group label="" label-for="actaDirectorio" >
        <label for="actaDirectorio" class="actaDirectorio-label">Acta de Directorio Actualizada <i>(En caso que corresponda)</i> </label>
        <b-form-file v-model="documentos.actaDirectorio" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" :state="getFormFieldState('actaDirectorio')" @change="handleDocumentUpdate('actaDirectorio')" @input="clearFormFieldState('actaDirectorio')"></b-form-file>
      </b-form-group>
    </fieldset>
    </fieldset>
    <div class="centeredContainer">
      <b-form-group>
        <div id="captchaContainer"></div>
      </b-form-group>
      <fieldset>
        <input type="hidden" id="captchaResponse" name="captchaResponse" v-model="captchaResponse">
        <b-button size="lg" @click="onResetParams" variant="danger" class="btn-cancel" >Cancelar</b-button>
        <b-button size="lg" @click="submitForm" variant="success" class="" >Enviar</b-button>
      </fieldset>
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
  </template>
  <div class="modal-info">
    <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>El interesado futuro comerciante / industrial o afín mayor de 18 años.</p>
    <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>El representante o apoderado/a de la persona interesada con documentación que acredite el carácter de tal.</p>
  </div>
</b-modal>
<b-modal v-model="showPopupApoderadoRepresentante" title="" :hide-footer="true" @click-outside="showPopupApoderadoRepresentante = false" :header-bg-variant="'success'"  centered>
  <template #modal-header>
    <div class="modal-info">
      <h5>
          <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
          Información Adicional
      </h5>
    </div>
  </template>
  <div class="modal-info popupApoderado">
    <h3>Representante o Apoderado/a</h3>
    <p class="destacado"><b-icon-caret-right-fill ></b-icon-caret-right-fill>Esta figura permite facultar a una persona para la realización de trámites, actos y gestiones en representación del/la contribuyente o responsable solicitante.</p>
    <h6>Casos de Representación:</h6>
    <p><span class="icon-orange">1) </span><b>Representante Voluntario:</b> Persona que actúa en nombre y por cuenta de otra, en virtud de la facultad que ella le confiere mediante un mandato (poder o autorización).</p>
    <p><span class="icon-orange">2) </span><b>Representante Legal:</b> Persona que actúa en nombre y por cuenta de una Persona Jurídica en virtud del carácter que posee por integrar los órganos de mando. Asimismo, los padres que ejercen la patria potestad sobre sus hijos/as.</p>
    <p><span class="icon-orange">3) </span><b>Representante Judicial:</b> Persona que actúa en nombre y por cuenta de otra (Humana o Jurídica) en virtud de una designación judicial, debido a una incapacidad legal que recae sobre aquella.</p>
    <p><span class="icon-orange">4) </span><b>Sucesiones Indivisas:</b> Casos en que, existiendo varios/as herederos/as, todos/as son propietarios/as de los bienes, pero aún no se ha realizado la división de los mismos en la proporción que cada uno/a tiene derecho a heredar.</p>
    <p><span class="icon-orange">5) </span><b>Herederos/as o Legatarios/as (Causahabientes):</b> Sucesor/a de una persona fallecida (actuación ante el Fisco previa al inicio de la sucesión o iniciada ésta, previa a la declaratoria de herederos/as).</p>
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
  </template>
  <div class="modal-info">
    <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>Podés consultar el número enviando un correo electrónico a <a href="mailto:catatro@gesell.gob.ar" target="_blank">catastro@gesell.gob.ar</a>, indicando nomenclatura catastral del bien que se encuentra en la escritura del mismo.</p>
  </div>
</b-modal>
<b-modal v-model="showPopupConstanciaCUIT" title="Constancia de CUIT" :hide-footer="true" @click-outside="showPopupConstanciaCUIT = false" :header-bg-variant="'success'"  centered>
  <template #modal-header>
    <div class="modal-info">
      <h5>
          <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
          Información Adicional
      </h5>
    </div>
  </template>
  <div class="modal-info">
    <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>Podes solicitar tu constancia de CUIT haciendo <a href="https://www.arba.gov.ar/GuiaTramites/TramiteSeleccionado.asp?tramite=582&categ=34" target="_blank" >click aquí</a>.</p>
  </div>
</b-modal>
<b-modal v-model="showPopupConstanciaIngresosBrutos" title="Constancia de Ingresos Brutos" :hide-footer="true" @click-outside="showPopupConstanciaIngresosBrutos = false" :header-bg-variant="'success'"  centered>
  <template #modal-header>
    <div class="modal-info">
      <h5>
          <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
          Información Adicional
      </h5>
    </div>
  </template>
  <div class="modal-info">
    <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>Podes solicitar tu constancia de Ingresos Brutos haciendo <a href="https://www.arba.gov.ar/GuiaTramites/TramiteSeleccionado.asp?tramite=582&categ=34" target="_blank" >click aquí</a>.</p>
  </div>
</b-modal>
<b-modal v-model="showPopupConstanciaLibreDeuda" title="Libre Deuda de Tasa por Servicios Urbanos" :hide-footer="true" @click-outside="showPopupConstanciaLibreDeuda = false" :header-bg-variant="'success'"  centered>
  <template #modal-header>
    <div class="modal-info">
      <h5>
          <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
          Información Adicional
      </h5>
    </div>
  </template>
  <div class="modal-info">
    <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>Podés descargar tu última factura haciendo <a href="https://arvige.gob.ar/lpagos" target="_blank" >click aquí</a>.</p>
    <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>En el encabezado de cada factura se indica si tu partida registra deuda o no lo hace. Hacé click en la imagen y verificá cómo se visualiza.</p>
    <div style="width: 100%">
      <a href="../../assets/ej-libredeuda.jpg" target="_blank"><img src="../../assets/ej-libredeuda.jpg" width="100%" height="fit-content" /></a>
    </div>
  </div>
</b-modal>
<b-modal v-model="showPopupCertificadoDomicilio" title="Certificado de domicilio Ingresos Brutos- Punto de Venta Villa Gesell" :hide-footer="true" @click-outside="showPopupCertificadoDomicilio = false" :header-bg-variant="'success'"  centered>
  <template #modal-header>
    <div class="modal-info">
      <h5>
          <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
          Información Adicional
      </h5>
    </div>
  </template>
  <div class="modal-info">
    <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>Podés solicitar tu Certificado de domicilio haciendo <a href="https://arvige.gob.ar/lpagos" target="_blank" >click aquí</a>.</p>
  </div>
</b-modal>
<b-modal v-model="showPopupPlano" title="" :hide-footer="true" @click-outside="showPopupPlano = false" :header-bg-variant="'success'"  centered>
  <template #modal-header>
    <div class="modal-info">
      <h5>
          <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
          Información Adicional
      </h5>
    </div>
  </template>  
  <div class="modal-info modal-plano">
    <div>
      <h6>Tipos de Plano para cargar</h6>
      <p><span class="icon-orange">1. </span>Plano Conforme a obra o Medición Aprobado.</p>
      <p><span class="icon-orange">2. </span>Plano Conforme a obra o Medición Registrado.</p>
    </div>
    <div class="parrafo">
      <h6>¿Cómo identificar los tipos de plano?</h6>
      <p><b-icon-check scale="1.25" class="icon-orange"></b-icon-check>Verificá el sello impuesto en la carátula de tu plano. Esta puede indicar: <i class="icon-green">Conforme a obra o Medición Aprobado o Conforme a obra o Medición Registrado.</i></p>
    </div>
    <div class="parrafo">
      <div style="width: 64%; display: inline-block; vertical-align:top;">
      <h6>¿Cómo digitalizar el plano?</h6>
        <p><b-icon-check scale="1.25" class="icon-orange"></b-icon-check>Sacá una <b>fotografía</b> de la <b>carátula</b>.</p>
        <p><b-icon-check scale="1.25" class="icon-orange"></b-icon-check>Podés ver un ejemplo haciendo click en la imagen. <i>Ahí te indicamos cómo identificar qué tipo de plano tenés.</i></p>
      </div>
      <div style="width: 35%; display: inline-block; max-width:165px; margin-top:1rem">
        <a href="../../assets/ej-plano.jpg" target="_blank"><img src="../../assets/ej-plano.jpg" width="100%" height="fit-content" /></a>
      </div>
    </div>
  </div>
</b-modal>
<b-modal v-model="showPopupFormLoading" title="" @click-outside="showPopupFormLoading = false" :header-bg-variant="'success'" hide-footer  centered>
  <template #modal-header>
    <h5 class="centeredContainer">Solicitud en Proceso</h5>
  </template>
  <div class="centeredContainer">
    <p class="popup-link">Tus archivos se están cargando.</p>
    <b-spinner variant="success" style="width: 3rem; height: 3rem;" label="Large Spinner" @click="showPopupFormLoading = false; openPopup('FormOk')"></b-spinner>
    <p>No cierres esta página</p>
  </div>
</b-modal>
<b-modal v-model="showPopupFormOk" title="" ok-only @click-outside="showPopupFormOk = false" :header-bg-variant="'success'" centered>
  <template #modal-header>
    <div class="centeredContainer"><h3>
        <b-icon icon="check-circle-fill" scale="1.5" variant="light" @click="showPopupFormOk = false; openPopup('FormError')"></b-icon>
    </h3></div>
  </template>
  <div class="centeredContainer">
    <p class="modal-subtitle">¡Tu solicitud ha sido enviada exitosamente!</p>
    <p class="">Tu número de tramite es:</p>
    <p class="modal-subtitle">HAB001</p>
    <p class="">En los próximos días recibirás un correo electrónico del Departamento Comercio Municipal en el que te indicarán cómo continuar el trámite.</p>
    <p class=""><b>Tu número de trámite es: </b> </p>
    <p class="h3"> <b> {{ nroTramite }} </b> </p>
    <p class="">Por favor, conservá este número. Será solicitado más adelante. </p>
  </div>
  <template #modal-footer> 
    <div class="" style="margin: auto">   
      <b-button @click="cancelForm" class="btn-cancel">Volver</b-button>
      <b-button @click="onPrintTicket">Imprimir</b-button>
    </div>
  </template>
</b-modal>
<b-modal v-model="showPopupFormError" title="Error en el envío!" @click-outside="showPopupFormError = false" :header-bg-variant="'danger'" centered>
  <template #modal-header>
    <div class="centeredContainer"><h3>
        <b-icon-exclamation-octagon scale="1.5" variant="light"></b-icon-exclamation-octagon>
    </h3></div>
  </template>
  <div class="centeredContainer modal-error">
    <p class="modal-subtitle">No hemos podido procesar tu solicitud</p>
    <p class="">Por favor, verificá tu conexión a internet e intentalo nuevamente más tarde.</p>
    <p class="minitext">Si el problema persiste, comunicate con <a target="_blank" href="mailto:arvige@gesell.gob.ar" class="external-link">arvige@gesell.gob.ar</a> para que podamos ayudarte.</p>
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
  import rubros from "@/plugins/rubros.js";

export default {
  data:function() {
      return {
      listaRubros: rubros,
      rubroSeleccionado: {
        id: null,
        nombre: null,
        descripcion: null,
        especiales: [],
        links: [],
        requisitos: [],
        pom: null,
        inspeccion: false,
        croquis: false,
      },
      rubrosHoteleria:[136,137,138,139,140,141,142,143,144,145],
      isHoteleria: false,    
      nroTramite: null,
      solicitante: {
        tipoSolicitud: 'Habilitación',
        nombre: '',
        apellido: '',
        DNI: '',
        cuit: '',
        razonSocial: '',
        domicilioReal: '',
        telefono: '',
        codigoPostal: '',
        localidad: '',
        provincia: '',
        mail: '',
        esApoderado: false,
        esPersonaJuridica: false,
      },
      inmueble: {
        localidad: '',
        calle: '',
        nro: null,
        nroLocal: null,
        nombreFantasia: '',
        rubro: null,
        espacioPublico: false,
        marquesina: false,
        mercaderia: false,
        mesas: false,
        carteles: false,
        otrosServicios: '',
        serviciosHoteleria: [
          { id: "1", nombre: "Servicio de Mucama-Ropa Blanca", value: false},
          { id: "2", nombre: "Desayuno", value: false},
          { id: "3", nombre: "Restaurante - Bar", value: false},
          { id: "4", nombre: "Gimnasio", value: false},
          { id: "5", nombre: "Piletas de Natación", value: false},
          { id: "6", nombre: "Spa", value: false},
          { id: "7", nombre: "Estacionamiento dentro del predio", value: false},
          { id: "8", nombre: "TV-Electrodomésticos", value: false},
          { id: "9", nombre: "Ventiladores y/o Aire Acondicionado", value: false},
          { id: "10", nombre: "Calefacción", value: false},
          { id: "11", nombre: "WI FI y/o Internet", value: false},
          { id: "12", nombre: "Otros", value: false}
        ],
      },
      documentos: {
        planillaAutorizacion: null,
        dniFrente: null,
        dniDorso: null,
        constanciaCuit: null,
        constanciaIngresosBrutos: null,
        actaPersonaJuridica: null,
        actaDirectorio: null,
        libreDeudaUrbana: null,
        tituloPropiedad: null,
        certificadoDomicilio: null,
        plano: null,
        croquis: null,
      },
      formFieldStates: {
        planillaAutorizacion: null,
        dniFrente: null,
        dniDorso: null,
        constanciaCuit: null,
        constanciaIngresosBrutos: null,
        actaPersonaJuridica: null,
        actaDirectorio: null,
        libreDeudaUrbana: null,
        tituloPropiedad: null,
        certificadoDomicilio: null,
        plano: null,
        croquis: null,
      },
      captchaResponse: null,
      showPopupDatosDelSolicitante: false,
      showPopupApoderadoRepresentante: false,
      showPopupNroInmueble: false,
      showPopupConstanciaIngresosBrutos: false,
      showPopupConstanciaCUIT: false,
      showPopupConstanciaLibreDeuda: false,
      showPopupCertificadoDomicilio: false,
      showPopupPlano: false,
      showPopupFormOk: false,
      showPopupFormLoading: false,
      showPopupFormError: false,
      printing: false,
      endButton: false,
      }
  },
  mounted() {
    //ORDENAR listaRubros antes de mostrarla.
    this.listaRubros.sort((a, b) => a.nombre.localeCompare(b.nombre));
    //CAMBIAR EL SITEKEY POR UNO DE VERDAD
    grecaptcha.ready(() => {
    grecaptcha.render('captchaContainer', {
      sitekey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
      });
    });
  },
  methods: {
    openPopup(type) {
      // Lógica para abrir el popup correspondiente según el tipo (A, B, C, D)else if (type === 'B')
      if (type === 'DatosDelSolicitante') {
        console.log("ShowPopup DatosDelSolicitante")
        this.showPopupDatosDelSolicitante = true;
      } else if (type === 'ApoderadoRepresentante') {
        console.log("ShowPopup ApoderadoRepresentante")
        this.showPopupApoderadoRepresentante = true;
      } else if (type === 'NroInmueble') {
        this.showPopupNroInmueble = true;
      } else if (type === 'ConstanciaIngresosBrutos') {
        this.showPopupConstanciaIngresosBrutos = true;
      } else if (type === 'ConstanciaCUIT') {
        this.showPopupConstanciaCUIT = true;
      } else if (type === 'ConstanciaLibreDeuda') {
        this.showPopupConstanciaLibreDeuda = true;
      } else if (type === 'certificadoDomicilio') {
        this.showPopupCertificadoDomicilio = true;
      } else if (type === 'plano') {
        this.showPopupPlano = true;
      } else if (type === 'FormLoading') {
        this.showPopupFormLoading = true;
      } else if (type === 'FormOk') {
        this.showPopupFormLoading = false
        this.showPopupFormOk = true
      } else if (type === 'FormError') {
        this.showPopupFormLoading = false
        this.showPopupFormError = true
      }
    },
    onResetParams() {
      this.solicitante = null;
      this.inmueble = null;
      this.documentos = null;
      this.formFieldStates = null;
      this.$router.push('/comercio/');
    },
    cancelForm(){
      console.log("CANCEL FORM");
    },
    async submitForm() {
      try {

        this.openPopup('FormLoading');
        const documentosParaGuardar = {};

        // Recorrer los campos en this.documentos
        for (const campo in this.documentos) {
          const documento = this.documentos[campo];

          if (documento instanceof Blob) {
            // Verificar que el campo sea un Blob válido (archivo PDF seleccionado)
            const fileBlob = new Blob([documento], { type: documento.type });

            // Agregar el archivo PDF a documentosParaGuardar
            documentosParaGuardar[campo] = {
              data: await this.blobToBase64(fileBlob),
              contentType: documento.type,
            };
          }
        }

        const habilitacion = {
          documentos: documentosParaGuardar,
          solicitante: this.solicitante,
          inmueble: this.inmueble,
        };
        // habilitacion.nroTramite = nroTramite
        const response = await this.$store.dispatch('habilitaciones/create', {
          habilitacion,
        });
        console.log(response.data)
        this.nroTramite = response.data
        this.openPopup('FormOk');
      } catch (e) {
        this.openPopup('FormError');
      }
    },
    onFinalizar(){
      this.$router.push('/')
      this.showPopupFormOk = false
      this.onResetParams()
    },
    onResetParams(){
      this.nroTramite = null
      this.solicitante.tipoSolicitud = 'habilitacion'
      this.solicitante.nombre = ''
      this.solicitante.apellido = ''
      this.solicitante.DNI = ''
      this.solicitante.cuit = ''
      this.solicitante.razonSocial = ''
      this.solicitante.domicilioReal = ''
      this.solicitante.telefono = ''
      this.solicitante.codigoPostal = ''
      this.solicitante.localidad = ''
      this.solicitante.provincia = ''
      this.solicitante.mail = ''
      this.solicitante.esApoderado = false
      this.solicitante.esPersonaJuridica = false

      this.inmueble.localidad = ''
      this.inmueble.calle = ''
      this.inmueble.nro = null
      this.inmueble.nroLocal = null
      this.inmueble.nombreFantasia = ''
      this.inmueble.rubro = null
      this.inmueble.espacioPublico = false
      this.inmueble.marquesina = false
      this.inmueble.mercaderia = false
      this.inmueble.mesas = false
      this.inmueble.carteles = false
      this.inmueble.otrosServicios = ''

      this.documentos.planillaAutorizacion = null
      this.documentos. dniFrente = null
      this.documentos.dniDorso = null
      this.documentos.constanciaCuit = null
      this.documentos.constanciaIngresosBrutos = null
      this.documentos.actaPersonaJuridica = null
      this.documentos.actaDirectorio = null
      this.documentos.libreDeudaUrbana = null
      this.documentos.tituloPropiedad = null
      this.documentos.certificadoDomicilio = null
      this.documentos.plano = null
      this.documentos.croquis = null

      this.showPopupDatosDelSolicitante = false
      this.showPopupApoderadoRepresentante = false
      this.showPopupNroInmueble = false
      this.showPopupConstanciaIngresosBrutos = false
      this.showPopupConstanciaCUIT = false
      this.showPopupConstanciaLibreDeuda = false
      this.showPopupCertificadoDomicilio = false
      this.showPopupPlano = false
      shis.showPopupFormOk = false
      this.showPopupFormLoading = false
      this.showPopupFormError = false
    },    
    handleRubroChange() {
      if (this.inmueble.rubro != null) {
      // Obtener los datos correspondientes al rubro seleccionado
      const i = this.listaRubros.findIndex(rubro => rubro.nombre === this.inmueble.rubro);
      this.rubroSeleccionado.id = this.listaRubros[i].id;
      this.rubroSeleccionado.nombre = this.listaRubros[i].nombre;
      this.rubroSeleccionado.descripcion = this.listaRubros[i].descripcion;
      this.rubroSeleccionado.especiales = this.listaRubros[i].especiales;
      this.rubroSeleccionado.links = this.listaRubros[i].links;
      this.rubroSeleccionado.requisitos = this.listaRubros[i].requisitos;
      this.rubroSeleccionado.pom = this.listaRubros[i].pom;
      this.rubroSeleccionado.inspeccion = this.listaRubros[i].inspeccion;
      this.rubroSeleccionado.croquis = this.listaRubros[i].croquis;
      this.isHoteleria = this.rubrosHoteleria.includes(this.rubroSeleccionado.id);
      } else {
        // Si no se ha seleccionado ninguna opción, reiniciar las propiedades
        this.rubroSeleccionado.id = null;
        this.rubroSeleccionado.nombre = null;
        this.rubroSeleccionado.descripcion = null;
        this.rubroSeleccionado.especiales = [];
        this.rubroSeleccionado.links = [];
        this.rubroSeleccionado.requisitos = [];
        this.rubroSeleccionado.pom = null;
        this.rubroSeleccionado.inspeccion = false;
        this.rubroSeleccionado.croquis = false;
        this.rubroSeleccionado.isHoteleria = false;
      }
    },
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
      // Aquí puedes agregar la lógica para enviar el formulario
      // Hacer popup
      //CAMBIAR EL SITEKEY POR UNO DE VERDAD
      //grecaptcha.execute('6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', { action: 'submit' }).then((token) => {
      // this.captchaResponse = token;
        // Lógica adicional para enviar el formulario
      //});
    // Función para manejar la actualización de documentos genéricamente
    handleDocumentUpdate(fieldName) {
      const documento = this.documentos[fieldName];

      if (documento instanceof Blob) {
        // Verificar que el campo sea un Blob válido (archivo PDF o imagen seleccionado)
        const fileBlob = new Blob([documento], { type: documento.type });

        // Agregar el archivo PDF o imagen a documentosParaGuardar
        this.documentosParaGuardar[fieldName] = {
          name: documento.name,
          contentType: documento.type,
          file: fileBlob,
        };
      }
    },
     getFormFieldState(fieldName) {
      return this.formFieldStates[fieldName];
    },
    clearFormFieldState(fieldName) {
      this.formFieldStates[fieldName] = null;
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
  }
}
</script>

<style scoped>
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
  color: #0c681a !important;
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
.popup-link {
  color: #0c681a;
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
</style>
