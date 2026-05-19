import { useVuelidate } from '@vuelidate/core'
import { getCurrentInstance, computed } from 'vue'

/**
 * Mixin de compatibilidad para validations() de Vuelidate 0.7 en Options API.
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.mixin({
    setup() {
      const instance = getCurrentInstance()
      const validationsOpt = instance?.proxy?.$options?.validations
      if (!validationsOpt) return {}

      const rules = computed(() => {
        const v = instance.proxy.$options.validations
        return typeof v === 'function' ? v.call(instance.proxy) : v || {}
      })

      const state = computed(() => instance.proxy)

      const v$ = useVuelidate(rules, state)
      return { v$ }
    },
  })
})
