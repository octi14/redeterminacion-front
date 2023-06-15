<template>
<div class="page">
    <Banner title="Habilitaciones comerciales" />
  <b-card no-body class="col-6 mt-1 shadow-lg "  style="margin: 0px auto">
    
  <b-form @submit="submitForm" class="my-3" style="margin-left:10px;margin-right:10px"> 
    <!-- Sección: Información de contacto -->
    <b-fieldset>
      <b-legend><h3>Información de contacto</h3></b-legend>
      <b-form-group label="Email" label-for="email" >
        <b-form-input id="email" v-model="contact.email" type="email" required></b-form-input>
      </b-form-group>
      <b-row>
        <b-col md="6">
          <b-form-group label="Nombre" label-for="nombre" >
            <b-form-input id="nombre" v-model="contact.nombre" required></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Apellido" label-for="apellido" >
            <b-form-input id="apellido" v-model="contact.apellido" required></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group label="Teléfono" label-for="telefono" >
        <b-form-input id="telefono" v-model="contact.telefono"  type="number" no-wheel required ></b-form-input>
      </b-form-group>
      <b-form-group label="Tipo de solicitud" label-for="tipo-solicitud" >
        <b-form-select id="tipo-solicitud" v-model="contact.tipoSolicitud" required>
          <option value="">Seleccione...</option>
          <option value="habilitar">Habilitar nuevo comercio</option>
          <option value="renovacion">Renovación comercio</option>
        </b-form-select>
      </b-form-group>
    </b-fieldset>

    <!-- Sección: Datos del titular -->
    <b-fieldset>
      <b-legend><h3>Datos del titular</h3></b-legend>
      <b-form-group label="Razón social" label-for="razon-social" >
        <b-form-input id="razon-social" v-model="titular.razonSocial" required></b-form-input>
      </b-form-group>
      <b-row>
        <b-col md="6">
          <b-form-group label="CUIT o CUIL" label-for="cuit-cuil" >
            <b-form-input id="cuit-cuil" v-model="titular.cuitCuil" required></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Domicilio real" label-for="domicilio-real" >
            <b-form-input id="domicilio-real" v-model="titular.domicilioReal" required></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group label="Teléfono fijo" label-for="telefono-fijo" >
            <b-form-input id="telefono-fijo" v-model="titular.telefonoFijo" type="tel" required></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Teléfono móvil" label-for="telefono-movil" >
            <b-form-input id="telefono-movil" v-model="titular.telefonoMovil" type="tel" required></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group label="Mail" label-for="mail" >
        <b-form-input id="mail" v-model="titular.mail" type="email" required></b-form-input>
      </b-form-group>
      <b-form-group label="Domicilio fiscal electrónico" label-for="domicilio-fiscal" >
        <b-form-input title="Ingrese un email valido como domicilio fiscal electronico" id="domicilio-fiscal" v-model="titular.domicilioFiscal" type="email" required></b-form-input>
      </b-form-group>
    </b-fieldset>

    <!-- Sección: Datos del inmueble -->
    <b-fieldset>
      <b-legend><h3>Datos del inmueble</h3></b-legend>
      <b-form-group id="group-expediente" label="Expediente" label-for="input-expediente">
          <b-form-input id="input-expediente" v-model="expediente" trim type="text" />
        </b-form-group>
      <b-form-group label="Localidad" label-for="localidad" >
        <b-form-select id="localidad" v-model="inmueble.localidad" required>
          <option value="">Seleccione...</option>
          <option value="villa-gesell">Villa Gesell</option>
          <option value="mar-de-las-pampas">Mar de las Pampas</option>
          <option value="mar-azul">Mar Azul</option>
          <option value="las-gaviotas">Las Gaviotas</option>
        </b-form-select>
      </b-form-group>
      <b-form-group label="Dirección del local" label-for="direccion-local" >
        <b-form-input id="direccion-local" v-model="inmueble.direccionLocal" required></b-form-input>
      </b-form-group>
      <b-form-group label="Nombre de fantasía" label-for="nombre-fantasia" >
        <b-form-input id="nombre-fantasia" v-model="inmueble.nombreFantasia" required></b-form-input>
      </b-form-group>
      <b-form-group label="Rubro" label-for="rubro" ><b-link class="popup-link float-right" @click="openPopup('Rubros')">(?)</b-link>
        <b-form-select v-model="rubroSeleccionado" :options="listaRubros" value-field="id" text-field="nombre"></b-form-select>
      </b-form-group>
      <b-row>
        <b-col md="6">
          <b-form-group label="Superficie" label-for="superficie" >
            <b-form-input id="superficie" v-model="inmueble.superficie" type="number" required  placeholder="superficie en metros cuadrados" no-wheel ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Número de partida ARBA" label-for="numero-partida" >
            <b-form-input id="numero-partida" v-model="inmueble.numeroPartida" type="number"  required no-wheel ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
    </b-fieldset>

    <b-button type="submit" variant="primary">Enviar</b-button>
  </b-form> 
  </b-card>
  <b-modal v-model="showPopupRubros" title="Información Adicional Rubros" :hide-footer="true" @click-outside="showPopupRubros = false" centered>
    <b-form-group label="Seleccione el Rubro" label-for="rubro" >
      <b-form-select @change="updateRubroData" v-model="rubroSeleccionado" :options="listaRubros" value-field="id" text-field="nombre"></b-form-select>
    </b-form-group>
     <b-container v-if="descripcionSeleccionada">
      <h4>Descripción:</h4>
      <p>{{ descripcionSeleccionada }}</p>
    </b-container>

    <b-container v-if="ordenanzasSeleccionadas.length">
      <h4>Lista de ordenanzas:</h4>
      <ul>
        <li v-for="ordenanza in ordenanzasSeleccionadas" :key="ordenanza.id">
          <a :href="linksSeleccionados[ordenanza.id]">{{ ordenanza.nombre }}</a>
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
      selectedRubro: null,
      descripcionSeleccionada:'',
      ordenanzasSeleccionadas:[],
      linksSeleccionados:[],
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
        numeroPartida: ''
      }
      }
  },
  mounted() {
    //ORDENAR listaRubros antes de mostrarla.
    this.listaRubros.sort((a, b) => a.nombre.localeCompare(b.nombre));
  },
  methods: {
    submitForm() {
      // Aquí puedes agregar la lógica para enviar el formulario
      // Hacer popup  
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
      console.log('updateRubroData');
      console.log('this.rubroSeleccionado');
      console.log(this.rubroSeleccionado);
      console.log('this.listaRubros');
      console.log(this.listaRubros);
      console.log('updateRubroData');
    if (this.rubroSeleccionado) {
      // Obtener los datos correspondientes al rubro seleccionado
      const descripcion = this.listaRubros[this.rubroSeleccionado].descripcion;
      const ordenanzas = this.listaRubros[this.rubroSeleccionado].ordenanzas;
      const links = this.listaRubros[this.rubroSeleccionado].links;

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
</style>