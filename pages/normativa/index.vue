<template>
  <div class="page main-background">
    <Banner title="Normativa"/>
    <div class="col-10 mainCarrousel" style="margin: auto; margin-top: 2rem">
            <b-carousel
            id="mainCarousel"
            v-model="slide"
            :interval="4000"
            img-width="100%"
            style="text-shadow: 1px 1px 2px #333;"
            @sliding-start="onSlideStart"
            @sliding-end="onSlideEnd"
            >
                <b-carousel-slide img-src="../../assets/banner-normativa.png"></b-carousel-slide>
            </b-carousel>
        </div>
        <div class="col-10 mobileCarrousel" style="margin: auto; margin-top: 2rem">
            <b-carousel
            id="mainCarousel"
            v-model="slide"
            :interval="4000"
            img-width="100%"
            style="text-shadow: 1px 1px 2px #333;"
            @sliding-start="onSlideStart"
            @sliding-end="onSlideEnd"
            >
                <b-carousel-slide img-src="../../assets/banner-normativa-mobile.png"></b-carousel-slide>
            </b-carousel>
        </div>
    <div class="mt-5">
      <MenuItem to="/normativa/comercio" icon="shop" title="Digesto Comercial" description="Normativa vigente para los comercios de Villa Gesell"/>
      <div class="row no-gutters justify-content-center mt-5">
        <NuxtLink to="/normativa/obras" class="col-md-5">
          <b-button variant="outline" class="d-flex w-100 white shadow-card">
            <div class="me-3">
              <ObraIcon class="my-3 obra-icon"/>
            </div>
            <div class="col text-left my-auto">
              <h3 class="landing-text"><b> Normativa de Obras Públicas </b></h3>
              <h6>Normativa vigente para Obras Públicas de la localidad de Villa Gesell</h6>
            </div>
          </b-button>
        </NuxtLink>
      </div>
    </div>
    <div class="text-center m-4 float-lg-end">
      <NuxtLink to="/">
        <b-button variant="primary"> Volver </b-button>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    adminHacienda() {
      return this.$store.state.user.admin == "hacienda" || this.$store.state.user.admin == "master";
    }
  }
};
</script>

<style scoped>
.landing-icon {
  width: 60px;
  height: 60px;
  color: #ef8918;
  transition: transform 0.2s ease;
}
/* Aplicar escala al hacer hover en el ícono */
.landing-icon:hover {
  transform: scale(1.15);
}
.obra-icon{
  padding-left: 8px;
  color:#ef8918;
  transition: transform 0.2s ease; /* Cambia la duración a medio segundo (0.5s) */
}
/* Aplicar escala al hacer hover en el ícono */
.obra-icon:hover {
  transform: scale(1.15); /* Ajusta el valor según desees el efecto de escala */
}

.col{
  margin: 16px;
}

.mainCarrousel{
    display: block;
  }
  .mobileCarrousel{
    display: none;
  }

  @media (max-width: 1200px) {
  .col-8{
    max-width: 80%;
  }
  .importante-card p{
    font-size: 0.8rem;
  }
  .importante-card .col-md-2{
    padding: 0;
  }
  .videoTuto{
    width: 100%;
  }
  .botonera-container .row div .selected{
    border: #0c681a 2px solid;
    -webkit-border-radius: 00px;
    -moz-border-radius: 00px;
    border-radius: 00px;
    cursor: auto;
  }
  .mainCarrousel{
    display: block;
  }
  .mobileCarrousel{
    display: none;
  }
  .botonera-container .row div{
    /*Opcion 1. 2 botones por fila*/
  width: 50%;
  margin: 0.5rem auto;
    /* Opcion 2. 1 boton por fila
  width: 100%;
  margin: 0.5rem 10%;
    */
  }
}
@media (max-width: 720px){
  .mainCarrousel{
    display: none;
  }
  .mobileCarrousel{
    display: block;
  }
  .col-8{
    max-width: 90%;
  }
  .botonera-container .row div{
    /*Opcion 1. 2 botones por fila*/
  width: 50%;
  margin: 0.5rem auto;
    /* Opcion 2. 1 boton por fila
  width: 100%;
  margin: 0.5rem 10%;
    */
  }
  .botonera-container .row div img{
    margin: 0 !important;
  }
}
</style>
