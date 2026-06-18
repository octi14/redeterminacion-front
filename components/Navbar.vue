<template>
  <b-navbar toggleable="lg" type="dark" variant="success" fixed="top">
    <div class="col-xs-1 ml-2 app-brand">
      <a href="https://gesell.gob.ar/" target="_blank">
        <img src="https://arvige.gob.ar/assets/img/header.png" class="app-brand__logo">
      </a>
      <span class="ml-2 separador"> | </span>
    </div>

    <b-navbar-toggle target="nav-collapse" />

    <b-collapse id="nav-collapse" is-nav class="m-2 app-navbar-collapse">
      <b-navbar-nav class="app-nav">
        <b-dropdown v-if="showHaciendaMenu" text="Hacienda" variant="success" class="app-nav__group">
          <b-dropdown-header v-if="adminObras">Obras</b-dropdown-header>
          <b-dropdown-item v-if="adminObras" to="/obras">Lista de obras</b-dropdown-item>
          <b-dropdown-item v-if="puedeGestionarObras" to="/obras/create">Nueva obra</b-dropdown-item>
          <b-dropdown-divider />
          <b-dropdown-header v-if="adminIndices">Indices</b-dropdown-header>
          <b-dropdown-item v-if="adminIndices" to="/indices/search">Buscar indices</b-dropdown-item>
          <b-dropdown-item v-if="puedeGestionarIndices" to="/indices/create">Crear indice</b-dropdown-item>
        </b-dropdown>

        <b-dropdown v-if="showComercioMenu" text="Comercio" variant="success" class="app-nav__group">
          <b-dropdown-item v-if="adminComercio" to="/comercio/solicitudes">
            Habilitaciones
          </b-dropdown-item>
          <b-dropdown-item v-if="adminInspeccion" to="/comercio/turnos/reservas">
            Turnos Inspeccion
          </b-dropdown-item>
          <b-dropdown-item v-if="adminAbiertoAnual" to="/comercio/abierto_anual/registros">
            Abierto anual
          </b-dropdown-item>
          <b-dropdown-item v-if="adminMaestroComercial" to="/maestro">
            Maestro Comercial
          </b-dropdown-item>
        </b-dropdown>

        <b-dropdown v-if="showRecaudacionesMenu" text="Recaudaciones" variant="success" class="app-nav__group">
          <b-dropdown-item v-if="adminPagosDobles" to="/recaudaciones/pagos_dobles/solicitudes">
            Pagos dobles
          </b-dropdown-item>
          <b-dropdown-item v-if="canManageBoletas" to="/admin/boletas">
            Administrar Boletas
          </b-dropdown-item>
        </b-dropdown>

        <b-dropdown v-if="showCementerioMenu" text="Cementerio" variant="success" class="app-nav__group">
          <b-dropdown-item v-if="adminCementerio" to="/cementerio/certificado_defuncion">
            Declaracion jurada
          </b-dropdown-item>
          <b-dropdown-item v-if="adminCementerioReview" to="/cementerio/solicitudes">
            Solicitudes
          </b-dropdown-item>
        </b-dropdown>

        <b-dropdown v-if="showComprasMenu" text="Compras" variant="success" class="app-nav__group">
          <b-dropdown-item to="/compras/combustible">
            Combustible
          </b-dropdown-item>
        </b-dropdown>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto app-user-nav">
        <template v-if="isAuthenticated">
          <b-nav-item-dropdown :text="username" right>
            <b-dropdown-item @click="onMyAccount">
              Mi cuenta
            </b-dropdown-item>
            <b-dropdown-divider v-if="showAdminTools" />
            <b-dropdown-item v-if="canManageUsers" @click="onUserAdmin">
              Administrar usuarios
            </b-dropdown-item>
            <b-dropdown-item v-if="canManageAbiertoAnual" @click="onAbiertoAnualAdmin">
              Administrar abierto anual
            </b-dropdown-item>
            <b-dropdown-item v-if="canManageSystemConfig" @click="onSystemConfigAdmin">
              Configuraciones generales
            </b-dropdown-item>
            <b-dropdown-item v-if="canManageFunerarias" @click="onFunerariasAdmin">
              Administrar funerarias
            </b-dropdown-item>
            <b-dropdown-item v-if="canViewActivities" @click="onActivities">
              Actividades
            </b-dropdown-item>
            <b-dropdown-item v-if="canViewDashboard" @click="onDashboard">
              Estadisticas
            </b-dropdown-item>
            <b-dropdown-divider />
            <b-dropdown-item @click="onUserLogout">
              Cerrar sesion
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
    adminObras() {
      return this.$can('hacienda.obras.read')
    },
    puedeGestionarObras() {
      return this.$can('hacienda.obras.update')
    },
    adminIndices() {
      return this.$can('hacienda.indices.read')
    },
    puedeGestionarIndices() {
      return this.$can('hacienda.indices.update')
    },
    adminComercio() {
      return this.$can('habilitaciones.read')
    },
    adminArvige() {
      return this.adminAbiertoAnual || this.adminMaestroComercial
    },
    adminAbiertoAnual() {
      return this.$can('abiertoAnual.read')
    },
    adminMaestroComercial() {
      return this.$can('maestroComercial.read')
    },
    adminInspeccion() {
      return this.$can('turnos.read')
    },
    adminPagosDobles() {
      return this.$can('pagosDobles.read')
    },
    adminCementerioReview() {
      return this.$can('cementerio.review')
    },
    adminCementerioAdmin() {
      return this.$can('cementerio.admin')
    },
    adminCementerio() {
      return this.$can('cementerio.read') || this.adminCementerioAdmin
    },
    adminComprasCombustible() {
      return this.$can('compras.ordenes.read') || this.$can('compras.vales.read') || this.$can('compras.dashboard')
    },
    adminMaster() {
      return this.$can('*')
    },
    showHaciendaMenu() {
      return this.adminObras || this.adminIndices
    },
    showComercioMenu() {
      return this.adminComercio || this.adminInspeccion || this.adminArvige
    },
    showRecaudacionesMenu() {
      return this.adminPagosDobles || this.canManageBoletas
    },
    showCementerioMenu() {
      return this.adminCementerio || this.adminCementerioReview || this.adminCementerioAdmin
    },
    showComprasMenu() {
      return this.adminComprasCombustible
    },
    canManageUsers() {
      return this.$can('users.read') || this.$can('users.manage') || this.$can('roles.read') || this.$can('roles.manage')
    },
    canManageFunerarias() {
      return this.$can('cementerio.admin')
    },
    canManageAbiertoAnual() {
      return this.$can('*') || this.$can('abiertoAnual.admin')
    },
    canManageSystemConfig() {
      return this.$can('*') || this.$can('system.config.admin')
    },
    canManageBoletas() {
      return this.$can('boletas.manage')
    },
    canViewActivities() {
      return this.$can('activities.read')
    },
    canViewDashboard() {
      return this.$can('dashboard.read')
    },
    showAdminTools() {
      return this.canManageUsers || this.canManageAbiertoAnual || this.canManageSystemConfig || this.canManageFunerarias || this.canViewActivities || this.canViewDashboard
    },
    username() {
      return this.$store.state.user.username
    },
    userId() {
      return this.$store.state.user.id
    },
  },
  methods: {
    async registrarActividad(evento, result) {
      const userId = this.$store.state.user.username
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
      this.$nuxt.$emit('manual-logout')
      this.$store.dispatch('user/logout')
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
.app-brand {
  align-items: center;
  display: flex;
}

.app-brand__logo {
  height: 58px;
  width: 42px;
}

.app-navbar-collapse {
  width: 90%;
}

.app-nav {
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.app-nav__group ::v-deep .btn {
  font-weight: 600;
}

.app-nav__group ::v-deep .dropdown-menu {
  background: #119c2b;
  border-color: #08751d;
}

.app-nav__group ::v-deep .dropdown-header {
  color: #f2fff4;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  padding-bottom: 0.35rem;
  padding-top: 0.75rem;
}

.app-nav__group ::v-deep .dropdown-divider {
  border-top-color: rgba(255, 255, 255, 0.65);
  margin: 0.35rem 0;
}

.app-nav__group ::v-deep .dropdown-item {
  color: #fff;
}

.app-nav__group ::v-deep .dropdown-item:hover,
.app-nav__group ::v-deep .dropdown-item:focus {
  background: #08751d;
  color: #fff;
}

.app-user-nav {
  white-space: nowrap;
}

@media (max-width: 1200px) {
  .separador {
    display: none;
  }
}

@media (max-width: 991px) {
  .app-navbar-collapse {
    width: 100%;
  }

  .app-nav {
    align-items: stretch;
    gap: 0;
    margin-top: 0.75rem;
  }

  .app-nav__group {
    width: 100%;
  }

  .app-nav__group ::v-deep .dropdown-toggle {
    text-align: left;
    width: 100%;
  }

  .app-user-nav {
    margin-top: 0.75rem;
  }
}

.separador {
  color: white;
  font-size: 35px;
  opacity: 0.3;
}

#app-iso {
  max-height: 34px;
}
</style>
