<template>
  <nav v-if="$route.path !== '/'" class="breadcrumbs">
    <b-breadcrumb>
      <!-- Link al inicio -->
      <b-breadcrumb-item :to="'/'">Inicio</b-breadcrumb-item>

      <!-- Generación dinámica de los breadcrumbs -->
      <span v-for="(breadcrumb, index) in breadcrumbs" :key="index" class="breadcrumb-wrapper">
        <span class="separator">></span>
        <b-breadcrumb-item :to="breadcrumb.to">{{ breadcrumb.text }}</b-breadcrumb-item>
      </span>
    </b-breadcrumb>
  </nav>
</template>

<script>
export default {
  computed: {
    // Calcula las migas de pan basadas en la ruta actual
    breadcrumbs() {
      const routeSegments = this.$route.path.split('/').filter(segment => segment !== '');

      return routeSegments.map((segment, index) => ({
        text: segment,
        to: `/${routeSegments.slice(0, index + 1).join('/')}`,
      }));
    },
  },
};
</script>

<style scoped>
.breadcrumb {
  margin: 0 0 15px 0;
  background: none;
}
.separator {
  margin: 0 0.5em;
  color: #0c681a;
}
.breadcrumb-wrapper {
  display: inline-flex;
  align-items: center;
}
.breadcrumb a, .breadcrumb span {
  color: #0c681a;
}
.breadcrumb a {
  font-weight: 600;
}
</style>
