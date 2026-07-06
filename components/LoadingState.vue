<template>
  <div class="loading-state text-center" :class="wrapperClass">
    <b-spinner :variant="variant" :label="text"></b-spinner>
    <p class="text-muted mb-0" :class="textClass">{{ text }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: 'Cargando...',
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  variant: {
    type: String,
    default: 'primary',
  },
})

const wrapperClass = computed(() => {
  if (props.size === 'sm') return 'py-2'
  if (props.size === 'lg') return 'py-5'
  return 'py-3'
})

const textClass = computed(() => {
  if (props.size === 'sm') return 'mt-2 small'
  if (props.size === 'lg') return 'mt-3 h5'
  return 'mt-2'
})
</script>
