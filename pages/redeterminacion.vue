<template>
  <div class="page">
    <Banner title="Obras" />
    <div class="shadow-sm">
      <div class="card feed shadow-lg col-9 mx-auto">
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
