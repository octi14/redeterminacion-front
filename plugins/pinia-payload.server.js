import { toPlainData } from '~/utils/api-client.js'
import { toRaw } from 'vue'

function wrapSkipHydrateReducer(reducers) {
  if (!reducers?.skipHydrate || reducers.skipHydrate.__piniaNullProtoWrapped) {
    return
  }

  const original = reducers.skipHydrate
  const wrapped = (data) => {
    let value = data
    if (
      value != null &&
      typeof value === 'object' &&
      typeof value.hasOwnProperty !== 'function'
    ) {
      value = toPlainData(value)
    }
    return original(value)
  }
  wrapped.__piniaNullProtoWrapped = true
  reducers.skipHydrate = wrapped
}

function sanitizePayloadPinia(nuxtApp) {
  const pinia = nuxtApp.$pinia
  if (pinia?.state?.value) {
    nuxtApp.payload.pinia = toPlainData(toRaw(pinia.state.value))
  } else if (nuxtApp.payload?.pinia) {
    nuxtApp.payload.pinia = toPlainData(nuxtApp.payload.pinia)
  }
}

/**
 * Parche SSR: shouldHydrate de Pinia falla con objetos Object.create(null).
 */
export default defineNuxtPlugin({
  name: 'pinia-payload-sanitize',
  enforce: 'post',
  dependsOn: ['pinia'],
  setup(nuxtApp) {
    if (!import.meta.server) return

    const patchReducers = () => {
      wrapSkipHydrateReducer(nuxtApp.ssrContext?.['~payloadReducers'])
    }

    patchReducers()
    nuxtApp.hook('app:created', patchReducers)

    nuxtApp.hook('app:rendered', () => {
      patchReducers()
      sanitizePayloadPinia(nuxtApp)
    })
  },
})
