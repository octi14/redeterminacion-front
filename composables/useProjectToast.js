import { useToastController } from 'bootstrap-vue-next'

/**
 * Toasts del proyecto (directo a BootstrapVueNext).
 *
 * Opciones recomendadas (las que usa este helper):
 * - variant: 'success' | 'danger' | 'warning' | 'info' ...
 * - pos: 'top-end' | 'top-center' | 'bottom-start' ...
 * - value: number (ms) para auto-hide
 * - solid: boolean
 * - appendToast: boolean
 * - title: string | undefined
 */
export function useProjectToast() {
  const showToast = (body, options = {}) => {
    const {
      title,
      variant = 'info',
      pos = 'top-end',
      value = 5000,
      solid = true,
      appendToast = true,
    } = options

    const payload = {
      props: {
        body: String(body),
        title,
        variant,
        solid,
        pos,
        value,
      },
      appendToast,
    }

    const run = () => {
      const show = useToastController()?.show
      return show?.(payload)
    }

    const nuxtApp = useNuxtApp()
    if (nuxtApp?.vueApp) {
      return nuxtApp.vueApp.runWithContext(run)
    }
    return run()
  }

  return { showToast }
}

