<template>
  <div class="page">
    <Banner title="Obras" />
    <template v-if="!isAuthenticated">
      <LoginForm />
    </template>
    <template v-if="adminHacienda">
      <ObraFeed />
    </template>
  </div>
</template>

<script>
export default {
  computed: {
    isAuthenticated() {
      return Boolean(this.$store.state.user.token)
    },
    adminHacienda() {
      return this.$store.state.user.admin == "hacienda"
    },
  }
}
</script>

<style>
.background {
  padding: 0% 0;
  height:100%;
  background-size: cover;
  object-fit: fill;
  background-color: #f5f8f9;
}

.feed{
  background-color: #ffffff78;
}
</style>
