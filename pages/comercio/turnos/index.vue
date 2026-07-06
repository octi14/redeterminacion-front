<template>
  <div class="page main-background">
    <Banner title="Inspección de Comercios"/>
    <div class="mx-auto">
      <div class="mt-3" v-if="page === 0">
        <div class="banner-container">
          <img
            :src="turneraBanner1"
            class="turnera-banner-img"
            width="803"
            height="289"
            alt=""
          />
        </div>
        <b-card class="section-card col-md-6 mx-auto">
          <div class="turno-instrucciones">
            <div class="li-row">
              <div class="li-icon"><i class="bi bi-caret-right-fill" style="font-size: 1.5em"></i></div><div class="li-content"><p>Estás a punto de seleccionar un turno de inspección para tu comercio.</p></div>
            </div>
            <div class="li-row">
              <div class="li-icon"><i class="bi bi-caret-right-fill" style="font-size: 1.5em"></i></div><div class="li-content"><p>Para iniciar, ingresá el <b>número de trámite</b> que recibiste luego de haber enviado el Formulario de Solicitud de Habilitaciones.</p></div>
            </div>
          </div>
          <b-form>
            <b-form-input :disabled="enterKeyPressed" @keydown.enter="onNextPage" v-model="nroTramiteIngresado" type="number" size="lg" class="col-md-6 col-sm-10 mt-4 mx-auto" placeholder="Número de trámite" no-wheel></b-form-input>
          </b-form>
          <div class="btn-container">
            <b-button class="btn-cancel" @click="onResetParams">Cancelar</b-button>
            <b-button @click="onNextPage" variant="success">Aceptar</b-button>
          </div>
        </b-card>
      </div>
      <b-form class="mt-3" @submit.prevent>
        <div v-if="page === 1">
          <div class="banner-container">
            <img
              :src="turneraBanner2"
              class="turnera-banner-img"
              width="803"
              height="289"
              alt=""
            />
          </div>
          <b-card class="section-card col-md-6 mx-auto">
            <h5>
              <i class="bi bi-calendar-check icon-orange"></i>
              Selección de fecha
            </h5>
            <div class="li-row">
              <div class="li-icon"><i class="bi bi-caret-right-fill" style="font-size: 1.5em"></i></div><div class="li-content"><p>Elegí una fecha dentro de los días señalados.</p></div>
            </div>
            <div class="li-row">
              <div class="li-icon"><i class="bi bi-caret-right-fill" style="font-size: 1.5em"></i></div><div class="li-content"><p>Tené en cuenta que las inspecciones se llevan a cabo en diferentes días de la semana dependiendo del lugar donde se encuentre tu comercio. Por eso, sólo podrás elegir los días correspondientes a la localidad que informaste al iniciar el trámite de habilitación:</p></div>
            </div>
            <div class="col-md-10 mx-auto turno-localidades-list">
              <div class="li-row">
                <div class="li-icon"><i class="bi bi-check turno-localidad-check"></i></div><div class="li-content sub-li"><p><b>Villa Gesell:</b> Lunes, Martes y Miércoles</p></div>
              </div>
              <div class="li-row">
                <div class="li-icon"><i class="bi bi-check turno-localidad-check"></i></div><div class="li-content sub-li"><p><b>Mar de Las Pampas / Colonia Marina / Las Gaviotas / Mar Azul:</b> Jueves y Viernes.</p></div>
              </div>
            </div>
            <b-calendar
              class="turnera-calendar col-8 mx-auto mt-3"
              block
              hide-header
              selected-variant="success"
              today-variant="success"
              nav-button-variant="outline-secondary"
              label-help="Elegí un día habilitado según la localidad de tu comercio."
              :date-format-options="{ year: 'numeric', day: '2-digit', weekday: 'short' }"
              :min="minTurnoDate"
              :max="maxTurnoDate"
              locale="es"
              value-as-date
              :date-disabled-fn="dateDisabled"
              v-model="datePicked"
            />
            <div class="btn-container">
              <b-button @click="page-= 1" class="btn-cancel">Volver</b-button>
              <b-button @click="onNextPage" variant="success">Continuar</b-button>
            </div>
          </b-card>
        </div>
        <div v-if="page === 2">
          <div class="banner-container">
            <img
              :src="turneraBanner3"
              class="turnera-banner-img"
              width="803"
              height="289"
              alt=""
            />
          </div>
          <b-card class="section-card col-md-6 mx-auto">
            <h5>
              <i class="bi bi-clock icon-orange"></i>
              Selección de horario
            </h5>
            <div v-if="selectedDateDisplay" class="li-row turno-fecha-elegida">
              <div class="li-icon"><i class="bi bi-calendar-check icon-orange" style="font-size: 1.25em"></i></div>
              <div class="li-content"><p><b>Fecha elegida:</b> {{ selectedDateDisplay }}</p></div>
            </div>
            <div class="li-row">
              <div class="li-icon"><i class="bi bi-caret-right-fill" style="font-size: 1.5em"></i></div><div class="li-content"><p>Seleccioná una franja horaria para recibir la visita de inspección.</p></div>
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
              <b-button @click="onNextPage" variant="success">Continuar</b-button>
            </div>
          </b-card>
        </div>
        <div v-if="page === 3">
          <div class="banner-container">
            <img
              :src="turneraBanner4"
              class="turnera-banner-img"
              width="803"
              height="289"
              alt=""
            />
          </div>
          <b-card class="section-card col-md-6 mx-auto">
            <h5><img class="bi-ticket" src="../../../assets/icon-num-rifa.png" /> Confirmación de turno</h5>
            <div v-if="selectedDateDisplay" class="li-row turno-fecha-elegida">
              <div class="li-icon"><i class="bi bi-calendar-check icon-orange" style="font-size: 1.25em"></i></div>
              <div class="li-content"><p><b>Fecha elegida:</b> {{ selectedDateDisplay }}</p></div>
            </div>
            <div v-if="selectedTimeDisplay" class="li-row turno-fecha-elegida">
              <div class="li-icon"><i class="bi bi-clock icon-orange" style="font-size: 1.25em"></i></div>
              <div class="li-content"><p><b>Franja horaria elegida:</b> {{ selectedTimeDisplay }}</p></div>
            </div>
            <div class="turno-instrucciones">
              <div class="li-row">
                <div class="li-icon"><i class="bi bi-caret-right-fill" style="font-size: 1.5em"></i></div><div class="li-content"><p>Completá los datos que te solicitamos a continuación.</p></div>
              </div>
              <div class="li-row">
                <div class="li-icon"><i class="bi bi-caret-right-fill" style="font-size: 1.5em"></i></div><div class="li-content"><p>Al finalizar se emitirá un comprobante que deberás mostrar el día de la inspección.</p></div>
              </div>
            </div>
            <div class="col-10 mx-auto turno-form-datos">
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
                    <i class="bi bi-exclamation-triangle text-warning" style="font-size: 4em"></i>
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
              <b-button type="button" :disabled="sendingForm || !areAllFieldsComplete"  @click="onSelectTurno" variant="success">Continuar</b-button>
            </div>
            <div v-if="!areAllFieldsComplete" class="validation-error">
              <i class="bi bi-exclamation-octagon text-danger"></i> Falta completar información.
            </div>
          </b-card>
        </div>
      </b-form>
        <!-- Comprobante (página 4) -->
        <div v-if="page === 4" class="turno-comprobante-wrapper">
          <b-card no-body border-variant="success" class="turno-comprobante-card shadow col-md-5 col-sm-8 mx-auto">
            <b-card-header class="turno-comprobante-header green text-light">
              <h5 class="mb-0"><b>Comprobante de turno</b> — Inspección comercial</h5>
            </b-card-header>
            <b-card-body class="turno-comprobante-body">
              <p class="turno-comprobante-entity">Municipalidad de Villa Gesell — Secretaría de Hacienda</p>
              <ul class="turno-comprobante-datos">
                <li>
                  <span class="turno-comprobante-label"><i class="bi bi-check"></i> Día</span>
                  <span class="turno-comprobante-value">{{ formattedDate }}</span>
                </li>
                <li v-if="selectedTimeDisplay">
                  <span class="turno-comprobante-label"><i class="bi bi-check"></i> Horario</span>
                  <span class="turno-comprobante-value">{{ selectedTimeDisplay }}</span>
                </li>
                <li>
                  <span class="turno-comprobante-label"><i class="bi bi-check"></i> Nro. de trámite</span>
                  <span class="turno-comprobante-value">{{ nroTramite }}</span>
                </li>
                <li>
                  <span class="turno-comprobante-label"><i class="bi bi-check"></i> Solicitante</span>
                  <span class="turno-comprobante-value">{{ nombre }}</span>
                </li>
                <li v-if="domicilio">
                  <span class="turno-comprobante-label"><i class="bi bi-check"></i> Domicilio</span>
                  <span class="turno-comprobante-value">{{ domicilio }}</span>
                </li>
              </ul>
              <div class="turno-comprobante-notas">
                <div class="turno-comprobante-nota">
                  <i class="bi bi-caret-right-fill icon-orange"></i>
                  <p>Para consultar el estado de tu trámite ingresá en <strong>haciendavgesell.gob.ar</strong>, hacé click en el ícono correspondiente y escribí el número asignado en este comprobante.</p>
                </div>
                <div class="turno-comprobante-nota">
                  <i class="bi bi-caret-right-fill icon-orange"></i>
                  <p>Podés cancelar tu turno enviando un correo a <strong>divinspectores@gesell.gob.ar</strong>.</p>
                </div>
              </div>
              <b-button
                v-if="endButton === true"
                class="mt-3 btn-orange turno-comprobante-no-print"
                @click="onResetParams"
              >
                Volver
              </b-button>
            </b-card-body>
          </b-card>
        </div>
      </div>

      <!-- Modal enviando turno -->
      <BModal v-model="sendingForm" title="" no-close-on-backdrop :header-bg-variant="'success'" no-footer  centered>
        <template #header>
          <h5 class="centeredContainer text-light"> <b>Solicitando turno</b></h5>
        </template>
        <div class="centeredContainer">
          <p class="popup-link">Tu solicitud se está procesando.</p>
          <b-spinner variant="success" style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
          <p>No cierres esta página</p>
        </div>
      </BModal>

      <!-- Modal Solicitud exitosa -->
      <BModal v-model="formOk" no-close-on-backdrop :header-bg-variant="'success'" no-footer centered>
        <template #header>
          <div class="centeredContainer"><h3>
              <i class="bi bi-check-circle-fill text-light"></i>
          </h3></div>
        </template>
        <div class="text-center modal-success">
          <p><b>{{ nombre }}</b>, solicitaste un turno para el día <b>{{ formattedDate }}</b> para la dirección especificada: <b>{{ domicilio }}</b>, en la franja horaria de las <b>{{ time }}.</b></p>
          <p>Se ha enviado automáticamente un correo electrónico a tu dirección de email con los detalles del turno.</p>
          <p>Tu número de trámite es: <b>{{nroTramite}} </b></p>
          <div class="btn-container">
            <b-button @click="onResetParams" class="btn-cancel">Volver</b-button>
            <b-button @click="onPrintTicket" variant="success">Imprimir</b-button>
          </div>
        </div>
      </BModal>

      <!-- Modal número de trámite incorrecto -->
      <BModal v-model="showPopupFormError" @click-outside="showPopupFormError = false" :header-bg-variant="'danger'" centered>
        <template #header>
          <div class="centeredContainer"><h3>
              <i class="bi bi-exclamation-octagon text-light"></i>
          </h3></div>
        </template>
        <div class="centeredContainer modal-error">
          <p class="modal-subtitle">No hemos podido encontrar tu número de trámite</p>
          <p class="">Por favor, corroborá que los datos ingresados sean correctos. Recordá que el número de trámite que te solicitamos fue enviado a tu correo electrónico.</p>
          <p class="minitext">Si el problema persiste, envianos un correo a <a target="_blank" href="mailto:deptocomercio@gesell.gob.ar" class="icon-green">deptocomercio@gesell.gob.ar</a>.</p>
        </div>
        <template #footer>
          <div class="" style="margin: auto">
            <b-button @click="showPopupFormError = false" variant="danger" class="btn-cancel" >Aceptar</b-button>
          </div>
        </template>
      </BModal>

      <!-- Modal No estás habilitado a sacar turno todavía -->
      <BModal v-model="showPopupNotAllowed" @click-outside="showPopupNotAllowed = false" :header-bg-variant="'secondary'" centered>
        <template #header>
          <div class="centeredContainer">
            <i class="bi bi-exclamation-octagon text-light"></i>
          </div>
        </template>
        <div class="centeredContainer modal-warning">
          <p class="modal-subtitle text-secondary">Tu trámite no está habilitado para reservar un turno.</p>
          <p class="">Tu solicitud no ha sido aprobada o bien tu comercio no necesita inspección para ser habilitado.</p>
          <p class="">Revisá tu correo electrónico para corroborar si tu solicitud fue aprobada sin necesitar inspección.</p>
          <p class="minitext">Si tenés dudas, envianos un correo a <a target="_blank" href="mailto:deptocomercio@gesell.gob.ar" class="icon-green">deptocomercio@gesell.gob.ar</a>.</p>
        </div>
        <template #footer>
          <div style="margin: auto">
            <b-button @click="showPopupNotAllowed = false" variant="primary">Aceptar</b-button>
          </div>
        </template>
      </BModal>

      <!-- Modal No ha ingresado un número de trámite -->
      <BModal v-model="showPopupNoEntry" @click-outside="showPopupNoEntry = false" :header-bg-variant="'danger'" centered>
        <template #header>
          <div class="centeredContainer"><h3>
              <i class="bi bi-exclamation-octagon text-light"></i>
          </h3></div>
        </template>
        <div class="centeredContainer modal-error">
          <p class="modal-subtitle">No has ingresado un número de trámite.</p>
          <p class="">Por favor, completá este campo para continuar.</p>
        </div>
        <template #footer>
          <div class="" style="margin: auto">
            <b-button @click="showPopupNoEntry = false" variant="danger" class="btn-cancel" >Aceptar</b-button>
          </div>
        </template>
      </BModal>

      <!-- Modal Usted ya ha solicitado un turno -->
      <BModal v-model="showPopupAlready" @click-outside="showPopupAlready = false" :header-bg-variant="'danger'" centered>
        <template #header>
          <div class="centeredContainer"><h3>
              <i class="bi bi-exclamation-octagon text-light"></i>
          </h3></div>
        </template>
        <div class="centeredContainer modal-error">
          <p class="modal-subtitle">Ya has solicitado un turno.</p>
          <p class="">Si deseas cancelarlo o reprogramarlo, debes comunicarte con divinspectores@gesell.gob.ar.</p>
          <p class="">Recordá que podés cancelar el turno sólo hasta 5 días antes del momento de inspección. </p>
        </div>
        <template #footer>
          <div class="" style="margin: auto">
            <b-button @click="showPopupAlready = false" variant="danger" class="btn-cancel" >Aceptar</b-button>
          </div>
        </template>
      </BModal>
  </div>

</template>

<script>
import MailerService from "@/service/mailer.js";
import BCalendar from '~/components/BCalendarField.vue'
import turneraBanner1 from '~/assets/turnera-banner-1.png?url'
import turneraBanner2 from '~/assets/turnera-banner-2.png?url'
import turneraBanner3 from '~/assets/turnera-banner-3.png?url'
import turneraBanner4 from '~/assets/turnera-banner-4.png?url'

export default {
  components: { BCalendar },
  setup(){ const { showToast } = useProjectToast(); return { showToast } },
  data() {
    return {
      turneraBanner1,
      turneraBanner2,
      turneraBanner3,
      turneraBanner4,
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
      const turnos = useTurnosStore().all;
      const turnosParaFecha = turnos.filter(turno => turno.dia === new Date(date).toLocaleDateString('es-AR'));
      const seisTurnosPedidos = turnosParaFecha.length >= 6;

      // Deshabilitar la fecha si es fin de semana o ya hay 6 turnos pedidos, y según la localidad
      return weekday === 0 || weekday === 6 || seisTurnosPedidos ||
        (this.localidad == "villa-gesell" && weekday >= 4) ||
        (this.localidad != "villa-gesell" && weekday < 4);
    },
    timeDisabled(time) {
      // Obtener la cantidad de turnos reservados para la franja horaria específica
      const turnos = useTurnosStore().all;
      const turnosParaFranja = turnos.filter(turno => turno.dia === new Date(this.date).toLocaleDateString('es-AR') && turno.horario === time);
      const tresTurnosPedidos = turnosParaFranja.length >= 3; // Suponiendo que 3 es el límite de turnos por franja horaria

      return tresTurnosPedidos;
    },
    async onSelectTurno() {
      const tipoTramite = useHabilitacionesStore().single?.tipoSolicitud

      if (!this.nombre || !this.dni || !this.domicilio) {
        this.showToast('Existen datos incompletos', {
          title: 'Error',
          variant: 'danger',
          solid: true,
          pos: 'top-center',
        });
        return;
      }

      try {
        const turno = {
          dia: this.date,
          horario: this.time,
          nombre: this.nombre,
          dni: this.dni,
          domicilio: this.domicilio,
          nroTramite: this.nroTramite,
          tipoTramite,
        }
        this.sendingForm = true
        await useTurnosStore().create({ turno })

        const habilitacionId = useHabilitacionesStore().single.id;
        const observaciones = useHabilitacionesStore().single.observaciones;
        const habilitacion = {
          status: 'Esperando inspección',
          observaciones: observaciones + " - " + "Turno solicitado el día " + new Date().toLocaleDateString('es-AR') +
            " - " + "Se debe inspeccionar el comercio el día " + new Date(this.date).toLocaleDateString('es-AR') + " a las " + this.time
        };
        await useHabilitacionesStore().updateLazy({
          id: habilitacionId,
          habilitacion,
        });

        try {
          const destinatario = useHabilitacionesStore().single.mail
          if (destinatario) {
            const asunto = `Turno de inspección confirmado - N° ${this.nroTramite}`
            const mensaje = `Estimado/a contribuyente,

Su turno de inspección comercial ha sido confirmado exitosamente.

Número de trámite: ${this.nroTramite}
Fecha de inspección: ${new Date(this.date).toLocaleDateString('es-AR')}
Horario: ${this.time}
Domicilio: ${this.domicilio}
Nombre: ${this.nombre}

IMPORTANTE:
- El día de la inspección debe haber alguien presente en el local
- Si necesita cancelar o reprogramar el turno, comuníquese con divinspectores@gesell.gob.ar
- Solo puede cancelar el turno hasta 5 días antes de la inspección.`

            await MailerService.enviarCorreo(useApi(), { destinatario, asunto, mensaje })
          } else {
            console.error('No se encontró el email del solicitante')
          }
        } catch (e) {
          console.error('Error al enviar correo de confirmación de turno:', e)
        }

        await this.$nextTick()
        this.formOk = true
      } catch (e) {
        this.showToast('No se pudo solicitar un turno por un error desconocido. Recargue la pagina e intente nuevamente más tarde.', {
          solid: true,
          variant: 'danger',
          appendToast: true,
        });
      } finally {
        this.sendingForm = false
      }
    },
    async onPrintTicket() {
      this.formOk = false
      this.page = 4
      this.printing = true
      await this.wait(500)
      if (import.meta.client) {
        document.body.classList.add('printing-turno-comprobante')
      }
      print()
      await this.wait(500)
      if (import.meta.client) {
        document.body.classList.remove('printing-turno-comprobante')
      }
      this.endButton = true
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
              await useHabilitacionesStore().getByNroTramite({ nroTramite })
              if(useHabilitacionesStore().single){
                const status = useHabilitacionesStore().single.status
                if(status === "Esperando turno"){
                  this.nroTramite = this.nroTramiteIngresado
                  this.localidad = useHabilitacionesStore().single.localidad
                  this.page += 1
                  await useTurnosStore().getAll()
                }else{
                  if(status === "Esperando inspección" || status === "Prórroga 1" || status === "Prórroga 2" || status === "Inspeccionado"){
                    await useTurnosStore().getSingle({ nroTramite })
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
              this.showToast('Algo salió mal buscando la habilitación.', {
                title: 'Error',
                variant: 'danger',
                appendToast: true,
                solid: true,
                pos: 'top-center',
              });
            }
          }
          this.enterKeyPressed = false
          break;

        case 1:
          if (!this.datePicked) {
            this.showToast('No ha seleccionado una fecha', {
              title: 'Error',
              variant: 'danger',
              appendToast: true,
              solid: true,
              pos: 'top-center',
            });
          } else {
            this.date = this.datePicked
            this.page += 1
          }
          break;

        case 2:
          if (!this.timePicked) {
            this.showToast('No ha seleccionado un horario', {
              title: 'Error',
              variant: 'danger',
              appendToast: true,
              solid: true,
              pos: 'top-center',
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
      this.$router.push('/comercio');
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
    minTurnoDate() {
      const d = new Date()
      d.setDate(d.getDate() + 2)
      return d
    },
    maxTurnoDate() {
      const d = new Date()
      d.setDate(d.getDate() + this.maxRange)
      return d
    },
    formattedDate() {
      const d = this.date || this.datePicked
      if (!d) return ''
      const date = d instanceof Date ? d : new Date(d)
      if (Number.isNaN(date.getTime())) return ''
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    },
    selectedDateDisplay() {
      const d = this.date || this.datePicked
      if (!d) return ''
      const date = d instanceof Date ? d : new Date(d)
      if (Number.isNaN(date.getTime())) return ''
      const text = date.toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      return text.charAt(0).toUpperCase() + text.slice(1)
    },
    selectedTimeDisplay() {
      const t = this.time || this.timePicked
      if (!t) return ''
      const slots = this.horariosDisponibles
      if (!slots.length) return t
      const idx = slots.indexOf(t)
      if (idx === 0 && slots[1]) {
        return `${slots[0]} - ${slots[1]}`
      }
      if (idx === 1) {
        return `${slots[1]} - 13:30`
      }
      return t
    },
    areAllFieldsComplete(){
        return (this.date && this.time && this.nroTramite && this.nombre && this.dni && this.domicilio)
    }
  },
};
</script>

<style scoped>
.banner-container {
  width: 100%;
  max-width: 803px;
  margin: 0 auto 0.5rem;
  line-height: 0;
}

.turnera-banner-img {
  display: block;
  width: min(100%, 803px);
  height: auto;
  aspect-ratio: 803 / 289;
  margin: 0 auto;
  flex-shrink: 0;
}

.turnera-calendar :deep(.b-calendar-grid) {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

@media (max-width: 720px){
  .turnera-calendar,
  .turnera-calendar :deep(.b-calendar),
  .turnera-calendar :deep(.b-calendar-inner) {
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
  }
  .banner-container{
    margin: auto;
    max-width: 100%;
  }
  .turnera-banner-img {
    max-width: 100%;
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
  .bi-ticket {
    width: 12% !important;
    min-width: 2rem !important;
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
  .centeredContainer {
    width: auto;
    margin: auto;
    text-align: center;
  }

  .modal-header .centeredContainer {
    width: 100%;
    flex: 1 1 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
  }

  .modal-header .centeredContainer h3,
  .modal-header .centeredContainer h5 {
    width: 100%;
    margin: 0;
    padding: 0;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
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
  .modal-error .minitext {
    font-size: 0.8rem;
    font-weight: 400;
    color: #888;
  }

  .modal-success p{
    color: black;
    font-weight: 500;
    font-size: 1.2rem;
    padding: 0 1.5rem;
  }
  .modal-success .minitext {
    font-size: 0.8rem;
    font-weight: 400;
    color: #888;
  }

  .modal-warning p{
    color: black;
    font-weight: 500;
    padding: 0 1rem;
  }
  .modal-warning .minitext {
    font-size: 0.9rem;
    font-weight: 400;
    color: #888;
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
  .btn-cancel{
    background-color: #e53749;
    border-color: #e53749;
  }
  .turno-fecha-elegida {
    margin-bottom: 0.5rem;
  }

  .turno-fecha-elegida p {
    margin-bottom: 0;
  }

  .turno-instrucciones .li-row + .li-row {
    margin-top: 1rem;
  }

  .turno-instrucciones .li-content p {
    margin-bottom: 0;
  }

  .turno-form-datos {
    margin-top: 1.5rem;
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
  .section-card h5 .bi-calendar-check {
    margin-right: 0.5rem;
    border-right: 1px solid #999;
    font-size: 2.1rem;
    padding-right: 0.75rem;
  }

  .section-card h5 .bi-clock,
  .section-card h5 .bi-ticket {
    margin-right: 0.5rem;
    border-right: 1px solid #999;
    font-size: 2.5rem;
    padding-right: 0.75rem;
  }

  .section-card h5 .bi-calendar-check,
  .section-card h5 .bi-clock,
  .turno-fecha-elegida .bi-calendar-check,
  .turno-fecha-elegida .bi-clock {
    color: #E27910;
  }
  .section-card h5 .bi-ticket {
    width: 6.5%;
    min-width: 2.25rem;
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
  .li-row {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    width: 100%;
  }
  .li-icon {
    flex: 0 0 auto;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    line-height: 1;
    margin-right: 0;
    padding-top: 0.12em;
  }
  .li-content {
    display: block;
    flex: 1 1 auto;
    min-width: 0;
  }
  .li-content p {
    margin-top: 0;
    margin-bottom: 0.65rem;
    line-height: 1.4;
  }
  .li-content p:last-child {
    margin-bottom: 0;
  }
  .li-p{
    margin-bottom: 1rem;
  }
  .sub-li p{
    font-size: 1.3rem;
  }

  .turno-localidades-list .li-row {
    gap: 0.6rem;
  }

  .turno-localidades-list .li-row + .li-row {
    margin-top: 0.85rem;
  }

  .turno-localidades-list .sub-li p {
    line-height: 1.65;
  }

  .turno-localidades-list .turno-localidad-check {
    color: #0c681a !important;
    font-size: 1.35rem !important;
    font-weight: 700;
    line-height: 1;
    display: block;
    margin-top: 0.15em;
  }

  .li-icon .bi-caret-right-fill,
  .li-icon .bi-check {
    display: block;
    margin-top: 0;
    line-height: 1;
  }

  .li-icon .bi-caret-right-fill,
  .bi-caret-right-fill {
    color: #0c681a;
  }

  .turno-comprobante-nota .bi-caret-right-fill {
    display: inline-block !important;
  }

  .turno-comprobante-wrapper {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  .turno-comprobante-card {
    border-width: 2px;
  }

  .turno-comprobante-header {
    text-align: center;
    padding: 0.85rem 1rem;
  }

  .turno-comprobante-body {
    padding: 1.5rem 1.75rem;
  }

  .turno-comprobante-entity {
    text-align: center;
    color: #555;
    font-size: 0.95rem;
    margin-bottom: 1.25rem;
  }

  .turno-comprobante-datos {
    list-style: none;
    padding: 0;
    margin: 0 0 1.25rem;
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
    overflow: hidden;
  }

  .turno-comprobante-datos li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0.65rem 1rem;
    border-bottom: 1px solid #eee;
  }

  .turno-comprobante-datos li:last-child {
    border-bottom: none;
  }

  .turno-comprobante-datos li:nth-child(odd) {
    background-color: #f8f9fa;
  }

  .turno-comprobante-label {
    font-weight: 600;
    color: #0c681a;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .turno-comprobante-label .bi-check {
    display: inline-block;
    flex-shrink: 0;
    color: #0c681a;
    line-height: 1;
  }

  .turno-comprobante-value {
    text-align: right;
    font-weight: 600;
    color: #333;
  }

  .turno-comprobante-notas {
    border-top: 1px solid #ccc;
    padding-top: 1rem;
  }

  .turno-comprobante-nota {
    margin-bottom: 0.75rem;
  }

  .turno-comprobante-nota:last-child {
    margin-bottom: 0;
  }

  .turno-comprobante-nota p {
    font-size: 0.9rem;
    color: #444;
    line-height: 1.45;
  }
</style>

<style>
@media print {
  body:has(.turno-comprobante-wrapper) #app-navbar,
  body:has(.turno-comprobante-wrapper) .footer,
  body.printing-turno-comprobante #app-navbar,
  body.printing-turno-comprobante .footer,
  body:has(.turno-comprobante-wrapper) .title,
  body.printing-turno-comprobante .title,
  body:has(.turno-comprobante-wrapper) .turno-comprobante-no-print,
  body.printing-turno-comprobante .turno-comprobante-no-print {
    display: none !important;
  }

  body:has(.turno-comprobante-wrapper) #app-content,
  body.printing-turno-comprobante #app-content {
    margin-top: 0 !important;
    padding: 0 !important;
  }

  body:has(.turno-comprobante-wrapper) .main-background,
  body:has(.turno-comprobante-wrapper) .page,
  body.printing-turno-comprobante .main-background,
  body.printing-turno-comprobante .page {
    background: #fff !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  body:has(.turno-comprobante-wrapper) .turno-comprobante-wrapper,
  body.printing-turno-comprobante .turno-comprobante-wrapper {
    margin: 0 !important;
    padding: 0 !important;
  }

  body:has(.turno-comprobante-wrapper) .turno-comprobante-card,
  body.printing-turno-comprobante .turno-comprobante-card {
    width: 100% !important;
    max-width: 520px !important;
    margin: 0 auto !important;
    box-shadow: none !important;
    border: 2px solid #0c681a !important;
    page-break-inside: avoid;
  }

  body:has(.turno-comprobante-wrapper) .turno-comprobante-header,
  body:has(.turno-comprobante-wrapper) .green,
  body.printing-turno-comprobante .turno-comprobante-header,
  body.printing-turno-comprobante .green {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body:has(.turno-comprobante-wrapper) .turno-comprobante-nota p,
  body.printing-turno-comprobante .turno-comprobante-nota p {
    font-size: 0.85rem;
  }
}
</style>
