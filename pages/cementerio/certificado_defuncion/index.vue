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
        <b-carousel-slide img-src="../../../assets/banner-pago-doble.png"></b-carousel-slide>
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
        <b-carousel-slide img-src="../../../assets/banner-pago-doble.png"></b-carousel-slide>
      </b-carousel>
    </div>

    <b-container class="col-8">
      <b-row>
        <b-col>
          <br />
          <b-card class="section-card shadow-card my-2" v-bind:class="{ 'expanded': isCardExpanded(0) }" >
            <h4 class="section-title" @click="toggleCard(0)">
              ¿A qué nos referimos con este trámite?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(0)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(0)">
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Información del trámite de <b>certificado de defunción</b>. (Contenido provisorio, se copió el layout de Recaudaciones hasta contar con el texto oficial).</div>
                </div>
                <div class="li-row first-p">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Recordá que el Municipio puede solicitar <b>documentación adicional</b> y que los archivos deben ser <b>legibles</b> y pesar <b>hasta 15Mb</b>.</div>
                </div>
              </div>
            </transition>
          </b-card>

          <b-card class="section-card shadow-card my-2">
            <h4 class="section-title" @click="toggleCard(1)">
              Requisitos
              <b-icon-chevron-compact-down v-if="!isCardExpanded(1)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(1)">
                <div class="li-row first-li"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content">Contar con la documentación digitalizada en formato imagen o PDF.</div></div>
              </div>
            </transition>
          </b-card>

          <b-button variant="success" class="float-right btn-form" @click="showPopupConf()">Iniciar Trámite</b-button>
        </b-col>
      </b-row>
    </b-container>

    <!-- Popup de confirmación -->
    <b-modal v-model="showConfirmationPopup" hide-footer :header-bg-variant="'success'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header">
          <b-icon icon="exclamation-triangle" scale="2" variant="light" ></b-icon>
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
            <b-btn variant="success" :disabled="!documentCheckboxChecked" @click="proceedToForm()" >
              Aceptar
            </b-btn>
          </nuxt-link>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default({
  data(){
    return{
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
})
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



