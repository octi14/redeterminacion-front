<template>
  <div class="page main-background">
    <Banner title="Cementerio" />

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
        <b-carousel-slide :img-src="bannerPagoDoble"></b-carousel-slide>
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
        <b-carousel-slide :img-src="bannerPagoDoble"></b-carousel-slide>
      </b-carousel>
    </div>

    <b-container class="col-8">
      <b-row>
        <b-col>
          <br />
          <b-card class="section-card shadow-card my-2" v-bind:class="{ 'expanded': isCardExpanded(0) }" >
            <h4 class="section-title" @click="toggleCard(0)">
              ¿A qué nos referimos con este trámite?
              <i class="bi bi-chevron-compact-down"></i>
              <i class="bi bi-chevron-compact-up"></i>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(0)">
                <div class="li-row first-li">
                  <div class="li-icon"><i class="bi bi-check-lg" style="font-size: 0.75em"></i></div><div class="li-content"> Información del trámite de <b>certificado de defunción</b>. (Contenido provisorio, se copió el layout de Recaudaciones hasta contar con el texto oficial).</div>
                </div>
                <div class="li-row first-p">
                  <div class="li-icon"><i class="bi bi-check-lg" style="font-size: 0.75em"></i></div><div class="li-content"> Recordá que el Municipio puede solicitar <b>documentación adicional</b> y que los archivos deben ser <b>legibles</b> y pesar <b>hasta 15Mb</b>.</div>
                </div>
              </div>
            </transition>
          </b-card>

          <b-card class="section-card shadow-card my-2">
            <h4 class="section-title" @click="toggleCard(1)">
              Requisitos
              <i class="bi bi-chevron-compact-down"></i>
              <i class="bi bi-chevron-compact-up"></i>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(1)">
                <div class="li-row first-li"><div class="li-icon"><i class="bi bi-check-lg" style="font-size: 0.75em"></i></div><div class="li-content">Contar con la documentación digitalizada en formato imagen o PDF.</div></div>
              </div>
            </transition>
          </b-card>

          <div class="page-btn-iniciar-tramite-wrap"><b-button variant="success" size="sm" class="btn-form page-btn-iniciar-tramite" @click="showPopupConf()">Iniciar Trámite</b-button></div>
        </b-col>
      </b-row>
    </b-container>

    <!-- Popup de confirmación -->
    <BModal v-model="showConfirmationPopup" no-footer :header-bg-variant="'success'" centered>
      <template #header>
        <div class="confirmation-popup-header">
          <i class="bi bi-exclamation-triangle text-light"></i>
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h2 class="icon-orange"><b>IMPORTANTE</b></h2>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="documentCheckbox" v-model="documentCheckboxChecked"/>
          <label class="form-check-label" for="documentCheckbox">Ya tengo todos los documentos digitalizados y la información requerida.</label>
        </div>
        <div class="text-center mt-3">
          <nuxt-link :class="{ 'disabled': !documentCheckboxChecked }" :to="{path: '/cementerio/certificado_defuncion/form' }">
            <b-button variant="success" :disabled="!documentCheckboxChecked" @click="proceedToForm()" >
              Aceptar
            </b-button>
          </nuxt-link>
        </div>
      </div>
    </BModal>
  </div>
</template>

<script>
import bannerPagoDoble from '~/assets/banner-pago-doble.png'

export default {
  data(){
    return{
      bannerPagoDoble,
      showConfirmationPopup: false,
      documentCheckboxChecked: false,
      expandedCards: [],
      slide: 0,
    }
  },
  methods:{
    showPopupConf(){
      this.showConfirmationPopup = true
    },
    toggleCard(cardIndex) {
      if (this.expandedCards.includes(cardIndex)) {
        this.expandedCards = this.expandedCards.filter((index) => index !== cardIndex);
      } else {
        this.expandedCards.push(cardIndex);
      }
    },
    isCardExpanded(cardIndex) {
      return this.expandedCards.includes(cardIndex);
    },
    proceedToForm() {
      this.showConfirmationPopup = false;
    },
    onSlideStart() {},
    onSlideEnd() {},
  }
}
</script>

<style scoped>
.btn-form{
  margin: 15px 0;
}
.confirmation-popup-header{
 margin: auto;
 font-size: 2rem;
}
.confirmation-popup-body h2{
  text-align: center;
  font-size: 2.5rem;
}
.confirmation-popup-body h2 b{
  padding: 0 5%;
  border-bottom: 1px solid #ccc;
}
.confirmation-popup-body p{
  text-align: center;
  font-size: 1.25rem;
  color: black;
}
.confirmation-popup-body .form-check{
  margin: auto;
  margin-top: 1rem;
  width: fit-content;
}
.disabled {
  pointer-events: none;
}
.section-card{
  margin: 1rem 0;
  padding: 0.5rem 0;
  box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.75);
  -webkit-box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.75);
  -moz-box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.75);
}
.section-title {
  color: #0c681a !important;
  cursor: pointer;
  width: 100%;
  display: inline-block;
  margin-bottom:0px;
  font-weight: bold;
}
.bi-chevron-compact-up, .bi-chevron-compact-down{
  position: absolute;
  right: 20px;
}
.li-row{ display:flex; width:100%; }
.li-icon, .li-content{ display:inline-block; }
.icon-orange{ color:#E27910; }
.mainCarrousel{ display:block; }
.mobileCarrousel{ display:none; }
@media (max-width: 720px){
  .mainCarrousel{ display:none; }
  .mobileCarrousel{ display:block; }
}
</style>



