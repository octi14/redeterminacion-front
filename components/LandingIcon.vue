<template>
  <NuxtLink :to="to" class="d-block">
    <b-button variant="outline" class="btn-5">
      <!-- Ícono de BootstrapVue -->
      <b-icon v-if="type === 'bootstrap-vue'" :icon="icon" class="mb-4 landing-icon"></b-icon>

      <!-- Ícono de Bootstrap Icons -->
      <i v-if="type === 'bootstrap-icons'" class="bi" :class="`bi-${icon} mb-4 landing-icon bootstrap-icons`"></i>
      <!-- <b-icon :icon="icon" class="" /> -->
      <h5 class="landing-text"><b>{{ title }}</b></h5>
    </b-button>
  </NuxtLink>
</template>

<script>
export default {
  props: {
    icon: String,
    title: String,
    type: String,
    to: String
  }
}
</script>
