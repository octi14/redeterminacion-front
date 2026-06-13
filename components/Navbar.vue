<template>
  <b-navbar
    toggleable="lg"
    type="dark"
    variant="success"
    fixed="top"
    class="app-navbar navbar-dark"
    container="fluid"
  >
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
        <b-nav-item-dropdown v-if="adminHacienda" text="Hacienda">
          <b-dropdown-header>Obras</b-dropdown-header>
          <b-dropdown-item to="/obras">Lista de obras</b-dropdown-item>
          <b-dropdown-item to="/obras/create">Nueva obra</b-dropdown-item>
          <b-dropdown-divider />
          <b-dropdown-header>Indices</b-dropdown-header>
          <b-dropdown-item to="/indices/search">Buscar indices</b-dropdown-item>
          <b-dropdown-item to="/indices/create">Crear indice</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown v-if="showComercioMenu" text="Comercio">
          <b-dropdown-item v-if="adminComercio" to="/comercio/solicitudes">
            Habilitaciones
          </b-dropdown-item>
          <b-dropdown-item v-if="adminComercio || adminInspeccion" to="/comercio/turnos/reservas">
            Turnos
          </b-dropdown-item>
          <b-dropdown-item v-if="adminArvige" to="/comercio/abierto_anual/registros">
            Abierto anual
          </b-dropdown-item>
          <b-dropdown-item v-if="adminArvige" to="/maestro">
            Maestro Comercial
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown v-if="showRecaudacionesMenu" text="Recaudaciones">
          <b-dropdown-item v-if="adminRecaudaciones" to="/recaudaciones/pagos_dobles/solicitudes">
            Pagos dobles
          </b-dropdown-item>
          <b-dropdown-item v-if="adminMaster" to="/admin/boletas">
            Administrar boletas
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown v-if="adminCementerio" text="Cementerio">
          <b-dropdown-item to="/cementerio/solicitudes">
            Solicitudes
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>

      <b-navbar-nav class="ms-auto app-user-nav">
        <b-nav-item-dropdown v-if="isAuthenticated" :text="username" end>
          <b-dropdown-item @click="onMyAccount">
            <i class="bi bi-person-circle app-user-menu__icon" aria-hidden="true" />
            Mi cuenta
          </b-dropdown-item>
          <b-dropdown-divider v-if="adminMaster" />
          <b-dropdown-item v-if="adminMaster" to="/actividades">
            <i class="bi bi-clock-history app-user-menu__icon" aria-hidden="true" />
            Actividades
          </b-dropdown-item>
          <b-dropdown-item v-if="adminMaster" to="/admin/dashboard">
            <i class="bi bi-bar-chart-line app-user-menu__icon" aria-hidden="true" />
            Estadisticas
          </b-dropdown-item>
          <b-dropdown-divider />
          <b-dropdown-item @click="onUserLogout">
            <i class="bi bi-box-arrow-right app-user-menu__icon" aria-hidden="true" />
            Cerrar sesion
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item v-else to="/login">
          Uso interno
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  computed: {
    userStore() {
      return useUserStore()
    },
    isAuthenticated() {
      return Boolean(this.userStore.token)
    },
    adminHacienda() {
      return ['hacienda', 'master'].includes(this.userStore.admin)
    },
    adminComercio() {
      return ['comercio', 'master'].includes(this.userStore.admin)
    },
    adminArvige() {
      return ['arvige', 'master'].includes(this.userStore.admin)
    },
    adminInspeccion() {
      return ['inspeccion', 'master'].includes(this.userStore.admin)
    },
    adminRecaudaciones() {
      return ['recaudaciones', 'master'].includes(this.userStore.admin)
    },
    adminCementerio() {
      return ['cementerio', 'master'].includes(this.userStore.admin)
    },
    adminMaster() {
      return this.userStore.admin === 'master'
    },
    showComercioMenu() {
      return this.adminComercio || this.adminInspeccion || this.adminArvige
    },
    showRecaudacionesMenu() {
      return this.adminRecaudaciones || this.adminMaster
    },
    username() {
      return this.userStore.username
    },
  },
  methods: {
    async registrarActividad(evento, result) {
      try {
        await this.$logUserActivity(this.userStore.username, evento, result)
      } catch (error) {
        console.error('Error al registrar la actividad:', error)
      }
    },
    onUserLogout() {
      this.registrarActividad('User Logout', 'User Logout')
      useNuxtApp().callHook('manual-logout')
      this.userStore.logout()
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
.app-navbar :deep(.navbar-nav .nav-link.active) {
  color: #fff;
}

.app-navbar :deep(.dropdown-menu) {
  border-color: #08751d;
  background: #119c2b;
}

.app-navbar :deep(.dropdown-header),
.app-navbar :deep(.dropdown-item) {
  color: #fff;
}

.app-navbar :deep(.dropdown-header) {
  font-size: 0.78rem;
  font-weight: 700;
}

.app-navbar :deep(.dropdown-item:hover),
.app-navbar :deep(.dropdown-item:focus) {
  background: #08751d;
}

.navbar-brand-group {
  display: flex;
  align-items: center;
  margin: 0 0.5rem;
}

.navbar-logo {
  width: 42px;
  height: 58px;
}

.separador {
  margin-left: 0.5rem;
  color: white;
  font-size: 35px;
  line-height: 1;
  opacity: 0.3;
}

.app-user-nav {
  white-space: nowrap;
}

.app-user-menu__icon {
  display: inline-block;
  width: 1rem;
  margin-right: 0.45rem;
}

@media (max-width: 1200px) {
  .separador {
    display: none;
  }
}

@media (max-width: 991.98px) {
  .app-navbar :deep(.navbar-nav) {
    align-items: flex-start;
    width: 100%;
  }

  .app-user-nav {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.25);
  }
}
</style>
