import { nextTick } from 'vue'
import { cleanupModalArtifacts, unlockNavigation } from '~/utils/modalCleanup'

/**
 * Navegación SPA: desbloquear UI en cada clic y en cada cambio de ruta.
 * Sin mixin global beforeRouteLeave (interfería con el árbol de componentes).
 */
export default defineNuxtPlugin((nuxtApp) => {
  const router = nuxtApp.$router
  if (!router) return

  if (import.meta.client) {
    document.addEventListener(
      'click',
      (event) => {
        const target = event.target
        if (!(target instanceof Element)) return
        if (
          target.closest('a[href]')
          || target.closest('[role="menuitem"]')
          || target.closest('.nav-link')
          || target.closest('.dropdown-item')
          || target.closest('.page-btn-volver')
          || target.closest('.landing-tile-link')
          || target.closest('button')
        ) {
          unlockNavigation()
        }
      },
      true,
    )
  }

  router.beforeEach(() => {
    unlockNavigation()
    return true
  })

  const scheduleCleanup = () => {
    nextTick(() => {
      requestAnimationFrame(() => {
        cleanupModalArtifacts()
      })
    })
  }

  router.afterEach(scheduleCleanup)
  router.onError(() => {
    unlockNavigation()
    cleanupModalArtifacts()
  })
})
