<template>
  <div class="page main-background">
    <Banner title="Inspección de Comercios"/>
    <div class="mx-auto">
      <div class="mt-3" v-if="page === 0">
        <div class="row justify-content-center banner-container" style="width: 100%">
          <img src="../../assets/turnera-banner-1.png" style="max-width: 100%"/>
        </div>
        <b-card class="section-card col-md-6 mx-auto">
          <div class="li-row">
            <div class="li-icon"><b-icon-caret-right-fill font-scale="1.5" class="icon-green"></b-icon-caret-right-fill></div><div class="li-content"><p>Estás a punto de seleccionar un turno de inspección para tu comercio.</p></div>
          </div>
          <div class="li-row">
            <div class="li-icon"><b-icon-caret-right-fill font-scale="1.5" class="icon-green"></b-icon-caret-right-fill></div><div class="li-content"><p>Para iniciar, ingresá el <b>número de trámite</b> que recibiste luego de haber enviado el Formulario de Solicitud de Habilitaciones.</p></div>
          </div>
          <b-form>
            <b-form-input :disabled="enterKeyPressed" @keydown.enter.native="onNextPage" v-model="nroTramiteIngresado" type="number" size="lg" class="col-md-6 col-sm-10 mt-4 mx-auto" placeholder="Número de trámite" no-wheel></b-form-input>
          </b-form>
          <div class="btn-container">
            <b-button class="btn-cancel" @click="onResetParams">Cancelar</b-button>
            <b-button @click="onNextPage">Aceptar</b-button>
          </div>
        </b-card>
      </div>
      <b-form class="mt-3">
        <div v-if="page === 1">
          <div class="row justify-content-center" style="width: 100%">
            <img src="../../assets/turnera-banner-2.png" style="max-width: 100%"/>
          </div>
          <b-card class="section-card col-md-6 mx-auto">
            <h5>
              <b-icon-calendar-check class="icon-orange" />
              Selección de fecha
            </h5>
            <div class="li-row">
              <div class="li-icon"><b-icon-caret-right-fill font-scale="1.5" class="icon-green"></b-icon-caret-right-fill></div><div class="li-content"><p>Elegí una fecha dentro de los días señalados.</p></div>
            </div>
            <div class="li-row">
              <div class="li-icon"><b-icon-caret-right-fill font-scale="1.5" class="icon-green"></b-icon-caret-right-fill></div><div class="li-content"><p>Tené en cuenta que las inspecciones se llevan a cabo en diferentes días de la semana dependiendo del lugar donde se encuentre tu comercio. Por eso, sólo podrás elegir los días correspondientes a la localidad que informaste al iniciar el trámite de habilitación:</p></div>
            </div>
            <div class="col-md-10 mx-auto">
              <div class="li-row">
                <div class="li-icon"><b-icon-check font-scale="2" class="icon-green"></b-icon-check></div><div class="li-content sub-li"><p><b>Villa Gesell:</b> Lunes, Martes y Miércoles</p></div>
              </div>
              <div class="li-row">
                <div class="li-icon"><b-icon-check font-scale="2" class="icon-green"></b-icon-check></div><div class="li-content sub-li"><p><b>Mar de Las Pampas / Colonia Marina / Las Gaviotas / Mar Azul:</b>  Jueves y Viernes.</p></div>
              </div>
            </div>
            <b-calendar
              class="col-8 mx-auto mt-3"
              block hide-header
              :date-format-options="{ year: 'numeric', day: '2-digit', weekday: 'short' }"
              :min="addDays(new Date(),2)"
              :max="daysFromNow()"
              locale="es"
              value-as-date
              :date-disabled-fn="dateDisabled"
              v-model="datePicked"
            />
            <div class="btn-container">
              <b-button @click="page-= 1" class="btn-cancel">Volver</b-button>
              <b-button @click="onNextPage">Continuar</b-button>
            </div>
          </b-card>
        </div>
        <div v-if="page === 2">
          <div class="row justify-content-center" style="width: 100%">
            <img src="../../assets/turnera-banner-3.png" style="max-width: 100%"/>
          </div>
          <b-card class="section-card col-md-6 mx-auto">            
            <h5>
              <b-icon-clock class="icon-orange"></b-icon-clock>
              Selección de horario
            </h5>
            <div class="li-row">
              <div class="li-icon"><b-icon-caret-right-fill font-scale="1.5" class="icon-green"></b-icon-caret-right-fill></div><div class="li-content"><p>Seleccioná una franja horaria para recibir la visita de inspección.</p></div>
            </div>
            <b-form-select v-model="timePicked" class="col-11 mx-auto">
              <!-- <b-form-select-option
                v-for="(_, index) in horariosDisponibles"
                :key="index"
                :value="horario"
              >
                Franja horaria: {{ horariosDisponibles[index] }} - <span class="icon-orange">{{ horariosDisponibles[index]+ }}</span>
              </b-form-select-option> -->
              <b-form-select-option :value="horariosDisponibles[0]" :disabled="timeDisabled(horariosDisponibles[0])" 
                :class="{ 'disabled-option': timeDisabled(horariosDisponibles[0]) }">
                Franja horaria: {{ horariosDisponibles[0] }} - <span class="icon-orange">{{ horariosDisponibles[1] }}</span>
              </b-form-select-option>
              <b-form-select-option :value="horariosDisponibles[1]" :disabled="timeDisabled(horariosDisponibles[1])" 
                :class="{ 'disabled-option': timeDisabled(horariosDisponibles[1]) }">
                Franja horaria: {{ horariosDisponibles[1] }} - <span class="icon-orange"> 13:30 </span>
              </b-form-select-option>
            </b-form-select>
            <div class="btn-container">
              <b-button @click="page-= 1" class="btn-cancel">Volver</b-button>
              <b-button @click="onNextPage">Continuar</b-button>
            </div>
          </b-card>
        </div>
        <div v-if="page === 3">
          <div class="row justify-content-center" style="width: 100%">
            <img src="../../assets/turnera-banner-4.png" style="max-width: 100%"/>
          </div>
          <b-card class="section-card col-md-6 mx-auto">
            <h5><img class="bi-ticket" src="../../assets/icon-num-rifa.png" /> Confirmación de turno</h5>
            <div class="li-row">
              <div class="li-icon"><b-icon-caret-right-fill font-scale="1.5" class="icon-green"></b-icon-caret-right-fill></div><div class="li-content"><p>Completá los datos que te solicitamos a continuación.</p></div>
            </div>
            <div class="li-row">
              <div class="li-icon"><b-icon-caret-right-fill font-scale="1.5" class="icon-green"></b-icon-caret-right-fill></div><div class="li-content"><p> Al finalizar se emitirá un comprobante que deberás mostrar el día de la inspección.</p></div>
            </div>
            <div class="col-10 mx-auto">
               <b-form-group>
                <label for="nombre">Nombre</label>
                <b-form-input id="nombre" v-model="nombre" required></b-form-input>
                <label for="dni">Nro. de documento</label>
                <b-form-input id="dni" v-model="dni" type="number" required></b-form-input>
                <label for="domicilio">Domicilio del comercio</label>
                <b-form-input id="domicilio" v-model="domicilio" required></b-form-input>
              </b-form-group>
            </div>
            <b-card border-variant="warning" align="center" class="importante-card" >
              <b-card-text>
                <b-row class="v-align">
                  <b-col md="2">
                    <b-icon-exclamation-triangle variant="warning" font-scale="4"></b-icon-exclamation-triangle>
                    <p class="li-title"><u><b>¡Importante!</b></u></p>
                  </b-col>
                  <b-col  md="10">
                    <p>Es importante que el día de la inspección haya alguien presente en el local. En caso contrario perderás el turno y deberás solicitar uno nuevo.</p>
                  </b-col>
                </b-row>
              </b-card-text>
            </b-card>
            <div class="btn-container">
              <b-button @click="page-= 1" class="btn-cancel">Volver</b-button>
              <b-button :disabled="sendingForm || !areAllFieldsComplete"  @click="onSelectTurno">Continuar</b-button>
            </div>            
            <div v-if="!areAllFieldsComplete" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Falta completar información.
            </div>
          </b-card>
        </div>
      </b-form>
        <!-- Comprobante (página 4) -->
        <div v-if="page === 4">
          <b-card no-body border-variant="success" style="margin-top: 80px" class="shadow col-md-5 col-sm-8 mx-auto">
            <b-card-header class="row" header-class="green text-light">
              <h5><b>Comprobante de turno - </b> Inspección</h5>
            </b-card-header>
            <b-card-body class="text-center">
              <div class="row"><b-icon-check scale="1.2" class="icon-orange mt-1"/><h5><b class="text-green ml-1">Día: </b> {{ formattedDate }}</h5> </div>
              <div class="row" v-if="time === '08.30'"><b-icon-check scale="1.2" class="icon-orange mt-1"/><h5><b class="text-green ml-1">Horario: </b> {{ time }} - 11.30 </h5> </div>
              <div class="row" v-if="time === '11.30'"><b-icon-check scale="1.2" class="icon-orange mt-1"/><h5><b class="text-green ml-1">Horario: </b> {{ time }} - 13.30 </h5> </div>
              <div class="row"><b-icon-check scale="1.2" class="icon-orange mt-1"/><h5><b class="text-green ml-1">Nro de trámite:</b> {{ nroTramite }}</h5> </div>
              <div class="row"><b-icon-check scale="1.2" class="icon-orange mt-1"/><h5><b class="text-green ml-1">Solicitante: </b> {{ nombre }}</h5> </div>
              <hr/>
             <div class="text-left">
              <div class="row">
                <b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill>          
                <p class="small"><small>Para consultar el estado de tu trámite ingresá en <a class="text-success">haciendavgesell.gob.ar</a>, hacé click en el ícono
                  correspondiente y escribí <br/>el número asignado en este comprobante. </small></p>
              </div>
              <div class="row">
                <b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill>          
                <p class="small"><small>Podés cancelar tu turno enviando un correo a divinspectores@gesell.gob.ar. </small></p>
              </div>

              <b-button class="mt-2 btn-orange" v-if="endButton === true" @click="onResetParams">Volver</b-button>
            </div>
            </b-card-body>
          </b-card>
        </div>
      </div>

      <!-- Modal enviando turno -->
      <b-modal v-model="sendingForm" title="" no-close-on-backdrop :header-bg-variant="'success'" hide-footer  centered>
        <template #modal-header>
          <h5 class="centeredContainer text-light"> <b>Solicitando turno</b></h5>
        </template>
        <div class="centeredContainer">
          <p class="popup-link">Tu solicitud se está procesando.</p>
          <b-spinner variant="success" style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
          <p>No cierres esta página</p>
        </div>
      </b-modal>

      <!-- Modal Solicitud exitosa -->
      <b-modal v-model="formOk" v-if="date && time && formOk && !printing" no-close-on-backdrop :header-bg-variant="'success'" hide-footer centered>
        <template #modal-header>
          <div class="centeredContainer"><h3>
              <b-icon icon="check-circle-fill" scale="1.5" variant="light"></b-icon>
          </h3></div>
        </template>
        <div class="text-center modal-success">
          <p><b>{{ nombre }}</b>, solicitaste un turno para el día <b>{{ formattedDate }}</b> para la dirección especificada: <b>{{ domicilio }}</b>, en la franja horaria de las <b>{{ time }}.</b></p>
          <p>Tu número de trámite es: <b>{{nroTramite}} </b></p>
          <div class="btn-container">
            <b-button @click="onResetParams" class="btn-cancel">Volver</b-button>
            <b-button @click="onPrintTicket">Imprimir</b-button>
          </div>
        </div>
      </b-modal>

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
      <b-modal v-model="showPopupAlready" @click-outside="showPopupAlready = false" :header-bg-variant="'danger'" centered>
        <template #modal-header>
          <div class="centeredContainer"><h3>
              <b-icon-exclamation-octagon scale="1.5" variant="light"></b-icon-exclamation-octagon>
          </h3></div>
        </template>
        <div class="centeredContainer modal-error">
          <p class="modal-subtitle">Ya has solicitado un turno.</p>
          <p class="">Si deseas cancelarlo o reprogramarlo, debes comunicarte con divinspectores@gesell.gob.ar.</p>
          <p class="">Recordá que podés cancelar el turno sólo hasta 5 días antes del momento de inspección. </p>
        </div>
        <template #modal-footer>
          <div class="" style="margin: auto">
            <b-button @click="showPopupAlready = false" variant="danger" class="btn-cancel" >Aceptar</b-button>
          </div>
        </template>
      </b-modal>
  </div>

</template>

<script>
export default {
  data() {
    return {
      nroTramite: null,
      nroTramiteIngresado: null,
      page: 0,
      date: null,
      datePicked: null,
      time: null,
      timePicked: null,
      nombre: '',
      dni: '',
      domicilio: '',
      localidad: '',
      formOk: false,
      sendingForm: false,
      printing: false,
      horariosDisponibles: [],
      maxRange: 15,
      token: 0,
      enterKeyPressed: false,
      endButton: false,
      showPopupFormError: false,
      showPopupNoEntry: false,
      showPopupNotAllowed: false,
      showPopupAlready: false,
    };
  },
  mounted() {
    this.generateTimeOptions();
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
    generateTimeOptions() {
      const startTime = 570; // 9:30 (in minutes)
      const endTime = 700; // 11:30 (in minutes)
      const interval = 120;
      const options = [];

      for (let minutes = startTime; minutes <= endTime; minutes += interval) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const time = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        options.push(time);
      }

      this.horariosDisponibles = options;
    },
    dateDisabled(ymd, date) {
      // Disable weekends (Sunday = `0`, Saturday = `6`)
      const weekday = date.getDay();
      const day = date.getDate();

      // Verificar si la fecha tiene 6 turnos pedidos
      const turnos = this.$store.state.turnos.all;
      const turnosParaFecha = turnos.filter(turno => turno.dia === new Date(date).toLocaleDateString('es-AR'));
      const seisTurnosPedidos = turnosParaFecha.length >= 6;

      // Deshabilitar la fecha si es fin de semana o ya hay 6 turnos pedidos, y según la localidad
      return weekday === 0 || weekday === 6 || seisTurnosPedidos ||
        (this.localidad == "villa-gesell" && weekday >= 4) ||
        (this.localidad != "villa-gesell" && weekday < 4);
    },
    timeDisabled(time) {
      // Obtener la cantidad de turnos reservados para la franja horaria específica
      const turnos = this.$store.state.turnos.all;
      const turnosParaFranja = turnos.filter(turno => turno.dia === new Date(this.date).toLocaleDateString('es-AR') && turno.horario === time);
      const tresTurnosPedidos = turnosParaFranja.length >= 3; // Suponiendo que 3 es el límite de turnos por franja horaria

      return tresTurnosPedidos;
    },
    async onSelectTurno() {
      let success = false; // Bandera para verificar si el try se ejecutó con éxito

      if (!this.nombre || !this.dni || !this.domicilio) {
        this.$bvToast.toast('Existen datos incompletos', {
          title: 'Error',
          variant: 'danger',
          solid: true,
          toaster: 'b-toaster-top-center',
        });
      } else {
        try {
          const turno = {
            dia: this.date,
            horario: this.time,
            nombre: this.nombre,
            dni: this.dni,
            domicilio: this.domicilio,
            nroTramite: this.nroTramite,
          }
          this.sendingForm = true;
          await this.$store.dispatch('turnos/create',{
            turno
          })
        }catch(e){
          this.$bvToast.toast('No se pudo solicitar un turno por un error desconocido. Recargue la pagina e intente nuevamente más tarde.', {
            solid: true,
            variant: 'danger',
            appendToast: true,
          });
        }

        // Verifica la bandera 'success' para ejecutar el código después del try...catch
        if (success) {
          const habilitacionId = this.$store.state.habilitaciones.single.id;
          const observaciones = this.$store.state.habilitaciones.single.observaciones;
          const habilitacion = {
            status: 'Esperando inspección',
            observaciones: observaciones + " - " + "Turno solicitado el día " + new Date().toLocaleDateString('es-AR') +
              " - " + "Se debe inspeccionar el comercio el día " + new Date(this.date).toLocaleDateString('es-AR') + " a las " + this.time
          };
          await this.$store.dispatch('habilitaciones/updateLazy', {
            id: habilitacionId,
            habilitacion,
          });
          this.sendingForm = false;
          this.formOk = true;
        }
      }
    },
    async onPrintTicket() {
      this.page = 4;
      this.printing = true;
      await this.wait(500);
      print();
      await this.wait(500);
      this.endButton = true;
    },
    async onNextPage() {
      switch (this.page) {
        case 0:
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
          this.enterKeyPressed = false
          break;

        case 1:
          if (!this.datePicked) {
            this.$bvToast.toast('No ha seleccionado una fecha', {
              title: 'Error',
              variant: 'danger',
              appendToast: true,
              solid: true,
              toaster: 'b-toaster-top-center',
            });
          } else {
            this.date = this.datePicked
            this.page += 1
          }
          break;

        case 2:
          if (!this.timePicked) {
            this.$bvToast.toast('No ha seleccionado un horario', {
              title: 'Error',
              variant: 'danger',
              appendToast: true,
              solid: true,
              toaster: 'b-toaster-top-center',
            });
          } else {
            this.time = this.timePicked
            this.page += 1
          }
          break;

        default:
          // Por defecto, se incrementa la página en cualquier otro caso no especificado.
          this.page += 1;
          break;
      }
    },
    onResetParams() {
      this.date = null;
      this.time = null;
      this.datePicked = null,
      this.timePicked = null,
      this.$router.push('/');
      this.page = 0;
      this.nombre = null;
      this.domicilio = null;
      this.dni = null;
      this.token = null,
      this.printing = false;
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
    areAllFieldsComplete(){
        return (this.date && this.time && this.nroTramite && this.nombre && this.dni && this.domicilio)
    }
  },
};
</script>

<style scoped>
@media (max-width: 720px){
  .b-calendar{
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 0 !important;
  }
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

  .small{
    font-size: 1rem;
    margin-left: 3px;
    margin-top: 4px;
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
