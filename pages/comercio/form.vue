<template>
<div class="page">
    <Banner title="Habilitaciones comerciales" />

  <b-form @submit="submitForm" class="my-3" style="margin-left:10px;margin-right:10px">

  <b-card no-body class="col-8 mt-1 shadow-lg "  style="margin: 0px auto">
    <!-- Sección: Datos del solicitante -->
    <fieldset >
      <legend><h3>Datos del solicitante <b-icon-question-circle-fill @click="openPopup('DatosDelSolicitante')" font-scale="0.75" variant="info"></b-icon-question-circle-fill></h3></legend>
      <b-form-group label="Tipo de Solicitud *" label-for="tipo-solicitud" >
        <b-form-select title="Por el momento solo se pueden solicitar habilitaciones comerciales." id="tipo-solicitud" v-model="solicitante.tipoSolicitud" disabled required>
            <b-form-select-option selected="selected" value="habilitacion">Habilitar nuevo comercio</b-form-select-option>
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
          <b-form-group label="CUIT o CUIL *" label-for="cuit" >
            <b-form-input id="cuit" v-model="solicitante.cuit" required></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group label="Razón Social (completar sólo si se trata de una Persona Jurídica)" label-for="razon-social" >
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
      <b-col md="5">
        <h5>¿Sos apoderado/representante? <b-icon-question-circle-fill @click="openPopup('ApoderadoRepresentante')" font-scale="1" variant="info"></b-icon-question-circle-fill></h5>
      </b-col>
      <b-form-group label="" label-for="esApoderado" style="margin:auto 0">
        <div class="form-check-inline">
          <b-col md="3">
            <b-form-radio  id="esApoderado-no" v-model="solicitante.esApoderado" name="radio-esApoderado" checked="checked" value="false"> No</b-form-radio>
          </b-col>
          <b-col md="3">
            <b-form-radio  id="esApoderado-si" v-model="solicitante.esApoderado" name="radio-esApoderado" value="true"> Si</b-form-radio>
          </b-col>
        </div>
      </b-form-group>
    </b-row>
    <!-- Sección: Datos del Apoderado -->
    <fieldset v-if="solicitante.esApoderado === 'true'">
        <p>Al finalizar, deberás subir la Planilla de Autorización de Trámite que te solicitamos que completes previamente (ítem ¿Qué necesito para iniciar el trámite).</p>

      <b-form-group v-if="solicitante.esApoderado === 'true'" label="Planilla de Autorización de trámite *" label-for="documentos.planillaAutorizacion" >
        <b-form-file v-model="documentos.planillaAutorizacion" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('planillaAutorizacion')" @input="clearFormFieldState('planillaAutorizacion')"></b-form-file>
      </b-form-group>
    </fieldset>
  </b-card>
  <b-card no-body class="col-8 mt-1 shadow-lg "  style="margin: 0px auto">
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
            <b-form-select v-model="inmueble.rubro" :options="listaRubros" value-field="nombre" text-field="nombre" >
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
            <label for="direccion-inmbueble-nro" class="rubro-label">Numero <b-icon-question-circle-fill @click="openPopup('NroInmueble')" font-scale="1" variant="info"></b-icon-question-circle-fill></label>
            <b-form-input id="direccion-inmbueble-nro" v-model="inmueble.nro" type="number" required></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="2">
          <b-form-group label="Nro Local" label-for="direccion-inmueble-calle2" >
            <b-form-input id="direccion-inmueble-calle2" v-model="inmueble.nroLocal" required></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group label="Nombre de Fantasía (En caso de que lo posea)" label-for="nombre-fantasia" >
        <b-form-input id="nombre-fantasia" v-model="inmueble.nombreFantasia"></b-form-input>
      </b-form-group>
    <fieldset  v-if="inmueble.rubro === 'Hotelería'" key="rubro-146">
      <legend><h5>Servicios exclusivos del rubro HOTELERIA *</h5></legend>
      <p>Seleccioná los servicios que brinda tu establecimiento:</p>

        <b-form-group>
        <b-form-checkbox v-for="servicio in inmueble.serviciosHoteleria" :key="servicio.id" :id="`servicio${servicio.id}`" :name="`servicio${servicio.id}`" v-model="servicio.value" scale=1.5 >
          {{ servicio.nombre }}
        </b-form-checkbox>

      </b-form-group>
      <b-form-group v-if="serviciosHoteleria[11].value === true" label="Contanos que otros servicios brinda tu establecimiento: " label-for="otrosServicios" >
        <b-form-textarea id="otrosServicios" v-model="inmueble.otrosServicios" rows="2" max-rows="4" type="text" required></b-form-textarea>
      </b-form-group>
<!--
      <b-button size="lg" @click="loguearServicios" variant="primary" class="float-right">Loguear</b-button>
 -->
    </fieldset>
    
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
                  <b-form-radio  id="espaciopublico-si" v-model="inmueble.espacioPublico" name="radio-espacio" value="true"> Si</b-form-radio>
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
  <b-card no-body class="col-8 mt-1 shadow-lg " style="margin: 0px auto">
    <fieldset >
      <legend><h3>Carga de Documentación</h3></legend>
      <p>Aquí deberás cargar los documentos requeridos previamente. Tené en cuenta que deben ser <i>legibles</i>, estar subidos en <i>formato de imagen ó pdf</i> y tener un <i>peso máximo de 15 mb</i>.</p>
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
      <b-form-group label="Constancia de CUIT *" label-for="constanciaCuit" >
        <b-form-file v-model="documentos.constanciaCuit" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('constanciaCuit')" @change="handleDocumentUpdate('constanciaCuit')" @input="clearFormFieldState('constanciaCuit')"></b-form-file>
      </b-form-group>
      <b-form-group>
        <label for="constanciaIngresosBrutos" class="rubro-label">Constancia de inscripción a ingresos brutos * <b-icon-question-circle-fill @click="openPopup('ConstanciaIngresosBrutos')" font-scale="1" variant="info"></b-icon-question-circle-fill></label>
        <b-form-file v-model="documentos.constanciaIngresosBrutos" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('constanciaIngresosBrutos')" @change="handleDocumentUpdate('constanciaIngresosBrutos')" @input="clearFormFieldState('constanciaIngresosBrutos')"></b-form-file>
      </b-form-group>
      <b-form-group label="Acta de Constitución de Persona Jurídica *" label-for="actaPersonaJuridica" >
        <b-form-file v-model="documentos.actaPersonaJuridica" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('actaPersonaJuridica')" @change="handleDocumentUpdate('actaPersonaJuridica')" @input="clearFormFieldState('actaPersonaJuridica')"></b-form-file>
      </b-form-group>
      <b-form-group label="Acta de Directorio Actualizada *" label-for="actaDirectorio" >
        <b-form-file v-model="documentos.actaDirectorio" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('actaDirectorio')" @change="handleDocumentUpdate('actaDirectorio')" @input="clearFormFieldState('actaDirectorio')"></b-form-file>
      </b-form-group>
      <b-form-group label="Libre Deuda de Tasa Urbana *" label-for="libreDeudaUrbana" >
        <b-form-file v-model="documentos.libreDeudaUrbana" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('libreDeudaUrbana')" @change="handleDocumentUpdate('libreDeudaUrbana')" @input="clearFormFieldState('libreDeudaUrbana')"></b-form-file>
      </b-form-group>
      <b-form-group label="Título de propiedad / contrato de locación / Otro *" label-for="tituloPropiedad" >
        <b-form-file v-model="documentos.tituloPropiedad" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" multiple required :state="getFormFieldState('tituloPropiedad')" @change="handleDocumentUpdate('tituloPropiedad')" @input="clearFormFieldState('tituloPropiedad')"></b-form-file>
      </b-form-group>
      <b-form-group label="PLANO *" label-for="plano" >
        <b-form-file v-model="documentos.plano" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('plano')" @change="handleDocumentUpdate('plano')" @input="clearFormFieldState('plano')"></b-form-file>
      </b-form-group>
    </fieldset>
    <b-form-group>
      <div id="captchaContainer" class="float-right"></div>
    </b-form-group>
    <fieldset>
      <input type="hidden" id="captchaResponse" name="captchaResponse" v-model="captchaResponse">
      <b-button size="lg" @click="cancelForm" variant="danger" class="float-left">Cancelar</b-button>
      <b-button size="lg" @click="submitForm" variant="primary" class="float-right">Enviar</b-button>
    </fieldset>
  </b-card>
  </b-form>
<!-- PopUps -->

<b-modal v-model="showPopupDatosDelSolicitante" title="Datos del Solicitante" :hide-footer="true" @click-outside="showPopupDatosDelSolicitante = false" centered>
  <p>El interesado futuro comerciante / industrial o afín mayor de 18 años</p>
</b-modal>
<b-modal v-model="showPopupApoderadoRepresentante" title="Representante, Apoderado o Mandatario:" :hide-footer="true" @click-outside="showPopupApoderadoRepresentante = false" centered>
  <p>Permite facultar a una persona para la realización de trámites, actos y gestiones, en representación del/la contribuyente o responsable solicitante.</p>
  <h5 class="modal-title">Casos de Representacón:</h5>
  <ol>
    <li><b>REPRESENTANTE VOLUNTARIO:</b> Persona que actúa en nombre y por cuenta de otra, en virtud de la facultad que ella le confiere mediante un mandato (poder o autorización).</li>
    <li><b>REPRESENTANTE LEGAL:</b> Persona que actúa en nombre y por cuenta de una persona Jurídica en virtud del carácter que posee por integrar los órganos de mando. Asimismo, los padres que ejercen la patria potestad sobre sus hijos/as.</li>
    <li><b>REPRESENTANTE JUDICIAL:</b> Persona que actúa en nombre y por cuenta de otra (Humana o Jurídica) en virtud de una designación judicial, debido a una incapacidad legal que recae sobre aquella.</li>
    <li><b>SUCESIONES INDIVISAS:</b> Casos en que, existiendo varios/as herederos/as, todos/as son propietarios/as de los bienes, pero aún no se ha realizado la división de los mismos en la proporción que cada uno/a tiene derecho a heredar.</li>
    <li><b>HEREDEROS/AS O LEGATARIOS/AS (Causahabientes):</b> Sucesor/a de una persona fallecida (actuación ante el Fisco previa al inicio de la sucesión o iniciada esta, previa a la declaratoria de herederos/as).</li>
  </ol>
</b-modal>
<b-modal v-model="showPopupNroInmueble" title="Numeración del Inmueble" :hide-footer="true" @click-outside="showPopupNroInmueble = false" centered>
  <p>Si no sabes el número de tu inmueble, contactate con la oficina de catastro.</p>
</b-modal>
<b-modal v-model="showPopupConstanciaIngresosBrutos" title="Constancia de Ingresos Brutos" :hide-footer="true" @click-outside="showPopupConstanciaIngresosBrutos = false" centered>
  <p>Lorem ipsum dolor </p>
</b-modal>
<b-modal v-model="showPopupFormOk" title="" ok-only @click-outside="showPopupFormOk = false" centered>
  <template #modal-header>
    <div><h3>
        <b-icon icon="trophy" scale="1.5" variant="warning" style="margin: 0 20px 0 10px"></b-icon>
        <b>Formulario Enviado!</b>
    </h3></div>
  </template>
  <p>Gracias por usar el sistema de habilitaiones online de la municipalidad de VG. Durante los proximos dias revisaremos tu solicitud y nos comunicaremos a traves del correo electronico que brindaste en el formulario: {{ solicitante.mail }}</p>
</b-modal><b-modal v-model="showPopupFormError" title="Formulario Enviado!" @click-outside="showPopupFormOk = false" centered>
  <p>Gracias por usar el sistema de habilitaiones online de la municipalidad de VG. Durante los proximos dias revisaremos tu solicitud y nos comunicaremos a traves del correo electronico que brindaste en el formulario: {{ solicitante.mail }}</p>
</b-modal>


</div>
</template>

<script>
  import rubros from "@/plugins/rubros.js";

export default {
  data() {
      return {
      listaRubros: rubros,

      solicitante: {
        tipoSolicitud: 'habilitacion',
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
        plano: null,
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
        plano: null,
      },
      captchaResponse: null,
      showPopupDatosDelSolicitante: false,
      showPopupApoderadoRepresentante: false,
      showPopupNroInmueble: false,
      showPopupConstanciaIngresosBrutos: false,
      showPopupFormOk: false,
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
    loguearServicios(){
      console.log("Servicios Hoteleria");
      console.log(this.serviciosHoteleria[0].id + ": " + this.serviciosHoteleria[0].value);
      console.log(this.serviciosHoteleria[1].id + ": " + this.serviciosHoteleria[1].value);
      console.log(this.serviciosHoteleria[2].id + ": " + this.serviciosHoteleria[2].value);
      console.log(this.serviciosHoteleria[3].id + ": " + this.serviciosHoteleria[3].value);
      console.log(this.serviciosHoteleria[4].id + ": " + this.serviciosHoteleria[4].value);
      console.log(this.serviciosHoteleria[5].id + ": " + this.serviciosHoteleria[5].value);
      console.log(this.serviciosHoteleria[6].id + ": " + this.serviciosHoteleria[6].value);
      console.log(this.serviciosHoteleria[7].id + ": " + this.serviciosHoteleria[7].value);
      console.log(this.serviciosHoteleria[8].id + ": " + this.serviciosHoteleria[8].value);
      console.log(this.serviciosHoteleria[9].id + ": " + this.serviciosHoteleria[9].value);
      console.log(this.serviciosHoteleria[10].id + ": " + this.serviciosHoteleria[10].value);
      console.log(this.serviciosHoteleria[11].id + ": " + this.serviciosHoteleria[11].value);

      console.log("this.inmueble.espacioPublico: " + this.inmueble.espacioPublico);
      console.log("this.inmueble.marquesina: " + this.inmueble.marquesina);
      console.log("this.inmueble.mercaderia: " + this.inmueble.mercaderia);
      console.log("this.inmueble.mesas: " + this.inmueble.mesas);
      console.log("this.inmueble.carteles: " + this.inmueble.carteles);
    },
    openPopup(type) {
      // Lógica para abrir el popup correspondiente según el tipo (A, B, C, D)else if (type === 'B')
      console.log('openPopup');
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
      } else if (type === 'FormOk') {
        this.showPopupFormOk = true;
      }
    },
    async submitForm() {
      try {
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
        const userToken = this.$store.state.user.token;
        await this.$store.dispatch('habilitaciones/create', {
          habilitacion,
          userToken,
        });

        this.openPopup('FormOk');
      } catch (e) {
        this.$bvToast.toast('No se pudo procesar la solicitud.', {
          solid: true,
          variant: 'danger',
          appendToast: true,
          toaster: 'b-toaster-top-center',
        });
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
  }
}
</script>

<style>
  .btn{
    padding: 0.5rem 3rem;
  }
  form .card{
    margin-top: 20px !important;
    padding: 20px;
    border-radius: 1rem;
  }
  form p{
     font-weight: 600;
     color: #666;
  }
  h3{
    font-weight: bold;
    color: green !important;
    margin: 15px 0;
  }
  h5{
    padding-top: 15px;
    color: green !important;
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
  color: green;
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
