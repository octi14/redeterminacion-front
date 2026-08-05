import { toPlainData } from '~/utils/api-client.js'

/**
 * Convierte objetos sin prototipo antes de que Pinia evalúe shouldHydrate en el payload SSR.
 */
export default definePayloadPlugin({
  name: 'pinia-null-proto-reducer',
  setup() {
    definePayloadReducer('nullProtoFix', (data) => {
      if (
        data != null &&
        typeof data === 'object' &&
        typeof data.hasOwnProperty !== 'function'
      ) {
        return toPlainData(data)
      }
    })

    // Evita "Unknown type nullProtoFix" al parsear payload en cliente.
    definePayloadReviver('nullProtoFix', (data) => data)
  },
})
