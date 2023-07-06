<template>
<div class="page">
    <Banner title="Habilitaciones comerciales" />
  <b-card no-body class="col-6 mt-1 shadow-lg "  style="margin: 0px auto">
    
  <b-form @submit="submitForm" class="my-3" style="margin-left:10px;margin-right:10px"> 
    <!-- Sección: Información de contacto -->
    <fieldset >
      <legend><h3>Información de contacto</h3></legend>     
      <b-form-group label="Tipo de Solicitud *" label-for="tipo-solicitud" >
        <b-form-select title="Por el momento solo se pueden solicitar habilitaciones comerciales." id="tipo-solicitud" v-model="contact.tipoSolicitud" disabled required>
            <b-form-select-option selected="selected" value="habilitar">Habilitar nuevo comercio</b-form-select-option>
        </b-form-select>
      </b-form-group>      
      <b-row>
        <b-col md="6">
          <b-form-group label="Nombre *" label-for="nombre" >
            <b-form-input id="nombre" v-model="contact.nombre" required @change="bindInfo()"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Apellido *" label-for="apellido" >
            <b-form-input id="apellido" v-model="contact.apellido" required @change="bindInfo()"></b-form-input>
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
    <!-- Sección: Datos del titular -->
    <fieldset >
      <legend><h3>Datos del titular</h3></legend>      
        <b-form-checkbox v-model="datosDelTitular" switch @change="bindInfo()"><p>* Los Datos de Contacto son los Datos del Titular</p></b-form-checkbox>
      <b-row>
      <b-col md="6">
          <b-form-group label="Nombre del Titular *" label-for="nombreTitular" >
            <b-form-input id="nombreTitular" v-model="titular.nombre" :disabled="datosDelTitular" ref="nombreTitularInput" required></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Apellido del Titular *" label-for="apellidoTitular" >
            <b-form-input id="apellidoTitular" v-model="titular.apellido" :disabled="datosDelTitular" ref="apellidoTitularInput" required></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>      
      <b-row>
        <b-col md="6">
          <b-form-group label="DNI del Titular *" label-for="DNITitular" >
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
      <b-form-group label="Domicilio fiscal electrónico" label-for="domicilio-fiscal" >
        <b-form-input title="Ingrese un email valido como domicilio fiscal electronico" id="domicilio-fiscal" v-model="titular.domicilioFiscal" type="email"></b-form-input>
      </b-form-group>
    </fieldset>

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
      <b-form-group label="Dirección del local *" label-for="direccion-local" >
        <b-form-input id="direccion-local" v-model="inmueble.direccionLocal" required></b-form-input>
      </b-form-group>
      <b-form-group label="Nombre de fantasía *" label-for="nombre-fantasia" >
        <b-form-input id="nombre-fantasia" v-model="inmueble.nombreFantasia" required></b-form-input>
      </b-form-group>    
    
        <b-form-group label="" label-for="espaciopublico" >
        <b-form-checkbox id="espaciopublico" v-model="inmueble.espacioPublico" size="lg" switch>¿Hará uso del espacio público? *</b-form-checkbox>
      </b-form-group>
      <fieldset v-if="inmueble.espacioPublico">
        <b-form-group label="" label-for="marquesina">
            <b-form-checkbox  id="marquesina" v-model="inmueble.marquesina" switch size="lg">Marquesina - Toldo</b-form-checkbox>
        </b-form-group>
        <b-form-group label="" label-for="mercaderia">
            <b-form-checkbox  id="mercaderia" v-model="inmueble.mercaderia" switch size="lg">Mercadería en la Vía Pública</b-form-checkbox>            
        </b-form-group>
        <b-form-group label="" label-for="carteles">
            <b-form-checkbox  id="carteles" v-model="inmueble.carteles" switch size="lg">Carteles</b-form-checkbox> 
        </b-form-group>
        <b-form-group label="" label-for="mesas">
            <b-form-checkbox  id="mesas" v-model="inmueble.mesas" switch size="lg">Mesas y Sillas</b-form-checkbox> 
        </b-form-group>
      </fieldset>

    </fieldset>
    <fieldset  v-if="rubroSeleccionado === 146" key="rubro-146">
      <legend><h3>Servicios exclusivos del rubro HOTELERIA</h3></legend>
      <p>Seleccione los servicios que brinda su establecimiento.</p>
      <b-form-group>
              <b-form-checkbox v-for="servicio in servicios" :key="servicio.id" v-model="inmueble.serviciosExtras" :value="servicio.id" size="lg" switch>
                {{ servicio.nombre }}
              </b-form-checkbox>
            </b-form-group>
    </fieldset>
    <fieldset >
      <legend><h3>Documentación requerida</h3></legend>
      <p>Los documentos deben ser subidos en formato PDF o imagen. AGREGAR TEXTO PARA ACLARAR QUE LA IMAGEN TIENE QUE SER LEGIBLE Y QUE NO PUEDE PESAR MAS DE 16MB</p>
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
    <input type="hidden" id="captchaResponse" name="captchaResponse" v-model="captchaResponse">
    <b-button class="float-right" type="submit" variant="primary">Enviar</b-button>
  </b-form> 
  </b-card>
</div>
</template>

<script>
  import rubros from "@/plugins/rubros.js";
  
export default {
  data() {
      return {  
      listaRubros: rubros,
      showPopupRubros: false,
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
        serviciosExtras: []
      },
      servicios: [
        { id: "1", nombre: "Servicio de Mucama-Ropa Blanca" },
        { id: "2", nombre: "Desayuno" },
        { id: "3", nombre: "Restaurante - Bar" },
        { id: "4", nombre: "Gimnasio" },
        { id: "5", nombre: "Piletas de Natación" },
        { id: "6", nombre: "Spa" },
        { id: "7", nombre: "Estacionamiento dentro del predio" },
        { id: "8", nombre: "TV-Electrodomésticos" },
        { id: "9", nombre: "Ventiladores y/o Aire Acondicionado" },
        { id: "10", nombre: "Calefacción" },
        { id: "11", nombre: "WI FI y/o Internet" },
        { id: "12", nombre: "Otros" }
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
      {
        this.showPopupB = true;
      }
    },
     getFormFieldState(fieldName) {
      return this.formFieldStates[fieldName];
    },
    clearFormFieldState(fieldName) {
      this.formFieldStates[fieldName] = null;
    },
    bindInfo(){
      console.log("bindInfo() CALLED");
      console.log("this.datosDelTitular: " + this.datosDelTitular);
      if (this.datosDelTitular){
        this.titular.nombre = this.contact.nombre;
        this.titular.apellido = this.contact.apellido;
        console.log("this.titular.nombre: " + this.titular.nombre);
        console.log("this.titular.apellido: " + this.titular.apellido);        
        this.actualizarInputs();
      }
    },
    actualizarInputs() {      
      if (this.datosDelTitular){
        this.$nextTick(() => {
          this.$refs.nombreTitularInput.$el.value = this.titular.nombre;
          this.$refs.apellidoTitularInput.$el.value = this.titular.apellido;
        });
      }
    },
    watch: {
      'contact.nombre': {
        handler() {
          this.bindInfo();
        },
        deep: true,
      },
      'contact.apellido': {
        handler() {
          this.bindInfo();
        },
        deep: true,
      },
    },
    computed: {
      isAdmin(){
        return Boolean(this.$store.state.user.admin == "true");
      },
      // Propiedad computada para actualizar los valores del titular con los datos de contacto
      datosDelTitular: {
        get() {
          return this.contact.datosDelTitular;
        },
        set(value) {
          if (value) {
            // Si se activa la opción, se actualizan los valores del titular con los datos de contacto
            this.titular.nombre = this.contact.nombre;
            this.titular.apellido = this.contact.apellido;
            console.log("this.titular.nombre: " + this.titular.nombre);
            console.log("this.titular.apellido: " + this.titular.apellido);
          } else {
            // Si se desactiva la opción, se limpian los valores del titular
            this.titular.nombre = '';
            this.titular.apellido = '';
          }
          this.contact.datosDelTitular = value;
        },
      },
    },
  }
}
</script>

</template>

<style>
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
</style>