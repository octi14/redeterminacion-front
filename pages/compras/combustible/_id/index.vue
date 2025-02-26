<template>
  <div class="page main-background">
    <Banner title="Compras" subtitle="Detalle de orden de compra"/>
    <!-- Header + Datos de la orden de compra -->
    <template v-if="orden && adminCompras">
      <div class="flex col" style="width: 96%">
        <div class="row justify-content-center mt-3">
          <h4> Número de orden: <b> {{ orden.nroOrden }}</b></h4>
        </div>
        <!-- <div class="row justify-content-center mt-3">
          <div class="h5 row"> Estado:
            <h5 :class="getStatusClass(habilitacion.status)" class="ml-2"> {{ habilitacion.status }}</h5>
          </div>
        </div> -->
      </div>
      <!--Botones-->
      <div class="row col-10 mx-auto justify-content-center" v-if="adminCompras">
        <b-button v-if="orden && orden.id" @click="$router.push(`/compras/combustible/${orden.id}/generar`)" variant="success" class="btn-4 mt-3 mx-1">
          + | Agregar vales
        </b-button>
        <b-button @click="onShowObservaciones" variant="primary" class="btn-2 mt-3 mx-1"> Ver observaciones </b-button>
      </div>

      <!--Datos de orden de compra-->
      <b-card no-body class="container col-md-7 col-sm-10 shadow-card mt-4 mx-auto">
        <div class="container mt-4 ml-4 mx-auto">
          <h5 class="row">
            <b-icon-receipt class="icon-orange mt-4 ml-4" scale="2"/>
            <a class="ml-3 mr-2 mt-2 separador" > | </a>
            <h2 class="text-green mt-3"><b>Datos de orden de compra</b></h2>
          </h5>
          <hr />
        </div>

        <div class="container mb-3 mx-auto">
          <div class="row mt-1 mx-4">
            <b-icon-caret-right-fill class="icon-orange mt-1" scale="1.5"/>
            <h5 class="font-weight-bold text-dark mx-2">Área asignada: </h5>
            <h5 class="text-right text-dark">{{ orden.area }}</h5>
          </div>
          <div class="row no-gutters mt-1 mx-4">
            <b-icon-caret-right-fill class="icon-orange mt-1" scale="1.5"/>
            <h5 class="font-weight-bold text-dark mx-2">Proveedor:</h5>
            <h5 class="text-right text-dark">{{ orden.proveedor }}</h5>
          </div>
          <!-- Título de la gráfica -->
          <div class="row no-gutters mt-1 mx-4">
            <b-icon-caret-right-fill class="icon-orange mt-1" scale="1.5"/>
            <h5 class="font-weight-bold text-dark mx-2">Saldos por combustible:</h5>
          </div>

            <div class="layout">
              <!-- Gráfica para cada combustible -->
              <b-card no-body v-for="(monto, index) in orden.montos" :key="index" class="col main-background border-card shadow-sm col-main my-3 mb-4">
                <h5 class="my-3 text-center text-dark font-weight-600">{{ monto.tipoCombustible.toUpperCase() }}</h5>
                <hr/>
                <!-- SVG de círculo completo -->
                <div class="circular-progress-container" style="position: relative">
                  <svg viewBox="0 0 100 100" class="circular-progress">
                    <!-- Fondo gris (borde de la barra) -->
                    <circle
                      class="progress-background"
                      cx="50"
                      cy="50"
                      r="40"
                      stroke-width="10"
                    ></circle>

                    <!-- Barra de progreso -->
                    <circle
                      class="progress-bar"
                      cx="50"
                      cy="50"
                      r="40"
                      :style="{ strokeDasharray: getProgreso(orden.saldos[index].saldo, monto.monto) }"
                    ></circle>
                  </svg>
                  <FuelIcon class="fuel-icon icon-orange" style="height: 30px; width: 30px;"/>
                </div>

                <!-- Monto en números -->
                <div class="text-center mb-3">
                  <small class="text-dark font-weight-600 small mx-2">Restante: {{ format(orden.saldos[index].saldo) }}</small><br/>
                  <small class="text-dark font-weight-400 mx-2 small">Total: {{ format(monto.monto) }}</small>
                </div>
              </b-card>
            </div>
        </div>
      </b-card>
    </template>
    <!-- Vales -->
    <template>
      <div v-if="orden">
        <div class="container col-md-7 col-sm-10 card shadow-card mt-4 mb-3 mx-auto">
          <!-- Título -->
          <div class="col mx-auto">
            <h5 class="row mt-3 ml-1">
              <b-icon-receipt class="icon-orange mt-4 ml-4" scale="2"/>
              <a class="ml-3 mr-2 mt-2 separador" > | </a>
              <h2 class="text-green mt-3"><b>Vales emitidos</b></h2>
            </h5>
            <hr />
          </div>

          <!-- Mostrar los enlaces a los vales -->
          <div class="container justify-content-center mx-auto" v-if="vales && vales.length">
            <!-- Botones de utilización masiva -->
            <div class="row justify-content-center">
              <!-- Botón para reimprimir seleccionados -->
              <div class="text-center mx-3 my-3" v-if="valesSeleccionados.length">
                <button class="btn btn-primary" @click="abrirModalReimpresion">
                  <b-icon-printer-fill/> Reimprimir seleccionados ({{ valesSeleccionados.length }})
                </button>
              </div>
              <!-- Botón para reimprimir seleccionados -->
              <div class="text-center my-3" v-if="valesSeleccionados.length">
                <button class="btn btn-success" @click="abrirModalUtilizarVales">
                  <b-icon-check/> Marcar como utilizados ({{ valesSeleccionados.length }})
                </button>
              </div>
            </div>
            <!-- Cards de los vales -->
            <div class="row mx-4">
              <div v-for="(vale, index) in paginatedVales" :key="index" class="col-md-6 mb-3">
                <b-card no-body class="border-card main-background shadow-card">
                  <div class="m-2">
                    <div class="row no-gutters align-items-center">
                      <div class="col mt-2 ml-2">
                        <div class="row d-flex justify-content-between align-items-center">
                          <div class="d-flex align-items-center">
                            <input v-if="!vale.consumido" type="checkbox" class="mb-2 ml-2" :value="vale.id" v-model="valesSeleccionados" />

                            <h4 class="mb-2 ml-2 font-weight-700 text-gray">
                              VALE N° {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                            </h4>
                          </div>
                          <!-- Botones -->
                          <div v-if="jefeCompras" class="d-flex mr-2">
                            <button v-if="!vale.consumido" class="btn btn-success btn-sm mx-1" title="Marcar como utilizado" @click="marcarUtilizado(vale, (currentPage - 1) * itemsPerPage + index)">
                              <b-icon-check />
                            </button>
                            <button v-if="!vale.consumido" class="btn btn-primary btn-sm mx-1" title="Reimprimir" @click="confirmarReimpresion(vale, index)">
                              <b-icon-printer-fill />
                            </button>
                            <button v-if="!vale.consumido" class="btn btn-danger btn-sm mx-1" title="Eliminar" @click="confirmarEliminacion(vale.id)">
                              <b-icon-trash-fill />
                            </button>
                          </div>
                        </div>
                        <p class="card-text ml-3 text-dark">Tipo de combustible: {{ vale.tipoCombustible }}</p>
                        <p class="card-text ml-3 text-dark">Importe: {{ format(vale.monto) }}</p>
                        <p class="card-text ml-3 text-dark">Patente: {{ vale.dominio }}</p>
                        <p class="card-text ml-3 text-dark">Fecha de emisión: {{ new Date(vale.fechaEmision).toLocaleDateString('es-AR') }}</p>
                        <p class="card-text ml-3 text-dark">
                          Estado:
                          <span :class="vale.consumido ? 'text-danger' : 'text-success'">
                            <b>{{ vale.consumido ? 'No disponible' : 'Disponible' }}</b>
                          </span>
                        </p>
                      </div>


                    </div>
                  </div>
                </b-card>
              </div>
            </div>


            <!-- Paginador -->
            <b-pagination v-model="currentPage" :total-rows="vales.length" :per-page="itemsPerPage"
             align="center" size="sm"/>
          </div>

          <!-- Mensaje si no hay vales -->
          <div class="justify-content-center mx-auto" v-else>
            <p class="h6 text-center my-5"> No hay vales emitidos para esta orden de compra. </p>
          </div>
        </div>
      </div>
    </template>

    <div class="text-center mb-3">
      <b-button variant="primary" @click="volver">Volver</b-button>
    </div>

    <!-- Modals -->
    <b-modal v-model="showObservaciones" size="lg" header-bg-variant="primary" title="Observaciones" title-class="text-light" hide-footer centered>
      <p v-html="observaciones"></p>
    </b-modal>


    <!-- Modal de Confirmación para Reimpresión -->
    <b-modal id="modalReimpresion" title-class="text-light text-center" header-bg-variant="success" hide-footer centered>
      <template #modal-title>
        <b-icon-printer-fill class="mr-2" /> Confirmar Reimpresión
      </template>
      <p>¿Estás seguro de que deseas reimprimir el vale?</p>
      <div class="d-flex justify-content-end">
        <button class="btn btn-danger mr-2" @click="$bvModal.hide('modalReimpresion')">Cancelar</button>
        <button class="btn btn-success" @click="reimprimirVale(valeSeleccionado)">Aceptar</button>
      </div>
    </b-modal>

    <!-- Modal de confirmación para reimpresión múltiple -->
    <b-modal id="modalReimpresionMasiva" header-bg-variant="success" title-class="text-light text-center" hide-footer centered title="Confirmar Reimpresión masiva">
      <p class="h5 text-center mb-4">¿Estás seguro de que querés reimprimir los vales seleccionados?</p>
      <div class="row no-gutters justify-content-center">
        <b-button variant="secondary" class="mx-2" @click="$bvModal.hide('modalReimpresionMasiva')">Cancelar</b-button>
        <b-button variant="success" @click="imprimirValesSeleccionados">Aceptar</b-button>
      </div>
    </b-modal>

    <!-- Modal de confirmación para marcación como consumido masivamente -->
    <b-modal id="modalUtilizacionMasiva" header-bg-variant="success" title-class="text-light text-center" hide-footer centered title="Confirmar utilización masiva">
      <p class="h5 text-center mb-4">¿Estás seguro de que querés marcar los vales seleccionados como utilizados?</p>
      <div class="row no-gutters justify-content-center">
        <b-button variant="secondary" class="mx-2" @click="$bvModal.hide('modalUtilizacionMasiva')">Cancelar</b-button>
        <b-button variant="success" @click="marcarValesSeleccionados">Aceptar</b-button>
      </div>
    </b-modal>

    <!-- Modal de Confirmación para Eliminación -->
    <b-modal v-model="modalEliminacion" title="Confirmar Eliminación" title-class="text-light text-center" header-bg-variant="danger" hide-footer centered>
      <template #modal-title>
        <b-icon-trash-fill class="mr-2" /> Confirmar Eliminación
      </template>
      <p>¿Estás seguro de que deseas eliminar el vale?</p>
      <div class="d-flex justify-content-end">
        <button class="btn btn-secondary mr-2" @click="modalEliminacion = false">Cancelar</button>
        <button class="btn btn-danger" @click="eliminarVale()">Aceptar</button>
      </div>
    </b-modal>

      <!-- Modal de Confirmación para Eliminación -->
      <b-modal v-model="modalEliminado" title="Confirmar Eliminación" title-class="text-light text-center" header-bg-variant="danger" hide-footer centered>
      <template #modal-title>
        <b-icon-trash-fill class="mr-2" /> Confirmar Eliminación
      </template>
      <p>Vale de combustible eliminado.</p>
      <div class="d-flex justify-content-end">
        <button class="btn btn-primary mr-2" @click="modalEliminado = false">Aceptar</button>
      </div>
    </b-modal>

      <!-- Modal de Confirmación para Eliminación -->
    <b-modal v-model="modalModificado" title="Confirmar modificación" title-class="mx-auto text-light text-center" header-bg-variant="success" hide-footer centered>
      <template #modal-title>
        <b-icon-pencil-fill class="mr-2" /> Confirmar modificación
      </template>
      <div class="row justify-content-center">
        <b-icon-check-circle-fill variant="success" scale="3.5" class="my-4"/>
      </div>
      <p class="text-center font-weight-500">Vale de combustible modificado.</p>
      <!-- <div class="d-flex justify-content-end">
        <button class="btn btn-primary mx-auto mr-2" @click="modalModificado = false">Aceptar</button>
      </div> -->
    </b-modal>

  </div>
</template>

<script>
import templateVale from "@/assets/TemplateValex2.png";
import { numeroATexto } from "@/utils/numeroATexto";
import jsPDF from "jspdf";
export default {
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 6,
      modalEliminacion: false,
      modalEliminado: false,
      modalModificado: false,
      valeSeleccionado: null,
      valesSeleccionados: [], // Para almacenar los vales elegidos
      indexSeleccionado: null,
      showObservaciones: false,
      observaciones: '',
    }
  },
  computed: {
    orden(){
      return this.$store.state.combustible.single
    },
    totalMonto() {
      return this.orden.montos.reduce((total, m) => total + m.monto, 0);
    },
    totalSaldo() {
      return this.orden.saldos.reduce((total, s) => total + s.saldo, 0);
    },
    adminCompras(){
      return this.$store.state.user.admin == "compras" || this.$store.state.user.admin == "master"
    },
    jefeCompras(){
      return (this.$store.state.user.admin == "compras" && this.$store.state.user.username == "martinjordan@gesell.gob.ar") || this.$store.state.user.admin == "master"
    },
    vales(){
      return this.$store.state.combustible.vales_creados
    },
    selectedVales() {
      return this.vales.filter(v => this.valesSeleccionados.includes(v.id));
    },
    paginatedVales() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.vales.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.vales.length / this.itemsPerPage);
    },
  },
  async fetch() {
    const ordenId = this.$route.params.id
    await this.$store.dispatch('combustible/getSingle',{
      id: ordenId,
    })

    await this.$store.dispatch('combustible/getValesSingle', {
      id: ordenId,
    })
  },
  methods: {
    getProgreso(saldo, monto) {
      const porcentaje = (saldo / monto) * 100; // Obtiene el porcentaje restante
      const circunferencia = 2 * Math.PI * 40; // Longitud total del círculo (basado en el radio de 40)
      return `${(porcentaje / 100) * circunferencia}, ${circunferencia}`;
    },
    async registrarActividad(evento, result, nroSolicitud){
      const userId = this.$store.state.user.username; // Reemplaza con el ID del usuario real
      const actionType = evento;
      const actionResult = "Trámite nro " + nroSolicitud + ' ' + result;

      try {
          await this.$logUserActivity(userId, actionType, actionResult);
      } catch (error) {
          console.error('Error al registrar la actividad:', error);
      }
    },
    onShowObservaciones(){
      if(this.orden.observaciones){
        this.observaciones = this.orden.observaciones.split('**').join('<br>').split(',').join('')
      }else{
        this.observaciones = "No hay observaciones para mostrar."
      }
      this.showObservaciones = true
    },
    async onShowGenerarVales(){
      await this.$router.push('/generar')
    },
    confirmarReimpresion(vale, index) {
      this.valeSeleccionado = vale;
      this.indexSeleccionado = index
      this.$bvModal.show('modalReimpresion')
    },
    confirmarEliminacion(id) {
      this.valeSeleccionado = id;
      this.modalEliminacion = true;
    },
    async reimprimirVale(vale) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const backgroundImage = new Image();
      backgroundImage.src = templateVale;
      backgroundImage.crossOrigin = "anonymous";

      await new Promise((resolve) => {
        backgroundImage.onload = resolve;
      });

      canvas.width = backgroundImage.width;
      canvas.height = backgroundImage.height;

      // 🔹 Fondo blanco sólido
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 🔹 Dibujar imagen de fondo
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

      // Convertir monto a texto
      const montoTexto = `Pesos ${numeroATexto(vale.monto)}`;

      // 🔹 Agregar texto
      ctx.fillStyle = "black";
      ctx.font = "500 40px sans-serif";
      //Original
      ctx.fillText(`${this.orden.nroOrden}`, 600, 368);
      ctx.fillText(`${this.orden.proveedor}`, 600, 310);
      ctx.fillText(`${(this.indexSeleccionado + 1).toString().padStart(3, '0')}`, 1600, 266);
      ctx.fillText(`${vale.area}`, 1400, 365);
      ctx.fillText(`${vale.tipoCombustible}`, 600, 420);
      // ctx.fillText(`${vale.fechaEmision.toLocaleDateString('es-AR')}`, 1400, 420);
      ctx.fillText(`$${vale.monto}`, 600, 472);
      // Cambiar el tamaño de la fuente solo para el monto
      ctx.font = "500 30px sans-serif";  // Fuente más pequeña
      ctx.fillText(montoTexto, 1100, 472);

      //Volver a la fuente original para los demás campos
      ctx.font = "500 40px sans-serif";

      //Duplicado
      ctx.fillText(`${this.orden.nroOrden}`, 2348, 368);
      ctx.fillText(`${this.orden.proveedor}`, 2348, 310);
      ctx.fillText(`${(this.indexSeleccionado + 1).toString().padStart(3, '0')}`, 3348, 266);
      ctx.fillText(`${vale.area}`, 3148, 365);
      ctx.fillText(`${vale.tipoCombustible}`, 2348, 420);
      // ctx.fillText(`${vale.fechaEmision.toLocaleDateString('es-AR')}`, 3148, 420);
      ctx.fillText(`$${vale.monto}`, 2348, 472);
      // Cambiar el tamaño de la fuente solo para el monto en el duplicado
      ctx.font = "500 30px sans-serif";  // Fuente más pequeña
      ctx.fillText(montoTexto, 2848, 472);

      // 🔹 Convertir a imagen y descargar
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `Vale_${this.orden.nroOrden}_N${this.indexSeleccionado +1}.png`;
      link.click();
      await this.wait(400)
      this.$bvModal.hide('modalReimpresion')
    },
    async imprimirValesSeleccionados() {
      if (this.valesSeleccionados.length === 0) return;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const backgroundImage = new Image();
      backgroundImage.src = templateVale;
      backgroundImage.crossOrigin = "anonymous";

      await new Promise((resolve) => {
        backgroundImage.onload = resolve;
      });

      // Definir dimensiones del canvas para varios vales
      const valesPorFila = 2;
      const espacioEntreVales = 50;
      const valeWidth = backgroundImage.width;
      const valeHeight = backgroundImage.height;
      const filas = Math.ceil(this.valesSeleccionados.length / valesPorFila);

      // Configuración del PDF (A4 apaisado)
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Reducimos el margen para aprovechar más el espacio
      const margenHorizontal = 5; // Antes era 10
      const margenVertical = 5;   // Antes era 10

      // Ajustamos el factor de escala para que los vales ocupen más espacio
      const scaleFactor = (pageWidth - margenHorizontal * 2) / valeWidth;
      const valeWidthScaled = valeWidth * scaleFactor;
      const valeHeightScaled = valeHeight * scaleFactor;

      // canvas.width = valesPorFila * valeWidth + (valesPorFila - 1) * espacioEntreVales;
      // canvas.height = filas * valeHeight + (filas - 1) * espacioEntreVales;

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < this.valesSeleccionados.length; i++) {
        if (i % 2 === 0 && i !== 0) pdf.addPage(); // Nueva página cada 2 vales

        const posY = (i % 2) * (pageHeight / 2) + 10; // Posición vertical

        // Ajustar el tamaño del canvas
        canvas.width = valeWidth;
        canvas.height = valeHeight;

        const vale = this.selectedVales[i];

        // 🔹 Obtener el índice original en el array principal
        const indiceOriginal = this.vales.findIndex(v => v.id === vale.id) + 1;
        console.log(indiceOriginal)

        // Fondo blanco
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Dibujar la imagen de fondo
        ctx.drawImage(backgroundImage, 0, 0, valeWidth, valeHeight);

        const montoTexto = `Pesos ${numeroATexto(vale.monto)}`;

        // 🔹 Agregar texto con la numeración correcta
        ctx.fillStyle = "black";
        ctx.font = "500 38px sans-serif";
        ctx.fillText(`${this.orden.proveedor}`, 600, 310);
        ctx.fillText(`${this.orden.nroOrden}`, 600, 368);
        ctx.fillText(`${indiceOriginal.toString().padStart(3, '0')}`, 1600, 266);  // 🛠️ Aquí usamos el índice original
        ctx.fillText(`${vale.area}`, 1400, 365);
        ctx.fillText(`${vale.tipoCombustible}`, 600, 420);
        // ctx.fillText(`${vale.fechaEmision.toLocaleDateString('es-AR')}`, 1400, 420);
        ctx.fillText(`$${vale.monto}`, 600, 472);

        // Cambiar el tamaño de la fuente solo para el monto
        ctx.font = "500 30px sans-serif";  // Fuente más pequeña
        ctx.fillText(montoTexto, 1100, 472);

        // Volver a la fuente original para los demás campos
        ctx.font = "500 38px sans-serif";

        // Duplicado
        ctx.fillText(`${this.orden.nroOrden}`, 2348, 368);
        ctx.fillText(`${this.orden.proveedor}`, 2348, 310);
        ctx.fillText(`${indiceOriginal.toString().padStart(3, '0')}`, 3348, 266);  // 🛠️ Aquí también usamos el índice original
        ctx.fillText(`${vale.area}`, 3148, 365);
        ctx.fillText(`${vale.tipoCombustible}`, 2348, 420);
        // ctx.fillText(`${vale.fechaEmision.toLocaleDateString('es-AR')}`, 3148, 420);
        ctx.fillText(`$${vale.monto}`, 2348, 472);

        // Cambiar el tamaño de la fuente solo para el monto en el duplicado
        ctx.font = "500 30px sans-serif";  // Fuente más pequeña
        ctx.fillText(montoTexto, 2848, 472);

        // Convertir canvas en imagen y agregarlo al PDF
        const imgData = canvas.toDataURL("image/jpeg", 0.7); // Calidad 0.7 (ajustable)
        pdf.addImage(imgData, "PNG", 5, posY - 9, valeWidthScaled, valeHeightScaled);
      }

      // Descargar el PDF
      pdf.save(`Vales_${this.orden.nroOrden}.pdf`);
      this.modalReimpresion = false
    },
    async eliminarVale() {
      if (!this.valeSeleccionado) return;

      const id = this.valeSeleccionado;
      try {
        const userToken = this.$store.state.user.token;

        // Hacer la petición al backend para eliminar el vale
        await this.$store.dispatch("combustible/eliminarVale", { id, userToken });

        // Eliminar el vale de la lista en el frontend
        this.vales = this.vales.filter(v => v._id !== this.valeSeleccionado);

        this.modalEliminacion = false;
        this.modalEliminado = true;
      } catch (error) {
        console.error("Error al eliminar el vale:", error);
        alert("Ocurrió un error al eliminar el vale. Revisa la consola para más detalles.");
      }
    },
    async marcarUtilizado(valeRef, index) {
      const mensaje = `¿Estás seguro de que deseas marcar el vale N°${index +1} como utilizado?`;

      // Mostrar el modal de confirmación con los botones de Aceptar y Cancelar
      const confirmacion = await this.$bvModal.msgBoxConfirm(mensaje, {
        title: "Confirmar acción",
        size: "md",
        buttonSize: "md",
        okVariant: "success",
        cancelVariant: "danger",
        headerClass: "text-primary",
        centered: true,
        headerBgVariant: "success",
        titleClass: "text-center mx-auto justify-content-center text-light",
        okTitle: "Aceptar",
        bodyClass: "mx-5 text-center font-weight-bold",
        cancelTitle: "Cancelar",
      });

      if (confirmacion) {
        const id = valeRef.id;
        try {
          const userToken = this.$store.state.user.token;

          const vale = {
            consumido: true,
          }

          // Hacer la petición al backend para eliminar el vale
          await this.$store.dispatch("combustible/consumirVale", { id, vale });

          // Eliminar el vale de la lista en el frontend
          this.vales = this.vales.filter(v => v._id !== this.valeSeleccionado);

          this.modalModificado = true;
          await this.wait(1500)
          location.reload()
        } catch (error) {
          console.error("Error al eliminar el vale:", error);
          alert("Ocurrió un error al eliminar el vale. Revisa la consola para más detalles.");
        }
      }
    },
    async marcarValesSeleccionados() {
      if (this.valesSeleccionados.length === 0) return;

      for (let i = 0; i < this.valesSeleccionados.length; i++) {
        try {
          const id = this.valesSeleccionados[i];
          const userToken = this.$store.state.user.token;

          const vale = {
            consumido: true,
          }
          // Hacer la petición al backend para eliminar el vale
          await this.$store.dispatch("combustible/consumirVale", { id, vale })
        }catch (error) {
        console.error("Error al eliminar el vale:", error);
        alert("Ocurrió un error al eliminar el vale. Revisa la consola para más detalles.");
        }
      }
      await this.wait(500)
      this.$bvModal.hide('modalUtilizacionMasiva')
      location.reload()
    },
    getStatusClass(status) {
      return this.statusClasses[status] || '';
    },
    abrirModalReimpresion() {
      this.$bvModal.show('modalReimpresionMasiva');
    },
    abrirModalUtilizarVales() {
      this.$bvModal.show('modalUtilizacionMasiva');
    },
    //Métodos de sistema
    async volver(){
      await this.$router.push('/compras/combustible')
      this.valeSeleccionado = null,
      this.indexSeleccionado = null
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    onResetEdit() {
      this.editing = false
    },
    // format(value) {
    //   return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value);
    // },
    getPercentage(saldo, monto) {
      return monto ? (saldo / monto) * 100 : 0;
    },
    format(value) {
      if (!value) return "$0";
      return `$${value.toLocaleString('es-AR')}`;
    },
  },
}
</script>

<style>
.font-weight-100{
  font-weight: 100;
}
.font-weight-200{
  font-weight: 200;
}
.font-weight-300{
  font-weight: 300;
}
.font-weight-400{
  font-weight: 400;
}
.font-weight-500{
  font-weight: 500;
}
.font-weight-600{
  font-weight: 600;
}
.font-weight-700{
  font-weight: 700;
}
.font-weight-800{
  font-weight: 800;
}
.font-weight-900{
  font-weight: 900;
}
.font-weight-1000{
  font-weight: 1000;
}
</style>

<style scoped>
.fuel-icon {
  position: absolute;
  top: 50%;
  left: 51%;
  transform: translate(-50%, -50%);
}
/* Contenedor de la barra semicircular */
.circular-progress-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
}

.small{
  font-size: 16px;
}

.checkbox-container {
  align-self: start;
}

.text-green{
  color: #196B23;
}

.text-gray{
  color:#505050;
}

.border-card{
  border: #000 1px solid;
}

@media (max-width: 1200px) {
.separador{
    display: none;
  }
}
.separador{
  color:rgba(0, 0, 0, 0.5);
  font-size: 35px;
  opacity:0.3;
}
/* Estilo del SVG */
.circular-progress {
  width: 120px; /* Aumento del tamaño del SVG */
  height: 120px; /* Aumento del tamaño del SVG */
  transform: rotate(-260deg); /* Giramos el círculo para que empiece desde la parte superior */
}

/* Fondo gris del círculo */
.progress-background {
  fill: none;
  stroke: #e9e9e9;
  stroke-linecap: round;
  stroke-width: 11;
}

/* Barra de progreso */
.progress-bar {
  fill: none;
  stroke: #e59335;
  stroke-linecap: round;
  stroke-dasharray: 314.16, 314.16; /* Longitud total del círculo (basado en el radio de 50) */
  transition: stroke-dasharray 1.5s ease-in-out;
  stroke-width: 11;
}
.card-title{
  font-size: 20px;
}

.card-text{
  font-size: 16px;
}

.modal-dialog {
  max-width: 80% !important;
}
.icon-orange{
  color: #e08933;
}

.col strong{
  margin-bottom: 0%;
}
/* Responsive: */

@media only screen and (min-width: 640px) {
  .layout {
    display: flex;
    max-width: 90%;
    margin: auto;
  }
}

/* etc */
.iconoAdvertencia {
  position: relative;
  display: inline-block;
}

/* Estilo del texto de advertencia */
.textoHover {
  position: absolute;
  top: -60px; /* Ajusta la posición vertical del texto */
  left: 20px; /* Ajusta la posición horizontal del texto */
  background-color: #fff;
  color: #000;
  padding: 5px;
  width: 450px;
  border-radius: 5px;
  z-index: 1; /* Asegura que esté encima del ícono */
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3); /* Agrega una sombra */
}

.col {
  padding: 0.4em;
  margin: 0 2px 2px 40px;
}

p{
  font-size: 18px;
}
</style>
