<template>
  <NuxtLayout name="default">
    <div class="page main-background">
      <Banner :title="bannerTitle" />
      <div class="mt-5">
        <b-card class="error-card shadow-card col-md-6 col-sm-10 mx-auto text-center">
          <i
            class="bi bi-exclamation-triangle-fill error-icon d-block mx-auto"
            aria-hidden="true"
          />
          <p v-if="statusCode" class="error-code mb-2">Error {{ statusCode }}</p>
          <h2 class="error-title mb-3">{{ title }}</h2>
          <p class="error-message mb-4">{{ message }}</p>
          <b-button variant="success" class="btn-orange" @click="goHome">
            Volver al inicio
          </b-button>
        </b-card>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
const props = defineProps({
  error: {
    type: Object,
    required: true,
  },
})

const statusCode = computed(() => Number(props.error?.statusCode) || 500)

const isServerError = computed(() => statusCode.value >= 500)
const isNotFound = computed(() => statusCode.value === 404)

const bannerTitle = computed(() => {
  if (isNotFound.value) return 'Página no encontrada'
  if (isServerError.value) return 'Error del servidor'
  return 'Ha ocurrido un error'
})

const title = computed(() => {
  if (isNotFound.value) return 'No encontramos la página solicitada'
  if (isServerError.value) return 'Ocurrió un error inesperado'
  return 'No pudimos completar la operación'
})

const message = computed(() => {
  if (isNotFound.value) {
    return 'La dirección ingresada no existe o ya no está disponible. Verificá la URL o volvé al inicio.'
  }
  if (isServerError.value) {
    return 'Estamos teniendo dificultades para procesar tu solicitud. Por favor, intentá nuevamente en unos minutos.'
  }
  return 'Si el problema persiste, comunicate con el área correspondiente del municipio.'
})

if (import.meta.server) {
  console.error('[error page]', {
    statusCode: statusCode.value,
    url: props.error?.url,
    cause: props.error?.message,
    stack: props.error?.stack,
  })
}

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<style scoped>
.error-card {
  margin-top: 2rem;
  margin-bottom: 3rem;
  padding: 1.5rem 1rem 2rem;
}

.error-icon {
  color: #cc0025;
  font-size: 4rem;
  line-height: 1;
  margin-bottom: 1rem;
}

.error-code {
  color: #6c757d;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.error-title {
  color: #07691c;
  font-size: 1.5rem;
  font-weight: 700;
}

.error-message {
  color: #333;
  font-size: 1.05rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 36rem;
}
</style>
