/** Carga SheetJS (xlsx) solo en el cliente (evita problemas en SSR). */
export async function loadXlsx() {
  if (import.meta.server) {
    throw new Error('xlsx no está disponible en el servidor')
  }
  return import('xlsx')
}
