<template>
  <div class="row justify-content-center">
    <div class="col col-sm-3">
        <div class="card-body">
          <h1 class="h2 text-center">{{ title }}</h1>
          <slot></slot>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormContainer',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
}
</script>
