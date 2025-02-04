<template>
  <div class="page main-background">
    <Banner title="Compras" subtitle="Detalle de orden de compra"/>
    <!-- Datos de la orden de compra -->
    <template v-if="orden && adminCompras">
      <div class="flex col" style="width: 96%">
        <div class="row justify-content-center mt-3">
          <h4> Número de orden: <b> {{ orden.nroOrden }}</b></h4>
        </div>
        <!-- <div class="row justify-content-center mt-3">
          <p class="h5"> Tipo de trámite: <b> {{ habilitacion.tipoSolicitud }}  </b></p>
        </div> -->
        <!-- <div class="row justify-content-center mt-3">
          <div class="h5 row"> Estado:
            <h5 :class="getStatusClass(habilitacion.status)" class="ml-2"> {{ habilitacion.status }}</h5>
          </div>
        </div> -->
        <!-- <div class="col mx-auto">
          <div class="h5 row justify-content-center"> Número de expediente: <b class="text-success ml-1"> {{ habilitacion.nroExpediente }} </b> </div>
          <div class="h5 row justify-content-center" v-if="!esHabilitacion"> Alcance: <b class="text-success ml-1"> {{ habilitacion.alcance }} </b> </div>
          <div class="h5 row justify-content-center" v-if="!esHabilitacion"> Legajo: <b class="text-success ml-1"> {{ habilitacion.nroLegajo }} </b> </div>
        </div> -->
      </div>
      <!--Botones-->
      <div class="row col-10 mx-auto justify-content-center" v-if="adminCompras">
        <b-button
          v-if="orden && orden.id"
          @click="$router.push(`/compras/combustible/${orden.id}/generar`)"
          variant="success"
          class="btn-4 mt-3 mx-1"
        >
          Generar vales
        </b-button>

        <b-button @click="onShowObservaciones" variant="primary" class="btn-2 mt-3 mx-1"> Ver observaciones </b-button>
      </div>
      <!--Botón emitir vales (opcional)-->
      <!-- <div class="row no-gutters">
        <b-button @click="onDescargarHabilitacion(); registrarActividad('Descargar Trámite', 'Trámite Descargado', habilitacion.nroTramite)" v-if="adminComercio || adminArvige || adminModernizacion" variant="success" class="btn-4 mx-auto mt-3 mx-1">
          <b-icon icon="download" class="mr-1"></b-icon> Descargar trámite
        </b-button>
      </div> -->

      <!--Datos del solicitante-->
      <b-card no-body class="container col-md-6 col-sm-10 shadow-card mt-4 mx-auto">
        <div class="col mx-auto">
          <div class="container text-center mx-auto">
            <h2 class="text-success mt-2"><b> Datos de orden de compra </b></h2>
            <hr/>
          </div>
        </div>
        <div class="container mx-auto">
          <div class="d-flex justify-content-between align-items-center mt-1 mx-4">
            <p class="font-weight-bold text-primary">Área asignada</p>
            <p class="text-right"><strong>{{ orden.area }}</strong></p>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-2 mx-4">
            <p class="font-weight-bold text-primary">Monto total</p>
            <p class="text-right"><strong>{{ format(orden.montoSuper + orden.montoVPower) }}</strong></p>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-0 mb-2 mx-4">
            <div class="d-flex align-items-center gap-1">
              <b-icon-caret-right-fill/>
              <p class="mb-0">Super</p>
            </div>
            <p class="mb-0 text-right">{{ format(orden.montoSuper) }}</p>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-0 mx-4">
            <div class="d-flex align-items-center gap-2">
              <b-icon-caret-right-fill/>
              <p class="mb-0">V-Power</p>
            </div>
            <p class="mb-0 text-right">{{ format(orden.montoVPower) }}</p>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-3 mx-4">
            <p class="font-weight-bold text-primary">Saldo restante</p>
            <p class="text-right"><strong>{{ format(orden.saldoSuper + orden.saldoVPower) }}</strong></p>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-0 mx-4">
            <div class="d-flex align-items-center gap-1">
              <b-icon-caret-right-fill/>
              <p class="mb-0">Super</p>
            </div>
            <p class="mb-0 text-right">{{ format(orden.saldoSuper) }}</p>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-2 mb-4 mx-4">
            <div class="d-flex align-items-center gap-2">
              <b-icon-caret-right-fill/>
              <p class="mb-0">V-Power</p>
            </div>
            <p class="mb-0 text-right">{{ format(orden.saldoVPower) }}</p>
          </div>
        </div>
      </b-card>


    </template>
    <!-- Vales -->
    <template>
      <div v-if="orden">
        <div class="container col-md-6 col-sm-10 card shadow-card mt-4 mb-3 mx-auto">
          <!-- Título -->
          <div class="col mx-auto">
            <div class="container text-center mx-auto">
              <h2 class="text-success mt-2"><b> Vales emitidos </b></h2>
              <hr />
            </div>
          </div>

          <!-- Mostrar los enlaces a los vales -->
          <div class="container justify-content-center mx-auto" v-if="vales && vales.length">
            <!-- Botón para reimprimir seleccionados -->
            <div class="text-center my-3" v-if="valesSeleccionados.length">
              <button class="btn btn-primary" @click="abrirModalReimpresion">
                <b-icon-printer-fill/> Reimprimir seleccionados ({{ valesSeleccionados.length }})
              </button>
            </div>
            <div v-for="(vale, index) in paginatedVales" :key="index" class="mb-3">
              <div class="card shadow-sm">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <!-- Checkbox para seleccionar el vale -->
                    <div class="col-auto">
                      <input
                        type="checkbox"
                        :value="vale.id"
                        v-model="valesSeleccionados"
                      />
                    </div>

                    <div class="col ml-2">
                      <h5 class="card-title font-weight-bold text-success">
                        Vale N° {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                      </h5>
                      <p class="card-text">Tipo de combustible: {{ vale.tipoCombustible }}</p>
                      <p class="card-text">Importe: {{ format(vale.monto) }}</p>
                      <p class="card-text">Fecha de emisión: {{ new Date(vale.fechaEmision).toLocaleString('es-AR') }}</p>
                      <p class="card-text">
                        Estado:
                        <span :class="vale.consumido ? 'text-danger' : 'text-success'">
                          <b>{{ vale.consumido ? 'No disponible' : 'Disponible' }}</b>
                        </span>
                      </p>
                    </div>

                    <!-- Botones -->
                    <div v-if="adminCompras" class="d-flex">
                      <button v-if="!vale.consumido" class="btn btn-success mx-2" title="Marcar como utilizado" @click="marcarUtilizado(vale, (currentPage - 1) * itemsPerPage + index)">
                        <b-icon-check />
                      </button>
                      <button v-if="!vale.consumido" class="btn btn-warning mx-2" title="Reimprimir" @click="confirmarReimpresion(vale, index)">
                        <b-icon-printer-fill />
                      </button>
                      <button v-if="!vale.consumido" class="btn btn-danger mx-2" title="Eliminar" @click="confirmarEliminacion(vale.id)">
                        <b-icon-trash-fill />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Paginador -->
            <b-pagination v-model="currentPage" :total-rows="vales.length" :per-page="itemsPerPage"
             align="center" size="sm"/>
          </div>

          <!-- Mensaje si no hay vales -->
          <div class="justify-content-center mx-auto" v-else>
            <p class="h6 text-center"> No hay vales emitidos para esta orden de compra. </p>
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
    <b-modal v-model="modalReimpresion" title="Confirmar Reimpresión" title-class="text-light text-center" header-bg-variant="success" hide-footer centered>
      <template #modal-title>
        <b-icon-printer-fill class="mr-2" /> Confirmar Reimpresión
      </template>
      <p>¿Estás seguro de que deseas reimprimir el vale?</p>
      <div class="d-flex justify-content-end">
        <button class="btn btn-secondary mr-2" @click="modalReimpresion = false">Cancelar</button>
        <button class="btn btn-success" @click="reimprimirVale(valeSeleccionado)">Aceptar</button>
      </div>
    </b-modal>

    <!-- Modal de confirmación para reimpresión múltiple -->
    <b-modal id="modalReimpresion" header-bg-variant="success" title-class="text-light text-center" hide-footer centered title="Confirmar Reimpresión">
      <p class="h5 text-center mb-4">¿Estás seguro de que querés reimprimir los vales seleccionados?</p>
      <div class="row no-gutters justify-content-center">
        <b-button variant="secondary" class="mx-2" @click="$bvModal.hide('modalReimpresion')">Cancelar</b-button>
        <b-button variant="success" @click="imprimirValesSeleccionados">Aceptar</b-button>
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
      itemsPerPage: 5,
      modalReimpresion: false,
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
    adminCompras(){
      return this.$store.state.user.admin == "compras" || this.$store.state.user.admin == "master"
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
      this.modalReimpresion = true;
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
      ctx.fillText(`${this.orden.nroOrden}`, 600, 368);

      //Duplicado
      ctx.fillText(`${this.orden.nroOrden}`, 2348, 368);
      ctx.fillText(`${(this.indexSeleccionado + 1).toString().padStart(3, '0')}`, 1600, 266);
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
    getStatusClass(status) {
      return this.statusClasses[status] || '';
    },
    abrirModalReimpresion() {
      this.$bvModal.show('modalReimpresion');
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
    format(value) {
      if (!value) return "$0";
      return `$${value.toLocaleString('es-AR')}`;
    },
  },
}
</script>

<style scoped>
.modal-dialog {
  max-width: 80% !important;
}

.col-main {
  flex: 1;
}

.col-complementary {
  flex: 1;
}

.icon-orange{
  color: #E27910;
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
