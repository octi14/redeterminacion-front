<template>
  <div class="title">
    <b-card class="mx-auto banner main-background mt-4" border-variant="light">
      <Breadcrumbs />
      <h1 class="text-center mt-4 banner-title"><b> {{ title }} </b> </h1>
      <h4 v-if="subtitle" class="text-center banner-subtitle"><b> {{ subtitle }} </b></h4>
      <br v-else />
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

<style scoped>
  @media (max-width: 720px){
    .banner .card-body{
      padding-bottom: 0;
    }
  }
</style>