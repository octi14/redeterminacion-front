<template>
  <div class="page">
    <div class="background shadow-sm">
      <div class="row justify-content-center">
        <div class="col col-sm-7">
          <div class="card shadow-lg m-5">
            <template v-if="!isAuthenticated">
              <LoginForm />
            </template>
            <template v-else>
              <ObraFeed />
            </template>
          </div>
        </div>
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
  background-size: cover;
  object-fit: fill;
  background-color: #f5f8f9;
}

</style>
