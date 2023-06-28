<template>
<div class="page">
    <Banner title="Habilitaciones comerciales" />
  <b-card no-body class="col-6 mt-1 shadow-lg "  style="margin: 0px auto">
    
  <b-form @submit="submitForm" class="my-3" style="margin-left:10px;margin-right:10px"> 
    <!-- Sección: Información de contacto -->
    <fieldset >
      <legend><h3>Información de contacto</h3></legend>
      <b-form-group label="Email *" label-for="email" >
        <b-form-input id="email" v-model="contact.email" type="email" required></b-form-input>
      </b-form-group>
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
        <b-form-input id="telefono" v-model="contact.telefono"  type="number" no-wheel required ></b-form-input>
      </b-form-group>
      <b-form-group label="Tipo de solicitud *" label-for="tipo-solicitud" >
        <b-form-select id="tipo-solicitud" v-model="contact.tipoSolicitud" required>
          <option value="">Seleccione...</option>
          <option value="habilitar">Habilitar nuevo comercio</option>
          <option value="renovacion">Renovación comercio</option>
        </b-form-select>
      </b-form-group>
    </fieldset>

    <!-- Sección: Datos del titular -->
    <fieldset >
      <legend><h3>Datos del titular</h3></legend>
      <b-form-group label="Razón social *" label-for="razon-social" >
        <b-form-input id="razon-social" v-model="titular.razonSocial" required></b-form-input>
      </b-form-group>
      <b-row>
        <b-col md="6">
          <b-form-group label="CUIT o CUIL *" label-for="cuit-cuil" >
            <b-form-input id="cuit-cuil" v-model="titular.cuitCuil" required></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Domicilio real *" label-for="domicilio-real" >
            <b-form-input id="domicilio-real" v-model="titular.domicilioReal" required></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group label="Teléfono fijo" label-for="telefono-fijo" >
            <b-form-input id="telefono-fijo" v-model="titular.telefonoFijo" type="tel"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Teléfono móvil" label-for="telefono-movil" >
            <b-form-input id="telefono-movil" v-model="titular.telefonoMovil" type="tel"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group label="Mail *" label-for="mail" >
        <b-form-input id="mail" v-model="titular.mail" type="email" required></b-form-input>
      </b-form-group>
      <b-form-group label="Domicilio fiscal electrónico *" label-for="domicilio-fiscal" >
        <b-form-input title="Ingrese un email valido como domicilio fiscal electronico" id="domicilio-fiscal" v-model="titular.domicilioFiscal" type="email" required></b-form-input>
      </b-form-group>
    </fieldset>

    <!-- Sección: Datos del inmueble -->
    <fieldset >
      <legend><h3>Datos del inmueble</h3></legend>
      <b-form-group id="group-expediente" label="Expediente?" label-for="input-expediente">
          <b-form-input id="input-expediente" v-model="expediente" trim type="text" />
        </b-form-group>      
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
            <label for="rubro" class="rubro-label">Rubro *<b-link class="popup-link float-right" @click="openPopup('Rubros')">(?)</b-link>
            </label>
            <b-form-select v-model="rubroSeleccionado" :options="listaRubros" value-field="id" text-field="nombre" @change="updateRubroData" ></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group label="Dirección del local *" label-for="direccion-local" >
        <b-form-input id="direccion-local" v-model="inmueble.direccionLocal" required></b-form-input>
      </b-form-group>
      <b-form-group label="Nombre de fantasía *" label-for="nombre-fantasia" >
        <b-form-input id="nombre-fantasia" v-model="inmueble.nombreFantasia" required></b-form-input>
      </b-form-group>     
      <b-row>
        <b-col md="6">
          <b-form-group label="Superficie *" label-for="superficie">
            <div class="input-group">
              <b-form-input id="superficie" v-model="inmueble.superficie" type="number" required no-wheel></b-form-input>
              <div class="input-group-append">
                <span class="input-group-text">m2</span>
              </div>
            </div>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Número de partida ARBA *" label-for="numero-partida" >
            <b-form-input id="numero-partida" v-model="inmueble.numeroPartida" type="number"  required no-wheel ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
    </fieldset>
    <fieldset  v-if="rubroSeleccionado === 146" key="rubro-146">
      <legend><h3>Servicios exclusivos del rubro HOTELERIA</h3></legend>
      <p>Seleccione los servicios que brinda su establecimiento.</p>
      <b-form-group>
              <b-form-checkbox v-for="servicio in servicios" :key="servicio.id" v-model="inmueble.serviciosExtras" :value="servicio.id" size="lg">
                {{ servicio.nombre }}
              </b-form-checkbox>
            </b-form-group>
    </fieldset>
    <fieldset >
      <legend><h3>Documentación requerida</h3></legend>
      <p>Los documentos deben ser subidos en formato PDF o imagen.</p>
      <b-form-group label="DNI (Fente y Dorso) *" label-for="DNI" >
        <b-form-file v-model="dni" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required multiple :state="getFormFieldState('dni')" @input="clearFormFieldState('dni')"></b-form-file>
      </b-form-group>
      <b-form-group label="CUIT *" label-for="constanciaCuit" >
      <b-form-file v-model="constanciaCuit" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required multiple :state="getFormFieldState('constanciaCuit')" @input="clearFormFieldState('constanciaCuit')"></b-form-file>      
      </b-form-group>
      <b-form-group label="Libre deuda *" label-for="libreDeuda" >
      <b-form-file v-model="libreDeuda" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required multiple :state="getFormFieldState('libreDeuda')" @input="clearFormFieldState('libreDeuda')"></b-form-file>
      </b-form-group>
      <b-form-group label="Título de propiedad/contrato de locación *" label-for="tituloPropiedad" >
      <b-form-file v-model="tituloPropiedad" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required multiple :state="getFormFieldState('tituloPropiedad')" @input="clearFormFieldState('tituloPropiedad')"></b-form-file>
      </b-form-group>
      <b-form-group label="Planilla de Autorización de trámite *" label-for="planillaAutorizacion" >
      <b-form-file v-model="planillaAutorizacion" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*" required multiple :state="getFormFieldState('planillaAutorizacion')" @input="clearFormFieldState('planillaAutorizacion')"></b-form-file>
      </b-form-group>
    </fieldset>
    <b-form-group>
      <div id="captchaContainer" class="float-right"></div>
    </b-form-group>
    <input type="hidden" id="captchaResponse" name="captchaResponse" v-model="captchaResponse">
    <b-button class="float-right" type="submit" variant="primary">Enviar</b-button>
  </b-form> 
  </b-card>
  <b-modal v-model="showPopupRubros" title="Información Adicional Rubros" :hide-footer="true" @click-outside="showPopupRubros = false" centered>
    <b-form-group label="Seleccione el Rubro" label-for="rubro">
      <b-form-select @change="updateRubroData" v-model="rubroSeleccionado" :options="listaRubros" value-field="id" text-field="nombre"></b-form-select>
    </b-form-group>
     <b-container v-if="descripcionSeleccionada">
      <h4>Descripción:</h4>
      <p>{{ descripcionSeleccionada }}</p>
    </b-container>

    <b-container v-if="ordenanzasSeleccionadas.length">
      <h4>Ordenanzas relacionadas:</h4>
      <ul>
        <li v-for="(ordenanza, index) in ordenanzasSeleccionadas" :key="index">
          <a :href="linksSeleccionados[index]">{{ ordenanza }}</a>
        </li>
      </ul>
    </b-container>
    <b-btn class="float-right" variant="primary" @click="showPopupRubros = false">OK</b-btn>
  </b-modal>
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
      descripcionSeleccionada:'',
      ordenanzasSeleccionadas:[],
      linksSeleccionados:[],
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
        telefono: '',
        tipoSolicitud: ''
      },
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
        superficie: '',
        numeroPartida: '',
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
      // Lógica para abrir el popup correspondiente según el tipo (A, B, C, D)
      if (type === 'Rubros') {
        this.showPopupRubros = true;
        this.updateRubroData()
      } else if (type === 'B') {
        this.showPopupB = true;
      }
    },
    updateRubroData() {
    if (this.rubroSeleccionado) {
      // Obtener los datos correspondientes al rubro seleccionado
      const i = this.listaRubros.findIndex(rubro => rubro.id === this.rubroSeleccionado);
      this.rubroPrueba = this.listaRubros.find(rubro => rubro.id === this.rubroSeleccionado);
      const descripcion = this.listaRubros[i].descripcion;
      const ordenanzas = this.listaRubros[i].ordenanzas;
      const links = this.listaRubros[i].links;
      // Actualizar las propiedades con los nuevos valores
      this.descripcionSeleccionada = descripcion;
      this.ordenanzasSeleccionadas = ordenanzas;
      this.linksSeleccionados = links;
      } else {
        // Si no se ha seleccionado ninguna opción, reiniciar las propiedades
        this.descripcionSeleccionada = '';
        this.ordenanzasSeleccionadas = [];
        this.linksSeleccionados = [];
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
    methods: {
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
  color: #dc3545;
  font-weight: bold;
}
.rubro-label{
  width: 98%;
}
.rubro-label a{
  margin-left: 10px;
}
</style>