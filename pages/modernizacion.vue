<template>
  <div class="page main-background">
    <Banner title="Modernización" />
    <div class="col text-center" v-if="adminModernizacion">
      <b-button  class="mt-4" variant="secondary" @click="onShowModal"> Agregar archivo </b-button>
      <b-modal v-model="isAdding" hide-header hide-footer centered>
        <MultimediaForm @submit="onSubmit" @reset="onHideModal"/>
      </b-modal>
    </div>
    <div class="row justify-content-center" style="height: 40%">
      <div class="text-center mx-5 my-auto" v-if="adminModernizacion">
        <NuxtLink to="/procedimientos">
          <b-button variant="outline" class="mt-5">
            <b-icon-folder class="h1 landing-icon" /> <br />
            <h4 style="color:green"><b> Procedimientos </b></h4>
          </b-button>
        </NuxtLink>
      </div>
      <div class="text-center mx-5 my-auto">
        <NuxtLink to="/tutoriales">
          <b-button variant="outline" class="mt-5">
            <b-icon-folder class="h1 landing-icon" /> <br />
            <h4 style="color:green"><b> Tutoriales </b></h4>
          </b-button>
        </NuxtLink>
      </div>
      <div class="text-center mx-4 my-auto">
        <NuxtLink to="/notas">
          <b-button variant="outline" class="mt-5">
            <b-icon-folder class="h1 landing-icon" /> <br />
            <h4 style="color:green"><b> Formularios / Notas tipo </b></h4>
          </b-button>
        </NuxtLink>
      </div>
    </div>
    <div class="text-center">
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

