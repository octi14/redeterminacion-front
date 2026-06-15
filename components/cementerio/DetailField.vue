<template>
  <div class="mb-3">
    <small class="text-muted d-block">{{ label }}</small>
    <slot><strong>{{ value || '-' }}</strong></slot>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, required: true },
    value: { type: String, default: '' },
  },
}
</script>
