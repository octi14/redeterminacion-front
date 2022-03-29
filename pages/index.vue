<template>
  <div class="page">
    <div class="search shadow">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col col-md-12">
            <div class="card shadow-lg">
              <div class="card-body">
                <template v-if="isAuthenticated">
                  <ObraFeed />
                </template>
                <template v-else>
                  <LoginForm />
                </template>
              </div>
            </div>
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
.search {
  padding: 11em 0;
  /* background-size: cover; */
  object-fit: contain;
  background-color: #c6d7ec;
}
</style>
