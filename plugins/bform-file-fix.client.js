/** bootstrap-vue-next renderiza webkitdirectory="false" en BFormFile; el atributo presente activa modo carpeta. */
function fixFormFileInputs(root = document) {
  root.querySelectorAll?.('input[type="file"][webkitdirectory]').forEach((input) => {
    input.removeAttribute('webkitdirectory')
    input.removeAttribute('directory')
  })
}

export default defineNuxtPlugin(() => {
  fixFormFileInputs()

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          fixFormFileInputs(node)
        }
      }
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
})
