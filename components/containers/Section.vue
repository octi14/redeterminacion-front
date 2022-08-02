<template>
  <div class="section">
    <div class="container">
      <h1 class="h2 my-3">{{ title }}</h1>
      <div class="section my-3">
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
