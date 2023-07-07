<template>
<div class="page">
    <Banner title="Habilitaciones comerciales" />
    
  <b-form @submit="submitForm" class="my-3" style="margin-left:10px;margin-right:10px"> 
    
  <b-card no-body class="col-8 mt-1 shadow-lg "  style="margin: 0px auto">
    <!-- Sección: Datos del Solicitante -->
    <fieldset >
      <legend><h3>Datos de Solcitante <b-icon-question-circle-fill @click="openPopup('B')" font-scale="0.75" variant="info"></b-icon-question-circle-fill></h3></legend> 
      <p>TEXTITO "desde aca podes completar tus datos ..."</p>    
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
          <b-form-group label="Nombre del Solcitante *" label-for="nombreTitular" >
            <b-form-input id="nombreTitular" v-model="titular.nombre" required></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Apellido del Solcitante *" label-for="apellidoTitular" >
            <b-form-input id="apellidoTitular" v-model="titular.apellido" required></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>      
      <b-row>
        <b-col md="6">
          <b-form-group label="DNI del Solcitante *" label-for="DNITitular" >
            <b-form-input id="DNITitular" v-model="titular.DNI" required></b-form-input>
          </b-form-group>
        </b-col>        
        <b-col md="6">
          <b-form-group label="CUIT o CUIL *" label-for="cuit-cuil" >
            <b-form-input id="cuit-cuil" v-model="titular.cuitCuil" required></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group label="Razón Social *" label-for="razon-social" >
        <b-form-input id="razon-social" v-model="titular.razonSocial" required></b-form-input>
      </b-form-group>
      <b-row>
        <b-col md="6">
          <b-form-group label="Teléfono Fijo *" label-for="telefonoTitular" >
            <b-form-input id="telefonoTitular" v-model="titular.telefono"  type="tel" no-wheel ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Domicilio Real y/o Legal *" label-for="domicilio-real" >
            <b-form-input id="domicilio-real" v-model="titular.domicilioReal" required></b-form-input>
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
          <b-form-group label="Código Postal *" label-for="codigoPostal" >
            <b-form-input id="codigoPostal" v-model="titular.codigoPostal" type="number" required></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group label="Mail *" label-for="mail" >
        <b-form-input id="mail" v-model="titular.mail" type="email" required></b-form-input>
      </b-form-group>
      <b-form-group label="" label-for="domicilio-fiscal" >
        <label for="rubro" class="rubro-label">Domicilio fiscal electrónico <b-icon-question-circle-fill @click="openPopup('B')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></label>
        <b-form-input title="Ingrese un email valido como domicilio fiscal electronico" id="domicilio-fiscal" v-model="titular.domicilioFiscal" type="email"></b-form-input>
      </b-form-group>
    </fieldset>      
    <b-row>
      <b-col md="6">  
        <h5>¿Sos apoderado/representante? <b-icon-question-circle-fill @click="openPopup('B')" font-scale="1" variant="info"></b-icon-question-circle-fill></h5>   
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
        <p>TEXTITO "Completa los datos del apoderado/representante/contacto":</p>
      <b-row>
        <b-col md="6">
          <b-form-group label="Nombre *" label-for="nombre" >
            <b-form-input id="nombre" v-model="contact.nombre" required></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Apellido *" label-for="apellido" >
            <b-form-input id="apellido" v-model="contact.apellido" required></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>      
      <b-form-group label="Teléfono *" label-for="telefono" >
        <b-form-input id="telefono" v-model="contact.telefono" type="tel" no-wheel required ></b-form-input>
      </b-form-group>
      <b-form-group label="Email *" label-for="email" >
        <b-form-input id="email" v-model="contact.email" type="email" required></b-form-input>
      </b-form-group>
    </fieldset>
  </b-card>
  <b-card no-body class="col-8 mt-1 shadow-lg "  style="margin: 0px auto">
    <!-- Sección: Datos del inmueble -->
    <fieldset >
      <legend><h3>Datos del inmueble</h3></legend>
      <b-row>
        <b-col md="6">  
          <b-form-group label="Localidad *" label-for="localidad" >
            <b-form-select id="localidad" v-model="inmueble.localidad" required>
              <option value="">Seleccione...</option>
              <option value="villa-gesell">Villa Gesell</option>
              <option value="mar-de-las-pampas">Mar de las Pampas</option>
              <option value="mar-azul">Mar Azul</option>
              <option value="las-gaviotas">Las Gaviotas</option>
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
      <b-form-group label="Dirección del inmueble *" label-for="direccion-local" >
        <b-form-input id="direccion-local" v-model="inmueble.direccionLocal" required></b-form-input>
      </b-form-group>
      <b-form-group label="Nombre de fantasía *" label-for="nombre-fantasia" >
        <b-form-input id="nombre-fantasia" v-model="inmueble.nombreFantasia" required></b-form-input>
      </b-form-group>    
    <fieldset  v-if="rubroSeleccionado === 146" key="rubro-146">
      <legend><h5>Servicios exclusivos del rubro HOTELERIA *</h5></legend>
      <p>Seleccione los servicios que brinda su establecimiento.</p>
      <!--
        <b-form-group>
        <b-form-checkbox v-for="servicio in servicios" :key="servicio.id" v-model="inmueble.serviciosExtras" :value="servicio.id" size="lg" switch>
          {{ servicio.nombre }}
        </b-form-checkbox>
      </b-form-group>
      -->
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
    </fieldset>
      <b-form-group label="" label-for="espaciopublico" style="margin: 0px auto">
            <b-row>
              <b-col md="6">  
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
        <p>TEXTITO</p>
        <b-form-group label="" label-for="marquesina" style="margin-bottom: 0">
            <b-row style="border-bottom: 1px solid #EEE">
              <b-col md="6">  
                <label>Marquesina - Toldo: </label>
              </b-col>
            <div class="form-check-inline">
              <b-col md="3">
                <b-form-radio  id="marquesina-no" v-model="inmueble.marquesina" name="radio-marquesina" checked="checked" value="false"> No</b-form-radio>
              </b-col>
              <b-col md="3">
                <b-form-radio  id="marquesina-si" v-model="inmueble.marquesina" name="radio-marquesina" value="true"> Si</b-form-radio>
              </b-col>
            </div>
          </b-row>
        </b-form-group>
        <b-form-group label="" label-for="mercaderia" style="margin-bottom: 0">
            <b-row style="border-bottom: 1px solid #EEE">
              <b-col md="6">  
                <label>Mercadería en la Vía Pública: </label> 
              </b-col>
            <div class="form-check-inline">
              <b-col md="3">
                <b-form-radio  id="mercaderia-no" v-model="inmueble.mercaderia" name="radio-mercaderia" checked="checked" value="false"> No</b-form-radio>
              </b-col>
              <b-col md="3">
                <b-form-radio  id="mercaderia-si" v-model="inmueble.mercaderia" name="radio-mercaderia" value="true"> Si</b-form-radio>
              </b-col>
            </div>
          </b-row>
        </b-form-group>
        <b-form-group label="" label-for="carteles" style="margin-bottom: 0">
            <b-row style="border-bottom: 1px solid #EEE">
              <b-col md="6">  
                <label>Carteles: </label> 
              </b-col>
            <div class="form-check-inline">
              <b-col md="3">
                <b-form-radio  id="carteles-no" v-model="inmueble.carteles" name="radio-carteles" checked="checked" value="false"> No</b-form-radio>
              </b-col>
              <b-col md="3">
                <b-form-radio  id="carteles-si" v-model="inmueble.carteles" name="radio-carteles" value="true"> Si</b-form-radio>
              </b-col>
            </div>
          </b-row>
        </b-form-group>
        <b-form-group label="" label-for="mesas" style="margin-bottom: 0">
            <b-row style="border-bottom: 1px solid #EEE">
              <b-col md="6">  
                <label>Mesas y Sillas: </label> 
              </b-col>
            <div class="form-check-inline">
              <b-col md="3">
                <b-form-radio  id="mesas-no" v-model="inmueble.mesas" name="radio-mesas" checked="checked" value="false"> No</b-form-radio>
              </b-col>
              <b-col md="3">
                <b-form-radio  id="mesas-si" v-model="inmueble.mesas" name="radio-mesas" value="true"> Si</b-form-radio>
              </b-col>
            </div>
          </b-row>
        </b-form-group>
      </fieldset>

    </fieldset>
       
  </b-card>
  <b-card no-body class="col-8 mt-1 shadow-lg " style="margin: 0px auto">
    <fieldset >
      <legend><h3>Documentación requerida</h3></legend>
      <p>Los documentos deben ser subidos en formato PDF o imagen (png o jpeg). AGREGAR TEXTO PARA ACLARAR QUE LA IMAGEN TIENE QUE SER LEGIBLE Y QUE NO PUEDE PESAR MAS DE 16MB</p>
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
      <b-row>
        <b-col md="6">  
          <b-form-group label="Libre Deuda de Tasa Urbana *" label-for="libreDeudaUrbana" >
          <b-form-file v-model="libreDeudaUrbana" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('libreDeudaUrbana')" @input="clearFormFieldState('libreDeudaUrbana')"></b-form-file>
          </b-form-group>      
        </b-col>
        <b-col md="6">  
          <b-form-group label="Libre Deuda de Tasa por Inspección de Seguridad e Higiene *" label-for="libreDeudaHigiene" >
          <b-form-file v-model="libreDeudaHigiene" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('libreDeudaHigiene')" @input="clearFormFieldState('libreDeudaHigiene')"></b-form-file>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group label="Título de propiedad/contrato de locación *" label-for="tituloPropiedad" >
      <b-form-file v-model="tituloPropiedad" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('tituloPropiedad')" @input="clearFormFieldState('tituloPropiedad')"></b-form-file>
      </b-form-group>
      <b-form-group label="Planilla de Autorización de trámite *" label-for="planillaAutorizacion" >
      <b-form-file v-model="planillaAutorizacion" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required :state="getFormFieldState('planillaAutorizacion')" @input="clearFormFieldState('planillaAutorizacion')"></b-form-file>
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

<b-modal v-model="showPopupB" title="Información Adicional" :hide-footer="true" @click-outside="showPopupB = false" centered>
  <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
</b-modal>


</div>
</template>

<script>
  import rubros from "@/plugins/rubros.js";
  
export default {
  data() {
      return {  
      listaRubros: rubros,
      showPopupB: false,
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
        domicilioFiscal: ''
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
        { id: "1", nombre: "Servicio de Mucama-Ropa Blanca", value: "false" },
        { id: "2", nombre: "Desayuno", value: "false" },
        { id: "3", nombre: "Restaurante - Bar", value: "false" },
        { id: "4", nombre: "Gimnasio", value: "false" },
        { id: "5", nombre: "Piletas de Natación", value: "false" },
        { id: "6", nombre: "Spa", value: "false" },
        { id: "7", nombre: "Estacionamiento dentro del predio", value: "false" },
        { id: "8", nombre: "TV-Electrodomésticos", value: "false" },
        { id: "9", nombre: "Ventiladores y/o Aire Acondicionado", value: "false" },
        { id: "10", nombre: "Calefacción", value: "false" },
        { id: "11", nombre: "WI FI y/o Internet", value: "false" },
        { id: "12", nombre: "Otros", value: "false" }
      ]
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
    },
    openPopup(type) {
      // Lógica para abrir el popup correspondiente según el tipo (A, B, C, D)else if (type === 'B') 
      console.log('openPopup');
      if (type === 'A') {
        console.log("ShowPopup A")
        this.showPopupA = true;
      } else if (type === 'B') {
        this.showPopupB = true;
      } else if (type === 'C') {
        this.showPopupC = true;
      } else if (type === 'D') {
        this.showPopupD = true;
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
  }
  h5{
    padding-top: 15px;
    color: green !important;
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