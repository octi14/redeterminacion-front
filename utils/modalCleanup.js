/**
 * Desbloquea pointer-events en layout/navbar sin cerrar modales abiertos.
 */
function unlockLayoutPointerEvents() {
  if (!import.meta.client || typeof document === 'undefined') return

  document.body.style.removeProperty('pointer-events')

  const unlock = (el) => {
    if (!el?.style) return
    el.style.removeProperty('pointer-events')
  }

  unlock(document.getElementById('app-layout'))
  unlock(document.getElementById('app-content'))
  unlock(document.getElementById('app-navbar'))
}

function hasVisibleModal() {
  if (!import.meta.client || typeof document === 'undefined') return false
  return document.querySelectorAll('.modal.show').length > 0
}

/**
 * Sincroniza el bloqueo de scroll/backdrop con modales visibles.
 * No fuerza el cierre de modales (p. ej. al pasar de "cargando" a "éxito").
 */
export function syncModalBodyLock() {
  if (!import.meta.client || typeof document === 'undefined') return

  unlockLayoutPointerEvents()

  if (hasVisibleModal()) {
    document.body.classList.add('modal-open')
    return
  }

  document.body.classList.remove('modal-open')
  document.body.style.removeProperty('overflow')
  document.body.style.removeProperty('padding-right')

  document.querySelectorAll('.modal-backdrop').forEach((el) => {
    el.style.setProperty('display', 'none', 'important')
    el.style.setProperty('pointer-events', 'none', 'important')
    el.style.setProperty('opacity', '0', 'important')
  })
}

/**
 * Cierra modales y limpia backdrops (navegación SPA).
 */
export function forceCloseAllModals() {
  if (!import.meta.client || typeof document === 'undefined') return

  unlockLayoutPointerEvents()

  document.body.classList.remove('modal-open')
  document.body.style.removeProperty('overflow')
  document.body.style.removeProperty('padding-right')

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

/** @deprecated Preferir syncModalBodyLock o forceCloseAllModals según el caso. */
export function unlockNavigation() {
  syncModalBodyLock()
}

/**
 * Limpieza final tras completar el cambio de ruta.
 */
export function cleanupModalArtifacts() {
  if (!import.meta.client || typeof document === 'undefined') return

  forceCloseAllModals()

  document.querySelectorAll('.modal-backdrop').forEach((el) => {
    el.remove()
  })
}
