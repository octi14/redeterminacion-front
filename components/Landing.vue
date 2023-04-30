<template>
  <div>
    <Banner title="Secretaría de Hacienda" subtitle="Municipalidad de Villa Gesell" />
    <div>
      <div class="text-center" border-variant="light">
        <b-button pill variant="success" v-if="isAdmin" class="mt-5 mx-3" @click="redeterminacion">
          <h5 style="color:white"> Redeterminación </h5>
        </b-button>
        <b-button pill variant="success" class="mt-5 mx-3" @click="comercios">
          <h5 style="color:white"> Habilitaciones Comerciales </h5>
        </b-button>
        <b-button pill variant="success" class="mt-5 mx-3" @click="turnos">
          <h5 style="color:white"> Turnos comercio </h5>
        </b-button>
        <br>
        <b-button pill variant="success" class="mt-5 mx-3" @click="ordenanzas">
          <h5 style="color:white"> Ordenanzas vigentes </h5>
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  computed: {
    isAdmin(){
      return (this.$store.state.user.admin)
    },
  },
  methods: {
    async onSubmitLoginForm() {
      await this.$store.dispatch('user/authenticate', this.form)
    },
    async redeterminacion(){
      await this.$router.push('/redeterminacion')
    },
    async comercios(){
      await this.$router.push('/comercios')
    },
    async turnos(){
      await this.$router.push('/turnos')
    },
    async ordenanzas(){
      await this.$router.push('/ordenanzas')
    },
  },
}
</script>

<style>
  .bg{
    background-image: url(https://images.unsplash.com/photo-1588420343624-8b15ebd3573d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1112&q=80);
  }
</style>
