/**
 * Desbloquea la UI antes/durante una navegación.
 */
export function unlockNavigation() {
  if (!import.meta.client || typeof document === 'undefined') return

  document.body.classList.remove('modal-open')
  document.body.style.removeProperty('overflow')
  document.body.style.removeProperty('padding-right')
  document.body.style.removeProperty('pointer-events')

  const unlock = (el) => {
    if (!el?.style) return
    el.style.removeProperty('pointer-events')
  }

  unlock(document.getElementById('app-layout'))
  unlock(document.getElementById('app-content'))
  unlock(document.getElementById('app-navbar'))

  document.querySelectorAll('.modal-backdrop').forEach((el) => {
    el.style.setProperty('display', 'none', 'important')
    el.style.setProperty('pointer-events', 'none', 'important')
    el.style.setProperty('opacity', '0', 'important')
  })

  document.querySelectorAll('.modal.show').forEach((el) => {
    el.classList.remove('show')
    el.style.display = 'none'
    el.setAttribute('aria-hidden', 'true')
  })
}

/**
 * Limpieza final tras completar el cambio de ruta.
 */
export function cleanupModalArtifacts() {
  if (!import.meta.client || typeof document === 'undefined') return

  unlockNavigation()

  document.querySelectorAll('.modal-backdrop').forEach((el) => {
    el.remove()
  })
}
