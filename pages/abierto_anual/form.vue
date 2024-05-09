<template>
  <div class="page main-background">
    <Banner title="Comercio Abierto Anual"/>
    <div class="mx-auto">
      <div class="mt-3" v-if="page === 0">
        <!-- <div class="row justify-content-center banner-container" style="width: 100%">
          <img src="../../assets/turnera-banner-1.png" style="max-width: 100%"/>
        </div> -->
        <b-card class="section-card col-md-6 mx-auto">
          <div class="li-row">
            <div class="li-icon"><b-icon-caret-right-fill font-scale="1.5" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content"><p>Estás a punto de iniciar la carga de comprobantes para obtener el beneficio de Abierto Anual.</p></div>
          </div>
          <div class="li-row">
            <div class="li-icon"><b-icon-caret-right-fill font-scale="1.5" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content"><p>Para comenzar, ingresá los siguientes datos del comercio:</p></div>
          </div>
          <b-form>
            <b-row>
              <label for="cuit" class="col-6">CUIT/CUIM del titular del comercio: </label>
              <b-form-input class="col-6" :disabled="enterKeyPressed" v-model="cuit" id="cuit" type="number" placeholder="Ingrese su CUIT/CUIM" no-wheel></b-form-input>
            </b-row>
            <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
            <b-row>
              <label for="nroLegajo" class="col-6"> N° de legajo comercial: <b-icon-question-circle-fill font-scale="1.25" variant="info"></b-icon-question-circle-fill></label>
              <b-form-input class="col-6" :disabled="enterKeyPressed" v-model="nroLegajo" id="nroLegajo" type="number" placeholder="Ingrese un N° de Legajo Comercial" no-wheel></b-form-input>
            </b-row>
          </b-form>
          <div class="btn-container">
            <b-button class="btn-cancel" @click="onResetParams">Cancelar</b-button>
            <b-button @click="sendData">Aceptar</b-button>
          </div>
        </b-card>
      </div>

    </div>

    <!-- Modal número de trámite incorrecto -->
    <b-modal v-model="showPopupFormError" @click-outside="showPopupFormError = false" :header-bg-variant="'danger'" centered>
      <template #modal-header>
        <div class="centeredContainer"><h3>
            <b-icon-exclamation-octagon scale="1.5" variant="light"></b-icon-exclamation-octagon>
        </h3></div>
      </template>
      <div class="centeredContainer modal-error">
        <p class="modal-subtitle">No hemos podido encontrar tu comercio</p>
        <p class="">Por favor, corroborá que los datos ingresados sean correctos.</p>
        <p class="minitext">Si el problema persiste, envianos un correo a <a target="_blank" href="mailto:diarvige@gesell.gob.ar" class="icon-green">dirarvige@gesell.gob.ar</a>.</p>
      </div>
      <template #modal-footer>
        <div class="" style="margin: auto">
          <b-button @click="showPopupFormError = false" variant="danger" class="btn-cancel" >Aceptar</b-button>
        </div>
      </template>
    </b-modal>

    <!-- Modal No ha ingresado un número de trámite -->
    <b-modal v-model="showPopupNoEntry" @click-outside="showPopupNoEntry = false" :header-bg-variant="'danger'" centered>
      <template #modal-header>
        <div class="centeredContainer"><h3>
            <b-icon-exclamation-octagon scale="1.5" variant="light"></b-icon-exclamation-octagon>
        </h3></div>
      </template>
      <div class="centeredContainer modal-error">
        <p class="modal-subtitle">No has ingresado un CUIT o un número de legajo válidos.</p>
        <p class="">Por favor, completá este campo para continuar.</p>
      </div>
      <template #modal-footer>
        <div class="" style="margin: auto">
          <b-button @click="showPopupNoEntry = false" variant="danger" class="btn-cancel" >Aceptar</b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

  <script>
  import maestroComercial from "@/plugins/maestroComercial.js";
  export default {
    data() {
      return {
        cuit: null,
        nroLegajo: null,
        page: 0,
        formOk: false,
        sendingForm: false,
        token: 0,
        enterKeyPressed: false,
        showPopupFormError: false,
        showPopupNoEntry: false,
        showPopupNotAllowed: false,
        showPopupAlready: false,
      };
    },
    computed: {
      maestro(){
        return this.$store.state.maestro.all
      }
    },
    methods: {
      wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      },
      async sendData() {
        this.enterKeyPressed = true
        if (!this.cuit || !this.nroLegajo) {
          this.showPopupNoEntry = true
        } else {
          await this.$store.dispatch('maestro/get')
          const result = this.maestro.filter((item) => item.cuit == this.cuit && item.legajo == this.nroLegajo)
          if(result.length > 0){
            try{
              const cuit = Number(this.cuit)
              const nroLegajo = Number(this.nroLegajo)
              const response = await this.$store.dispatch('abiertoAnual/getByCuitLegajo',{
                cuit: cuit,
                nroLegajo: nroLegajo,
              })
              if(!response){
                await this.$store.dispatch('abiertoAnual/create',{
                  cuit: this.cuit,
                  nroLegajo: this.nroLegajo,
                })
                const response = await this.$store.dispatch('abiertoAnual/getByCuitLegajo',{
                  cuit: cuit,
                  nroLegajo: nroLegajo,
                })
              }
            }catch(e){
              console.log(e)
              this.$bvToast.toast('Algo salió mal buscando el trámite', {
                title: 'Error',
                variant: 'danger',
                appendToast: true,
                solid: true,
                toaster: 'b-toaster-top-center',
              });
            }
            const id = this.$store.state.abiertoAnual.single.id
            await this.$store.dispatch('facturas/getById', {id})
            await this.$router.push('/abierto_anual/periodos')
          }else{
            this.showPopupFormError = true
        }
      }
      this.enterKeyPressed = false
    },
    onResetParams() {
      this.$router.push('/abierto_anual');
      this.page = 0;
      this.printing = false;
      this.formOk = false;
      this.cuit = null;
      this.nroLegajo = null;
    },
  },
    // computed: {
    //   areAllFieldsComplete(){
    //       return (this.date && this.time && this.nroTramite && this.nombre && this.dni && this.domicilio)
    //   }
    // },
  };
  </script>

  <style scoped>
  @media (max-width: 720px){
    .banner-container{
      margin:auto;
    }
    .section-card{
      padding: 1rem 1rem !important;
    }
    .card{
      width: 90% !important;
      margin-left: 5% !important;
      margin-right: 5% !important;
    }
    .btn{
      width: 9rem !important;
    }
    .modal-dialog{
      max-width: 100px !important;
    }
    .justify-content-center{
      margin: auto;
    }
  }
    form{
      width: 90%;
      text-align: right;
      float: right;
      margin-bottom: 1rem;
    }
    form .row{
      margin-right: 0;
      margin-bottom: 1rem;
    }
    form label{
      color: #353535;
      padding-top: 0.25rem;
    }
    form input{
      width: 50%;
    }
    .validation-error {
      text-align: center;
      color: red;
      font-size: 14px;
      margin-top: 5px;
    }
    .green{
      background-color:#0b6919;
    }
    .disabled-option {
      color: rgb(164, 163, 163);
    }
    .btn-orange{
      background-color:#eb8a0a !important;
      border: none;
    }
    .text-green{
      color:#0c6919;
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
    p{
      font-family: Calibri, 'Trebuchet MS', sans-serif;
      font-size: 1.5rem;
      font-weight: 500;
      color: #353535;
    }
    .modal-open .modal-dialog{
      max-width: 600px;
    }
    .modal-body p{
      text-align: center;
    }
    .modal-content .bg-danger{
      background-color: #e53749 !important;
    }
    .modal-content .bg-success{
      background-color: #0c681a !important;
    }
    .modal-content .centeredContainer{
      margin: 1rem auto;
    }
    .modal-content p{
      padding: 1rem 2rem;
      font-size: 1rem;
    }
    .modal .modal-subtitle{
      color: #0c681a !important;
      font-size: 1.25rem;
      font-weight: bold;
      margin-bottom: 15px;
      padding-top: 0;
    }
    .modal-error .modal-subtitle{
      color: #e53749 !important;
    }

    .modal-warning .modal-subtitle{
      color: #ddbc04 !important;
    }

    .modal-error .centeredContainer{
      text-align: center;
    }

    .modal-error p{
      color: black;
      font-weight: 500;
      padding: 0 1rem;
    }
    .modal-error .minitext{
      font-size: 0.8rem;
      font-weight: 100;
    }

    .modal-success p{
      color: black;
      font-weight: 500;
      font-size: 1.2rem;
      padding: 0 1.5rem;
    }
    .modal-success .minitext{
      font-size: 0.8rem;
      font-weight: 100;
    }

    .modal-warning p{
      color: black;
      font-weight: 500;
      padding: 0 1rem;
    }
    .modal-warning .minitext{
      font-size: 0.9rem;
      font-weight: 100;
    }

    .section-card{
      margin: 2rem auto !important;
      padding: 2rem 4rem;
      border-radius: 1rem;
      box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.75);
      -webkit-box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.75);
      -moz-box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.75);
    }
    .section-card .btn-container{
      width: fit-content;
      margin: auto;
      margin-top: 2rem;
    }
    .section-card .btn{
      padding: 0.5rem 3rem;
      font-weight: 500;
      font-size: 1rem;
      padding-right: 0;
      padding-left: 0;
      width: 10rem;
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
    .section-card h5{
      font-size: 2rem;
      font-weight: bold;
      padding: 0.75rem 0;
      margin: 0;
      color: #0c681a;
      border-bottom: 2px solid #CCC;
      margin-bottom: 1rem;
    }
    .section-card h5 .bi-calendar-check, .section-card h5 .bi-clock, .section-card h5 .bi-ticket{
      margin-right: 0.5rem;
      border-right: 1px solid #999;
      font-size: 2.5rem;
      padding-right: 0.75rem;
    }
    .section-card h5 .bi-ticket{
      width: 5%;
    }
    .icon-orange{
      color: #E27910;
    }
    .icon-green{
      color: #0c681a;
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
      margin-right: 1%;
      vertical-align: top;
    }
    .li-row{
      display: flex;
      width: 100%;
    }
    .li-icon, .li-content{
      display: inline-block;
    }
    .li-p{
      margin-bottom: 1rem;
    }
    .sub-li p{
      font-size: 1.3rem;
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
  </style>
