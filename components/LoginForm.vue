<template>
  <div id="login-page">
    <ContainersForm title="Ingresar">
      <b-form class="my-5" @submit.stop.prevent="onSubmitLoginForm">
        <b-form-group
          id="input-group-username"
          label="Usuario"
          label-for="input-email"
        >
          <b-form-input
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
            id="input-password"
            v-model="form.password"
            type="password"
            required
          ></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary"> Ingresar </b-button>
      </b-form>
    </ContainersForm>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: 'admin',
        password: '',
      },
    }
  },
  methods: {
    async onSubmitLoginForm() {
      await this.$store.dispatch('user/authenticate', this.form)
    },
  },
}
</script>

<style type="text/css"></style>
