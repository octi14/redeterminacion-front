<template>
  <transition name="testing-window">
    <aside
      v-if="active && currentCase"
      class="testing-window"
      :class="{ minimized }"
      :style="windowStyle"
      aria-label="Asistente de Testing"
    >
      <header class="testing-window__header" @mousedown="startDrag">
        <div>
          <span>Asistente de Testing</span>
          <strong>{{ currentCase.id }}</strong>
        </div>
        <div class="testing-window__actions">
          <button type="button" :title="minimized ? 'Expandir' : 'Minimizar'" @click.stop="toggleMinimized">
            <i :class="minimized ? 'bi bi-arrows-angle-expand' : 'bi bi-dash-lg'"></i>
          </button>
          <button type="button" title="Finalizar sesion" @click.stop="confirmEndSession">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </header>

      <template v-if="!minimized">
        <section class="testing-window__progress">
          <div>
            <span>Caso {{ currentCaseNumber }} de {{ totalCases }}</span>
            <strong>{{ currentCase.title }}</strong>
          </div>
          <div class="testing-window__bar" aria-hidden="true">
            <span :style="{ width: progressWidth }"></span>
          </div>
        </section>

        <section class="testing-window__body">
          <p class="testing-window__goal">{{ currentCase.goal }}</p>

          <div class="testing-window__meta">
            <div>
              <span>Pagina</span>
              <button type="button" @click="goToRoute(currentCase.route)">
                {{ currentCase.route || 'Sin ruta' }}
              </button>
            </div>
            <div>
              <span>Usuario</span>
              <strong>{{ suggestedUserLabel }}</strong>
              <small v-if="suggestedUser">{{ suggestedUser.username }}</small>
            </div>
            <div v-if="currentCase.permissions && currentCase.permissions.length">
              <span>Permisos</span>
              <code>{{ currentCase.permissions.join(', ') }}</code>
            </div>
            <div v-if="negativeUser">
              <span>Negativo</span>
              <strong>{{ negativeUser.label }}</strong>
            </div>
          </div>

          <div class="testing-window__expected">
            <span>Resultado esperado</span>
            <p>{{ currentCase.expected }}</p>
          </div>

          <ol class="testing-window__steps">
            <li
              v-for="step in currentSteps"
              :key="step.id"
              :class="{
                done: isStepDone(step),
                current: currentStep && currentStep.id === step.id,
                auto: checkpointIsAuto(step)
              }"
            >
              <div>
                <span>{{ checkpointLabel(step) }}</span>
                <p>{{ step.text }}</p>
              </div>
              <button
                type="button"
                :title="isStepDone(step) ? 'Desmarcar paso' : 'Confirmar paso'"
                @click="toggleStep(step)"
              >
                <i :class="isStepDone(step) ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
              </button>
            </li>
          </ol>

          <label class="testing-window__notes">
            <span>Notas del tester</span>
            <b-form-textarea
              v-model="note"
              rows="3"
              max-rows="5"
              placeholder="Datos usados, evidencia, bloqueo o detalle a revisar..."
              @blur="saveNote"
            />
          </label>
        </section>

        <footer class="testing-window__footer">
          <b-button size="sm" variant="outline-secondary" :disabled="currentCaseNumber <= 1" @click="previousCase">
            <i class="bi bi-arrow-left"></i>
          </b-button>
          <b-button size="sm" variant="outline-warning" @click="blockCase">
            Bloqueado
          </b-button>
          <b-button size="sm" variant="success" :disabled="!currentCaseCompleted" @click="completeAndNext">
            {{ currentCaseNumber === totalCases ? 'Completar' : 'Siguiente' }}
          </b-button>
        </footer>
      </template>

      <section v-else class="testing-window__mini">
        <div class="testing-window__mini-title">
          <span>Caso {{ currentCaseNumber }} de {{ totalCases }}</span>
          <strong>{{ currentCase.title }}</strong>
        </div>

        <ol class="testing-window__mini-steps">
          <li
            v-for="step in minimizedSteps"
            :key="step.id"
            :class="{
              done: isStepDone(step),
              current: currentStep && currentStep.id === step.id,
              auto: checkpointIsAuto(step)
            }"
          >
            <button
              type="button"
              :title="isStepDone(step) ? 'Desmarcar paso' : 'Confirmar paso'"
              @click="toggleStep(step)"
            >
              <i :class="isStepDone(step) ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
            </button>
            <div>
              <span>{{ checkpointLabel(step) }}</span>
              <p>{{ step.text }}</p>
            </div>
          </li>
        </ol>
      </section>
    </aside>
  </transition>
</template>

<script>
export default {
  name: 'TestingAssistantFloatingWindow',
  data() {
    return {
      dragging: false,
      dragStart: null,
      note: ''
    }
  },
  computed: {
    active() {
      return this.$store.state.testingAssistant.active
    },
    minimized() {
      return this.$store.state.testingAssistant.minimized
    },
    position() {
      return this.$store.state.testingAssistant.position || { top: 96, right: 24 }
    },
    windowStyle() {
      return {
        top: `${this.position.top}px`,
        right: `${this.position.right}px`
      }
    },
    currentCase() {
      return this.$store.getters['testingAssistant/currentCase']
    },
    currentSteps() {
      return this.$store.getters['testingAssistant/currentCaseSteps']
    },
    currentStep() {
      return this.currentSteps.find(step => !this.isStepDone(step)) || this.currentSteps[this.currentSteps.length - 1] || null
    },
    minimizedSteps() {
      const nextIndex = this.currentSteps.findIndex(step => !this.isStepDone(step))
      if (nextIndex < 0) {
        return this.currentSteps.slice(Math.max(0, this.currentSteps.length - 2))
      }

      const previousCompleted = this.currentSteps
        .slice(0, nextIndex)
        .reverse()
        .find(step => this.isStepDone(step))

      return [previousCompleted, this.currentSteps[nextIndex]].filter(Boolean)
    },
    currentCaseCompleted() {
      return this.$store.getters['testingAssistant/currentCaseCompleted']
    },
    currentCaseNumber() {
      return this.$store.getters['testingAssistant/currentCaseNumber']
    },
    totalCases() {
      return this.$store.getters['testingAssistant/totalCases']
    },
    progress() {
      return this.$store.getters['testingAssistant/progress']
    },
    progressWidth() {
      if (!this.progress.totalSteps) return '0%'
      return `${Math.round((this.progress.completedSteps / this.progress.totalSteps) * 100)}%`
    },
    suggestedUser() {
      return this.currentCase && this.currentCase.suggestedUser
        ? this.$store.getters['testingAssistant/userByKey'](this.currentCase.suggestedUser)
        : null
    },
    negativeUser() {
      return this.currentCase && this.currentCase.negativeUser
        ? this.$store.getters['testingAssistant/userByKey'](this.currentCase.negativeUser)
        : null
    },
    suggestedUserLabel() {
      return this.suggestedUser ? this.suggestedUser.label : 'Sin login o usuario indicado en el paso'
    },
    currentPermissions() {
      return this.$permissionsForCurrentUser ? this.$permissionsForCurrentUser() : []
    },
    currentUsername() {
      return this.$store.state.user.username
    },
    currentNote() {
      return this.currentCase
        ? this.$store.state.testingAssistant.notesByCaseId[this.currentCase.id] || ''
        : ''
    }
  },
  watch: {
    currentCase: {
      immediate: true,
      handler() {
        this.note = this.currentNote
        this.$nextTick(() => this.checkCurrentStep())
      }
    },
    '$route.fullPath'() {
      this.checkCurrentStep()
    },
    currentPermissions() {
      this.checkCurrentStep()
    },
    currentUsername() {
      this.checkCurrentStep()
    }
  },
  mounted() {
    this.$store.dispatch('testingAssistant/hydrate')
    if (process.client) {
      window.addEventListener('mousemove', this.onDrag)
      window.addEventListener('mouseup', this.stopDrag)
    }
  },
  beforeDestroy() {
    if (process.client) {
      window.removeEventListener('mousemove', this.onDrag)
      window.removeEventListener('mouseup', this.stopDrag)
    }
  },
  methods: {
    checkpointIsAuto(step) {
      return step.checkpoint && step.checkpoint.type !== 'manual'
    },
    checkpointLabel(step) {
      if (this.isStepDone(step)) return 'Completado'
      if (this.checkpointIsAuto(step)) return this.checkpointPasses(step) ? 'Detectado' : 'Pendiente auto'
      return 'Manual'
    },
    isStepDone(step) {
      return this.$store.state.testingAssistant.completedStepIds.includes(step.id)
    },
    toggleStep(step) {
      if (this.isStepDone(step)) {
        this.$store.dispatch('testingAssistant/uncompleteStep', step.id)
      } else {
        this.$store.dispatch('testingAssistant/completeStep', step.id)
      }
    },
    checkCurrentStep() {
      if (!this.currentStep || !this.checkpointIsAuto(this.currentStep)) return
      if (this.checkpointPasses(this.currentStep)) {
        this.$store.dispatch('testingAssistant/completeStep', this.currentStep.id)
        this.$nextTick(() => this.checkCurrentStep())
      }
    },
    checkpointPasses(step) {
      const checkpoint = step.checkpoint || { type: 'manual' }
      const routePath = this.$route ? this.$route.path : ''
      const permissions = this.currentPermissions

      if (checkpoint.type === 'route') {
        return Boolean(checkpoint.path) && routePath === checkpoint.path
      }

      if (checkpoint.type === 'route-not') {
        return Boolean(checkpoint.path) && routePath !== checkpoint.path
      }

      if (checkpoint.type === 'permissions') {
        return this.hasEveryPermission(checkpoint.permissions || [], permissions)
      }

      if (checkpoint.type === 'permissions-any') {
        return (checkpoint.permissions || []).some(permission => this.hasPermission(permission, permissions))
      }

      if (checkpoint.type === 'permissions-exact') {
        const expected = checkpoint.permissions || []
        return expected.length === permissions.length &&
          expected.every(permission => permissions.includes(permission))
      }

      if (checkpoint.type === 'user') {
        return Boolean(checkpoint.username) && checkpoint.username === this.currentUsername
      }

      return false
    },
    hasPermission(permission, permissions) {
      return permissions.includes('*') || permissions.includes(permission)
    },
    hasEveryPermission(required, permissions) {
      return required.every(permission => this.hasPermission(permission, permissions))
    },
    goToRoute(route) {
      if (!route) return
      this.$router.push(route).catch(() => {})
    },
    saveNote() {
      if (!this.currentCase) return
      this.$store.dispatch('testingAssistant/saveNote', {
        caseId: this.currentCase.id,
        note: this.note
      })
    },
    toggleMinimized() {
      this.$store.dispatch('testingAssistant/setMinimized', !this.minimized)
    },
    confirmEndSession() {
      if (!process.client || window.confirm('Finalizar la sesion de testing activa?')) {
        this.$store.dispatch('testingAssistant/endSession')
      }
    },
    blockCase() {
      this.saveNote()
      this.$store.dispatch('testingAssistant/blockCurrentCase', this.note)
      this.$store.dispatch('testingAssistant/nextCase')
    },
    completeAndNext() {
      this.saveNote()
      this.$store.dispatch('testingAssistant/completeCurrentCase')
      if (this.currentCaseNumber === this.totalCases) {
        this.$store.dispatch('testingAssistant/setMinimized', true)
        return
      }
      this.$store.dispatch('testingAssistant/nextCase')
    },
    previousCase() {
      this.saveNote()
      this.$store.dispatch('testingAssistant/previousCase')
    },
    startDrag(event) {
      if (!process.client || event.button !== 0) return
      this.dragging = true
      this.dragStart = {
        x: event.clientX,
        y: event.clientY,
        top: this.position.top,
        right: this.position.right
      }
    },
    onDrag(event) {
      if (!this.dragging || !this.dragStart) return
      const nextTop = Math.max(12, this.dragStart.top + event.clientY - this.dragStart.y)
      const nextRight = Math.max(12, this.dragStart.right - (event.clientX - this.dragStart.x))
      this.$store.dispatch('testingAssistant/setPosition', {
        top: nextTop,
        right: nextRight
      })
    },
    stopDrag() {
      this.dragging = false
      this.dragStart = null
    }
  }
}
</script>

<style scoped>
.testing-window {
  position: fixed;
  z-index: 2600;
  width: min(420px, calc(100vw - 24px));
  max-height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(16, 185, 129, .25);
  border-radius: 8px;
  color: #10231d;
  background: #fbfffd;
  box-shadow: 0 18px 60px rgba(0, 0, 0, .28);
}

.testing-window.minimized {
  width: min(360px, calc(100vw - 24px));
}

.testing-window__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .75rem;
  padding: .75rem .85rem;
  color: #ffffff;
  background: #123b31;
  cursor: move;
  user-select: none;
}

.testing-window__header span,
.testing-window__header strong {
  display: block;
}

.testing-window__header span {
  color: #91f2cf;
  font-size: .66rem;
  font-weight: 900;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.testing-window__header strong {
  font-size: .92rem;
}

.testing-window__actions {
  display: flex;
  gap: .35rem;
}

.testing-window__actions button {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, .18);
  border-radius: 6px;
  color: #ffffff;
  background: rgba(255, 255, 255, .08);
}

.testing-window__progress {
  display: grid;
  gap: .65rem;
  padding: .85rem;
  border-bottom: 1px solid #dcebe5;
}

.testing-window__progress span,
.testing-window__expected span,
.testing-window__notes span,
.testing-window__meta span {
  display: block;
  color: #477267;
  font-size: .68rem;
  font-weight: 900;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.testing-window__progress strong {
  display: block;
  margin-top: .15rem;
  color: #0f241e;
  font-size: 1rem;
  line-height: 1.25;
}

.testing-window__bar {
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: #e1eee9;
}

.testing-window__bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #10b981;
  transition: width .2s ease;
}

.testing-window__body {
  display: grid;
  gap: .8rem;
  min-height: 0;
  overflow-y: auto;
  padding: .85rem;
}

.testing-window__goal {
  margin: 0;
  color: #244b41;
  font-size: .88rem;
  line-height: 1.4;
}

.testing-window__meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .55rem;
}

.testing-window__meta > div,
.testing-window__expected,
.testing-window__notes {
  padding: .65rem;
  border: 1px solid #dcebe5;
  border-radius: 8px;
  background: #f4fbf8;
}

.testing-window__meta button {
  max-width: 100%;
  padding: 0;
  border: 0;
  color: #047857;
  background: transparent;
  font-size: .82rem;
  font-weight: 800;
  text-align: left;
  text-decoration: underline;
}

.testing-window__meta strong,
.testing-window__meta small,
.testing-window__meta code {
  display: block;
  margin-top: .18rem;
  color: #132f27;
  font-size: .78rem;
  line-height: 1.25;
}

.testing-window__meta code {
  white-space: normal;
}

.testing-window__expected p {
  margin: .25rem 0 0;
  color: #244b41;
  font-size: .82rem;
  line-height: 1.35;
}

.testing-window__steps {
  display: grid;
  gap: .55rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.testing-window__steps li {
  display: grid;
  grid-template-columns: 1fr 34px;
  gap: .65rem;
  align-items: center;
  padding: .65rem;
  border: 1px solid #dcebe5;
  border-radius: 8px;
  background: #ffffff;
}

.testing-window__steps li.current {
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, .12);
}

.testing-window__steps li.done {
  background: #effcf7;
}

.testing-window__steps li.auto:not(.done) {
  border-style: dashed;
}

.testing-window__steps span {
  color: #047857;
  font-size: .68rem;
  font-weight: 900;
  text-transform: uppercase;
}

.testing-window__steps p {
  margin: .16rem 0 0;
  color: #17362e;
  font-size: .83rem;
  line-height: 1.35;
}

.testing-window__steps button {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 0;
  color: #10b981;
  background: transparent;
  font-size: 1.1rem;
}

.testing-window__notes {
  margin: 0;
}

.testing-window__notes ::v-deep .form-control {
  margin-top: .4rem;
  border-color: #c9e2d9;
  color: #123b31;
  font-size: .84rem;
}

.testing-window__footer {
  display: grid;
  grid-template-columns: 38px 1fr 1fr;
  gap: .5rem;
  padding: .75rem .85rem;
  border-top: 1px solid #dcebe5;
  background: #f4fbf8;
}

.testing-window__mini {
  display: grid;
  gap: .6rem;
  padding: .75rem;
  background: #fbfffd;
}

.testing-window__mini-title span,
.testing-window__mini-title strong {
  display: block;
}

.testing-window__mini-title span {
  color: #477267;
  font-size: .66rem;
  font-weight: 900;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.testing-window__mini-title strong {
  margin-top: .12rem;
  overflow: hidden;
  color: #0f241e;
  font-size: .9rem;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.testing-window__mini-steps {
  display: grid;
  gap: .45rem;
  max-height: 132px;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
}

.testing-window__mini-steps li {
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: .5rem;
  align-items: start;
  min-height: 60px;
  padding: .55rem;
  border: 1px solid #dcebe5;
  border-radius: 8px;
  background: #ffffff;
}

.testing-window__mini-steps li.done {
  background: #effcf7;
}

.testing-window__mini-steps li.current {
  border-color: #10b981;
}

.testing-window__mini-steps li.auto:not(.done) {
  border-style: dashed;
}

.testing-window__mini-steps button {
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  border: 0;
  color: #10b981;
  background: transparent;
  font-size: 1rem;
}

.testing-window__mini-steps span {
  display: block;
  color: #047857;
  font-size: .62rem;
  font-weight: 900;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.testing-window__mini-steps p {
  display: -webkit-box;
  margin: .12rem 0 0;
  overflow: hidden;
  color: #17362e;
  font-size: .78rem;
  line-height: 1.25;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.testing-window-enter-active,
.testing-window-leave-active {
  transition: opacity .18s ease, transform .18s ease;
}

.testing-window-enter,
.testing-window-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 520px) {
  .testing-window {
    right: 12px !important;
    width: calc(100vw - 24px);
  }

  .testing-window__meta {
    grid-template-columns: 1fr;
  }
}
</style>
