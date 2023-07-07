<template>
  <div class="title">
    <b-card class="mx-auto landing-banner mt-4 shadow-md" border-variant="light">
      <h1 class="text-center m-3 banner-text" style="color:white"><b> {{ title }} </b> </h1>
      <h5 class="text-center banner-text" style="color:white"> {{ subtitle }} </h5>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'Banner',
  props: {
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
  },
}
</script>
