<template>
    <div class="page main-background">
        <Banner title="Comercio Abierto Anual"/>
        <b-row class="page-body" align-h="center">
          <div class="section-subtitle">
              <div class="li-row">
                <div class="li-icon border-b border-r">
                  <b-icon-file-arrow-up font-scale="2" class="icon-orange"></b-icon-file-arrow-up>
                </div>
                <div class="li-content border-b">                  
                    <p class="subtitle">Carga de documentación</p>
                </div>
              </div>
              <div class="li-row sangria">
                <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                <div class="li-conent">Seleccioná el período que corresponda  y subí la factura del legajo comercial declarado.</div>
              </div>
          </div>
          <b-col v-for="(periodo, index) in periodos" :key="index" cols="12" sm="8" md="6" lg="6" xl="4">
              <AbiertoAnualCard
              :periodo="periodo.periodo"
              :estado="periodo.estado"
              :fecha="periodo.fecha"
              :observaciones="periodo.observaciones"
              :maxDate="periodo.maxDate"
              />
          </b-col>
        </b-row>
        
        <b-row class="page-body" align-h="center">
            <b-card border-variant="warning" align-h="center" class="importante-card li-p" >
                <b-card-text>
                <b-row >
                    <b-col md="2">
                    <b-icon-exclamation-triangle variant="warning" font-scale="5"></b-icon-exclamation-triangle>
                    <p class="li-title"><u><b>¡Importante!</b></u></p>
                    </b-col>
                    <b-col  md="10">
                        <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Para habilitar un comercio del rubro <b>necesitás solicitar turno para llevar a cabo la inspección</b> correspondiente. Allí se constatará el cumplimiento de los requisitos mencionados previamente.</div></div>
                        <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Los turnos de Inspección se solicitan <b>luego de recibir el correo electrónico del Departamento Comercio</b> autorizando el Formulario de Solicitud de Habilitación (donde te indicarán los pasos a seguir para continuar).</div></div>
                    </b-col>
                </b-row>
                </b-card-text>
            </b-card>
        </b-row>
    </div>
</template>

<script>
import AbiertoAnualCard from '~/components/comercio/AbiertoAnualCard.vue';

export default {
  components: {
    AbiertoAnualCard
  },
  data() {
    return {
        periodos: [
            {
                periodo: 1,
                estado: 1,
                fecha: '--/--/--',
                observaciones: '',
                maxDate: '--/--/--'
            },
            {
                periodo: 2,
                estado: 2,
                fecha: '--/--/--',
                observaciones: '',
                maxDate: '--/--/--'
            },
            {
                periodo: 3,
                estado: 3,
                fecha: '--/--/--',
                observaciones: '',
                maxDate: '--/--/--'
            },
            {
                periodo: 1,
                estado: 4,
                fecha: '--/--/--',
                observaciones: 'foto del bulto',
                maxDate: '--/--/--'
            },
            {
                periodo: 2,
                estado: 5,
                fecha: '--/--/--',
                observaciones: '',
                maxDate: '--/--/--'
            },
            {
                periodo: 3,
                estado: 6,
                fecha: '--/--/--',
                observaciones: '',
                maxDate: '--/--/--'
            },
            {
                periodo: 1,
                estado: 7,
                fecha: '--/--/--',
                observaciones: 'sos burro',
                maxDate: '--/--/--'
            },
            {
                periodo: 2,
                estado: 8,
                fecha: '--/--/--',
                observaciones: '',
                maxDate: '--/--/--'
            },
            {
                periodo: 3,
                estado: 9,
                fecha: '--/--/--',
                observaciones: '',
                maxDate: '--/--/--'
            },
            {
                periodo: 1,
                estado: 10,
                fecha: '--/--/--',
                observaciones: '',
                maxDate: '--/--/--'
            }
            ]
    };
  }
};
</script>

  <style scoped>
  @media (max-width: 720px){    
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
  