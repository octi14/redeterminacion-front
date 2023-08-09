<template>
  <div class="section">
    <div class="container">
      <h1 class="h1 my-3 text-center">{{ title }}</h1>
      <div class="section my-4">
        <slot class="my-3"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageContainer',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
}
</script>
