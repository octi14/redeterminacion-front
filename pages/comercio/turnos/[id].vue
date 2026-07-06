<template>
  <div class="page main-background">
    <Banner title="Detalles de turno"/>
    <!-- Datos del solicitante -->
    <template v-if="turno && (adminComercio || adminInspeccion)">
      <div class="solicitud-resumen">
        <div class="row justify-content-center mt-3">
          <p class="h4 mb-0">Número de trámite: <b>{{ turno.nroTramite }}</b></p>
        </div>
        <div class="row justify-content-center mt-3">
          <p class="h5 mb-0">Tipo de trámite: <b>{{ tipoSolicitud }}</b></p>
        </div>
        <div class="row justify-content-center mt-3">
          <div class="h5 d-flex align-items-center justify-content-center flex-wrap mb-0">
            <span>Estado:</span>
            <span :class="turnoStatusClass" class="ml-2">{{ turno.status }}</span>
          </div>
        </div>
      </div>
      <div v-if="adminInspeccion" class="solicitud-quick-actions">
        <b-button size="sm" variant="success" class="btn-4" @click="onAprobar">Aprobar inspección</b-button>
        <b-button size="sm" variant="secondary" class="btn-4" @click="onProrroga">Prórroga</b-button>
        <b-button size="sm" class="btn-3" @click="onRechazarInsp">Rechazar inspección</b-button>
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
          <b-button v-if="turno.status != 'Cancelado'" @click="onRechazarTurno" style="height: 30px; width:85px" size="sm" variant="danger" class="mx-1"> Cancelar</b-button>
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
    <BModal v-model="showRejectPopup" no-footer :header-bg-variant="'danger'" centered>
        <template #header>
          <div class="confirmation-popup-header mx-auto">
            <i class="bi bi-exclamation-triangle text-light"></i>
          </div>
        </template>
        <div class="confirmation-popup-body">
          <h2 class="icon-orange text-danger text-center"><b>Rechazar inspección</b></h2>
          <p>La inspección será rechazada. Se dará aviso inmediatamente al Departamento de Comercio.</p>
          <p>Observaciones:  </p>
          <b-form-textarea v-model="observaciones" type="text" />
          <div class="text-center mt-3">
            <b-button variant="danger" @click="onSendReject()" >
                Enviar
            </b-button>
          </div>
        </div>
    </BModal>

    <!-- cancelar turno-->
    <BModal v-model="showCancelPopup" no-footer :header-bg-variant="'danger'" centered>
        <template #header>
          <div class="confirmation-popup-header mx-auto">
            <i class="bi bi-exclamation-triangle text-light"></i>
          </div>
        </template>
        <div class="confirmation-popup-body">
          <h2 class="icon-orange text-center text-danger"><b>Cancelar turno</b></h2>
          <p>El turno será cancelado. Se dará aviso inmediatamente al Departamento de Comercio.</p>
          <p>Observaciones:  </p>
          <b-form-textarea v-model="observaciones" type="text" />
          <div class="text-center mt-3">
            <b-button variant="danger" @click="onSendCancel()" >
                Enviar
            </b-button>
          </div>
        </div>
    </BModal>

    <!-- chequeo aprobar inspección-->
    <BModal v-model="showPrevApprove" no-footer :header-bg-variant="'success'" centered>
      <template #header>
        <div class="confirmation-popup-header mx-auto">
          <i class="bi bi-check-circle text-light"></i>
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h4 class="text-success text-center"><b>Aprobar inspección</b></h4>
        <p class="text-center">La inspección será marcada como realizada. </p>
        <p class="text-center">Al seleccionar esta opción, el Departamento Comercio dará aviso al solicitante de los pasos para continuar el trámite. </p>
        <div class="text-center mt-3">
          <b-button variant="success" @click="onSendApprove">
              Aprobar
          </b-button>
        </div>
      </div>
    </BModal>

    <!-- inspección aprobada-->
    <BModal v-model="showApprove" no-footer :header-bg-variant="'success'" centered>
      <template #header>
        <div class="confirmation-popup-header mx-auto">
          <i class="bi bi-check-circle text-light"></i>
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h4 class="text-success text-center"><b>Comercio inspeccionado</b></h4>
        <p class="text-center">El trámite continuará desde el Departamento de Comercio.</p>
        <div class="text-center mt-3">
          <b-button variant="success" @click="showApprove = false">
              Aceptar
          </b-button>
        </div>
      </div>
    </BModal>

    <!-- chequeo prorroga-->
    <BModal v-model="showPrevProrroga" no-footer :header-bg-variant="'secondary'" centered>
      <template #header>
        <div class="confirmation-popup-header mx-auto">
          <i class="bi bi-check-circle text-light"></i>
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h4 class="text-primary text-center text-secondary"><b>Prórroga</b></h4>
        <p class="text-center">Se concederá prórroga de<b> 7 días hábiles </b>para que el solicitante dé cumplimiento a los requerimientos. </p>
        <p class="text-center">La cantidad total de prórrogas pasibles de conceder son dos (2) continuadas e ininterrumpidas.</p>
        <div class="text-center mt-3">
          <b-button variant="secondary" @click="onSendProrroga">
              Aceptar
          </b-button>
        </div>
      </div>
    </BModal>

    <!-- prórroga exitosa-->
    <BModal v-model="showProrroga" no-footer :header-bg-variant="'success'" centered>
      <template #header>
        <div class="confirmation-popup-header mx-auto">
          <i class="bi bi-check-circle text-light"></i>
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h4 class="text-success text-center"><b>Inspección prorrogada</b></h4>
        <p class="text-center">El trámite ha sido prorrogado por 7 días hábiles a partir de la fecha en la que se efectuó la prórroga.</p>
        <div class="text-center mt-3">
          <b-button variant="success" @click="showProrroga = false">
              Aceptar
          </b-button>
        </div>
      </div>
    </BModal>

    <!-- no se pueden dar más prórrogas-->
    <BModal v-model="showNoMasProrrogas" no-footer :header-bg-variant="'danger'" centered>
      <template #header>
        <div class="confirmation-popup-header mx-auto">
          <i class="bi bi-exclamation-circle text-light"></i>
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h4 class="text-danger text-center"><b>No se pueden otorgar más prórrogas</b></h4>
        <p class="text-center">Sólo pueden darse 2 prórrogas por turno. En caso de requerir un caso especial donde haya más de 2 prórrogas por favor comuníquese con Soporte Técnico. </p>
        <div class="text-center mt-3">
          <b-button variant="danger" @click="showNoMasProrrogas = false">
              Aceptar
          </b-button>
        </div>
      </div>
    </BModal>

    <div class="page-btn-volver-wrap">
      <NuxtLink to="/comercio/turnos/reservas">
      <b-button variant="primary" size="sm" class="page-btn-volver"> Volver </b-button>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['authenticated', 'require-admin'],
  adminRoles: ['comercio', 'master', 'inspeccion'],
})
</script>

<script>
import MailerService from "@/service/mailer.js";

export default {
  setup(){ const { showToast } = useProjectToast(); return { showToast } },
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
  async mounted() {
    await this.loadTurno()
  },
  activated() {
    void this.loadTurno()
  },
  computed: {
    adminInspeccion(){
      const admin = useUserStore().admin
      return admin == "inspeccion" || admin == "master"
    },
    adminComercio(){
      const admin = useUserStore().admin
      return admin == "comercio" || admin == "master"
    },
    turnoStatusClass() {
      const classes = {
        'Pendiente de inspección': 'text-primary',
        Inspeccionado: 'text-success',
        'Prórroga 1': 'text-secondary',
        'Prórroga 2': 'text-secondary',
        Cancelado: 'text-danger',
        'Inspección rechazada': 'text-danger',
      }
      return classes[this.turno?.status] || ''
    },
  },
  methods: {
    async loadTurno() {
      const id = this.$route.params.id
      await useTurnosStore().getById({
        id,
      })
      this.turno = useTurnosStore().single
      const nroTramite = this.turno?.nroTramite
      if (!nroTramite) {
        this.telefono = null
        this.tipoSolicitud = ''
        return
      }
      await useHabilitacionesStore().getByNroTramite({
        nroTramite,
      })
      const habilitacion = useHabilitacionesStore().single
      this.telefono = habilitacion?.telefono || null
      this.tipoSolicitud = habilitacion?.tipoSolicitud || ''
    },
    async registrarActividad(evento, result, nroSolicitud){
      const userId = useUserStore().username; // Reemplaza con el ID del usuario real
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
      const userToken = useUserStore().token
      await useTurnosStore().update({
        id,
        turno,
        userToken,
      })
      const nroTramite = this.turno.nroTramite
      await useHabilitacionesStore().getByNroTramite({
        nroTramite
      })

      // Guardar el email antes del update
      const destinatario = useHabilitacionesStore().single.mail

      const habId = useHabilitacionesStore().single.id
      await useHabilitacionesStore().update({
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

El trámite continuará desde el Departamento Comercio MVGesell. En los próximos días recibirá un correo electrónico indicándole los pasos
a seguir para finalizar el trámite, incluyendo el pago de la/s tasa/s correspondiente/s.`

          await MailerService.enviarCorreo(useApi(), { destinatario, asunto, mensaje })
          this.showToast('Correo de aprobación de inspección enviado al solicitante', { variant: 'success' })
        } else {
          console.error('No se encontró el email del solicitante')
          this.showToast('No se pudo enviar el correo: email del solicitante no disponible', { variant: 'danger' })
        }
      } catch (e) {
        console.error('Error al enviar correo:', e)
        this.showToast('No se pudo enviar el correo de aprobación de inspección', { variant: 'danger' })
      }

      this.wait(300)
      void this.loadTurno()
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
      const userToken = useUserStore().token
      await useTurnosStore().update({
        id,
        turno,
        userToken,
      })
      const nroTramite = this.turno.nroTramite
      await useHabilitacionesStore().getByNroTramite({
        nroTramite
      })

      // Guardar el email antes del update
      const destinatario = useHabilitacionesStore().single.mail
      const habId = useHabilitacionesStore().single.id
      await useHabilitacionesStore().update({
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

          await MailerService.enviarCorreo(useApi(), { destinatario, asunto, mensaje })
          this.showToast('Correo de prórroga enviado al solicitante', { variant: 'success' })
        } else {
          console.error('No se encontró el email del solicitante')
          this.showToast('No se pudo enviar el correo: email del solicitante no disponible', { variant: 'danger' })
        }
      } catch (e) {
        console.error('Error al enviar correo de prórroga:', e)
        this.showToast('No se pudo enviar el correo de prórroga', { variant: 'danger' })
      }
      this.wait(300)
      void this.loadTurno()
      this.showPrevProrroga = false
      this.showProrroga = true
    },
    async onSendReject(){
      const turno = {
        observaciones: this.observaciones,
        status: 'Inspección rechazada'
      }
      const id = this.turno.id
      const userToken = useUserStore().token
      await useTurnosStore().update({
        id,
        turno,
        userToken,
      })
      const nroTramite = this.turno.nroTramite
      await useHabilitacionesStore().getByNroTramite({
        nroTramite
      })
      // Guardar el email antes del update
      const destinatario = useHabilitacionesStore().single.mail
      const observaciones = useHabilitacionesStore().single.observaciones
      const habilitacion = {
        status: 'Rechazada',
        observaciones: observaciones + " - " + 'Se rechaza la inspección el día ' + new Date().toLocaleDateString('es-AR') + " " + this.observaciones
      }
      const habId = useHabilitacionesStore().single.id
      await useHabilitacionesStore().update({
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

          await MailerService.enviarCorreo(useApi(), { destinatario, asunto, mensaje })
          this.showToast('Correo de rechazo de inspección enviado al solicitante', { variant: 'success' })
        } else {
          console.error('No se encontró el email del solicitante')
          this.showToast('No se pudo enviar el correo: email del solicitante no disponible', { variant: 'danger' })
        }
      } catch (e) {
        this.showToast('No se pudo enviar el correo de rechazo de inspección', { variant: 'danger' })
      }
      this.wait(300)
      this.observaciones = ''
      void this.loadTurno()
      this.showRejectPopup = false
    },
    async onSendCancel(){
      const turno = {
        observaciones: this.observaciones,
        status: 'Cancelado'
      }
      const id = this.turno.id
      const userToken = useUserStore().token
      await useTurnosStore().update({
        id,
        turno,
        userToken,
      })
      const nroTramite = this.turno.nroTramite
      await useHabilitacionesStore().getByNroTramite({
        nroTramite
      })
      // Guardar el email antes del update
      const destinatario = useHabilitacionesStore().single.mail
      const observaciones = useHabilitacionesStore().single.observaciones
      const habilitacion = {
        status: "Esperando turno",
        observaciones: observaciones + " - " + "Se canceló el turno el día " + new Date().toLocaleDateString('es-AR')
      }
      const habId = useHabilitacionesStore().single.id
      await useHabilitacionesStore().update({
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

          await MailerService.enviarCorreo(useApi(), { destinatario, asunto, mensaje })
          this.showToast('Correo de cancelación de turno enviado al solicitante', { variant: 'success' })
        } else {
          console.error('No se encontró el email del solicitante')
          this.showToast('No se pudo enviar el correo: email del solicitante no disponible', { variant: 'danger' })
        }
      } catch (e) {
        this.showToast('No se pudo enviar el correo de cancelación de turno', { variant: 'danger' })
      }
      this.wait(300)
      this.observaciones = ''
      void this.loadTurno()
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
