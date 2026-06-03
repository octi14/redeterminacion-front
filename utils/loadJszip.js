/** Carga JSZip solo en el cliente (evita problemas en SSR). */
export async function loadJSZip() {
  if (import.meta.server) {
    throw new Error('JSZip no está disponible en el servidor')
  }
  const { default: JSZip } = await import('jszip')
  return JSZip
}
