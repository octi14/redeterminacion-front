<template>
  <b-navbar toggleable="md" type="dark" variant="primary">
    <div class="container">
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <NuxtLink
            v-if="isAuthenticated"
            class="nav-link"
            active-class="active"
            to="/obra/create"
          >
            Crear archivo
          </NuxtLink>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <template v-if="isAuthenticated">
            <b-nav-item-dropdown :text="username" right>
              <b-dropdown-item @click="onUserLogout">
                Cerrar Sesión
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </template>
          <template v-else>
            <NuxtLink class="nav-link" active-class="active" to="/login">
              Iniciar Sesión
            </NuxtLink>
          </template>
        </b-navbar-nav>
      </b-collapse>
    </div>
  </b-navbar>
</template>

<script>
export default {
  computed: {
    isAuthenticated() {
      return Boolean(this.$store.state.user.token)
    },
    username() {
      return this.$store.state.user.username
    },
    userId() {
      return this.$store.state.user.id
    },
  },
  methods: {
    onUserLogout() {
      this.$store.dispatch('user/logout')
    },
  },
}
</script>

<style scoped>
#app-iso {
  max-height: 34px;
}
</style>
