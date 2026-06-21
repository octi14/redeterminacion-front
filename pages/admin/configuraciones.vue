<template>
  <div class="page main-background general-config">
    <Banner title="Configuraciones generales" subtitle="Sistema" />

    <b-container class="py-4">
      <b-alert v-if="error" show variant="danger">
        {{ error }}
      </b-alert>

      <section class="general-config__header">
        <div>
          <span>Flags globales</span>
          <h2>Modulos y mantenimiento</h2>
          <p>
            Administra configuraciones transversales que afectan a todo el sitio.
          </p>
        </div>
        <b-button variant="outline-success" :disabled="loading || saving" @click="loadConfig">
          <b-spinner v-if="loading" small class="mr-2" />
          {{ loading ? 'Cargando...' : 'Actualizar' }}
        </b-button>
      </section>

      <div class="general-config__layout">
        <section class="general-config__main">
          <b-card class="shadow-card">
            <template #header>
              <strong>Configuraciones disponibles</strong>
            </template>

            <div
              v-for="option in options"
              :key="option.key"
              class="general-config__option"
            >
              <div>
                <h3>{{ option.title }}</h3>
                <p>{{ option.description }}</p>
              </div>
              <b-form-checkbox
                v-model="form[option.key]"
                switch
                size="lg"
                :disabled="saving"
              >
                {{ form[option.key] ? 'Habilitado' : 'Deshabilitado' }}
              </b-form-checkbox>
            </div>
          </b-card>

          <b-card class="shadow-card mt-3">
            <template #header>
              <strong>Importaciones de boletas</strong>
            </template>

            <p class="general-config__card-intro">
              Controla que modulos pueden publicar importaciones y si se conserva el XLSX original.
            </p>

            <div class="general-config__option">
              <div>
                <h3>Almacenamiento de archivo original</h3>
                <p>Permite conservar el XLSX original en S3 cuando se publica una importacion de boletas.</p>
              </div>
              <b-form-checkbox
                v-model="form.boletaTasasUploadEnabled"
                switch
                size="lg"
                :disabled="saving"
              >
                {{ form.boletaTasasUploadEnabled ? 'Habilitado' : 'Deshabilitado' }}
              </b-form-checkbox>
            </div>

            <div
              v-for="tax in taxImportOptions"
              :key="tax.key"
              class="general-config__option"
            >
              <div>
                <h3>{{ tax.title }}</h3>
                <p>{{ tax.description }}</p>
              </div>
              <b-form-checkbox
                v-model="form.boletaTasasImportaciones[tax.key]"
                switch
                size="lg"
                :disabled="saving"
              >
                {{ form.boletaTasasImportaciones[tax.key] ? 'Habilitado' : 'Deshabilitado' }}
              </b-form-checkbox>
            </div>
          </b-card>

          <b-card class="shadow-card mt-3">
            <template #header>
              <strong>Colores de boletas de tasas</strong>
            </template>

            <p class="general-config__card-intro">
              Define los colores usados al generar los PDF de boletas. El cambio aplica a nuevas descargas.
            </p>

            <div class="general-config__tax-colors">
              <section
                v-for="tax in taxColorOptions"
                :key="tax.key"
                class="general-config__tax-card"
              >
                <div class="general-config__tax-heading">
                  <div>
                    <span>{{ tax.code }}</span>
                    <h3>{{ tax.title }}</h3>
                  </div>
                  <div class="general-config__tax-preview">
                    <span :style="{ backgroundColor: form.boletaTasasColors[tax.key].oscuro }"></span>
                    <span :style="{ backgroundColor: form.boletaTasasColors[tax.key].principal }"></span>
                    <span :style="{ backgroundColor: form.boletaTasasColors[tax.key].suave }"></span>
                  </div>
                </div>

                <div
                  v-for="color in colorFields"
                  :key="`${tax.key}-${color.key}`"
                  class="general-config__color-row"
                >
                  <label :for="`tax-color-${tax.key}-${color.key}`">
                    <strong>{{ color.title }}</strong>
                    <small>{{ color.description }}</small>
                  </label>
                  <div class="general-config__color-inputs">
                    <b-form-input
                      :id="`tax-color-${tax.key}-${color.key}`"
                      v-model="form.boletaTasasColors[tax.key][color.key]"
                      type="color"
                      :disabled="saving"
                    />
                    <b-form-input
                      v-model.trim="form.boletaTasasColors[tax.key][color.key]"
                      :state="isHexColor(form.boletaTasasColors[tax.key][color.key])"
                      maxlength="7"
                      :disabled="saving"
                    />
                  </div>
                </div>
              </section>
            </div>
          </b-card>

          <b-card class="shadow-card mt-3">
            <template #header>
              <strong>Plantillas de correo automatico</strong>
            </template>

            <div class="general-config__mailing-toggle">
              <div>
                <h3>Modulo de mailing</h3>
                <p>Habilita o deshabilita el envio automatico de correos para todos los modulos.</p>
              </div>
              <b-form-checkbox
                v-model="form.mailerEnabled"
                switch
                size="lg"
                :disabled="saving"
              >
                {{ form.mailerEnabled ? 'Habilitado' : 'Deshabilitado' }}
              </b-form-checkbox>
            </div>

            <b-alert v-if="templatesError" show variant="danger">
              {{ templatesError }}
            </b-alert>

            <div class="general-config__template-picker">
              <div class="general-config__picker-controls">
                <b-form-group label="Modulo">
                  <b-form-select v-model="templateModuleFilter" :options="moduleOptions" />
                </b-form-group>
                <b-form-group label="Buscar">
                  <b-form-input v-model.trim="templateSearch" placeholder="Nombre, clave o descripcion" />
                </b-form-group>
                <b-form-group label="Plantilla">
                  <b-form-select
                    :value="selectedTemplateKey"
                    :options="templateSelectOptions"
                    @change="selectTemplate"
                  />
                </b-form-group>
              </div>

              <div v-if="selectedTemplate" class="general-config__selected-template">
                <span>{{ selectedTemplate.module }}</span>
                <strong>{{ selectedTemplate.name }}</strong>
                <small>{{ selectedTemplate.key }}</small>
              </div>
            </div>

            <div class="general-config__template-grid">
              <div v-if="selectedTemplate" class="general-config__template-editor">
                <div class="general-config__template-heading">
                  <div>
                    <h3>{{ selectedTemplate.name }}</h3>
                    <p>{{ selectedTemplate.description }}</p>
                  </div>
                  <b-form-checkbox v-model="templateForm.enabled" switch :disabled="savingTemplate">
                    {{ templateForm.enabled ? 'Activa' : 'Inactiva' }}
                  </b-form-checkbox>
                </div>

                <b-form-group label="Asunto">
                  <b-form-input v-model="templateForm.subject" :disabled="savingTemplate" />
                </b-form-group>

                <b-form-group label="Cuerpo">
                  <b-form-textarea
                    v-model="templateForm.body"
                    rows="12"
                    max-rows="18"
                    :disabled="savingTemplate"
                  />
                </b-form-group>

                <div class="general-config__variables">
                  <span>Variables</span>
                  <button
                    v-for="variable in selectedTemplate.variables"
                    :key="variable"
                    type="button"
                    @click="insertVariable(variable)"
                  >
                    {{ variable }}
                  </button>
                </div>

                <div class="general-config__test-mail">
                  <b-form-group label="Destinatario de prueba" class="mb-0">
                    <b-form-input
                      v-model.trim="testRecipient"
                      type="email"
                      placeholder="mail@gesell.gob.ar"
                      :disabled="sendingTestMail"
                    />
                  </b-form-group>
                  <b-button
                    variant="outline-primary"
                    :disabled="!canSendTestMail"
                    @click="sendTestMail"
                  >
                    <b-spinner v-if="sendingTestMail" small class="mr-2" />
                    {{ sendingTestMail ? 'Enviando...' : 'Enviar prueba' }}
                  </b-button>
                </div>

                <div class="general-config__actions mt-3">
                  <b-button variant="outline-success" :disabled="!selectedTemplate" @click="showPreview = true">
                    Vista previa
                  </b-button>
                  <b-button variant="outline-secondary" :disabled="savingTemplate || !hasTemplateChanges" @click="resetTemplateForm">
                    Deshacer
                  </b-button>
                  <b-button variant="success" :disabled="savingTemplate || !hasTemplateChanges" @click="saveTemplate">
                    <b-spinner v-if="savingTemplate" small class="mr-2" />
                    {{ savingTemplate ? 'Guardando...' : 'Guardar plantilla' }}
                  </b-button>
                </div>
              </div>
            </div>
          </b-card>
        </section>

        <aside class="general-config__side">
          <b-card class="shadow-card mb-3">
            <template #header>
              <strong>Estado actual</strong>
            </template>
            <dl class="general-config__summary">
              <dt>Mailing</dt>
              <dd :class="{ 'is-active': original && original.mailerEnabled }">
                {{ original && original.mailerEnabled ? 'Activo' : 'Inactivo' }}
              </dd>
              <dt>Log de actividades</dt>
              <dd :class="{ 'is-active': original && original.logActivityEnabled }">
                {{ original && original.logActivityEnabled ? 'Activo' : 'Inactivo' }}
              </dd>
              <dt>Modo mantenimiento</dt>
              <dd :class="{ 'is-danger': original && original.maintenanceMode }">
                {{ original && original.maintenanceMode ? 'Activo' : 'Inactivo' }}
              </dd>
              <dt>Archivo original</dt>
              <dd :class="{ 'is-active': original && original.boletaTasasUploadEnabled }">
                {{ original && original.boletaTasasUploadEnabled ? 'Activo' : 'Inactivo' }}
              </dd>
              <template v-for="tax in taxImportOptions">
                <dt :key="`${tax.key}-label`">Importacion {{ tax.shortTitle }}</dt>
                <dd
                  :key="`${tax.key}-value`"
                  :class="{ 'is-active': original && original.boletaTasasImportaciones && original.boletaTasasImportaciones[tax.key] }"
                >
                  {{ original && original.boletaTasasImportaciones && original.boletaTasasImportaciones[tax.key] ? 'Activo' : 'Inactivo' }}
                </dd>
              </template>
            </dl>
          </b-card>

          <b-alert show :variant="form.maintenanceMode ? 'warning' : 'info'" class="mb-3">
            El modo mantenimiento bloquea las rutas del sitio con respuesta 503, excepto esta configuracion para poder desactivarlo.
          </b-alert>

          <div class="general-config__actions">
            <b-button variant="outline-secondary" :disabled="saving || !hasChanges" @click="resetForm">
              Deshacer
            </b-button>
            <b-button variant="success" :disabled="saving || !hasChanges" @click="confirmSave">
              <b-spinner v-if="saving" small class="mr-2" />
              {{ saving ? 'Guardando...' : 'Guardar cambios' }}
            </b-button>
          </div>
        </aside>
      </div>
    </b-container>

    <b-modal
      v-model="showPreview"
      title="Vista previa del correo"
      centered
      size="lg"
    >
      <div class="general-config__preview">
        <h4>{{ preview.subject }}</h4>
        <pre>{{ preview.body }}</pre>
      </div>
      <template #modal-footer="{ cancel }">
        <b-form-input
          v-model.trim="testRecipient"
          type="email"
          placeholder="Destinatario de prueba"
          class="general-config__preview-recipient"
          :disabled="sendingTestMail"
        />
        <b-button variant="outline-secondary" :disabled="sendingTestMail" @click="cancel()">
          Cerrar
        </b-button>
        <b-button variant="primary" :disabled="!canSendTestMail" @click="sendTestMail">
          <b-spinner v-if="sendingTestMail" small class="mr-2" />
          {{ sendingTestMail ? 'Enviando...' : 'Enviar prueba' }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
const GeneralConfigService = require('@/service/generalConfig')
const MailerServiceModule = require('@/service/mailer')
const MailerService = MailerServiceModule.default || MailerServiceModule

const TAX_IMPORT_OPTIONS = [
  {
    key: 'AUTOMOTORES',
    title: 'Importacion de Automotores',
    shortTitle: 'Automotores',
    description: 'Permite analizar y publicar archivos XLSX de boletas de automotores.',
  },
  {
    key: 'URBANA',
    title: 'Importacion de Tasa Urbana',
    shortTitle: 'Urbana',
    description: 'Permite analizar y publicar archivos XLSX de boletas de tasa urbana.',
  },
]
const TAX_IMPORT_LABELS = TAX_IMPORT_OPTIONS.reduce((acc, option) => {
  acc[option.key] = option
  return acc
}, {})

export default {
  middleware: ['authenticated', 'systemConfigAdmin'],
  data() {
    return {
      loading: false,
      saving: false,
      error: '',
      original: null,
      emailTemplates: [],
      selectedTemplateKey: '',
      templateModuleFilter: 'all',
      templateSearch: '',
      templateOriginal: null,
      templateForm: {
        subject: '',
        body: '',
        enabled: true,
      },
      testRecipient: '',
      sendingTestMail: false,
      showPreview: false,
      savingTemplate: false,
      templatesError: '',
      form: {
        mailerEnabled: false,
        logActivityEnabled: true,
        maintenanceMode: false,
        boletaTasasUploadEnabled: true,
        boletaTasasImportaciones: this.defaultBoletaTasasImportaciones(),
        boletaTasasColors: this.defaultBoletaTasasColors(),
      },
      taxColorOptions: [
        { key: 'AUTOMOTORES', code: 'AUTOMOTORES', title: 'Tasa Automotor' },
        { key: 'URBANA', code: 'URBANA', title: 'Tasa Urbana' },
      ],
      colorFields: [
        {
          key: 'principal',
          title: 'Principal',
          description: 'Lineas, divisores y acentos.'
        },
        {
          key: 'oscuro',
          title: 'Encabezado',
          description: 'Banda superior de la boleta.'
        },
        {
          key: 'suave',
          title: 'Fondo suave',
          description: 'Franjas y textos secundarios.'
        },
      ],
      options: [
        {
          key: 'logActivityEnabled',
          title: 'Logueo de actividades',
          description: 'Registra acciones de usuarios para auditoria y seguimiento operativo.',
        },
        {
          key: 'maintenanceMode',
          title: 'Modo mantenimiento',
          description: 'Responde 503 en las rutas del sitio mientras se realizan tareas administrativas.',
        },
      ],
    }
  },
  computed: {
    taxImportOptions() {
      const values = this.form && this.form.boletaTasasImportaciones
        ? this.form.boletaTasasImportaciones
        : this.defaultBoletaTasasImportaciones()
      return Object.keys(values).map((key) => {
        return TAX_IMPORT_LABELS[key] || {
          key,
          title: `Importacion ${key}`,
          shortTitle: key,
          description: `Permite analizar y publicar archivos XLSX de boletas para ${key}.`,
        }
      })
    },
    hasChanges() {
      return JSON.stringify(this.form) !== JSON.stringify(this.original)
    },
    selectedTemplate() {
      return this.emailTemplates.find(template => template.key === this.selectedTemplateKey)
    },
    moduleOptions() {
      const modules = [...new Set(this.emailTemplates.map(template => template.module).filter(Boolean))].sort()
      return [
        { value: 'all', text: 'Todos' },
        ...modules.map(module => ({ value: module, text: module }))
      ]
    },
    filteredTemplates() {
      const search = this.templateSearch.toLowerCase()
      return this.emailTemplates.filter((template) => {
        const matchesModule = this.templateModuleFilter === 'all' || template.module === this.templateModuleFilter
        const haystack = `${template.name} ${template.key} ${template.description} ${template.module}`.toLowerCase()
        return matchesModule && (!search || haystack.includes(search))
      })
    },
    templateSelectOptions() {
      if (!this.filteredTemplates.length) {
        return [{ value: null, text: 'Sin plantillas disponibles' }]
      }
      return this.filteredTemplates.map(template => ({
        value: template.key,
        text: `${template.name} (${template.module})`
      }))
    },
    hasTemplateChanges() {
      return JSON.stringify(this.templateForm) !== JSON.stringify(this.templateOriginal)
    },
    canSendTestMail() {
      return Boolean(
        this.selectedTemplate &&
        this.original &&
        this.original.mailerEnabled &&
        this.testRecipient &&
        this.testRecipient.includes('@') &&
        this.preview.subject &&
        this.preview.body &&
        !this.sendingTestMail
      )
    },
    previewContext() {
      if (!this.selectedTemplate) return {}
      return this.selectedTemplate.variables.reduce((acc, variable) => {
        acc[variable] = this.sampleValue(variable)
        return acc
      }, {})
    },
    preview() {
      return {
        subject: this.renderTemplateText(this.templateForm.subject, this.previewContext),
        body: this.renderTemplateText(this.templateForm.body, this.previewContext),
      }
    },
  },
  async fetch() {
    await Promise.all([
      this.loadConfig(),
      this.loadTemplates(),
    ])
  },
  methods: {
    defaultBoletaTasasImportaciones() {
      return TAX_IMPORT_OPTIONS.reduce((acc, tax) => {
        acc[tax.key] = true
        return acc
      }, {})
    },
    defaultBoletaTasasColors() {
      return {
        AUTOMOTORES: {
          principal: '#bd3041',
          oscuro: '#771a28',
          suave: '#fbdde1',
        },
        URBANA: {
          principal: '#13875e',
          oscuro: '#075e4a',
          suave: '#e3f5ed',
        },
      }
    },
    isHexColor(value) {
      return /^#[0-9a-fA-F]{6}$/.test(String(value || ''))
    },
    normalizeBoletaTasasColors(value = {}) {
      const defaults = this.defaultBoletaTasasColors()
      return Object.keys(defaults).reduce((acc, taxKey) => {
        acc[taxKey] = Object.keys(defaults[taxKey]).reduce((colors, colorKey) => {
          const candidate = value && value[taxKey] ? value[taxKey][colorKey] : ''
          colors[colorKey] = this.isHexColor(candidate) ? candidate : defaults[taxKey][colorKey]
          return colors
        }, {})
        return acc
      }, {})
    },
    normalizeBoletaTasasImportaciones(value = {}) {
      const defaults = this.defaultBoletaTasasImportaciones()
      const keys = Array.from(new Set([...Object.keys(defaults), ...Object.keys(value || {})]))
      return keys.reduce((acc, taxKey) => {
        acc[taxKey] = typeof value[taxKey] === 'boolean' ? value[taxKey] : defaults[taxKey]
        return acc
      }, {})
    },
    normalizeConfig(config = {}) {
      return {
        mailerEnabled: Boolean(config.mailerEnabled),
        logActivityEnabled: config.logActivityEnabled !== false,
        maintenanceMode: Boolean(config.maintenanceMode),
        boletaTasasUploadEnabled: config.boletaTasasUploadEnabled !== false,
        boletaTasasImportaciones: this.normalizeBoletaTasasImportaciones(config.boletaTasasImportaciones),
        boletaTasasColors: this.normalizeBoletaTasasColors(config.boletaTasasColors),
      }
    },
    applyConfig(config) {
      this.original = this.normalizeConfig(config)
      this.resetForm()
    },
    resetForm() {
      const source = this.original || {
        mailerEnabled: false,
        logActivityEnabled: true,
        maintenanceMode: false,
        boletaTasasUploadEnabled: true,
        boletaTasasImportaciones: this.defaultBoletaTasasImportaciones(),
        boletaTasasColors: this.defaultBoletaTasasColors(),
      }
      this.form = JSON.parse(JSON.stringify(source))
    },
    async loadConfig() {
      this.loading = true
      this.error = ''
      try {
        const config = await GeneralConfigService.getGeneralConfig(this.$axios)
        this.applyConfig(config)
      } catch (error) {
        this.error = error.response?.data?.message || 'No se pudo cargar la configuracion general.'
      } finally {
        this.loading = false
      }
    },
    async loadTemplates() {
      this.templatesError = ''
      try {
        const templates = await GeneralConfigService.getEmailTemplates(this.$axios)
        this.emailTemplates = templates
        if (!this.selectedTemplateKey && templates.length) {
          this.selectTemplate(templates[0].key)
        }
      } catch (error) {
        this.templatesError = error.response?.data?.message || 'No se pudieron cargar las plantillas de correo.'
      }
    },
    selectTemplate(key) {
      if (!key) return
      if (this.templateOriginal && this.hasTemplateChanges) {
        const confirmed = window.confirm('Hay cambios sin guardar en la plantilla actual. Desea descartarlos?')
        if (!confirmed) return
      }
      this.selectedTemplateKey = key
      this.resetTemplateForm()
    },
    resetTemplateForm() {
      const template = this.selectedTemplate
      if (!template) return
      this.templateOriginal = {
        subject: template.subject || '',
        body: template.body || '',
        enabled: template.enabled !== false,
      }
      this.templateForm = { ...this.templateOriginal }
    },
    insertVariable(variable) {
      this.templateForm.body = `${this.templateForm.body}{{${variable}}}`
    },
    sampleValue(variable) {
      const samples = {
        nroTramite: '1262',
        tipoSolicitud: 'Habilitacion',
        rubro: 'Gastronomia',
        fechaInspeccion: '18/06/2026',
        horario: '10:30',
        domicilio: 'Av. 3 Nro 820',
        nombre: 'Juan Perez',
        fechaAprobacion: '18/06/2026',
        comentario: 'Comentario: documentacion verificada.',
        motivo: 'La documentacion presentada no es legible.',
        nroExpediente: '4124-123/2026',
        alcance: 'Alcance: 1',
        tipoTramite: 'Renovacion',
        elementosIncorrectos: '- DNI ilegible\n- Falta constancia de CUIT',
      }
      return samples[variable] || `Ejemplo ${variable}`
    },
    renderTemplateText(text, context) {
      return String(text || '').replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_match, variable) => {
        return context[variable] || ''
      })
    },
    async sendTestMail() {
      if (!this.canSendTestMail) return
      this.sendingTestMail = true
      try {
        await MailerService.enviarCorreo(this.$axios, {
          destinatario: this.testRecipient,
          asunto: this.preview.subject,
          mensaje: this.preview.body
        })
        this.$bvToast.toast('Correo de prueba enviado.', {
          title: 'Mailing',
          variant: 'success',
          solid: true,
        })
      } catch (error) {
        this.$bvToast.toast(error.response?.data?.message || 'No se pudo enviar el correo de prueba.', {
          title: 'Mailing',
          variant: 'danger',
          solid: true,
        })
      } finally {
        this.sendingTestMail = false
      }
    },
    async saveTemplate() {
      if (!this.selectedTemplate || !this.hasTemplateChanges) return
      this.savingTemplate = true
      this.templatesError = ''
      try {
        const updated = await GeneralConfigService.updateEmailTemplate(this.$axios, this.selectedTemplate.key, this.templateForm)
        this.emailTemplates = this.emailTemplates.map(template => (
          template.key === updated.key ? updated : template
        ))
        this.resetTemplateForm()
        this.$bvToast.toast('Plantilla de correo actualizada.', {
          title: 'Mailing',
          variant: 'success',
          solid: true,
        })
      } catch (error) {
        this.templatesError = error.response?.data?.message || 'No se pudo guardar la plantilla.'
      } finally {
        this.savingTemplate = false
      }
    },
    async confirmSave() {
      if (!this.hasChanges) return
      const invalidColor = this.taxColorOptions.some(tax => (
        this.colorFields.some(color => !this.isHexColor(this.form.boletaTasasColors[tax.key][color.key]))
      ))
      if (invalidColor) {
        this.error = 'Revisa los colores de boletas. Deben tener formato hexadecimal, por ejemplo #13875e.'
        return
      }
      const confirmed = await this.$bvModal.msgBoxConfirm(
        'Se van a actualizar configuraciones globales del sitio.',
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
        const config = await GeneralConfigService.updateGeneralConfig(this.$axios, this.form)
        this.applyConfig(config)
        this.$bvToast.toast('Configuracion general actualizada.', {
          title: 'Sistema',
          variant: 'success',
          solid: true,
        })
      } catch (error) {
        this.error = error.response?.data?.message || 'No se pudo guardar la configuracion.'
      } finally {
        this.saving = false
      }
    },
  },
}
</script>

<style scoped>
.general-config__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.general-config__header span {
  color: #008a22;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.general-config__header h2 {
  margin: .25rem 0;
  color: #063f18;
  font-weight: 800;
}

.general-config__header p {
  margin: 0;
  color: #6c757d;
}

.general-config__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 1.25rem;
}

.general-config__option {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 190px;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e9ecef;
}

.general-config__option:last-child {
  border-bottom: 0;
}

.general-config__option h3 {
  margin: 0 0 .25rem;
  color: #063f18;
  font-size: 1.1rem;
  font-weight: 800;
}

.general-config__option p {
  margin: 0;
  color: #6c757d;
}

.general-config__card-intro {
  margin: 0 0 1rem;
  color: #6c757d;
}

.general-config__tax-colors {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.general-config__tax-card {
  display: grid;
  gap: .9rem;
  padding: 1rem;
  border: 1px solid #e3ece7;
  border-radius: 8px;
  background: #fbfdfc;
}

.general-config__tax-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.general-config__tax-heading span {
  display: block;
  color: #008a22;
  font-size: .72rem;
  font-weight: 800;
  letter-spacing: .08em;
}

.general-config__tax-heading h3 {
  margin: .15rem 0 0;
  color: #063f18;
  font-size: 1.05rem;
  font-weight: 800;
}

.general-config__tax-preview {
  display: grid;
  grid-template-columns: repeat(3, 28px);
  overflow: hidden;
  border: 1px solid #d7e6dc;
  border-radius: 8px;
}

.general-config__tax-preview span {
  height: 34px;
}

.general-config__color-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 160px;
  gap: .75rem;
  align-items: center;
}

.general-config__color-row label {
  margin: 0;
}

.general-config__color-row strong,
.general-config__color-row small {
  display: block;
}

.general-config__color-row strong {
  color: #234236;
  font-size: .9rem;
}

.general-config__color-row small {
  color: #6c757d;
  font-size: .78rem;
}

.general-config__color-inputs {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: .45rem;
  align-items: center;
}

.general-config__color-inputs input[type="color"] {
  min-width: 44px;
  padding: .2rem;
}

.general-config__summary {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: .6rem .8rem;
  margin: 0;
}

.general-config__summary dt {
  color: #6c757d;
}

.general-config__summary dd {
  margin: 0;
  color: #6c757d;
  font-weight: 800;
}

.general-config__summary dd.is-active {
  color: #008a22;
}

.general-config__summary dd.is-danger {
  color: #d92323;
}

.general-config__actions {
  display: flex;
  justify-content: flex-end;
  gap: .75rem;
}

.general-config__mailing-toggle {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 190px;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.general-config__mailing-toggle h3 {
  margin: 0 0 .25rem;
  color: #063f18;
  font-size: 1.1rem;
  font-weight: 800;
}

.general-config__mailing-toggle p {
  margin: 0;
  color: #6c757d;
}

.general-config__template-picker {
  display: grid;
  gap: .85rem;
  margin-bottom: 1rem;
}

.general-config__picker-controls {
  display: grid;
  grid-template-columns: 180px minmax(180px, 1fr) minmax(260px, 1.3fr);
  gap: .85rem;
  align-items: end;
}

.general-config__selected-template {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: .75rem;
  align-items: center;
  padding: .8rem .9rem;
  border: 1px solid #d7ebdd;
  border-radius: 8px;
  background: #f3fbf5;
}

.general-config__selected-template span {
  padding: .25rem .55rem;
  border-radius: 999px;
  color: #063f18;
  background: #dff6e6;
  font-size: .78rem;
  font-weight: 800;
}

.general-config__selected-template strong {
  min-width: 0;
  overflow: hidden;
  color: #063f18;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.general-config__selected-template small {
  color: #6c757d;
  font-family: monospace;
}

.general-config__template-heading {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.general-config__template-heading h3 {
  margin: 0 0 .25rem;
  color: #063f18;
  font-size: 1.1rem;
  font-weight: 800;
}

.general-config__template-heading p {
  margin: 0;
  color: #6c757d;
}

.general-config__variables {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: .4rem;
}

.general-config__variables span {
  color: #6c757d;
  font-weight: 800;
  margin-right: .25rem;
}

.general-config__variables button {
  border: 1px solid #8bd59a;
  border-radius: 999px;
  background: #eefbf1;
  color: #063f18;
  font-family: monospace;
  padding: .2rem .55rem;
}

.general-config__test-mail {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) auto;
  gap: .75rem;
  align-items: end;
  margin-top: 1rem;
  padding: .85rem;
  border: 1px solid #dbe5ee;
  border-radius: 8px;
  background: #f8fafc;
}

.general-config__preview h4 {
  color: #063f18;
  font-size: 1rem;
  font-weight: 800;
}

.general-config__preview pre {
  margin: 0;
  color: #495057;
  font-family: inherit;
  white-space: pre-wrap;
}

.general-config__preview-recipient {
  max-width: 280px;
  margin-right: auto;
}

@media (max-width: 992px) {
  .general-config__layout,
  .general-config__option,
  .general-config__mailing-toggle,
  .general-config__picker-controls,
  .general-config__selected-template,
  .general-config__test-mail,
  .general-config__tax-colors,
  .general-config__color-row {
    grid-template-columns: 1fr;
  }
}
</style>
