<template>
  <b-navbar toggleable="sm" type="dark" variant="success" fixed="top">
    <div class="col-xs-1 ml-2">
      <a href="https://gesell.gob.ar/" target="_blank">
        <img src="https://arvige.gob.ar/assets/img/header.png" style="height: 58px; width: 42px">
      </a>
      <a class="ml-2 separador" > | </a>
    </div>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav class="m-2" style="width:90%">
      <div class="row col-10">
        <b-dropdown v-if="adminHacienda" text="Obras" variant="success">
          <b-dropdown-item>
            <NuxtLink
              style="color:white"
              class="nav-link"
              v-if="isAuthenticated"
              to="/obras"
            >
              Lista de obras
            </NuxtLink>
          </b-dropdown-item>
          <b-dropdown-item v-if="isAuthenticated && adminHacienda">
            <NuxtLink
            style="color:white"
            class="nav-link"
            active-class="active"
            to="/obras/create"
          >
              Nueva obra
          </NuxtLink>
          </b-dropdown-item>
        </b-dropdown>
        <b-dropdown v-if="adminHacienda" text="Índices" variant="success">
          <b-dropdown-item v-if="isAuthenticated && adminHacienda">
            <NuxtLink
              style="color:white"
              class="nav-link"
              to="/indices/create"
            >
              Crear
            </NuxtLink>
          </b-dropdown-item>
          <b-dropdown-item>
            <NuxtLink
            style="color:white"
            v-if="isAuthenticated && adminHacienda"
            class="nav-link"
            active-class="active"
            to="/indices/search"
          >
              Buscar
          </NuxtLink>
          </b-dropdown-item>
        </b-dropdown>
        <b-navbar-nav v-if="adminComercio" class="mr-2">
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
            to="/comercio/turnos/reservas"
          >
              Turnos
          </NuxtLink>
        </b-navbar-nav>
        <b-navbar-nav v-if="adminArvige">
          <NuxtLink
            class="nav-link"
            active-class="active"
            to="/comercio/abierto_anual/registros"
          >
              Abierto anual
          </NuxtLink>
        </b-navbar-nav>
        <b-navbar-nav v-if="adminRecaudaciones" class="mr-2">
          <NuxtLink
            class="nav-link"
            active-class="active"
            to="/recaudaciones/pagos_dobles/solicitudes"
          >
              Pagos dobles
          </NuxtLink>
        </b-navbar-nav>
        <b-navbar-nav v-if="adminArvige">
          <NuxtLink
            class="nav-link"
            active-class="active"
            to="/maestro"
          >
              Maestro
          </NuxtLink>
        </b-navbar-nav>
        <b-navbar-nav v-if="adminMaster">
          <NuxtLink
            class="nav-link"
            active-class="active"
            to="/actividades"
          >
              <b-icon-list-task class="mr-1" />
              Actividades
          </NuxtLink>
        </b-navbar-nav>
      </div>
      <b-navbar-nav class="ml-auto">
        <template v-if="isAuthenticated">
          <b-nav-item-dropdown :text="username" right>
            <b-dropdown-item @click="onMyAccount">
              Mi cuenta
            </b-dropdown-item>
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
  computed: {
    isAuthenticated() {
      return Boolean(this.$store.state.user.token)
    },
    adminHacienda(){
      return this.$store.state.user.admin == "hacienda" || this.$store.state.user.admin == "master"
    },
    adminComercio(){
      return this.$store.state.user.admin == "comercio" || this.$store.state.user.admin =="master"
    },
    adminArvige(){
      return this.$store.state.user.admin == "arvige" || this.$store.state.user.admin =="master"
    },
    adminInspeccion(){
      return this.$store.state.user.admin == "inspeccion"
    },
    adminRecaudaciones(){
      return this.$store.state.user.admin == "recaudaciones" || this.$store.state.user.admin =="master"

    },
    username() {
      return this.$store.state.user.username
    },
    userId() {
      return this.$store.state.user.id
    },
    adminMaster(){
      return this.$store.state.user.admin == "master"
    }
  },
  methods: {
    async registrarActividad(evento, result){
      const userId = this.$store.state.user.username; // Reemplaza con el ID del usuario real
      const actionType = evento;
      const actionResult = result;

      try {
          await this.$logUserActivity(userId, actionType, actionResult);
      } catch (error) {
          console.error('Error al registrar la actividad:', error);
      }
    },
    onUserLogout() {
      this.registrarActividad("User Logout", "User Logout");
      // Emitir evento para indicar que es un logout manual
      this.$nuxt.$emit('manual-logout');
      this.$store.dispatch('user/logout')
    },
    onMyAccount(){
      this.registrarActividad("My Account", "Enter");
      this.$router.push('/account')
    }
  },
}
</script>

<style scoped>

@media (max-width: 1200px) {
  .separador{
    display: none;
  }
}
.separador{
  color:white;
  font-size: 35px;
  opacity:0.3;
}
#app-iso {
  max-height: 34px;
}
</style>
