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
          <span class="eyebrow">Administración interna de boletas</span>
          <h1>Pago de tasa urbana</h1>
          <p>
            Subí el archivo generado por Hacienda. Antes de publicarlo,
            verificaremos estructura, períodos, importes, vencimientos y códigos de pago.
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
              <strong>Seleccioná el archivo haciendo click o arrastralo hasta aquí</strong>
              <small>Solamente se aceptan archivos .xlsx</small>
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
                  : 'Controla el botón “Pagar tasas” en /pagos y el acceso público al formulario.'
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

    <b-modal
      v-model="importing"
      centered
      hide-header
      hide-footer
      no-header-close
      no-close-on-backdrop
      no-close-on-esc
      modal-class="boletas-dialog-modal"
    >
      <div class="boletas-dialog">
        <div class="boletas-dialog-bar boletas-dialog-bar--success boletas-dialog-bar--empty">
          <button type="button" class="btn-close btn-close-white" aria-label="Cerrar" disabled></button>
        </div>
        <div class="boletas-dialog-body">
          <b-spinner class="boletas-dialog-spinner" variant="success" label="Cargando"></b-spinner>
          <h3>Tu archivo se está cargando</h3>
          <p>Estamos guardando las boletas. Este proceso puede demorar unos minutos.</p>
          <button class="btn btn-dialog-cancel" type="button" disabled>Cancelar</button>
        </div>
      </div>
    </b-modal>

    <b-modal
      v-model="showImportResult"
      centered
      hide-header
      hide-footer
      no-header-close
      modal-class="boletas-dialog-modal"
    >
      <div v-if="lastImport" class="boletas-dialog">
        <div class="boletas-dialog-bar boletas-dialog-bar--success">
          <i class="bi bi-check-lg" aria-hidden="true"></i>
          <button
            type="button"
            class="btn-close btn-close-white"
            aria-label="Cerrar"
            @click="showImportResult = false"
          ></button>
        </div>
        <div class="boletas-dialog-body">
          <h3>El archivo está listo</h3>
          <p>La estructura y los registros fueron cargados.</p>
          <p v-if="lastImport.fileName" class="boletas-dialog-file">{{ lastImport.fileName }}</p>
          <div class="summary-grid">
            <div><strong>{{ formatNumber(lastImport.cantidadEntradas) }}</strong><span>Entradas</span></div>
            <div><strong>{{ formatNumber(lastImport.cantidadObjetos) }}</strong><span>Partidas</span></div>
            <div><strong>{{ formatNumber(lastImport.cantidadImportadas) }}</strong><span>Importadas</span></div>
            <div><strong>{{ lastImport.periodos?.length || 0 }}</strong><span>Períodos</span></div>
          </div>
          <div class="result-actions">
            <button class="btn btn-dialog-ok" type="button" @click="showImportResult = false">Cerrar</button>
          </div>
        </div>
      </div>
    </b-modal>
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
      showImportResult: false,
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
      this.showImportResult = false
      try {
        const response = await ProvinciaNetService.importarUrbana(
          this.$axios,
          this.selectedFile,
          this.fileRequestHeaders()
        )
        const data = response?.data || response
        this.lastImport = data
        this.clearFile()
        this.showImportResult = true
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
.boletas-page {
  min-height: 100vh;
  padding-top: 58px;
  color: #353535;
}
.container { max-width: 1240px; }
.upload-hero {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 2.5rem;
  align-items: center;
  padding: 3.1rem 3.25rem;
  border-radius: 24px;
  color: var(--color-white);
  background: #15571f;
  font-family: var(--font-inter);
  box-shadow: 0px 2px 5px 0px var(--shadow-card);
}
.hero-copy {
  font-family: var(--font-inter);
}
.hero-copy .eyebrow {
  display: inline-block;
  margin-bottom: 1.15rem;
  padding: 0.22rem 0.65rem;
  border-radius: 6px;
  background: var(--color-white);
  color: #0c681a;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
}
.hero-copy h1 {
  max-width: 520px;
  margin-bottom: 1.05rem;
  color: var(--color-white);
  font-family: var(--font-inter);
  font-size: 2.7rem;
  font-weight: 700;
  line-height: 1.12;
}
.hero-copy p {
  max-width: 540px;
  margin-bottom: 0;
  color: var(--color-white);
  font-family: var(--font-inter);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.55;
}
.upload-card {
  padding: 1.2rem;
  border-radius: 20px;
  background: var(--color-white);
}
.drop-zone {
  min-height: 196px;
  padding: 1.6rem 1.1rem 1.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1.5px dashed #dee2e6;
  border-radius: 16px;
  color: #0c681a;
  background: var(--color-white);
  cursor: pointer;
  text-align: center;
  font-family: var(--font-inter);
}
.drop-zone:hover,
.drop-zone.dragging {
  border-color: #19a02d;
  background: var(--green-fill);
}
.drop-zone.selected { border-style: solid; border-color: #0c681a; }
.drop-zone strong {
  max-width: 13.5rem;
  color: #0c681a;
  font-family: var(--font-montserrat);
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1.4;
}
.drop-zone small {
  margin-top: 0.35rem;
  color: #666;
  font-size: 0.68rem;
  font-weight: 400;
}
.upload-icon {
  width: 56px;
  height: 56px;
  margin-bottom: 0.9rem;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: #19a02d;
  background: var(--green-fill);
  font-size: 1.45rem;
}
.btn-analyze {
  width: 100%;
  margin-top: 0.85rem;
  padding: 0.7rem 1rem;
  border: 0;
  border-radius: 999px;
  color: var(--color-white);
  background: #19a02d;
  font-family: var(--font-inter);
  font-weight: 600;
}
.btn-analyze:hover { background: #0c681a; color: var(--color-white); }
.btn-analyze:disabled { opacity: 0.48; }
.storage-option {
  margin-top: 0.85rem;
  padding: 0.75rem 0.85rem;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  color: #353535;
  background: var(--gray-bs-100);
  font-size: 0.82rem;
}
.storage-option small {
  display: block;
  margin-top: 0.25rem;
  color: #666;
  line-height: 1.35;
}
.import-result-section { margin: 2.5rem 0 1rem; }
.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.25rem;
}
.section-heading .eyebrow {
  display: block;
  margin-bottom: 0.35rem;
  color: #0c681a;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.section-heading h2 { margin: 0 0 0.35rem; color: #353535; font-weight: 800; }
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.summary-grid div {
  padding: 0.8rem;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  background: var(--gray-bs-100);
}
.summary-grid span,
.summary-grid strong { display: block; }
.summary-grid span {
  color: #666;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}
.summary-grid strong {
  margin-top: 0.25rem;
  color: #0c681a;
  font-size: 1.05rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.periods-line { color: #666; font-weight: 600; }
.issues-panel {
  overflow: hidden;
  margin-top: 1.2rem;
  border: 1px solid #dee2e6;
  border-radius: 14px;
  text-align: left;
  background: var(--color-white);
}
.issues-heading {
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--gray-bs-100);
}
.issues-list { max-height: 245px; overflow-y: auto; }
.issue-row {
  display: grid;
  grid-template-columns: 88px 72px 125px 1fr;
  gap: 0.6rem;
  padding: 0.65rem 1rem;
  border-top: 1px solid #dee2e6;
  font-size: 0.75rem;
  align-items: center;
}
.issue-row.error { border-left: 4px solid #cc0025; }
.issue-row.warning { border-left: 4px solid #cbc508; }
.issue-type { font-weight: 800; text-transform: uppercase; }
.issue-row.error .issue-type { color: #cc0025; }
.issue-row.warning .issue-type { color: #E27910; }
.issue-row-number { color: #666; }
.no-access {
  min-height: calc(100vh - 58px);
  display: grid;
  place-items: center;
  padding: 2rem;
}
.no-access-card {
  max-width: 520px;
  padding: 3rem;
  border-radius: 22px;
  background: var(--color-white);
  box-shadow: 0 20px 50px var(--shadow-mid);
  text-align: center;
}
.no-access-card i { color: #666; font-size: 4rem; }
.no-access-card h1 { margin-top: 1rem; font-size: 1.8rem; font-weight: 800; }
@media (max-width: 900px) {
  .upload-hero { grid-template-columns: 1fr; padding: 2rem; }
  .hero-copy h1 { font-size: 2rem; }
  .summary-grid { grid-template-columns: repeat(2, 1fr); }
  .issue-row { grid-template-columns: 1fr; gap: 0.2rem; }
}
</style>

<style>
.boletas-dialog-modal .modal-content {
  overflow: hidden;
  border: 0;
  border-radius: 16px;
  box-shadow: 0px 2px 5px 0px var(--shadow-card);
}
.boletas-dialog-modal .modal-header,
.boletas-dialog-modal .modal-content > .btn-close {
  display: none;
}
.boletas-dialog-modal .modal-body { padding: 0; }
.boletas-dialog-bar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  min-height: 3.15rem;
  padding: 0.45rem 0.85rem;
  color: var(--color-white);
}
.boletas-dialog-bar i {
  grid-column: 2;
  font-size: 1.45rem;
  line-height: 1;
}
.boletas-dialog-bar .btn-close {
  grid-column: 3;
  justify-self: end;
}
.boletas-dialog-bar--empty {
  grid-template-columns: 1fr auto;
}
.boletas-dialog-bar--empty .btn-close {
  grid-column: 2;
}
.boletas-dialog-bar--success { background: #19a02d; }
.boletas-dialog-body {
  padding: 1.75rem 1.6rem 1.7rem;
  text-align: center;
  font-family: var(--font-inter);
}
.boletas-dialog-spinner {
  width: 2.75rem;
  height: 2.75rem;
  margin: 0.35rem auto 1.15rem;
}
.boletas-dialog-body h3 {
  margin: 0 auto 0.7rem;
  max-width: 22rem;
  color: #0c681a;
  font-family: var(--font-montserrat);
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.25;
}
.boletas-dialog-body p {
  margin-bottom: 0.85rem;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.45;
}
.boletas-dialog-file {
  margin: 0 0 0.85rem;
  color: #0c681a;
  font-size: 0.82rem;
  font-weight: 600;
}
.boletas-dialog-body .summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin: 1.15rem 0 1.35rem;
  padding-top: 0.85rem;
  border-top: 1px solid #dee2e6;
}
.boletas-dialog-body .summary-grid span,
.boletas-dialog-body .summary-grid strong { display: block; }
.boletas-dialog-body .summary-grid span {
  margin-top: 0.15rem;
  color: #666;
  font-size: 0.72rem;
  font-weight: 500;
}
.boletas-dialog-body .summary-grid strong {
  color: #0c681a;
  font-size: 1.05rem;
  font-weight: 700;
}
.btn-dialog-cancel,
.btn-dialog-ok {
  min-width: 9.5rem;
  padding: 0.55rem 1.15rem;
  border-radius: 0;
  font-family: var(--font-inter);
  font-weight: 600;
}
.btn-dialog-cancel {
  border: 1px solid #cc0025;
  color: #cc0025;
  background: var(--color-white);
}
.btn-dialog-ok {
  border: 0;
  color: var(--color-white);
  background: #19a02d;
}
</style>

