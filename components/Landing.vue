<template>
  <div class="landing">
    <b-card class="text-center m-4">
      <h4 class="text-center m-1"> Hacienda Villa Gesell </h4>
      <b-button variant="success" class="m-5" @click="redeterminacion"> Redeterminación </b-button>
      <b-button variant="success" class="m-5" @click="balnearios"> Balnearios Villa Gesell </b-button>
    </b-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    async onSubmitLoginForm() {
      await this.$store.dispatch('user/authenticate', this.form)
    },
  },
}
</script>
