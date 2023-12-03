<template>
  <div class="page main-background">
    <Banner title="Consulta de trámites"/>
    <div class="mx-auto">
      <div class="mt-3">
        <div class="row justify-content-center banner-container" style="width: 100%">
          <img src="../assets/turnera-banner-1.png" style="max-width: 100%"/>
        </div>
        <b-card class="section-card col-md-6 mx-auto">
          <div class="li-row">
            <div class="li-icon"><b-icon-caret-right-fill font-scale="1.5" class="icon-green"></b-icon-caret-right-fill></div><div class="li-content">
              <p>Ingresá tu <b>número de trámite</b> para conocer el estado del mismo.</p>
            </div>
          </div>
          <b-form>
            <b-form-input :disabled="enterKeyPressed" @keydown.enter.native="consultar" v-model="nroTramiteIngresado" type="number" size="lg" class="col-md-6 col-sm-10 mt-4 mx-auto" placeholder="Número de trámite" no-wheel></b-form-input>
          </b-form>
          <div class="btn-container">
            <b-button class="btn-cancel" @click="onResetParams">Cancelar</b-button>
            <b-button @click="consultar">Aceptar</b-button>
          </div>
        </b-card>
      </div>

      <!-- Modal número de trámite incorrecto -->
      <b-modal v-model="showPopupFormError" @click-outside="showPopupFormError = false" :header-bg-variant="'danger'" centered>
        <template #modal-header>
          <div class="centeredContainer"><h3>
              <b-icon-exclamation-octagon scale="1.5" variant="light"></b-icon-exclamation-octagon>
          </h3></div>
        </template>
        <div class="centeredContainer modal-error">
          <p class="modal-subtitle">No hemos podido encontrar tu número de trámite</p>
          <p class="">Por favor, corroborá que los datos ingresados sean correctos. Recordá que el número de trámite que te solicitamos fue enviado a tu correo electrónico.</p>
          <p class="minitext">Si el problema persiste, envianos un correo a <a target="_blank" href="mailto:deptocomercio@gesell.gob.ar" class="icon-green">deptocomercio@gesell.gob.ar</a>.</p>
        </div>
        <template #modal-footer>
          <div class="" style="margin: auto">
            <b-button @click="showPopupFormError = false" variant="danger" class="btn-cancel" >Aceptar</b-button>
          </div>
        </template>
      </b-modal>

      <!-- Modal No estás habilitado a sacar turno todavía -->
      <b-modal v-model="showPopupNotAllowed" @click-outside="showPopupNotAllowed = false" :header-bg-variant="'secondary'" centered>
        <template #modal-header>
          <div class="centeredContainer">
            <b-icon-exclamation-octagon scale="3" variant="light"></b-icon-exclamation-octagon>
          </div>
        </template>
        <div class="centeredContainer modal-warning">
          <p class="modal-subtitle text-secondary">Tu trámite no está habilitado para reservar un turno.</p>
          <p class="">Tu solicitud no ha sido aprobada o bien tu comercio no necesita inspección para ser habilitado.</p>
          <p class="">Revisá tu correo electrónico para corroborar si tu solicitud fue aprobada sin necesitar inspección.</p>
          <p class="minitext">Si tenés dudas, envianos un correo a <a target="_blank" href="mailto:deptocomercio@gesell.gob.ar" class="icon-green">deptocomercio@gesell.gob.ar</a>.</p>
        </div>
        <template #modal-footer>
          <div style="margin: auto">
            <b-button @click="showPopupNotAllowed = false" variant="primary">Aceptar</b-button>
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
          <p class="modal-subtitle">No has ingresado un número de trámite.</p>
          <p class="">Por favor, completá este campo para continuar.</p>
        </div>
        <template #modal-footer>
          <div class="" style="margin: auto">
            <b-button @click="showPopupNoEntry = false" variant="danger" class="btn-cancel" >Aceptar</b-button>
          </div>
        </template>
      </b-modal>

      <!-- Modal Usted ya ha solicitado un turno -->
      <b-modal v-model="showPopupAlready" @click-outside="showPopupAlready = false" :header-bg-variant="'success'" centered>
        <template #modal-header>
          <div class="centeredContainer"><h3>
              <b-icon-exclamation-octagon scale="1.5" variant="light"></b-icon-exclamation-octagon>
          </h3></div>
        </template>
        <div class="centeredContainer modal-success">
          <p class="modal-subtitle">Tu turno para inspección se encuentra en curso.</p>
          <p> El personal de inspección estará en tu comercio el día {{ turno ? turno.dia : ""}}.</p>
          <p class="">Si deseas cancelarlo o reprogramarlo, debes comunicarte con divinspectores@gesell.gob.ar.</p>
          <small style="color:black">Recordá que podés cancelar el turno sólo hasta 5 días antes del momento de inspección. </small>
        </div>
        <template #modal-footer>
          <div class="" style="margin: auto">
            <b-button @click="showPopupAlready = false" variant="danger" class="btn-cancel" >Aceptar</b-button>
          </div>
        </template>
      </b-modal>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      nroTramite: null,
      nroTramiteIngresado: null,
      nombre: '',
      dni: '',
      domicilio: '',
      localidad: '',
      sendingForm: false,
      token: 0,
      enterKeyPressed: false,
      showPopupFormError: false,
      showPopupNoEntry: false,
      showPopupNotAllowed: false,
      showPopupAlready: false,
    };
  },
  methods: {
    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    addDays(date, days) {
      date.setDate(date.getDate() + days);
      return date;
    },
    daysFromNow() {
      return this.addDays(new Date(), this.maxRange);
    },
    async consultar() {
      this.enterKeyPressed = true
      if (!this.nroTramiteIngresado) {
        this.showPopupNoEntry = true
      } else {
        try{
          const nroTramite = this.nroTramiteIngresado
          await this.$store.dispatch('habilitaciones/getByNroTramite',  { nroTramite })
          if(this.$store.state.habilitaciones.single){
            const status = this.$store.state.habilitaciones.single.status
            if(status === "Esperando turno"){
              this.nroTramite = this.nroTramiteIngresado
              this.localidad = this.$store.state.habilitaciones.single.localidad
              this.page += 1
              await this.$store.dispatch('turnos/getAll')
            }else{
              if(status === "Esperando inspección" || status === "Prórroga 1" || status === "Prórroga 2" || status === "Inspeccionado"){
                await this.$store.dispatch('turnos/getSingle', { nroTramite })
                this.showPopupAlready = true
              }else{
                this.showPopupNotAllowed = true
              }
            }
          }else{
            this.showPopupFormError = true
          }
        }catch(e){
          console.log(e)
          this.$bvToast.toast('Algo salió mal buscando la habilitación.', {
            title: 'Error',
            variant: 'danger',
            appendToast: true,
            solid: true,
            toaster: 'b-toaster-top-center',
          });
        }
      }
      this.wait(500)
      this.enterKeyPressed = false
    },
    onResetParams() {
      this.$router.push('/');
      this.nroTramite = null,
      this.token = null,
      this.formOk = false;
    },
  },
  computed: {
    formattedDate() {
      if (this.date) {
        const day = this.date.getDate();
        const month = this.date.getMonth() + 1;
        const year = this.date.getFullYear();
        return `${day}/${month}/${year}`;
      }
      return '';
    },
    turno(){
      return this.$store.state.turnos.single
    },
  },
};
</script>

<style scoped>
  .green{
    background-color:#0b6919;
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
    color: #666;
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
  .section-card h5 .bi-calendar-check{
    font-size: 2.5rem;
    margin-right: 0.5rem;
    padding-right: 0.75rem;
    border-right: 1px solid #999;
  }
  .icon-green{
    color: #0c681a;
  }
  .importante-card{
    margin: 2rem auto;
  }
  .importante-card p{
    color: #333;
    font-size: 1.25rem;
  }
  .v-align {
  display: flex;
  align-items: center;
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

