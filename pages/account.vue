<template>
  <div class="page">
    <Banner title="Mi cuenta" />
    <div class="text-center" v-if="!editing">
      <b-button pill class="mt-5 btn-4" size="lg" variant="success" @click="onPassword">
        <h6 class="m-auto" style="color: white"> Cambiar contraseña </h6>
      </b-button>
    </div>
    <div class="text-center mt-5 mx-auto" v-else>
      <b-form @submit="onResetPassword">
        <h6> Contraseña anterior </h6>
        <b-form-input class="col-6 mx-auto"></b-form-input>
        <h6> Nueva contraseña </h6>
        <b-form-input class="col-6 mx-auto"></b-form-input>
        <h6> Repetir contraseña </h6>
        <b-form-input class="col-6 mx-auto"></b-form-input>
      </b-form>
      <b-button class="mt-5" variant="success" @click="onPassword">
        <h6 class="m-auto" style="color: white"> Salir </h6>
      </b-button>
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
