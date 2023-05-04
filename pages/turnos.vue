<template>
  <div class="page">
    <div>
      <Banner title="Comercio" subtitle="Sistema de turnos" />
    </div>
    <!-- <div class="mx-auto">
      <div class="text-center mt-3">
        <h4 v-if="!date"> Seleccione una fecha </h4>
        <h4 v-else> Seleccione un horario </h4>
      </div>
      <b-calendar class="col mt-3" block hide-header
        :date-format-options="{ year: 'numeric', month: 'short', day: '2-digit', weekday: 'short' }"
      locale="en" v-if="!date" v-model="date"> </b-calendar>
      <b-form-timepicker size="lg" class="col-md" minutes-step="15" button-only v-else v-model="time" locale="es"> </b-form-timepicker>
      <b-button variant="success"> {{ date ? 'Solicitar turno' : 'Siguiente' }} </b-button>
    </div> -->
  </div>
</template>

<script>

export default{
  data() {
    return {
      date: null,
      time: null,
    }
  },
  methods: {
  },
}
</script>
