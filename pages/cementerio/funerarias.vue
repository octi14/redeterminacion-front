<template>
  <div class="page main-background">
    <Banner title="Administrar funerarias" subtitle="Cementerio" />

    <b-container fluid class="py-4 funerarias-admin">
      <b-alert v-if="loadError" show variant="danger" class="col-11 mx-auto">
        {{ loadError }}
      </b-alert>

      <div class="funerarias-admin__toolbar col-11 mx-auto">
        <b-form-input
          v-model.trim="search"
          class="funerarias-admin__search"
          placeholder="Buscar funeraria, CUIT o responsable"
        />
        <b-button variant="success" @click="startCreate">
          Nueva funeraria
        </b-button>
      </div>

      <div class="funerarias-admin__layout col-11 mx-auto">
        <section class="funerarias-admin__main">
            <b-table
              responsive
              hover
              :items="filteredFunerarias"
              :fields="fields"
              :busy="loading"
              show-empty
              empty-text="No hay funerarias para mostrar."
            >
              <template #cell(nombre)="row">
                <strong>{{ row.item.nombre }}</strong>
                <small class="d-block text-muted">{{ row.item.mail || 'Sin mail' }}</small>
              </template>
              <template #cell(activa)="row">
                <b-badge :variant="row.item.activa ? 'success' : 'secondary'">
                  {{ row.item.activa ? 'Activa' : 'Inactiva' }}
                </b-badge>
              </template>
              <template #cell(usuarios)="row">
                <span>{{ usuariosPorFuneraria(row.item.id).length }}</span>
              </template>
              <template #cell(acciones)="row">
                <b-button size="sm" variant="outline-primary" @click="startEdit(row.item)">
                  Editar
                </b-button>
              </template>
            </b-table>
        </section>

        <aside class="funerarias-admin__side">
            <div class="funerarias-admin__side-header">
              <div>
                <small>{{ editingId ? 'Edicion' : 'Alta' }}</small>
                <h5>{{ editingId ? 'Editar funeraria' : 'Nueva funeraria' }}</h5>
              </div>
              <b-button v-if="editingId" size="sm" variant="outline-secondary" @click="startCreate">
                Limpiar
              </b-button>
            </div>

            <b-form @submit.prevent="saveFuneraria">
              <b-form-group label="Nombre">
                <b-form-input v-model.trim="form.nombre" required :disabled="saving" />
              </b-form-group>
              <b-form-group label="CUIT">
                <b-form-input v-model.trim="form.cuit" required :disabled="saving" />
              </b-form-group>
              <b-form-group label="Responsable">
                <b-form-input v-model.trim="form.responsable" :disabled="saving" />
              </b-form-group>
              <b-form-group label="Telefono">
                <b-form-input v-model.trim="form.telefono" :disabled="saving" />
              </b-form-group>
              <b-form-group label="Mail">
                <b-form-input v-model.trim="form.mail" type="email" :disabled="saving" />
              </b-form-group>
              <b-form-checkbox v-model="form.activa" switch :disabled="saving">
                Activa
              </b-form-checkbox>

              <div class="funerarias-admin__actions">
                <b-button type="submit" variant="success" :disabled="saving || !canSave">
                  <b-spinner v-if="saving" small class="mr-2" />
                  {{ saving ? 'Guardando...' : 'Guardar' }}
                </b-button>
              </div>
            </b-form>

            <hr>

            <div class="funerarias-admin__assign">
              <h6>Asociar usuario</h6>
              <p class="text-muted mb-2">
                Selecciona una funeraria y asignale un usuario interno.
              </p>
              <b-form-select
                v-model="assignFunerariaId"
                :options="funerariaOptions"
                :disabled="assigning || !funerarias.length"
                class="mb-2"
              />
              <b-form-select
                v-model="assignUserId"
                :options="userOptions"
                :disabled="assigning || !users.length"
                class="mb-2"
              />
              <b-button
                variant="primary"
                block
                :disabled="assigning || !assignFunerariaId || !assignUserId"
                @click="associateUser"
              >
                <b-spinner v-if="assigning" small class="mr-2" />
                {{ assigning ? 'Asignando...' : 'Asignar usuario' }}
              </b-button>

              <div v-if="selectedFunerariaUsers.length" class="funerarias-admin__users">
                <strong>Usuarios asociados</strong>
                <span v-for="user in selectedFunerariaUsers" :key="user.id">
                  {{ user.username }}
                </span>
              </div>
            </div>
        </aside>
      </div>
    </b-container>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['authenticated', 'require-admin'],
  permissions: ['cementerio.admin'],
})
useHead({ title: 'Administrar funerarias - Hacienda Villa Gesell' })
</script>

<script>
import FunerariasService from '~/service/funerarias.js'

const emptyForm = () => ({
  nombre: '',
  cuit: '',
  responsable: '',
  telefono: '',
  mail: '',
  activa: true,
})

export default {
  setup() {
    const { showToast } = useProjectToast()
    return { showToast }
  },
  data() {
    return {
      loading: false,
      saving: false,
      assigning: false,
      loadError: '',
      search: '',
      funerarias: [],
      users: [],
      editingId: '',
      form: emptyForm(),
      assignFunerariaId: '',
      assignUserId: '',
      fields: [
        { key: 'nombre', label: 'Funeraria', sortable: true },
        { key: 'cuit', label: 'CUIT', sortable: true },
        { key: 'responsable', label: 'Responsable' },
        { key: 'telefono', label: 'Telefono' },
        { key: 'activa', label: 'Estado' },
        { key: 'usuarios', label: 'Usuarios' },
        { key: 'acciones', label: '' },
      ],
    }
  },
  async mounted() {
    await this.loadData()
  },
  computed: {
    canSave() {
      return Boolean(this.form.nombre && this.form.cuit)
    },
    filteredFunerarias() {
      const term = this.search.toLowerCase()
      if (!term) return this.funerarias
      return this.funerarias.filter(item => [
        item.nombre,
        item.cuit,
        item.responsable,
        item.mail,
      ].filter(Boolean).join(' ').toLowerCase().includes(term))
    },
    funerariaOptions() {
      return [
        { value: '', text: 'Seleccionar funeraria' },
        ...this.funerarias.map(item => ({
          value: item.id,
          text: `${item.nombre} (${item.cuit})`,
        })),
      ]
    },
    userOptions() {
      return [
        { value: '', text: 'Seleccionar usuario' },
        ...this.users.map(user => ({
          value: user.id,
          text: user.username,
        })),
      ]
    },
    selectedFunerariaUsers() {
      if (!this.assignFunerariaId) return []
      return this.usuariosPorFuneraria(this.assignFunerariaId)
    },
  },
  methods: {
    async loadData() {
      this.loading = true
      this.loadError = ''
      try {
        const [funerarias, users] = await Promise.all([
          FunerariasService.getAll(this.$axios),
          FunerariasService.getUsers(this.$axios),
        ])
        this.funerarias = funerarias
        this.users = users
        if (!this.assignFunerariaId && funerarias.length) {
          this.assignFunerariaId = funerarias[0].id
        }
      } catch (error) {
        this.loadError = error.message || 'No se pudo cargar la administracion de funerarias.'
      } finally {
        this.loading = false
      }
    },
    startCreate() {
      this.editingId = ''
      this.form = emptyForm()
    },
    startEdit(item) {
      this.editingId = item.id
      this.assignFunerariaId = item.id
      this.form = {
        nombre: item.nombre,
        cuit: item.cuit,
        responsable: item.responsable,
        telefono: item.telefono,
        mail: item.mail,
        activa: item.activa,
      }
    },
    async saveFuneraria() {
      if (!this.canSave || this.saving) return
      this.saving = true
      try {
        const saved = await FunerariasService.save(this.$axios, {
          id: this.editingId,
          ...this.form,
        })
        const index = this.funerarias.findIndex(item => item.id === saved.id)
        if (index >= 0) this.funerarias[index] = saved
        else this.funerarias.push(saved)
        this.editingId = saved.id
        this.assignFunerariaId = saved.id
        this.showToast('Funeraria guardada.', { variant: 'success', solid: true })
      } catch (error) {
        this.showToast(error.message || 'No se pudo guardar la funeraria.', { variant: 'danger', solid: true })
      } finally {
        this.saving = false
      }
    },
    async associateUser() {
      if (!this.assignFunerariaId || !this.assignUserId || this.assigning) return
      this.assigning = true
      try {
        const updated = await FunerariasService.associateUser(this.$axios, this.assignFunerariaId, this.assignUserId)
        const index = this.users.findIndex(user => user.id === updated.id)
        if (index >= 0) this.users[index] = updated
        this.assignUserId = ''
        this.showToast('Usuario asociado a la funeraria.', { variant: 'success', solid: true })
      } catch (error) {
        this.showToast(error.message || 'No se pudo asociar el usuario.', { variant: 'danger', solid: true })
      } finally {
        this.assigning = false
      }
    },
    usuariosPorFuneraria(funerariaId) {
      return this.users.filter(user => String(user.funerariaId || '') === String(funerariaId || ''))
    },
  },
}
</script>

<style scoped>
.funerarias-admin__toolbar {
  display: flex;
  gap: .75rem;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.funerarias-admin__search {
  max-width: 440px;
}

.funerarias-admin__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 1rem;
}

.funerarias-admin__main,
.funerarias-admin__side {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 8px 22px rgba(0, 0, 0, .08);
}

.funerarias-admin__main {
  padding: .75rem;
}

.funerarias-admin__side {
  padding: 1rem;
}

.funerarias-admin__side-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: .75rem;
  margin-bottom: 1rem;
}

.funerarias-admin__side-header small {
  color: #0f9b2b;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.funerarias-admin__side-header h5 {
  margin: 0;
  color: #08751d;
  font-weight: 800;
}

.funerarias-admin__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.funerarias-admin__assign h6 {
  color: #08751d;
  font-weight: 800;
}

.funerarias-admin__users {
  display: grid;
  gap: .35rem;
  margin-top: 1rem;
  padding: .75rem;
  border-radius: 8px;
  background: #f8f9fa;
  font-size: .86rem;
}

@media (max-width: 992px) {
  .funerarias-admin__layout {
    grid-template-columns: 1fr;
  }

  .funerarias-admin__toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .funerarias-admin__search {
    max-width: none;
  }
}
</style>
