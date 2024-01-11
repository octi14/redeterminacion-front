<template>
  <nav class="breadcrumbs">
    <b-breadcrumb :items="breadcrumbs" />
  </nav>
</template>

<script>
export default {
  data() {
    return {
      breadcrumbs: [],
    };
  },
  computed: {
    // Calcula las migas de pan basadas en la ruta actual
    generateBreadcrumbs() {
      const routeSegments = this.$route.path.split('/').filter(segment => segment !== '');

      const breadcrumbs = routeSegments.map((segment, index) => {
        return {
          text: segment,
          to: `/${routeSegments.slice(0, index + 1).join('/')}`,
        };
      });

      return [
        {
          text: 'Inicio',
          to: '/',
        },
        ...breadcrumbs,
      ];
    },
  },
  watch: {
    // Actualiza las migas de pan cuando cambia la ruta
    $route: 'updateBreadcrumbs',
  },
  methods: {
    updateBreadcrumbs() {
      this.breadcrumbs = this.generateBreadcrumbs;
    },
  },
  created() {
    this.breadcrumbs = this.generateBreadcrumbs;
  },
};
</script>

<style scoped>
.breadcrumb {
  margin: 0 0 15px 0;
  background: none;
}
.breadcrumb a, .breadcrumb span, .breadcrumb-item::before{
  color: #0c681a ;
}
.breadcrumb a{
 font-weight: 600;
}
</style>
