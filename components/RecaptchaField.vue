<template>
  <div class="recaptcha-field" :class="fieldClass">
    <div :id="containerId" class="g-recaptcha"></div>
    <div v-if="showError" class="validation-error">
      <i class="bi bi-exclamation-octagon text-danger"></i> Por favor completa la verificación para continuar.
    </div>
  </div>
</template>

<script>
const DEFAULT_SITE_KEY = '6LfNxggoAAAAANyfZ5a2Lg_Rx28HX_lINDYX7AU-'

export default {
  name: 'RecaptchaField',
  props: {
    containerId: {
      type: String,
      required: true,
    },
    siteKey: {
      type: String,
      default: DEFAULT_SITE_KEY,
    },
    size: {
      type: String,
      default: 'normal',
      validator: value => ['normal', 'compact'].includes(value),
    },
    align: {
      type: String,
      default: 'center',
      validator: value => ['left', 'center'].includes(value),
    },
  },
  computed: {
    fieldClass() {
      return {
        'recaptcha-field--left': this.align === 'left',
        'recaptcha-field--normal': this.size === 'normal',
        'recaptcha-field--compact': this.size === 'compact',
      }
    },
  },
  data() {
    return {
      showError: false,
      widgetId: null,
    }
  },
  mounted() {
    this.renderCaptcha()
  },
  beforeUnmount() {
    this.widgetId = null
  },
  methods: {
    renderCaptcha() {
      const mount = () => {
        if (!document.getElementById(this.containerId) || this.widgetId !== null) return
        this.widgetId = grecaptcha.render(this.containerId, {
          sitekey: this.siteKey,
          size: this.size,
        })
      }
      if (typeof grecaptcha !== 'undefined') {
        grecaptcha.ready(mount)
      }
    },
    validate() {
      const ok = typeof grecaptcha !== 'undefined'
        && this.widgetId !== null
        && grecaptcha.getResponse(this.widgetId).length > 0
      this.showError = !ok
      return ok
    },
    reset() {
      if (this.widgetId !== null && typeof grecaptcha !== 'undefined') {
        grecaptcha.reset(this.widgetId)
      }
      this.showError = false
    },
  },
}
</script>

<style scoped>
.recaptcha-field {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0.75rem auto 1rem;
  max-width: 100%;
  overflow: visible;
}

.recaptcha-field--left {
  align-items: flex-start;
  margin-left: 0;
  margin-right: 0;
}

.recaptcha-field--normal {
  width: 100%;
}

.recaptcha-field--normal :deep(.g-recaptcha > div) {
  margin: 0 auto;
}

.recaptcha-field :deep(.g-recaptcha),
.recaptcha-field :deep(.g-recaptcha > div) {
  overflow: visible !important;
}

.recaptcha-field--compact :deep(iframe) {
  max-width: 100%;
}

.recaptcha-field .validation-error {
  text-align: center;
}

@media (max-width: 767.98px) {
  .recaptcha-field {
    margin: 0.65rem auto 0.85rem;
  }

  .recaptcha-field--normal {
    --recaptcha-scale: min(1, calc((100vw - 3rem) / 304));
    width: 100%;
    height: calc(78px * var(--recaptcha-scale));
    justify-content: center;
  }

  .recaptcha-field--normal :deep(.g-recaptcha) {
    transform: scale(var(--recaptcha-scale));
    transform-origin: top center;
    width: 304px !important;
    height: 78px !important;
    flex-shrink: 0;
  }

  .recaptcha-field .validation-error {
    font-size: 0.85rem;
    padding: 0 0.25rem;
  }
}
</style>
