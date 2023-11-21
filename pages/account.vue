<template>
  <div class="page">
    <Banner title="Mi cuenta" />
    <div class="text-center" v-if="!editing">
      <b-button pill class="mt-5 btn-4" size="lg" variant="success" @click="onPassword">
         Cambiar contraseña
      </b-button>
    </div>
    <div class="text-center col-md-8 col-sm-10 card shadow-card mt-5 mx-auto" v-else>
      <b-form class="mt-4" @submit="onResetPassword">
        <h6> Contraseña anterior </h6>
        <b-form-input class="col-6 mb-3 mx-auto"></b-form-input>
        <h6> Nueva contraseña </h6>
        <b-form-input class="col-6 mb-3 mx-auto"></b-form-input>
        <h6> Repetir contraseña </h6>
        <b-form-input class="col-6 mx-auto"></b-form-input>
      </b-form>
      <div class="row mb-3 mx-auto">
        <b-button pill class="mt-5 mr-1" variant="success" type="submit">Cambiar contraseña</b-button>
        <b-button pill class="mt-5" variant="danger" @click="onPassword">Salir</b-button>
      </div>
    </div>
  </div>
</template>

<script>

export default{
  data() {
    return {
      editing: false,
    }
  },
  methods: {
    onPassword(){
      this.editing = !this.editing
    }
  }
}
</script>
