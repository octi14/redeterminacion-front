<template>
  <div class="page main-background boletas-page boletas-urbana-page">
    <div v-if="!puedeAdministrar" class="no-access">
      <div class="no-access-card">
        <i class="bi bi-shield-lock-fill"></i>
        <h1>Esta sección no está disponible</h1>
        <p>No tenés permisos para administrar el pago de tasa urbana.</p>
        <NuxtLink to="/" class="btn btn-success">Volver al inicio</NuxtLink>
      </div>
    </div>

    <main v-else class="container py-5">
      <section class="upload-hero">
        <div class="hero-copy">
          <span class="eyebrow">Administración interna</span>
          <h1 style="color: #ffffff">Pago de tasa urbana</h1>
          <p>
            Subí el archivo de Tasas Urbanas para cargar deuda urbana provisoria
            y controlá la visibilidad pública del pago con Provincia NET.
          </p>
        </div>  

        <div class="upload-card">
          <div
            class="drop-zone"
            :class="{ dragging: isDragging, selected: selectedFile }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
            @click="$refs.fileInput.click()"
          >
            <input
              ref="fileInput"
              type="file"
              accept=".xlsx"
              class="d-none"
              @change="onFileSelected"
            >
            <div class="upload-icon">
              <i :class="selectedFile ? 'bi bi-file-earmark-check-fill' : 'bi bi-cloud-arrow-up-fill'"></i>
            </div>
            <template v-if="selectedFile">
              <strong>{{ selectedFile.name }}</strong>
              <small>{{ formatFileSize(selectedFile.size) }}</small>
              <button class="btn btn-link btn-sm" type="button" @click.stop="clearFile">
                Elegir otro archivo
              </button>
            </template>
            <template v-else>
              <strong>Arrastrá el archivo aquí</strong>
              <span>o hacé clic para seleccionarlo</span>
              <small>Solamente archivos .xlsx de tasa urbana</small>
            </template>
          </div>

          <button
            class="btn btn-analyze btn-block"
            :disabled="!selectedFile || importing"
            style="width: 100%;"
            @click="startImport"
          >
            <b-spinner v-if="importing" small class="mr-2"></b-spinner>
            <i v-else class="bi bi-search mr-2"></i>
            {{ importing ? 'Importando...' : 'Subir e importar archivo' }}
          </button>

          <div class="storage-option">
            <b-form-checkbox
              v-model="pagoTasaUrbanaPublico"
              switch
              :disabled="configLoading"
              @update:model-value="updatePublicConfig"
            >
              Mostrar pago de tasa urbana
            </b-form-checkbox>
            <small>
              <b-spinner v-if="configLoading" small class="mr-1"></b-spinner>
              {{
                configLoading
                  ? 'Guardando configuración...'
                  : 'Controla el botón “Pagar tasa urbana” en /pagos y el acceso público al formulario.'
              }}
            </small>
          </div>
        </div>
      </section>

      <section v-if="lastImport" class="import-result-section">
        <div class="section-heading">
          <div>
            <span class="eyebrow">Última importación</span>
            <h2>Resultado de la carga</h2>
          </div>
        </div>
        <div class="summary-grid">
          <div>
            <span>Archivo</span>
            <strong>{{ lastImport.fileName || '-' }}</strong>
          </div>
          <div>
            <span>Entradas</span>
            <strong>{{ formatNumber(lastImport.cantidadEntradas) }}</strong>
          </div>
          <div>
            <span>Partidas</span>
            <strong>{{ formatNumber(lastImport.cantidadObjetos) }}</strong>
          </div>
          <div>
            <span>Importadas</span>
            <strong>{{ formatNumber(lastImport.cantidadImportadas) }}</strong>
          </div>
        </div>
        <p v-if="lastImport.periodos?.length" class="periods-line mb-0">
          Períodos: {{ lastImport.periodos.join(', ') }}
        </p>
        <div v-if="lastImport.observaciones?.length" class="issues-panel">
          <div class="issues-heading">
            <strong>Observaciones</strong>
            <span>{{ lastImport.observaciones.length }}</span>
          </div>
          <div class="issues-list">
            <div
              v-for="(issue, index) in lastImport.observaciones"
              :key="`${issue.fila}-${issue.columna}-${index}`"
              class="issue-row"
              :class="issue.tipo === 'error' ? 'error' : 'warning'"
            >
              <span class="issue-type">{{ issue.tipo === 'error' ? 'Error' : 'Adv.' }}</span>
              <span class="issue-row-number">Fila {{ issue.fila || '-' }}</span>
              <span>{{ issue.columna }}</span>
              <span>{{ issue.mensaje }}</span>
            </div>
          </div>
        </div>
      </section>

      <div class="page-btn-volver-wrap">
        <NuxtLink to="/">
          <b-button variant="primary" size="sm" class="page-btn-volver">Volver</b-button>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script>
import ProvinciaNetService from '~/service/provinciaNet.js'

export default {
  name: 'AdminBoletasUrbana',
  setup() {
    const { showToast } = useProjectToast()
    return { showToast }
  },
  data() {
    return {
      pagoTasaUrbanaPublico: false,
      configLoading: false,
      selectedFile: null,
      isDragging: false,
      importing: false,
      lastImport: null,
    }
  },
  computed: {
    puedeAdministrar() {
      return ['admin', 'master', 'true', 'boletas', 'hacienda'].includes(
        String(useUserStore().admin || '').trim().toLowerCase()
      )
    },
  },
  mounted() {
    this.loadConfig()
  },
  methods: {
    authHeaders() {
      const token = useUserStore().token
      return token ? { Authorization: `Bearer ${token}` } : {}
    },
    fileRequestHeaders() {
      return {
        ...this.authHeaders(),
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'X-File-Name': encodeURIComponent(this.selectedFile.name),
      }
    },
    formatFileSize(bytes) {
      if (!bytes) return '0 KB'
      return `${(bytes / 1024 / 1024).toFixed(2)} MB`
    },
    formatNumber(value) {
      return Number(value || 0).toLocaleString('es-AR')
    },
    onFileSelected(event) {
      const file = event.target.files?.[0]
      this.acceptFile(file)
    },
    onDrop(event) {
      this.isDragging = false
      const file = event.dataTransfer?.files?.[0]
      this.acceptFile(file)
    },
    acceptFile(file) {
      if (!file) return
      if (!file.name.toLowerCase().endsWith('.xlsx')) {
        this.showToast('Seleccioná un archivo con extensión .xlsx.', {
          title: 'Formato no permitido',
          variant: 'danger',
          solid: true,
        })
        return
      }
      this.selectedFile = file
    },
    clearFile() {
      this.selectedFile = null
      if (this.$refs.fileInput) this.$refs.fileInput.value = ''
    },
    async loadConfig() {
      if (!this.puedeAdministrar) return
      this.configLoading = true
      try {
        const response = await ProvinciaNetService.getConfiguracion(this.$axios, this.authHeaders())
        const data = response?.data || response
        this.pagoTasaUrbanaPublico = data?.habilitada === true
      } catch (_) {
        this.pagoTasaUrbanaPublico = false
      } finally {
        this.configLoading = false
      }
    },
    async updatePublicConfig(value) {
      const enabled = value === true
      this.configLoading = true
      try {
        const response = await ProvinciaNetService.updateConfiguracion(
          this.$axios,
          { pagoTasaUrbanaPublico: enabled },
          this.authHeaders()
        )
        const data = response?.data || response
        this.pagoTasaUrbanaPublico = data?.pagoTasaUrbanaPublico?.value === true
        this.showToast(
          this.pagoTasaUrbanaPublico
            ? 'El pago de tasa urbana quedó visible en /pagos.'
            : 'El pago de tasa urbana quedó oculto para el público.',
          { variant: 'success', solid: true }
        )
      } catch (error) {
        this.pagoTasaUrbanaPublico = !enabled
        this.showToast('No se pudo actualizar la visibilidad pública.', {
          variant: 'danger',
          solid: true,
        })
      } finally {
        this.configLoading = false
      }
    },
    async startImport() {
      if (!this.selectedFile || this.importing) return
      this.importing = true
      this.lastImport = null
      try {
        const response = await ProvinciaNetService.importarUrbana(
          this.$axios,
          this.selectedFile,
          this.fileRequestHeaders()
        )
        const data = response?.data || response
        this.lastImport = data
        this.clearFile()
        this.showToast(
          `Se importaron ${this.formatNumber(data.cantidadImportadas)} boletas urbanas.`,
          { title: 'Importación completada', variant: 'success', solid: true }
        )
      } catch (error) {
        const payload = error?.response?.data || error?.data || {}
        if (payload.data) {
          this.lastImport = {
            ...payload.data,
            cantidadImportadas: 0,
          }
        }
        this.showToast(
          payload.message || error.message || 'No se pudo importar el archivo.',
          { title: 'Error al importar', variant: 'danger', solid: true }
        )
      } finally {
        this.importing = false
      }
    },
  },
}
</script>

<style scoped>
.boletas-page { min-height: 100vh; padding-top: 58px; color: #173e32; }
.container { max-width: 1240px; }
.upload-hero { position: relative; overflow: hidden; display: grid; grid-template-columns: 1.12fr .88fr; gap: 3rem; align-items: center; padding: 3.5rem; border-radius: 28px; color: var(--color-white); background: radial-gradient(circle at 5% 0%, var(--white-veil-soft), transparent 38%), linear-gradient(135deg, #075e4a, #14835e); box-shadow: 0 24px 60px var(--mint-shadow-mid); }
.upload-hero::after { content: ""; position: absolute; width: 340px; height: 340px; right: -150px; bottom: -210px; border: 52px solid var(--white-veil-soft); border-radius: 50%; }
.hero-copy, .upload-card { position: relative; z-index: 1; }
.eyebrow { display: block; margin-bottom: .65rem; color: #20c997; font-size: .74rem; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; }
.hero-copy h1 { max-width: 590px; margin-bottom: 1rem; font-size: 2.6rem; font-weight: 800; line-height: 1.08; }
.hero-copy p { max-width: 620px; margin-bottom: 0; color: var(--white-veil-strong); font-size: 1.04rem; line-height: 1.65; }
.upload-card { padding: 1.25rem; border: 1px solid var(--white-veil-mid); border-radius: 22px; background: var(--white-veil-card); box-shadow: 0 20px 45px var(--shadow-hover); }
.drop-zone { min-height: 245px; padding: 2rem 1.2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2px dashed #e2ebe4; border-radius: 16px; color: #284c42; background: #f7fbf8; cursor: pointer; transition: .2s ease; text-align: center; }
.drop-zone:hover, .drop-zone.dragging { border-color: #14835e; background: #e3f6ee; transform: translateY(-2px); }
.drop-zone.selected { border-style: solid; }
.drop-zone strong { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.drop-zone span, .drop-zone small { margin-top: .25rem; color: #666666; }
.upload-icon { width: 68px; height: 68px; margin-bottom: 1rem; display: grid; place-items: center; border-radius: 20px; color: #0d7655; background: #e3f6ee; font-size: 2rem; }
.btn-analyze { border: none; color: #ffffff; background: linear-gradient(135deg, #14835e, #075e4a); font-weight: 700; margin-top: 1rem; padding: .85rem; border-radius: 12px; }
.btn-analyze:disabled { opacity: .48; }
.storage-option { margin-top: .9rem; padding: .8rem .9rem; border: 1px solid #e2ebe4; border-radius: 12px; color: #284c42; background: #f7fbf8; font-size: .82rem; }
.storage-option small { display: block; margin-top: .25rem; color: #666666; line-height: 1.35; }
.import-result-section { margin: 2.5rem 0 1rem; }
.section-heading { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.25rem; }
.section-heading .eyebrow { color: #14835e; }
.section-heading h2 { margin: 0 0 .35rem; font-weight: 800; }
.summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: .75rem; margin-bottom: 1rem; }
.summary-grid div { padding: .8rem; border: 1px solid #e2ebe4; border-radius: 12px; background: #f7fbf8; }
.summary-grid span, .summary-grid strong { display: block; }
.summary-grid span { color: #666666; font-size: .7rem; font-weight: 800; text-transform: uppercase; }
.summary-grid strong { margin-top: .25rem; color: #284c42; font-size: 1.05rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.periods-line { color: #666666; font-weight: 600; }
.issues-panel { overflow: hidden; margin-top: 1.2rem; border: 1px solid #e2ebe4; border-radius: 14px; text-align: left; background: #ffffff; }
.issues-heading { padding: .75rem 1rem; display: flex; justify-content: space-between; align-items: center; background: #f7fbf8; }
.issues-list { max-height: 245px; overflow-y: auto; }
.issue-row { display: grid; grid-template-columns: 88px 72px 125px 1fr; gap: .6rem; padding: .65rem 1rem; border-top: 1px solid #e2ebe4; font-size: .75rem; align-items: center; }
.issue-row.error { border-left: 4px solid #e53749; }
.issue-row.warning { border-left: 4px solid #cbc508; }
.issue-type { font-weight: 800; text-transform: uppercase; }
.issue-row.error .issue-type { color: #cc0025; }
.issue-row.warning .issue-type { color: #e27910; }
.issue-row-number { color: #666666; }
.no-access { min-height: calc(100vh - 58px); display: grid; place-items: center; padding: 2rem; }
.no-access-card { max-width: 520px; padding: 3rem; border-radius: 22px; background: #ffffff; box-shadow: 0 20px 50px var(--shadow-mid); text-align: center; }
.no-access-card i { color: #666666; font-size: 4rem; }
.no-access-card h1 { margin-top: 1rem; font-size: 1.8rem; font-weight: 800; }
@media (max-width: 900px) {
  .upload-hero { grid-template-columns: 1fr; padding: 2rem; }
  .hero-copy h1 { font-size: 2rem; }
  .summary-grid { grid-template-columns: repeat(2, 1fr); }
  .issue-row { grid-template-columns: 1fr; gap: .2rem; }
}
</style>
