<template>
<div class="page">
    <Banner title="Habilitaciones comerciales" />
    
  <b-form @submit="submitForm" class="my-3" style="margin-left:10px;margin-right:10px"> 
    
  <b-card no-body class="col-8 mt-1 shadow-lg "  style="margin: 0px auto">
    <!-- Sección: Datos del Solicitante -->
    <fieldset >
      <legend><h3>Datos del Solcitante <b-icon-question-circle-fill @click="openPopup('DatosDelSolicitante')" font-scale="0.75" variant="info"></b-icon-question-circle-fill></h3></legend>  
      <b-form-group label="Tipo de Solicitud *" label-for="tipo-solicitud" >
        <b-form-select title="Por el momento solo se pueden solicitar habilitaciones comerciales." id="tipo-solicitud" v-model="contact.tipoSolicitud" disabled required>
            <b-form-select-option selected="selected" value="habilitar">Habilitar nuevo comercio</b-form-select-option>
        </b-form-select>
      </b-form-group>      
      
    </fieldset>
    <!-- Sección: Datos del titular -->
    <fieldset >   
      <b-row>
      <b-col md="6">
          <b-form-group label="Nombre *" label-for="nombreTitular" >
            <b-form-input id="nombreTitular" v-model="titular.nombre" required></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Apellido *" label-for="apellidoTitular" >
            <b-form-input id="apellidoTitular" v-model="titular.apellido" required></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>      
      <b-row>
        <b-col md="6">
          <b-form-group label="DNI/Pasaporte *" label-for="DNITitular" >
            <b-form-input id="DNITitular" v-model="titular.DNI" required></b-form-input>
          </b-form-group>
        </b-col>        
        <b-col md="6">
          <b-form-group label="CUIT o CUIL *" label-for="cuit-cuil" >
            <b-form-input id="cuit-cuil" v-model="titular.cuitCuil" required></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group label="Razón Social (completar sólo si se trata de una Persona Jurídica)" label-for="razon-social" >
        <b-form-input id="razon-social" v-model="titular.razonSocial" ></b-form-input>
      </b-form-group>      
      <b-form-group label="Domicilio Real y/o Legal *" label-for="domicilio-real" >
        <b-form-input id="domicilio-real" v-model="titular.domicilioReal" required></b-form-input>
      </b-form-group>
      <b-row>
        <b-col md="10">
          <b-form-group label="Teléfono *" label-for="telefonoTitular" >
            <b-form-input id="telefonoTitular" v-model="titular.telefono"  type="tel" no-wheel ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="2">
          <b-form-group label="Código Postal *" label-for="codigoPostal" >
            <b-form-input id="codigoPostal" v-model="titular.codigoPostal" type="number" required></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group label="Localidad *" label-for="localidadTitular" >
            <b-form-input id="localidadTitular" v-model="titular.localidad" required></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="6">          
          <b-form-group label="Provincia *" label-for="provincia" >
            <b-form-input id="provincia" v-model="titular.provincia" required></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group label="Correo Electrónico *" label-for="mail" >
        <b-form-input id="mail" v-model="titular.mail" type="email" required></b-form-input>
      </b-form-group>
    </fieldset>      
    <b-row>
      <b-col md="5">  
        <h5>¿Sos apoderado/representante? <b-icon-question-circle-fill @click="openPopup('ApoderadoRepresentante')" font-scale="1" variant="info"></b-icon-question-circle-fill></h5>   
      </b-col>
      <b-form-group label="" label-for="datosDelTitular" style="margin:auto 0">   
        <div class="form-check-inline">
          <b-col md="3">
            <b-form-radio  id="datosDelTitular-no" v-model="datosDelTitular" name="radio-datosDelTitular" checked="checked" value="false"> No</b-form-radio>
          </b-col>
          <b-col md="3">
            <b-form-radio  id="datosDelTitular-si" v-model="datosDelTitular" name="radio-datosDelTitular" value="true"> Si</b-form-radio>
          </b-col> 
        </div>
      </b-form-group>
    </b-row>
    <!-- Sección: Datos del Apoderado -->
    <fieldset v-if="datosDelTitular === 'true'">   
        <p>Al finalizar, deberás subir la Planilla de Autorización de Trámite que te solicitamos que completes previamente (ítem ¿Qué necesito para iniciar el trámite).</p>
      
      <b-form-group v-if="datosDelTitular === 'true'" label="Planilla de Autorización de trámite *" label-for="planillaAutorizacion" >
        <b-form-file v-model="planillaAutorizacion" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('planillaAutorizacion')" @input="clearFormFieldState('planillaAutorizacion')"></b-form-file>
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
            <b-form-select v-model="rubroSeleccionado" :options="listaRubros" value-field="id" text-field="nombre" >
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="8">
          <b-form-group label="Calle *" label-for="direccion-inmueble-calle" >
            <b-form-input id="direccion-inmueble-calle" v-model="inmueble.direccion" required></b-form-input>
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
            <b-form-input id="direccion-inmueble-calle2" v-model="inmueble.direccion2" required></b-form-input>
          </b-form-group>  
        </b-col>   
      </b-row> 
      <b-form-group label="Nombre de Fantasía (En caso de que lo posea)" label-for="nombre-fantasia" >
        <b-form-input id="nombre-fantasia" v-model="inmueble.nombreFantasia"></b-form-input>
      </b-form-group>    
    <fieldset  v-if="rubroSeleccionado === 146" key="rubro-146">
      <legend><h5>Servicios exclusivos del rubro HOTELERIA *</h5></legend>
      <p>Seleccioná los servicios que brinda tu establecimiento:</p>
      
        <b-form-group>
        <b-form-checkbox v-for="servicio in servicios" :key="servicio" :id="`servicio${servicio.id}`" :name="`servicio${servicio.id}`" v-model="inmueble.serviciosSeleccionados" :value="servicio.id" scale=1.5 >
          {{ servicio.nombre }}
        </b-form-checkbox>
      </b-form-group>
     <!--
        <template v-for="servicio in servicios">              
          <b-form-group :key="servicio.id" v-model="inmueble.servicios" style="margin-bottom: 0">
            <b-row style="border-bottom: 1px solid #EEE">
              <b-col md="6">  
                <label>{{ servicio.nombre }}: </label>
              </b-col>              
              <div class="form-check-inline">
                <b-col md="3">
                  <b-form-radio :checked="servicio.id.value === 'false'" :value="false" :key="`servicio${servicio.id}-no`" :name="`radio-servicio${servicio.id}`" > No </b-form-radio>
                </b-col>
                <b-col md="3">
                  <b-form-radio :key="`servicio${servicio.id}-si`" :value="true" :name="`radio-servicio${servicio.id}`" > Si </b-form-radio>
                </b-col>
              </div>
            </b-row>
          </b-form-group>
        </template>
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
    <fieldset v-if="inmueble.espacioPublico">
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
          <b-form-group label="DNI (Frente) *" label-for="dniFrente" >
            <b-form-file v-model="dniFrente" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('dni')" @input="clearFormFieldState('dni')"></b-form-file>
          </b-form-group>
        </b-col>
        <b-col md="6">  
          <b-form-group label="DNI (Dorso) *" label-for="dniDorso" >
            <b-form-file v-model="dniDorso" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('dni')" @input="clearFormFieldState('dni')"></b-form-file>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group label="Constancia de CUIT *" label-for="constanciaCuit" >
        <b-form-file v-model="constanciaCuit" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('constanciaCuit')" @input="clearFormFieldState('constanciaCuit')"></b-form-file>      
      </b-form-group>
      <b-form-group>
        <label for="constanciaIngresosBrutos" class="rubro-label">Constancia de inscripción a ingresos brutos * <b-icon-question-circle-fill @click="openPopup('ConstanciaIngresosBrutos')" font-scale="1" variant="info"></b-icon-question-circle-fill></label>   
        <b-form-file v-model="constanciaIngresosBrutos" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('constanciaIngresosBrutos')" @input="clearFormFieldState('constanciaIngresosBrutos')"></b-form-file>      
      </b-form-group>
      <b-form-group label="Acta de Constitución de Persona Jurídica *" label-for="actaPersonaJuridica" >
        <b-form-file v-model="actaPersonaJuridica" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('actaPersonaJuridica')" @input="clearFormFieldState('actaPersonaJuridica')"></b-form-file>      
      </b-form-group>
      <b-form-group label="Acta de Directorio Actualizada *" label-for="actaDirectorio" >
        <b-form-file v-model="actaDirectorio" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('actaDirectorio')" @input="clearFormFieldState('actaDirectorio')"></b-form-file>      
      </b-form-group>
      <b-form-group label="Libre Deuda de Tasa Urbana *" label-for="libreDeudaUrbana" >
        <b-form-file v-model="libreDeudaUrbana" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('libreDeudaUrbana')" @input="clearFormFieldState('libreDeudaUrbana')"></b-form-file>
      </b-form-group>      
      <b-form-group label="Título de propiedad / contrato de locación / Otro *" label-for="tituloPropiedad" >
        <b-form-file v-model="tituloPropiedad" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" multiple required :state="getFormFieldState('tituloPropiedad')" @input="clearFormFieldState('tituloPropiedad')"></b-form-file>
      </b-form-group>
      <b-form-group label="PLANO *" label-for="plano" >
        <b-form-file v-model="plano" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('plano')" @input="clearFormFieldState('plano')"></b-form-file>
      </b-form-group>
    </fieldset>
    <b-form-group>
      <div id="captchaContainer" class="float-right"></div>
    </b-form-group>
    <fieldset>
      <input type="hidden" id="captchaResponse" name="captchaResponse" v-model="captchaResponse">
      <b-button size="lg" type="submit" variant="primary" class="float-right">Enviar</b-button>
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


</div>
</template>

<script>
  import rubros from "@/plugins/rubros.js";
  
export default {
  data() {
      return {  
      listaRubros: rubros,
      showPopupDatosDelSolicitante: false,
      showPopupApoderadoRepresentante: false,
      showPopupNroInmueble: false,
      showPopupConstanciaIngresosBrutos: false,
      showPopupformOk: false,
      rubroSeleccionado: null,
      dni: null,
      constanciaCuit: null,
      libreDeuda: null,
      tituloPropiedad: null,
      planillaAutorizacion: null,
      captchaResponse: null,
      formFieldStates: {
        dni: null,
        cuit: null,
        actaPersonaJuridica: null,
        libreDeuda: null,
        tituloPropiedad: null,
        planillaAutorizacion: null
      },
      contact: {
        email: '',
        nombre: '',
        apellido: '',
        DNI: '',
        telefono: '',
        tipoSolicitud: 'habilitar'
      },
      datosDelTitular: false,
      titular: {
        razonSocial: '',
        cuitCuil: '',
        domicilioReal: '',
        telefonoFijo: '',
        telefonoMovil: '',
        mail: '',
        provincia: ''
      },
      inmueble: {
        localidad: '',
        direccionLocal: '',
        nombreFantasia: '',
        rubro: '',
        espacioPublico: false,
        marquesina: false,
        mercaderia: false,
        mesas: false,
        carteles: false,
      },
      servicios: [
        { id: "1", nombre: "Servicio de Mucama-Ropa Blanca"},
        { id: "2", nombre: "Desayuno"},
        { id: "3", nombre: "Restaurante - Bar"},
        { id: "4", nombre: "Gimnasio"},
        { id: "5", nombre: "Piletas de Natación"},
        { id: "6", nombre: "Spa"},
        { id: "7", nombre: "Estacionamiento dentro del predio"},
        { id: "8", nombre: "TV-Electrodomésticos"},
        { id: "9", nombre: "Ventiladores y/o Aire Acondicionado"},
        { id: "10", nombre: "Calefacción"},
        { id: "11", nombre: "WI FI y/o Internet"},
        { id: "12", nombre: "Otros"}
      ],
      serviciosSeleccionados: [],
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
    submitForm() {
      // Aquí puedes agregar la lógica para enviar el formulario
      // Hacer popup        
      //CAMBIAR EL SITEKEY POR UNO DE VERDAD
      this.this.grecaptcha.execute('6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', { action: 'submit' })
      .then((token) => {
        this.captchaResponse = token;
        // Lógica adicional para enviar el formulario
      });
      console.log('Formulario enviado');
      openPopup('formOk')
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
      } else if (type === 'formOk') {
        this.showPopupformOk = true;
      } 
    },
     getFormFieldState(fieldName) {
      return this.formFieldStates[fieldName];
    },
    clearFormFieldState(fieldName) {
      this.formFieldStates[fieldName] = null;
    },
    computed: {
      isAdmin(){
        return Boolean(this.$store.state.user.admin == "true");
      },
    },
  }
}
</script>

</template>

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