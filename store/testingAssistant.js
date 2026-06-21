const TestingCases = require('../config/testingCases')

const STORAGE_KEY = 'testingAssistantSession'
function defaultPosition() {
  return {
    top: 96,
    right: 24
  }
}

function defaultSession() {
  return {
    hydrated: false,
    active: false,
    sessionId: null,
    createdAt: null,
    elapsedSeconds: 0,
    timerEnabled: false,
    timerRunning: false,
    completedAt: null,
    summaryVisible: false,
    selectedModuleKeys: [],
    selectedCaseIds: [],
    currentIndex: 0,
    completedStepIds: [],
    completedCaseIds: [],
    blockedCaseIds: [],
    notesByCaseId: {},
    minimized: false,
    position: defaultPosition()
  }
}

function safeParse(value) {
  try {
    return JSON.parse(value)
  } catch (_error) {
    return null
  }
}

function unique(values) {
  return Array.from(new Set((values || []).filter(Boolean)))
}

function persist(state) {
  if (!process.client) return
  const payload = {
    active: state.active,
    sessionId: state.sessionId,
    createdAt: state.createdAt,
    elapsedSeconds: state.elapsedSeconds,
    timerEnabled: state.timerEnabled,
    timerRunning: state.timerRunning,
    completedAt: state.completedAt,
    summaryVisible: state.summaryVisible,
    selectedModuleKeys: state.selectedModuleKeys,
    selectedCaseIds: state.selectedCaseIds,
    currentIndex: state.currentIndex,
    completedStepIds: state.completedStepIds,
    completedCaseIds: state.completedCaseIds,
    blockedCaseIds: state.blockedCaseIds,
    notesByCaseId: state.notesByCaseId,
    minimized: state.minimized,
    position: state.position
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export const state = () => defaultSession()

export const getters = {
  modules() {
    return TestingCases.MODULES
  },
  cases() {
    return TestingCases.CASES
  },
  selectedCases(state) {
    const selected = state.selectedCaseIds
      .map(id => TestingCases.caseById(id))
      .filter(Boolean)

    if (selected.length) return selected
    return TestingCases.CASES.filter(item => (
      state.selectedModuleKeys.some(moduleKey => TestingCases.caseBelongsToModule(item, moduleKey))
    ))
  },
  currentCase(state, getters) {
    return getters.selectedCases[state.currentIndex] || null
  },
  currentCaseNumber(state) {
    return state.currentIndex + 1
  },
  totalCases(_state, getters) {
    return getters.selectedCases.length
  },
  currentCaseSteps(_state, getters) {
    return getters.currentCase ? getters.currentCase.steps || [] : []
  },
  completedStepsForCurrentCase(state, getters) {
    return getters.currentCaseSteps.filter(step => state.completedStepIds.includes(step.id))
  },
  currentCaseCompleted(state, getters) {
    const currentCase = getters.currentCase
    if (!currentCase) return false
    const steps = currentCase.steps || []
    return steps.length > 0 && steps.every(step => state.completedStepIds.includes(step.id))
  },
  progress(state, getters) {
    const cases = getters.selectedCases
    const totalSteps = cases.reduce((total, item) => total + (item.steps || []).length, 0)
    const selectedStepIds = cases.flatMap(item => (item.steps || []).map(step => step.id))
    const completedSteps = selectedStepIds.filter(id => state.completedStepIds.includes(id)).length
    return {
      totalCases: cases.length,
      completedCases: state.completedCaseIds.filter(id => cases.some(item => item.id === id)).length,
      totalSteps,
      completedSteps
    }
  },
  sessionSummary(state, getters) {
    const cases = getters.selectedCases
    return {
      sessionId: state.sessionId,
      createdAt: state.createdAt,
      completedAt: state.completedAt,
      elapsedSeconds: state.elapsedSeconds,
      timerEnabled: state.timerEnabled,
      timerRunning: state.timerRunning,
      selectedModules: state.selectedModuleKeys
        .map(key => TestingCases.moduleByKey(key))
        .filter(Boolean),
      totalCases: cases.length,
      completedCases: state.completedCaseIds.filter(id => cases.some(item => item.id === id)).length,
      blockedCases: state.blockedCaseIds.filter(id => cases.some(item => item.id === id)).length,
      totalSteps: getters.progress.totalSteps,
      completedSteps: getters.progress.completedSteps,
      cases: cases.map(item => {
        const steps = item.steps || []
        const completedSteps = steps.filter(step => state.completedStepIds.includes(step.id))
        return {
          id: item.id,
          title: item.title,
          module: item.module,
          modules: TestingCases.caseModules(item),
          submodule: item.submodule,
          route: item.route,
          suggestedUser: item.suggestedUser,
          permissions: item.permissions || [],
          completed: state.completedCaseIds.includes(item.id),
          blocked: state.blockedCaseIds.includes(item.id),
          totalSteps: steps.length,
          completedSteps: completedSteps.length,
          pendingSteps: steps
            .filter(step => !state.completedStepIds.includes(step.id))
            .map(step => step.text),
          note: state.notesByCaseId[item.id] || ''
        }
      })
    }
  },
  testUsers() {
    return TestingCases.TEST_USERS
  },
  userByKey: () => (key) => TestingCases.userByKey(key),
  moduleByKey: () => (key) => TestingCases.moduleByKey(key)
}

export const actions = {
  hydrate({ commit, state }) {
    if (!process.client || state.hydrated) return
    const saved = safeParse(localStorage.getItem(STORAGE_KEY))
    if (saved) {
      commit('hydrate', saved)
    } else {
      commit('setHydrated')
    }
  },
  startSession({ commit }, { moduleKeys = [], caseIds = [], timerEnabled = false }) {
    const selectedModuleKeys = unique(moduleKeys)
    const selectedCaseIds = unique(caseIds)
    const fallbackCaseIds = TestingCases.CASES
      .filter(item => selectedModuleKeys.some(moduleKey => TestingCases.caseBelongsToModule(item, moduleKey)))
      .map(item => item.id)

    commit('startSession', {
      sessionId: `testing-${Date.now()}`,
      createdAt: new Date().toISOString(),
      timerEnabled: Boolean(timerEnabled),
      selectedModuleKeys,
      selectedCaseIds: selectedCaseIds.length ? selectedCaseIds : fallbackCaseIds
    })
  },
  endSession({ commit }) {
    commit('endSession')
  },
  completeStep({ commit }, stepId) {
    commit('completeStep', stepId)
  },
  uncompleteStep({ commit }, stepId) {
    commit('uncompleteStep', stepId)
  },
  completeCurrentCase({ commit, getters }) {
    if (!getters.currentCase) return
    commit('completeCase', getters.currentCase.id)
  },
  blockCurrentCase({ commit, getters }, note = '') {
    if (!getters.currentCase) return
    commit('blockCase', { caseId: getters.currentCase.id, note })
  },
  goToCase({ commit }, index) {
    commit('goToCase', index)
  },
  nextCase({ commit, getters, state }) {
    if (state.currentIndex < getters.selectedCases.length - 1) {
      commit('goToCase', state.currentIndex + 1)
    }
  },
  previousCase({ commit, state }) {
    if (state.currentIndex > 0) {
      commit('goToCase', state.currentIndex - 1)
    }
  },
  saveNote({ commit }, { caseId, note }) {
    commit('saveNote', { caseId, note })
  },
  setMinimized({ commit }, value) {
    commit('setMinimized', value)
  },
  setPosition({ commit }, position) {
    commit('setPosition', position)
  },
  tickTimer({ commit, state }) {
    if (!state.active || !state.timerEnabled || !state.timerRunning || state.completedAt) return
    commit('tickTimer')
  },
  toggleTimer({ commit }) {
    commit('toggleTimer')
  },
  setTimerRunning({ commit }, value) {
    commit('setTimerRunning', value)
  },
  finishSession({ commit }) {
    commit('finishSession')
  },
  setSummaryVisible({ commit }, value) {
    commit('setSummaryVisible', value)
  },
  persistSession({ commit }) {
    commit('persistSession')
  }
}

export const mutations = {
  hydrate(state, saved) {
    const next = {
      ...defaultSession(),
      ...saved,
      hydrated: true,
      elapsedSeconds: Math.max(0, Number(saved.elapsedSeconds) || 0),
      timerEnabled: Boolean(saved.timerEnabled),
      timerRunning: Boolean(saved.timerEnabled) && Boolean(saved.timerRunning),
      completedAt: saved.completedAt || null,
      summaryVisible: Boolean(saved.summaryVisible),
      selectedModuleKeys: unique(saved.selectedModuleKeys),
      selectedCaseIds: unique(saved.selectedCaseIds),
      completedStepIds: unique(saved.completedStepIds),
      completedCaseIds: unique(saved.completedCaseIds),
      blockedCaseIds: unique(saved.blockedCaseIds),
      notesByCaseId: saved.notesByCaseId || {},
      position: saved.position || defaultPosition()
    }
    Object.assign(state, next)
    persist(state)
  },
  setHydrated(state) {
    state.hydrated = true
  },
  startSession(state, payload) {
    Object.assign(state, {
      ...defaultSession(),
      hydrated: true,
      active: true,
      sessionId: payload.sessionId,
      createdAt: payload.createdAt,
      elapsedSeconds: 0,
      timerEnabled: Boolean(payload.timerEnabled),
      timerRunning: Boolean(payload.timerEnabled),
      completedAt: null,
      summaryVisible: false,
      selectedModuleKeys: unique(payload.selectedModuleKeys),
      selectedCaseIds: unique(payload.selectedCaseIds),
      position: defaultPosition()
    })
    persist(state)
  },
  endSession(state) {
    Object.assign(state, defaultSession(), { hydrated: true })
    persist(state)
  },
  completeStep(state, stepId) {
    state.completedStepIds = unique([...state.completedStepIds, stepId])
    persist(state)
  },
  uncompleteStep(state, stepId) {
    state.completedStepIds = state.completedStepIds.filter(id => id !== stepId)
    persist(state)
  },
  completeCase(state, caseId) {
    state.completedCaseIds = unique([...state.completedCaseIds, caseId])
    state.blockedCaseIds = state.blockedCaseIds.filter(id => id !== caseId)
    persist(state)
  },
  blockCase(state, { caseId, note }) {
    state.blockedCaseIds = unique([...state.blockedCaseIds, caseId])
    if (note) {
      state.notesByCaseId = {
        ...state.notesByCaseId,
        [caseId]: note
      }
    }
    persist(state)
  },
  goToCase(state, index) {
    state.currentIndex = Math.max(0, Number(index) || 0)
    persist(state)
  },
  saveNote(state, { caseId, note }) {
    state.notesByCaseId = {
      ...state.notesByCaseId,
      [caseId]: note
    }
    persist(state)
  },
  setMinimized(state, value) {
    state.minimized = Boolean(value)
    persist(state)
  },
  setPosition(state, position) {
    state.position = {
      ...state.position,
      ...position
    }
    persist(state)
  },
  tickTimer(state) {
    state.elapsedSeconds = Math.max(0, Number(state.elapsedSeconds) || 0) + 1
  },
  toggleTimer(state) {
    if (!state.timerEnabled) return
    state.timerRunning = !state.timerRunning
    persist(state)
  },
  setTimerRunning(state, value) {
    state.timerRunning = state.timerEnabled ? Boolean(value) : false
    persist(state)
  },
  finishSession(state) {
    state.completedAt = state.completedAt || new Date().toISOString()
    state.timerRunning = false
    state.summaryVisible = true
    state.minimized = false
    persist(state)
  },
  setSummaryVisible(state, value) {
    state.summaryVisible = Boolean(value)
    persist(state)
  },
  persistSession(state) {
    persist(state)
  }
}
