<template>
  <div class="title">
    <b-card class="mx-auto landing-banner3 mt-4" border-variant="light">
      <Breadcrumbs />
      <h1 class="text-center mt-4 banner-title"><b> {{ title }} </b> </h1>
      <h4 v-if="subtitle" class="text-center banner-subtitle"><b> {{ subtitle }} </b></h4>
      <br v-else />
    </b-card>
  </div>
</template>

<script>
import Breadcrumbs from '~/components/Breadcrumbs.vue';
export default {
  components: {
    Breadcrumbs,
  },
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
