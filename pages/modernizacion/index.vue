<template>
  <div class="page main-background">
    <Banner title="Modernización" />
    <!-- Modal agregar archivo -->
    <b-modal v-model="isAdding" hide-header-close title-class="h5 mx-auto text-light" header-bg-variant="secondary" hide-footer centered>
      <template #modal-header>
        <div class="row mx-auto">
          <b-icon-upload class="my-3 mr-2" style="color:white" scale="2"/>
          <!-- <h4 class="text-light my-2 ml-4">Agregar archivo</h4> -->
        </div>
      </template>
      <MultimediaForm @submit="onSubmit" @reset="onHideModal"/>
    </b-modal>
    <!-- Content -->
    <!-- Botón -->
    <div class="container" v-if="adminModernizacion">
      <div class="row">
        <b-button pill class="mx-auto shadow-card" variant="secondary" @click="onShowModal"> Agregar archivo </b-button>
      </div>
    </div>
    <!-- Menú -->
    <div v-if="!(adminModernizacion || adminCultura)">
      <p class="h5 text-center my-5"> Esta página sólo está disponible para uso interno del personal Municipal. </p>
    </div>
    <div class="row mx-auto justify-content-center" v-if="adminModernizacion || adminCultura">
      <div class="text-center mx-4 my-auto" v-if="adminModernizacion">
        <NuxtLink to="/modernizacion/procedimientos">
          <b-button variant="outline" class="mt-3 btn-5">
            <b-icon-folder class="h1 landing-icon" /> <br />
            <h4 style="color:green"><b> Procedimientos </b></h4>
          </b-button>
        </NuxtLink>
      </div>
      <div class="text-center mx-4 my-auto" v-if="adminModernizacion">
        <NuxtLink to="/modernizacion/tutoriales">
          <b-button variant="outline" class="mt-3 btn-5">
            <b-icon-folder class="h1 landing-icon" /> <br />
            <h4 style="color:green"><b> Tutoriales </b></h4>
          </b-button>
        </NuxtLink>
      </div>
      <div class="text-center mx-4 my-auto">
        <NuxtLink to="/modernizacion/notas">
          <b-button variant="outline" class="mt-5 btn-5">
            <b-icon-folder class="h1 landing-icon" /> <br />
            <h4 style="color:green"><b> Formularios/<br/> Notas tipo </b></h4>
          </b-button>
        </NuxtLink>
      </div>
    </div>
    <div class="container">
      <div class="row justify-content-center mt-5">
        <NuxtLink to="/">
          <b-button variant="primary"> Volver </b-button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      isAdding: false,
    }
  },
  computed: {
    isAdmin(){
      return Boolean(this.$store.state.user.admin == "true")
    },
    adminModernizacion(){
      return this.$store.state.user.admin == "modernizacion" || this.$store.state.user.admin === "master"
    },
    adminCultura(){
      return this.$store.state.user.admin == "cultura" || this.$store.state.user.admin == "master"
    },
  },
  methods: {
    onSubmit(){
      this.$bvToast.toast('Creado correctamente', {
        title: 'Creado',
        variant: 'success',
        appendToast: true,
        solid: true,
      })
      this.onHideModal()
    },
    onShowModal() {
      this.isAdding = true
    },
    onHideModal(){
      this.isAdding = false
    }
  }
}
</script>

