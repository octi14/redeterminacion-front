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
                  :key="`${version.importBatchId || version.importacionId}-${version.periodo}`"
                  class="period-version"
                  :class="{ active: version.habilitado, toggling: togglingVersionKey === versionToggleKey(version) }"
                  role="button"
                  tabindex="0"
                  @click="togglePeriodVersion(version)"
                  @keydown.enter.prevent="togglePeriodVersion(version)"
                >
                  <div class="version-file">
                    <i class="bi bi-file-earmark-spreadsheet"></i>
                    <div>
                      <strong>{{ version.nombreArchivo }}</strong>
                      <small>{{ formatNumber(version.cantidadEntradas) }} entradas · {{ formatDateTime(version.publicadoAt || version.actualizadoAt) }}</small>
                    </div>
                  </div>
                  <span class="version-state" :class="periodVersionStateClass(version)">
                    <b-spinner v-if="togglingVersionKey === versionToggleKey(version)" small></b-spinner>
                    <template v-else>{{ periodVersionStateLabel(version) }}</template>
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
            <p>Importaciones registradas desde este panel.</p>
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
              <option value="procesando">Procesando</option>
              <option value="completada">Completada</option>
              <option value="fallida">Fallida</option>
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
          <p>{{ importProgress.message }}</p>
          <div class="import-progress-wrap">
            <b-progress
              :value="importProgress.percentage"
              animated
              height="8px"
              variant="success"
            ></b-progress>
            <small v-if="importProgress.processed || importProgress.total">
              {{ formatNumber(importProgress.processed) }}
              <template v-if="importProgress.total">
                de ~{{ formatNumber(importProgress.total) }}
              </template>
              boletas
            </small>
          </div>
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
      importProgress: {
        message: 'Subiendo el archivo...',
        percentage: 0,
        processed: 0,
        total: 0,
      },
      loadedPeriods: [],
      periodsLoading: false,
      periodStatusFilter: 'all',
      periodYearPage: 1,
      periodYearsPerPage: 5,
      togglingVersionKey: null,
      history: [],
      historyLoading: false,
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
      ],
    }
  },
  computed: {
    puedeAdministrar() {
      return ['admin', 'master', 'true', 'boletas', 'hacienda'].includes(
        String(useUserStore().admin || '').trim().toLowerCase()
      )
    },
    periodYears() {
      const grouped = {}
      this.loadedPeriods.forEach((item) => {
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
            versions: [],
          }
        }
        grouped[item.anio][item.periodo].versions.push(item)
        if (item.habilitado) {
          grouped[item.anio][item.periodo].habilitadas += 1
        } else {
          grouped[item.anio][item.periodo].deshabilitadas += 1
        }
        grouped[item.anio][item.periodo].habilitado =
          grouped[item.anio][item.periodo].habilitadas > 0
      })
      return Object.keys(grouped)
        .map(Number)
        .sort((a, b) => b - a)
        .map((year) => {
          const periods = Object.values(grouped[year]).sort((a, b) => a.cuota - b.cuota)
          return {
            year,
            periods,
            enabledCount: periods.filter((item) => item.habilitado).length,
          }
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
        .filter((item) => {
          const matchesSearch =
            !search ||
            item.fileName.toLocaleLowerCase('es').includes(search) ||
            item.uploadedBy.toLocaleLowerCase('es').includes(search)
          const matchesStatus =
            this.historyStatusFilter === 'all' || item.status === this.historyStatusFilter
          return matchesSearch && matchesStatus
        })
        .sort((left, right) => {
          let comparison
          if (this.historySortBy === 'entries') {
            comparison = left.entries - right.entries
          } else if (this.historySortBy === 'periodSort') {
            comparison = left.periodSort - right.periodSort
          } else {
            comparison = left.uploadedAtSort - right.uploadedAtSort
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
      return this.filteredHistory.length ? (this.historyPage - 1) * this.historyPerPage + 1 : 0
    },
    historyLastRow() {
      return Math.min(this.historyPage * this.historyPerPage, this.filteredHistory.length)
    },
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
  },
  mounted() {
    this.loadConfig()
    this.loadPeriods()
    this.loadHistory()
  },
  methods: {
    pause(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
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
    formatDateTime(value) {
      if (!value) return '-'
      return new Date(value).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
    },
    versionToggleKey(version) {
      return `${version.importBatchId || version.importacionId}-${version.anio}-${version.cuota}`
    },
    statusLabel(status) {
      return {
        procesando: 'Procesando',
        completada: 'Completada',
        fallida: 'Fallida',
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
      return version.habilitado ? 'Habilitado' : 'Habilitar'
    },
    periodVersionStateClass(version) {
      return version.habilitado ? 'enabled' : 'disabled'
    },
    mapHistoryItem(item) {
      const periodos = item.periodos || []
      return {
        id: item._id,
        fileName: item.nombreArchivo || '-',
        fileSize: this.formatFileSize(item.tamanoBytes),
        uploadedAt: item.createdAt,
        uploadedAtSort: new Date(item.createdAt || 0).getTime(),
        period: periodos.join(', ') || '-',
        periodSort: Math.max(
          0,
          ...periodos.map((period) => {
            const [month, year] = String(period).split('/').map(Number)
            return (year || 0) * 100 + (month || 0)
          })
        ),
        entries: item.cantidadEntradas || 0,
        errors: item.cantidadErrores || 0,
        warnings: item.cantidadAdvertencias || 0,
        uploadedBy: item.subidoPor?.username || '-',
        status: item.estado || 'procesando',
      }
    },
    async loadHistory() {
      if (!this.puedeAdministrar) return
      this.historyLoading = true
      try {
        const response = await ProvinciaNetService.listarImportacionesUrbana(
          this.$axios,
          this.authHeaders()
        )
        const list = response?.data || response || []
        this.history = (Array.isArray(list) ? list : []).map(this.mapHistoryItem)
      } catch (_) {
        this.history = []
      } finally {
        this.historyLoading = false
      }
    },
    async loadPeriods() {
      if (!this.puedeAdministrar) return
      this.periodsLoading = true
      try {
        const response = await ProvinciaNetService.listarPeriodosUrbana(
          this.$axios,
          this.authHeaders()
        )
        const list = response?.data || response || []
        this.loadedPeriods = Array.isArray(list) ? list : []
      } catch (_) {
        this.showToast('No se pudieron cargar los períodos publicados.', {
          variant: 'danger',
          solid: true,
        })
      } finally {
        this.periodsLoading = false
      }
    },
    async togglePeriodVersion(version) {
      if (!version?.importBatchId || this.togglingVersionKey) return
      const key = this.versionToggleKey(version)
      this.togglingVersionKey = key
      try {
        await ProvinciaNetService.cambiarEstadoPeriodoUrbana(
          this.$axios,
          {
            importBatchId: version.importBatchId,
            anio: version.anio,
            cuota: version.cuota,
            habilitar: !version.habilitado,
          },
          this.authHeaders()
        )
        await this.loadPeriods()
        this.showToast(
          version.habilitado
            ? 'El período quedó deshabilitado.'
            : 'El período quedó habilitado.',
          { variant: 'success', solid: true }
        )
      } catch (error) {
        this.showToast(
          error?.response?.data?.message || error?.message || 'No se pudo cambiar el estado del período.',
          { title: 'Error', variant: 'danger', solid: true }
        )
      } finally {
        this.togglingVersionKey = null
      }
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
    async waitForImport(importId) {
      while (this.importing) {
        await this.pause(1600)
        const response = await ProvinciaNetService.progresoImportUrbana(
          this.$axios,
          importId,
          this.authHeaders()
        )
        const item = response?.data || response
        const progress = item.progreso || {}
        this.importProgress = {
          message: progress.mensaje || 'Procesando la importación...',
          percentage: progress.porcentaje || 0,
          processed: progress.procesadas || 0,
          total: progress.total || 0,
        }
        if (item.estado === 'completada') {
          return item.resultado
        }
        if (item.estado === 'fallida') {
          const err = new Error(progress.error || 'La importación no pudo completarse.')
          err.analisis = item.resultado || null
          throw err
        }
      }
      return null
    },
    async startImport() {
      if (!this.selectedFile || this.importing) return
      this.importing = true
      this.lastImport = null
      this.showImportResult = false
      this.importProgress = {
        message: 'Subiendo el archivo...',
        percentage: 5,
        processed: 0,
        total: 0,
      }
      try {
        const response = await ProvinciaNetService.importarUrbana(
          this.$axios,
          this.selectedFile,
          this.fileRequestHeaders()
        )
        const started = response?.data || response
        if (!started?.importId) {
          throw new Error('No se recibió el identificador de importación.')
        }
        this.importProgress = {
          message: 'Archivo recibido. Iniciando importación...',
          percentage: 10,
          processed: 0,
          total: 0,
        }
        const data = await this.waitForImport(started.importId)
        this.lastImport = data
        this.clearFile()
        this.showImportResult = true
        await Promise.all([this.loadHistory(), this.loadPeriods()])
        this.showToast(
          `Se importaron ${this.formatNumber(data.cantidadImportadas)} boletas urbanas.`,
          { title: 'Importación completada', variant: 'success', solid: true }
        )
      } catch (error) {
        const payload = error?.response?.data || error?.data || {}
        const analisis = error.analisis || payload.data
        if (analisis) {
          this.lastImport = {
            ...analisis,
            cantidadImportadas: analisis.cantidadImportadas || 0,
          }
        }
        const cortada =
          !error?.response &&
          !error.analisis &&
          (error?.code === 'ECONNABORTED' ||
            /network|timeout|aborted|exceeded/i.test(String(error?.message || '')))
        this.showToast(
          cortada
            ? 'La conexión se cortó durante la importación. El archivo puede ser muy grande o el servidor se quedó sin memoria. Reintentá; si vuelve a fallar, avisanos.'
            : payload.message || error.message || 'No se pudo importar el archivo.',
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
.import-progress-wrap {
  width: 100%;
  margin: 0.75rem 0 1rem;
  text-align: left;
}
.import-progress-wrap small {
  display: block;
  margin-top: 0.4rem;
  color: #666;
  font-size: 0.8rem;
}
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
  cursor: pointer;
}
.period-version:first-child { border-top: 0; }
.period-version.toggling { opacity: 0.65; pointer-events: none; }
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
  min-width: 5.5rem;
  padding: 0.28rem 0.7rem;
  border: 1px solid #19a02d;
  border-radius: 8px;
  color: #19a02d;
  background: var(--color-white);
  font-size: 0.72rem;
  font-weight: 700;
  text-align: center;
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
.result-cell span { display: block; white-space: nowrap; font-size: 0.78rem; font-weight: 700; }
.status-badge {
  display: inline-block;
  padding: 0.35rem 0.65rem;
  border-radius: 100px;
  font-size: 0.73rem;
  font-weight: 800;
  white-space: nowrap;
}
.status-procesando { color: #E27910; background: var(--gray-bs-100); }
.status-completada { color: #0c681a; background: var(--green-fill); }
.status-fallida { color: #cc0025; background: var(--gray-bs-100); }
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
  .summary-grid { grid-template-columns: repeat(2, 1fr); }
  .issue-row { grid-template-columns: 1fr; gap: 0.2rem; }
}
</style>

<style>
.boletas-urbana-page .pagination .page-item.active .page-link {
  background-color: #E27910;
  border-color: #E27910;
  color: #fff;
}
.boletas-urbana-page .pagination .page-link {
  color: #0c681a;
}
.boletas-urbana-page .history-card .table-responsive { width: 100%; }
.boletas-urbana-page .history-card table { width: 100%; min-width: 980px; table-layout: fixed; }
.boletas-urbana-page .history-card th,
.boletas-urbana-page .history-card td { overflow: hidden; vertical-align: top; }
.boletas-urbana-page .history-card thead th {
  border-bottom: 1px solid #dee2e6;
  color: #353535;
  background: var(--gray-bs-100);
  font-weight: 800;
}
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

