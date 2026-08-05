/**
 * bootstrap-vue-next 0.27 renderiza webkitdirectory/directory aunque directory=false.
 * En Firefox/Safari la sola presencia del atributo activa selección de carpetas
 * (no se pueden elegir archivos individuales). Chrome suele ignorar el valor "false".
 *
 * Ver: https://github.com/bootstrap-vue-next/bootstrap-vue-next/issues/2053
 */
function disableDirectoryMode(input) {
  if (!(input instanceof HTMLInputElement) || input.type !== 'file') return

  if (input.hasAttribute('webkitdirectory') || input.webkitdirectory) {
    input.removeAttribute('webkitdirectory')
    input.webkitdirectory = false
  }
  if (input.hasAttribute('directory')) {
    input.removeAttribute('directory')
  }
}

function fixFormFileInputs(root = document) {
  if (!root?.querySelectorAll) return

  // Inputs que aún traen el atributo (SSR / re-render de BVN)
  root.querySelectorAll('input[type="file"][webkitdirectory], input[type="file"][directory]').forEach(disableDirectoryMode)

  // Por si el atributo ya se quitó pero la propiedad DOM quedó en true (Firefox)
  root.querySelectorAll('input[type="file"]').forEach((input) => {
    if (input.webkitdirectory) disableDirectoryMode(input)
  })
}

function fixNode(node) {
  if (node.nodeType !== Node.ELEMENT_NODE) return
  if (node.matches?.('input[type="file"]')) {
    disableDirectoryMode(node)
  }
  fixFormFileInputs(node)
}

export default defineNuxtPlugin((nuxtApp) => {
  const run = () => fixFormFileInputs(document)

  // Tras montar e hidratar (el atributo suele aparecer con el HTML SSR)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true })
  } else {
    run()
  }
  nuxtApp.hook('app:mounted', run)
  nuxtApp.hook('page:finish', run)

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.target instanceof HTMLInputElement) {
        disableDirectoryMode(mutation.target)
        continue
      }
      for (const node of mutation.addedNodes) {
        fixNode(node)
      }
    }
  })

  const startObserver = () => {
    if (!document.body) return
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['webkitdirectory', 'directory'],
    })
    run()
  }

  if (document.body) {
    startObserver()
  } else {
    document.addEventListener('DOMContentLoaded', startObserver, { once: true })
  }
})
