<template>
  <div class="page main-background boletas-page">
    <div v-if="!puedeAdministrar" class="no-access">
      <div class="no-access-card">
        <i class="bi bi-shield-lock-fill"></i>
        <h1>Esta sección no está disponible</h1>
        <p>No tenés permisos para administrar cargas de boletas.</p>
        <NuxtLink to="/" class="btn btn-success">Volver al inicio</NuxtLink>
      </div>
    </div>

    <main v-else class="container py-5">
      <section class="upload-hero">
        <div class="hero-copy">
          <span class="eyebrow">Administración de boletas</span>
          <h1>Importar boletas de Automotores</h1>
          <p>
            Subí el archivo generado por Hacienda. Antes de publicarlo,
            verificaremos estructura, períodos, importes, vencimientos y códigos de pago.
          </p>
          <div class="hero-notes">
            <span><i class="bi bi-file-earmark-excel"></i> Formato XLSX</span>
            <span><i class="bi bi-shield-check"></i> Publicación con confirmación</span>
            <span><i class="bi bi-journal-check"></i> Reporte descargable</span>
          </div>
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
              <small>Solamente archivos .xlsx</small>
            </template>
          </div>

          <button
            class="btn btn-analyze btn-block"
            :disabled="!selectedFile"
            @click="startAnalysis"
          >
            <i class="bi bi-search mr-2"></i>
            Subir y analizar archivo
          </button>
          <div class="storage-option">
            <b-form-checkbox
              v-model="guardarOriginalHabilitado"
              switch
              :disabled="configLoading"
              @change="updateStorageConfig"
            >
              Almacenar archivo original al publicar
            </b-form-checkbox>
            <small>Desactivado por defecto para evitar consumo innecesario de espacio.</small>
          </div>
        </div>
      </section>

      <section class="history-section">
        <div class="section-heading">
          <div>
            <span class="eyebrow">Trazabilidad</span>
            <h2>Historial de cargas</h2>
            <p>Cargas analizadas y publicadas desde este panel.</p>
          </div>
          <div class="history-count">
            <strong>{{ history.length }}</strong>
            <span>cargas</span>
          </div>
        </div>

        <div class="history-card">
          <b-table
            :items="history"
            :fields="historyFields"
            responsive
            hover
            show-empty
            empty-text="Todavía no hay cargas registradas."
          >
            <template #cell(fileName)="data">
              <div class="file-cell">
                <i class="bi bi-file-earmark-excel-fill"></i>
                <div>
                  <strong>{{ data.item.fileName }}</strong>
                  <small>{{ data.item.fileSize }}</small>
                </div>
              </div>
            </template>
            <template #cell(uploadedAt)="data">
              {{ formatDateTime(data.item.uploadedAt) }}
            </template>
            <template #cell(entries)="data">
              {{ formatNumber(data.item.entries) }}
            </template>
            <template #cell(result)="data">
              <div class="result-cell">
                <span class="text-danger">{{ data.item.errors }} errores</span>
                <span class="text-warning">{{ data.item.warnings }} advertencias</span>
              </div>
            </template>
            <template #cell(status)="data">
              <span class="status-badge" :class="statusClass(data.item.status)">
                {{ statusLabel(data.item.status) }}
              </span>
            </template>
            <template #cell(actions)="data">
              <button
                v-if="data.item.errors || data.item.warnings"
                class="btn btn-outline-secondary btn-sm"
                title="Descargar reporte"
                @click="downloadStoredReport(data.item)"
              >
                <i class="bi bi-download"></i>
              </button>
            </template>
          </b-table>
        </div>
      </section>
    </main>

    <b-modal
      v-model="showAnalysisModal"
      size="lg"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
      :no-close-on-esc="analysisState === 'processing'"
      modal-class="analysis-modal"
    >
      <div v-if="analysisState === 'processing'" class="analysis-processing">
        <div class="loader-orbit">
          <div class="loader-core"><i class="bi bi-file-earmark-spreadsheet"></i></div>
        </div>
        <span class="eyebrow">Procesando archivo</span>
        <h3>{{ processingMessage }}</h3>
        <p>{{ selectedFile ? selectedFile.name : '' }}</p>
        <b-progress :value="analysisProgress" :max="100" height="8px"></b-progress>
        <div class="processing-steps">
          <span :class="{ active: analysisProgress >= 15 }">Subida</span>
          <span :class="{ active: analysisProgress >= 45 }">Estructura</span>
          <span :class="{ active: analysisProgress >= 75 }">Registros</span>
          <span :class="{ active: analysisProgress >= 100 }">Resultado</span>
        </div>
      </div>

      <div v-else-if="analysisResult" class="analysis-result">
        <div class="result-icon" :class="analysisResult.errorCount ? 'has-errors' : 'is-success'">
          <i :class="analysisResult.errorCount ? 'bi bi-x-lg' : 'bi bi-check-lg'"></i>
        </div>
        <span class="eyebrow">Análisis finalizado</span>
        <h3>{{ resultTitle }}</h3>
        <p class="result-description">{{ resultDescription }}</p>

        <div class="summary-grid">
          <div><span>Entradas</span><strong>{{ formatNumber(analysisResult.entries) }}</strong></div>
          <div><span>Dominios</span><strong>{{ formatNumber(analysisResult.domains) }}</strong></div>
          <div><span>Errores</span><strong class="text-danger">{{ analysisResult.errorCount }}</strong></div>
          <div><span>Advertencias</span><strong class="text-warning">{{ analysisResult.warningCount }}</strong></div>
        </div>

        <div v-if="analysisIssues.length" class="issues-panel">
          <div class="issues-heading">
            <strong>Detalle de observaciones</strong>
            <button class="btn btn-outline-secondary btn-sm" @click="downloadCurrentReport">
              <i class="bi bi-download mr-1"></i> Descargar .txt
            </button>
          </div>
          <div class="issues-list">
            <div
              v-for="(issue, index) in visibleIssues"
              :key="index"
              class="issue-row"
              :class="issue.type"
            >
              <span class="issue-type">{{ issue.type === 'error' ? 'Error' : 'Advertencia' }}</span>
              <span class="issue-row-number">Fila {{ issue.row || '-' }}</span>
              <strong>{{ issue.column }}</strong>
              <span>{{ issue.message }}</span>
            </div>
          </div>
          <small v-if="analysisIssues.length > visibleIssues.length" class="issues-more">
            Se muestran las primeras {{ visibleIssues.length }} observaciones. El reporte descargable incluye todas.
          </small>
        </div>

        <div class="result-actions">
          <button class="btn btn-outline-secondary" @click="closeAnalysis">Cerrar</button>
          <button
            v-if="!analysisResult.errorCount"
            class="btn btn-publish"
            @click="requestPublish"
          >
            <i class="bi bi-cloud-check mr-2"></i>
            Confirmar y publicar
          </button>
        </div>
      </div>
    </b-modal>

    <b-modal
      v-model="showPublishConfirmation"
      centered
      hide-header
      hide-footer
      modal-class="publish-modal"
    >
      <div class="publish-confirmation">
        <div class="confirm-icon"><i class="bi bi-cloud-arrow-up-fill"></i></div>
        <h3>¿Publicar esta carga?</h3>
        <p>
          Las {{ analysisResult ? formatNumber(analysisResult.entries) : 0 }} boletas validadas
          quedarán disponibles como la carga activa de Automotores.
        </p>
        <div v-if="overlappingPublishedPeriods.length" class="overwrite-warning">
          <div class="overwrite-warning-title">
            <i class="bi bi-exclamation-triangle-fill"></i>
            Esta carga reemplazará períodos publicados
          </div>
          <p>
            Ya existe información publicada para:
            <strong>{{ overlappingPublishedPeriods.join(', ') }}</strong>.
            Al continuar, las cargas anteriores de esos períodos dejarán de estar activas.
          </p>
          <label class="overwrite-check">
            <input v-model="overwriteConfirmed" type="checkbox">
            <span>Confirmo que deseo reemplazar la información publicada anteriormente.</span>
          </label>
        </div>
        <div class="confirm-actions">
          <button class="btn btn-outline-secondary" @click="showPublishConfirmation = false">Cancelar</button>
          <button
            class="btn btn-publish"
            :disabled="overlappingPublishedPeriods.length > 0 && !overwriteConfirmed"
            @click="publishCurrentImport"
          >
            {{ overlappingPublishedPeriods.length ? 'Reemplazar y publicar' : 'Sí, publicar' }}
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'AdminBoletas',
  middleware: ['authenticated'],
  data() {
    return {
      selectedFile: null,
      isDragging: false,
      showAnalysisModal: false,
      showPublishConfirmation: false,
      overwriteConfirmed: false,
      analysisState: 'processing',
      analysisProgress: 0,
      processingMessage: 'Subiendo el archivo...',
      analysisResult: null,
      guardarOriginalHabilitado: false,
      configLoading: false,
      serverConflictPeriods: [],
      history: [],
      historyFields: [
        { key: 'fileName', label: 'Nombre del archivo' },
        { key: 'uploadedAt', label: 'Fecha de subida' },
        { key: 'period', label: 'Año y período' },
        { key: 'entries', label: 'Entradas', class: 'text-right' },
        { key: 'result', label: 'Resultado' },
        { key: 'uploadedBy', label: 'Subido por' },
        { key: 'status', label: 'Estado' },
        { key: 'actions', label: '', class: 'text-right' }
      ]
    }
  },
  computed: {
    puedeAdministrar() {
      return this.$store.state.user.admin === 'master'
    },
    analysisIssues() {
      if (!this.analysisResult) return []
      return [...this.analysisResult.errors, ...this.analysisResult.warnings]
    },
    visibleIssues() {
      return this.analysisIssues.slice(0, 80)
    },
    resultTitle() {
      if (this.analysisResult.errorCount) return 'El archivo necesita correcciones'
      if (this.analysisResult.warningCount) return 'El archivo está listo, con advertencias'
      return 'El archivo está listo para publicar'
    },
    resultDescription() {
      if (this.analysisResult.errorCount) {
        return 'No se puede publicar hasta resolver los errores bloqueantes detallados a continuación.'
      }
      return 'La estructura y los registros fueron validados. Revisá el resultado antes de confirmar la publicación.'
    },
    currentPeriods() {
      return this.parsePeriods(this.analysisResult ? this.analysisResult.period : '')
    },
    overlappingPublishedPeriods() {
      const publishedPeriods = new Set(
        this.history
          .filter(item => ['published', 'partially-replaced'].includes(item.status))
          .flatMap(item => this.parsePeriods(item.activePeriod))
      )
      return Array.from(new Set([
        ...this.currentPeriods.filter(period => publishedPeriods.has(period)),
        ...this.serverConflictPeriods
      ]))
    }
  },
  mounted() {
    this.loadHistory()
    this.loadStorageConfig()
  },
  methods: {
    onFileSelected(event) {
      this.setFile(event.target.files && event.target.files[0])
    },
    onDrop(event) {
      this.isDragging = false
      this.setFile(event.dataTransfer.files && event.dataTransfer.files[0])
    },
    setFile(file) {
      if (!file) return
      if (!file.name.toLowerCase().endsWith('.xlsx')) {
        this.$bvToast.toast('Seleccioná un archivo con extensión .xlsx.', {
          title: 'Formato no permitido',
          variant: 'danger',
          solid: true
        })
        return
      }
      this.selectedFile = file
    },
    clearFile() {
      this.selectedFile = null
      if (this.$refs.fileInput) this.$refs.fileInput.value = ''
    },
    async startAnalysis() {
      if (!this.selectedFile) return
      this.analysisResult = null
      this.analysisState = 'processing'
      this.analysisProgress = 10
      this.processingMessage = 'Subiendo el archivo...'
      this.showAnalysisModal = true

      try {
        this.analysisProgress = 35
        this.processingMessage = 'Enviando el archivo al servidor...'
        const response = await this.$axios.post('/tasas/importaciones/analizar', this.selectedFile, {
          headers: this.fileRequestHeaders()
        })
        this.analysisProgress = 75
        this.processingMessage = 'Validando columnas y registros...'
        const result = this.mapAnalysis(response.data.data)
        this.analysisProgress = 88
        this.processingMessage = 'Preparando el reporte...'
        await this.pause(450)
        this.analysisResult = result
        this.analysisProgress = 100
        await this.pause(250)
        this.analysisState = 'finished'
        await this.loadHistory()
      } catch (error) {
        this.analysisResult = {
          entries: 0,
          domains: 0,
          period: '-',
          errorCount: 1,
          warningCount: 0,
          errors: [{
            type: 'error',
            row: null,
            column: 'Archivo',
            message: error.response?.data?.message || error.message || 'No se pudo leer el archivo.'
          }],
          warnings: []
        }
        this.analysisState = 'finished'
      }
    },
    requestPublish() {
      this.overwriteConfirmed = false
      this.serverConflictPeriods = []
      this.showPublishConfirmation = true
    },
    async publishCurrentImport() {
      if (this.overlappingPublishedPeriods.length && !this.overwriteConfirmed) return
      try {
        const response = await this.$axios.post(
          `/tasas/importaciones/${this.analysisResult.historyId}/publicar`,
          this.selectedFile,
          {
            headers: {
              ...this.fileRequestHeaders(),
              'X-Confirmar-Reemplazo': String(this.overwriteConfirmed),
              'X-Guardar-Original': String(this.guardarOriginalHabilitado)
            }
          }
        )
        await this.loadHistory()
        this.showPublishConfirmation = false
        this.showAnalysisModal = false
        this.clearFile()
        this.$bvToast.toast('La carga fue publicada correctamente.', {
          title: 'Publicación confirmada',
          variant: 'success',
          solid: true
        })
        if (response.data.data.archivoOriginalError) {
          this.$bvToast.toast('La publicación se completó, pero no se pudo almacenar el archivo original.', {
            title: 'Archivo original no almacenado',
            variant: 'warning',
            solid: true
          })
        }
      } catch (error) {
        if (error.response && error.response.status === 409 && error.response.data.conflictos) {
          this.serverConflictPeriods = error.response.data.conflictos
          this.overwriteConfirmed = false
          return
        }
        this.$bvToast.toast(error.response?.data?.message || 'No se pudo publicar la carga.', {
          title: 'Error al publicar',
          variant: 'danger',
          solid: true
        })
      }
    },
    closeAnalysis() {
      this.showAnalysisModal = false
    },
    buildReport() {
      if (!this.analysisResult) return ''
      const lines = [
        'REPORTE DE VALIDACIÓN DE BOLETAS DE AUTOMOTORES',
        `Archivo: ${this.selectedFile ? this.selectedFile.name : '-'}`,
        `Fecha: ${this.formatDateTime(new Date().toISOString())}`,
        `Entradas: ${this.analysisResult.entries}`,
        `Dominios: ${this.analysisResult.domains}`,
        `Períodos: ${this.analysisResult.period}`,
        `Errores: ${this.analysisResult.errorCount}`,
        `Advertencias: ${this.analysisResult.warningCount}`,
        this.analysisResult.truncatedErrors ? `Errores adicionales omitidos: ${this.analysisResult.truncatedErrors}` : '',
        this.analysisResult.truncatedWarnings ? `Advertencias adicionales omitidas: ${this.analysisResult.truncatedWarnings}` : '',
        '',
        'DETALLE',
        ...this.analysisIssues.map(issue =>
          `[${issue.type === 'error' ? 'ERROR' : 'ADVERTENCIA'}] Fila ${issue.row || '-'} | ${issue.column} | ${issue.message}`
        )
      ]
      return lines.join('\r\n')
    },
    downloadCurrentReport() {
      this.downloadText(this.buildReport(), `reporte-${this.selectedFile.name.replace(/\.xlsx$/i, '')}.txt`)
    },
    downloadText(content, fileName) {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.click()
      URL.revokeObjectURL(url)
    },
    async downloadStoredReport(item) {
      try {
        const response = await this.$axios.get(`/tasas/importaciones/${item.id}/reporte`, {
          headers: this.authHeaders(),
          responseType: 'text'
        })
        this.downloadText(response.data, `reporte-${item.fileName.replace(/\.xlsx$/i, '')}.txt`)
      } catch (error) {
        this.$bvToast.toast('No se pudo descargar el reporte.', { variant: 'danger', solid: true })
      }
    },
    async loadHistory() {
      if (!this.puedeAdministrar) return
      try {
        const response = await this.$axios.get('/tasas/importaciones', { headers: this.authHeaders() })
        this.history = response.data.data.map(this.mapHistoryItem)
      } catch (error) {
        this.history = []
      }
    },
    async loadStorageConfig() {
      if (!this.puedeAdministrar) return
      try {
        const response = await this.$axios.get('/tasas/importaciones/configuracion', { headers: this.authHeaders() })
        this.guardarOriginalHabilitado = response.data.data.guardarArchivoOriginalTasas
      } catch (_) {
        this.guardarOriginalHabilitado = false
      }
    },
    async updateStorageConfig(value) {
      this.configLoading = true
      try {
        await this.$axios.put(
          '/tasas/importaciones/configuracion',
          { guardarArchivoOriginalTasas: value },
          { headers: this.authHeaders() }
        )
      } catch (error) {
        this.guardarOriginalHabilitado = !value
        this.$bvToast.toast('No se pudo actualizar la configuración.', { variant: 'danger', solid: true })
      } finally {
        this.configLoading = false
      }
    },
    mapAnalysis(item) {
      const observations = item.observaciones || []
      return {
        historyId: item._id,
        entries: item.cantidadEntradas,
        domains: item.cantidadObjetos,
        period: (item.periodos || []).join(', ') || '-',
        activePeriod: (item.periodosActivos || []).join(', ') || '-',
        errorCount: item.cantidadErrores,
        warningCount: item.cantidadAdvertencias,
        errors: observations.filter(entry => entry.tipo === 'error').map(this.mapObservation),
        warnings: observations.filter(entry => entry.tipo === 'advertencia').map(this.mapObservation),
        truncatedErrors: item.observacionesOmitidas || 0,
        truncatedWarnings: 0
      }
    },
    mapObservation(item) {
      return {
        type: item.tipo === 'advertencia' ? 'warning' : 'error',
        row: item.fila,
        column: item.columna,
        message: item.mensaje
      }
    },
    mapHistoryItem(item) {
      const statusMap = {
        publicada: 'published',
        analizada: 'validated',
        rechazada: 'rejected',
        reemplazada: 'replaced',
        reemplazada_parcialmente: 'partially-replaced'
      }
      return {
        id: item._id,
        fileName: item.nombreArchivo,
        fileSize: this.formatFileSize(item.tamanoBytes),
        uploadedAt: item.createdAt,
        period: (item.periodos || []).join(', ') || '-',
        entries: item.cantidadEntradas,
        errors: item.cantidadErrores,
        warnings: item.cantidadAdvertencias,
        uploadedBy: item.subidoPor?.username || '-',
        status: statusMap[item.estado] || item.estado
      }
    },
    authHeaders() {
      return { Authorization: `Bearer ${this.$store.state.user.token}` }
    },
    fileRequestHeaders() {
      return {
        ...this.authHeaders(),
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'X-File-Name': encodeURIComponent(this.selectedFile.name)
      }
    },
    statusLabel(status) {
      return {
        published: 'Publicado',
        validated: 'Listo para publicar',
        rejected: 'Con errores',
        replaced: 'Reemplazado',
        'partially-replaced': 'Reemplazado parcialmente'
      }[status] || status
    },
    statusClass(status) {
      return `status-${status}`
    },
    formatNumber(value) {
      return Number(value || 0).toLocaleString('es-AR')
    },
    formatDateTime(value) {
      return new Date(value).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
    },
    formatFileSize(bytes) {
      if (!bytes) return '0 KB'
      return `${(bytes / 1024 / 1024).toFixed(2)} MB`
    },
    parsePeriods(value) {
      return String(value || '')
        .split(',')
        .map(period => period.trim())
        .filter(period => /^\d{2}\/\d{4}$/.test(period))
    },
    pause(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  },
  head() {
    return { title: 'Administrar boletas - Hacienda Villa Gesell' }
  }
}
</script>

<style scoped>
.boletas-page { min-height: 100vh; padding-top: 58px; color: #17332d; }
.container { max-width: 1240px; }
.upload-hero { position: relative; overflow: hidden; display: grid; grid-template-columns: 1.12fr .88fr; gap: 3rem; align-items: center; padding: 3.5rem; border-radius: 28px; color: white; background: radial-gradient(circle at 5% 0%, rgba(255,255,255,.18), transparent 38%), linear-gradient(135deg, #075e4a, #13875e); box-shadow: 0 24px 60px rgba(7, 94, 74, .24); }
.upload-hero::after { content: ""; position: absolute; width: 340px; height: 340px; right: -150px; bottom: -210px; border: 52px solid rgba(255,255,255,.08); border-radius: 50%; }
.hero-copy, .upload-card { position: relative; z-index: 1; }
.eyebrow { display: block; margin-bottom: .65rem; color: #77e0bd; font-size: .74rem; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; }
.hero-copy h1 { max-width: 590px; margin-bottom: 1rem; font-size: 2.6rem; font-weight: 800; line-height: 1.08; }
.hero-copy p { max-width: 620px; margin-bottom: 1.5rem; color: rgba(255,255,255,.8); font-size: 1.04rem; line-height: 1.65; }
.hero-notes { display: flex; flex-wrap: wrap; gap: .7rem; }
.hero-notes span { padding: .48rem .75rem; border: 1px solid rgba(255,255,255,.16); border-radius: 100px; background: rgba(255,255,255,.08); font-size: .78rem; }
.hero-notes i { margin-right: .35rem; }
.upload-card { padding: 1.25rem; border: 1px solid rgba(255,255,255,.28); border-radius: 22px; background: rgba(255,255,255,.96); box-shadow: 0 20px 45px rgba(0,0,0,.15); }
.drop-zone { min-height: 245px; padding: 2rem 1.2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2px dashed #b7d8cb; border-radius: 16px; color: #284c42; background: #f5fbf8; cursor: pointer; transition: .2s ease; text-align: center; }
.drop-zone:hover, .drop-zone.dragging { border-color: #14835e; background: #eaf8f1; transform: translateY(-2px); }
.drop-zone.selected { border-style: solid; }
.drop-zone strong { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.drop-zone span, .drop-zone small { margin-top: .25rem; color: #6b837b; }
.upload-icon { width: 68px; height: 68px; margin-bottom: 1rem; display: grid; place-items: center; border-radius: 20px; color: #0d7655; background: #dff4eb; font-size: 2rem; }
.btn-analyze, .btn-publish { border: none; color: white; background: linear-gradient(135deg, #13875e, #075e4a); font-weight: 700; }
.btn-analyze { margin-top: 1rem; padding: .85rem; border-radius: 12px; }
.btn-analyze:disabled { opacity: .48; }
.storage-option { margin-top: .9rem; padding: .8rem .9rem; border: 1px solid #dceae4; border-radius: 12px; color: #315c50; background: #f6faf8; font-size: .82rem; }
.storage-option small { display: block; margin-top: .25rem; color: #758a83; line-height: 1.35; }
.history-section { margin: 4rem 0 2rem; }
.section-heading { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.25rem; }
.section-heading .eyebrow { color: #13875e; }
.section-heading h2 { margin: 0 0 .35rem; font-weight: 800; }
.section-heading p { margin: 0; color: #6b7f78; }
.history-count { min-width: 95px; padding: .65rem 1rem; border-radius: 14px; color: #0b664b; background: #e5f5ee; text-align: center; }
.history-count strong, .history-count span { display: block; }
.history-count strong { font-size: 1.4rem; }
.history-count span { font-size: .72rem; font-weight: 700; text-transform: uppercase; }
.history-card { overflow: hidden; border: 1px solid #e3ece8; border-radius: 18px; background: white; box-shadow: 0 14px 40px rgba(34, 76, 63, .08); }
.file-cell { display: flex; align-items: center; gap: .65rem; min-width: 220px; }
.file-cell i { color: #16845f; font-size: 1.5rem; }
.file-cell strong, .file-cell small { display: block; }
.file-cell small { color: #82928c; }
.result-cell span { display: block; white-space: nowrap; font-size: .78rem; font-weight: 700; }
.status-badge { display: inline-block; padding: .35rem .65rem; border-radius: 100px; font-size: .73rem; font-weight: 800; white-space: nowrap; }
.status-published { color: #0d684b; background: #dcf5e9; }
.status-validated { color: #805d00; background: #fff3c4; }
.status-rejected { color: #9a3030; background: #ffe0e0; }
.status-replaced { color: #596b65; background: #e7ecea; }
.status-partially-replaced { color: #6d5b24; background: #f4edd2; }
.no-access { min-height: calc(100vh - 58px); display: grid; place-items: center; padding: 2rem; }
.no-access-card { max-width: 520px; padding: 3rem; border-radius: 22px; background: white; box-shadow: 0 20px 50px rgba(0,0,0,.12); text-align: center; }
.no-access-card i { color: #698079; font-size: 4rem; }
.no-access-card h1 { margin-top: 1rem; font-size: 1.8rem; font-weight: 800; }
</style>

<style>
.analysis-modal .modal-content, .publish-modal .modal-content { overflow: hidden; border: 0; border-radius: 24px; box-shadow: 0 30px 80px rgba(15, 50, 40, .25); }
.analysis-modal .modal-body, .publish-modal .modal-body { padding: 0; }
.analysis-processing, .analysis-result, .publish-confirmation { padding: 2.5rem; text-align: center; }
.loader-orbit { width: 110px; height: 110px; margin: 0 auto 1.5rem; display: grid; place-items: center; border: 3px solid #dcefe8; border-top-color: #13875e; border-radius: 50%; animation: orbit 1.2s linear infinite; }
.loader-core { width: 76px; height: 76px; display: grid; place-items: center; border-radius: 50%; color: #0b6b4e; background: #e3f6ee; font-size: 2.2rem; animation: counterOrbit 1.2s linear infinite; }
@keyframes orbit { to { transform: rotate(360deg); } }
@keyframes counterOrbit { to { transform: rotate(-360deg); } }
.analysis-processing .eyebrow, .analysis-result .eyebrow { color: #14835e; }
.analysis-processing h3, .analysis-result h3, .publish-confirmation h3 { color: #193d33; font-weight: 800; }
.analysis-processing p, .result-description, .publish-confirmation p { color: #71837d; }
.processing-steps { display: flex; justify-content: space-between; margin-top: .65rem; color: #a5b2ae; font-size: .7rem; font-weight: 800; text-transform: uppercase; }
.processing-steps .active { color: #13875e; }
.result-icon, .confirm-icon { width: 80px; height: 80px; margin: 0 auto 1.2rem; display: grid; place-items: center; border-radius: 50%; font-size: 2.2rem; }
.result-icon.is-success { color: #0c7654; background: #dcf5e9; }
.result-icon.has-errors { color: #a93636; background: #ffe3e3; }
.confirm-icon { color: #0d7655; background: #e1f6ed; }
.overwrite-warning { margin: 1.25rem 0 0; padding: 1rem; border: 1px solid #f1cb76; border-radius: 14px; color: #6f520d; background: #fff8e6; text-align: left; }
.overwrite-warning-title { display: flex; align-items: center; gap: .5rem; margin-bottom: .5rem; color: #7d5900; font-weight: 800; }
.overwrite-warning p { margin-bottom: .75rem; color: #735c25; font-size: .86rem; }
.overwrite-check { display: flex; align-items: flex-start; gap: .55rem; margin: 0; color: #604b18; font-size: .82rem; font-weight: 700; cursor: pointer; }
.overwrite-check input { margin-top: .18rem; }
.btn-publish:disabled { cursor: not-allowed; opacity: .45; }
.summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: .75rem; margin: 1.5rem 0; }
.summary-grid div { padding: .8rem; border: 1px solid #e4ece9; border-radius: 12px; background: #f8fbfa; }
.summary-grid span, .summary-grid strong { display: block; }
.summary-grid span { color: #7d8d88; font-size: .7rem; font-weight: 800; text-transform: uppercase; }
.summary-grid strong { margin-top: .25rem; color: #1d463a; font-size: 1.15rem; }
.issues-panel { overflow: hidden; margin-top: 1.2rem; border: 1px solid #e4e9e7; border-radius: 14px; text-align: left; }
.issues-heading { padding: .75rem 1rem; display: flex; justify-content: space-between; align-items: center; background: #f3f7f5; }
.issues-list { max-height: 245px; overflow-y: auto; }
.issue-row { display: grid; grid-template-columns: 88px 72px 125px 1fr; gap: .6rem; padding: .65rem 1rem; border-top: 1px solid #edf1ef; font-size: .75rem; align-items: center; }
.issue-row.error { border-left: 4px solid #dc5353; }
.issue-row.warning { border-left: 4px solid #e4ad32; }
.issue-type { font-weight: 800; text-transform: uppercase; }
.issue-row.error .issue-type { color: #b13c3c; }
.issue-row.warning .issue-type { color: #9a6c00; }
.issue-row-number { color: #74857f; }
.issues-more { display: block; padding: .7rem 1rem; color: #6f817b; background: #fafcfc; }
.result-actions, .confirm-actions { display: flex; justify-content: center; gap: .75rem; margin-top: 1.5rem; }
.result-actions .btn, .confirm-actions .btn { min-width: 145px; padding: .65rem 1rem; border-radius: 10px; font-weight: 700; }
@media (max-width: 900px) {
  .upload-hero { grid-template-columns: 1fr; padding: 2rem; }
  .hero-copy h1 { font-size: 2rem; }
  .summary-grid { grid-template-columns: repeat(2, 1fr); }
  .issue-row { grid-template-columns: 1fr; gap: .2rem; }
}
</style>
