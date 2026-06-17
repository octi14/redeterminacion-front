<template>
  <div class="page main-background">
    <Banner title="Administracion de usuarios" />

    <div v-if="!canManageUsers" class="col-10 mx-auto mt-4">
      <b-alert show variant="warning">
        No tenes permisos para administrar usuarios.
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
        <section class="admin-users__main">
          <b-table
            :items="paginatedUsers"
            :fields="userFields"
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
                <b-badge
                  v-for="role in row.item.rolesExp"
                  :key="role.key"
                  variant="info"
                  class="mr-1 mb-1"
                >
                  {{ role.name || role.key }}
                </b-badge>
              </div>
              <span v-else class="text-muted">Sin roles experimentales</span>
            </template>

            <template #cell(assign)="row">
              <div class="admin-users__assign">
                <b-form-select
                  v-model="selectedRoles[row.item.id]"
                  :options="roleOptions"
                  size="sm"
                />
                <b-button
                  variant="outline-success"
                  size="sm"
                  :disabled="!selectedRoles[row.item.id]"
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

        <aside class="admin-users__side">
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
              :disabled="Boolean(editingRoleKey)"
            />
          </b-form-group>
          <b-form-group label="Nombre">
            <b-form-input v-model="roleForm.name" placeholder="Mesa de entrada" />
          </b-form-group>
          <b-form-group label="Descripcion">
            <b-form-textarea v-model="roleForm.description" rows="2" />
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
          <b-button block variant="success" :disabled="!canSaveRole" @click="saveRole">
            Guardar rol
          </b-button>
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
        { key: 'rolesExp', label: 'Roles experimentales' },
        { key: 'assign', label: 'Asignar rol' },
        { key: 'actions', label: '' },
      ],
    }
  },
  computed: {
    canManageUsers() {
      return this.$can('users.manage')
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
    if (this.canManageUsers) {
      await this.loadAll()
    }
  },
  methods: {
    async loadAll() {
      this.loading = true
      try {
        const [users, roles, permissions] = await Promise.all([
          ExperimentalRbacService.getUsers(this.$axios),
          ExperimentalRbacService.getRoles(this.$axios),
          ExperimentalRbacService.getPermissions(this.$axios),
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
