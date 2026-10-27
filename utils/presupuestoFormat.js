export const money = (v) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(v)

export const money0 = (v) =>
  v.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  })

export const mm = (v) =>
  '$ ' + (v / 1e6).toLocaleString('es-AR', { maximumFractionDigits: 1 }) + ' M'

export const pct = (v) =>
  (v * 100).toLocaleString('es-AR', { maximumFractionDigits: 1 }) + ' %'

export async function downloadCsv(content, filename) {
  const { saveAsFile } = await import('~/utils/saveAsFile')
  await saveAsFile(
    new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8' }),
    filename,
  )
}
