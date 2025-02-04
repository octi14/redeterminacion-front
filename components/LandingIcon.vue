<template>
  <NuxtLink :to="to" class="d-block">
    <b-button variant="outline" class="btn-5">
      <b-icon :icon="icon" class="mb-4 landing-icon" />
      <h5 class="landing-text"><b>{{ title }}</b></h5>
    </b-button>
  </NuxtLink>
</template>

<script>
export default {
  props: {
    icon: String,
    title: String,
    to: String
  }
}
</script>
