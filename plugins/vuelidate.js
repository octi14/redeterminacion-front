import { useVuelidate } from '@vuelidate/core'
import { getCurrentInstance, computed } from 'vue'

function getValidationsDefinition(instance) {
  return instance?.type?.validations ?? instance?.proxy?.$options?.validations
}

/** Evita crash en SSR/primer render si v$ aún no está montado. */
function createEmptyVuelidateProxy() {
  const leaf = {
    $error: false,
    $invalid: false,
    $dirty: false,
    $pending: false,
    $touch: () => {},
    $reset: () => {},
  }
  return new Proxy(leaf, {
    get(target, prop) {
      if (prop in target) return target[prop]
      return createEmptyVuelidateProxy()
    },
  })
}

/** Completa con el proxy vacío los nodos que Vuelidate todavía no creó (SSR / antes de montar). */
function withEmptyFallback(v) {
  return new Proxy(v, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver)
      if (value !== undefined || typeof prop !== 'string' || prop === 'then' || prop.startsWith('__v')) {
        return value && typeof value === 'object' && !Array.isArray(value) && !prop.startsWith('__v')
          ? withEmptyFallback(value)
          : value
      }
      return createEmptyVuelidateProxy()
    },
  })
}

/**
 * Vuelidate 0.7-style `validations` + `$v` en Options API.
 * Vue 3 no ejecuta `setup()` de mixins: cada componente debe declarar
 * `setup() { return { v$: useVuelidate() } }` para que `$v` valide de verdad.
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.mixin({
    setup() {
      const instance = getCurrentInstance()
      if (!instance) return {}

      const validationsOpt = getValidationsDefinition(instance)
      if (!validationsOpt) return {}

      const rules = computed(() => {
        const def = getValidationsDefinition(instance)
        const ctx = instance.proxy
        if (!def || !ctx) return {}
        return typeof def === 'function' ? def.call(ctx) : def
      })

      const state = computed(() => {
        const ctx = instance.proxy
        if (!ctx) return {}
        const r = rules.value
        const out = {}
        for (const key of Object.keys(r)) {
          out[key] = ctx[key]
        }
        return out
      })

      const v$ = useVuelidate(rules, state)
      return { v$ }
    },
    computed: {
      $v() {
        return this.v$ ? withEmptyFallback(this.v$) : createEmptyVuelidateProxy()
      },
    },
  })
})
