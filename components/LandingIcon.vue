<template>
  <!-- Para enlaces externos (que comienzan con http) -->
  <a v-if="isExternalLink" :href="to" target="_blank" rel="noopener noreferrer" class="d-block">
    <b-button variant="outline" class="btn-5">
      <!-- Ícono de BootstrapVue -->
      <b-icon v-if="type === 'bootstrap-vue'" :icon="icon" class="mb-4 landing-icon"></b-icon>

      <!-- Ícono de Bootstrap Icons -->
      <i v-if="type === 'bootstrap-icons'" class="bi" :class="`bi-${icon} mb-4 landing-icon bootstrap-icons`"></i>

      <!-- Imagen SVG -->
      <img v-if="type === 'svg'" :src="require(`~/assets/${icon}`)" class="mb-4 landing-icon svg-icon" :alt="title" />

      <!-- <b-icon :icon="icon" class="" /> -->
      <h5 class="landing-text"><b>{{ title }}</b></h5>
    </b-button>
  </a>

  <!-- Para enlaces internos -->
  <NuxtLink v-else :to="to" class="d-block">
    <b-button variant="outline" class="btn-5">
      <!-- Ícono de BootstrapVue -->
      <b-icon v-if="type === 'bootstrap-vue'" :icon="icon" class="mb-4 landing-icon"></b-icon>

      <!-- Ícono de Bootstrap Icons -->
      <i v-if="type === 'bootstrap-icons'" class="bi" :class="`bi-${icon} mb-4 landing-icon bootstrap-icons`"></i>

      <!-- Imagen SVG -->
      <img v-if="type === 'svg'" :src="require(`~/assets/${icon}`)" class="mb-4 landing-icon svg-icon" :alt="title" />

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
  },
  computed: {
    isExternalLink() {
      return this.to && this.to.startsWith('http');
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 90px !important;
  height: 80px !important;
  max-width: 90px !important;
  object-fit: fill;
  transform: scaleX(1.2) scaleY(1.1);
  filter: brightness(0) saturate(100%) invert(50%) sepia(50%) saturate(5000%) hue-rotate(2deg) brightness(100%) contrast(110%);
  transition: transform 0.2s ease;
}

.svg-icon:hover {
  transform: scaleX(1.2) scaleY(1.1) scale(1.2);
}
</style>
