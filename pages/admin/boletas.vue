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
          <span class="eyebrow">Administración interna de boletas</span>
          <h1 style="color: var(--color-white)">Importar boletas de Automotores</h1>
          <p>
            Subí el archivo generado por Hacienda. Antes de publicarlo,
            verificaremos estructura, períodos, importes, vencimientos y códigos de pago.
          </p>
          <!--
          <div class="hero-notes">
            <span><i class="bi bi-file-earmark-excel"></i> Formato XLSX</span>
            <span><i class="bi bi-shield-check"></i> Publicación con confirmación</span>
            <span><i class="bi bi-journal-check"></i> Reporte descargable</span>
          </div>
          -->
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
            style="width: 100%;"
          >
            <i class="bi bi-search mr-2"></i>
            Subir y analizar archivo
          </button>
          <div v-if="puedeGestionarBoletasCompleto" class="storage-option">
            <b-form-checkbox
              v-model="tasaAutomotorPublicaHabilitada"
              switch
              :disabled="configLoading"
              @update:model-value="updateAutomotorPublicConfig"
            >
              Mostrar descarga pública de tasa automotor
            </b-form-checkbox>
            <small>
              <b-spinner v-if="configLoading" small class="mr-1"></b-spinner>
              {{ configLoading ? 'Guardando configuración...' : 'Controla el botón en Tasas y el acceso público a la página de descarga.' }}
            </small>
          </div>
        </div>
      </section>

      <section class="period-management-section">
        <div class="section-heading">
          <div>
            <!--<span class="eyebrow">Disponibilidad pública</span>-->
            <h2>Períodos cargados</h2>
          </div>
          <div class="period-toolbar">
            <b-form-select v-model="periodStatusFilter" size="sm">
              <option value="all">Todos los estados</option>
              <option value="enabled">Solo habilitados</option>
              <option value="disabled">Solo deshabilitados</option>
            </b-form-select>
            <button class="btn btn-outline-success btn-sm" :disabled="periodsLoading" @click="loadPeriods" style="width: 100%;">
              <b-spinner v-if="periodsLoading" small></b-spinner>
              <i v-else class="bi bi-arrow-clockwise"></i>
              Actualizar
            </button>
          </div>
        </div>

        <div v-if="periodsLoading && !loadedPeriods.length" class="periods-empty">
          <b-spinner variant="success"></b-spinner>
          <span>Cargando períodos...</span>
        </div>
        <div v-else-if="!periodYears.length" class="periods-empty">
          <i class="bi bi-calendar2-x"></i>
          <span>No hay períodos publicados que coincidan con el filtro.</span>
        </div>
        <details
          v-for="year in paginatedPeriodYears"
          v-else
          :key="year.year"
          class="year-archive"
          :open="year.year === newestPeriodYear"
        >
          <summary>
            <div>
              <strong>{{ year.year }}</strong>
              <span>{{ year.periods.length }} períodos · {{ year.enabledCount }} habilitados</span>
            </div>
            <i class="bi bi-chevron-down"></i>
          </summary>
          <div class="year-periods">
            <article v-for="period in year.periods" :key="period.periodo" class="loaded-period-card">
              <header>
                <div>
                  <span>Cuota {{ String(period.cuota).padStart(2, '0') }}</span>
                  <h3>{{ period.periodo }}</h3>
                </div>
                <span class="period-state" :class="periodStateClass(period)">
                  {{ periodStateLabel(period) }}
                </span>
              </header>
              <div
                class="period-versions"
                :class="{ 'has-overflow': period.versions.length > 3 }"
              >
                <div
                  v-for="version in period.versions"
                  :key="`${version.importacionId}-${version.periodo}`"
                  class="period-version"
                  :class="{ active: version.habilitado }"
                >
                  <div class="version-file">
                    <i class="bi bi-file-earmark-spreadsheet"></i>
                    <div>
                      <strong>{{ version.nombreArchivo }}</strong>
                      <small>{{ formatNumber(version.cantidadEntradas) }} entradas · {{ formatDateTime(version.publicadoAt) }}</small>
                    </div>
                  </div>
                  <span class="version-state" :class="periodVersionStateClass(version)">
                    {{ periodVersionStateLabel(version) }}
                  </span>
                </div>
              </div>
              <footer v-if="period.versions.length > 3" class="versions-overflow-note">
                <i class="bi bi-mouse"></i>
                Desplazá para ver las {{ period.versions.length }} cargas
              </footer>
            </article>
          </div>
        </details>
        <div v-if="periodYearPages > 1" class="year-pagination">
          <span>
            Mostrando años {{ firstVisibleYear }} a {{ lastVisibleYear }}
          </span>
          <b-pagination
            v-model="periodYearPage"
            :total-rows="periodYears.length"
            :per-page="periodYearsPerPage"
            size="sm"
            align="right"
            class="mb-0"
          ></b-pagination>
        </div>
      </section>

      <section class="history-section">
        <div class="section-heading">
          <div>
            <!-- <span class="eyebrow">Trazabilidad</span> -->
            <h2>Historial de cargas</h2>
            <p>Cargas analizadas y publicadas desde este panel.</p>
          </div>
          <div class="history-count">
            <strong>{{ filteredHistory.length }}</strong>
            <span>cargas</span>
          </div>
        </div>

        <div class="history-card">
          <div class="history-toolbar">
            <div class="history-search">
              <i class="bi bi-search"></i>
              <input
                v-model.trim="historySearch"
                type="search"
                placeholder="Buscar por archivo o usuario..."
              >
            </div>
            <b-form-select v-model="historyStatusFilter" size="sm">
              <option value="all">Todos los estados</option>
              <option value="published">Publicado</option>
              <option value="validated">Listo para publicar</option>
              <option value="rejected">Con errores</option>
              <option value="replaced">Reemplazado</option>
              <option value="partially-replaced">Reemplazado parcialmente</option>
              <option value="disabled">Deshabilitado</option>
            </b-form-select>
            <b-form-select v-model="historySortBy" size="sm">
              <option value="uploadedAt">Fecha de subida</option>
              <option value="periodSort">Año y período</option>
              <option value="entries">Entradas</option>
            </b-form-select>
            <button
              class="btn btn-outline-success btn-sm history-sort-direction"
              :title="historySortDesc ? 'Orden descendente' : 'Orden ascendente'"
              @click="historySortDesc = !historySortDesc"
            >
              <i :class="historySortDesc ? 'bi bi-sort-down' : 'bi bi-sort-up'"></i>
              {{ historySortDesc ? 'Descendente' : 'Ascendente' }}
            </button>
          </div>
          <b-table
            :items="paginatedHistory"
            :fields="historyFields"
            :busy="historyLoading"
            responsive
            hover
            show-empty
            empty-text="Todavía no hay cargas registradas."
          >
            <template #table-busy>
              <div class="history-loading">
                <b-spinner small variant="success"></b-spinner>
                <span>Cargando historial...</span>
              </div>
            </template>
            <template #cell(fileName)="data">
              <div class="file-cell" :title="data.item.fileName">
                <i class="bi bi-file-earmark-excel-fill"></i>
                <div>
                  <strong>{{ data.item.fileName }}</strong>
                  <small>{{ data.item.fileSize }}</small>
                </div>
              </div>
            </template>
            <template #cell(uploadedAt)="data">
              <span class="cell-compact">{{ formatDateTime(data.item.uploadedAt) }}</span>
            </template>
            <template #cell(period)="data">
              <span class="period-cell" :title="data.item.period">{{ data.item.period }}</span>
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
            <template #cell(uploadedBy)="data">
              <span class="text-cell" :title="data.item.uploadedBy">{{ data.item.uploadedBy }}</span>
            </template>
            <template #cell(actions)="data">
              <div class="history-actions">
                <button
                  v-if="data.item.errors || data.item.warnings"
                  class="btn btn-outline-primary btn-sm"
                  title="Ver y descargar reporte"
                  :disabled="reportDownloadingId === data.item.id || originalDownloadingId === data.item.id || disablingImport"
                  @click="downloadStoredReport(data.item)"
                >
                  <b-spinner v-if="reportDownloadingId === data.item.id" small></b-spinner>
                  <i v-else class="bi bi-download"></i>
                </button>
                <button
                  v-if="puedeGestionarBoletasCompleto && data.item.status !== 'disabled'"
                  class="btn btn-outline-danger btn-sm"
                  title="Deshabilitar carga"
                  :disabled="disablingImport || originalDownloadingId === data.item.id"
                  @click="requestDisableImport(data.item)"
                >
                  <i class="bi bi-trash"></i>
                </button>
                <button
                  v-if="puedeGestionarBoletasCompleto && data.item.originalAvailable"
                  class="btn btn-outline-success btn-sm"
                  title="Descargar archivo original"
                  :disabled="originalDownloadingId === data.item.id || disablingImport"
                  @click="downloadOriginalFile(data.item)"
                >
                  <b-spinner v-if="originalDownloadingId === data.item.id" small></b-spinner>
                  <i v-else class="bi bi-file-earmark-excel-fill"></i>
                </button>
              </div>
            </template>
          </b-table>
          <div v-if="historyPages > 1" class="history-pagination">
            <span>
              Mostrando {{ historyFirstRow }}-{{ historyLastRow }} de {{ filteredHistory.length }} cargas
            </span>
            <b-pagination
              v-model="historyPage"
              :total-rows="filteredHistory.length"
              :per-page="historyPerPage"
              size="sm"
              align="right"
              class="mb-0"
            ></b-pagination>
          </div>
        </div>
      </section>
    </main>

    <transition name="server-activity">
      <div v-if="backgroundOperationMessage" class="server-activity" role="status" aria-live="polite">
        <b-spinner small></b-spinner>
        <span>{{ backgroundOperationMessage }}</span>
      </div>
    </transition>

    <b-modal
      v-model="showDisableImportConfirmation"
      centered
      hide-header
      hide-footer
      :no-close-on-backdrop="disablingImport"
      :no-close-on-esc="disablingImport"
      modal-class="publish-modal"
    >
      <div v-if="pendingDisableImport" class="publish-confirmation">
        <div class="confirm-icon disable-icon">
          <b-spinner v-if="disablingImport" label="Deshabilitando"></b-spinner>
          <i v-else class="bi bi-trash-fill"></i>
        </div>
        <h3>{{ disablingImport ? 'Deshabilitando carga...' : '¿Deshabilitar esta carga?' }}</h3>
        <p v-if="disablingImport">Estamos quitando sus boletas de la consulta pública.</p>
        <template v-else>
          <p>
            La carga <strong>{{ pendingDisableImport.fileName }}</strong> permanecerá en el historial,
            pero no podrá volver a habilitarse desde esta acción.
          </p>
          <div v-if="pendingDisableImport.activePeriodCount" class="overwrite-warning">
            <div class="overwrite-warning-title">
              <i class="bi bi-exclamation-triangle-fill"></i>
              Afectará la consulta pública
            </div>
            <p>
              Se deshabilitarán las boletas de
              <strong>{{ pendingDisableImport.activePeriodCount }} períodos activos</strong>.
            </p>
          </div>
        </template>
        <div class="confirm-actions">
          <button class="btn btn-outline-secondary" :disabled="disablingImport" @click="showDisableImportConfirmation = false">
            Cancelar
          </button>
          <button class="btn btn-danger" :disabled="disablingImport" @click="disableImport">
            <b-spinner v-if="disablingImport" small class="mr-2"></b-spinner>
            {{ disablingImport ? 'Deshabilitando...' : 'Sí, deshabilitar' }}
          </button>
        </div>
        <div v-if="isPublishing" class="publication-progress">
          <b-progress :value="publicationProgress.percentage" animated height="8px"></b-progress>
          <small>
            {{ formatNumber(publicationProgress.processed) }} de
            {{ formatNumber(publicationProgress.total || (analysisResult ? analysisResult.entries : 0)) }} boletas procesadas
          </small>
        </div>
      </div>
    </b-modal>

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
        <div v-if="analysisResult.fileName && selectedFile && analysisResult.fileName !== selectedFile.name" class="renamed-file-notice">
          <i class="bi bi-files"></i>
          Ya existía un archivo con ese nombre. Esta carga se guardó como
          <strong>{{ analysisResult.fileName }}</strong>.
        </div>

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
      :no-close-on-backdrop="isPublishing"
      :no-close-on-esc="isPublishing"
      modal-class="publish-modal"
    >
      <div class="publish-confirmation" :class="{ 'is-publishing': isPublishing }">
        <div class="confirm-icon">
          <b-spinner v-if="isPublishing" label="Publicando"></b-spinner>
          <i v-else class="bi bi-cloud-arrow-up-fill"></i>
        </div>
        <h3>{{ isPublishing ? 'Publicando la carga...' : '¿Publicar esta carga?' }}</h3>
        <p v-if="isPublishing">
          Estamos guardando las boletas y actualizando los períodos activos.
          Este proceso puede demorar unos minutos.
        </p>
        <p v-else>
          Las {{ analysisResult ? formatNumber(analysisResult.entries) : 0 }} boletas validadas
          quedarán disponibles como la única carga activa de Automotores.
        </p>
        <div v-if="publishedPeriodsAffectedByPublication.length && !isPublishing" class="overwrite-warning">
          <div class="overwrite-warning-title">
            <i class="bi bi-exclamation-triangle-fill"></i>
            Esta carga deshabilitará períodos publicados
          </div>
          <p>
            Al continuar, todos los períodos previamente activos de Automotores se deshabilitarán:
            <strong>{{ publishedPeriodsAffectedByPublication.join(', ') }}</strong>.
            Solo quedarán habilitados los períodos del archivo nuevo:
            <strong>{{ currentPeriods.join(', ') || '-' }}</strong>.
          </p>
          <label class="overwrite-check">
            <input v-model="overwriteConfirmed" type="checkbox">
            <span>Confirmo que deseo deshabilitar las cargas anteriores y dejar activos solamente los períodos de este archivo.</span>
          </label>
        </div>
        <div v-if="futurePeriods.length && !isPublishing" class="overwrite-warning future-warning">
          <div class="overwrite-warning-title">
            <i class="bi bi-calendar2-exclamation"></i>
            Esta carga contiene períodos futuros
          </div>
          <p>
            Los siguientes períodos pertenecen a años posteriores a {{ currentYear }}:
            <strong>{{ futurePeriods.join(', ') }}</strong>.
            Revisá que la información sea correcta antes de publicar.
          </p>
          <label class="overwrite-check">
            <input v-model="futurePeriodsConfirmed" type="checkbox">
            <span>Confirmo que deseo publicar períodos posteriores al año actual.</span>
          </label>
        </div>
        <div class="confirm-actions">
          <button
            class="btn btn-outline-secondary"
            :disabled="isPublishing"
            @click="showPublishConfirmation = false"
          >
            Cancelar
          </button>
          <button
            class="btn btn-publish"
            :disabled="isPublishing || (publishedPeriodsAffectedByPublication.length > 0 && !overwriteConfirmed) || (futurePeriods.length > 0 && !futurePeriodsConfirmed)"
            @click="publishCurrentImport"
          >
            <b-spinner v-if="isPublishing" small class="mr-2"></b-spinner>
            <template v-if="isPublishing">Publicando...</template>
            <template v-else>
              {{ publishedPeriodsAffectedByPublication.length ? 'Deshabilitar anteriores y publicar' : 'Sí, publicar' }}
            </template>
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['authenticated', 'require-admin'],
  adminRoles: ['admin', 'master', 'boletas'],
})

useHead({ title: 'Administrar boletas - Hacienda Villa Gesell' })
</script>

<script>
export default {
  name: 'AdminBoletas',
  data() {
    return {
      selectedFile: null,
      isDragging: false,
      showAnalysisModal: false,
      showPublishConfirmation: false,
      isPublishing: false,
      publicationProgress: {
        message: '',
        percentage: 0,
        processed: 0,
        total: 0
      },
      overwriteConfirmed: false,
      futurePeriodsConfirmed: false,
      analysisState: 'processing',
      analysisProgress: 0,
      processingMessage: 'Subiendo el archivo...',
      analysisResult: null,
      guardarOriginalHabilitado: false,
      tasaAutomotorPublicaHabilitada: true,
      configLoading: false,
      serverConflictPeriods: [],
      loadedPeriods: [],
      periodsLoading: false,
      periodStatusFilter: 'all',
      periodYearPage: 1,
      periodYearsPerPage: 5,
      history: [],
      historyLoading: false,
      reportDownloadingId: null,
      originalDownloadingId: null,
      showDisableImportConfirmation: false,
      pendingDisableImport: null,
      disablingImport: false,
      historySearch: '',
      historyStatusFilter: 'all',
      historySortBy: 'uploadedAt',
      historySortDesc: true,
      historyPage: 1,
      historyPerPage: 10,
      historyFields: [
        { key: 'fileName', label: 'Nombre del archivo', thStyle: { minWidth: '225px' } },
        { key: 'uploadedAt', label: 'Fecha de subida', thStyle: { width: '110px' } },
        { key: 'period', label: 'Año y período', thStyle: { width: '155px' } },
        { key: 'entries', label: 'Entradas', class: 'text-right', thStyle: { width: '85px' } },
        { key: 'result', label: 'Resultado', thStyle: { width: '110px' } },
        { key: 'uploadedBy', label: 'Subido por', thStyle: { minWidth: '170px' } },
        { key: 'status', label: 'Estado', thStyle: { width: '160px' } },
        { key: 'actions', label: '', class: 'text-right', thStyle: { width: '130px' } }
      ]
    }
  },
  computed: {
    puedeAdministrar() {
      return ['admin', 'master', 'true', 'boletas'].includes(String(useUserStore().admin || '').trim().toLowerCase())
    },
    puedeGestionarBoletasCompleto() {
      return ['admin', 'master', 'true'].includes(String(useUserStore().admin || '').trim().toLowerCase())
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
    currentYear() {
      return new Date().getFullYear()
    },
    futurePeriods() {
      return this.currentPeriods.filter(period => Number(period.split('/')[1]) > this.currentYear)
    },
    activePublishedPeriods() {
      const publishedPeriods = new Set(
        this.history
          .filter(item => ['published', 'partially-replaced'].includes(item.status))
          .flatMap(item => this.parsePeriods(item.activePeriod))
      )
      return Array.from(publishedPeriods).sort((left, right) => {
        const [leftMonth, leftYear] = left.split('/').map(Number)
        const [rightMonth, rightYear] = right.split('/').map(Number)
        return (leftYear * 100 + leftMonth) - (rightYear * 100 + rightMonth)
      })
    },
    publishedPeriodsAffectedByPublication() {
      return Array.from(new Set([
        ...this.activePublishedPeriods,
        ...this.serverConflictPeriods
      ]))
    },
    periodYears() {
      const grouped = {}
      this.loadedPeriods.forEach(item => {
        if (this.periodStatusFilter === 'enabled' && !item.habilitado) return
        if (this.periodStatusFilter === 'disabled' && item.habilitado) return
        if (!grouped[item.anio]) grouped[item.anio] = {}
        if (!grouped[item.anio][item.periodo]) {
          grouped[item.anio][item.periodo] = {
            periodo: item.periodo,
            cuota: item.cuota,
            habilitado: false,
            habilitadas: 0,
            deshabilitadas: 0,
            versions: []
          }
        }
        grouped[item.anio][item.periodo].versions.push(item)
        if (item.habilitado) {
          grouped[item.anio][item.periodo].habilitadas += 1
        } else {
          grouped[item.anio][item.periodo].deshabilitadas += 1
        }
        grouped[item.anio][item.periodo].habilitado = grouped[item.anio][item.periodo].habilitadas > 0
      })
      return Object.keys(grouped)
        .map(Number)
        .sort((a, b) => b - a)
        .map(year => {
          const periods = Object.values(grouped[year]).sort((a, b) => a.cuota - b.cuota)
          return { year, periods, enabledCount: periods.filter(item => item.habilitado).length }
        })
    },
    newestPeriodYear() {
      return this.periodYears.length ? this.periodYears[0].year : null
    },
    paginatedPeriodYears() {
      const start = (this.periodYearPage - 1) * this.periodYearsPerPage
      return this.periodYears.slice(start, start + this.periodYearsPerPage)
    },
    periodYearPages() {
      return Math.ceil(this.periodYears.length / this.periodYearsPerPage)
    },
    firstVisibleYear() {
      return this.paginatedPeriodYears.length ? this.paginatedPeriodYears[0].year : '-'
    },
    lastVisibleYear() {
      return this.paginatedPeriodYears.length
        ? this.paginatedPeriodYears[this.paginatedPeriodYears.length - 1].year
        : '-'
    },
    filteredHistory() {
      const search = this.historySearch.toLocaleLowerCase('es')
      return this.history
        .filter(item => {
          const matchesSearch = !search ||
            item.fileName.toLocaleLowerCase('es').includes(search) ||
            item.uploadedBy.toLocaleLowerCase('es').includes(search)
          const matchesStatus = this.historyStatusFilter === 'all' || item.status === this.historyStatusFilter
          return matchesSearch && matchesStatus
        })
        .sort((left, right) => {
          let comparison
          if (this.historySortBy === 'entries') {
            comparison = left.entries - right.entries
          } else {
            comparison = left[this.historySortBy] - right[this.historySortBy]
          }
          if (comparison === 0) comparison = left.uploadedAtSort - right.uploadedAtSort
          return this.historySortDesc ? -comparison : comparison
        })
    },
    paginatedHistory() {
      const start = (this.historyPage - 1) * this.historyPerPage
      return this.filteredHistory.slice(start, start + this.historyPerPage)
    },
    historyPages() {
      return Math.ceil(this.filteredHistory.length / this.historyPerPage)
    },
    historyFirstRow() {
      return this.filteredHistory.length ? ((this.historyPage - 1) * this.historyPerPage) + 1 : 0
    },
    historyLastRow() {
      return Math.min(this.historyPage * this.historyPerPage, this.filteredHistory.length)
    },
    backgroundOperationMessage() {
      if (this.disablingImport) return 'Deshabilitando carga...'
      if (this.originalDownloadingId) return 'Descargando archivo original...'
      if (this.reportDownloadingId) return 'Preparando el reporte para descargar...'
      if (this.configLoading) return 'Guardando la configuración...'
      if (this.periodsLoading && this.loadedPeriods.length) return 'Actualizando períodos...'
      if (this.historyLoading && this.history.length) return 'Actualizando historial...'
      return ''
    }
  },
  watch: {
    periodStatusFilter() {
      this.periodYearPage = 1
    },
    periodYearPages(value) {
      if (value && this.periodYearPage > value) this.periodYearPage = value
    },
    historySearch() {
      this.historyPage = 1
    },
    historyStatusFilter() {
      this.historyPage = 1
    },
    historySortBy() {
      this.historyPage = 1
    },
    historySortDesc() {
      this.historyPage = 1
    },
    historyPages(value) {
      if (value && this.historyPage > value) this.historyPage = value
    }
  },
  mounted() {
    this.loadHistory()
    this.loadStorageConfig()
    this.loadPeriods()
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
        this.showToast('Seleccioná un archivo con extensión .xlsx.', {
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
        const completedImport = await this.waitForAnalysis(response.data.data._id)
        const result = this.mapAnalysis(completedImport)
        this.analysisProgress = 95
        this.processingMessage = 'Preparando el reporte...'
        this.analysisResult = result
        if (result.fileName && result.fileName !== this.selectedFile.name) {
          this.showToast(`La carga se guardó como ${result.fileName}.`, {
            title: 'Nombre de archivo actualizado',
            variant: 'info',
            solid: true,
            autoHideDelay: 7000
          })
        }
        this.analysisProgress = 100
        await this.pause(250)
        this.analysisState = 'finished'
        await Promise.all([this.loadHistory(), this.loadPeriods()])
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
    async waitForAnalysis(importacionId) {
      while (true) {
        await this.pause(1600)
        const progressResponse = await this.$axios.get(`/tasas/importaciones/${importacionId}/progreso`, {
          headers: this.authHeaders()
        })
        const item = progressResponse.data.data
        const progress = item.progresoPublicacion || {}
        this.analysisProgress = Math.max(45, Math.min(90, progress.porcentaje || 55))
        this.processingMessage = progress.mensaje || 'Validando columnas y registros...'
        if (['analizada', 'rechazada'].includes(item.estado)) {
          const response = await this.$axios.get(`/tasas/importaciones/${importacionId}`, {
            headers: this.authHeaders()
          })
          return response.data.data
        }
        if (item.estado === 'fallida') {
          throw new Error(progress.error || 'El análisis no pudo completarse.')
        }
      }
    },
    requestPublish() {
      this.overwriteConfirmed = false
      this.futurePeriodsConfirmed = false
      this.serverConflictPeriods = []
      this.showPublishConfirmation = true
    },
    async publishCurrentImport() {
      if (
        this.isPublishing ||
        (this.publishedPeriodsAffectedByPublication.length && !this.overwriteConfirmed) ||
        (this.futurePeriods.length && !this.futurePeriodsConfirmed)
      ) return
      this.isPublishing = true
      this.publicationProgress = {
        message: 'Subiendo el archivo al servidor...',
        percentage: 0,
        processed: 0,
        total: this.analysisResult.entries
      }
      try {
        await this.$axios.post(
          `/tasas/importaciones/${this.analysisResult.historyId}/publicar`,
          this.selectedFile,
          {
            headers: {
              ...this.fileRequestHeaders(),
              'X-Confirmar-Reemplazo': String(this.overwriteConfirmed),
              'X-Confirmar-Periodos-Futuros': String(this.futurePeriodsConfirmed),
              'X-Guardar-Original': String(this.guardarOriginalHabilitado)
            }
          }
        )
        await this.waitForPublication(this.analysisResult.historyId)
        await Promise.all([this.loadHistory(), this.loadPeriods()])
        this.showPublishConfirmation = false
        this.showAnalysisModal = false
        this.clearFile()
        this.showToast('La carga fue publicada correctamente.', {
          title: 'Publicación confirmada',
          variant: 'success',
          solid: true
        })
      } catch (error) {
        if (error.response?.status === 409 && error.response.data.conflictos?.length) {
          this.serverConflictPeriods = error.response.data.conflictos
          this.overwriteConfirmed = false
          return
        }
        if (error.response?.status === 409 && error.response.data.periodosFuturos?.length) {
          this.futurePeriodsConfirmed = false
          return
        }
        this.showToast(error.response?.data?.message || 'No se pudo publicar la carga.', {
          title: 'Error al publicar',
          variant: 'danger',
          solid: true
        })
      } finally {
        this.isPublishing = false
      }
    },
    async waitForPublication(importacionId) {
      while (this.isPublishing) {
        await this.pause(1800)
        const response = await this.$axios.get(`/tasas/importaciones/${importacionId}/progreso`, {
          headers: this.authHeaders()
        })
        const item = response.data.data
        const progress = item.progresoPublicacion || {}
        this.publicationProgress = {
          message: progress.mensaje || 'Procesando la publicación...',
          percentage: progress.porcentaje || 0,
          processed: progress.procesadas || 0,
          total: progress.total || this.analysisResult.entries
        }
        if (item.estado === 'publicada') return
        if (item.estado === 'fallida') {
          throw new Error(progress.error || 'La publicación no pudo completarse.')
        }
      }
    },
    closeAnalysis() {
      this.showAnalysisModal = false
    },
    buildReport() {
      if (!this.analysisResult) return ''
      const lines = [
        'REPORTE DE VALIDACIÓN DE BOLETAS DE AUTOMOTORES',
        `Archivo: ${this.analysisResult.fileName || (this.selectedFile ? this.selectedFile.name : '-')}`,
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
      const fileName = this.analysisResult.fileName || this.selectedFile.name
      this.downloadText(this.buildReport(), `reporte-${fileName.replace(/\.xlsx$/i, '')}.txt`)
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
      if (this.reportDownloadingId) return
      this.reportDownloadingId = item.id
      try {
        const response = await this.$axios.get(`/tasas/importaciones/${item.id}/reporte`, {
          headers: this.authHeaders(),
          responseType: 'text'
        })
        this.downloadText(response.data, `reporte-${item.fileName.replace(/\.xlsx$/i, '')}.txt`)
      } catch (error) {
        this.showToast('No se pudo descargar el reporte.', { variant: 'danger', solid: true })
      } finally {
        this.reportDownloadingId = null
      }
    },
    async downloadOriginalFile(item) {
      if (this.originalDownloadingId) return
      this.originalDownloadingId = item.id
      try {
        const response = await this.$axios.get(`/tasas/importaciones/${item.id}/original`, {
          headers: this.authHeaders(),
          responseType: 'blob'
        })
        const url = URL.createObjectURL(new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }))
        const link = document.createElement('a')
        link.href = url
        link.download = item.fileName
        link.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      } catch (error) {
        this.showToast(error.response?.data?.message || 'No se pudo descargar el archivo original.', {
          title: 'Error al descargar',
          variant: 'danger',
          solid: true
        })
      } finally {
        this.originalDownloadingId = null
      }
    },
    async loadHistory() {
      if (!this.puedeAdministrar) return
      this.historyLoading = true
      try {
        const response = await this.$axios.get('/tasas/importaciones', { headers: this.authHeaders() })
        this.history = response.data.data.map(this.mapHistoryItem)
      } catch (error) {
        this.history = []
      } finally {
        this.historyLoading = false
      }
    },
    requestDisableImport(item) {
      this.pendingDisableImport = item
      this.showDisableImportConfirmation = true
    },
    async disableImport() {
      if (!this.pendingDisableImport || this.disablingImport) return
      this.disablingImport = true
      try {
        const response = await this.$axios.put(
          `/tasas/importaciones/${this.pendingDisableImport.id}/deshabilitar`,
          {},
          { headers: this.authHeaders() }
        )
        await Promise.all([this.loadHistory(), this.loadPeriods()])
        this.showDisableImportConfirmation = false
        this.showToast(
          `La carga fue deshabilitada. Se quitaron ${this.formatNumber(response.data.data.boletasDeshabilitadas)} boletas activas.`,
          { title: 'Carga deshabilitada', variant: 'success', solid: true }
        )
      } catch (error) {
        this.showToast(error.response?.data?.message || 'No se pudo deshabilitar la carga.', {
          title: 'Error al deshabilitar',
          variant: 'danger',
          solid: true
        })
      } finally {
        this.disablingImport = false
      }
    },
    async loadPeriods() {
      if (!this.puedeAdministrar) return
      this.periodsLoading = true
      try {
        const response = await this.$axios.get('/tasas/importaciones/periodos', { headers: this.authHeaders() })
        this.loadedPeriods = response.data.data
      } catch (error) {
        this.showToast('No se pudieron cargar los períodos publicados.', { variant: 'danger', solid: true })
      } finally {
        this.periodsLoading = false
      }
    },
    async loadStorageConfig() {
      if (!this.puedeAdministrar) return
      try {
        const response = await this.$axios.get('/tasas/importaciones/configuracion', { headers: this.authHeaders() })
        this.guardarOriginalHabilitado = response.data.data.guardarArchivoOriginalTasas
        this.tasaAutomotorPublicaHabilitada = response.data.data.tasaAutomotorPublicaHabilitada !== false
      } catch (_) {
        this.guardarOriginalHabilitado = false
        this.tasaAutomotorPublicaHabilitada = true
      }
    },
    async updateAutomotorPublicConfig(value) {
      const enabled = value === true
      this.configLoading = true
      try {
        const response = await this.$axios.put(
          '/tasas/importaciones/configuracion',
          { tasaAutomotorPublicaHabilitada: enabled },
          { headers: this.authHeaders() }
        )
        this.tasaAutomotorPublicaHabilitada = response.data.data.tasaAutomotorPublicaHabilitada.value === true
      } catch (error) {
        this.tasaAutomotorPublicaHabilitada = !enabled
        this.showToast('No se pudo actualizar la visibilidad pública.', { variant: 'danger', solid: true })
      } finally {
        this.configLoading = false
      }
    },
    async updateStorageConfig(value) {
      const enabled = value === true
      this.configLoading = true
      try {
        const response = await this.$axios.put(
          '/tasas/importaciones/configuracion',
          { guardarArchivoOriginalTasas: enabled },
          { headers: this.authHeaders() }
        )
        this.guardarOriginalHabilitado = response.data.data.value === true
      } catch (error) {
        this.guardarOriginalHabilitado = !enabled
        this.showToast('No se pudo actualizar la configuración.', { variant: 'danger', solid: true })
      } finally {
        this.configLoading = false
      }
    },
    mapAnalysis(item) {
      const observations = item.observaciones || []
      return {
        historyId: item._id,
        fileName: item.nombreArchivo,
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
        reemplazada_parcialmente: 'partially-replaced',
        deshabilitada: 'disabled'
      }
      const periodos = item.periodos || []
      return {
        id: item._id,
        fileName: item.nombreArchivo,
        fileSize: this.formatFileSize(item.tamanoBytes),
        uploadedAt: item.createdAt,
        uploadedAtSort: new Date(item.createdAt).getTime(),
        period: periodos.join(', ') || '-',
        periodSort: Math.max(0, ...periodos.map(period => {
          const [month, year] = period.split('/').map(Number)
          return (year * 100) + month
        })),
        activePeriod: (item.periodosActivos || []).join(', ') || '-',
        activePeriodCount: (item.periodosActivos || []).length,
        entries: item.cantidadEntradas,
        errors: item.cantidadErrores,
        warnings: item.cantidadAdvertencias,
        uploadedBy: item.subidoPor?.username || '-',
        originalAvailable: Boolean(item.archivoOriginal?.almacenado && item.archivoOriginal?.key),
        status: statusMap[item.estado] || item.estado
      }
    },
    authHeaders() {
      return { Authorization: `Bearer ${useUserStore().token}` }
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
        'partially-replaced': 'Reemplazado parcialmente',
        disabled: 'Deshabilitado'
      }[status] || status
    },
    statusClass(status) {
      return `status-${status}`
    },
    periodStateLabel(period) {
      if (period.habilitadas > 0 && period.deshabilitadas > 0) return 'Parcialmente habilitado'
      return period.habilitadas > 0 ? 'Habilitado' : 'Deshabilitado'
    },
    periodStateClass(period) {
      if (period.habilitadas > 0 && period.deshabilitadas > 0) return 'partial'
      return period.habilitadas > 0 ? 'enabled' : 'disabled'
    },
    periodVersionStateLabel(version) {
      if (version.estadoImportacion === 'deshabilitada') return 'Deshabilitado'
      return version.habilitado ? 'Habilitado' : 'Deshabilitado'
    },
    periodVersionStateClass(version) {
      if (version.estadoImportacion === 'deshabilitada') return 'disabled'
      return version.habilitado ? 'enabled' : 'disabled'
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
  }
}
</script>

<style scoped>
.boletas-page { min-height: 100vh; padding-top: 58px; color: #17332d; }
.container { max-width: 1240px; }
.upload-hero { position: relative; overflow: hidden; display: grid; grid-template-columns: 1.12fr .88fr; gap: 3rem; align-items: center; padding: 3.5rem; border-radius: 28px; color: var(--color-white); background: radial-gradient(circle at 5% 0%, var(--white-veil-soft), transparent 38%), linear-gradient(135deg, #075e4a, #14835e); box-shadow: 0 24px 60px var(--mint-shadow-mid); }
.upload-hero::after { content: ""; position: absolute; width: 340px; height: 340px; right: -150px; bottom: -210px; border: 52px solid var(--white-veil-soft); border-radius: 50%; }
.hero-copy, .upload-card { position: relative; z-index: 1; }
.eyebrow { display: block; margin-bottom: .65rem; color: #77e0bd; font-size: .74rem; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; }
.hero-copy h1 { max-width: 590px; margin-bottom: 1rem; font-size: 2.6rem; font-weight: 800; line-height: 1.08; }
.hero-copy p { max-width: 620px; margin-bottom: 1.5rem; color: var(--white-veil-strong); font-size: 1.04rem; line-height: 1.65; }
.hero-notes { display: flex; flex-wrap: wrap; gap: .7rem; }
.hero-notes span { padding: .48rem .75rem; border: 1px solid var(--white-veil-soft); border-radius: 100px; background: var(--white-veil-soft); font-size: .78rem; }
.hero-notes i { margin-right: .35rem; }
.upload-card { padding: 1.25rem; border: 1px solid var(--white-veil-mid); border-radius: 22px; background: var(--white-veil-card); box-shadow: 0 20px 45px var(--shadow-hover); }
.drop-zone { min-height: 245px; padding: 2rem 1.2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2px dashed #e2ebe4; border-radius: 16px; color: #284c42; background: #f7fbf8; cursor: pointer; transition: .2s ease; text-align: center; }
.drop-zone:hover, .drop-zone.dragging { border-color: #14835e; background: #e3f6ee; transform: translateY(-2px); }
.drop-zone.selected { border-style: solid; }
.drop-zone strong { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.drop-zone span, .drop-zone small { margin-top: .25rem; color: #666666; }
.upload-icon { width: 68px; height: 68px; margin-bottom: 1rem; display: grid; place-items: center; border-radius: 20px; color: #0d7655; background: #e3f6ee; font-size: 2rem; }
.btn-analyze, .btn-publish { border: none; color: var(--color-white); background: linear-gradient(135deg, #14835e, #075e4a); font-weight: 700; }
.btn-analyze { margin-top: 1rem; padding: .85rem; border-radius: 12px; }
.btn-analyze:disabled { opacity: .48; }
.storage-option { margin-top: .9rem; padding: .8rem .9rem; border: 1px solid #e2ebe4; border-radius: 12px; color: #315c50; background: #f7fbf8; font-size: .82rem; }
.storage-option small { display: block; margin-top: .25rem; color: #666666; line-height: 1.35; }
.period-management-section { margin: 4rem 0 2rem; }
.period-toolbar { display: flex; align-items: center; gap: .6rem; }
.period-toolbar .custom-select { width: 190px; border-color: #e2ebe4; color: #315c50; font-weight: 700; }
.periods-empty { min-height: 150px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .7rem; border: 1px dashed #e2ebe4; border-radius: 18px; color: #666666; background: var(--white-veil-strong); }
.periods-empty i { color: #666666; font-size: 2rem; }
.year-archive { overflow: hidden; margin-bottom: 1rem; border: 1px solid #e2ebe4; border-radius: 18px; background: var(--color-white); box-shadow: 0 12px 32px var(--mint-shadow-soft); }
.year-archive summary { display: flex; align-items: center; justify-content: space-between; padding: 1.2rem 1.5rem; cursor: pointer; list-style: none; background: #f7fbf8; }
.year-archive summary::-webkit-details-marker { display: none; }
.year-archive summary div { display: flex; align-items: baseline; gap: .8rem; }
.year-archive summary strong { color: #17332d; font-size: 1.45rem; }
.year-archive summary span { color: #666666; font-size: .82rem; font-weight: 700; }
.year-archive summary i { color: #14835e; transition: transform .2s; }
.year-archive[open] summary i { transform: rotate(180deg); }
.year-periods { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; padding: 1.25rem; }
.loaded-period-card { overflow: hidden; border: 1px solid #e2ebe4; border-radius: 15px; background: #fff; }
.loaded-period-card header { display: flex; align-items: center; justify-content: space-between; padding: .9rem 1rem; border-bottom: 1px solid #e2ebe4; background: #f7fbf8; }
.loaded-period-card header span:first-child { color: #666666; font-size: .7rem; font-weight: 800; text-transform: uppercase; }
.loaded-period-card h3 { margin: .1rem 0 0; color: #284c42; font-size: 1.15rem; font-weight: 800; }
.period-state { padding: .3rem .55rem; border-radius: 100px; font-size: .68rem; font-weight: 800; text-transform: uppercase; }
.period-state.enabled { color: #0d7655; background: #e3f6ee; }
.period-state.partial { color: #e27910; background: #fff1bd; }
.period-state.disabled { color: #666666; background: #f0f0f0; }
.period-versions { padding: .45rem .8rem; }
.period-versions.has-overflow { max-height: 220px; overflow-y: auto; scrollbar-color: #666666 #f7fbf8; scrollbar-width: thin; }
.period-versions.has-overflow::-webkit-scrollbar { width: 7px; }
.period-versions.has-overflow::-webkit-scrollbar-track { border-radius: 8px; background: #f7fbf8; }
.period-versions.has-overflow::-webkit-scrollbar-thumb { border-radius: 8px; background: #666666; }
.period-version { display: flex; align-items: center; justify-content: space-between; gap: .6rem; padding: .7rem .2rem; border-top: 1px solid #e2ebe4; }
.period-version:first-child { border-top: 0; }
.period-version.active { color: #0d7655; }
.version-file { min-width: 0; display: flex; align-items: center; gap: .55rem; }
.version-file i { flex: 0 0 auto; color: #666666; font-size: 1.2rem; }
.period-version.active .version-file i { color: #14835e; }
.version-file div { min-width: 0; }
.version-file strong, .version-file small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.version-file strong { max-width: 235px; font-size: .77rem; }
.version-file small { max-width: 235px; color: #666666; font-size: .67rem; }
.version-state { flex: 0 0 auto; padding: .34rem .6rem; border-radius: 999px; font-size: .67rem; font-weight: 800; text-transform: uppercase; white-space: nowrap; }
.version-state.enabled { color: #0d7655; background: #e3f6ee; }
.version-state.disabled { color: #666666; background: #f0f0f0; }
.versions-overflow-note { padding: .45rem .8rem; border-top: 1px solid #e2ebe4; color: #666666; background: #f7fbf8; font-size: .68rem; font-weight: 700; text-align: center; }
.versions-overflow-note i { margin-right: .25rem; color: #14835e; }
.year-pagination { display: flex; align-items: center; justify-content: space-between; margin-top: 1.1rem; padding: .8rem 1rem; border: 1px solid #e2ebe4; border-radius: 14px; color: #666666; background: var(--white-veil-strong); font-size: .76rem; font-weight: 700; }
.history-section { margin: 4rem 0 2rem; }
.section-heading { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.25rem; }
.section-heading .eyebrow { color: #14835e; }
.section-heading h2 { margin: 0 0 .35rem; font-weight: 800; }
.section-heading p { margin: 0; color: #666666; }
.history-count { min-width: 95px; padding: .65rem 1rem; border-radius: 14px; color: #0d7655; background: #e3f6ee; text-align: center; }
.history-count strong, .history-count span { display: block; }
.history-count strong { font-size: 1.4rem; }
.history-count span { font-size: .72rem; font-weight: 700; text-transform: uppercase; }
.history-card { overflow: hidden; border: 1px solid #e2ebe4; border-radius: 18px; background: var(--color-white); box-shadow: 0 14px 40px var(--mint-shadow-soft); }
.history-toolbar { display: grid; grid-template-columns: minmax(240px, 1fr) 190px 175px auto; gap: .65rem; align-items: center; padding: 1rem; border-bottom: 1px solid #e2ebe4; background: #f7fbf8; }
.history-toolbar .custom-select { height: 38px; border-color: #e2ebe4; color: #315c50; font-weight: 700; }
.history-search { display: flex; align-items: center; height: 38px; border: 1px solid #e2ebe4; border-radius: .2rem; background: var(--color-white); }
.history-search:focus-within { border-color: #14835e; box-shadow: 0 0 0 3px var(--mint-focus); }
.history-search i { padding-left: .75rem; color: #14835e; }
.history-search input { width: 100%; min-width: 0; border: 0; outline: 0; padding: .5rem .7rem; background: transparent; color: #284c42; font-size: .82rem; }
.history-sort-direction { height: 38px; white-space: nowrap; font-weight: 700; }
.history-pagination { display: flex; align-items: center; justify-content: space-between; padding: .8rem 1rem; border-top: 1px solid #e2ebe4; color: #666666; background: #f7fbf8; font-size: .76rem; font-weight: 700; }
.history-loading { display: flex; align-items: center; justify-content: center; gap: .6rem; padding: 2rem; color: #666666; font-weight: 700; }
.server-activity { position: fixed; z-index: 1080; right: 1.25rem; bottom: 1.25rem; display: flex; align-items: center; gap: .65rem; max-width: calc(100vw - 2.5rem); padding: .8rem 1rem; border: 1px solid var(--white-veil-soft); border-radius: 14px; color: var(--color-white); background: #075e4a; box-shadow: 0 14px 35px var(--mint-shadow-mid); font-size: .82rem; font-weight: 700; }
.server-activity-enter-active, .server-activity-leave-active { transition: .2s ease; }
.server-activity-enter, .server-activity-leave-to { opacity: 0; transform: translateY(10px); }
.file-cell { min-width: 0; display: flex; align-items: center; gap: .65rem; }
.file-cell div { min-width: 0; }
.file-cell i { color: #14835e; font-size: 1.5rem; }
.file-cell strong, .file-cell small { display: block; }
.file-cell strong, .text-cell { overflow: hidden; display: block; text-overflow: ellipsis; white-space: nowrap; }
.file-cell small { color: #666666; }
.cell-compact { display: block; max-width: 105px; }
.period-cell { overflow: hidden; display: -webkit-box; max-width: 150px; line-height: 1.35; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
.history-actions { display: flex; justify-content: flex-end; gap: .35rem; white-space: nowrap; }
.result-cell span { display: block; white-space: nowrap; font-size: .78rem; font-weight: 700; }
.status-badge { display: inline-block; padding: .35rem .65rem; border-radius: 100px; font-size: .73rem; font-weight: 800; white-space: nowrap; }
.status-published { color: #0d7655; background: #e3f6ee; }
.status-validated { color: #e27910; background: #fff1bd; }
.status-rejected { color: #9a3030; background: #f8d7da; }
.status-replaced { color: #666666; background: #f0f0f0; }
.status-partially-replaced { color: #e27910; background: #fff1bd; }
.status-disabled { color: #9a3030; background: #f8d7da; }
.no-access { min-height: calc(100vh - 58px); display: grid; place-items: center; padding: 2rem; }
.no-access-card { max-width: 520px; padding: 3rem; border-radius: 22px; background: var(--color-white); box-shadow: 0 20px 50px var(--shadow-mid); text-align: center; }
.no-access-card i { color: #666666; font-size: 4rem; }
.no-access-card h1 { margin-top: 1rem; font-size: 1.8rem; font-weight: 800; }
</style>

<style>
.boletas-page .history-card .table-responsive { width: 100%; }
.boletas-page .history-card table { width: 100%; min-width: 1145px; table-layout: fixed; }
.boletas-page .history-card th, .boletas-page .history-card td { overflow: hidden; vertical-align: top; }
.boletas-page .history-card thead th { border-bottom: 1px solid #e2ebe4; color: #284c42; background: #f7fbf8; font-weight: 800; }
.analysis-modal .modal-content, .publish-modal .modal-content { overflow: hidden; border: 0; border-radius: 24px; box-shadow: 0 30px 80px var(--mint-shadow-mid); }
.analysis-modal .modal-body, .publish-modal .modal-body { padding: 0; }
.analysis-processing, .analysis-result, .publish-confirmation { padding: 2.5rem; text-align: center; }
.publication-progress { margin-top: 1.25rem; text-align: left; }
.publication-progress small { display: block; margin-top: .45rem; color: #666666; text-align: center; }
.loader-orbit { width: 110px; height: 110px; margin: 0 auto 1.5rem; display: grid; place-items: center; border: 3px solid #e2ebe4; border-top-color: #14835e; border-radius: 50%; animation: orbit 1.2s linear infinite; }
.loader-core { width: 76px; height: 76px; display: grid; place-items: center; border-radius: 50%; color: #0d7655; background: #e3f6ee; font-size: 2.2rem; animation: counterOrbit 1.2s linear infinite; }
@keyframes orbit { to { transform: rotate(360deg); } }
@keyframes counterOrbit { to { transform: rotate(-360deg); } }
.analysis-processing .eyebrow, .analysis-result .eyebrow { color: #14835e; }
.analysis-processing h3, .analysis-result h3, .publish-confirmation h3 { color: #17332d; font-weight: 800; }
.analysis-processing p, .result-description, .publish-confirmation p { color: #666666; }
.processing-steps { display: flex; justify-content: space-between; margin-top: .65rem; color: #666666; font-size: .7rem; font-weight: 800; text-transform: uppercase; }
.processing-steps .active { color: #14835e; }
.result-icon, .confirm-icon { width: 80px; height: 80px; margin: 0 auto 1.2rem; display: grid; place-items: center; border-radius: 50%; font-size: 2.2rem; }
.result-icon.is-success { color: #0d7655; background: #e3f6ee; }
.result-icon.has-errors { color: #b13c3c; background: #f8d7da; }
.confirm-icon { color: #0d7655; background: #e3f6ee; }
.confirm-icon.disable-icon { color: #b13c3c; background: #f8d7da; }
.overwrite-warning { margin: 1.25rem 0 0; padding: 1rem; border: 1px solid #cbc508; border-radius: 14px; color: #e27910; background: #f0f0f0; text-align: left; }
.overwrite-warning-title { display: flex; align-items: center; gap: .5rem; margin-bottom: .5rem; color: #e27910; font-weight: 800; }
.overwrite-warning p { margin-bottom: .75rem; color: #e27910; font-size: .86rem; }
.future-warning { border-color: #e5a1a1; color: #721c24; background: #f0f0f0; }
.future-warning .overwrite-warning-title, .future-warning p, .future-warning .overwrite-check { color: #721c24; }
.overwrite-check { display: flex; align-items: flex-start; gap: .55rem; margin: 0; color: #e27910; font-size: .82rem; font-weight: 700; cursor: pointer; }
.overwrite-check input { margin-top: .18rem; }
.btn-publish:disabled { cursor: not-allowed; opacity: .45; }
.summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: .75rem; margin: 1.5rem 0; }
.renamed-file-notice { margin: 1rem 0 0; padding: .8rem 1rem; border: 1px solid #e2ebe4; border-radius: 12px; color: #315c50; background: #f7fbf8; font-size: .82rem; }
.renamed-file-notice i { margin-right: .35rem; color: #14835e; }
.summary-grid div { padding: .8rem; border: 1px solid #e2ebe4; border-radius: 12px; background: #f7fbf8; }
.summary-grid span, .summary-grid strong { display: block; }
.summary-grid span { color: #666666; font-size: .7rem; font-weight: 800; text-transform: uppercase; }
.summary-grid strong { margin-top: .25rem; color: #17332d; font-size: 1.15rem; }
.issues-panel { overflow: hidden; margin-top: 1.2rem; border: 1px solid #e2ebe4; border-radius: 14px; text-align: left; }
.issues-heading { padding: .75rem 1rem; display: flex; justify-content: space-between; align-items: center; background: #f7fbf8; }
.issues-list { max-height: 245px; overflow-y: auto; }
.issue-row { display: grid; grid-template-columns: 88px 72px 125px 1fr; gap: .6rem; padding: .65rem 1rem; border-top: 1px solid #e2ebe4; font-size: .75rem; align-items: center; }
.issue-row.error { border-left: 4px solid #dc5353; }
.issue-row.warning { border-left: 4px solid #cbc508; }
.issue-type { font-weight: 800; text-transform: uppercase; }
.issue-row.error .issue-type { color: #b13c3c; }
.issue-row.warning .issue-type { color: #e27910; }
.issue-row-number { color: #666666; }
.issues-more { display: block; padding: .7rem 1rem; color: #666666; background: #f0f0f0; }
.result-actions, .confirm-actions { display: flex; justify-content: center; gap: .75rem; margin-top: 1.5rem; }
.result-actions .btn, .confirm-actions .btn { min-width: 145px; padding: .65rem 1rem; border-radius: 10px; font-weight: 700; }
@media (max-width: 900px) {
  .upload-hero { grid-template-columns: 1fr; padding: 2rem; }
  .hero-copy h1 { font-size: 2rem; }
  .section-heading { align-items: flex-start; flex-direction: column; gap: 1rem; }
  .period-toolbar { width: 100%; }
  .period-toolbar .custom-select { flex: 1; width: auto; }
  .year-periods { grid-template-columns: 1fr; padding: .8rem; }
  .period-version { align-items: flex-start; flex-direction: column; }
  .period-version .btn { width: 100%; }
  .year-pagination { align-items: flex-start; flex-direction: column; gap: .6rem; }
  .history-toolbar { grid-template-columns: 1fr; }
  .history-sort-direction { width: 100%; }
  .history-pagination { align-items: flex-start; flex-direction: column; gap: .6rem; }
  .summary-grid { grid-template-columns: repeat(2, 1fr); }
  .issue-row { grid-template-columns: 1fr; gap: .2rem; }
}
</style>
