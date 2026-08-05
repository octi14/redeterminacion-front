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
        <b-nav-item-dropdown v-if="showHaciendaMenu" text="Hacienda">
          <b-dropdown-header v-if="canReadObras">Obras</b-dropdown-header>
          <b-dropdown-item v-if="canReadObras" to="/obras">Lista de obras</b-dropdown-item>
          <b-dropdown-item v-if="canUpdateObras" to="/obras/create">Nueva obra</b-dropdown-item>
          <b-dropdown-divider v-if="canReadObras && canReadIndices" />
          <b-dropdown-header v-if="canReadIndices">Indices</b-dropdown-header>
          <b-dropdown-item v-if="canReadIndices" to="/indices/search">Buscar indices</b-dropdown-item>
          <b-dropdown-item v-if="canUpdateIndices" to="/indices/create">Crear indice</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown v-if="showComercioMenu" text="Comercio">
          <b-dropdown-item v-if="canReadHabilitaciones" to="/comercio/solicitudes">
            Habilitaciones
          </b-dropdown-item>
          <b-dropdown-item v-if="canReadTurnos" to="/comercio/turnos/reservas">
            Turnos
          </b-dropdown-item>
          <b-dropdown-item v-if="canReadAbiertoAnual" to="/comercio/abierto_anual/registros">
            Abierto anual
          </b-dropdown-item>
          <b-dropdown-item v-if="canReadMaestroComercial" to="/maestro">
            Maestro Comercial
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown v-if="showRecaudacionesMenu" text="Recaudaciones">
          <b-dropdown-item v-if="canReadPagosDobles" to="/recaudaciones/pagos_dobles/solicitudes">
            Pagos dobles
          </b-dropdown-item>
          <b-dropdown-item v-if="canManageBoletas" to="/admin/boletas">
            Administrar boletas
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown v-if="showCementerioMenu" text="Cementerio">
          <b-dropdown-item v-if="canReadCementerio" to="/cementerio/certificado_defuncion">
            Declaracion jurada
          </b-dropdown-item>
          <b-dropdown-item v-if="canReviewCementerio" to="/cementerio/solicitudes">
            Solicitudes
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown v-if="showComprasMenu" text="Compras">
          <b-dropdown-item v-if="canReadOrdenes" to="/compras">Ordenes de compra</b-dropdown-item>
          <b-dropdown-item v-if="canReadVales" to="/compras/combustible">Combustible</b-dropdown-item>
          <b-dropdown-item v-if="canViewComprasDashboard" to="/admin/dashboard">Dashboard</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>

      <b-navbar-nav class="ms-auto app-user-nav">
        <b-nav-item-dropdown v-if="isAuthenticated" :text="username" end>
          <b-dropdown-item @click="onMyAccount">
            <i class="bi bi-person-circle app-user-menu__icon" aria-hidden="true" />
            Mi cuenta
          </b-dropdown-item>
          <b-dropdown-divider v-if="showAdminTools" />
          <b-dropdown-item v-if="canManageUsers" @click="onUserAdmin">
            <i class="bi bi-shield-lock app-user-menu__icon" aria-hidden="true" />
            Roles y permisos
          </b-dropdown-item>
          <b-dropdown-item v-if="canManageAbiertoAnual" @click="onAbiertoAnualAdmin">
            <i class="bi bi-calendar-range app-user-menu__icon" aria-hidden="true" />
            Administrar abierto anual
          </b-dropdown-item>
          <b-dropdown-item v-if="canManageSystemConfig" @click="onSystemConfigAdmin">
            <i class="bi bi-sliders app-user-menu__icon" aria-hidden="true" />
            Configuraciones generales
          </b-dropdown-item>
          <b-dropdown-item v-if="canManageFunerarias" @click="onFunerariasAdmin">
            <i class="bi bi-building app-user-menu__icon" aria-hidden="true" />
            Administrar funerarias
          </b-dropdown-item>
          <b-dropdown-item v-if="canViewActivities" @click="onActivities">
            <i class="bi bi-clock-history app-user-menu__icon" aria-hidden="true" />
            Actividades
          </b-dropdown-item>
          <b-dropdown-item v-if="canViewDashboard" @click="onDashboard">
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
    canReadObras() {
      return this.$can('hacienda.obras.read')
    },
    canUpdateObras() {
      return this.$can('hacienda.obras.update')
    },
    canReadIndices() {
      return this.$can('hacienda.indices.read')
    },
    canUpdateIndices() {
      return this.$can('hacienda.indices.update')
    },
    canReadHabilitaciones() {
      return this.$can('habilitaciones.read')
    },
    canReadTurnos() {
      return this.$can('turnos.read')
    },
    canReadAbiertoAnual() {
      return this.$can('abiertoAnual.read')
    },
    canReadMaestroComercial() {
      return this.$can('maestroComercial.read')
    },
    canReadPagosDobles() {
      return this.$can('pagosDobles.read')
    },
    canReadCementerio() {
      return this.$can('cementerio.read') || this.$can('cementerio.admin')
    },
    canReviewCementerio() {
      return this.$can('cementerio.review') || this.$can('cementerio.admin')
    },
    canReadOrdenes() {
      return this.$can('compras.ordenes.read')
    },
    canReadVales() {
      return this.$can('compras.vales.read')
    },
    canViewComprasDashboard() {
      return this.$can('compras.dashboard')
    },
    canManageBoletas() {
      return this.$can('boletas.manage')
    },
    canManageUsers() {
      return this.$can('users.read') || this.$can('users.manage') || this.$can('roles.read') || this.$can('roles.manage')
    },
    canManageAbiertoAnual() {
      return this.$can('abiertoAnual.admin')
    },
    canManageSystemConfig() {
      return this.$can('system.config.admin')
    },
    canManageFunerarias() {
      return this.$can('cementerio.admin')
    },
    canViewActivities() {
      return this.$can('activities.read')
    },
    canViewDashboard() {
      return this.$can('dashboard.read')
    },
    showHaciendaMenu() {
      return this.canReadObras || this.canUpdateObras || this.canReadIndices || this.canUpdateIndices
    },
    showComercioMenu() {
      return this.canReadHabilitaciones || this.canReadTurnos || this.canReadAbiertoAnual || this.canReadMaestroComercial
    },
    showRecaudacionesMenu() {
      return this.canReadPagosDobles || this.canManageBoletas
    },
    showCementerioMenu() {
      return this.canReadCementerio || this.canReviewCementerio
    },
    showComprasMenu() {
      return this.canReadOrdenes || this.canReadVales || this.canViewComprasDashboard
    },
    showAdminTools() {
      return this.canManageUsers || this.canManageAbiertoAnual || this.canManageSystemConfig || this.canManageFunerarias || this.canViewActivities || this.canViewDashboard
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
    onUserAdmin() {
      this.registrarActividad('User Admin', 'Enter')
      this.$router.push('/admin/usuarios')
    },
    onAbiertoAnualAdmin() {
      this.registrarActividad('Abierto Anual Admin', 'Enter')
      this.$router.push('/admin/abierto-anual')
    },
    onSystemConfigAdmin() {
      this.registrarActividad('System Config Admin', 'Enter')
      this.$router.push('/admin/configuraciones')
    },
    onFunerariasAdmin() {
      this.registrarActividad('Funerarias Admin', 'Enter')
      this.$router.push('/cementerio/funerarias')
    },
    onActivities() {
      this.registrarActividad('User Activities', 'Enter')
      this.$router.push('/actividades')
    },
    onDashboard() {
      this.registrarActividad('Dashboard', 'Enter')
      this.$router.push('/admin/dashboard')
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
