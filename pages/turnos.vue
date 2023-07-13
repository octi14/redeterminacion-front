<template>
  <div class="page">
    <Banner title="Comercio" subtitle="Sistema de turnos" />
    <div class="mx-auto">
      <!-- <div class="text-center mt-3">
        <h4 v-if="page === 1">Seleccione una fecha</h4>
        <h6 v-if="page === 1">Podrá seleccionar una fecha dentro de los próximos 15 días</h6>
        <h4 v-if="page === 2">Seleccione un horario</h4>
        <h4 v-if="page === 3">Complete los siguientes datos</h4>
      </div>
      <div v-if="page === 0" class="col-8 mt-5 mx-auto">
        <div class="text-center mt-4">
          <h5>Está a punto de solicitar un turno para que su comercio sea habilitado.</h5>
          <h5 class="mt-3">Recuerde ingresar su <b>número de trámite</b> asignado al haber completado el formulario de Solicitud de Habilitación.</h5>
          <b-form>
            <b-form-input type="number" size="lg" class="col-6 mt-4 mx-auto" placeholder="Número de trámite" no-wheel></b-form-input>
          </b-form>
          <b-button variant="success" class="mt-5 mr-1" @click="onNextPage">Aceptar</b-button>
          <b-button variant="danger" class="mt-5" @click="onResetParams">Salir</b-button>
        </div>
      </div>
      <div class="text-center">
        <b-form @submit="onSelectTurno"> -->
          <!-- Página 1 -->
          <!-- <b-calendar
            class="col-3 mx-auto mt-3"
            block hide-header
            :date-format-options="{ year: 'numeric', day: '2-digit', weekday: 'short' }"
            :min="new Date()"
            :max="daysFromNow()"
            locale="es"
            value-as-date
            :date-disabled-fn="dateDisabled"
            v-if="page === 1"
            v-model="date"
          /> -->

          <!-- Página 2 -->
          <!-- <b-form-select v-if="page === 2" v-model="time" class="mb-3 col-5">
            <b-form-select-option
              v-for="horario in horariosDisponibles"
              :key="horario.id"
              :value="horario"
            >
              Franja horaria: {{ horario }}
            </b-form-select-option>
          </b-form-select>
          <br /> -->

          <!-- Página 3 -->
          <!-- <div class="card col-5 mx-auto" v-if="page === 3">
            <div>
              <h6>Nombre</h6>
              <b-form-input v-model="nombre" type="text" placeholder="Nombre"></b-form-input>
            </div>
            <div class="mt-2">
              <h6>Número de documento</h6>
              <b-form-input v-model="dni" type="number" placeholder="Número de documento"></b-form-input>
            </div>
            <div class="mt-2">
              <h6>Domicilio del comercio</h6>
              <b-form-input v-model="domicilio" type="text" placeholder="Domicilio del comercio"></b-form-input>
            </div>
          </div>

        </b-form> -->

        <!-- Comprobante (página 4) -->
          <!-- <b-card class="text-center shadow-lg col-8 mx-auto" v-if="page === 4">
            <h1>Comprobante de turno</h1>
            <h4>Secretaría de Hacienda</h4>
            <h5>Día: {{ formattedDate }}</h5>
            <h5>Horario: {{ time }}</h5>
            <h5>Código de trámite: {{ token }}</h5>
            <h5>Solicita el turno: {{ nombre }}</h5>
            <b-button @click="onResetParams" variant="primary"> Salir </b-button>
          </b-card>
        <b-button variant="primary" v-if="page > 0 && page <= 2" @click="onNextPage" class="mt-3 mx-auto">Siguiente</b-button>
        <b-button variant="primary" type="submit" v-if="page === 3" @click="onSelectTurno" class="mt-3 mx-auto">Solicitar turno</b-button>
        <b-button variant="danger" class="mt-3" v-if="page > 0 && page < 4" @click="page-= 1"> Atrás </b-button>
      </div> -->

      <!-- Modal -->
      <!-- <b-modal v-model="solicitado" v-if="date && time && solicitado && !printing" hide-header hide-footer centered>
        <div class="text-center">
          <h5 class="landing-text"><b>{{ nombre }}</b>,</h5>
          <h5>Ha solicitado un turno para el día <b class="landing-text">{{ formattedDate }}</b>, en la franja horaria de las <b class="landing-text">{{ time }}hs</b>.</h5>
          <h5>El personal de inspección visitará el domicilio especificado: <b class="landing-text">{{ domicilio }}</b>, en un plazo máximo de <b class="landing-text">3 horas desde el horario solicitado</b>.</h5>
          <h5>Su código de trámite es <b class="landing-text">{{ token }}</b></h5>
          <b-button variant="success" class="mt-3 mr-1" @click="onPrintTicket">Guardar comprobante</b-button>
          <b-button variant="danger" class="mt-3 ml-1" @click="onResetParams">Salir</b-button>
        </div>
      </b-modal> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nroTramite: null,
      page: 0,
      date: null,
      time: null,
      nombre: '',
      dni: '',
      domicilio: '',
      solicitado: false,
      printing: false,
      horariosDisponibles: [],
      maxRange: 15,
      token: 0,
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
      const startTime = 510; // 8:30 (in minutes)
      const endTime = 700; // 11:30 (in minutes)
      const interval = 180;
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
      // Return `true` if the date should be disabled
      return weekday === 0 || weekday === 6;
    },
    onSelectTurno() {
      if (!this.nombre || !this.dni || !this.domicilio) {
        this.$bvToast.toast('Existen datos incompletos', {
          title: 'Error',
          variant: 'danger',
          solid: true,
          toaster: 'b-toaster-top-center',
        });
      } else {
        this.token = Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000;
        this.solicitado = true;
      }
    },
    async onPrintTicket() {
      this.page = 4;
      this.printing = true;
      await this.wait(500);
      print();
    },
    onNextPage() {
      if (this.page === 0 && !this.nroTramite) {
        // this.$bvToast.toast('No ha ingresado un número de trámite.', {
        //   title: 'Error',
        //   variant: 'danger',
        //   appendToast: true,
        //   solid: true,
        //   toaster: 'b-toaster-top-center',
        // });
        this.page += 1
      } else {
        if (this.page === 1 && !this.date) {
          this.$bvToast.toast('No ha seleccionado una fecha', {
            title: 'Error',
            variant: 'danger',
            appendToast: true,
            solid: true,
            toaster: 'b-toaster-top-center',
          });
        } else {
          if (this.page === 2 && !this.time) {
            this.$bvToast.toast('No ha seleccionado un horario', {
              title: 'Error',
              variant: 'danger',
              appendToast: true,
              solid: true,
              toaster: 'b-toaster-top-center',
            });
          } else {
            this.page += 1;
          }
        }
      }
    },
    onResetParams() {
      this.date = null;
      this.time = null;
      this.$router.push('/');
      this.page = 0;
      this.nombre = null;
      this.domicilio = null;
      this.dni = null;
      this.printing = false;
      this.solicitado = false;
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
  },
};
</script>
