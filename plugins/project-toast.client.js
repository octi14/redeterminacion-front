/**
 * Expone showToast en `this.showToast` (Options API).
 * Necesario en SFC con <script setup> + <script>: el setup() del bloque
 * clásico no se ejecuta y this.showToast quedaría indefinido.
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.globalProperties.showToast = (body, options = {}) => {
    return useProjectToast().showToast(body, options)
  }
})
