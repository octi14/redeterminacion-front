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
  const toastController = useToastController()

  const showToast = (body, options = {}) => {
    if (!toastController?.show) return

    const {
      title,
      variant = 'info',
      pos = 'top-end',
      value = 5000,
      solid = true,
      appendToast = true,
    } = options

    return toastController.show({
      props: {
        body: String(body),
        title,
        variant,
        solid,
        pos,
        value,
      },
      appendToast,
    })
  }

  return { showToast }
}

