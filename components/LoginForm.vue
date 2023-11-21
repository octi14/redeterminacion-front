<template>
  <div class="text-center">
    <ContainersForm>
      <b-form @submit.stop.prevent="onSubmitLoginForm">
        <b-form-group
          class="my-3"
          id="input-group-username"
          label-for="input-email"
        >
          <b-form-input
            size="lg"
            class="col-11 mx-auto"
            id="input-username"
            placeholder="Nombre de usuario"
            v-model="form.username"
            type="username"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-password"
          label-for="input-password"
        >
          <b-form-input
            size="lg"
            class="col-11 mx-auto"
            id="input-password"
            placeholder="Contraseña"
            v-model="form.password"
            type="password"
            required
          ></b-form-input>
        </b-form-group>
        <b-button class="col-11" size="lg" :disabled="loggingIn" type="submit" style="background-color: #ef8918"><b>Acceder</b></b-button>
        <h6 class="mt-4 mb-4" style="color:#07691c"><b>Cambiar mi contraseña </b></h6>
      </b-form>
    </ContainersForm>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loggingIn: false,
      form: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    async onSubmitLoginForm() {
      this.loggingIn = true
      await this.$store.dispatch('user/authenticate', this.form)
      this.loggingIn = false
    },
  },
}
</script>

