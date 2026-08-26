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
      <section class="tax-selector">
        <div>
          <span class="eyebrow">Tipo de tasa</span>
          <h2>Administrar boletas</h2>
        </div>
        <div class="tax-options">
          <button
            v-for="tasa in tasasPermitidas"
            :key="tasa.codigo"
            type="button"
            class="tax-option"
            :class="{ active: tasa.codigo === selectedTaxCode }"
            @click="selectTax(tasa)"
          >
            <i :class="`bi bi-${tasa.icono}`"></i>
            <span>
              <strong>{{ tasa.nombre }}</strong>
              <small>{{ tasa.descripcion }}</small>
            </span>
          </button>
        </div>
      </section>

      <BoletasUrbanaPanel v-if="selectedTaxCode === 'URBANA'" />

      <template v-else>
      <section class="upload-hero">
        <div class="hero-copy">
          <span class="eyebrow">Administración interna de boletas</span>
          <h1>Importar boletas de automotores</h1>
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
              <strong>Seleccioná el archivo haciendo click o arrastralo hasta aquí</strong>
              <small>Solamente se aceptan archivos .xlsx</small>
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

            <h2>Períodos cargados</h2>
            <p>Administrá qué versión de cada período pueden descargar los contribuyentes.</p>
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
            <span v-if="year.enabledCount === 0" class="year-warning" title="Ningún período habilitado">
              <i class="bi bi-exclamation-triangle-fill"></i>
            </span>
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
                  <i v-else class="bi bi-search"></i>
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
      </template>
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
      no-header-close
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
      centered
      hide-header
      hide-footer
      no-header-close
      no-close-on-backdrop
      :no-close-on-esc="analysisState === 'processing'"
      modal-class="boletas-dialog-modal"
    >
      <div v-if="analysisState === 'processing'" class="boletas-dialog">
        <div class="boletas-dialog-bar boletas-dialog-bar--success boletas-dialog-bar--empty">
          <button
            type="button"
            class="btn-close btn-close-white"
            aria-label="Cerrar"
            disabled
          ></button>
        </div>
        <div class="boletas-dialog-body">
          <b-spinner class="boletas-dialog-spinner" variant="success" label="Cargando"></b-spinner>
          <h3>Tu archivo se está cargando</h3>
          <p>Estamos guardando las boletas y actualizando los períodos activos. Este proceso puede demorar unos minutos.</p>
          <button class="btn btn-dialog-cancel" type="button" disabled>Cancelar</button>
        </div>
      </div>

      <div v-else-if="analysisResult" class="boletas-dialog">
        <div
          class="boletas-dialog-bar"
          :class="analysisResult.errorCount ? 'boletas-dialog-bar--danger' : 'boletas-dialog-bar--success'"
        >
          <span class="boletas-dialog-bar-icon" aria-hidden="true">
            <i :class="analysisResult.errorCount ? 'bi bi-x-lg' : 'bi bi-check-lg'"></i>
          </span>
          <button
            type="button"
            class="btn-close btn-close-white"
            aria-label="Cerrar"
            @click="closeAnalysis"
          ></button>
        </div>
        <div class="boletas-dialog-body">
        <h3 class="boletas-dialog-title">{{ resultTitle }}</h3>
        <p class="result-description">{{ resultDescription }}</p>
        <p
          v-if="analysisResult.fileName && !(selectedFile && analysisResult.fileName !== selectedFile.name)"
          class="boletas-dialog-file"
        >{{ analysisResult.fileName }}</p>
        <div v-if="analysisResult.fileName && selectedFile && analysisResult.fileName !== selectedFile.name" class="renamed-file-notice">
          <i class="bi bi-files"></i>
          Ya existía un archivo con ese nombre. Esta carga se guardó como
          <strong>{{ analysisResult.fileName }}</strong>.
        </div>

        <div class="summary-grid">
          <div><strong>{{ formatNumber(analysisResult.entries) }}</strong><span>Entradas</span></div>
          <div><strong>{{ formatNumber(analysisResult.domains) }}</strong><span>Dominios</span></div>
          <div><strong class="summary-error">{{ analysisResult.errorCount }}</strong><span>Errores</span></div>
          <div><strong class="summary-warn">{{ analysisResult.warningCount }}</strong><span>Advertencias</span></div>
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
          <button class="btn btn-dialog-cancel" type="button" @click="closeAnalysis">Cancelar</button>
          <button
            v-if="!analysisResult.errorCount"
            class="btn btn-dialog-ok"
            type="button"
            @click="requestPublish"
          >
            Confirmar y publicar
          </button>
        </div>
        </div>
      </div>
    </b-modal>

    <b-modal
      v-model="showPublishConfirmation"
      centered
      hide-header
      hide-footer
      no-header-close
      :no-close-on-backdrop="isPublishing"
      :no-close-on-esc="isPublishing"
      modal-class="boletas-dialog-modal"
    >
      <div class="boletas-dialog" :class="{ 'is-publishing': isPublishing }">
        <div
          class="boletas-dialog-bar"
          :class="isPublishing ? 'boletas-dialog-bar--success boletas-dialog-bar--empty' : 'boletas-dialog-bar--warn'"
        >
          <i v-if="!isPublishing" class="bi bi-exclamation-lg" aria-hidden="true"></i>
          <button
            type="button"
            class="btn-close"
            :class="{ 'btn-close-white': isPublishing }"
            aria-label="Cerrar"
            :disabled="isPublishing"
            @click="showPublishConfirmation = false"
          ></button>
        </div>
        <div class="boletas-dialog-body">
        <b-spinner
          v-if="isPublishing"
          class="boletas-dialog-spinner"
          variant="success"
          label="Publicando"
        ></b-spinner>
        <h3>{{ isPublishing ? 'Tu archivo se está cargando' : '¿Deseás publicar el archivo cargado?' }}</h3>
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
            class="btn btn-dialog-cancel"
            type="button"
            :disabled="isPublishing"
            @click="showPublishConfirmation = false"
          >
            Cancelar
          </button>
          <button
            v-if="!isPublishing"
            class="btn btn-dialog-ok"
            type="button"
            :disabled="(publishedPeriodsAffectedByPublication.length > 0 && !overwriteConfirmed) || (futurePeriods.length > 0 && !futurePeriodsConfirmed)"
            @click="publishCurrentImport"
          >
            {{ publishedPeriodsAffectedByPublication.length ? 'Deshabilitar anteriores y publicar' : 'Confirmar y publicar' }}
          </button>
        </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['authenticated', 'require-admin'],
  adminRoles: ['admin', 'master', 'boletas', 'hacienda', 'true'],
})

useHead({ title: 'Administrar boletas - Hacienda Villa Gesell' })
</script>

<script>
import BoletasUrbanaPanel from '~/components/admin/BoletasUrbanaPanel.vue'

export default {
  name: 'AdminBoletas',
  components: { BoletasUrbanaPanel },
  data() {
    return {
      selectedTaxCode: 'AUTOMOTORES',
      tasasDisponibles: [
        {
          codigo: 'AUTOMOTORES',
          nombre: 'Tasa automotor',
          descripcion: 'Boletas por dominio',
          icono: 'car-front',
        },
        {
          codigo: 'URBANA',
          nombre: 'Tasa urbana',
          descripcion: 'Boletas por partida',
          icono: 'buildings',
        },
      ],
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
      return this.puedeAdministrarAutomotor || this.puedeAdministrarUrbana
    },
    puedeAdministrarAutomotor() {
      return ['admin', 'master', 'true', 'boletas'].includes(String(useUserStore().admin || '').trim().toLowerCase())
    },
    puedeAdministrarUrbana() {
      return ['admin', 'master', 'true', 'boletas', 'hacienda'].includes(String(useUserStore().admin || '').trim().toLowerCase())
    },
    tasasPermitidas() {
      return this.tasasDisponibles.filter((tasa) => {
        if (tasa.codigo === 'URBANA') return this.puedeAdministrarUrbana
        return this.puedeAdministrarAutomotor
      })
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
    },
    selectedTaxCode(code) {
      if (code === 'AUTOMOTORES') this.loadAutomotorAdmin()
    },
  },
  mounted() {
    this.syncTaxFromRoute()
    if (this.selectedTaxCode === 'AUTOMOTORES') this.loadAutomotorAdmin()
  },
  methods: {
    syncTaxFromRoute() {
      const tipo = String(this.$route.query.tipo || '').toUpperCase()
      if (this.tasasPermitidas.some((tasa) => tasa.codigo === tipo)) {
        this.selectedTaxCode = tipo
        return
      }
      if (this.tasasPermitidas[0]) this.selectedTaxCode = this.tasasPermitidas[0].codigo
    },
    selectTax(tasa) {
      this.selectedTaxCode = tasa.codigo
      this.$router.replace({
        query: { ...this.$route.query, tipo: tasa.codigo },
      })
    },
    loadAutomotorAdmin() {
      this.loadHistory()
      this.loadStorageConfig()
      this.loadPeriods()
    },
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
      if (version.estadoImportacion === 'deshabilitada') return 'Carga deshabilitada'
      return version.habilitado ? 'Habilitado' : 'Habilitar'
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
.boletas-page {
  min-height: 100vh;
  padding-top: 58px;
  color: #353535;
}
.container { max-width: 1240px; }
.tax-selector {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.25rem;
  margin-bottom: 1.75rem;
}
.tax-selector h2 {
  margin: 0.35rem 0 0;
  color: #0c681a;
  font-size: 1.45rem;
  font-weight: 800;
}
.tax-selector .eyebrow {
  display: inline-block;
  padding: 0.22rem 0.65rem;
  border-radius: 6px;
  background: var(--green-fill);
  color: #0c681a;
  font-size: 0.72rem;
  font-weight: 500;
}
.tax-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.tax-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 220px;
  padding: 0.85rem 1rem;
  border: 1px solid #d9e4d4;
  border-radius: 14px;
  background: #fff;
  color: #353535;
  text-align: left;
  cursor: pointer;
}
.tax-option i { font-size: 1.35rem; color: #0c681a; }
.tax-option strong { display: block; }
.tax-option small { display: block; color: #6c757d; }
.tax-option.active {
  border-color: #15571f;
  background: var(--green-fill);
  box-shadow: 0px 2px 5px 0px var(--shadow-card);
}
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
.btn-analyze,
.btn-publish {
  border: 0;
  color: var(--color-white);
  background: #19a02d;
  font-family: var(--font-inter);
  font-weight: 600;
}
.btn-analyze {
  width: 100%;
  margin-top: 0.85rem;
  padding: 0.7rem 1rem;
  border-radius: 999px;
}
.btn-analyze:hover,
.btn-publish:hover {
  background: #0c681a;
  color: var(--color-white);
}
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
.period-management-section { margin: 3.5rem 0 2rem; }
.period-toolbar { display: flex; align-items: center; gap: 0.6rem; }
.period-toolbar .custom-select,
.period-toolbar :deep(.form-select) {
  width: 190px;
}
.periods-empty {
  min-height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  border: 1px dashed #dee2e6;
  border-radius: 16px;
  color: #666;
  background: var(--gray-bs-100);
}
.periods-empty i { font-size: 2rem; }
.year-archive {
  overflow: hidden;
  margin-bottom: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 16px;
  background: var(--green-fill);
}
.year-archive summary {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.1rem 1.35rem;
  cursor: pointer;
  list-style: none;
}
.year-archive summary::-webkit-details-marker { display: none; }
.year-archive summary div {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  margin-right: auto;
}
.year-archive summary strong {
  color: #0c681a;
  font-size: 1.45rem;
}
.year-archive summary span {
  color: #666;
  font-size: 0.82rem;
  font-weight: 700;
}
.year-archive summary > .bi-chevron-down {
  color: #0c681a;
  transition: transform 0.2s;
}
.year-archive[open] summary > .bi-chevron-down { transform: rotate(180deg); }
.year-warning {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: var(--color-white);
  background: #0c681a;
}
.year-warning i { font-size: 0.85rem; }
.year-periods {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  padding: 0 1.25rem 1.25rem;
}
.loaded-period-card {
  overflow: hidden;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  background: var(--color-white);
}
.loaded-period-card header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1rem;
}
.loaded-period-card header span:first-child {
  color: #666;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}
.loaded-period-card h3 {
  margin: 0.1rem 0 0;
  color: #0c681a;
  font-size: 1.15rem;
  font-weight: 800;
}
.period-state {
  padding: 0.3rem 0.55rem;
  border-radius: 100px;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
}
.period-state.enabled { color: #0c681a; background: var(--green-fill); }
.period-state.partial { color: #E27910; background: var(--gray-bs-100); }
.period-state.disabled { color: #666; background: var(--gray-bs-200); }
.period-versions { padding: 0.2rem 0.9rem 0.7rem; }
.period-versions.has-overflow {
  max-height: 220px;
  overflow-y: auto;
  scrollbar-color: #666 var(--gray-bs-100);
  scrollbar-width: thin;
}
.period-version {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  padding: 0.7rem 0;
  border-top: 1px solid #dee2e6;
}
.period-version:first-child { border-top: 0; }
.version-file { min-width: 0; display: flex; align-items: center; gap: 0.55rem; }
.version-file i { flex: 0 0 auto; color: #666; font-size: 1.2rem; }
.version-file div { min-width: 0; }
.version-file strong,
.version-file small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.version-file strong { max-width: 235px; font-size: 0.77rem; }
.version-file small { max-width: 235px; color: #666; font-size: 0.67rem; }
.version-state {
  flex: 0 0 auto;
  padding: 0.28rem 0.7rem;
  border: 1px solid #19a02d;
  border-radius: 8px;
  color: #19a02d;
  background: var(--color-white);
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
}
.version-state.enabled { border-color: #0c681a; color: #0c681a; }
.version-state.disabled { border-color: #19a02d; color: #19a02d; }
.versions-overflow-note {
  padding: 0.45rem 0.8rem;
  border-top: 1px solid #dee2e6;
  color: #666;
  font-size: 0.68rem;
  font-weight: 700;
  text-align: center;
}
.year-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.1rem;
  padding: 0.7rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  color: #666;
  background: var(--color-white);
  font-size: 0.76rem;
  font-weight: 700;
}
.history-section { margin: 3.5rem 0 2rem; }
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
.section-heading h2 {
  margin: 0 0 0.35rem;
  color: #353535;
  font-weight: 800;
}
.section-heading p { margin: 0; color: #666; }
.history-count {
  min-width: 95px;
  padding: 0.65rem 1rem;
  border-radius: 14px;
  color: #0c681a;
  background: var(--green-fill);
  text-align: center;
}
.history-count strong,
.history-count span { display: block; }
.history-count strong { font-size: 1.4rem; }
.history-count span {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
}
.history-card {
  overflow: hidden;
  border: 1px solid #dee2e6;
  border-radius: 16px;
  background: var(--color-white);
}
.history-toolbar {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) 190px 175px auto;
  gap: 0.65rem;
  align-items: center;
  padding: 1rem;
}
.history-search {
  display: flex;
  align-items: center;
  height: 38px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background: var(--color-white);
}
.history-search:focus-within {
  border-color: #0c681a;
  box-shadow: 0 0 0 3px var(--green-fill);
}
.history-search i { padding-left: 0.75rem; color: #0c681a; }
.history-search input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  padding: 0.5rem 0.7rem;
  background: transparent;
  color: #353535;
  font-size: 0.82rem;
}
.history-sort-direction { height: 38px; white-space: nowrap; font-weight: 700; }
.history-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  border-top: 1px solid #dee2e6;
  color: #666;
  font-size: 0.76rem;
  font-weight: 700;
}
.history-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 2rem;
  color: #666;
  font-weight: 700;
}
.server-activity {
  position: fixed;
  z-index: 1080;
  right: 1.25rem;
  bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  max-width: calc(100vw - 2.5rem);
  padding: 0.8rem 1rem;
  border-radius: 12px;
  color: var(--color-white);
  background: #0c681a;
  font-size: 0.82rem;
  font-weight: 700;
}
.server-activity-enter-active,
.server-activity-leave-active { transition: 0.2s ease; }
.server-activity-enter,
.server-activity-leave-to { opacity: 0; transform: translateY(10px); }
.file-cell { min-width: 0; display: flex; align-items: center; gap: 0.65rem; }
.file-cell div { min-width: 0; }
.file-cell i { color: #19a02d; font-size: 1.5rem; }
.file-cell strong,
.file-cell small { display: block; }
.file-cell strong,
.text-cell {
  overflow: hidden;
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.file-cell small { color: #666; }
.cell-compact { display: block; max-width: 105px; }
.period-cell {
  overflow: hidden;
  display: -webkit-box;
  max-width: 150px;
  line-height: 1.35;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
.history-actions { display: flex; justify-content: flex-end; gap: 0.35rem; white-space: nowrap; }
.result-cell span { display: block; white-space: nowrap; font-size: 0.78rem; font-weight: 700; }
.status-badge {
  display: inline-block;
  padding: 0.35rem 0.65rem;
  border-radius: 100px;
  font-size: 0.73rem;
  font-weight: 800;
  white-space: nowrap;
}
.status-published { color: #0c681a; background: var(--green-fill); }
.status-validated { color: #E27910; background: var(--gray-bs-100); }
.status-rejected { color: #cc0025; background: var(--gray-bs-100); }
.status-replaced { color: #666; background: var(--gray-bs-200); }
.status-partially-replaced { color: #E27910; background: var(--gray-bs-100); }
.status-disabled { color: #cc0025; background: var(--gray-bs-100); }
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
  .section-heading { align-items: flex-start; flex-direction: column; gap: 1rem; }
  .period-toolbar { width: 100%; }
  .period-toolbar .custom-select,
  .period-toolbar :deep(.form-select) { flex: 1; width: auto; }
  .year-periods { grid-template-columns: 1fr; padding: 0.8rem; }
  .period-version { align-items: flex-start; flex-direction: column; }
  .year-pagination { align-items: flex-start; flex-direction: column; gap: 0.6rem; }
  .history-toolbar { grid-template-columns: 1fr; }
  .history-sort-direction { width: 100%; }
  .history-pagination { align-items: flex-start; flex-direction: column; gap: 0.6rem; }
}
</style>

<style>
.boletas-page .pagination .page-item.active .page-link {
  background-color: #E27910;
  border-color: #E27910;
  color: #fff;
}
.boletas-page .pagination .page-link {
  color: #0c681a;
}
.boletas-page .history-card .table-responsive { width: 100%; }
.boletas-page .history-card table { width: 100%; min-width: 1145px; table-layout: fixed; }
.boletas-page .history-card th,
.boletas-page .history-card td { overflow: hidden; vertical-align: top; }
.boletas-page .history-card thead th {
  border-bottom: 1px solid #dee2e6;
  color: #353535;
  background: var(--gray-bs-100);
  font-weight: 800;
}
.analysis-modal .modal-content,
.publish-modal .modal-content,
.boletas-dialog-modal .modal-content {
  overflow: hidden;
  border: 0;
  border-radius: 16px;
  box-shadow: 0px 2px 5px 0px var(--shadow-card);
}
.analysis-modal .modal-header,
.publish-modal .modal-header,
.boletas-dialog-modal .modal-header,
.analysis-modal .modal-content > .btn-close,
.publish-modal .modal-content > .btn-close,
.boletas-dialog-modal .modal-content > .btn-close {
  display: none;
}
.analysis-modal .modal-body,
.publish-modal .modal-body,
.boletas-dialog-modal .modal-body { padding: 0; }
.publish-confirmation { padding: 2.5rem; text-align: center; }
.boletas-dialog-bar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  min-height: 3.15rem;
  padding: 0.45rem 0.85rem;
  color: var(--color-white);
}
.boletas-dialog-bar-icon {
  grid-column: 2;
  display: grid;
  place-items: center;
  width: 1.85rem;
  height: 1.85rem;
  border: 2px solid var(--color-white);
  border-radius: 50%;
}
.boletas-dialog-bar-icon i,
.boletas-dialog-bar i {
  font-size: 1rem;
  line-height: 1;
}
.boletas-dialog-bar > i {
  grid-column: 2;
  font-size: 1.45rem;
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
.boletas-dialog-bar--warn { background: #daa511; }
.boletas-dialog-bar--danger { background: #cc0025; }
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
.boletas-dialog-title {
  max-width: none;
  margin-bottom: 0.85rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #dee2e6;
}
.boletas-dialog-body p,
.result-description {
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
.renamed-file-notice {
  margin: 0 0 0.85rem;
  padding: 0.8rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  color: #353535;
  background: var(--green-fill);
  font-size: 0.82rem;
  text-align: left;
}
.renamed-file-notice i { margin-right: 0.35rem; color: #0c681a; }
.btn-dialog-cancel,
.btn-dialog-ok {
  min-width: 9.5rem;
  padding: 0.55rem 1.15rem;
  border-radius: 8px;
  font-family: var(--font-inter);
  font-weight: 600;
}
.btn-dialog-cancel {
  border: 0;
  color: var(--color-white);
  background: #cc0025;
}
.btn-dialog-cancel:hover,
.btn-dialog-cancel:disabled {
  color: var(--color-white);
  background: #cc0025;
}
.btn-dialog-ok {
  border: 0;
  color: var(--color-white);
  background: #19a02d;
}
.btn-dialog-ok:hover { color: var(--color-white); background: #0c681a; }
.publication-progress { margin-top: 1.25rem; text-align: left; }
.publication-progress small {
  display: block;
  margin-top: 0.45rem;
  color: #666;
  text-align: center;
}
.publish-confirmation h3 { color: #0c681a; font-weight: 700; }
.publish-confirmation p { color: #666; }
.result-icon,
.confirm-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.2rem;
  display: grid;
  place-items: center;
  border-radius: 50%;
  font-size: 2.2rem;
}
.result-icon.is-success,
.confirm-icon { color: #0c681a; background: var(--green-fill); }
.result-icon.has-errors,
.confirm-icon.disable-icon { color: #cc0025; background: var(--gray-bs-100); }
.overwrite-warning {
  margin: 1.25rem 0 0;
  padding: 1rem;
  border: 1px solid #cbc508;
  border-radius: 14px;
  color: #E27910;
  background: var(--gray-bs-100);
  text-align: left;
}
.overwrite-warning-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #E27910;
  font-weight: 800;
}
.overwrite-warning p { margin-bottom: 0.75rem; color: #E27910; font-size: 0.86rem; }
.future-warning { border-color: #cc0025; color: #cc0025; }
.future-warning .overwrite-warning-title,
.future-warning p,
.future-warning .overwrite-check { color: #cc0025; }
.overwrite-check {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  margin: 0;
  color: #E27910;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}
.overwrite-check input { margin-top: 0.18rem; }
.btn-publish:disabled { cursor: not-allowed; opacity: 0.45; }
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin: 1.15rem 0 1.35rem;
  font-family: var(--font-inter);
}
.summary-grid div {
  padding: 1.05rem 0.7rem;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  background: var(--gray-bs-100);
}
.summary-grid span,
.summary-grid strong { display: block; }
.summary-grid span {
  margin-top: 0.2rem;
  color: #353535;
  font-size: 0.8rem;
  font-weight: 500;
}
.summary-grid strong {
  color: #353535;
  font-size: 1.15rem;
  font-weight: 600;
}
.summary-grid .summary-error { color: #cc0025; }
.summary-grid .summary-warn { color: #daa511; }
.issues-panel {
  overflow: hidden;
  margin-top: 1.2rem;
  border: 1px solid #dee2e6;
  border-radius: 14px;
  text-align: left;
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
.issues-more {
  display: block;
  padding: 0.7rem 1rem;
  color: #666;
  background: var(--gray-bs-100);
}
.result-actions,
.confirm-actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
}
.result-actions .btn,
.confirm-actions .btn {
  min-width: 9.5rem;
  padding: 0.55rem 1.15rem;
  border-radius: 8px;
  font-weight: 600;
}
@media (max-width: 900px) {
  .summary-grid { grid-template-columns: repeat(2, 1fr); }
  .issue-row { grid-template-columns: 1fr; gap: 0.2rem; }
}
</style>
