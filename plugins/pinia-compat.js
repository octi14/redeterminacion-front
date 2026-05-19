/**
 * Capa de compatibilidad Vuex → Pinia para minimizar cambios en componentes.
 * Soporta $store.state, $store.dispatch('modulo/accion'), $store.commit('modulo/mutacion')
 */
export default defineNuxtPlugin((nuxtApp) => {
  const moduleGetters = {
    user: () => useUserStore(),
    obras: () => useObrasStore(),
    categorias: () => useCategoriasStore(),
    config: () => useConfigStore(),
    fechas: () => useFechasStore(),
    facturas: () => useFacturasStore(),
    documentos: () => useDocumentosStore(),
    abiertoAnual: () => useAbiertoAnualStore(),
    cementerio: () => useCementerioStore(),
    certificados: () => useCertificadosStore(),
    combustible: () => useCombustibleStore(),
    habilitaciones: () => useHabilitacionesStore(),
    indices: () => useIndicesStore(),
    maestro: () => useMaestroStore(),
    multimedias: () => useMultimediasStore(),
    pagosDobles: () => usePagosDoblesStore(),
    redeterminaciones: () => useRedeterminacionesStore(),
    turnos: () => useTurnosStore(),
    vehiculos: () => useVehiculosStore(),
    userActivities: () => useUserActivitiesStore(),
    estadisticas: () => useEstadisticasStore(),
  }

  const state = {}
  for (const [name, getStore] of Object.entries(moduleGetters)) {
    Object.defineProperty(state, name, {
      enumerable: true,
      get() {
        return getStore().$state
      },
    })
  }

  const store = {
    state,
    getters: new Proxy(
      {},
      {
        get(_target, module) {
          const s = moduleGetters[module]?.()
          return s ? Object.fromEntries(
            Object.keys(s).filter((k) => typeof s[k] !== 'function').map((k) => [k, s[k]])
          ) : undefined
        },
      }
    ),
    dispatch(type, payload) {
      const [mod, action] = String(type).split('/')
      const s = moduleGetters[mod]?.()
      if (!s || typeof s[action] !== 'function') {
        console.warn(`[pinia-compat] dispatch desconocido: ${type}`)
        return Promise.resolve()
      }
      return Promise.resolve(s[action](payload))
    },
    commit(type, payload) {
      const [mod, mutation] = String(type).split('/')
      const commitAliases = {
        'user/logout': 'clearSession',
        'multimedias/delete': 'removeItem',
        'turnos/delete': 'removeItem',
      }
      const method = commitAliases[type] || mutation
      const s = moduleGetters[mod]?.()
      if (!s || typeof s[method] !== 'function') {
        console.warn(`[pinia-compat] commit desconocido: ${type}`)
        return
      }
      return s[method](payload)
    },
  }

  nuxtApp.vueApp.config.globalProperties.$store = store

  return {
    provide: {
      store,
    },
  }
})
