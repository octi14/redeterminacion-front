<template>
  <div class="text-center">
    <ContainersForm>
      <h5> Iniciá sesión para continuar </h5>
      <b-form @submit.stop.prevent="onSubmitLoginForm">
        <b-form-group
          class="my-3"
          id="input-group-username"
          label="Usuario"
          label-for="input-email"
        >
          <b-form-input
            class="col-md-5 mx-auto"
            id="input-username"
            v-model="form.username"
            type="username"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-password"
          label="Contraseña"
          label-for="input-password"
        >
          <b-form-input
            class="col-md-5 mx-auto"
            id="input-password"
            v-model="form.password"
            type="password"
            required
          ></b-form-input>
        </b-form-group>
        <b-button :disabled="loggingIn" type="submit" variant="primary"> Ingresar </b-button>
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
        username: 'admin',
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

