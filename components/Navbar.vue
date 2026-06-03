<template>
  <b-navbar toggleable="lg" type="dark" variant="success" fixed="top" class="app-navbar navbar-dark" container="fluid">
    <div class="navbar-brand-group">
      <a href="https://gesell.gob.ar/" target="_blank" rel="noopener noreferrer">
        <img
          src="https://arvige.gob.ar/assets/img/header.png"
          alt="Municipio de Villa Gesell"
          class="navbar-logo"
        >
      </a>
      <span class="separador" aria-hidden="true">|</span>
    </div>

    <b-navbar-toggle target="nav-collapse" />

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="navbar-main-nav">
        <b-nav-item-dropdown v-if="adminHacienda" text="Obras" variant="success">
          <b-dropdown-item v-if="isAuthenticated">
            <NuxtLink class="dropdown-nav-link" to="/obras">
              Lista de obras
            </NuxtLink>
          </b-dropdown-item>
          <b-dropdown-item v-if="isAuthenticated && adminHacienda">
            <NuxtLink class="dropdown-nav-link" to="/obras/create">
              Nueva obra
            </NuxtLink>
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown v-if="adminHacienda" text="Índices" variant="success">
          <b-dropdown-item v-if="isAuthenticated && adminHacienda">
            <NuxtLink class="dropdown-nav-link" to="/indices/create">
              Crear
            </NuxtLink>
          </b-dropdown-item>
          <b-dropdown-item v-if="isAuthenticated && adminHacienda">
            <NuxtLink class="dropdown-nav-link" to="/indices/search">
              Buscar
            </NuxtLink>
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item v-if="adminComercio">
          <NuxtLink class="nav-link" active-class="active" to="/comercio/solicitudes">
            Habilitaciones
          </NuxtLink>
        </b-nav-item>

        <b-nav-item v-if="adminComercio || adminInspeccion">
          <NuxtLink class="nav-link" active-class="active" to="/comercio/turnos/reservas">
            Turnos
          </NuxtLink>
        </b-nav-item>

        <b-nav-item v-if="adminArvige">
          <NuxtLink class="nav-link" active-class="active" to="/comercio/abierto_anual/registros">
            Abierto anual
          </NuxtLink>
        </b-nav-item>

        <b-nav-item v-if="adminRecaudaciones">
          <NuxtLink class="nav-link" active-class="active" to="/recaudaciones/pagos_dobles/solicitudes">
            Pagos dobles
          </NuxtLink>
        </b-nav-item>

        <b-nav-item v-if="adminCementerio">
          <NuxtLink class="nav-link" active-class="active" to="/cementerio/solicitudes">
            Cementerio
          </NuxtLink>
        </b-nav-item>

        <b-nav-item v-if="adminArvige">
          <NuxtLink class="nav-link" active-class="active" to="/maestro">
            Maestro
          </NuxtLink>
        </b-nav-item>

        <b-nav-item v-if="adminMaster">
          <NuxtLink class="nav-link" active-class="active" to="/actividades">
            Actividades
          </NuxtLink>
        </b-nav-item>

        <b-nav-item v-if="adminMaster">
          <NuxtLink class="nav-link" active-class="active" to="/admin/dashboard">
            Estadísticas
          </NuxtLink>
        </b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ms-auto">
        <b-nav-item-dropdown v-if="isAuthenticated" :text="username" end>
          <b-dropdown-item @click="onMyAccount">
            Mi cuenta
          </b-dropdown-item>
          <b-dropdown-item @click="onUserLogout">
            Cerrar Sesión
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item v-else>
          <NuxtLink class="nav-link" active-class="active" to="/login">
            Uso interno
          </NuxtLink>
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  computed: {
    isAuthenticated() {
      return Boolean(useUserStore().token)
    },
    adminHacienda() {
      const admin = useUserStore().admin
      return admin == 'hacienda' || admin == 'master'
    },
    adminComercio() {
      const admin = useUserStore().admin
      return admin == 'comercio' || admin == 'master'
    },
    adminArvige() {
      const admin = useUserStore().admin
      return admin == 'arvige' || admin == 'master'
    },
    adminInspeccion() {
      return useUserStore().admin == 'inspeccion'
    },
    adminRecaudaciones() {
      const admin = useUserStore().admin
      return admin == 'recaudaciones' || admin == 'master'
    },
    adminCementerio() {
      const admin = useUserStore().admin
      return admin == 'cementerio' || admin == 'master'
    },
    adminMaster() {
      return useUserStore().admin === 'master'
    },
    username() {
      return useUserStore().username
    },
    userId() {
      return useUserStore().id
    },
  },
  methods: {
    async registrarActividad(evento, result) {
      const userId = useUserStore().username
      const actionType = evento
      const actionResult = result

      try {
        await this.$logUserActivity(userId, actionType, actionResult)
      } catch (error) {
        console.error('Error al registrar la actividad:', error)
      }
    },
    onUserLogout() {
      this.registrarActividad('User Logout', 'User Logout')
      useNuxtApp().callHook('manual-logout')
      useUserStore().logout()
    },
    onMyAccount() {
      this.registrarActividad('My Account', 'Enter')
      this.$router.push('/account')
    },
  },
}
</script>

<style scoped>
.app-navbar {
  --bs-navbar-color: rgba(255, 255, 255, 0.9);
  --bs-navbar-hover-color: #fff;
  --bs-navbar-active-color: #fff;
  --bs-navbar-disabled-color: rgba(255, 255, 255, 0.55);
}

.app-navbar :deep(.navbar-nav .nav-link),
.app-navbar :deep(.navbar-nav .dropdown-toggle),
.app-navbar :deep(.navbar-nav a) {
  color: rgba(255, 255, 255, 0.9);
}

.app-navbar :deep(.navbar-nav .nav-link:hover),
.app-navbar :deep(.navbar-nav .nav-link:focus),
.app-navbar :deep(.navbar-nav .dropdown-toggle:hover),
.app-navbar :deep(.navbar-nav .dropdown-toggle:focus),
.app-navbar :deep(.navbar-nav .nav-link.active),
.app-navbar :deep(.navbar-nav .router-link-active),
.app-navbar :deep(.navbar-nav .router-link-exact-active) {
  color: #fff;
}

.app-navbar :deep(.navbar-toggler) {
  border-color: rgba(255, 255, 255, 0.55);
}

.app-navbar :deep(.navbar-toggler-icon) {
  filter: invert(1) grayscale(100%);
}

.app-navbar :deep(.navbar-collapse) {
  flex-grow: 1;
  align-items: center;
}

.app-navbar :deep(.navbar-nav) {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}

.navbar-brand-group {
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

.navbar-logo {
  height: 58px;
  width: 42px;
}

.separador {
  color: white;
  font-size: 35px;
  opacity: 0.3;
  margin-left: 0.5rem;
  line-height: 1;
}

.dropdown-nav-link {
  color: inherit;
  text-decoration: none;
  display: block;
  width: 100%;
}

.dropdown-nav-link:hover {
  color: inherit;
  text-decoration: none;
}

@media (max-width: 1200px) {
  .separador {
    display: none;
  }
}

@media (max-width: 991.98px) {
  .app-navbar :deep(.navbar-nav) {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .app-navbar :deep(.navbar-nav.ms-auto) {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.25);
  }
}

#app-iso {
  max-height: 34px;
}
</style>
