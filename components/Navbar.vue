<template>
  <b-navbar toggleable="sm" type="dark" variant="success" fixed="top">
    <div class="col-xs-1 ml-2">
      <a href="https://gesell.gob.ar/">
        <img src="https://arvige.gob.ar/assets/img/header.png" style="height: 58px; width: 42px">
      </a>
    </div>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav class="m-2" style="width:90%">
      <div class="row col-4">
        <b-navbar-nav>
          <NuxtLink
            class="nav-link"
            active-class="active"
            to="/"
          >
              Inicio
          </NuxtLink>
        </b-navbar-nav>
        <b-dropdown v-if="adminHacienda" text="Obras" variant="success">
          <b-dropdown-item>
            <NuxtLink
              style="color:black"
              class="nav-link"
              v-if="isAuthenticated"
              to="/redeterminacion"
            >
              Lista de obras
            </NuxtLink>
          </b-dropdown-item>
          <b-dropdown-item v-if="isAuthenticated && adminHacienda">
            <NuxtLink
            style="color:black"
            class="nav-link"
            active-class="active"
            to="/obra/create"
          >
              Nueva obra
          </NuxtLink>
          </b-dropdown-item>
        </b-dropdown>
        <b-dropdown v-if="adminHacienda" text="Índices" variant="success">
          <b-dropdown-item v-if="isAuthenticated && adminHacienda">
            <NuxtLink
              style="color:black"
              class="nav-link"
              to="/indices/create"
            >
              Crear
            </NuxtLink>
          </b-dropdown-item>
          <b-dropdown-item>
            <NuxtLink
            style="color:black"
            v-if="isAuthenticated && adminHacienda"
            class="nav-link"
            active-class="active"
            to="/indices/search"
          >
              Buscar
          </NuxtLink>
          </b-dropdown-item>
        </b-dropdown>
        <b-navbar-nav v-if="adminComercio">
          <NuxtLink
            class="nav-link"
            active-class="active"
            to="/comercio/solicitudes"
          >
              Habilitaciones
          </NuxtLink>
        </b-navbar-nav>
        <b-navbar-nav v-if="adminComercio || adminInspeccion">
          <NuxtLink
            class="nav-link"
            active-class="active"
            to="/turnos/reservas"
          >
              Turnos
          </NuxtLink>
        </b-navbar-nav>
        <!-- <b-navbar-nav>
          <NuxtLink
            v-if="isAuthenticated"
            class="nav-link"
            active-class="active"
            to="/normativas"
          >
              Normativas
          </NuxtLink>
        </b-navbar-nav> -->
      </div>
      <div class="col-4 mr-auto">
        <b-input type="text"
          v-if="adminHacienda"
          v-model="search"
          placeholder="Buscar obra"
          @keypress="onSearchFileByName"/>
      </div>
      <b-navbar-nav>
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
          <NuxtLink
            class="nav-link"
            active-class="active"
            to="/login"
          >
              Uso interno
          </NuxtLink>
        </template>
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
      return Boolean(this.$store.state.user.admin == "true")
    },
    adminHacienda(){
      return this.$store.state.user.admin == "hacienda"
    },
    adminComercio(){
      return this.$store.state.user.admin == "comercio"
    },
    adminInspeccion(){
      return this.$store.state.user.admin == "inspeccion"
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
