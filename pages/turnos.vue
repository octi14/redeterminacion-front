<template>
  <div class="page">
    <Banner title="Comercio" subtitle="Sistema de turnos" />
    <!-- <div class="mx-auto">
      <div class="text-center mt-3">
        <h4 v-if="page == 1"> Seleccione una fecha </h4>
        <h6 v-if="page == 1"> Podrá seleccionar una fecha dentro de los próximos 15 días</h6>
        <h4 v-if="page == 2"> Seleccione un horario </h4>
        <h4 v-if="page == 3"> Complete los siguientes datos </h4>
      </div>
      <div class="text-center">
        <b-form @submit="onSelectTurno"> -->
          <!-- Página 1 -->
          <!-- <b-calendar class="col-3 mx-auto mt-3"
          block hide-header
          :date-format-options="{ year: 'numeric', day: '2-digit', weekday: 'short' }"
          :min="new Date()"
          :max="daysFromNow()"
          locale="es"
          value-as-date
          :date-disabled-fn="dateDisabled"
          v-if="page == 1"
          v-model="date" /> -->

          <!-- Página 2 -->
          <!-- <b-form-select v-if="page == 2" v-model="time" class="mb-3 col-5">
            <b-form-select-option
            v-for="horario in horariosDisponibles"
            :key="horario.id"
            :value="horario">Franja horaria: {{horario}}</b-form-select-option>
          </b-form-select> <br/> -->

          <!-- Página 3 -->
          <!-- <div class="col-5 mx-auto" v-if="page == 3">
            <div>
              <h6> Nombre </h6>
              <b-form-input v-model="nombre" type="text" placeholder="Nombre"> </b-form-input>
            </div>
            <div class="mt-2">
              <h6> Número de documento </h6>
              <b-form-input v-model="dni" type="number" placeholder="Número de documento"> </b-form-input>
            </div>
            <div class="mt-2">
              <h6> Domicilio del comercio </h6>
              <b-form-input v-model="domicilio" type="text" placeholder="Domicilio del comercio"> </b-form-input>
            </div>
          </div>

          <b-button variant="success" v-if="page <= 2" @click="onNextPage" class="mt-3 mx-auto"> Siguiente </b-button>
          <b-button variant="success" v-if="page == 3" @click="onSelectTurno" class="mt-3 mx-auto"> Solicitar turno </b-button>
          <b-button variant="danger" class="mt-3" @click="onResetParams"> Volver </b-button>
        </b-form>
      </div> -->

      <!-- Modal -->
      <!-- <div class="modal-overlay" v-if="date && time && solicitado">
        <b-card class="form">
          <h5><b> {{ nombre }} </b>, </h5>
          <h5> Ha solicitado un turno para el día <b>{{ date.getDate() + '/' + (date.getMonth()+ 1) + '/' + date.getFullYear() }} </b>,
            en la franja horaria de las  <b>{{ time }} </b>.</h5>
          <h5> El personal de inspección visitará el domicilio especificado: <b>{{ domicilio }}</b>, en un plazo máximo de
           <b>3 horas desde el horario solicitado </b>. </h5>
          <b-button variant="success" class="mt-4" @click="onPrintTicket"> Guardar comprobante </b-button> <br/>
          <b-button variant="success" class="mt-3" @click="onResetParams"> Salir </b-button>
        </b-card>
      </div>
    </div> -->
  </div>
</template>

<script>

export default{
  data() {
    return {
      page: 1,
      date: null,
      time: null,
      nombre: '',
      dni: '',
      domicilio: '',
      solicitado: false,
      horariosDisponibles: [],
      maxRange: 15,
    }
  },
  async fetch(){

  },
  mounted() {
    this.generateTimeOptions();
  },
  methods: {
    addDays(date, days) {
      date.setDate(date.getDate() + days);
      return date;
    },
    daysFromNow(){
      return this.addDays(new Date(), 15)
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
      const weekday = date.getDay()
      const day = date.getDate()
      // Return `true` if the date should be disabled
      return weekday === 0 || weekday === 6 || day === 6 || day === 20 || day === 19
    },
    onSelectTurno(){
      if(!this.nombre || !this.dni || !this.domicilio){
        this.$bvToast.toast('Existen datos incompletos', {
          title: 'Error',
          variant: 'danger',
          solid: true,
        })
      }else{
        this.solicitado = true
      }
    },
    onPrintTicket(){
      print()
    },
    onNextPage(){
      if (this.page == 1 && !this.date){
        this.$bvToast.toast('No ha seleccionado una fecha', {
          title: 'Error',
          variant: 'danger',
          appendToast: true,
          solid: true,
        })
      }else{
        if (this.page == 2 && !this.time){
          this.$bvToast.toast('No ha seleccionado un horario', {
            title: 'Error',
            variant: 'danger',
            appendToast: true,
            solid: true,
          })
        }else{
          this.page = this.page +1
        }
      }
    },
    onResetParams(){
      this.date = null,
      this.time = null,
      this.$router.push('/')
      this.page = 1
      this.nombre = null,
      this.domicilio = null,
      this.dni = null,
      this.solicitado = false
    }
  }
}
</script>
