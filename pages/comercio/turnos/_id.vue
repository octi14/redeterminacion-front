<template>
  <div class="page main-background">
    <Banner title="Detalles de turno"/>
    <!-- Datos del solicitante -->
    <template v-if="turno">
      <div class="text-center mt-3">
        <p class="h4"> Número de trámite: <b> {{ turno.nroTramite }}  </b></p>
        <h5> Tipo de trámite: <b> {{ tipoSolicitud }} </b></h5>
      </div>
      <div class="row justify-content-center mt-3">

        <div class="h4 row"> Estado:
          <h4 class="text-primary ml-1" v-if="turno.status === 'Pendiente de inspección'">{{ turno.status }} </h4>
          <h4 class="text-success ml-1" v-if="turno.status === 'Inspeccionado'">{{ turno.status }} </h4>
          <h4 class="text-secondary ml-1" v-if="turno.status === 'Prórroga 1'">{{ turno.status }} </h4>
          <h4 class="text-secondary ml-1" v-if="turno.status === 'Prórroga 2'">{{ turno.status }} </h4>
          <h4 class="text-danger ml-1" v-if="turno.status === 'Cancelado'">{{ turno.status }} </h4>
          <h4 class="text-danger ml-1" v-if="turno.status === 'Inspección rechazada'">{{ turno.status }} </h4>
        </div>
      </div>
      <div class="row col-10 mx-auto justify-content-center" v-if="adminInspeccion">
        <b-button @click="onAprobar" variant="success" pill class="btn-4 mt-3 mx-1"> Aprobar inspección </b-button>
        <b-button @click="onProrroga" variant="secondary" pill class="btn-4 mt-3 mx-1"> Prórroga </b-button>
        <!-- <b-button @click="onRechazarTurno" pill class="btn-3 mt-3 mx-1"> Cancelar turno </b-button> -->
        <b-button @click="onRechazarInsp" pill class="btn-3 mt-3 mx-1"> Rechazar inspección </b-button>
      </div>
      <!-- datos del turno -->
      <div class="container col-md-6 col-sm-8 card shadow-card mt-4 mx-auto">
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
          <b-btn v-if="turno.status != 'Cancelado'" @click="onRechazarTurno" style="height: 30px; width:85px" size="sm" pill variant="danger" class="mx-1"><b> Cancelar</b></b-btn>
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
              <strong>Número de teléfono</strong><br>
            </p>
            <p class="col col-complementary" role="complementary">
              <a>{{ telefono }}</a>
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
          <h2 class="icon-orange text-danger text-center"><b>Rechazar inspección</b></h2>
          <p>La inspección será rechazada. Se dará aviso inmediatamente al Departamento de Comercio.</p>
          <p>Observaciones:  </p>
          <b-form-textarea v-model="observaciones" type="text" />
          <div class="text-center mt-3">
            <b-btn variant="danger" @click="onSendReject()" >
                Enviar
            </b-btn>
          </div>
        </div>
    </b-modal>

    <!-- cancelar turno-->
    <b-modal v-model="showCancelPopup" hide-footer :header-bg-variant="'danger'" centered>
        <template #modal-header>
          <div class="confirmation-popup-header mx-auto">
            <b-icon-exclamation-triangle scale="2" variant="light" />
          </div>
        </template>
        <div class="confirmation-popup-body">
          <h2 class="icon-orange text-center text-danger"><b>Cancelar turno</b></h2>
          <p>El turno será cancelado. Se dará aviso inmediatamente al Departamento de Comercio.</p>
          <p>Observaciones:  </p>
          <b-form-textarea v-model="observaciones" type="text" />
          <div class="text-center mt-3">
            <b-btn variant="danger" @click="onSendCancel()" >
                Enviar
            </b-btn>
          </div>
        </div>
    </b-modal>

    <!-- chequeo aprobar inspección-->
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

    <!-- inspección aprobada-->
    <b-modal v-model="showApprove" hide-footer :header-bg-variant="'success'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-check-circle scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h4 class="text-success text-center"><b>Comercio inspeccionado</b></h4>
        <p class="text-center">El trámite continuará desde el Departamento de Comercio.</p>
        <div class="text-center mt-3">
          <b-btn variant="success" @click="showApprove = false">
              Aceptar
          </b-btn>
        </div>
      </div>
    </b-modal>

    <!-- chequeo prorroga-->
    <b-modal v-model="showPrevProrroga" hide-footer :header-bg-variant="'secondary'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-check-circle scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h4 class="text-primary text-center text-secondary"><b>Prórroga</b></h4>
        <p class="text-center">Se concederá prórroga de<b> 7 días hábiles </b>para que el solicitante dé cumplimiento a los requerimientos. </p>
        <p class="text-center">La cantidad total de prórrogas pasibles de conceder son dos (2) continuadas e ininterrumpidas.</p>
        <div class="text-center mt-3">
          <b-btn variant="secondary" @click="onSendProrroga">
              Aceptar
          </b-btn>
        </div>
      </div>
    </b-modal>

    <!-- prórroga exitosa-->
    <b-modal v-model="showProrroga" hide-footer :header-bg-variant="'success'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-check-circle scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h4 class="text-success text-center"><b>Inspección prorrogada</b></h4>
        <p class="text-center">El trámite ha sido prorrogado por 7 días hábiles a partir de la fecha en la que se efectuó la prórroga.</p>
        <div class="text-center mt-3">
          <b-btn variant="success" @click="showProrroga = false">
              Aceptar
          </b-btn>
        </div>
      </div>
    </b-modal>

    <!-- no se pueden dar más prórrogas-->
    <b-modal v-model="showNoMasProrrogas" hide-footer :header-bg-variant="'danger'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-exclamation-circle scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h4 class="text-danger text-center"><b>No se pueden otorgar más prórrogas</b></h4>
        <p class="text-center">Sólo pueden darse 2 prórrogas por turno. En caso de requerir un caso especial donde haya más de 2 prórrogas por favor comuníquese con Soporte Técnico. </p>
        <div class="text-center mt-3">
          <b-btn variant="danger" @click="showNoMasProrrogas = false">
              Aceptar
          </b-btn>
        </div>
      </div>
    </b-modal>

    <div class="text-center my-4">
      <NuxtLink to="/comercio/turnos/reservas">
      <b-button variant="primary"> Volver </b-button>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import MailerService from "@/service/mailer.js";

export default {
  data() {
    return {
      inspeccion: false,
      showPrevApprove: false,
      showApprove: false,
      showRejectPopup: false,
      showCancelPopup: false,
      showPrevProrroga: false,
      showProrroga: false,
      showNoMasProrrogas: false,
      turno: null,
      observaciones: '',
      telefono: null,
      tipoSolicitud: '',
    }
  },
  async fetch() {
    const id = this.$route.params.id
    await this.$store.dispatch('turnos/getById',{
      id: id,
    })
    this.turno = this.$store.state.turnos.single
    const nroTramite = this.turno.nroTramite
    await this.$store.dispatch('habilitaciones/getByNroTramite',{
      nroTramite
    })
    this.telefono = this.$store.state.habilitaciones.single.telefono
    this.tipoSolicitud = this.$store.state.habilitaciones.single.tipoSolicitud
  },
  fetchOnServer: false,
  activated() {
    this.$fetch()
  },
  computed: {
    adminInspeccion(){
      return this.$store.state.user.admin == "inspeccion" || this.$store.state.user.admin == "master"
    }
  },
  methods: {
    async registrarActividad(evento, result, nroSolicitud){
      const userId = this.$store.state.user.username; // Reemplaza con el ID del usuario real
      const actionType = evento;
      const actionResult = "Trámite nro " + nroSolicitud + ' ' + result;

      try {
          await this.$logUserActivity(userId, actionType, actionResult);
      } catch (error) {
          console.error('Error al registrar la actividad:', error);
      }
    },
    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    onAprobar(){
      this.showPrevApprove = true
    },
    onRechazarTurno(){
      this.showCancelPopup = true
    },
    onRechazarInsp(){
      this.showRejectPopup = true
    },
    onProrroga(){
      if(this.turno.status === "Prórroga 2"){
        this.showNoMasProrrogas = true
      }else{
        this.showPrevProrroga = true
      }
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

      // Guardar el email antes del update
      const destinatario = this.$store.state.habilitaciones.single.mail

      const habId = this.$store.state.habilitaciones.single.id
      await this.$store.dispatch('habilitaciones/update', {
        id: habId,
        habilitacion,
      })
      this.registrarActividad('Arobar Inspección', 'Inspección Aprobada', this.turno.nroTramite)

      // --- Enviar correo al solicitante ---
      try {
        if (destinatario) {
          const asunto = `Inspección comercial aprobada - N° ${this.turno.nroTramite}`
          const mensaje = `Estimado/a contribuyente,

Su inspección comercial ha sido aprobada exitosamente.

Número de trámite: ${this.turno.nroTramite}
Fecha de inspección: ${this.turno.dia}
Horario: ${this.turno.horario}
Domicilio: ${this.turno.domicilio}

El trámite continuará desde el Departamento Comercio MVGesell. En los próximos días recibirá un correo electrónico indicándole los pasos a seguir para finalizarlo.

Si tiene dudas o necesita más información, por favor comuníquese con el Departamento Comercio MVGesell (deptocomercio@gesell.gob.ar).`

          await MailerService.enviarCorreo(this.$axios, { destinatario, asunto, mensaje })
          this.$bvToast.toast('Correo de aprobación de inspección enviado al solicitante.', { variant: 'success' })
        } else {
          console.error('No se encontró el email del solicitante')
          this.$bvToast.toast('No se pudo enviar el correo: email del solicitante no disponible.', { variant: 'danger' })
        }
      } catch (e) {
        console.error('Error al enviar correo:', e)
        this.$bvToast.toast('No se pudo enviar el correo de aprobación de inspección.', { variant: 'danger' })
      }

      this.wait(300)
      this.$fetch()
      this.showPrevApprove = false
      this.showApprove = true
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
              observaciones: "Se otorga la prórroga 2 el " + new Date().toLocaleDateString('es-AR')
            }
            break
          case "Prórroga 2":
            //Show modal No se pueden dar más prórrogas
            break
          default:
            habilitacion = {
              status: "Prórroga 1"
            }
            turno = {
              status: "Prórroga 1",
              observaciones: "Se otorga la prórroga 1 el " + new Date().toLocaleDateString('es-AR')
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

      // Guardar el email antes del update
      const destinatario = this.$store.state.habilitaciones.single.mail
      const habId = this.$store.state.habilitaciones.single.id
      await this.$store.dispatch('habilitaciones/update', {
        id: habId,
        habilitacion,
      })
      this.registrarActividad('Otorgar Prorroga', this.turno.status + " Otorgada", this.turno.nroTramite)

      // --- Enviar correo al solicitante ---
      try {
        if (destinatario) {
          const asunto = `Prórroga otorgada - N° ${this.turno.nroTramite}`
          const mensaje = `Estimado/a contribuyente,

Se le ha otorgado una prórroga para su inspección comercial.

Número de trámite: ${this.turno.nroTramite}
Fecha de inspección: ${this.turno.dia}
Horario: ${this.turno.horario}
Domicilio: ${this.turno.domicilio}

La prórroga es de 7 días a partir de la fecha de otorgación. Para continuar con el trámite, debe completar los requisitos pendientes antes del vencimiento de la misma.

Si tiene dudas o necesita más información, por favor comuníquese con el Departamento Comercio MVGesell (deptocomercio@gesell.gob.ar).`

          await MailerService.enviarCorreo(this.$axios, { destinatario, asunto, mensaje })
          this.$bvToast.toast('Correo de prórroga enviado al solicitante.', { variant: 'success' })
        } else {
          console.error('No se encontró el email del solicitante')
          this.$bvToast.toast('No se pudo enviar el correo: email del solicitante no disponible.', { variant: 'danger' })
        }
      } catch (e) {
        console.error('Error al enviar correo de prórroga:', e)
        this.$bvToast.toast('No se pudo enviar el correo de prórroga.', { variant: 'danger' })
      }
      this.wait(300)
      this.$fetch()
      this.showPrevProrroga = false
      this.showProrroga = true
    },
    async onSendReject(){
      const turno = {
        observaciones: this.observaciones,
        status: 'Inspección rechazada'
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
      // Guardar el email antes del update
      const destinatario = this.$store.state.habilitaciones.single.mail
      const observaciones = this.$store.state.habilitaciones.single.observaciones
      const habilitacion = {
        status: 'Rechazada',
        observaciones: observaciones + " - " + 'Se rechaza la inspección el día ' + new Date().toLocaleDateString('es-AR') + " " + this.observaciones
      }
      const habId = this.$store.state.habilitaciones.single.id
      await this.$store.dispatch('habilitaciones/update', {
        id: habId,
        habilitacion,
      })
      this.registrarActividad('Rechazar Inspección', 'Inspección Rechazada', this.turno.nroTramite)

      // --- Enviar correo al solicitante ---
      try {
        if (destinatario) {
          const asunto = `Inspección comercial rechazada - N° ${this.turno.nroTramite}`
          const mensaje = `Estimado/a contribuyente,

Su inspección comercial ha sido rechazada.

Número de trámite: ${this.turno.nroTramite}
Fecha de inspección: ${this.turno.dia}
Horario: ${this.turno.horario}
Domicilio: ${this.turno.domicilio}

Motivo del rechazo: ${this.observaciones}

Si tiene dudas o necesita más información, por favor comuníquese con el Departamento Comercio MVGesell (deptocomercio@gesell.gob.ar).`

          await MailerService.enviarCorreo(this.$axios, { destinatario, asunto, mensaje })
          this.$bvToast.toast('Correo de rechazo de inspección enviado al solicitante.', { variant: 'success' })
        } else {
          console.error('No se encontró el email del solicitante')
          this.$bvToast.toast('No se pudo enviar el correo: email del solicitante no disponible.', { variant: 'danger' })
        }
      } catch (e) {
        this.$bvToast.toast('No se pudo enviar el correo de rechazo de inspección.', { variant: 'danger' })
      }
      this.wait(300)
      this.observaciones = ''
      this.$fetch()
      this.showRejectPopup = false
    },
    async onSendCancel(){
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
      const nroTramite = this.turno.nroTramite
      await this.$store.dispatch('habilitaciones/getByNroTramite',{
        nroTramite
      })
      // Guardar el email antes del update
      const destinatario = this.$store.state.habilitaciones.single.mail
      const observaciones = this.$store.state.habilitaciones.single.observaciones
      const habilitacion = {
        status: "Esperando turno",
        observaciones: observaciones + " - " + "Se canceló el turno el día " + new Date().toLocaleDateString('es-AR')
      }
      const habId = this.$store.state.habilitaciones.single.id
      await this.$store.dispatch('habilitaciones/update', {
        id: habId,
        habilitacion,
      })
      this.registrarActividad('Cancelar Turno Inspección', 'Inspección Cancelada', nroTramite)

      // --- Enviar correo al solicitante ---
      try {
        if (destinatario) {
          const asunto = `Turno de inspección cancelado - N° ${this.turno.nroTramite}`
          const mensaje = `Estimado/a contribuyente,

Su turno de inspección comercial ha sido cancelado.

Número de trámite: ${this.turno.nroTramite}
Fecha de inspección: ${this.turno.dia}
Horario: ${this.turno.horario}
Domicilio: ${this.turno.domicilio}

Motivo de la cancelación: ${this.observaciones}

Para continuar con el trámite, debe solicitar un nuevo turno de inspección en la página de turnos web.

Si tiene dudas o necesita más información, por favor comuníquese con el Departamento Comercio MVGesell (deptocomercio@gesell.gob.ar).`

          await MailerService.enviarCorreo(this.$axios, { destinatario, asunto, mensaje })
          this.$bvToast.toast('Correo de cancelación de turno enviado al solicitante.', { variant: 'success' })
        } else {
          console.error('No se encontró el email del solicitante')
          this.$bvToast.toast('No se pudo enviar el correo: email del solicitante no disponible.', { variant: 'danger' })
        }
      } catch (e) {
        this.$bvToast.toast('No se pudo enviar el correo de cancelación de turno.', { variant: 'danger' })
      }
      this.wait(300)
      this.observaciones = ''
      this.$fetch()
      this.showCancelPopup = false
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
