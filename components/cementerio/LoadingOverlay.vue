<template>
  <div v-if="show" class="loading-overlay" role="status" aria-live="polite">
    <div class="text-center loading-box">
      <b-spinner variant="success" class="mb-3" />
      <strong class="d-block">{{ message }}</strong>
      <small class="text-muted">Por favor, no cierres esta página.</small>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: { type: Boolean, default: false },
    message: { type: String, default: 'Esperando respuesta del servidor...' },
  },
}
</script>

<style scoped>
.loading-box {
  min-width: 260px;
  padding: 1.25rem 1.75rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 3px 16px rgba(0, 0, 0, 0.2);
}
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.78);
}
</style>
