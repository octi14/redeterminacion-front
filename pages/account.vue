<template>
  <div class="page">
    <Banner title="Cambiar contraseña" />
    <div class="text-center col-md-4 col-sm-8 card shadow-card mt-6 mx-auto">
      <b-form class="mt-4" @submit="onResetPassword">
        <h6> Contraseña anterior </h6>
        <b-form-input class="col-10 mb-3 mx-auto"></b-form-input>
        <h6> Nueva contraseña </h6>
        <b-form-input class="col-10 mb-3 mx-auto"></b-form-input>
        <h6> Repetir contraseña </h6>
        <b-form-input class="col-10 mx-auto"></b-form-input>
      </b-form>
      <div class="row mb-3 mx-auto">
        <b-button pill class="mt-5 mr-1" variant="success" type="submit">Cambiar</b-button>
        <NuxtLink to="/">
          <b-button pill class="mt-5" variant="danger" @click="onPassword">Salir</b-button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>

export default{
  methods: {
    onResetPassword(){
    }
  }
}
</script>
