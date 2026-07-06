<template>
  <div class="landing-page">
    <div class="container landing-grid-container">
      <div class="row justify-content-center landing-grid">
        <div
          v-for="link in tileLinks"
          :key="link.title"
          class="col-10 col-sm-6 col-lg-4 landing-grid-col"
        >
          <LandingIcon
            :icon="link.icon"
            :title="link.title"
            :type="link.type"
            :to="link.to"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPopupAnuncio: false,
      baseLinks: [
        { to: '/normativa', icon: 'receipt', title: 'Normativa', type: 'bootstrap-vue' },
        { to: '/modernizacion', icon: 'list-ul', title: 'Modernización', type: 'bootstrap-vue' },
        { to: '/comercio', icon: 'shop', title: 'Comercio', type: 'bootstrap-vue' },
        { to: '/recaudaciones', icon: 'wallet', title: 'Recaudaciones', type: 'bootstrap-vue' },
        { to: 'https://arvige.gob.ar/lpagos', icon: 'cash-coin', title: 'Pagos', type: 'bootstrap-vue' },
      ],
    }
  },
  computed: {
    adminHacienda() {
      const admin = useUserStore().admin
      return (
        admin === 'hacienda' ||
        admin === 'master'
      )
    },
    tileLinks() {
      const links = [...this.baseLinks]

      if (this.adminHacienda) {
        links.push({
          to: '/transito',
          icon: 'car-front',
          title: 'Tránsito',
          type: 'bootstrap-icons',
        })
      }

      links.push({
        to: '/compras',
        icon: 'briefcase',
        title: 'Compras',
        type: 'bootstrap-vue',
      })

      links.push({
        to: 'https://arvige.gob.ar',
        icon: 'tas.svg',
        title: 'ARVIGE',
        type: 'svg',
      })

      if (this.adminHacienda) {
        links.push({
          to: '/obras',
          icon: 'calculator',
          title: 'Obras',
          type: 'bootstrap-vue',
        })
      }

      return links
    },
  },
  mounted() {
    if (!localStorage.getItem('anuncioMostrado')) {
      this.showPopupAnuncio = true
      localStorage.setItem('anuncioMostrado', 'true')
    }
  },
}
</script>

<style scoped>
.landing-page {
  padding-bottom: 2rem;
  position: relative;
  z-index: 2;
}

.landing-grid-container {
  max-width: 920px;
  margin: 0 auto;
  padding-top: 0.5rem;
}

.landing-grid-col {
  margin-bottom: 1.25rem;
}
</style>
