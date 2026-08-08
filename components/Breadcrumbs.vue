<template>
  <nav v-if="$route.path !== '/'" class="breadcrumbs">
    <b-breadcrumb>
      <!-- Link al inicio -->
      <b-breadcrumb-item :to="'/'">Inicio</b-breadcrumb-item>

      <!-- Generación dinámica de los breadcrumbs -->
      <span v-for="(breadcrumb, index) in breadcrumbs" :key="index" class="breadcrumb-wrapper">
        <span class="separator">></span>
        <b-breadcrumb-item :to="breadcrumb.to ?? undefined">{{ breadcrumb.text }}</b-breadcrumb-item>
      </span>
    </b-breadcrumb>
  </nav>
</template>

<script>
export default {
  computed: {
    // Calcula las migas de pan basadas en la ruta actual.
    // Los segmentos intermedios que no son una pagina real (ej. "/admin")
    // se muestran como texto plano, sin link, para no generar un
    // "No match found for location" al intentar resolverlos como ruta.
    breadcrumbs() {
      const routeSegments = this.$route.path.split('/').filter(segment => segment !== '');

      return routeSegments.map((segment, index) => {
        const to = `/${routeSegments.slice(0, index + 1).join('/')}`;

        return {
          text: segment,
          to: this.routeExists(to) ? to : null,
        };
      });
    },
  },
  methods: {
    // router.resolve() hace console.warn internamente cuando no matchea
    // ninguna ruta, incluso usandolo solo para chequear si existe.
    // Se silencia puntualmente ese warning para esta comprobacion.
    routeExists(path) {
      const originalWarn = console.warn;
      console.warn = () => {};
      try {
        return this.$router.resolve(path).matched.length > 0;
      } finally {
        console.warn = originalWarn;
      }
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
