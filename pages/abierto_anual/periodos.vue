<template>
  <div class="page main-background">
      <Banner title="Comercio Abierto Anual"/>
      <b-row v-if="tramite" class="page-body" align-h="center" style="width: 100%;">
          <div class="section-subtitle" v-if="!todosCorrectos">
              <div class="li-row">
                  <div class="li-icon border-b border-r">
                      <b-icon-file-arrow-up font-scale="2" class="icon-orange"></b-icon-file-arrow-up>
                  </div>
                  <div class="li-content border-b">
                      <p class="subtitle">Carga de documentación</p>
                  </div>
              </div>
              <div class="li-row sangria">
                  <div class="li-icon">
                      <b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill>
                  </div>
                  <div class="li-content">
                      Seleccioná el período que corresponda y subí la factura del legajo comercial declarado.
                  </div>
              </div>
              <div class="li-row DFE-card">
                  <b-row style="width:100%">
                      <b-col md="2" style="padding-right: 0;">
                          <b-icon-exclamation-circle variant="dark" font-scale="3"></b-icon-exclamation-circle>
                      </b-col>
                      <b-col v-if="maestro && maestro.dfe != '\r'" md="10" style="padding-left: 0;">
                          <p class="subtitle"><b>Este comercio posee Domicilio Fiscal Electrónico (DFE).</b></p>
                          <p>En caso de que la factura cargada sea incorrecta se te notificará el período de rectificación a través del Domicilio Fiscal Electrónico.<br />
                          Si la carga no tiene errores no serás notificado/a y podrás verificarla ingresando tus datos en esta misma página.</p>
                      </b-col>
                      <b-col v-else md="10" style="padding-left: 0;">
                          <p class="subtitle">Este comercio no posee Domicilio Fiscal Electrónico (DFE). Tramitalo enviando un mail a <a href="mailto:dirarvige@gesell.gob.ar" target="_blank">dirarvige@gesell.gob.ar</a></p>
                          <p>En caso de que la factura cargada sea incorrecta se te notificará el período de rectificación a través del Domicilio Fiscal Electrónico.<br />
                          en caso de no constituirlo deberás revisar periódicamente esta misma página para corroborar que la carga no tenga errores.</p>
                      </b-col>
                  </b-row>
              </div>
          </div>

          <div class="section-subtitle">
              <div class="li-row">
                  <div class="li-icon border-b border-r">
                      <b-icon-file-arrow-up font-scale="2" class="icon-orange"></b-icon-file-arrow-up>
                  </div>
                  <div class="li-content border-b">
                      <p class="subtitle">CUIT: <b>{{ tramite ? tramite.cuit : "" }}</b></p>
                      <p class="subtitle">Legajo comercial: <b>{{ tramite ? tramite.nroLegajo : "" }}</b></p>
                  </div>
              </div>
          </div>

          <template v-if="todosCorrectos">
            <div class="li-row DFE-card">
              <b-row style="width:100%">
                  <b-col md="2" style="padding-right: 0;">
                    <b-icon-check-circle scale="3" variant="success" font-scale="3"></b-icon-check-circle>
                  </b-col>
                  <b-col v-if="maestro && maestro.dfe != '\r'" md="10" style="padding-left: 0;">
                      <p class="subtitle"><b>Tu solicitud de Abierto Anual fue aprobada.</b></p>
                      <p>Esto significa que obtendrás el beneficio correspondiente en tu Tasa por Inspección de Seguridad e Higiene durante el año 2025.</p>
                  </b-col>
              </b-row>
            </div>
          </template>

          <template v-else>
              <b-col v-for="(periodo, index) in tramite.status" :key="index" cols="12" sm="8" md="6" lg="4" xl="4">
                  <AbiertoAnualCard
                      :id="index"
                      :periodo="index"
                      :estado="periodo"
                      :fecha="tramite.fechasCarga[index]"
                      :observaciones="tramite && tramite.facturas[index] ? tramite.facturas[index].observaciones : null"
                      :DFE="maestro && maestro.dfe != '\r'"
                  />
              </b-col>
          </template>
      </b-row>

      <b-row class="page-body" v-else>
          <b-col class="mx-auto col-4 card shadow-card m-5">
              <b-icon-exclamation-circle variant="danger" class="mx-auto" style="margin-top: 10%;margin-bottom: 5%;" scale="2.5"/>
              <hr/>
              <h5 class="text-center mt-4 mb-3"> <b>Hubo un error cargando las facturas.</b></h5>
              <h6 class="text-center mb-5"> Por favor, volvé a iniciar el proceso de carga.</h6>
          </b-col>
      </b-row>

      <div class="row justify-content-center my-4" style="width: 100%;">
          <b-button variant="success" @click="volver">Volver</b-button>
      </div>
  </div>
</template>

<script>
import AbiertoAnualCard from '~/components/comercio/AbiertoAnualCard.vue';

export default {
  components: {
    AbiertoAnualCard
  },
  mounted() {
    window.addEventListener('keydown', this.preventReload);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.preventReload);
  },
  computed: {
    facturas(){
      return this.$store.state.facturas.all
    },
    tramite(){
      return this.$store.state.abiertoAnual.single
    },
    maestro(){
      return this.$store.state.maestro.single[0]
    },
    todosCorrectos() {
      return this.tramite.status.every(estado => estado === "Correcto")
    }
  },
  methods: {
    preventReload(event) {
      if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) {
        event.preventDefault();
        // Aquí puedes agregar cualquier lógica adicional que necesites.
        console.log('Intento de recarga bloqueado');
      }
    },
    async volver(){
      await this.$router.push('form')
    }
  },
  data() {
    return {
        periodos: []
    };
  }
};
</script>

  <style scoped>
  @media (max-width: 1200px){
    .DFE-card .subtitle{
      font-size: 28px !important;
    }
    .DFE-card p, .importante-card p{
      font-size: 18px !important;
    }
  }
  @media (max-width: 720px){
    .section-subtitle{
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
    .section-subtitle .li-content{
      padding-right: 0 !important;
      padding-top: 5px !important;
    }
    .bi-file-arrow-up{
      margin-left: 0 !important;
      margin-right: 0 !important;
      margin-bottom: 0.25rem !important;
    }
    .subtitle{
      font-size: 24px !important;
    }
    .sangria{
      margin-left: 0 !important;
    }
    .DFE-card p, .importante-card p{
      font-size: 18px !important;
      text-align: center;
    }
    .DFE-card .row{
      text-align: center !important;
      margin: 0 auto !important;
    }
    .DFE-card .col-md-2, .DFE-card .col-md-10{
      padding-right: 0 !important;
      padding-left: 0 !important;
    }
    .card{
      width: 90% !important;
      margin-left: 5% !important;
      margin-right: 5% !important;
    }
    .btn{
      width: 9rem !important;
    }
    .bi-ticket{
      width: 10% !important;
    }
    .modal-dialog{
      max-width: 100px !important;
    }
    .justify-content-center{
      margin: auto;
    }
    .bi-exclamation-circle{
      margin: 1rem auto !important;
      width: 100%;
    }

  }
    .section-subtitle  {
     width: 100%;
     margin: 0 2rem 2rem;
     color: #353535;
     font-size: 20px;
    }
    .section-subtitle .li-row{
      margin-bottom: 2rem;
    }
    .section-subtitle .li-icon{
      padding:0;
    }
    .section-subtitle .bi-file-arrow-up{
      margin: 0.5rem 1rem 1rem;
    }
    .section-subtitle .li-content{
      padding: 0 30% 0 1rem;
    }
    .section-subtitle .subtitle{
      font-size: 32px;
      color: #353535;
    }
    .section-subtitle .sangria{
      margin-left: 4rem;
    }
    .section-subtitle .sangria .bi-caret-right-fill{
      margin-right: 0.5rem;
    }
    .border-b{
      border-bottom: #BBB solid 2px;
    }
    .border-r{
      border-right: #BBB solid 2px;
    }
    .importante-card .col-md-2{
        margin: auto;
        text-align: center;
    }
    .page-body{
        padding-left: 10%;
        padding-right: 10%;
    }
    .year-subtitle{
        margin: 1rem auto;
        width: max-content;
    }
    .card-body{
        display: flex;
        flex-direction: column;
    }
    .validation-error {
      text-align: center;
      color: red;
      font-size: 14px;
      margin-top: 5px;
    }
    .btn-orange{
      background-color:#eb8a0a !important;
      border: none;
    }
    .text-green{
      color:#0c6919;
    }
    p{
      font-family: Calibri, 'Trebuchet MS', sans-serif;
      font-size: 1.5rem;
      font-weight: 500;
      color: #666;
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
    .icon-orange{
      color: #E27910;
    }
    .icon-green{
      color: #0c681a;
    }
    .importante-card{
      margin: 2rem auto;
    }
    .importante-card p{
      color: #353535;
      font-size: 1.25rem;
    }
    .importante-card .li-content{
        text-align: left;
        margin-bottom: 1rem;
    }
    .importante-card .card-body{
        padding-bottom: 0.25rem;
    }
    .importante-card .col-md-2 .li-title{
        margin-bottom: 1rem;
    }
    .DFE-card{
      min-width: 80% !important;
      background-color: #FACD8A;
      padding: 1rem;
      border-radius: 1rem;
      padding-bottom: 2rem;
    }
    .DFE-card .subtitle{
      margin-bottom: 1rem;
    }
    .DFE-card .subtitle a{
      color: #353535;
      text-decoration: underline;
    }
    .DFE-card p{
      font-size: 1.1rem;
      color: #353535;
    }
    .DFE-card .bi-exclamation-circle{
      margin-left: 20%;
      margin-top: 10%;
      text-align: center;
    }
    .b-row {
      height: 100%; /* Asegúrate de que el b-row tenga una altura definida (puede ser 100% o cualquier otra altura que desees). */
    }
    .li-icon, .li-title, label{
    font-weight: 600;
    color: #0c681a;
    font-size: 1rem !important;
    }
    label{
      font-weight: bold;
    }
    .li-title{
      margin-bottom: 0.3rem;
    }
    .li-icon{
      padding-right: 1%;
      vertical-align: top;
    }
    .li-row{
      display: flex;
      width: 100%;
    }
    .li-icon, .li-content{
      display: inline-block;
    }
    .bi-caret-right-fill, .bi-check{
      display: inline-block;
    }
    .bi-caret-right-fill{
      vertical-align: top;
      margin-top: 0.5rem;
      font-size: 1.05rem;
    }
    .bi-check{
      vertical-align: top;
    }
  </style>
