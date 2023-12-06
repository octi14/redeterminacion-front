<template>
  <div class="text-center">
    <b-form @submit.stop.prevent="onSubmitLoginForm">
      <b-form-group
        class="my-3 text-left"
        id="input-group-username"
        label-for="input-email"
      >
        <b-form-input
          size="lg"
          class="col-10 mx-auto"
          id="input-username"
          placeholder="Nombre de usuario"
          v-model="form.username"
          type="username"
          required
          style="text-align: center;"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        class="text-left"
        id="input-group-password"
        label-for="input-password"
      >
        <b-form-input
          size="lg"
          class="col-10 mx-auto"
          id="input-password"
          placeholder="Contraseña"
          v-model="form.password"
          type="password"
          required
          style="text-align: center;"
        ></b-form-input>
      </b-form-group>
      <b-button class="col-10 mb-6" size="lg" :disabled="loggingIn" type="submit" style="background-color: #ef8918"><b>Acceder</b></b-button>
    </b-form>
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
