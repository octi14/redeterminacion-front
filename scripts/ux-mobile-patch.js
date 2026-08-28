const fs = require('fs')
function w(path, fn) {
  let c = fs.readFileSync(path, 'utf8')
  fs.writeFileSync(path, fn(c), 'utf8')
  console.log(path, 'ok')
}
w('pages/tasas/tasa-automotor.vue', c => {
  if (!c.includes('showDominioAyuda: false')) {
    c = c.replace('      showDominioNoEncontrado: false,\n    }', '      showDominioNoEncontrado: false,\n      showDominioAyuda: false,\n    }')
  }
  return c
})
