<template>
  <div class="page main-background">
    <Banner title="Administracion de roles y permisos" />

    <div v-if="!canAccessAdminUsers" class="col-10 mx-auto mt-4">
      <b-alert show variant="warning">
        No tenes permisos para consultar usuarios ni roles.
      </b-alert>
    </div>

    <div v-else class="admin-users col-11 mx-auto mt-4">
      <div class="admin-users__toolbar">
        <b-form-input
          v-model="search"
          placeholder="Buscar usuario..."
          class="admin-users__search"
        />
        <b-form-select
          v-model="perPage"
          :options="perPageOptions"
          class="admin-users__per-page"
        />
        <b-button variant="success" :disabled="loading" @click="loadAll">
          <b-spinner v-if="loading" small class="mr-1" />
          Actualizar
        </b-button>
      </div>

      <div class="admin-users__layout">
        <section v-if="canReadUsers" class="admin-users__main">
          <b-table
            :items="paginatedUsers"
            :fields="visibleUserFields"
            responsive
            hover
            small
            show-empty
            empty-text="No hay usuarios para mostrar"
          >
            <template #cell(username)="row">
              <strong>{{ row.item.username }}</strong>
            </template>

            <template #cell(admin)="row">
              <b-badge variant="secondary">{{ row.item.admin || 'sin rol legacy' }}</b-badge>
            </template>

            <template #cell(rolesExp)="row">
              <div v-if="row.item.rolesExp.length" class="admin-users__badges">
                <span
                  v-for="role in row.item.rolesExp"
                  :key="role.key"
                  class="admin-users__role-pill"
                  :class="rolePillClass(role)"
                  :title="role.key"
                >
                  <span class="admin-users__role-mark">{{ roleMark(role) }}</span>
                  <span class="admin-users__role-name">{{ role.name || role.key }}</span>
                </span>
              </div>
              <span v-else class="text-muted">Sin roles experimentales</span>
            </template>

            <template #cell(assign)="row">
              <div class="admin-users__assign">
                <b-form-select
                  v-model="selectedRoles[row.item.id]"
                  :options="roleOptions"
                  size="sm"
                  :disabled="!canAssignUserRoles"
                />
                <b-button
                  variant="outline-success"
                  size="sm"
                  :disabled="!canAssignUserRoles || !selectedRoles[row.item.id]"
                  @click="assignRole(row.item)"
                >
                  Asignar
                </b-button>
              </div>
            </template>

            <template #cell(actions)="row">
              <b-dropdown size="sm" variant="outline-secondary" text="Roles">
                <b-dropdown-item
                  v-for="role in row.item.rolesExp"
                  :key="role.key"
                  @click="removeRole(row.item, role)"
                >
                  Quitar {{ role.name || role.key }}
                </b-dropdown-item>
                <b-dropdown-text v-if="!row.item.rolesExp.length">
                  Sin roles para quitar
                </b-dropdown-text>
              </b-dropdown>
            </template>
          </b-table>

          <div class="admin-users__pagination">
            <span class="text-muted">
              Mostrando {{ paginationFrom }} - {{ paginationTo }} de {{ filteredUsers.length }} usuarios
            </span>
            <b-pagination
              v-model="currentPage"
              :total-rows="filteredUsers.length"
              :per-page="perPage"
              size="sm"
              class="mb-0"
            />
          </div>
        </section>
        <section v-else class="admin-users__main">
          <b-alert show variant="info" class="mb-0">
            No tenes permisos para consultar usuarios.
          </b-alert>
        </section>

        <aside v-if="canReadRoles" class="admin-users__side">
          <div class="admin-users__side-header">
            <h5>{{ editingRoleKey ? 'Editar rol experimental' : 'Nuevo rol experimental' }}</h5>
            <b-button
              v-if="editingRoleKey"
              size="sm"
              variant="outline-secondary"
              @click="resetRoleForm"
            >
              Nuevo
            </b-button>
          </div>
          <b-form-group label="Editar rol existente">
            <b-form-select
              v-model="editingRoleKey"
              :options="editRoleOptions"
              @change="onEditRoleSelected"
            />
          </b-form-group>
          <b-form-group label="Clave">
            <b-form-input
              v-model="roleForm.key"
              placeholder="mesa_entrada"
              :disabled="!canManageRoles || Boolean(editingRoleKey)"
            />
          </b-form-group>
          <b-form-group label="Nombre">
            <b-form-input v-model="roleForm.name" placeholder="Mesa de entrada" :disabled="!canManageRoles" />
          </b-form-group>
          <b-form-group label="Descripcion">
            <b-form-textarea v-model="roleForm.description" rows="2" :disabled="!canManageRoles" />
          </b-form-group>
          <b-form-group label="Permisos">
            <div class="admin-users__permissions-toolbar">
              <b-form-input
                v-model="permissionSearch"
                placeholder="Buscar permiso..."
                size="sm"
              />
              <b-form-select
                v-model="permissionPerPage"
                :options="permissionPerPageOptions"
                size="sm"
                class="admin-users__permission-per-page"
              />
            </div>
            <b-form-checkbox-group
              v-model="roleForm.permissions"
              :options="paginatedPermissionOptions"
              :disabled="!canManageRoles"
              stacked
              class="admin-users__permissions"
            />
            <div class="admin-users__permissions-footer">
              <span class="text-muted">
                {{ roleForm.permissions.length }} seleccionados -
                Mostrando {{ permissionPaginationFrom }} - {{ permissionPaginationTo }}
                de {{ filteredPermissionOptions.length }}
              </span>
              <b-pagination
                v-model="permissionCurrentPage"
                :total-rows="filteredPermissionOptions.length"
                :per-page="permissionPerPage"
                size="sm"
                class="mb-0"
              />
            </div>
          </b-form-group>
          <b-button v-if="canManageRoles" block variant="success" :disabled="!canSaveRole" @click="saveRole">
            Guardar rol
          </b-button>
          <b-alert v-else show variant="info" class="mt-3 mb-0">
            Tenes permiso para consultar roles, pero no para modificarlos.
          </b-alert>
        </aside>
        <aside v-else class="admin-users__side">
          <b-alert show variant="info" class="mb-0">
            No tenes permisos para consultar roles.
          </b-alert>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
const ExperimentalRbacService = require('@/service/experimentalRbac')

export default {
  name: 'AdminUsuariosPage',
  middleware: 'authenticated',
  data() {
    return {
      loading: false,
      search: '',
      currentPage: 1,
      perPage: 25,
      permissionSearch: '',
      permissionCurrentPage: 1,
      permissionPerPage: 25,
      users: [],
      roles: [],
      permissions: [],
      selectedRoles: {},
      roleForm: {
        key: '',
        name: '',
        description: '',
        permissions: [],
      },
      editingRoleKey: null,
      perPageOptions: [
        { value: 10, text: '10 por pagina' },
        { value: 25, text: '25 por pagina' },
        { value: 50, text: '50 por pagina' },
        { value: 100, text: '100 por pagina' },
      ],
      permissionPerPageOptions: [
        { value: 10, text: '10' },
        { value: 25, text: '25' },
        { value: 50, text: '50' },
        { value: 100, text: '100' },
      ],
      userFields: [
        { key: 'username', label: 'Usuario', sortable: true },
        { key: 'admin', label: 'Rol actual', sortable: true },
        { key: 'rolesExp', label: 'Roles experimentales', thClass: 'admin-users__roles-col', tdClass: 'admin-users__roles-cell' },
        { key: 'assign', label: 'Asignar rol' },
        { key: 'actions', label: '' },
      ],
    }
  },
  computed: {
    canReadUsers() {
      return this.$can('users.read') || this.$can('users.manage')
    },
    canManageUsers() {
      return this.$can('users.manage')
    },
    canReadRoles() {
      return this.$can('roles.read') || this.$can('roles.manage')
    },
    canManageRoles() {
      return this.$can('roles.manage')
    },
    canAccessAdminUsers() {
      return this.canReadUsers || this.canReadRoles
    },
    canAssignUserRoles() {
      return this.canManageUsers && this.canReadRoles
    },
    visibleUserFields() {
      return this.userFields.filter((field) => {
        if (field.key === 'assign' || field.key === 'actions') {
          return this.canManageUsers
        }
        return this.canReadUsers
      })
    },
    filteredUsers() {
      const value = this.search.trim().toLowerCase()
      if (!value) return this.users
      return this.users.filter((user) =>
        [user.username, user.admin]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(value))
      )
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.perPage
      return this.filteredUsers.slice(start, start + this.perPage)
    },
    paginationFrom() {
      if (!this.filteredUsers.length) return 0
      return ((this.currentPage - 1) * this.perPage) + 1
    },
    paginationTo() {
      return Math.min(this.currentPage * this.perPage, this.filteredUsers.length)
    },
    roleOptions() {
      return [
        { value: null, text: 'Seleccionar rol' },
        ...this.roles
          .filter((role) => role.active)
          .map((role) => ({ value: role.key, text: role.name || role.key })),
      ]
    },
    permissionOptions() {
      return this.permissions.map((permission) => ({
        value: permission,
        text: permission,
      }))
    },
    filteredPermissionOptions() {
      const value = this.permissionSearch.trim().toLowerCase()
      if (!value) return this.permissionOptions
      return this.permissionOptions.filter((permission) =>
        permission.text.toLowerCase().includes(value)
      )
    },
    paginatedPermissionOptions() {
      const start = (this.permissionCurrentPage - 1) * this.permissionPerPage
      return this.filteredPermissionOptions.slice(start, start + this.permissionPerPage)
    },
    permissionPaginationFrom() {
      if (!this.filteredPermissionOptions.length) return 0
      return ((this.permissionCurrentPage - 1) * this.permissionPerPage) + 1
    },
    permissionPaginationTo() {
      return Math.min(
        this.permissionCurrentPage * this.permissionPerPage,
        this.filteredPermissionOptions.length
      )
    },
    editRoleOptions() {
      return [
        { value: null, text: 'Crear nuevo rol' },
        ...this.roles.map((role) => ({
          value: role.key,
          text: `${role.name || role.key} (${role.key})`,
        })),
      ]
    },
    canSaveRole() {
      return Boolean(this.roleForm.key && this.roleForm.name && this.roleForm.permissions.length)
    },
  },
  watch: {
    search() {
      this.currentPage = 1
    },
    perPage() {
      this.currentPage = 1
    },
    permissionSearch() {
      this.permissionCurrentPage = 1
    },
    permissionPerPage() {
      this.permissionCurrentPage = 1
    },
    filteredUsers() {
      const totalPages = Math.max(1, Math.ceil(this.filteredUsers.length / this.perPage))
      if (this.currentPage > totalPages) {
        this.currentPage = totalPages
      }
    },
    filteredPermissionOptions() {
      const totalPages = Math.max(1, Math.ceil(this.filteredPermissionOptions.length / this.permissionPerPage))
      if (this.permissionCurrentPage > totalPages) {
        this.permissionCurrentPage = totalPages
      }
    },
  },
  async mounted() {
    if (this.canAccessAdminUsers) {
      await this.loadAll()
    }
  },
  methods: {
    async loadAll() {
      this.loading = true
      try {
        const [users, roles, permissions] = await Promise.all([
          this.canReadUsers ? ExperimentalRbacService.getUsers(this.$axios) : Promise.resolve([]),
          this.canReadRoles ? ExperimentalRbacService.getRoles(this.$axios) : Promise.resolve([]),
          this.canReadRoles ? ExperimentalRbacService.getPermissions(this.$axios) : Promise.resolve([]),
        ])
        this.users = users
        this.roles = roles
        this.permissions = permissions
      } catch (error) {
        this.showError(error, 'No se pudo cargar la administracion de usuarios.')
      } finally {
        this.loading = false
      }
    },
    async saveRole() {
      if (!this.canManageRoles) return
      try {
        await ExperimentalRbacService.saveRole(this.$axios, this.roleForm)
        this.resetRoleForm()
        await this.loadAll()
        this.$bvToast.toast('Rol guardado.', {
          variant: 'success',
          solid: true,
          appendToast: true,
        })
      } catch (error) {
        this.showError(error, 'No se pudo guardar el rol.')
      }
    },
    onEditRoleSelected(roleKey) {
      if (!roleKey) {
        this.resetRoleForm()
        return
      }
      const role = this.roles.find((item) => item.key === roleKey)
      if (!role) return
      this.roleForm = {
        key: role.key,
        name: role.name,
        description: role.description || '',
        permissions: [...(role.permissions || [])],
      }
    },
    resetRoleForm() {
      this.editingRoleKey = null
      this.roleForm = { key: '', name: '', description: '', permissions: [] }
      this.permissionSearch = ''
      this.permissionCurrentPage = 1
    },
    async assignRole(user) {
      if (!this.canAssignUserRoles) return
      const roleKey = this.selectedRoles[user.id]
      try {
        await ExperimentalRbacService.assignRole(this.$axios, user.id, roleKey)
        this.$set(this.selectedRoles, user.id, null)
        await this.loadAll()
        this.$bvToast.toast('Rol asignado.', {
          variant: 'success',
          solid: true,
          appendToast: true,
        })
      } catch (error) {
        this.showError(error, 'No se pudo asignar el rol.')
      }
    },
    async removeRole(user, role) {
      if (!this.canManageUsers) return
      try {
        await ExperimentalRbacService.removeRole(this.$axios, user.id, role.key)
        await this.loadAll()
        this.$bvToast.toast('Rol quitado.', {
          variant: 'info',
          solid: true,
          appendToast: true,
        })
      } catch (error) {
        this.showError(error, 'No se pudo quitar el rol.')
      }
    },
    rolePillClass(role) {
      const key = role.key || ''
      if (key.includes('admin') || key === 'master') return 'admin-users__role-pill--admin'
      if (key.includes('jefe')) return 'admin-users__role-pill--lead'
      if (key.includes('cementerio')) return 'admin-users__role-pill--cemetery'
      if (key.includes('compras')) return 'admin-users__role-pill--shopping'
      if (key.includes('hacienda')) return 'admin-users__role-pill--treasury'
      if (key.includes('pagos')) return 'admin-users__role-pill--payments'
      if (key.includes('turnos') || key.includes('inspeccion')) return 'admin-users__role-pill--appointments'
      if (key.includes('modernizacion')) return 'admin-users__role-pill--modernization'
      if (key.includes('maestro')) return 'admin-users__role-pill--registry'
      return 'admin-users__role-pill--default'
    },
    roleMark(role) {
      const key = role.key || ''
      if (key.includes('admin') || key === 'master') return 'A'
      if (key.includes('jefe')) return 'J'
      if (key.includes('cementerio')) return 'C'
      if (key.includes('compras')) return 'Co'
      if (key.includes('hacienda')) return 'H'
      if (key.includes('pagos')) return 'P'
      if (key.includes('turnos')) return 'T'
      if (key.includes('inspeccion')) return 'I'
      if (key.includes('modernizacion')) return 'M'
      if (key.includes('maestro')) return 'MC'
      return 'R'
    },
    showError(error, fallback) {
      const message = error && error.response && error.response.data
        ? error.response.data.message
        : fallback
      this.$bvToast.toast(message, {
        title: 'Error',
        variant: 'danger',
        solid: true,
        appendToast: true,
      })
    },
  },
}
</script>

<style scoped>
.admin-users__toolbar {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1rem;
}

.admin-users__search {
  max-width: 360px;
}

.admin-users__per-page {
  max-width: 150px;
}

.admin-users__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 1rem;
  align-items: start;
}

.admin-users__main,
.admin-users__side {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
}

.admin-users__pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 0.75rem;
}

.admin-users__side-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.admin-users__side-header h5 {
  margin-bottom: 0;
}

.admin-users__assign {
  display: grid;
  grid-template-columns: minmax(150px, 1fr) auto;
  gap: 0.5rem;
}

.admin-users__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  max-width: 420px;
  min-width: 220px;
  white-space: normal;
}

::v-deep .admin-users__roles-col,
::v-deep .admin-users__roles-cell {
  max-width: 440px;
  min-width: 240px;
  white-space: normal;
}

.admin-users__role-pill {
  --role-bg: #edf2f7;
  --role-border: #cbd5e1;
  --role-color: #253041;
  --role-mark-bg: rgba(255, 255, 255, 0.75);
  align-items: center;
  background: var(--role-bg);
  border: 1px solid var(--role-border);
  border-radius: 999px;
  color: var(--role-color);
  display: inline-flex;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.15;
  max-width: 190px;
  min-height: 24px;
  overflow: hidden;
  padding: 0.14rem 0.5rem 0.14rem 0.18rem;
  vertical-align: top;
}

.admin-users__role-mark {
  align-items: center;
  background: var(--role-mark-bg);
  border-radius: 999px;
  display: inline-flex;
  flex: 0 0 auto;
  font-size: 0.62rem;
  font-weight: 800;
  height: 18px;
  justify-content: center;
  margin-right: 0.32rem;
  min-width: 18px;
  padding: 0 0.22rem;
}

.admin-users__role-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.admin-users__role-pill--admin {
  --role-bg: #fee2e2;
  --role-border: #fca5a5;
  --role-color: #7f1d1d;
}

.admin-users__role-pill--lead {
  --role-bg: #fef3c7;
  --role-border: #f59e0b;
  --role-color: #78350f;
}

.admin-users__role-pill--cemetery {
  --role-bg: #dcfce7;
  --role-border: #86efac;
  --role-color: #14532d;
}

.admin-users__role-pill--shopping {
  --role-bg: #e0f2fe;
  --role-border: #7dd3fc;
  --role-color: #075985;
}

.admin-users__role-pill--treasury {
  --role-bg: #ede9fe;
  --role-border: #c4b5fd;
  --role-color: #4c1d95;
}

.admin-users__role-pill--payments {
  --role-bg: #fce7f3;
  --role-border: #f9a8d4;
  --role-color: #831843;
}

.admin-users__role-pill--appointments {
  --role-bg: #ccfbf1;
  --role-border: #5eead4;
  --role-color: #134e4a;
}

.admin-users__role-pill--modernization {
  --role-bg: #e0e7ff;
  --role-border: #a5b4fc;
  --role-color: #312e81;
}

.admin-users__role-pill--registry {
  --role-bg: #ffedd5;
  --role-border: #fdba74;
  --role-color: #7c2d12;
}

.admin-users__role-pill--default {
  --role-bg: #f1f5f9;
  --role-border: #cbd5e1;
  --role-color: #334155;
}

.admin-users__permissions {
  max-height: 260px;
  overflow: auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.75rem;
}

.admin-users__permissions-toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 82px;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.admin-users__permission-per-page {
  min-width: 82px;
}

.admin-users__permissions-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  font-size: 0.82rem;
}

@media (max-width: 992px) {
  .admin-users__layout {
    grid-template-columns: 1fr;
  }

  .admin-users__toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .admin-users__search {
    max-width: none;
  }

  .admin-users__per-page {
    max-width: none;
  }

  .admin-users__pagination {
    align-items: flex-start;
    flex-direction: column;
  }

  .admin-users__permissions-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
