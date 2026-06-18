<template>
  <div class="page main-background abierto-admin">
    <Banner title="Administrar abierto anual" subtitle="Configuracion" />

    <b-container class="py-4">
      <b-alert v-if="error" show variant="danger">
        {{ error }}
      </b-alert>

      <section class="abierto-admin__header">
        <div>
          <span>Calendario {{ currentYear }}</span>
          <h2>Periodos y rectificacion global</h2>
          <p>
            Configura las ventanas de carga de facturas y fuerza la rectificacion global para pruebas.
          </p>
        </div>
        <b-button variant="outline-success" :disabled="loading || saving" @click="loadConfig">
          <b-spinner v-if="loading" small class="mr-2" />
          {{ loading ? 'Cargando...' : 'Actualizar' }}
        </b-button>
      </section>

      <div class="abierto-admin__layout">
        <section class="abierto-admin__main">
          <b-card class="shadow-card">
            <template #header>
              <strong>Ventanas de carga</strong>
            </template>

            <div
              v-for="(periodo, index) in form.periodos"
              :key="index"
              class="abierto-admin__period"
            >
              <div class="abierto-admin__period-title">
                <strong>Periodo {{ index + 1 }}</strong>
                <small>{{ dateLabel(periodo.min) }} - {{ dateLabel(periodo.max) }}</small>
              </div>
              <b-form-group label="Inicio">
                <b-form-input v-model="periodo.min" type="date" :disabled="saving" />
              </b-form-group>
              <b-form-group label="Final">
                <b-form-input v-model="periodo.max" type="date" :disabled="saving" />
              </b-form-group>
            </div>
          </b-card>
        </section>

        <aside class="abierto-admin__side">
          <b-card class="shadow-card mb-3">
            <template #header>
              <strong>Rectificacion global</strong>
            </template>
            <b-form-checkbox v-model="form.rectificacionGlobal" switch size="lg" :disabled="saving">
              {{ form.rectificacionGlobal ? 'Habilitada' : 'Deshabilitada' }}
            </b-form-checkbox>
            <p class="text-muted mt-2 mb-0">
              Cuando esta activa, el sitio permite rectificar sin depender de la ventana de fechas.
            </p>
          </b-card>

          <b-card class="shadow-card mb-3">
            <template #header>
              <strong>Estado actual</strong>
            </template>
            <dl class="abierto-admin__summary">
              <dt>Rectificacion por fecha</dt>
              <dd>{{ config && config.rectificacionPorFecha ? 'Activa' : 'Inactiva' }}</dd>
              <dt>Rectificacion efectiva</dt>
              <dd>{{ config && config.rectificacion ? 'Activa' : 'Inactiva' }}</dd>
              <dt>Sitio cerrado</dt>
              <dd>{{ config && config.popUpAbiertoAnualCerrado ? 'Si' : 'No' }}</dd>
            </dl>
          </b-card>

          <div class="abierto-admin__actions">
            <b-button variant="outline-secondary" :disabled="saving || !hasChanges" @click="resetForm">
              Deshacer
            </b-button>
            <b-button variant="success" :disabled="saving || !canSave" @click="confirmSave">
              <b-spinner v-if="saving" small class="mr-2" />
              {{ saving ? 'Guardando...' : 'Guardar cambios' }}
            </b-button>
          </div>
        </aside>
      </div>
    </b-container>
  </div>
</template>

<script>
const AbiertoAnualConfigService = require('@/service/abiertoAnualConfig')

export default {
  middleware: ['authenticated', 'abiertoAnualAdmin'],
  data() {
    return {
      loading: false,
      saving: false,
      error: '',
      config: null,
      original: null,
      form: {
        periodos: [
          { min: '', max: '' },
          { min: '', max: '' },
          { min: '', max: '' }
        ],
        rectificacionGlobal: false
      }
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear()
    },
    hasChanges() {
      return JSON.stringify(this.payloadFromForm()) !== JSON.stringify(this.original)
    },
    canSave() {
      return this.form.periodos.every(periodo => periodo.min && periodo.max) && this.hasChanges
    }
  },
  async fetch() {
    await this.loadConfig()
  },
  methods: {
    ddmmToInput(value) {
      if (!value) return ''
      const [day, month] = String(value).split('/')
      return `${this.currentYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    },
    inputToDDMM(value) {
      if (!value) return ''
      const [, month, day] = String(value).split('-')
      return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`
    },
    dateLabel(value) {
      if (!value) return 'Sin fecha'
      const [year, month, day] = String(value).split('-')
      return `${day}/${month}/${year}`
    },
    payloadFromForm() {
      return {
        periodos: this.form.periodos.map(periodo => ({
          min: this.inputToDDMM(periodo.min),
          max: this.inputToDDMM(periodo.max)
        })),
        rectificacion: this.original && this.original.rectificacion
          ? { ...this.original.rectificacion }
          : { min: '01/11', max: '30/11' },
        rectificacionGlobal: Boolean(this.form.rectificacionGlobal)
      }
    },
    applyConfig(config) {
      const raw = config && config.raw
        ? config.raw
        : {
          periodos: [
            { min: '01/05', max: '31/05' },
            { min: '01/08', max: '31/08' },
            { min: '01/10', max: '31/10' }
          ],
          rectificacion: { min: '01/11', max: '30/11' },
          rectificacionGlobal: false
        }

      this.config = config
      this.original = {
        periodos: raw.periodos.map(periodo => ({ min: periodo.min, max: periodo.max })),
        rectificacion: { ...(raw.rectificacion || { min: '01/11', max: '30/11' }) },
        rectificacionGlobal: typeof raw.rectificacionGlobal === 'boolean' ? raw.rectificacionGlobal : false
      }
      this.resetForm()
    },
    async loadConfig() {
      this.loading = true
      this.error = ''
      try {
        const config = await AbiertoAnualConfigService.getAbiertoAnualPeriodos(this.$axios)
        this.applyConfig(config)
      } catch (error) {
        this.error = error.response?.data?.message || 'No se pudo cargar la configuracion de abierto anual.'
      } finally {
        this.loading = false
      }
    },
    resetForm() {
      const source = this.original || {
        periodos: [
          { min: '01/05', max: '31/05' },
          { min: '01/08', max: '31/08' },
          { min: '01/10', max: '31/10' }
        ],
        rectificacionGlobal: false
      }
      this.form = {
        periodos: source.periodos.map(periodo => ({
          min: this.ddmmToInput(periodo.min),
          max: this.ddmmToInput(periodo.max)
        })),
        rectificacionGlobal: Boolean(source.rectificacionGlobal)
      }
    },
    async confirmSave() {
      if (!this.canSave) return
      const confirmed = await this.$bvModal.msgBoxConfirm(
        'Se va a actualizar la configuracion de abierto anual para todo el sitio.',
        {
          title: 'Guardar configuracion',
          okTitle: 'Guardar',
          cancelTitle: 'Cancelar',
          okVariant: 'success',
          centered: true,
        }
      )
      if (!confirmed) return
      await this.save()
    },
    async save() {
      this.saving = true
      this.error = ''
      try {
        const config = await AbiertoAnualConfigService.updateAbiertoAnualPeriodos(this.$axios, this.payloadFromForm())
        this.applyConfig(config)
        this.$bvToast.toast('Configuracion de abierto anual actualizada.', {
          title: 'Abierto anual',
          variant: 'success',
          solid: true,
        })
      } catch (error) {
        this.error = error.response?.data?.message || 'No se pudo guardar la configuracion.'
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style scoped>
.abierto-admin__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.abierto-admin__header span {
  color: #008a22;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.abierto-admin__header h2 {
  margin: .25rem 0;
  color: #063f18;
  font-weight: 800;
}

.abierto-admin__header p {
  margin: 0;
  color: #6c757d;
}

.abierto-admin__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 1.25rem;
}

.abierto-admin__period {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) minmax(140px, 190px) minmax(140px, 190px);
  gap: 1rem;
  align-items: end;
  padding: 1rem 0;
  border-bottom: 1px solid #e9ecef;
}

.abierto-admin__period:last-child {
  border-bottom: 0;
}

.abierto-admin__period-title strong,
.abierto-admin__period-title small {
  display: block;
}

.abierto-admin__period-title small {
  margin-top: .25rem;
  color: #6c757d;
}

.abierto-admin__summary {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: .6rem .8rem;
  margin: 0;
}

.abierto-admin__summary dt {
  color: #6c757d;
}

.abierto-admin__summary dd {
  margin: 0;
  color: #063f18;
  font-weight: 800;
}

.abierto-admin__actions {
  display: flex;
  justify-content: flex-end;
  gap: .75rem;
}

@media (max-width: 992px) {
  .abierto-admin__layout {
    grid-template-columns: 1fr;
  }

  .abierto-admin__period {
    grid-template-columns: 1fr;
  }
}
</style>
