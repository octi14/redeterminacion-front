<template>
  <div class="page">
    <div class="background shadow-sm mt-2">
      <Banner v-if="!isAuthenticated" title="Redeterminación" />
      <div class="card shadow-lg col-8 mx-auto m-4">
        <template v-if="!isAuthenticated">
          <LoginForm />
        </template>
        <template v-else>
          <ObraFeed />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    isAuthenticated() {
      return Boolean(this.$store.state.user.token)
    },
  }
}
</script>

<style type="text/css">
.background {
  padding: 0% 0;
  height:100%;
  background-size: cover;
  object-fit: fill;
  background-color: #f5f8f9;
}

</style>
