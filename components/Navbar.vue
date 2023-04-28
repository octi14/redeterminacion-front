<template>
  <b-navbar toggleable="sm" type="dark" variant="success" class="row" fixed="top">
    <div class="col-xs-1 ml-3">
      <a href="https://gesell.gob.ar/">
        <img src="https://arvige.gob.ar/assets/img/header.png" style="height: 52px; width: 42px">
      </a>
    </div>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav class="m-2" style="width:90%">
      <b-navbar-nav>
        <NuxtLink
          class="nav-link"
          active-class="active"
          to="/"
        >
            Inicio
        </NuxtLink>
      </b-navbar-nav>
      <b-navbar-nav>
        <NuxtLink
          v-if="isAdmin"
          class="nav-link"
          active-class="active"
          to="/redeterminacion"
        >
            Obras
        </NuxtLink>
      </b-navbar-nav>
      <b-navbar-nav>
        <NuxtLink
          v-if="isAuthenticated"
          class="nav-link"
          active-class="active"
          to="/obra/create"
        >
            Nueva obra
        </NuxtLink>
      </b-navbar-nav>
      <b-navbar-nav>
        <NuxtLink
          v-if="isAuthenticated && isAdmin"
          class="nav-link"
          active-class="active"
          to="/indices/menu"
        >
            Índices
        </NuxtLink>
      </b-navbar-nav>
      <b-navbar-nav>
        <NuxtLink
          v-if="isAuthenticated"
          class="nav-link"
          active-class="active"
          to="/normativas"
        >
            Normativas
        </NuxtLink>
      </b-navbar-nav>
      <b-input type="text"
        class="col-md-3  mx-auto"
        v-if="isAuthenticated"
        v-model="search"
        placeholder="Buscar obra"
        @keypress="onSearchFileByName"/>
      <b-navbar-nav class="ml-auto">
        <template v-if="isAuthenticated">
          <b-nav-item-dropdown :text="username" right>
            <!-- <b-dropdown-item>
              <NuxtLink
                v-if="isAuthenticated"
                to="/obra/create"
              >
                Crear archivo
              </NuxtLink>
            </b-dropdown-item> -->
            <b-dropdown-item @click="onUserLogout">
              Cerrar Sesión
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </template>
        <template v-else>
          <NuxtLink class="nav-link" active-class="active" to="/">
            <!-- Iniciar Sesión -->
          </NuxtLink>
        </template>
      </b-navbar-nav>
      <b-navbar-nav>
        <NuxtLink
          v-if="!isAuthenticated"
          class="nav-link"
          active-class="active"
          to="/redeterminacion"
        >
            Uso interno
        </NuxtLink>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  data: {
    search: '',
    result: [],
  },
  computed: {
    isAuthenticated() {
      return Boolean(this.$store.state.user.token)
    },
    isAdmin(){
      return (this.$store.state.user.admin)
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
    async onSearchFileByName(){
      if (this.search){
        this.result = await this.$store.dispatch('search/search', {
          expediente: this.search,
          objeto: this.search,
          adjudicado: this.search,
        })
      }
    }
  },
}
</script>

<style scoped>
#app-iso {
  max-height: 34px;
}
</style>
