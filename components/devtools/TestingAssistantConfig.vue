<template>
  <div class="testing-config">
    <b-alert v-if="!modules.length" show variant="warning" class="testing-config__alert">
      No hay quests configuradas para cargar.
    </b-alert>

    <template v-else>
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
            :class="{ active: selectedModuleKeys.includes(module.key) }"
          >
            <input
              v-model="selectedModuleKeys"
              type="checkbox"
              :value="module.key"
            >
            <i :class="`bi bi-${module.icon}`"></i>
            <span>{{ module.label }}</span>
          </label>
        </div>
      </section>

      <section class="testing-config__panel">
        <div class="testing-config__heading">
          <div>
            <span>Quests</span>
            <strong>{{ filteredCases.length }} casos disponibles</strong>
          </div>
          <b-button size="sm" variant="outline-light" :disabled="!filteredCases.length" @click="toggleAllCases">
            {{ allCasesSelected ? 'Limpiar' : 'Todos' }}
          </b-button>
        </div>

        <div class="testing-config__cases">
          <label
            v-for="testCase in filteredCases"
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
              <small>{{ moduleLabel(testCase.module) }} / {{ testCase.submodule }}</small>
            </span>
          </label>

          <div v-if="!filteredCases.length" class="testing-config__empty">
            Selecciona al menos un modulo para ver quests.
          </div>
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
        Hay una sesion activa. Lanzar una nueva reemplaza el progreso actual.
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
      selectedModuleKeys: ['auth', 'navigation', 'security'],
      selectedCaseIds: []
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
    filteredCases() {
      return this.cases.filter(testCase => this.selectedModuleKeys.includes(testCase.module))
    },
    allModulesSelected() {
      return this.selectedModuleKeys.length === this.modules.length
    },
    allCasesSelected() {
      return Boolean(this.filteredCases.length) &&
        this.filteredCases.every(testCase => this.selectedCaseIds.includes(testCase.id))
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
    selectedModuleKeys: {
      immediate: true,
      handler() {
        const allowed = new Set(this.filteredCases.map(testCase => testCase.id))
        this.selectedCaseIds = this.selectedCaseIds.filter(id => allowed.has(id))
        if (!this.selectedCaseIds.length && this.filteredCases.length) {
          this.selectedCaseIds = this.filteredCases.map(testCase => testCase.id)
        }
      }
    }
  },
  methods: {
    moduleLabel(key) {
      const module = this.$store.getters['testingAssistant/moduleByKey'](key)
      return module ? module.label : key
    },
    toggleAllModules() {
      this.selectedModuleKeys = this.allModulesSelected
        ? []
        : this.modules.map(module => module.key)
    },
    toggleAllCases() {
      if (this.allCasesSelected) {
        this.selectedCaseIds = []
        return
      }
      this.selectedCaseIds = this.filteredCases.map(testCase => testCase.id)
    },
    launch() {
      if (!this.canLaunch) return
      this.$store.dispatch('testingAssistant/startSession', {
        moduleKeys: this.selectedModuleKeys,
        caseIds: this.selectedCaseIds
      })
      this.$emit('launched')
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

.testing-config__modules,
.testing-config__cases {
  display: grid;
  gap: .55rem;
}

.testing-config__modules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
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
.testing-config__case strong,
.testing-config__case small {
  display: block;
}

.testing-config__module span {
  min-width: 0;
  overflow: hidden;
  font-size: .78rem;
  font-weight: 850;
  line-height: 1.2;
  text-overflow: ellipsis;
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

@media (max-width: 760px) {
  .testing-config__modules {
    grid-template-columns: 1fr;
  }

  .testing-config__heading,
  .testing-config__summary {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
