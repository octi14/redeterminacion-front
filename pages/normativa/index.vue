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
                <b-carousel-slide :img-src="bannerNormativa"></b-carousel-slide>
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
                <b-carousel-slide :img-src="bannerNormativaMobile"></b-carousel-slide>
            </b-carousel>
        </div>
    <div class="mt-5">
      <MenuItem to="/normativa/comercio" icon="shop" title="Digesto Comercial" description="Normativa vigente para los comercios de Villa Gesell"/>
      <MenuItem
        to="/normativa/obras"
        title="Normativa de Obras Públicas"
        description="Normativa vigente para Obras Públicas de la localidad de Villa Gesell"
      >
        <template #icon>
          <ObraIcon />
        </template>
      </MenuItem>
    </div>
    <div class="page-btn-volver-wrap">
      <NuxtLink to="/">
        <b-button variant="primary" size="sm" class="page-btn-volver"> Volver </b-button>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import bannerNormativa from '~/assets/banner-normativa.png'
import bannerNormativaMobile from '~/assets/banner-normativa-mobile.png'

export default {
  data() {
    return {
      slide: 0,
      bannerNormativa,
      bannerNormativaMobile,
    }
  },
  computed: {
    adminHacienda() {
      const admin = useUserStore().admin
      return admin == "hacienda" || admin == "master";
    },
  },
  methods: {
    onSlideStart() {},
    onSlideEnd() {},
  },
}
</script>

<style scoped>
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

/* Agregar márgenes laterales en mobile para los rows */
@media (max-width: 767.98px) {
  .row.no-gutters {
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>
