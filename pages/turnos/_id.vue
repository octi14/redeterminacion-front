<template>
  <div class="page">
    <Banner title="Detalles de turno"/>
    <!-- Datos del solicitante -->
    <template v-if="turno">
      <div class="row justify-content-center mt-3">
        <p class="h4"> Número de trámite: <b> {{ turno.nroTramite }}  </b></p>
      </div>
      <div class="row justify-content-center mt-3">

        <div class="h4 row"> Estado:
          <h4 class="text-primary ml-1" v-if="turno.status === 'Pendiente de inspección'">{{ turno.status }} </h4>
          <h4 class="text-success ml-1" v-if="turno.status === 'Inspeccionado'">{{ turno.status }} </h4>
          <h4 class="text-secondary ml-1" v-if="turno.status === 'Prórroga 1'">{{ turno.status }} </h4>
          <h4 class="text-secondary ml-1" v-if="turno.status === 'Prórroga 2'">{{ turno.status }} </h4>
          <h4 class="text-danger ml-1" v-if="turno.status === 'Cancelado'">{{ turno.status }} </h4>
        </div>
      </div>
      <div class="row col-10 mx-auto justify-content-center">
        <b-button @click="onAprobar" variant="success" pill class="btn-4 mt-3 mx-1"> Aprobar inspección </b-button>
        <b-button @click="onProrroga" variant="secondary" pill class="btn-4 mt-3 mx-1"> Prórroga </b-button>
        <!-- <b-button @click="onRechazarTurno" pill class="btn-3 mt-3 mx-1"> Cancelar turno </b-button> -->
        <b-button @click="onRechazarTurno" pill class="btn-3 mt-3 mx-1"> Rechazar inspección </b-button>
      </div>
      <div class="container col-md-6 col-sm-8 card shadow-lg mt-4 mx-auto">
          <div class="col mx-auto">
            <div class="container text-center mx-auto">
              <h2 class="text-success mt-2"><b> Datos del turno </b></h2>
              <hr/>
            </div>
          </div>
          <div class="container mb-3 mx-auto">
            <div class="layout">
              <p class="col col-main">
                <strong>Fecha y hora del turno</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ turno.dia + " " + turno.horario}}</a>
              </p>
            <b-btn @click="onRechazarTurno" pill variant="outline-danger" class="mx-1"> Cancelar</b-btn>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Nombre del solicitante</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ turno.nombre}}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Número de documento</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ turno.dni }}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Domicilio a inspeccionar</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ turno.domicilio }}</a>
              </p>
            </div>
          </div>
        </div>
    </template>

    <!-- Modals -->
    <b-modal v-model="showRejectPopup" hide-footer :header-bg-variant="'danger'" centered>
        <template #modal-header>
          <div class="confirmation-popup-header mx-auto">
            <b-icon-exclamation-triangle scale="2" variant="light" />
          </div>
        </template>
        <div class="confirmation-popup-body">
          <h2 class="icon-orange text-center"><b>Rechazar inspección</b></h2>
          <p>La inspección será rechazada. Se dará aviso inmediatamente al Departamento de Comercio.</p>
          <p>Observaciones:  </p>
          <b-form-textarea v-model="observaciones" type="text" />
          <div class="text-center mt-3">
            <b-btn variant="primary" @click="onSendReject()" >
                Enviar
            </b-btn>
          </div>
        </div>
    </b-modal>

    <b-modal v-model="showPrevApprove" hide-footer :header-bg-variant="'success'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-check-circle scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h4 class="text-success text-center"><b>Aprobar inspección</b></h4>
        <p class="text-center">La inspección será marcada como realizada. </p>
        <p class="text-center">Al seleccionar esta opción, el Departamento Comercio dará aviso al solicitante de los pasos para continuar el trámite. </p>
        <div class="text-center mt-3">
          <b-btn variant="success" @click="onSendApprove">
              Aprobar
          </b-btn>
        </div>
      </div>
    </b-modal>

    <b-modal v-model="showApprove" hide-footer :header-bg-variant="'success'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-check-circle scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h4 class="text-success text-center"><b>Comercio inspeccionado</b></h4>
        <p class="text-center">El trámite ha finalizado.</p>
        <div class="text-center mt-3">
          <b-btn variant="primary" @click="showApprove = false">
              Aceptar
          </b-btn>
        </div>
      </div>
    </b-modal>

    <b-modal v-model="showProrroga" hide-footer :header-bg-variant="'success'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-check-circle scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h4 class="text-primary text-center"><b>Prórroga</b></h4>
        <p class="text-center">Se concederá prórroga de<b> 7 días hábiles </b>para que el solicitante dé cumplimiento a los requerimientos. </p>
        <p class="text-center">La cantidad total de prórrogas pasibles de conceder son dos (2) continuadas e ininterrumpidas.</p>
        <div class="text-center mt-3">
          <b-btn variant="primary" @click="onSendProrroga">
              Aceptar
          </b-btn>
        </div>
      </div>
    </b-modal>

    <div class="text-center mt-3">
      <NuxtLink to="/turnos/reservas">
      <b-button variant="primary"> Volver </b-button>
      </NuxtLink>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      inspeccion: false,
      showPrevApprove: false,
      showApprove: false,
      showRejectPopup: false,
      showProrroga: false,
      turno: null,
      observaciones: ''
    }
  },
  async fetch() {
    const id = this.$route.params.id
    await this.$store.dispatch('turnos/getById',{
      id: id,
    })
    this.turno = this.$store.state.turnos.single
  },
  fetchOnServer: false,
  activated() {
    this.$fetch()
  },
  methods: {
    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    onAprobar(){
      this.showPrevApprove = true
    },
    async onSendApprove(){
      const turno = {
        status: 'Inspeccionado'
      }
      const habilitacion = {
        status: 'Inspeccionado'
      }
      const id = this.turno.id
      const userToken = this.$store.state.user.token
      await this.$store.dispatch('turnos/update', {
        id,
        turno,
        userToken,
      })
      const nroTramite = this.turno.nroTramite
      await this.$store.dispatch('habilitaciones/getByNroTramite',{
        nroTramite
      })
      const habId = this.$store.state.habilitaciones.single.id
      await this.$store.dispatch('habilitaciones/update', {
        id: habId,
        habilitacion,
      })
      this.wait(300)
      this.$fetch()
      this.showPrevApprove = false
      this.showApprove = true
    },
    onRechazarTurno(){
      this.showRejectPopup = true
    },
    onProrroga(){
      this.showProrroga = true
    },
    async onSendProrroga(){
      var habilitacion = null
      var turno = null
      if(this.turno){
        switch (this.turno.status){
          case "Prórroga 1":
            habilitacion = {
              status: "Prórroga 2"
            }
            turno = {
              status: "Prórroga 2",
              observaciones: "Se otorga la prórroga 2"
            }
            break
          case "Prórroga 2":
            //Show modal No se pueden dar más prórrogas
            break
          case "Pendiente de inspección":
            habilitacion = {
              status: "Prórroga 1"
            }
            turno = {
              status: "Prórroga 1",
              observaciones: "Se otorga la prórroga 1"
            }
            break
        }
      }
      const id = this.turno.id
      const userToken = this.$store.state.user.token
      await this.$store.dispatch('turnos/update', {
        id,
        turno,
        userToken,
      })
      const nroTramite = this.turno.nroTramite
      await this.$store.dispatch('habilitaciones/getByNroTramite',{
        nroTramite
      })
      const habId = this.$store.state.habilitaciones.single.id
      await this.$store.dispatch('habilitaciones/update', {
        id: habId,
        habilitacion,
      })
      this.wait(300)
      this.$fetch()
      this.showPrevApprove = false
      this.showApprove = true
    },
    async onSendReject(){
      const turno = {
        observaciones: this.observaciones,
        status: 'Cancelado'
      }
      const id = this.turno.id
      const userToken = this.$store.state.user.token
      await this.$store.dispatch('turnos/update', {
        id,
        turno,
        userToken,
      })
      this.wait(300)
      this.observaciones = ''
      this.$fetch()
      this.showRejectPopup = false
    },
    onResetEdit() {
      this.editing = false
    },
    format(value) {
        if(value){
          let val = (value/1).toFixed(2).replace('.', ',')
          return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }else{
          return 0
        }
    },
  },
}
</script>

<style type="text/css">
/* Layout: */

.col-main {
  flex: 1;
}

.col-complementary {
  flex: 1;
}

.col strong{
  margin-bottom: 0%;
}
/* Responsive: */

@media only screen and (min-width: 640px) {
  .layout {
    display: flex;
    max-width: 90%;
    margin: auto;
  }
}

/* etc */

/* body {
  margin: 1.5em;
} */

.col {
  padding: 0.4em;
  margin: 0 2px 2px 40px;
}
</style>
