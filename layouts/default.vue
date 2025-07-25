<template>
  <div id="app-layout">
    <div id="app-navbar">
      <Navbar />
    </div>
    <div id="app-content" class="mt-5">
      <Nuxt keep-alive />
      <ModalSessionTimeout :mostrarModal="sessionExpired" />
    </div>
    <Foot />
  </div>
</template>

<script>
export default {
  name: 'Default',
  data() {
    return {
      sessionExpired: false,
      manualLogout: false, // Bandera para detectar logout manual
    };
  },
  computed: {
    token() {
      return this.$store.state.user.token;
    },
  },
  watch: {
    token(newToken) {
      if (newToken) {
        this.sessionExpired = this.checkTokenExpired(newToken);
        this.manualLogout = false; // Resetear la bandera cuando hay token
      } else {
        // Solo mostrar el popup si NO fue un logout manual
        this.sessionExpired = !this.manualLogout;
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
      this.$store.commit("user/setAuthenticated", authUser);
    }

    // También chequeamos si el token ya está vencido al cargar
    if (this.token) {
      this.sessionExpired = this.checkTokenExpired(this.token);
    }

    // Escuchar el evento de logout manual
    this.$nuxt.$on('manual-logout', () => {
      this.manualLogout = true;
    });
  },
  methods: {
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
