<template>
  <div id="app-layout">
    <div id="app-navbar">
      <Navbar />
    </div>
    <div id="app-content" class="mt-5">
      <slot />
      <ModalSessionTimeout :mostrarModal="showSessionTimeoutModal" />
      <ModalMoratoria2026 v-model:mostrar-modal="mostrarMoratoria" />
    </div>
    <Foot />
  </div>
</template>

<script>
import { forceCloseAllModals } from '~/utils/modalCleanup'

export default {
  name: 'Default',
  provide() {
    return {
      closeMoratoriaModal: () => {
        this.cerrarMoratoria()
      },
    }
  },
  data() {
    return {
      sessionExpired: false,
      manualLogout: false, // Bandera para detectar logout manual
      mostrarMoratoria: false,
    };
  },
  computed: {
    token() {
      return useUserStore().token
    },
    showSessionTimeoutModal() {
      const path = this.$route?.path || ''
      return this.sessionExpired && path !== '/login'
    },
  },
  watch: {
    token(newToken) {
      if (newToken) {
        const expired = this.checkTokenExpired(newToken)
        this.sessionExpired = expired
        if (!expired) {
          this.manualLogout = false
        }
      } else if (this.$route?.path !== '/login') {
        // Solo mostrar el popup si NO fue un logout manual (nunca en /login)
        this.sessionExpired = !this.manualLogout;
      } else {
        this.sessionExpired = false;
      }
    },
    '$route.path'(newPath) {
      if (!import.meta.client) return
      if (newPath !== '/') {
        this.mostrarMoratoria = false
      } else if (this.debeMostrarMoratoria()) {
        this.mostrarMoratoria = true
      }
      forceCloseAllModals()
    },
    mostrarMoratoria(visible) {
      if (!visible && import.meta.client) {
        localStorage.setItem('moratoria2026cerrada', '1')
      }
    },
  },
  mounted() {
    // Si existe usuario en localStorage, lo levanto
    if (localStorage.getItem("userId")) {
      const authUser = {
        id: localStorage.getItem("userId"),
        username: localStorage.getItem("username"),
        token: localStorage.getItem("userToken"),
        admin: localStorage.getItem("userAdmin"),
      };
      useUserStore().setAuthenticated(authUser);
    }

    // También chequeamos si el token ya está vencido al cargar
    if (this.token) {
      this.sessionExpired = this.checkTokenExpired(this.token);
    }

    if (import.meta.client && this.$route?.path === '/' && this.debeMostrarMoratoria()) {
      this.$nextTick(() => {
        this.mostrarMoratoria = true
      })
    }

    // Escuchar el evento de logout manual
    useNuxtApp().hook('manual-logout', () => {
      this.manualLogout = true;
    });
  },
  methods: {
    debeMostrarMoratoria() {
      if (!import.meta.client) return false
      return !localStorage.getItem('moratoria2026cerrada')
    },
    cerrarMoratoria() {
      this.mostrarMoratoria = false
      if (import.meta.client) {
        localStorage.setItem('moratoria2026cerrada', '1')
      }
    },
    checkTokenExpired(token) {
      if (!token) return true;

      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar JWT
        const now = Math.floor(Date.now() / 1000);

        if (payload.exp > now) {
          const timeLeft = (payload.exp - now) / 3600; // Convertir segundos a horas
          console.log(`🔹 El token expira en aproximadamente ${timeLeft.toFixed(2)} horas.`);
        }

        return payload.exp < now; // Comparar con la fecha actual
      } catch (e) {
        console.error("❌ Error al decodificar el token:", e);
        return true; // Si hay un error, asumimos que está vencido
      }
    }
  },
}
</script>
