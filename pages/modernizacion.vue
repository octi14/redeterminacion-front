<template>
  <div class="page main-background">
    <Banner title="Modernización" />
    <!-- Modal agregar archivo -->
    <div class="col text-center" v-if="adminModernizacion">
      <b-button pill class="mt-4 shadow-card mx-auto" variant="secondary" @click="onShowModal"> Agregar archivo </b-button>
      <b-modal v-model="isAdding" hide-header-close title-class="h5 mx-auto text-light" header-bg-variant="secondary" hide-footer centered>
        <template #modal-header>
          <div class="row mx-auto">
            <b-icon-upload class="my-3 mr-2" style="color:white" scale="2.4"/>
            <h4 class="text-light my-2 ml-4">Agregar archivo</h4>
          </div>
        </template>
        <MultimediaForm @submit="onSubmit" @reset="onHideModal"/>
      </b-modal>
    </div>
    <div>
      <p class="h5 text-center my-5" v-if="!adminModernizacion"> Esta página sólo está disponible para uso interno del personal Municipal. </p>
    </div>
    <!-- Menú -->
    <div class="row mx-auto justify-content-center" style="width: 99%" v-if="adminModernizacion">
      <div class="text-center mx-4 my-auto" v-if="adminModernizacion">
        <NuxtLink to="/procedimientos">
          <b-button variant="outline" class="mt-3 btn-5">
            <b-icon-folder class="h1 landing-icon" /> <br />
            <h4 style="color:green"><b> Procedimientos </b></h4>
          </b-button>
        </NuxtLink>
      </div>
      <div class="text-center mx-4 my-auto">
        <NuxtLink to="/tutoriales">
          <b-button variant="outline" class="mt-3 btn-5">
            <b-icon-folder class="h1 landing-icon" /> <br />
            <h4 style="color:green"><b> Tutoriales </b></h4>
          </b-button>
        </NuxtLink>
      </div>
      <div class="text-center mx-4 my-auto">
        <NuxtLink to="/notas">
          <b-button variant="outline" class="mt-5 btn-5">
            <b-icon-folder class="h1 landing-icon" /> <br />
            <h4 style="color:green"><b> Formularios/<br/> Notas tipo </b></h4>
          </b-button>
        </NuxtLink>
      </div>
    </div>
    <div class="row justify-content-center mt-5" style="width: 100%">
      <NuxtLink to="/">
        <b-button variant="primary"> Volver </b-button>
      </NuxtLink>
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
    }
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

