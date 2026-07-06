import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'

function ensureDevManifest(buildDir) {
  const metaDir = join(buildDir, 'manifest', 'meta')
  const devJson = join(metaDir, 'dev.json')
  if (!existsSync(devJson)) {
    mkdirSync(metaDir, { recursive: true })
    writeFileSync(devJson, '{}', 'utf8')
  }
}

export default defineNuxtModule({
  meta: {
    name: 'nuxt-dev-fix',
  },
  setup(_options, nuxt) {
    ensureDevManifest(nuxt.options.buildDir)

    nuxt.hook('ready', () => {
      ensureDevManifest(nuxt.options.buildDir)
    })

    const { resolve } = createResolver(import.meta.url)
    addPlugin(resolve('../plugins/pinia-null-proto-reducer.js'), { prepend: true })
  },
})
