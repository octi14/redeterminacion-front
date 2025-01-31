<template>
  <div class="page main-background">
    <Banner title="Compras" subtitle="Detalle de orden de compra"/>
    <!-- Datos del solicitante -->
    <template v-if="orden">
      <div class="flex col" style="width: 96%">
        <div class="row justify-content-center mt-3">
          <p class="h5"> Número de orden: <b> {{ orden.nroOrden }}  </b></p>
        </div>
        <!-- <div class="row justify-content-center mt-3">
          <p class="h5"> Tipo de trámite: <b> {{ habilitacion.tipoSolicitud }}  </b></p>
        </div> -->
        <!-- <div class="row justify-content-center mt-3">
          <div class="h5 row"> Estado:
            <h5 :class="getStatusClass(habilitacion.status)" class="ml-2"> {{ habilitacion.status }}</h5>
          </div>
        </div> -->
        <!-- <div class="col mx-auto">
          <div class="h5 row justify-content-center"> Número de expediente: <b class="text-success ml-1"> {{ habilitacion.nroExpediente }} </b> </div>
          <div class="h5 row justify-content-center" v-if="!esHabilitacion"> Alcance: <b class="text-success ml-1"> {{ habilitacion.alcance }} </b> </div>
          <div class="h5 row justify-content-center" v-if="!esHabilitacion"> Legajo: <b class="text-success ml-1"> {{ habilitacion.nroLegajo }} </b> </div>
        </div> -->
      </div>
      <!--Botones-->
      <div class="row col-10 mx-auto justify-content-center" v-if="adminCompras">
        <b-button 
          v-if="orden && orden.id"
          @click="$router.push(`/compras/combustible/${orden.id}/generar`)" 
          variant="success" 
          class="btn-4 mt-3 mx-1"
        >
          Generar vales
        </b-button>

        <b-button @click="onShowObservaciones" variant="primary" class="btn-2 mt-3 mx-1"> Ver observaciones </b-button>
      </div>
      <!--Botón emitir vales (opcional)-->
      <!-- <div class="row no-gutters">
        <b-button @click="onDescargarHabilitacion(); registrarActividad('Descargar Trámite', 'Trámite Descargado', habilitacion.nroTramite)" v-if="adminComercio || adminArvige || adminModernizacion" variant="success" class="btn-4 mx-auto mt-3 mx-1">
          <b-icon icon="download" class="mr-1"></b-icon> Descargar trámite
        </b-button>
      </div> -->

      <!--Datos del solicitante-->
      <b-card no-body class="container col-md-6 col-sm-8 shadow-card mt-4 mx-auto">
        <div class="col mx-auto">
          <div class="container text-center mx-auto">
            <h2 class="text-success mt-2"><b> Datos de la orden de compra </b></h2>
            <hr/>
          </div>
        </div>
        <div class="container mx-auto">
          <div class="d-flex justify-content-between align-items-center mt-3 mx-4">
            <p class="font-weight-bold text-primary">Área asignada</p>
            <p class="text-right"><strong>{{ orden.area }}</strong></p>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-3 mx-4">
            <p class="font-weight-bold text-primary">Monto total</p>
            <p class="text-right"><strong>{{ format(orden.montoSuper + orden.montoVPower) }}</strong></p>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-1 mx-4">
            <div class="d-flex align-items-center gap-2">
              <b-icon-caret-right-fill/>
              <p class="mb-0">Monto Súper</p>
            </div>
            <p class="text-right">{{ format(orden.montoSuper) }}</p>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-3 mx-4">
            <div class="d-flex align-items-center gap-2">
              <b-icon-caret-right-fill/>
              <p class="mb-0">Monto V-Power</p>
            </div>
            <p class="text-right">{{ format(orden.montoVPower) }}</p>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-3 mx-4">
            <p class="font-weight-bold text-primary">Saldo restante</p>
            <p class="text-right"><strong>{{ format(orden.saldoSuper + orden.saldoVPower) }}</strong></p>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-1 mx-4">
            <div class="d-flex align-items-center gap-1">
              <b-icon-caret-right-fill/>
              <p class="mb-0">Saldo restante: Súper</p>
            </div>
            <p class="text-right">{{ format(orden.saldoSuper) }}</p>
          </div>
          <div class="d-flex justify-content-between align-items-center my-3 mx-4">
            <div class="d-flex align-items-center gap-2">
              <b-icon-caret-right-fill/>
              <p class="mb-0">Saldo restante: V-Power</p>
            </div>
            <p class="mb-0 text-right">{{ format(orden.saldoVPower) }}</p>
          </div>
        </div>
      </b-card>


    </template>
    <!-- Documentación -->
    <template v-if="orden">
      <div class="container col-md-6 col-sm-8 card shadow-card mt-4 mb-3 mx-auto">
        <!-- Resto del contenido del componente -->
        <div class="col mx-auto">
          <div class="container text-center mx-auto">
            <h2 class="text-success mt-2"><b> Vales emitidos </b></h2>
            <hr/>
          </div>
        </div>
        <!-- Mostrar los enlaces a los vales (revisar) -->
        <div class="container justify-content-center mx-auto" v-if="documentos">
          <div v-for="(documento, nombreDocumento) in documentos" :key="nombreDocumento">
            <!-- <div class="layout" v-if="documento">
              <p class="col col-main">
                <strong>{{ nombreDocumento }}</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <b-button size="sm" @click="openDocumento(documento, nombreDocumento)" variant="outline-primary" pill>
                  <b-icon icon="eye" scale="1.2"></b-icon>
                  Ver
                </b-button>
              </p>
            </div> -->
          </div>
        </div>
        <div class="justify-content-center mx-auto" v-else>
          <p class="h6 text-center"> No hay vales emitidos para esta orden de compra. </p>
          <!-- <div class="row justify-content-center mb-3">
            <b-spinner variant="success"></b-spinner>
          </div> -->
        </div>
      </div>
    </template>

    <div class="text-center mb-3">
      <NuxtLink to="/compras/combustible">
        <b-button variant="primary">Volver</b-button>
      </NuxtLink>
    </div>

    <!-- Modals -->
    <b-modal v-model="showObservaciones" header-bg-variant="primary" title="Observaciones" title-class="text-light" hide-footer centered>
      <p v-html="observaciones"></p>
    </b-modal>
  </div>
</template>

<script>
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export default {
  data() {
    return {
      showAdvertencia: false,
      showObservaciones: false,
      orden: null,
      observaciones: '',
    }
  },
  computed: {
    adminCompras(){
      return this.$store.state.user.admin == "compras" || this.$store.state.user.admin == "master"
    },
    adminMaster(){
      return this.$store.state.user.admin == "master"
    },
    documentos(){
      return this.$store.state.documentos.all
    }
  },
  async fetch() {
    const ordenId = this.$route.params.id
    await this.$store.dispatch('combustible/getSingle',{
      id: ordenId,
    })
    this.orden = this.$store.state.combustible.single

    const nroOrden = this.orden.nroOrden
    // await this.$store.dispatch('vales/getSingle', { nroOrden })
    // this.turno = this.$store.state.turnos.single

    // await this.$store.dispatch('vales/getById', {
    //   id: ordenId,
    // })
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
    onShowObservaciones(){
      if(this.orden.observaciones){
        this.observaciones = this.orden.observaciones.split('-').join('<br>')
      }else{
        this.observaciones = "No hay observaciones para mostrar."
      }
      this.showObservaciones = true
    },
    async onShowGenerarVales(){
      await this.$router.push('/generar')
    },
    getStatusClass(status) {
      return this.statusClasses[status] || '';
    },
    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    onResetEdit() {
      this.editing = false
    },
    format(value) {
      if (!value) return "$0";
      return `$${value.toLocaleString('es-AR')}`;
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

.col {
  padding: 0.4em;
  margin: 0 2px 2px 40px;
}
</style>
