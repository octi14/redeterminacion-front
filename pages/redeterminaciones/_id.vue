<template>
  <div class="page main-background">
    <Banner title="Obras"/>
    <template v-if="certificado">
      <div class="container mx-auto">
        <div class="row mx-auto" v-if="obra">
          <div class="col mx-auto">
            <div class="container mx-auto">
            <!-- View -->
              <h2 class="mx-auto text-center"> Redeterminar certificado </h2>

              <b-form class="col mx-auto" v-if="!obraUvi">
                <h5 class="col-main"> Acta de inicio: {{ this.obra.acta_inicio }} </h5>
                <h6> Fecha de última redeterminación: </h6>
                <b-form-input class="col-md-2" v-model="fechaAnterior" type="date"> </b-form-input>
                <p> En caso de ser la primera redeterminación, se tomará como índice origen el correspondiente al mes de inicio de la obra. </p>
                <hr/>
                <h6> Fecha de cancelación: </h6>
                <b-form-input class="col-md-2" v-model="fechaCancelacion" type="date"> </b-form-input>
              </b-form>
              <b-form class="col mx-auto" v-else>
                <h5 class="col-main"> Acta de inicio: {{ this.obra.acta_inicio }} </h5>
                <h6> Introducir valor de índice UVI inicial </h6>
                <b-form-input class="col-md-2" v-model="uviOrigen" type="double"> </b-form-input>
                <hr/>
                <h6> Introducir valor de índice UVI de fecha de redeterminación </h6>
                <b-form-input class="col-md-2" v-model="uviDestino" type="double"> </b-form-input>
              </b-form>
              <b-button variant="primary" @click="onApplyIndex" v-if="!obraUvi"> Aplicar índices </b-button>
              <a href="https://www.camarco.org.ar/wp-content/uploads/2023/05/Evolucion-UVIs.pdf" target="_blank"> Ver índices UVI </a>
            </div>
          </div>
          <!-- Cambiar el formato del panel si la obra es UVI -->
          <div class="container mx-auto" v-for="(_,index) in certificado.items" :key="index">
            <div class="layout">
                <strong class="row h5">{{index +1}}. {{ certificado.items[index].item }}</strong>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Saldo original</strong><br>
              </p>
              <!-- Calcular al revés si es UVI -->
              <p class="col col-complementary" role="complementary" v-if="!obraUvi">
                <a>${{ format(certificado.items[index].contratado - saldoAcumulado(index)) }}</a>
              </p>
              <p class="col col-complementary" role="complementary" v-else>
                <a>${{ format((certificado.items[index].contratado - certificado.items[index].anticipo) * (certificado.items[index].avance/100))}}</a>
              </p>
            </div>
            <br>
            <div v-if="!obraUvi">
              <div class="layout">
                <p class="col col-main">
                  <strong>Proporcional materiales</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>${{ format(ponderar(certificado.items[index].contratado - saldoAcumulado(index), obra.ponderacion[0].porcentaje)) }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Proporcional gastos generales</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>${{ format(ponderar(certificado.items[index].contratado - saldoAcumulado(index), obra.ponderacion[1].porcentaje)) }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Proporcional mano de obra</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>${{ format(ponderar(certificado.items[index].contratado - saldoAcumulado(index), obra.ponderacion[2].porcentaje)) }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Proporcional equipos</strong><br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>${{ format(ponderar(certificado.items[index].contratado - saldoAcumulado(index), obra.ponderacion[3].porcentaje)) }}</a>
                </p>
              </div>
              <br>
            </div>
            <!-- <hr/> -->

            <div v-if="!obraUvi">
              <div class="layout">
                <p class="col col-main">
                  <strong>Redeterminación materiales </strong> <br>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>$ {{ format(redeterminarMateriales(ponderar(certificado.items[index].contratado - saldoAcumulado(index), obra.ponderacion[0].porcentaje))) }} </a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Redeterminación gastos generales </strong>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>$ {{ format(redeterminarGenerales(ponderar(certificado.items[index].contratado - saldoAcumulado(index), obra.ponderacion[1].porcentaje))) }}</a>
                </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Redeterminación mano de obra </strong>
                </p>
                  <p class="col col-complementary" role="complementary">
                    <a>$ {{ format(redeterminarManoObra(ponderar(certificado.items[index].contratado - saldoAcumulado(index), obra.ponderacion[2].porcentaje))) }}
                    </a>
                  </p>
              </div>
              <div class="layout">
                <p class="col col-main">
                  <strong>Redeterminación equipos </strong>
                </p>
                <p class="col col-complementary" role="complementary">
                  <a>$ {{ format(redeterminarEquipos(ponderar(certificado.items[index].contratado - saldoAcumulado(index), obra.ponderacion[3].porcentaje))) }} </a>
                </p>
              </div>
            </div>
            <div v-else>
              <div class="layout">
                <p class="col col-main">
                  <strong>Saldo redeterminado</strong> <br>
                </p>
                <!-- Cambiar fórmula: monto = certificado -->
                <p class="col col-complementary" role="complementary" v-if="!obraUvi">
                  <a>$ {{ format(redeterminarUVI(certificado.items[index].contratado - saldoAcumulado(index)))}} </a>
                </p>
                <p class="col col-complementary" role="complementary" v-else>
                  <a>$ {{ format(redeterminarUVI((certificado.items[index].contratado - certificado.items[index].anticipo) * (certificado.items[index].avance/100)))}} </a>
                </p>
              </div>
            </div>
            <!-- <div class="layout">
              <p class="col col-main">
                <strong class="h4">Total redeterminado </strong>
                <p class="col col-complementary">$ {{ totales[index] }} </p>
            </div> -->
            <hr />
          </div>
          <b-button variant="success" @click="onGuardar"> Guardar </b-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>

export default {
  data() {
    return {
      obraUvi: false,

      fechaAnterior: null,
      fechaCancelacion: null,

      origenMateriales: 0,
      destinoMateriales: 0,
      origenManoObra: 0,
      destinoManoObra: 0,
      origenGenerales: 0,
      destinoGenerales: 0,
      origenEquipos: 0,
      destinoEquipos: 0,

      uviOrigen: 0,
      uviDestino: 0,

      totales: [],

      redeterminacion: [],
    }
  },
  computed: {
    certificado(){
      return this.$store.state.certificados.single
    },
    obra(){
      return this.$store.state.obras.single
    }
  },
  async fetch() {
    const certificadoId = this.$route.params.id
    await this.$store.dispatch('certificados/getSingle',{
      id: certificadoId,
    })
    const obraId = this.certificado.obra
    await this.$store.dispatch('obras/getSingle', {
      id: obraId,
    })
    for (var i = 0; i < this.obra.items.length; i++) {
      this.totales.push(0)
    }
    this.obraUvi = (this.obra.ponderacion[0].porcentaje == null)
  },
  fetchOnServer: false,
  activated() {
    this.$fetch()
  },
  methods: {
    onResetEdit() {
      this.editing = false
    },
    ponderar(saldo, ponderacion) {
      return (saldo * ponderacion) / 100
    },
    format(value) {
        if(value){
          let val = (value/1).toFixed(2).replace('.', ',')
          return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }else{
          return 0
        }
    },
    async onApplyIndex(){
      if(!this.obraUvi){
        var mes = new Date(this.obra.acta_inicio).getUTCMonth() +1
        var año = new Date(this.obra.acta_inicio).getFullYear()
        if(this.fechaAnterior){
          const otroMes = new Date(this.fechaAnterior).getUTCMonth() +1
          const otroAño = new Date(this.fechaAnterior).getFullYear()
          await this.$store.dispatch('indices/search', {
            mes: otroMes,
            año: otroAño,
          })
        } else {
          await this.$store.dispatch('indices/search', {
            mes: mes,
            año: año,
          })
        }
        this.origenMateriales = this.$store.state.indices.indices[0].valor
        this.origenGenerales = this.$store.state.indices.indices[1].valor
        this.origenManoObra = this.$store.state.indices.indices[2].valor
        this.origenEquipos = this.$store.state.indices.indices[3].valor
        const mes2 = new Date(this.fechaCancelacion).getUTCMonth() +1
        const año2 = new Date(this.fechaCancelacion).getFullYear()
        await this.$store.dispatch('indices/search', {
          mes: mes2,
          año: año2,
        })
        this.destinoMateriales = this.$store.state.indices.indices[0].valor
        this.destinoGenerales = this.$store.state.indices.indices[1].valor
        this.destinoManoObra = this.$store.state.indices.indices[2].valor
        this.destinoEquipos = this.$store.state.indices.indices[3].valor
      }
    },
    redeterminarMateriales(monto) {
      return monto * ( (this.destinoMateriales/this.origenMateriales) -1)
    },
    redeterminarGenerales(monto) {
      return monto * ( (this.destinoGenerales/this.origenGenerales) -1)
    },
    redeterminarManoObra(monto) {
      return monto * ( (this.destinoManoObra/this.origenManoObra) -1)
    },
    redeterminarEquipos(monto) {
      return monto * ( (this.destinoEquipos/this.origenEquipos) -1)
    },
    redeterminarUVI(monto) {
      return monto * ( (this.uviDestino/this.uviOrigen) -1)
    },
    async onGuardar(){
      for (var i = 0; i < this.certificado.items.length; i++) {
        if(!this.obraUvi){
          this.redeterminacion.push({
            item: this.certificado.items[i].item,
            saldo: this.obra.items[i].saldo,
            materiales: this.redeterminarMateriales(this.ponderar(this.certificado.items[i].saldo, this.obra.ponderacion[0].porcentaje)),
            generales: this.redeterminarGenerales(this.ponderar(this.certificado.items[i].saldo,this.obra.ponderacion[1].porcentaje)),
            manoObra: this.redeterminarManoObra(this.ponderar(this.certificado.items[i].saldo,this.obra.ponderacion[2].porcentaje)),
            equipos: this.redeterminarEquipos(this.ponderar(this.certificado.items[i].saldo,this.obra.ponderacion[3].porcentaje)),
            uvi: 0,
          })
        }else{
          this.redeterminacion.push({
            item: this.certificado.items[i].item,
            saldo: this.obra.items[i].saldo,
            materiales: 0,
            generales: 0,
            manoObra: 0,
            equipos: 0,
            uvi: this.redeterminarUVI((this.certificado.items[i].contratado - this.certificado.items[i].anticipo) * (this.certificado.items[i].avance/100)),
          })
        }
      }
      try {
        const userToken = this.$store.state.user.token
        await this.$store.dispatch('redeterminaciones/create', {
          obra: this.obra.id,
          certificado: this.certificado.id,
          items: this.redeterminacion,
          userToken,
        })
        this.$bvToast.toast('Creada correctamente', {
          title: 'Creada',
          variant: 'success',
          appendToast: true,
          solid: true,
        })
        await this.$router.push('/redeterminacion')
      } catch (e) {
        this.$bvToast.toast('Error creando la redeterminación', {
          title: 'Error',
          variant: 'danger',
          appendToast: true,
          solid: true,
        })
      }
    },
    saldoAcumulado(i) {
      var saldoAcumulado = 0
      //le saco el anticipo financiero proporcional al ítem
      saldoAcumulado = saldoAcumulado + ((this.obra.anticipo_finan / this.obra.cotizacion) * this.obra.items[i].monto)
      //recorro los certificados
      for(var c = 0; c < this.obra.certificados.length; c++) {
        //si es el certificado 1 (el primero):
        if(this.obra.certificados[0] == this.certificado.id) {
          return saldoAcumulado
        }
        //si es anterior al que estoy usando:
        if (this.obra.certificados[c] != this.certificado.id) {
          //acumulo saldo
          saldoAcumulado = saldoAcumulado + this.$store.state.certificados.certifs[c].items[i].saldo
        }else{
          return saldoAcumulado
        }
      }
    },
    buscarAvance(n){
      var avanceTotal = 0
      for(var c = 0; c < this.obra.certificados.length; c++) {
        if (this.obra.certificados[c] != this.certificado.id) {
          avanceTotal = avanceTotal + this.$store.state.certificados.certifs[c].items[n].avance
        }else{
          return (this.certificado.items[n].contratado * avanceTotal)/100
        }
      }
    },
    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
  },
}
</script>

<style type="text/css">
/* Layout: */

.col-main {
  flex: 1;
}

.col-complementary {
  flex: 1;
}

.col strong{
  margin-bottom: 0%;
}
/* Responsive: */

@media only screen and (min-width: 640px) {
  .layout {
    display: flex;
  }
}

/* etc */

/* body {
  margin: 1.5em;
} */

.container {
  max-width: 70em;
  margin-right: auto;
  margin-left: auto;
}

.col {
  padding: 1em;
  margin: 0 2px 2px 0;
}


</style>
