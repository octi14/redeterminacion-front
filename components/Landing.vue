<template>
  <div>
    <div class="container text-center">
      <div class="row custom-row">
        <div v-for="(link, index) in links" :key="index" class="col-lg-4 my-4 mx-auto col-md-6 col-sm-12 mb-3">
          <LandingIcon :icon="link.icon" :title="link.title" :type="link.type" :to="link.to" />
        </div>
        <div v-if="adminHacienda" class="col-lg-4 col-md-6 mx-auto my-4 col-sm-12 mb-4">
            <LandingIcon icon="car-front" title="Tránsito" :type="'bootstrap-icons'" to="/transito" />
        </div>
        <div class="col-lg-4 col-md-6 mx-auto my-4 col-sm-12 mb-4">
            <LandingIcon icon="briefcase" title="Compras" :type="'bootstrap-vue'" to="/compras" />
        </div>
        <div v-if="adminHacienda" class="col-lg-4 col-md-6 mx-auto my-4 col-sm-12 mb-4">
          <LandingIcon icon="calculator" title="Obras" :type="'bootstrap-vue'" to="/obras" />
        </div>
      </div>
    </div>
  </div>

  <!--Popup anuncio de rectificación -->
  <!-- <b-modal size="lg" v-model="showPopupAnuncio" id="abierto-anual-modal" hide-footer hide-header centered>
      <h1 style="font-size: 4rem" class="mt-5 landing-text font-weight-bold text-center">ABIERTO ANUAL</h1><hr/>
      <div class="row no-gutters justify-content-center m-5">
        <img src="../assets/version_2.png" class="img-fluid w-100"/>
      </div>
      <div variant="light" show class="row justify-content-center m-4 mt-6">
        <b-icon-exclamation-circle variant="success" font-scale="1.7" class="mr-3 mt-2"></b-icon-exclamation-circle>
        <small style="font-size: 1.2rem">Recordá que el beneficio se otorgará una vez que ARVIGE<br/> haya corroborado la carga de tickets de
          <b>Mayo, Agosto</b> y <br/><b>Octubre del año 2024</b>.</small>
      </div>
    </b-modal> -->

</template>

<script>
export default {
  data() {
    return {
      showPopupAnuncio: false,
      links: [
        { to: "/normativa", icon: "receipt", title: "Normativa", type: "bootstrap-vue" },
        { to: "/modernizacion", icon: "list-ul", title: "Modernización", type: "bootstrap-vue" },
        { to: "/comercio", icon: "shop", title: "Comercio", type: "bootstrap-vue" },
        { to: "/pagos", icon: "cash-coin", title: "Pagos", type: "bootstrap-vue" },
        // { to: "/transito", icon: "car-front", title: "Tránsito", type: "bootstrap-icons" }, // 🚗 Usa Bootstrap Icons
        // { to: "/compras", icon: "briefcase", title: "Compras", type: "bootstrap-vue" }
      ]
    };
  },
  computed: {
    adminHacienda(){
      return this.$store.state.user.admin == "hacienda" || this.$store.state.user.admin == "master"
    }
  },
  mounted() {
    // Verificar si el anuncio ya fue mostrado
    if (!localStorage.getItem('anuncioMostrado')) {
      this.showPopupAnuncio = true; // Mostrar el popup
      localStorage.setItem('anuncioMostrado', 'true'); // Guardar en localStorage
    }
  }
}
</script>

<style>
.landing-icon {
  width: 80px;
  height: 80px;
  color: #ef8918;
  transition: transform 0.2s ease;
  display: flex;
}

.bootstrap-icons {
  font-size: 5.5rem; /* Asegura que mantengan el tamaño */
  line-height: 1; /* Evita espacios extra */
}

/* Aplicar escala al hacer hover en el ícono */
.landing-icon:hover {
  transform: scale(1.15); /* Efecto de escala */
}

.custom-row {
  padding-top:10px;
  max-width: 800px; /* Ajusta el ancho máximo deseado */
  margin-left: auto;
  margin-right: auto;
}
</style>
