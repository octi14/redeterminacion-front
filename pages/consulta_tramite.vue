<template>
  <div class="page main-background">
    <Banner title="Consulta de trámites"/>
    <div class="mx-auto">
      <div class="mt-3">
        <div class="row justify-content-center banner-container" style="width: 100%">
          <img src="../assets/consulta.png" style="max-width: 100%"/>
        </div>
        <b-card class="section-card col-md-6 mx-auto">
          <div class="li-row">
            <div class="li-icon"><b-icon-caret-right-fill font-scale="1.5" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">
              <p>Ingresá tu <b>número de trámite</b> para conocer en qué estado se encuentra.</p>
            </div>
          </div>
          <b-form>
            <b-form-input :disabled="enterKeyPressed" @keydown.enter.native="consultar" v-model="nroTramiteIngresado" type="number" size="lg" class="col-md-6 col-sm-10 mt-4 mx-auto" placeholder="Número de trámite" no-wheel></b-form-input>
          </b-form>
          <div class="btn-container col-sm-10">
            <b-button class="btn-cancel" @click="onResetParams">Cancelar</b-button>
            <b-button variant="success" @click="consultar">Aceptar</b-button>
          </div>
        </b-card>
      </div>

      <!-- Modal número de trámite incorrecto -->
      <b-modal v-model="showPopupFormError" @click-outside="showPopupFormError = false" :header-bg-variant="'danger'" centered>
        <template #modal-header>
          <div class="centeredContainer">
            <b-icon-exclamation-octagon scale="3" variant="light"/>
          </div>
        </template>
        <div class="centeredContainer modal-error">
          <p class="modal-subtitle">No hemos podido encontrar tu trámite.</p>
          <p class="">Por favor, corroborá que los datos ingresados sean correctos. Recordá que el número de trámite que te solicitamos fue enviado a tu correo electrónico.</p>
          <p class="minitext">Si el problema persiste, envianos un correo a <a class="icon-green">deptocomercio@gesell.gob.ar</a>.</p>
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
          <div class="centeredContainer">
            <b-icon-exclamation-octagon scale="3" variant="light"/>
          </div>
        </template>
        <div class="centeredContainer modal-error">
          <p class="modal-subtitle">No has ingresado un número de trámite.</p>
          <p class="">Por favor, completá este campo para continuar.</p>
        </div>
        <template #modal-footer>
          <div class="" style="margin: auto">
            <b-button @click="showPopupNoEntry = false" variant="danger" class="btn-danger" >Aceptar</b-button>
          </div>
        </template>
      </b-modal>

      <!-- Modal Tu trámite fue rechazado -->
      <b-modal v-model="showPopupRejected" @click-outside="showPopupRejected = false" header-class="lightblue" centered>
        <template #modal-header>
          <div class="centeredContainer">
            <b-icon-info-circle scale="2" variant="light"/>
          </div>
        </template>
        <div class="centeredContainer modal-primary">
          <p class="modal-subtitle">Tu trámite se encuentra<b class="modal-subtitle"> rechazado.</b></p>
          <p class="">El Dpto. Comercio te envió un correo electrónico indicando los motivos específicos de rechazo.</p>
          <p>Una vez solucionados los inconvenientes, volvé a iniciar el trámite completando nuevamente el formulario de habilitación online. </p>
          <p class="minitext">No olvides revisar la carpeta de "Spam" o "No deseados". </p>
        </div>
        <template #modal-footer>
          <div style="margin: auto">
            <b-button @click="showPopupRejected = false" class="btn-primary">Aceptar</b-button>
          </div>
        </template>
      </b-modal>

      <!-- Modal Tu trámite está en revisión -->
      <b-modal v-model="showPopupInit" @click-outside="showPopupInit = false" header-class="lightblue" centered>
        <template #modal-header>
          <div class="centeredContainer">
            <b-icon-info-circle scale="2" variant="light"/>
          </div>
        </template>
        <div class="centeredContainer modal-primary">
          <p class="modal-subtitle">Tu trámite se encuentra<b class="modal-subtitle"> en revisión.</b></p>
          <p>Durante los próximos días recibirás un correo electrónico del Departamento Comercio donde se te indicarán los pasos a seguir. </p>
          <p class="minitext" style="color:gray">No olvides revisar la carpeta de "Spam" o "No deseados". </p>
        </div>
        <template #modal-footer>
          <div style="margin: auto">
            <b-button @click="showPopupInit = false" class="btn-primary">Aceptar</b-button>
          </div>
        </template>
      </b-modal>

      <!-- Modal Tu trámite está en rectificación -->
      <b-modal v-model="showPopupResend" @click-outside="showPopupResend = false" header-class="lightblue" centered>
        <template #modal-header>
          <div class="centeredContainer">
            <b-icon-info-circle scale="2" variant="light"/>
          </div>
        </template>
        <div class="centeredContainer modal-primary">
          <p class="modal-subtitle">Tu trámite se encuentra en estado de <b class="modal-subtitle"> rectificación.</b></p>
          <p>Esto significa que alguno de los documentos cargados son incorrectos o no son legibles.
            El Departamento Comercio se comunicará por correo electrónico para indicarte los pasos a seguir para continuar el trámite.</p>
          <p class="minitext" style="color:gray">No olvides revisar la carpeta de "Spam" o "No deseados". </p>
        </div>
        <template #modal-footer>
          <div style="margin: auto">
            <b-button @click="showPopupResend = false" class="btn-primary">Aceptar</b-button>
          </div>
        </template>
      </b-modal>

      <!-- Modal El sistema espera que usted saque un turno -->
      <b-modal v-model="showPopupWaiting" @click-outside="showPopupWaiting = false" header-class="lightblue" centered>
        <template #modal-header>
          <div class="centeredContainer">
            <b-icon-info-circle scale="2" variant="light"/>
          </div>
        </template>
        <div class="centeredContainer modal-primary">
          <p class="modal-subtitle">Tu trámite se encuentra esperando turno de inspección.</p>
          <p> El departamento Comercio se comunicará por correo electrónico para indicarte que debés sacar turno para inspeccionar tu local.</p>
          <small>No olvides revisar la carpeta de “spam” o “no deseados”. </small>
        </div>
        <template #modal-footer>
          <div class="" style="margin: auto">
            <b-button @click="showPopupWaiting = false" variant="danger" class="btn-primary" >Aceptar</b-button>
          </div>
        </template>
      </b-modal>

      <!-- Modal Usted ya ha solicitado un turno -->
      <b-modal v-model="showPopupAlready" @click-outside="showPopupAlready = false" header-class="lightblue" centered>
        <template #modal-header>
          <div class="centeredContainer">
            <b-icon-info-circle scale="2" variant="light"/>
          </div>
        </template>
        <div class="centeredContainer modal-primary">
          <p class="modal-subtitle">Tu trámite se encuentra <b class="modal-subtitle">pendiente de inspección.</b></p>
          <p> El personal de inspección visitará tu comercio en el día y horario que solicitaste.</p>
          <small>Recordá que el día de la inspección debe haber alguien presente en el local. En caso de querer cancelar el turno
             comunicate con <a class="icon-green"> divinspectores@gesell.gob.ar. </a></small>
        </div>
        <template #modal-footer>
          <div class="" style="margin: auto">
            <b-button @click="showPopupAlready = false" variant="danger" class="btn-primary">Aceptar</b-button>
          </div>
        </template>
      </b-modal>

      <!-- Modal Prórrogas -->
      <b-modal v-model="showPopupProrroga" @click-outside="showPopupProrroga = false" header-class="lightblue" centered>
        <template #modal-header>
          <div class="centeredContainer">
            <b-icon-info-circle scale="2" variant="light"/>
          </div>
        </template>
        <div class="centeredContainer modal-primary">
          <p class="modal-subtitle">Tu trámite se encuentra en prórroga de inspección.</p>
          <p class="mx-auto" style="font-size:1.1rem"> Tu local aún no cumple con todas las condiciones necesarias para habilitar y se te asignaron 7 días hábiles para realizar los cambios indicados. </p>
          <p style="font-size:1rem; color:gray">Una vez terminado ese lapso, nuestros/as inspectores/as volverán a visitarte para continuar con el trámite.</p>
        </div>
        <template #modal-footer>
          <div class="" style="margin: auto">
            <b-button @click="showPopupProrroga = false" variant="danger" class="btn-primary">Aceptar</b-button>
          </div>
        </template>
      </b-modal>

      <!-- Modal su comercio fue inspeccionado  -->
      <b-modal v-model="showPopupInspected" @click-outside="showPopupInspected = false" header-class="lightblue" centered>
        <template #modal-header>
          <div class="centeredContainer">
            <b-icon-info-circle scale="2" variant="light"/>
          </div>
        </template>
        <div class="centeredContainer modal-success">
          <p class="modal-subtitle">Tu comercio ha sido inspeccionado.</p>
          <p> Un/a inspector/a visitó tu local y certificó que cumple con todas las condiciones necesarias para habilitar.</p>
          <p>A continuación el Departamento Comercio se comunicará con vos por correo electrónico para indicarte cómo continuar.</p>
          <small>No olvides revisar la carpeta de "spam" o "no deseados".</small>
        </div>
        <template #modal-footer>
          <div class="" style="margin: auto">
            <b-button @click="showPopupInspected = false" variant="danger" class="btn-primary">Aceptar</b-button>
          </div>
        </template>
      </b-modal>

      <!-- Modal Su trámite está esperando documentación -->
      <b-modal v-model="showPopupWaitingDoc" @click-outside="showPopupWaitingDoc = false" header-class="lightblue" centered>
        <template #modal-header>
          <div class="centeredContainer">
            <b-icon-info-circle scale="2" variant="light"/>
          </div>
        </template>
        <div class="centeredContainer modal-primary">
          <p class="modal-subtitle">Tu trámite se encuentra esperando documentación.</p>
          <p> Estás a punto de finalizar tu trámite. El Departamento Comercio te envió un correo electrónico indicándote los pasos a seguir.</p>
          <small class="minitext">No olvides revisar la carpeta de “spam” o “no deseados”.</small>
        </div>
        <template #modal-footer>
          <div class="" style="margin: auto">
            <b-button @click="showPopupWaitingDoc = false" variant="danger" class="btn-primary">Aceptar</b-button>
          </div>
        </template>
      </b-modal>

            <!-- Modal Su trámite está esperando pago -->
      <b-modal v-model="showPopupWaitingPay" @click-outside="showPopupWaitingPay = false" header-class="lightblue" centered>
        <template #modal-header>
          <div class="centeredContainer">
            <b-icon-info-circle scale="2" variant="light"/>
          </div>
        </template>
        <div class="centeredContainer modal-primary">
          <p class="modal-subtitle">Tu trámite se encuentra en proceso de facturación.</p>
          <p> El Departamento Comercio te envió un correo electrónico indicándote los pasos a seguir para finalizar el trámite.</p>
          <small class="minitext">No olvides revisar la carpeta de “spam” o “no deseados”.</small>
        </div>
        <template #modal-footer>
          <div class="" style="margin: auto">
            <b-button @click="showPopupWaitingPay = false" variant="danger" class="btn-primary">Aceptar</b-button>
          </div>
        </template>
      </b-modal>

      <!-- Modal Su trámite fue finalizado -->
      <b-modal v-model="showPopupFinished" @click-outside="showPopupFinished = false" header-class="lightblue" centered>
        <template #modal-header>
          <div class="centeredContainer">
            <b-icon-info-circle scale="2" variant="light"/>
          </div>
        </template>
        <div class="centeredContainer modal-success">
          <p class="modal-subtitle">Tu trámite ha sido finalizado.</p>
          <p> Tu solicitud ha sido aprobada con el expediente nro. <b>{{ nroExpediente }}.</b></p>
        </div>
        <template #modal-footer>
          <div class="" style="margin: auto">
            <b-button @click="showPopupFinished = false" variant="danger" class="btn-primary" >Aceptar</b-button>
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
      nroExpediente: null,
      sendingForm: false,
      token: 0,
      enterKeyPressed: false,
      showPopupFormError: false,
      showPopupNoEntry: false,
      showPopupInit: false,
      showPopupResend: false,
      showPopupWaiting: false,
      showPopupAlready: false,
      showPopupProrroga: false,
      showPopupInspected: false,
      showPopupWaitingDoc: false,
      showPopupWaitingPay: false,
      showPopupRejected: false,
      showPopupFinished: false,
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
            switch (status) {
              case "En revisión":
                this.showPopupInit = true
                break
              case "Rechazada":
                this.showPopupRejected = true
                break
              case "Finalizada":
                this.nroExpediente = this.$store.state.habilitaciones.single.nroExpediente
                this.showPopupFinished = true
                break
              case "Esperando turno":
                this.showPopupWaiting = true
                break
              case "Prórroga 1":
                this.showPopupProrroga = true
                break
              case "Prórroga 2":
                this.showPopupProrroga = true
                break
              case "Esperando inspección":
                await this.$store.dispatch('turnos/getSingle', { nroTramite })
                this.showPopupAlready = true
                break
              case "Inspeccionado":
                await this.$store.dispatch('turnos/getSingle', { nroTramite })
                this.showPopupInspected = true
                break

              case "Esperando documentación":
                this.showPopupWaitingDoc = true
                break
              case "Esperando pago":
                this.showPopupWaitingPay = true
                break
              case "Rectificación":
                this.showPopupResend = true
                break
              default:
                // Handle any other cases or provide a default behavior
                break
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

  .modal-content .centeredContainer{
    margin: 1rem auto;
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

  .modal-primary .modal-subtitle{
    color: #1d96fe !important;
  }

  .modal-error .centeredContainer{
    text-align: center;
  }

  .modal-error p{
    color: black;
    font-weight: 500;
    font-size: 1.1rem;
    padding: 0 1rem;
  }
  .modal-error .minitext{
    font-size: 0.9rem;
    font-weight: 100;
  }

  .modal-primary p{
    color: black;
    font-weight: 500;
    font-size: 1.1rem;
    padding: 0 1rem;
  }
  .modal-primary .minitext{
    font-size: 0.9rem;
    font-weight: 100;
  }

  .modal-success p{
    color: black;
    font-weight: 500;
    font-size: 1.1rem;
    padding: 0 1.5rem;
  }
  .modal-success .minitext{
    font-size: 0.8rem;
    font-weight: 100;
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

  .btn-cancel:hover{
    background-color: #f09658;
    border-color: #f09658;
  }
  .btn-cancel{
    background-color: #e53749;
    border-color: #e53749;
  }
  .btn-primary{
    background-color: #2A43A1;
    border-color: #2A43A1;
  }
  .btn-primary:hover{
    background-color: #589ff0;
    border-color: #589ff0;
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
  .icon-orange{
  color: #E27910;
}

  .li-icon, .li-title, label{
  font-weight: 600;
  color: #0c681a;
  font-size: 1rem !important;
  }
  label{
    font-weight: bold;
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

