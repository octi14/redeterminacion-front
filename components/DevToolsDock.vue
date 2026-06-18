<template>
  <div v-if="canShow" class="dev-tools-root" :class="{ open: isOpen }">
    <transition name="dev-tools-fade">
      <button
        v-if="isOpen"
        class="dev-tools-backdrop"
        type="button"
        aria-label="Cerrar herramientas de desarrollo"
        @click="close"
      />
    </transition>

    <button
      class="dev-tools-trigger"
      type="button"
      :aria-expanded="String(isOpen)"
      aria-controls="dev-tools-panel"
      :title="isOpen ? 'Cerrar herramientas de desarrollo' : 'Abrir herramientas de desarrollo'"
      @click="toggle"
    >
      <i :class="isOpen ? 'bi bi-x-lg' : 'bi bi-tools'"></i>
      <span>Dev</span>
    </button>

    <transition name="dev-tools-panel">
      <aside
        v-if="isOpen"
        id="dev-tools-panel"
        class="dev-tools-panel"
        :class="{
          expanded: Boolean(activeTool),
          confirming: Boolean(pendingConfirmation)
        }"
        role="dialog"
        aria-modal="true"
        aria-label="Herramientas de desarrollo"
      >
        <header class="dev-tools-header">
          <div>
            <span>Dev tools</span>
            <h2>Panel de pruebas</h2>
          </div>
          <button type="button" class="dev-tools-close" aria-label="Cerrar" @click="close">
            <i class="bi bi-x-lg"></i>
          </button>
        </header>

        <div
          class="dev-tools-layout"
          :class="{
            expanded: Boolean(activeTool),
            confirming: Boolean(pendingConfirmation)
          }"
        >
          <transition name="dev-tools-workspace">
            <section v-if="pendingConfirmation" class="dev-tools-confirm-level">
              <div class="confirm-level-heading">
                <span>Confirmación</span>
                <button
                  type="button"
                  aria-label="Cancelar confirmación"
                  :disabled="pendingConfirmation.loading"
                  @click="clearPendingConfirmation"
                >
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>

              <div class="confirm-level-body">
                <i :class="`bi bi-${pendingConfirmation.icon}`"></i>
                <h3>{{ pendingConfirmation.title }}</h3>
                <p>{{ pendingConfirmation.body }}</p>
                <div v-if="pendingConfirmation.detail" class="confirm-level-detail">
                  {{ pendingConfirmation.detail }}
                </div>
                <div v-if="pendingConfirmation.error" class="confirm-level-error">
                  {{ pendingConfirmation.error }}
                </div>
              </div>

              <div class="confirm-level-actions">
                <b-button
                  variant="outline-light"
                  :disabled="pendingConfirmation.loading"
                  @click="clearPendingConfirmation"
                >
                  Cancelar
                </b-button>
                <b-button
                  :variant="pendingConfirmation.variant"
                  :disabled="pendingConfirmation.loading"
                  @click="confirmPendingAction"
                >
                  <b-spinner v-if="pendingConfirmation.loading" small class="mr-2" />
                  {{ pendingConfirmation.loading ? 'Aplicando...' : pendingConfirmation.confirmText }}
                </b-button>
              </div>
            </section>
          </transition>

          <transition name="dev-tools-workspace">
            <section v-if="activeTool" class="dev-tools-workspace">
              <div class="workspace-heading">
                <span>{{ currentTool.kicker }}</span>
                <h3>{{ currentTool.title }}</h3>
                <p>{{ currentTool.body }}</p>
              </div>

              <div v-if="currentTool.key === 'access'" class="role-tool">
                <b-alert v-if="!canReadRbac" show variant="warning" class="role-tool-alert">
                  Necesitás permisos de usuarios o roles para usar esta consola.
                </b-alert>

                <template v-else>
                  <div class="current-roles-card">
                    <div class="current-roles-heading">
                      <div>
                        <span>Usuario actual</span>
                        <strong>{{ username }}</strong>
                      </div>
                      <b-spinner v-if="rbacLoading" small />
                    </div>

                    <div v-if="currentUserRoles.length" class="current-role-list">
                      <span
                        v-for="role in currentUserRoles"
                        :key="role.key"
                        class="current-role-pill"
                      >
                        <span>{{ role.name || role.key }}</span>
                        <button
                          v-if="canManageUsers"
                          type="button"
                          :disabled="roleMutationLoading"
                          :aria-label="`Quitar rol ${role.name || role.key}`"
                          @click="requestRemoveCurrentRole(role)"
                        >
                          <i class="bi bi-x-lg"></i>
                        </button>
                      </span>
                    </div>
                    <div v-else class="current-role-empty">
                      El usuario actual no tiene roles experimentales asignados.
                    </div>

                  </div>

                  <div class="role-tool-card">
                    <label for="dev-role-select">Rol experimental</label>
                    <div class="role-tool-selector" :class="{ 'has-assign-action': canAssignSelectedRole }">
                      <b-form-select
                        id="dev-role-select"
                        v-model="selectedRoleKey"
                        :options="roleOptions"
                        :disabled="rbacLoading || rbacSaving"
                      />
                      <b-button
                        v-if="canAssignSelectedRole"
                        variant="success"
                        :disabled="roleMutationLoading || rbacLoading"
                        @click="requestAssignCurrentRole"
                      >
                        <b-spinner v-if="roleMutationLoading" small />
                        <span v-else>Agregar al usuario</span>
                      </b-button>
                      <b-button
                        variant="outline-light"
                        :disabled="rbacLoading || rbacSaving"
                        @click="loadRbac"
                      >
                        <b-spinner v-if="rbacLoading" small />
                        <i v-else class="bi bi-arrow-clockwise"></i>
                      </b-button>
                    </div>
                    <small v-if="selectedRole">
                      {{ selectedRole.description || 'Sin descripción.' }}
                    </small>
                  </div>

                  <div v-if="selectedRole" class="permission-tool">
                    <div class="permission-toolbar">
                      <b-form-input
                        v-model.trim="permissionSearch"
                        placeholder="Buscar permiso..."
                        :disabled="rbacSaving"
                      />
                      <b-form-select
                        v-model="permissionPerPage"
                        :options="permissionPerPageOptions"
                        :disabled="rbacSaving"
                      />
                    </div>

                    <div class="permission-list" :aria-busy="String(rbacLoading)">
                      <label
                        v-for="permission in paginatedPermissions"
                        :key="permission"
                        class="permission-row"
                        :class="{ checked: roleForm.permissions.includes(permission) }"
                      >
                        <input
                          type="checkbox"
                          :checked="roleForm.permissions.includes(permission)"
                          :disabled="rbacSaving || !canManageRoles"
                          @change="togglePermission(permission, $event.target.checked)"
                        >
                        <span>{{ permission }}</span>
                      </label>
                      <div v-if="!paginatedPermissions.length" class="permission-empty">
                        No hay permisos que coincidan con la búsqueda.
                      </div>
                    </div>

                    <div class="permission-footer">
                      <span>
                        {{ roleForm.permissions.length }} seleccionados ·
                        mostrando {{ permissionFrom }}-{{ permissionTo }} de {{ filteredPermissions.length }}
                      </span>
                      <b-pagination
                        v-model="permissionPage"
                        :total-rows="filteredPermissions.length"
                        :per-page="permissionPerPage"
                        size="sm"
                        class="mb-0 dev-pagination"
                      />
                    </div>

                    <div class="role-tool-actions">
                      <b-button
                        v-if="canManageRoles"
                        variant="outline-light"
                        :disabled="rbacSaving || !hasRoleChanges"
                        @click="resetSelectedRole"
                      >
                        Deshacer
                      </b-button>
                      <b-button
                        v-if="canManageRoles"
                        variant="success"
                        :disabled="rbacSaving || !canSaveSelectedRole"
                        @click="requestSaveSelectedRole"
                      >
                        <b-spinner v-if="rbacSaving" small class="mr-2" />
                        {{ rbacSaving ? 'Guardando...' : 'Guardar cambios' }}
                      </b-button>
                    </div>
                  </div>

                  <div v-else class="placeholder-card compact">
                    <i class="bi bi-shield-check"></i>
                    <div>
                      <strong>Seleccioná un rol</strong>
                      <span>Los permisos del rol se cargarán automáticamente en la lista.</span>
                    </div>
                  </div>
                </template>
              </div>

              <div v-else class="placeholder-card">
                <i :class="`bi bi-${currentTool.icon}`"></i>
                <div>
                  <strong>Herramienta pendiente</strong>
                  <span>{{ currentTool.placeholder }}</span>
                </div>
              </div>
            </section>
          </transition>

          <div class="dev-tools-sidebar">
            <section class="dev-tools-user">
              <div class="dev-tools-avatar">
                <i class="bi bi-person-gear"></i>
              </div>
              <div>
                <strong>{{ username }}</strong>
                <span>{{ accessLabel }}</span>
              </div>
            </section>

            <nav class="dev-tools-menu" aria-label="Opciones de desarrollador">
              <button
                v-for="item in tools"
                :key="item.key"
                type="button"
                class="dev-tools-item"
                :class="{ active: activeTool === item.key }"
                @click="selectTool(item.key)"
              >
                <i :class="`bi bi-${item.icon}`"></i>
                <span>
                  <strong>{{ item.title }}</strong>
                  <small>{{ item.description }}</small>
                </span>
              </button>
            </nav>
          </div>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script>
const ExperimentalRbacService = require('@/service/experimentalRbac')

const TOOL_DEFINITIONS = [
  {
    key: 'access',
    icon: 'shield-lock',
    title: 'Roles y permisos',
    description: 'Cambiar acceso del usuario actual',
    kicker: 'Identidad',
    body: 'Acá vamos a poder cambiar roles, permisos y perfiles de prueba sin salir de la pantalla actual.',
    placeholder: 'Después conectamos selector de rol, permisos puntuales y refresco de sesión.'
  },
  {
    key: 'tramites',
    icon: 'diagram-3',
    title: 'Trámites',
    description: 'Cambiar estados y visibilidad',
    kicker: 'Flujos',
    body: 'Espacio reservado para mover trámites entre estados, alterar visibilidad y simular recorridos administrativos.',
    placeholder: 'Después relevamos qué estados conviene exponer por módulo.'
  },
  {
    key: 'abierto-anual',
    icon: 'calendar-event',
    title: 'Abierto anual',
    description: 'Fechas y rectificación global',
    kicker: 'Calendario',
    body: 'Desde acá vamos a administrar ventanas de apertura, cierre y rectificación global para pruebas.',
    placeholder: 'Después sumamos controles de fechas y toggles conectados al backend.'
  },
  {
    key: 'boletas',
    icon: 'receipt',
    title: 'Boletas',
    description: 'Atajos de administración',
    kicker: 'Recaudaciones',
    body: 'Área pensada para utilidades rápidas de cargas, períodos publicados y datos demo de boletas.',
    placeholder: 'Después agregamos acciones seguras para seeds, limpieza y estados.'
  },
  {
    key: 'system',
    icon: 'sliders',
    title: 'Sistema',
    description: 'Flags y entorno',
    kicker: 'Configuración',
    body: 'Lugar para flags temporales, modo mantenimiento, datos de entorno y diagnósticos útiles.',
    placeholder: 'Después conectamos las configs reales que convenga operar desde QA.'
  }
]

export default {
  name: 'DevToolsDock',
  data() {
    return {
      isOpen: false,
      activeTool: '',
      tools: TOOL_DEFINITIONS,
      rbacLoading: false,
      rbacSaving: false,
      rbacLoaded: false,
      roleMutationLoading: false,
      users: [],
      roles: [],
      permissionsCatalog: [],
      selectedRoleKey: null,
      pendingConfirmation: null,
      roleForm: {
        key: '',
        name: '',
        description: '',
        permissions: []
      },
      originalRolePermissions: [],
      permissionSearch: '',
      permissionPage: 1,
      permissionPerPage: 12,
      permissionPerPageOptions: [
        { value: 8, text: '8' },
        { value: 12, text: '12' },
        { value: 24, text: '24' },
        { value: 48, text: '48' }
      ]
    }
  },
  computed: {
    canShow() {
      if (!process.client) return false
      const hasDevBypass = localStorage.getItem('devToolsEnabled') === 'true'
      return hasDevBypass || this.canReadRbac
    },
    username() {
      return this.$store.state.user.username || 'Sin usuario'
    },
    permissions() {
      return this.$permissionsForCurrentUser ? this.$permissionsForCurrentUser() : []
    },
    accessLabel() {
      if (this.permissions.includes('*')) return 'Acceso completo'
      if (!this.permissions.length) return 'Sin permisos activos'
      return `${this.permissions.length} permisos activos`
    },
    currentTool() {
      return this.tools.find(item => item.key === this.activeTool) || this.tools[0]
    },
    canManageRbac() {
      return this.canReadRbac
    },
    canReadUsers() {
      return this.$can('*') || this.$can('users.read') || this.$can('users.manage')
    },
    canManageUsers() {
      return this.$can('*') || this.$can('users.manage')
    },
    canReadRoles() {
      return this.$can('*') || this.$can('roles.read') || this.$can('roles.manage')
    },
    canManageRoles() {
      return this.$can('*') || this.$can('roles.manage')
    },
    canReadRbac() {
      return this.canReadUsers || this.canReadRoles
    },
    roleOptions() {
      return [
        { value: null, text: this.rbacLoading ? 'Cargando roles...' : 'Seleccionar rol' },
        ...this.roles
          .filter(role => role.active)
          .map(role => ({
            value: role.key,
            text: `${role.name || role.key} (${role.key})`
          }))
      ]
    },
    selectedRole() {
      return this.roles.find(role => role.key === this.selectedRoleKey) || null
    },
    currentUserRecord() {
      const userId = this.$store.state.user.id
      const username = this.$store.state.user.username
      return this.users.find(user => user.id === userId) ||
        this.users.find(user => user.username === username) ||
        null
    },
    currentUserRoles() {
      return this.currentUserRecord ? (this.currentUserRecord.rolesExp || []) : []
    },
    currentUserRoleKeys() {
      return new Set(this.currentUserRoles.map(role => role.key))
    },
    canAssignSelectedRole() {
      return Boolean(
        this.selectedRole &&
        this.selectedRole.active &&
        this.currentUserRecord &&
        this.canManageUsers &&
        !this.currentUserRoleKeys.has(this.selectedRole.key)
      )
    },
    filteredPermissions() {
      const value = this.permissionSearch.trim().toLowerCase()
      if (!value) return this.permissionsCatalog
      return this.permissionsCatalog.filter(permission => permission.toLowerCase().includes(value))
    },
    paginatedPermissions() {
      const start = (this.permissionPage - 1) * this.permissionPerPage
      return this.filteredPermissions.slice(start, start + this.permissionPerPage)
    },
    permissionFrom() {
      if (!this.filteredPermissions.length) return 0
      return ((this.permissionPage - 1) * this.permissionPerPage) + 1
    },
    permissionTo() {
      return Math.min(this.permissionPage * this.permissionPerPage, this.filteredPermissions.length)
    },
    hasRoleChanges() {
      return this.normalizedPermissions(this.roleForm.permissions).join('|') !==
        this.normalizedPermissions(this.originalRolePermissions).join('|')
    },
    canSaveSelectedRole() {
      return Boolean(this.selectedRole && this.roleForm.key && this.roleForm.name && this.hasRoleChanges)
    }
  },
  watch: {
    '$route.fullPath'() {
      this.close()
    },
    activeTool(value) {
      if (value === 'access' && this.canReadRbac && !this.rbacLoaded) {
        this.loadRbac()
      }
    },
    selectedRoleKey() {
      this.resetSelectedRole()
    },
    permissionSearch() {
      this.permissionPage = 1
    },
    permissionPerPage() {
      this.permissionPage = 1
    },
    filteredPermissions() {
      const pages = Math.max(1, Math.ceil(this.filteredPermissions.length / this.permissionPerPage))
      if (this.permissionPage > pages) {
        this.permissionPage = pages
      }
    },
    isOpen(value) {
      if (!process.client) return
      document.body.classList.toggle('dev-tools-open', value)
    }
  },
  beforeDestroy() {
    if (process.client) {
      document.body.classList.remove('dev-tools-open')
    }
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen
    },
    close() {
      this.isOpen = false
      this.activeTool = ''
      this.pendingConfirmation = null
    },
    selectTool(key) {
      this.activeTool = this.activeTool === key ? '' : key
      this.pendingConfirmation = null
    },
    async loadRbac() {
      this.rbacLoading = true
      try {
        const [users, roles, permissions] = await Promise.all([
          this.canReadUsers ? ExperimentalRbacService.getUsers(this.$axios) : Promise.resolve([]),
          this.canReadRoles ? ExperimentalRbacService.getRoles(this.$axios) : Promise.resolve([]),
          this.canReadRoles ? ExperimentalRbacService.getPermissions(this.$axios) : Promise.resolve([])
        ])
        this.users = users
        this.roles = roles
        this.permissionsCatalog = permissions
        this.rbacLoaded = true
        if (this.selectedRoleKey && !this.selectedRole) {
          this.selectedRoleKey = null
        }
        this.resetSelectedRole()
      } catch (error) {
        this.showDevError(error, 'No se pudieron cargar roles y permisos.')
      } finally {
        this.rbacLoading = false
      }
    },
    requestAssignCurrentRole() {
      if (!this.currentUserRecord || !this.selectedRole) return
      this.pendingConfirmation = {
        action: 'assign-role',
        title: 'Agregar rol al usuario',
        body: 'Se va a asignar este rol al usuario actual y despues se va a recargar la pagina para tomar la nueva sesion.',
        detail: `${this.selectedRole.name || this.selectedRole.key} -> ${this.username}`,
        confirmText: 'Agregar y recargar',
        variant: 'success',
        icon: 'person-plus',
        loading: false,
        error: ''
      }
    },
    async assignCurrentRole() {
      if (!this.currentUserRecord || !this.selectedRoleKey) return
      if (!this.canManageUsers) return
      this.roleMutationLoading = true
      try {
        await ExperimentalRbacService.assignRole(this.$axios, this.currentUserRecord.id, this.selectedRoleKey)
        window.location.reload()
      } catch (error) {
        this.showDevError(error, 'No se pudo agregar el rol al usuario actual.', true)
      } finally {
        this.roleMutationLoading = false
      }
    },
    requestRemoveCurrentRole(role) {
      if (!this.currentUserRecord || !role) return
      this.pendingConfirmation = {
        action: 'remove-role',
        roleKey: role.key,
        title: 'Quitar rol del usuario',
        body: 'Se va a quitar este rol del usuario actual y despues se va a recargar la pagina para tomar la nueva sesion.',
        detail: `${role.name || role.key} -> ${this.username}`,
        confirmText: 'Quitar y recargar',
        variant: 'danger',
        icon: 'person-dash',
        loading: false,
        error: ''
      }
    },
    async removeCurrentRole(roleKey) {
      if (!this.currentUserRecord || !roleKey) return
      if (!this.canManageUsers) return
      const confirmed = true /*
        `¿Quitar el rol "${role.name || role.key}" del usuario actual?`,
        {
          title: 'Quitar rol',
          okTitle: 'Quitar',
          cancelTitle: 'Cancelar',
          okVariant: 'danger',
          centered: true,
        }
      */
      if (!confirmed) return
      this.roleMutationLoading = true
      try {
        await ExperimentalRbacService.removeRole(this.$axios, this.currentUserRecord.id, roleKey)
        window.location.reload()
      } catch (error) {
        this.showDevError(error, 'No se pudo quitar el rol del usuario actual.', true)
      } finally {
        this.roleMutationLoading = false
      }
    },
    async confirmAccessReload(message) {
      /*
        `${message} La página se va a recargar para tomar el nuevo estado de sesión.`,
        {
          title: 'Acceso actualizado',
          okTitle: 'Recargar',
          okVariant: 'success',
          centered: true,
        }
      */
      window.location.reload()
    },
    resetSelectedRole() {
      const role = this.selectedRole
      if (!role) {
        this.roleForm = { key: '', name: '', description: '', permissions: [] }
        this.originalRolePermissions = []
        this.permissionPage = 1
        return
      }
      const permissions = [...(role.permissions || [])]
      this.roleForm = {
        key: role.key,
        name: role.name,
        description: role.description || '',
        permissions
      }
      this.originalRolePermissions = [...permissions]
      this.permissionPage = 1
    },
    togglePermission(permission, checked) {
      const current = new Set(this.roleForm.permissions)
      if (checked) current.add(permission)
      else current.delete(permission)
      this.roleForm.permissions = Array.from(current).sort()
    },
    normalizedPermissions(values) {
      return [...new Set(values || [])].filter(Boolean).sort()
    },
    requestSaveSelectedRole() {
      if (!this.canManageRoles || !this.canSaveSelectedRole) return
      const nextPermissions = this.normalizedPermissions(this.roleForm.permissions)
      const previousPermissions = this.normalizedPermissions(this.originalRolePermissions)
      const added = nextPermissions.filter(permission => !previousPermissions.includes(permission)).length
      const removed = previousPermissions.filter(permission => !nextPermissions.includes(permission)).length
      this.pendingConfirmation = {
        action: 'save-role',
        title: 'Guardar permisos del rol',
        body: 'Se van a guardar los permisos del rol seleccionado y despues se va a recargar la pagina para tomar la nueva sesion.',
        detail: `${this.selectedRole.name || this.selectedRole.key}: +${added} / -${removed} permisos`,
        confirmText: 'Guardar y recargar',
        variant: 'success',
        icon: 'shield-check',
        loading: false,
        error: ''
      }
    },
    async saveSelectedRole() {
      if (!this.canManageRoles || !this.canSaveSelectedRole) return
      this.rbacSaving = true
      try {
        const saved = await ExperimentalRbacService.saveRole(this.$axios, {
          ...this.roleForm,
          permissions: this.normalizedPermissions(this.roleForm.permissions),
          active: this.selectedRole.active
        })
        const index = this.roles.findIndex(role => role.key === saved.key)
        if (index >= 0) this.$set(this.roles, index, saved)
        this.originalRolePermissions = [...saved.permissions]
        /*
          'Los permisos del rol fueron guardados. La página se va a recargar para tomar el nuevo estado de sesión.',
          {
            title: 'Permisos actualizados',
            okTitle: 'Recargar',
            okVariant: 'success',
            centered: true,
          }
        */
        window.location.reload()
      } catch (error) {
        this.showDevError(error, 'No se pudo guardar el rol.', true)
      } finally {
        this.rbacSaving = false
      }
    },
    clearPendingConfirmation() {
      if (this.pendingConfirmation && this.pendingConfirmation.loading) return
      this.pendingConfirmation = null
    },
    async confirmPendingAction() {
      if (!this.pendingConfirmation || this.pendingConfirmation.loading) return
      this.$set(this.pendingConfirmation, 'loading', true)
      this.$set(this.pendingConfirmation, 'error', '')
      const action = this.pendingConfirmation.action
      if (action === 'assign-role') {
        await this.assignCurrentRole()
      } else if (action === 'remove-role') {
        await this.removeCurrentRole(this.pendingConfirmation.roleKey)
      } else if (action === 'save-role') {
        await this.saveSelectedRole()
      }
      if (this.pendingConfirmation) {
        this.$set(this.pendingConfirmation, 'loading', false)
      }
    },
    showDevError(error, fallback, showInline = false) {
      const message = error && error.response && error.response.data
        ? error.response.data.message
        : fallback
      if (showInline && this.pendingConfirmation) {
        this.$set(this.pendingConfirmation, 'error', message)
      }
      this.$bvToast.toast(message, {
        title: 'Dev tools',
        variant: 'danger',
        solid: true,
        appendToast: true,
      })
    }
  }
}
</script>

<style scoped>
.dev-tools-root {
  position: fixed;
  inset: 0;
  z-index: 2500;
  pointer-events: none;
}

.dev-tools-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2490;
  border: 0;
  background: rgba(4, 18, 14, .68);
  backdrop-filter: blur(3px);
  pointer-events: auto;
}

.dev-tools-trigger {
  position: fixed;
  top: 50%;
  right: 0;
  z-index: 2510;
  width: 48px;
  height: 96px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: .3rem;
  border: 0;
  border-radius: 48px 0 0 48px;
  color: #ffffff;
  background: linear-gradient(160deg, #111827, #0c6b4f);
  box-shadow: 0 14px 36px rgba(0, 0, 0, .28);
  font-size: .72rem;
  font-weight: 800;
  letter-spacing: .04em;
  text-transform: uppercase;
  transform: translateY(-50%);
  transition: width .2s ease, height .2s ease, transform .2s ease, background .2s ease;
  pointer-events: auto;
}

.dev-tools-trigger i {
  font-size: 1.1rem;
}

.dev-tools-root.open .dev-tools-trigger {
  width: 58px;
  height: 116px;
  background: linear-gradient(160deg, #0f172a, #047857);
  transform: translateY(-50%);
}

.dev-tools-panel {
  position: fixed;
  top: 50%;
  right: 72px;
  z-index: 2505;
  width: min(340px, calc(100vw - 104px));
  height: min(720px, calc(100vh - 48px));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: 22px;
  color: #e5f6ef;
  background: #0d1f1a;
  box-shadow: 0 28px 90px rgba(0, 0, 0, .42);
  transform: translateY(-50%);
  pointer-events: auto;
  transition: width .22s ease;
}

.dev-tools-panel.expanded {
  width: min(920px, calc(100vw - 104px));
}

.dev-tools-panel.confirming {
  width: min(1180px, calc(100vw - 104px));
}

.dev-tools-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.2rem 1.25rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, .08);
  background: radial-gradient(circle at top left, rgba(22, 163, 74, .28), transparent 42%);
}

.dev-tools-header span,
.workspace-heading span {
  display: block;
  margin-bottom: .2rem;
  color: #65e6b8;
  font-size: .68rem;
  font-weight: 900;
  letter-spacing: .14em;
  text-transform: uppercase;
}

.dev-tools-header h2,
.workspace-heading h3 {
  margin: 0;
  color: #ffffff;
  font-weight: 850;
  letter-spacing: 0;
}

.dev-tools-close {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: 50%;
  color: #d7efe6;
  background: rgba(255, 255, 255, .06);
}

.dev-tools-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 320px;
  min-height: 0;
  overflow: hidden;
}

.dev-tools-layout.expanded {
  grid-template-columns: minmax(360px, 1fr) 320px;
}

.dev-tools-layout.confirming {
  grid-template-columns: minmax(280px, 340px) minmax(420px, 1fr) 320px;
}

.dev-tools-sidebar {
  min-height: 0;
  overflow-y: auto;
  background: rgba(255, 255, 255, .025);
}

.dev-tools-layout.expanded .dev-tools-sidebar {
  border-left: 1px solid rgba(255, 255, 255, .08);
}

.dev-tools-user {
  display: flex;
  align-items: center;
  gap: .8rem;
  margin: 1rem 1.25rem;
  padding: .85rem;
  border: 1px solid rgba(255, 255, 255, .08);
  border-radius: 15px;
  background: rgba(255, 255, 255, .045);
}

.dev-tools-avatar {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  color: #07271c;
  background: #7ee0b8;
  font-size: 1.25rem;
}

.dev-tools-user strong,
.dev-tools-user span {
  display: block;
}

.dev-tools-user strong {
  max-width: 255px;
  overflow: hidden;
  color: #ffffff;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dev-tools-user span {
  color: #a7c9bd;
  font-size: .78rem;
}

.dev-tools-menu {
  display: grid;
  gap: .5rem;
  padding: 0 1.25rem 1rem;
}

.dev-tools-item {
  display: grid;
  grid-template-columns: 38px 1fr;
  gap: .75rem;
  align-items: center;
  width: 100%;
  padding: .75rem;
  border: 1px solid rgba(255, 255, 255, .08);
  border-radius: 14px;
  color: #d7efe6;
  background: rgba(255, 255, 255, .035);
  text-align: left;
  transition: .18s ease;
}

.dev-tools-item:hover,
.dev-tools-item.active {
  border-color: rgba(126, 224, 184, .42);
  background: rgba(20, 184, 124, .15);
}

.dev-tools-item i {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: #7ee0b8;
  background: rgba(126, 224, 184, .12);
}

.dev-tools-item strong,
.dev-tools-item small {
  display: block;
}

.dev-tools-item strong {
  color: #ffffff;
  font-size: .88rem;
}

.dev-tools-item small {
  color: #9bb9af;
  font-size: .72rem;
}

.dev-tools-workspace {
  min-height: 0;
  overflow-y: auto;
  padding: 1.4rem 1.5rem 1.5rem;
  background: rgba(0, 0, 0, .12);
}

.dev-tools-confirm-level {
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  border-right: 1px solid rgba(255, 255, 255, .08);
  background: rgba(5, 34, 26, .72);
}

.confirm-level-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .8rem;
}

.confirm-level-heading span {
  color: #65e6b8;
  font-size: .68rem;
  font-weight: 900;
  letter-spacing: .14em;
  text-transform: uppercase;
}

.confirm-level-heading button {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: 50%;
  color: #d7efe6;
  background: rgba(255, 255, 255, .06);
}

.confirm-level-body {
  display: grid;
  gap: .75rem;
  align-content: start;
  flex: 1;
  min-height: 0;
}

.confirm-level-body > i {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  color: #07271c;
  background: #7ee0b8;
  font-size: 1.35rem;
}

.confirm-level-body h3 {
  margin: .2rem 0 0;
  color: #ffffff;
  font-size: 1.15rem;
  font-weight: 850;
  letter-spacing: 0;
}

.confirm-level-body p {
  margin: 0;
  color: #b8d3ca;
  font-size: .86rem;
  line-height: 1.45;
}

.confirm-level-detail,
.confirm-level-error {
  padding: .85rem;
  border-radius: 13px;
  font-size: .82rem;
  line-height: 1.4;
}

.confirm-level-detail {
  border: 1px solid rgba(126, 224, 184, .22);
  color: #dff8ef;
  background: rgba(126, 224, 184, .08);
  font-weight: 800;
}

.confirm-level-error {
  border: 1px solid rgba(248, 113, 113, .35);
  color: #fecaca;
  background: rgba(127, 29, 29, .35);
}

.confirm-level-actions {
  display: grid;
  gap: .55rem;
}

.workspace-heading p {
  margin: .5rem 0 1rem;
  color: #b8d3ca;
  font-size: .86rem;
  line-height: 1.45;
}

.placeholder-card {
  display: flex;
  gap: .85rem;
  padding: 1rem;
  border: 1px dashed rgba(126, 224, 184, .38);
  border-radius: 16px;
  color: #cce6dd;
  background: rgba(126, 224, 184, .075);
}

.placeholder-card > i {
  color: #7ee0b8;
  font-size: 1.4rem;
}

.placeholder-card strong,
.placeholder-card span {
  display: block;
}

.placeholder-card span {
  margin-top: .25rem;
  color: #a7c9bd;
  font-size: .8rem;
  line-height: 1.35;
}

.role-tool {
  display: grid;
  gap: 1rem;
}

.role-tool-alert {
  margin: 0;
  text-align: left;
}

.current-roles-card {
  display: grid;
  gap: .85rem;
  padding: 1rem;
  border: 1px solid rgba(126, 224, 184, .18);
  border-radius: 16px;
  background: rgba(126, 224, 184, .07);
}

.current-roles-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: .8rem;
}

.current-roles-heading span,
.current-roles-heading strong {
  display: block;
}

.current-roles-heading span {
  color: #65e6b8;
  font-size: .68rem;
  font-weight: 900;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.current-roles-heading strong {
  max-width: 100%;
  overflow: hidden;
  color: #ffffff;
  font-size: .92rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.current-role-list {
  display: flex;
  flex-wrap: wrap;
  gap: .45rem;
}

.current-role-pill {
  display: inline-flex;
  align-items: center;
  gap: .35rem;
  max-width: 100%;
  padding: .38rem .42rem .38rem .62rem;
  border: 1px solid rgba(126, 224, 184, .25);
  border-radius: 999px;
  color: #dff8ef;
  background: rgba(255, 255, 255, .07);
  font-size: .78rem;
  font-weight: 800;
}

.current-role-pill > span {
  overflow: hidden;
  max-width: 180px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.current-role-pill button {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  color: #eafff7;
  background: rgba(255, 255, 255, .09);
  font-size: .64rem;
}

.current-role-pill button:hover {
  background: rgba(220, 53, 69, .85);
}

.current-role-empty {
  padding: .75rem;
  border: 1px dashed rgba(255, 255, 255, .14);
  border-radius: 12px;
  color: #a7c9bd;
  font-size: .8rem;
}

.role-tool-card {
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, .08);
  border-radius: 16px;
  background: rgba(255, 255, 255, .045);
}

.role-tool-card label {
  display: block;
  margin-bottom: .45rem;
  color: #dff8ef;
  font-size: .74rem;
  font-weight: 850;
  text-transform: uppercase;
}

.role-tool-card small {
  display: block;
  margin-top: .65rem;
  color: #a7c9bd;
  line-height: 1.35;
}

.role-tool-selector {
  display: grid;
  grid-template-columns: 1fr 42px;
  gap: .5rem;
}

.role-tool-selector.has-assign-action {
  grid-template-columns: 1fr minmax(142px, auto) 42px;
}

.role-tool ::v-deep .custom-select,
.role-tool ::v-deep .form-control {
  border-color: rgba(126, 224, 184, .26);
  color: #dff8ef;
  background-color: rgba(255, 255, 255, .08);
  font-weight: 700;
}

.role-tool ::v-deep .custom-select option {
  color: #193d33;
  background: #ffffff;
}

.role-tool ::v-deep .form-control::placeholder {
  color: #89aca0;
}

.permission-tool {
  display: grid;
  gap: .8rem;
}

.permission-toolbar {
  display: grid;
  grid-template-columns: 1fr 92px;
  gap: .6rem;
}

.permission-list {
  display: grid;
  gap: .45rem;
  min-height: 367px;
}

.permission-row {
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: .65rem;
  align-items: center;
  margin: 0;
  padding: .68rem .75rem;
  border: 1px solid rgba(255, 255, 255, .08);
  border-radius: 12px;
  color: #cce6dd;
  background: rgba(255, 255, 255, .035);
  cursor: pointer;
  transition: .16s ease;
}

.permission-row:hover,
.permission-row.checked {
  border-color: rgba(126, 224, 184, .36);
  background: rgba(20, 184, 124, .13);
}

.permission-row input {
  width: 16px;
  height: 16px;
  accent-color: #10b981;
}

.permission-row span {
  overflow: hidden;
  font-family: Consolas, Monaco, monospace;
  font-size: .82rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.permission-empty {
  display: grid;
  place-items: center;
  min-height: 160px;
  border: 1px dashed rgba(255, 255, 255, .14);
  border-radius: 14px;
  color: #a7c9bd;
  text-align: center;
}

.permission-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .8rem;
  color: #a7c9bd;
  font-size: .78rem;
}

.permission-footer span {
  min-width: 0;
}

.permission-footer ::v-deep .page-link {
  border-color: rgba(126, 224, 184, .22);
  color: #dff8ef;
  background: rgba(255, 255, 255, .06);
}

.permission-footer ::v-deep .page-item.active .page-link {
  border-color: #10b981;
  color: #062019;
  background: #7ee0b8;
}

.permission-footer ::v-deep .page-item.disabled .page-link {
  color: #617d73;
  background: rgba(255, 255, 255, .03);
}

.role-tool-actions {
  display: flex;
  justify-content: flex-end;
  gap: .6rem;
}

.placeholder-card.compact {
  margin-top: .2rem;
}

.dev-tools-fade-enter-active,
.dev-tools-fade-leave-active,
.dev-tools-panel-enter-active,
.dev-tools-panel-leave-active {
  transition: opacity .2s ease, transform .2s ease;
}

.dev-tools-fade-enter,
.dev-tools-fade-leave-to {
  opacity: 0;
}

.dev-tools-panel-enter,
.dev-tools-panel-leave-to {
  opacity: 0;
  transform: translate(22px, -50%);
}

.dev-tools-workspace-enter-active,
.dev-tools-workspace-leave-active {
  transition: opacity .18s ease, transform .18s ease;
}

.dev-tools-workspace-enter,
.dev-tools-workspace-leave-to {
  opacity: 0;
  transform: translateX(18px);
}

@media (max-width: 520px) {
  .dev-tools-root.open .dev-tools-trigger {
    transform: translateY(-50%);
  }

  .dev-tools-panel {
    right: 58px;
    width: calc(100vw - 70px);
  }

  .dev-tools-layout {
    grid-template-columns: 1fr;
  }

  .dev-tools-layout.expanded {
    grid-template-columns: 1fr;
  }

  .dev-tools-layout.confirming {
    grid-template-columns: 1fr;
  }

  .dev-tools-confirm-level,
  .dev-tools-workspace,
  .dev-tools-sidebar {
    max-height: none;
  }

  .dev-tools-sidebar {
    border-top: 1px solid rgba(255, 255, 255, .08);
    border-left: 0;
  }
}
</style>

<style>
body.dev-tools-open {
  overflow: hidden;
}
</style>
