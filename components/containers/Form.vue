<template>
  <div class="row col-sm-12 mx-auto justify-content-center">
    <div class="col col-sm-4">
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
