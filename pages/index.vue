<template>
  <div class="page">
    <div class="background shadow-lg">
      <div class="row justify-content-center">
        <div class="col col-sm-7">
          <div class="card shadow-lg">
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
  // async fetch() {
    // await this.$store.dispatch('ingredients/getIngredients')
    // await this.$store.dispatch('tags/getTags')
  // },
  // fetchOnServer: false,
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
  object-fit: contain;
  background-color: #f5f8f9;
}
</style>
