<template>
  <div id="app-layout">
    <Navbar />

    <div id="app-content" class="my-5">
      <Nuxt keep-alive />
    </div>

    <Foot />
  </div>
</template>

<script>
export default {
  name: 'Default',
  mounted() {
    // si existe usuario en localStorage, lo levanto
    if (localStorage.getItem('userId')) {
      const authUser = {
        id: localStorage.getItem('userId'),
        username: localStorage.getItem('username'),
        token: localStorage.getItem('userToken'),
        admin: localStorage.getItem('userAdmin')
      }
      this.$store.commit('user/setAuthenticated', authUser)
      // this.$store.dispatch('user/getProfile', {
      //   userId: authUser.id,
      // })
    }
  },
}
</script>
