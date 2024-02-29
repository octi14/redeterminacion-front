<template>
  <div class="page">
    <div style="height: 100%">
      <div class="mx-auto m-2" style="height:100%">
        <div class="main-background" style="height:100%">
          <template>
            <Banner title="SECRETARÍA DE HACIENDA" subtitle="MUNICIPALIDAD DE VILLA GESELL" />
            <Landing />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  computed: {
    isAuthenticated() {
      return Boolean(this.$store.state.user.token);
    },
  },
  watch: {
    '$store.state.user.token'(newToken) {
      if (newToken) {
        const validToken = this.checkTokenExpired(newToken);

        if (!validToken) {
          // Realiza el cierre de sesión
          this.logout();
        }
      }
    },
  },
  methods: {
    async checkTokenExpired(token) {
      try {
        return await this.$store.dispatch('user/checkToken', {
          token: token,
        })
      } catch (error) {
        return false;
      }
    },
    logout() {
      // Elimina el token y realiza otras acciones de cierre de sesión si es necesario
      this.$store.commit('user/logout');
      // Redirige al usuario a la página de inicio de sesión u otra página adecuada
      this.$router.push('/login');
    },
  },
};
</script>
