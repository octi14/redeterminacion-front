<template>
  <div class="testing-config">
    <b-alert v-if="!modules.length" show variant="warning" class="testing-config__alert">
      No hay quests configuradas para cargar.
    </b-alert>

    <template v-else>
      <section v-if="active" class="testing-config__active-session">
        <div>
          <span>Sesion de testing activa</span>
          <strong>{{ activeSessionTitle }}</strong>
          <small>{{ activeSessionDetail }}</small>
        </div>
        <div class="testing-config__active-actions">
          <b-button size="sm" variant="outline-light" @click="resumeSession">
            <i class="bi bi-box-arrow-up-right mr-1"></i>
            Retomar
          </b-button>
          <b-button size="sm" variant="outline-danger" @click="deleteActiveSession">
            <i class="bi bi-trash mr-1"></i>
            Eliminar
          </b-button>
        </div>
      </section>

      <div class="testing-config__scope" :class="{ expanded: selectedModule }">
        <section class="testing-config__panel">
          <div class="testing-config__heading">
            <div>
              <span>Alcance</span>
              <strong>Modulos a testear</strong>
            </div>
            <b-button size="sm" variant="outline-light" @click="toggleAllModules">
              {{ allModulesSelected ? 'Limpiar' : 'Todos' }}
            </b-button>
          </div>

          <div class="testing-config__modules">
            <label
              v-for="module in modules"
              :key="module.key"
            class="testing-config__module"
            :class="{
              active: selectedModuleKeys.includes(module.key),
              focused: focusedModuleKey === module.key
            }"
              @click="selectModuleFromCard(module.key)"
            >
              <input
                :checked="selectedModuleKeys.includes(module.key)"
                type="checkbox"
                @click.stop
                @change="toggleModule(module.key, $event.target.checked)"
              >
              <i :class="`bi bi-${module.icon}`"></i>
              <span>
                <strong>{{ module.label }}</strong>
                <small>{{ moduleCaseCount(module.key) }} casos</small>
              </span>
            </label>
          </div>
        </section>

        <aside v-if="selectedModule" class="testing-config__module-detail">
          <div class="testing-config__detail-heading">
            <i :class="`bi bi-${selectedModule.icon}`"></i>
            <div>
              <span>Que estas eligiendo</span>
              <strong>{{ selectedModule.label }}</strong>
            </div>
            <button type="button" aria-label="Cerrar detalle" @click="clearFocusedModule">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <p>{{ selectedModule.description }}</p>

          <div class="testing-config__detail-grid">
            <div>
              <span>Incluye</span>
              <ul>
                <li v-for="item in selectedModule.includes || []" :key="item">{{ item }}</li>
              </ul>
            </div>
            <div>
              <span>No incluye</span>
              <ul>
                <li v-for="item in selectedModule.excludes || []" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>

          <div class="testing-config__detail-note">
            <span>Recomendado para</span>
            <strong>{{ selectedModule.recommendedFor }}</strong>
          </div>

          <div class="testing-config__detail-cases">
            <span>{{ selectedModuleIsActive ? 'Ejemplos seleccionables' : 'Casos asociados' }}</span>
            <ol>
              <li v-for="testCase in selectedModulePreviewCases" :key="testCase.id">
                <strong>{{ testCase.id }}</strong>
                <small>{{ testCase.title }}</small>
              </li>
            </ol>
            <p v-if="!selectedModuleIsActive" class="testing-config__detail-hint">
              Selecciona este modulo para que estos casos aparezcan en la lista de quests.
            </p>
          </div>
        </aside>
      </div>

      <section class="testing-config__panel">
        <div class="testing-config__heading">
          <div>
            <span>Quests</span>
            <strong>{{ visibleCases.length }} casos disponibles</strong>
          </div>
          <b-button size="sm" variant="outline-light" :disabled="!visibleCases.length" @click="toggleAllCases">
            {{ allCasesSelected ? 'Limpiar' : 'Todos' }}
          </b-button>
        </div>

        <div class="testing-config__case-tools">
          <b-form-input
            v-model.trim="caseSearch"
            size="sm"
            placeholder="Buscar quest..."
          />
          <b-form-select
            v-model="caseSelectionFilter"
            size="sm"
            :options="caseSelectionFilterOptions"
          />
          <b-form-select
            v-model="caseCheckpointFilter"
            size="sm"
            :options="caseCheckpointFilterOptions"
          />
          <b-form-select
            v-model="casePerPage"
            size="sm"
            :options="casePerPageOptions"
          />
        </div>

        <div class="testing-config__cases">
          <label
            v-for="testCase in paginatedCases"
            :key="testCase.id"
            class="testing-config__case"
            :class="{ active: selectedCaseIds.includes(testCase.id) }"
          >
            <input
              v-model="selectedCaseIds"
              type="checkbox"
              :value="testCase.id"
            >
            <span>
              <strong>{{ testCase.id }} - {{ testCase.title }}</strong>
              <small>{{ moduleLabels(testCase) }} / {{ testCase.submodule }}</small>
            </span>
          </label>

          <div v-if="!visibleCases.length" class="testing-config__empty">
            {{ filteredCases.length ? 'No hay quests que coincidan con los filtros.' : 'Selecciona al menos un modulo para ver quests.' }}
          </div>
        </div>

        <div v-if="visibleCases.length" class="testing-config__pagination">
          <span>
            Mostrando {{ paginationFrom }}-{{ paginationTo }} de {{ visibleCases.length }}
          </span>
          <b-pagination
            v-model="casePage"
            :total-rows="visibleCases.length"
            :per-page="casePerPage"
            size="sm"
            class="mb-0 dev-pagination"
          />
        </div>
      </section>

      <section class="testing-config__summary">
        <div>
          <span>Sesion</span>
          <strong>{{ selectedCaseIds.length }} quests seleccionadas</strong>
          <small>
            {{ autoCheckpointCount }} checkpoints automaticos y {{ manualCheckpointCount }} confirmaciones manuales.
          </small>
        </div>
        <b-form-checkbox
          v-model="useTimer"
          switch
          class="testing-config__timer-choice"
        >
          Usar timer
        </b-form-checkbox>
        <b-button
          variant="success"
          :disabled="!canLaunch"
          @click="launch"
        >
          <i class="bi bi-play-fill mr-1"></i>
          Lanzar sesion
        </b-button>
      </section>

      <b-alert v-if="active" show variant="info" class="testing-config__alert">
        Lanzar una nueva sesion reemplaza el progreso activo.
      </b-alert>
    </template>
  </div>
</template>

<script>
function checkpointIsManual(step) {
  return !step.checkpoint || step.checkpoint.type === 'manual'
}

export default {
  name: 'TestingAssistantConfig',
  data() {
    return {
      selectedModuleKeys: [],
      selectedCaseIds: [],
      focusedModuleKey: '',
      caseSearch: '',
      caseSelectionFilter: 'all',
      caseCheckpointFilter: 'all',
      casePage: 1,
      casePerPage: 8,
      useTimer: false,
      caseSelectionFilterOptions: [
        { value: 'all', text: 'Todas' },
        { value: 'selected', text: 'Seleccionadas' },
        { value: 'unselected', text: 'Sin seleccionar' }
      ],
      caseCheckpointFilterOptions: [
        { value: 'all', text: 'Checkpoints' },
        { value: 'auto', text: 'Con auto' },
        { value: 'manual', text: 'Solo manual' },
        { value: 'mixed', text: 'Mixtas' }
      ],
      casePerPageOptions: [
        { value: 5, text: '5 por pagina' },
        { value: 8, text: '8 por pagina' },
        { value: 12, text: '12 por pagina' },
        { value: 20, text: '20 por pagina' }
      ]
    }
  },
  computed: {
    modules() {
      return this.$store.getters['testingAssistant/modules']
    },
    cases() {
      return this.$store.getters['testingAssistant/cases']
    },
    active() {
      return this.$store.state.testingAssistant.active
    },
    activeCurrentCase() {
      return this.$store.getters['testingAssistant/currentCase']
    },
    activeCurrentCaseNumber() {
      return this.$store.getters['testingAssistant/currentCaseNumber']
    },
    activeTotalCases() {
      return this.$store.getters['testingAssistant/totalCases']
    },
    activeProgress() {
      return this.$store.getters['testingAssistant/progress']
    },
    activeSessionTitle() {
      if (!this.activeCurrentCase) return 'Sesion sin caso actual'
      return `${this.activeCurrentCase.id} - ${this.activeCurrentCase.title}`
    },
    activeSessionDetail() {
      const timerLabel = this.$store.state.testingAssistant.timerEnabled
        ? (this.$store.state.testingAssistant.timerRunning ? 'timer activo' : 'timer pausado')
        : 'sin timer'
      return `Caso ${this.activeCurrentCaseNumber}/${this.activeTotalCases} · ${this.activeProgress.completedSteps}/${this.activeProgress.totalSteps} pasos · ${timerLabel}`
    },
    selectedModule() {
      return this.modules.find(module => module.key === this.focusedModuleKey) || null
    },
    selectedModuleIsActive() {
      return Boolean(this.selectedModule && this.selectedModuleKeys.includes(this.selectedModule.key))
    },
    selectedModuleCases() {
      if (!this.selectedModule) return []
      return this.cases.filter(testCase => this.caseModules(testCase).includes(this.selectedModule.key))
    },
    selectedModulePreviewCases() {
      if (!this.selectedModule) return []
      const visibleIds = new Set(this.visibleCases.map(item => item.id))
      const cases = this.selectedModuleIsActive
        ? this.selectedModuleCases.filter(testCase => visibleIds.has(testCase.id))
        : this.selectedModuleCases

      return this.diversePreviewCases(cases, 4)
    },
    filteredCases() {
      return this.cases.filter(testCase => (
        this.selectedModuleKeys.some(moduleKey => this.caseModules(testCase).includes(moduleKey))
      ))
    },
    visibleCases() {
      const search = this.caseSearch.toLowerCase()
      return this.filteredCases.filter((testCase) => {
        const selected = this.selectedCaseIds.includes(testCase.id)
        if (this.caseSelectionFilter === 'selected' && !selected) return false
        if (this.caseSelectionFilter === 'unselected' && selected) return false

        const hasAuto = (testCase.steps || []).some(step => !checkpointIsManual(step))
        const hasManual = (testCase.steps || []).some(checkpointIsManual)
        if (this.caseCheckpointFilter === 'auto' && !hasAuto) return false
        if (this.caseCheckpointFilter === 'manual' && hasAuto) return false
        if (this.caseCheckpointFilter === 'mixed' && (!hasAuto || !hasManual)) return false

        if (!search) return true
        const haystack = [
          testCase.id,
          testCase.title,
          testCase.submodule,
          testCase.goal,
          this.moduleLabels(testCase)
        ].join(' ').toLowerCase()
        return haystack.includes(search)
      })
    },
    paginatedCases() {
      const start = (this.casePage - 1) * this.casePerPage
      return this.visibleCases.slice(start, start + this.casePerPage)
    },
    paginationFrom() {
      if (!this.visibleCases.length) return 0
      return ((this.casePage - 1) * this.casePerPage) + 1
    },
    paginationTo() {
      return Math.min(this.casePage * this.casePerPage, this.visibleCases.length)
    },
    allModulesSelected() {
      return this.selectedModuleKeys.length === this.modules.length
    },
    allCasesSelected() {
      return Boolean(this.visibleCases.length) &&
        this.visibleCases.every(testCase => this.selectedCaseIds.includes(testCase.id))
    },
    selectedCases() {
      return this.cases.filter(testCase => this.selectedCaseIds.includes(testCase.id))
    },
    autoCheckpointCount() {
      return this.selectedCases
        .flatMap(testCase => testCase.steps || [])
        .filter(step => !checkpointIsManual(step)).length
    },
    manualCheckpointCount() {
      return this.selectedCases
        .flatMap(testCase => testCase.steps || [])
        .filter(checkpointIsManual).length
    },
    canLaunch() {
      return this.selectedCaseIds.length > 0
    }
  },
  watch: {
    focusedModuleKey(value) {
      this.$emit('module-detail-active', Boolean(value))
    },
    selectedModuleKeys: {
      immediate: true,
      handler(next, previous = []) {
        const allowed = new Set(this.filteredCases.map(testCase => testCase.id))
        const previousKeys = new Set(previous || [])
        const addedKeys = this.selectedModuleKeys.filter(key => !previousKeys.has(key))
        const addedCaseIds = this.cases
          .filter(testCase => addedKeys.some(moduleKey => this.caseModules(testCase).includes(moduleKey)))
          .map(testCase => testCase.id)

        this.selectedCaseIds = Array.from(new Set([
          ...this.selectedCaseIds.filter(id => allowed.has(id)),
          ...addedCaseIds
        ]))
      }
    },
    caseSearch() {
      this.casePage = 1
    },
    caseSelectionFilter() {
      this.casePage = 1
    },
    caseCheckpointFilter() {
      this.casePage = 1
    },
    casePerPage() {
      this.casePage = 1
    },
    visibleCases() {
      const pages = Math.max(1, Math.ceil(this.visibleCases.length / this.casePerPage))
      if (this.casePage > pages) {
        this.casePage = pages
      }
    }
  },
  beforeDestroy() {
    this.$emit('module-detail-active', false)
  },
  methods: {
    focusModule(key) {
      this.focusedModuleKey = key
    },
    selectModuleFromCard(key) {
      this.focusModule(key)
      if (!this.selectedModuleKeys.includes(key)) {
        this.selectedModuleKeys = [...this.selectedModuleKeys, key]
      }
    },
    toggleModule(key, checked) {
      this.focusModule(key)
      if (checked) {
        this.selectedModuleKeys = Array.from(new Set([...this.selectedModuleKeys, key]))
        return
      }
      this.selectedModuleKeys = this.selectedModuleKeys.filter(moduleKey => moduleKey !== key)
    },
    clearFocusedModule() {
      this.focusedModuleKey = ''
    },
    moduleLabel(key) {
      const module = this.$store.getters['testingAssistant/moduleByKey'](key)
      return module ? module.label : key
    },
    caseModules(testCase) {
      return Array.from(new Set([
        testCase.module,
        ...((testCase.modules || []))
      ].filter(Boolean)))
    },
    moduleLabels(testCase) {
      return this.caseModules(testCase)
        .map(key => this.moduleLabel(key))
        .join(' + ')
    },
    casePreviewPrefix(testCase) {
      const parts = String(testCase.id || '').split('-').filter(Boolean)
      if (parts.length < 2) return testCase.id || ''
      return /^\d+$/.test(parts[1]) ? parts[0] : parts.slice(0, 2).join('-')
    },
    diversePreviewCases(cases, limit = 4) {
      const selected = []
      const selectedIds = new Set()
      const usedPrefixes = new Set()

      ;(cases || []).forEach((testCase) => {
        if (selected.length >= limit) return
        const prefix = this.casePreviewPrefix(testCase)
        if (usedPrefixes.has(prefix)) return
        selected.push(testCase)
        selectedIds.add(testCase.id)
        usedPrefixes.add(prefix)
      })

      ;(cases || []).forEach((testCase) => {
        if (selected.length >= limit || selectedIds.has(testCase.id)) return
        selected.push(testCase)
        selectedIds.add(testCase.id)
      })

      return selected
    },
    moduleCaseCount(key) {
      return this.cases.filter(testCase => this.caseModules(testCase).includes(key)).length
    },
    toggleAllModules() {
      this.selectedModuleKeys = this.allModulesSelected
        ? []
        : this.modules.map(module => module.key)
    },
    toggleAllCases() {
      if (this.allCasesSelected) {
        const visibleIds = new Set(this.visibleCases.map(testCase => testCase.id))
        this.selectedCaseIds = this.selectedCaseIds.filter(id => !visibleIds.has(id))
        return
      }
      this.selectedCaseIds = Array.from(new Set([
        ...this.selectedCaseIds,
        ...this.visibleCases.map(testCase => testCase.id)
      ]))
    },
    launch() {
      if (!this.canLaunch) return
      this.$store.dispatch('testingAssistant/startSession', {
        moduleKeys: this.selectedModuleKeys,
        caseIds: this.selectedCaseIds,
        timerEnabled: this.useTimer
      })
      this.$emit('launched')
    },
    resumeSession() {
      this.$store.dispatch('testingAssistant/setMinimized', false)
      this.$store.dispatch('testingAssistant/setSummaryVisible', false)
      this.$emit('resumed')
    },
    deleteActiveSession() {
      if (process.client && !window.confirm('Eliminar la sesion de testing activa? Se pierde el progreso guardado.')) return
      this.$store.dispatch('testingAssistant/endSession')
    }
  }
}
</script>

<style scoped>
.testing-config {
  display: grid;
  gap: 1rem;
}

.testing-config__alert {
  margin: 0;
}

.testing-config__active-session {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .9rem;
  padding: .85rem 1rem;
  border: 1px solid rgba(126, 224, 184, .28);
  border-radius: 12px;
  color: #dff8ef;
  background: rgba(16, 185, 129, .13);
}

.testing-config__active-session span,
.testing-config__active-session strong,
.testing-config__active-session small {
  display: block;
}

.testing-config__active-session span {
  color: #7ee0b8;
  font-size: .68rem;
  font-weight: 900;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.testing-config__active-session strong {
  margin-top: .12rem;
  color: #ffffff;
  font-size: .95rem;
}

.testing-config__active-session small {
  margin-top: .18rem;
  color: #b6d9cc;
  font-size: .78rem;
  font-weight: 750;
}

.testing-config__active-actions {
  display: flex;
  flex-wrap: wrap;
  gap: .45rem;
  justify-content: flex-end;
}

.testing-config__active-actions .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 94px;
  font-weight: 850;
}

.testing-config__panel,
.testing-config__summary {
  border: 1px solid rgba(255, 255, 255, .08);
  border-radius: 16px;
  background: rgba(255, 255, 255, .045);
}

.testing-config__panel {
  display: grid;
  gap: .9rem;
  padding: 1rem;
}

.testing-config__scope {
  display: grid;
  gap: 1rem;
}

.testing-config__scope.expanded {
  grid-template-columns: minmax(300px, .9fr) minmax(260px, .62fr);
  align-items: start;
}

.testing-config__heading,
.testing-config__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .8rem;
}

.testing-config__heading span,
.testing-config__summary span {
  display: block;
  color: #65e6b8;
  font-size: .68rem;
  font-weight: 900;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.testing-config__heading strong,
.testing-config__summary strong {
  display: block;
  color: #ffffff;
  font-size: .94rem;
}

.testing-config__summary {
  padding: 1rem;
}

.testing-config__summary small {
  display: block;
  margin-top: .25rem;
  color: #a7c9bd;
  font-size: .78rem;
}

.testing-config__timer-choice {
  margin: 0;
  color: #dff8ef;
  font-size: .82rem;
  font-weight: 850;
  white-space: nowrap;
}

.testing-config__timer-choice ::v-deep .custom-control-label {
  cursor: pointer;
}

.testing-config__modules,
.testing-config__cases {
  display: grid;
  gap: .55rem;
}

.testing-config__case-tools {
  display: grid;
  grid-template-columns: minmax(160px, 1fr) minmax(120px, .55fr) minmax(120px, .55fr) minmax(120px, .55fr);
  gap: .5rem;
}

.testing-config__case-tools ::v-deep .form-control,
.testing-config__case-tools ::v-deep .custom-select {
  border-color: rgba(126, 224, 184, .26);
  color: #dff8ef;
  background-color: rgba(255, 255, 255, .08);
  font-weight: 700;
}

.testing-config__case-tools ::v-deep .form-control::placeholder {
  color: #89aca0;
}

.testing-config__case-tools ::v-deep .custom-select option {
  color: #193d33;
  background: #ffffff;
}

.testing-config__modules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.testing-config__scope.expanded .testing-config__modules {
  grid-template-columns: 1fr;
  max-height: 410px;
  overflow-y: auto;
  padding-right: .25rem;
}

.testing-config__scope.expanded .testing-config__modules::-webkit-scrollbar {
  width: 7px;
}

.testing-config__scope.expanded .testing-config__modules::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(126, 224, 184, .32);
}

.testing-config__module,
.testing-config__case {
  margin: 0;
  border: 1px solid rgba(255, 255, 255, .08);
  color: #d7efe6;
  background: rgba(255, 255, 255, .035);
  cursor: pointer;
  transition: .16s ease;
}

.testing-config__module {
  display: grid;
  grid-template-columns: 18px 28px 1fr;
  gap: .5rem;
  align-items: center;
  min-height: 58px;
  padding: .65rem;
  border-radius: 13px;
}

.testing-config__case {
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: .65rem;
  align-items: start;
  padding: .7rem;
  border-radius: 12px;
}

.testing-config__module.active,
.testing-config__case.active {
  border-color: rgba(126, 224, 184, .42);
  background: rgba(20, 184, 124, .15);
}

.testing-config__module.focused {
  box-shadow: 0 0 0 2px rgba(126, 224, 184, .16);
}

.testing-config__module input,
.testing-config__case input {
  width: 16px;
  height: 16px;
  margin-top: .1rem;
  accent-color: #10b981;
}

.testing-config__module i {
  color: #7ee0b8;
  font-size: 1rem;
}

.testing-config__module span,
.testing-config__module strong,
.testing-config__module small,
.testing-config__case strong,
.testing-config__case small {
  display: block;
}

.testing-config__module span {
  min-width: 0;
  overflow: hidden;
}

.testing-config__module strong {
  overflow: hidden;
  font-size: .78rem;
  font-weight: 850;
  line-height: 1.2;
  text-overflow: ellipsis;
}

.testing-config__module small {
  margin-top: .18rem;
  color: #8fb7aa;
  font-size: .68rem;
  font-weight: 800;
}

.testing-config__case strong {
  color: #ffffff;
  font-size: .82rem;
  line-height: 1.25;
}

.testing-config__case small {
  margin-top: .2rem;
  color: #a7c9bd;
  font-size: .72rem;
}

.testing-config__empty {
  display: grid;
  place-items: center;
  min-height: 96px;
  border: 1px dashed rgba(255, 255, 255, .14);
  border-radius: 14px;
  color: #a7c9bd;
  text-align: center;
}

.testing-config__pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .75rem;
  color: #a7c9bd;
  font-size: .76rem;
}

.testing-config__pagination span {
  min-width: 0;
}

.testing-config__pagination ::v-deep .page-link {
  border-color: rgba(126, 224, 184, .22);
  color: #dff8ef;
  background: rgba(255, 255, 255, .06);
}

.testing-config__pagination ::v-deep .page-item.active .page-link {
  border-color: #10b981;
  color: #062019;
  background: #7ee0b8;
}

.testing-config__pagination ::v-deep .page-item.disabled .page-link {
  color: #617d73;
  background: rgba(255, 255, 255, .03);
}

.testing-config__module-detail {
  order: -1;
  display: grid;
  gap: .9rem;
  min-height: 100%;
  padding: 1rem;
  border: 1px solid rgba(126, 224, 184, .18);
  border-radius: 16px;
  background: rgba(5, 34, 26, .58);
}

.testing-config__detail-heading {
  display: grid;
  grid-template-columns: 38px 1fr 32px;
  gap: .75rem;
  align-items: center;
}

.testing-config__detail-heading > i {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: #07271c;
  background: #7ee0b8;
}

.testing-config__detail-heading span,
.testing-config__detail-grid span,
.testing-config__detail-note span,
.testing-config__detail-cases > span {
  display: block;
  color: #65e6b8;
  font-size: .66rem;
  font-weight: 900;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.testing-config__detail-heading strong {
  display: block;
  color: #ffffff;
  font-size: .98rem;
}

.testing-config__detail-heading button {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: 50%;
  color: #d7efe6;
  background: rgba(255, 255, 255, .06);
}

.testing-config__module-detail p {
  margin: 0;
  color: #d7efe6;
  font-size: .86rem;
  line-height: 1.45;
}

.testing-config__module-detail .testing-config__detail-hint {
  margin-top: .65rem;
  color: #a7c9bd;
  font-size: .76rem;
  line-height: 1.35;
}

.testing-config__detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .75rem;
}

.testing-config__detail-grid > div,
.testing-config__detail-note,
.testing-config__detail-cases {
  padding: .75rem;
  border: 1px solid rgba(255, 255, 255, .08);
  border-radius: 13px;
  background: rgba(255, 255, 255, .045);
}

.testing-config__detail-grid ul,
.testing-config__detail-cases ol {
  display: grid;
  gap: .35rem;
  margin: .55rem 0 0;
  padding-left: 1.05rem;
  color: #cce6dd;
  font-size: .78rem;
  line-height: 1.35;
}

.testing-config__detail-note strong {
  display: block;
  margin-top: .35rem;
  color: #ffffff;
  font-size: .84rem;
  line-height: 1.35;
}

.testing-config__detail-cases li strong,
.testing-config__detail-cases li small {
  display: block;
}

.testing-config__detail-cases li strong {
  color: #ffffff;
  font-size: .78rem;
}

.testing-config__detail-cases li small {
  margin-top: .08rem;
  color: #a7c9bd;
  font-size: .74rem;
  line-height: 1.25;
}

@media (max-width: 760px) {
  .testing-config__scope.expanded,
  .testing-config__detail-grid {
    grid-template-columns: 1fr;
  }

  .testing-config__modules {
    grid-template-columns: 1fr;
  }

  .testing-config__heading,
  .testing-config__summary,
  .testing-config__pagination {
    align-items: stretch;
    flex-direction: column;
  }

  .testing-config__case-tools {
    grid-template-columns: 1fr;
  }
}
</style>
