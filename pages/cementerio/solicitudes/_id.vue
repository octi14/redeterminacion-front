<template>
  <div class="page main-background">
    <Banner title="Detalles de solicitud"/>
    <div v-if="!item" class="text-center mt-3">
      <h2> Cargando </h2>
      <h4> Por favor espere unos segundos </h4>
    </div>

    <template v-if="item">
      <!-- Estado y acciones -->
      <div class="flex col" style="width: 96%">
        <div class="row justify-content-center mt-3">
          <div class="h5 row"> Estado:
            <h5 :class="getStatusClass(item.estado)" class="ml-2"> {{ item.estado }}</h5>
          </div>
        </div>
      </div>
      <div class="row col-10 mx-auto justify-content-center" v-if="adminCementerio">
        <b-button @click="onShowApprove" variant="success" class="btn-4 mt-3 mx-1" v-if="item.estado==='En revisión'"> Aprobar solicitud </b-button>
        <b-button @click="onShowReject" class="btn-3 mt-3 mx-1"> Rechazar solicitud </b-button>
        <b-button @click="onShowRestore" variant="secondary" class="btn-2 mt-3 mx-1"> Volver a En revisión </b-button>
      </div>

      <!-- Datos funeraria y óbito -->
      <b-card no-body class="container col-md-6 col-sm-8 shadow-card mt-4 mx-auto">
        <div class="container text-center mx-auto">
          <h2 class="text-success mt-2"><b> Datos de la funeraria </b></h2>
          <hr/>
        </div>
        <div class="container mx-auto">
          <div class="layout"><p class="col col-main"><strong>CUIT</strong></p><p class="col col-complementary"><a>{{ item.funeraria?.cuit }}</a></p></div>
          <div class="layout"><p class="col col-main"><strong>Responsable</strong></p><p class="col col-complementary"><a>{{ item.funeraria?.responsable }}</a></p></div>
          <div class="layout"><p class="col col-main"><strong>Teléfono</strong></p><p class="col col-complementary"><a>{{ item.funeraria?.telefono }}</a></p></div>
          <div class="layout"><p class="col col-main"><strong>Mail</strong></p><p class="col col-complementary"><a>{{ item.funeraria?.mail }}</a></p></div>
        </div>
      </b-card>

      <b-card no-body class="container col-md-6 col-sm-8 shadow-card mt-4 mx-auto">
        <div class="container text-center mx-auto">
          <h2 class="text-success mt-2"><b> Datos del óbito </b></h2>
          <hr/>
        </div>
        <div class="container mx-auto">
          <div class="layout"><p class="col col-main"><strong>Apellido</strong></p><p class="col col-complementary"><a>{{ item.obito?.apellido }}</a></p></div>
          <div class="layout"><p class="col col-main"><strong>Nombre</strong></p><p class="col col-complementary"><a>{{ item.obito?.nombre }}</a></p></div>
          <div class="layout"><p class="col col-main"><strong>Tipo de documento</strong></p><p class="col col-complementary"><a>{{ item.obito?.tipoDocumento }}</a></p></div>
          <div class="layout"><p class="col col-main"><strong>Nro de documento</strong></p><p class="col col-complementary"><a>{{ item.obito?.numeroDocumento }}</a></p></div>
          <div class="layout"><p class="col col-main"><strong>Fecha de defunción</strong></p><p class="col col-complementary"><a>{{ item.obito?.fechaDefuncion ? new Date(item.obito.fechaDefuncion).toLocaleDateString('es-AR') : '' }}</a></p></div>
        </div>
      </b-card>

      <!-- Documentación -->
      <div class="container col-md-6 col-sm-8 card shadow-card mt-4 mb-3 mx-auto">
        <div class="container text-center mx-auto">
          <h2 class="text-success mt-2"><b> Documentación presentada </b></h2>
          <hr/>
        </div>
        <div class="container justify-content-center mx-auto" v-if="documentos">
          <div v-for="(doc, nombre) in documentos" :key="nombre">
            <div class="layout" v-if="doc && doc.url">
              <p class="col col-main"><strong>{{ nombre }}</strong></p>
              <p class="col col-complementary">
                <a :href="doc.url" target="_blank">
                  <b-button size="sm" variant="outline-primary" pill>
                    <b-icon icon="eye" scale="1.2"></b-icon> Ver
                  </b-button>
                </a>
              </p>
            </div>
          </div>
        </div>
        <div class="justify-content-center mx-auto" v-else>
          <p class="h4 text-loading text-center"> Cargando... </p>
          <div class="row justify-content-center mb-3"><b-spinner variant="success"></b-spinner></div>
        </div>
      </div>
    </template>

    <div class="text-center mb-3">
      <NuxtLink to="/cementerio/solicitudes">
        <b-button variant="primary">Volver</b-button>
      </NuxtLink>
    </div>

    <!-- Modals -->
    <b-modal v-model="showReject" hide-footer :header-bg-variant="'danger'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-envelope scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h2 class="icon-orange text-danger text-center"><b>Rechazar solicitud</b></h2>
        <p>Se enviará un correo a la funeraria informando el rechazo.</p>
        <div class="text-center mt-3">
          <b-btn variant="danger" @click="onSendReject()">Enviar</b-btn>
        </div>
      </div>
    </b-modal>

    <b-modal v-model="showApprove" hide-footer :header-bg-variant="'success'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-check-circle scale="2" variant="light" class="my-2" />
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h2 class="icon-orange text-success text-center"><b>Aprobar solicitud</b></h2>
        <p class="text-center">Se enviará un correo informando la aprobación.</p>
        <div class="text-center mt-3">
          <b-btn variant="primary" @click="onSendApprove()">Aceptar</b-btn>
        </div>
      </div>
    </b-modal>

    <b-modal v-model="showRestore" hide-footer :header-bg-variant="'secondary'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-exclamation-triangle scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body text-center">
        <h3 class="text-secondary text-center mb-4"><b>Volver a En revisión</b></h3>
        <div class="text-center mt-4">
          <b-btn variant="success" @click="onSendRestore()">Aceptar</b-btn>
          <b-btn variant="danger" @click="showRestore = false">Cancelar</b-btn>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import MailerService from '~/service/mailer.js'

export default {
  middleware: ['authenticated'],
  data() {
    return {
      item: null,
      documentos: null,
      showApprove: false,
      showReject: false,
      showRestore: false,
      statusClasses: { 'En revisión': 'text-primary', 'Rechazada': 'text-danger', 'Aprobada': 'text-darkgreen' },
    }
  },
  async fetch() {
    const id = this.$route.params.id
    await this.$store.dispatch('cementerio/getSingle', { id })
    this.item = this.$store.state.cementerio.single
    const documentosResp = await this.$services.cementerio?.getDocumentos?.(this.$axios, { id }) || await this.$axios.$get(`/cementerio/certificadosDefuncion/documentos/${id}`)
    this.documentos = documentosResp.data || documentosResp
  },
  computed: {
    adminCementerio(){
      return this.$store.state.user.admin == "cementerio" || this.$store.state.user.admin == "master"
    },
  },
  methods: {
    getStatusClass(status) { return this.statusClasses[status] || '' },
    onShowApprove(){ this.showApprove = true },
    onShowReject(){ this.showReject = true },
    onShowRestore(){ this.showRestore = true },
    async onSendApprove(){
      const id = this.$route.params.id
      await this.$store.dispatch('cementerio/update', { id, certificado: { estado: 'Aprobada' } })
      this.item.estado = 'Aprobada'
      try{
        const destinatario = this.item.funeraria?.mail
        const asunto = `Aprobación de solicitud de certificado de defunción`
        const mensaje = `Estimado/a,

Su solicitud ha sido aprobada.

Fecha: ${new Date().toLocaleDateString('es-AR')}

Saludos cordiales.`
        await MailerService.enviarCorreo(this.$axios, { destinatario, asunto, mensaje })
      }catch(e){}
      this.showApprove = false
    },
    async onSendReject(){
      const id = this.$route.params.id
      await this.$store.dispatch('cementerio/update', { id, certificado: { estado: 'Rechazada' } })
      this.item.estado = 'Rechazada'
      try{
        const destinatario = this.item.funeraria?.mail
        const asunto = `Rechazo de solicitud de certificado de defunción`
        const mensaje = `Estimado/a,

Su solicitud ha sido rechazada.

Saludos cordiales.`
        await MailerService.enviarCorreo(this.$axios, { destinatario, asunto, mensaje })
      }catch(e){}
      this.showReject = false
    },
    async onSendRestore(){
      const id = this.$route.params.id
      await this.$store.dispatch('cementerio/update', { id, certificado: { estado: 'En revisión' } })
      this.item.estado = 'En revisión'
      try{
        const destinatario = this.item.funeraria?.mail
        const asunto = `Actualización de solicitud de certificado de defunción`
        const mensaje = `Estimado/a,

Su solicitud ha vuelto al estado: En revisión.

Saludos cordiales.`
        await MailerService.enviarCorreo(this.$axios, { destinatario, asunto, mensaje })
      }catch(e){}
      this.showRestore = false
    },
  },
}
</script>

<style scoped>
.col-main { flex: 1; }
.col-complementary { flex: 1; }
.icon-orange{ color: #E27910; }
.text-loading{ color: #0eb7b2ab; }
@media only screen and (min-width: 640px) { .layout { display: flex; max-width: 90%; margin: auto; } }
</style>



