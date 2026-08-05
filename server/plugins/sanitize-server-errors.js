/** Registra errores 5xx del servidor. Solo sanitiza respuestas no-HTML (API/JSON). */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', async (error, { event }) => {
    const statusCode = Number(error?.statusCode) || 500
    if (statusCode < 500) return

    console.error('[server error]', {
      statusCode,
      method: event?.method,
      path: event?.path,
      message: error?.message,
      stack: error?.stack,
    })

    const accept = event ? getRequestHeader(event, 'accept') || '' : ''
    const wantsHtml = accept.includes('text/html')

    // Las navegaciones del sitio deben renderizar error.vue, no JSON crudo.
    if (wantsHtml) return

    error.statusCode = statusCode
    error.statusMessage = 'Internal Server Error'
    error.message = 'Internal Server Error'
    if ('stack' in error) {
      delete error.stack
    }
  })
})
