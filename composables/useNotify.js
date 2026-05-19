import { useToastController } from 'bootstrap-vue-next'

/**
 * Wrapper compatible con $bvToast.toast(body, options)
 */
export function useNotify() {
  const { show } = useToastController()

  const toast = (body, options = {}) => {
    show({
      props: {
        body: String(body),
        title: options.title,
        variant: options.variant || 'info',
      },
      solid: options.solid ?? true,
      appendToast: options.appendToast ?? true,
    })
  }

  return { toast, show }
}
