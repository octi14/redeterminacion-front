/**
 * Descarga un archivo en el navegador (solo cliente).
 * file-saver accede a navigator.userAgent y falla en SSR.
 */
export async function saveAsFile(blob, filename) {
  if (import.meta.server) return
  const { saveAs } = await import('file-saver')
  saveAs(blob, filename)
}
