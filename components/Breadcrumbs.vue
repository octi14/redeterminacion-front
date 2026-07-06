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
.breadcrumbs :deep(.breadcrumb) {
  margin: 0 0 15px 0;
  padding: 0;
  background: none;
  background-color: transparent;
  --bs-breadcrumb-bg: transparent;
  border-radius: 0;
}

.separator {
  margin: 0 0.5em;
  color: #0c681a;
}

.breadcrumb-wrapper {
  display: inline-flex;
  align-items: center;
}

.breadcrumbs :deep(.breadcrumb a),
.breadcrumbs :deep(.breadcrumb-item),
.breadcrumbs :deep(.breadcrumb-item.active) {
  color: #0c681a;
}

.breadcrumbs :deep(.breadcrumb a) {
  font-weight: 600;
  text-decoration: none;
}

.breadcrumbs :deep(.breadcrumb a:hover) {
  text-decoration: underline;
}
</style>
