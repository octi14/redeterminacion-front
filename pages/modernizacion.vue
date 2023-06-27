<template>
  <div class="page">
    <Banner title="Modernización" />
    <div class="col text-center mt-3" v-if="adminModernizacion">
      <b-button variant="secondary" @click="onShowModal" v-if="!isAdding"> Agregar archivo </b-button>
      <MultimediaForm v-else @submit="onSubmit" @reset="onHideModal"/>
    </div>
    <div class="row justify-content-center" style="height: 50%">
      <div class="text-center mx-5 my-auto" v-if="adminModernizacion">
        <NuxtLink to="/procedimientos">
          <b-icon-folder class="h1 landing-icon" /> <br />
          <h3><b> Procedimientos </b></h3>
        </NuxtLink>
      </div>
      <div class="text-center mx-5 my-auto">
        <NuxtLink to="/tutoriales">
          <b-icon-folder class="h1 landing-icon" /> <br />
          <h3><b> Tutoriales </b></h3>
        </NuxtLink>
      </div>
      <div class="text-center mx-5 my-auto">
        <NuxtLink to="/notas">
          <b-icon-folder class="h1 landing-icon" /> <br />
          <h4><b> Formularios / Notas tipo </b></h4>
        </NuxtLink>
      </div>
    </div>
    <div class="text-center">
      <NuxtLink to="/">
        <b-button variant="success"> Volver </b-button>
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
      return this.$store.state.user.admin == "modernizacion"
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

