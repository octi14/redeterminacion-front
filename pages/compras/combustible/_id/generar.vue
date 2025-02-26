<template>
  <div class="page main-background">
    <Banner title="Compras" subtitle="Generar vales"/>

    <b-container class="mt-4" v-if="orden">
      <b-card class="shadow-card">
        <b-card-header class="bg-success text-white text-center">
          <h3>Generando vales: orden N°</h3>
          <h4 class="text-white font-weight-bold">{{ orden.nroOrden }}</h4>
        </b-card-header>

        <b-card-body>
          <div class="row justify-content-center">
            <h4 class="text-primary text-center mt-4 mx-2 font-weight-bold">Área asignada: </h4>
            <h4 class="text-dark text-center mt-4 font-weight-500"> {{ orden.area }}</h4>
          </div>

          <b-form @submit.prevent="generarVales" class="m-4">
            <b-form-group label="Patente" label-for="patente">
              <b-form-input id="patente" v-model.number="form.patente" type="text" min="1"></b-form-input>
            </b-form-group>

            <b-form-group label="Cantidad de vales" label-for="cantidad">
              <b-form-input id="cantidad" v-model.number="form.cantidad" type="number" min="1" required></b-form-input>
            </b-form-group>

            <b-form-group label="Tipo de combustible" label-for="combustible">
              <b-form-select id="combustible" v-model="form.combustible" :options="tiposCombustible" required></b-form-select>
            </b-form-group>

            <b-form-group label="Monto de cada vale" label-for="monto">
              <b-form-input id="monto" v-model.number="form.monto" type="number" min="1" required></b-form-input>
            </b-form-group>

            <b-button type="submit" variant="success" :disabled="!form.monto || !form.cantidad">Generar vales</b-button>
          </b-form>
        </b-card-body>
      </b-card>
    </b-container>

    <b-container class="justify-content-center text-center card shadow-card mt-4" v-else>
      <h3 class="text-danger font-weight-bold mt-5">Ocurrió un error al cargar la orden de compra.</h3>
      <h5 class="m-5">Por favor, volvé a la lista de órdenes de compra y seleccioná una.</h5>
    </b-container>

    <div class="row no-gutters justify-content-center">
      <b-button variant="primary" class="col-3 my-4 mx-auto" @click="$router.push(`/compras/combustible`)">Volver</b-button>
    </div>

    <!-- Modal de confirmación -->
    <b-modal id="confirmacionModal" hide-footer header-bg-variant="success" title-class="text-center text-light" centered title="Vales generados">
      <div class="row no-gutters justify-content-center">
        <b-icon-check-circle-fill variant="success" scale="3" class="text-center my-4"/>
      </div>
      <p class="text-center font-weight-bold text-dark mb-4">Vales de combustible creados correctamente.</p>
      <div class="d-flex justify-content-center">
        <b-button variant="success" class="mr-2" @click="generarImpresion">Imprimir</b-button>
        <b-button variant="danger" @click="cerrarModal">Salir</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
//instalar esto
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import templateVale from "@/assets/TemplateValex2.png";
import { numeroATexto } from "@/utils/numeroATexto";

export default {
  data() {
    return {
      form: {
        cantidad: 1,
        combustible: "Super",
        patente: '',
        monto: null
      },
    };
  },
  computed: {
    orden() {
      return this.$store.state.combustible.single;
    },
    valesCreados(){
      return this.$store.state.combustible.vales_creados
    },
    tiposCombustible(){
      const orden = this.$store.state.combustible.single
      var tiposCombustible = []
      orden.montos.map((item) => tiposCombustible.push(item.tipoCombustible))
      return tiposCombustible
    }
  },
  methods: {
    async generarVales() {
      if (!this.orden) {
        alert("No hay una orden de compra válida.");
        return;
      }

      const area = this.orden.area;

      const totalMonto = this.form.cantidad * this.form.monto;
      // Verificar si el total excede el saldo disponible según el tipo de combustible
      const saldoDisponible =
        this.form.combustible === "Super" ? this.orden.saldoSuper : this.orden.saldoVPower;

      if (totalMonto > saldoDisponible) {
        this.$bvModal.msgBoxOk(`El monto total excede el saldo disponible para ${this.form.combustible}.`, {
          title: "Saldo insuficiente",
          size: "md",
          buttonSize: "md",
          okVariant: "danger",
          okTitle: "Aceptar",
          titleClass: "text-center text-light",
          headerBgVariant: "danger",
          centered: true,
        });
        return; // Detener la ejecución si el saldo es insuficiente
      }

      const payload = {
        orden: this.orden.id,
        cantidad: this.form.cantidad,
        tipoCombustible: this.form.combustible,
        monto: this.form.monto,
        area: area,
        dominio: this.form.patente,
      };

      try {
        await this.$store.dispatch('combustible/generarVales', { payload });
        console.log("Vales generados correctamente.");
        this.$bvModal.show("confirmacionModal"); // Mostrar modal de confirmación

        // Limpiar formulario después de generar los vales
        this.form.cantidad = 1;
        this.form.combustible = "Super";
        this.form.monto = null;
        this.form.patente = "";
      } catch (error) {
        console.error("Error al generar los vales:", error);
        alert("Hubo un error al generar los vales.");
      }
    },

    cerrarModal() {
      this.$bvModal.hide("confirmacionModal");
      this.$router.push("/compras/combustible");
    },

    async generarImpresion() {
      await this.crearPDFVales();
    },
    async crearPDFVales() {
      const cantidad = this.form.cantidad;
      if (cantidad === 0) return;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const backgroundImage = new Image();
      backgroundImage.src = templateVale;
      backgroundImage.crossOrigin = "anonymous";

      // Asegurar que la imagen esté cargada antes de continuar
      await new Promise((resolve, reject) => {
        backgroundImage.onload = resolve;
        backgroundImage.onerror = reject;
      });

      // Dimensiones del vale individual
      const valeWidth = backgroundImage.width;
      const valeHeight = backgroundImage.height;

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

      for (let i = 0; i < this.valesCreados.length; i++) {
        if (i % 2 === 0 && i !== 0) pdf.addPage(); // Nueva página cada 2 vales

        const posY = (i % 2) * (pageHeight / 2) + 10; // Posición vertical

        // Ajustar el tamaño del canvas
        canvas.width = valeWidth;
        canvas.height = valeHeight;

        // Fondo blanco
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Dibujar la imagen de fondo
        ctx.drawImage(backgroundImage, 0, 0, valeWidth, valeHeight);

        // Convertir monto a texto
        const montoTexto = `Pesos ${numeroATexto(this.valesCreados[i].monto)}`;

        // 🔹 Agregar texto sobre el vale
        ctx.fillStyle = "black";
        ctx.font = "500 38px sans-serif";

        //Original
        ctx.fillText(`${this.orden.proveedor}`, 600, 310);
        ctx.fillText(`${this.orden.nroOrden}`, 600, 367);
        ctx.fillText(`${(i + 1).toString().padStart(3, '0')}`, 1600, 266);
        ctx.fillText(`${this.valesCreados[i].area}`, 1400, 365);
        ctx.fillText(`${this.valesCreados[i].tipoCombustible}`, 600, 420);
        // ctx.fillText(`${this.valesCreados[i].fechaEmision.toLocaleDateString('es-AR')}`, 1400, 420);
        ctx.fillText(`${this.format(this.valesCreados[i].monto)}`, 600, 471);
        // Cambiar el tamaño de la fuente solo para el monto
        ctx.font = "500 30px sans-serif";  // Fuente más pequeña
        ctx.fillText(montoTexto, 1100, 471);
        ctx.fillText(`${this.valesCreados[i].dominio}`, 1400, 623);

        //Volver a la fuente original para los demás campos
        ctx.font = "500 38px sans-serif";
        ctx.fillText(`${this.orden.nroOrden}`, 600, 368);

        //Duplicado
        ctx.fillText(`${this.orden.proveedor}`, 2348, 310);
        ctx.fillText(`${this.orden.nroOrden}`, 2348, 367);
        ctx.fillText(`${(i + 1).toString().padStart(3, '0')}`, 3348, 266);
        ctx.fillText(`${this.valesCreados[i].area}`, 3148, 365);
        ctx.fillText(`${this.valesCreados[i].tipoCombustible}`, 2348, 420);
        // ctx.fillText(`${this.valesCreados[i].fechaEmision.toLocaleDateString('es-AR')}`, 3148, 420);
        ctx.fillText(`${this.format(this.valesCreados[i].monto)}`, 2348, 471);
        // Cambiar el tamaño de la fuente solo para el monto en el duplicado
        ctx.font = "500 30px sans-serif";  // Fuente más pequeña
        ctx.fillText(montoTexto, 2848, 471);
        ctx.fillText(`${this.valesCreados[i].dominio}`, 3148, 623);

        // Convertir canvas en imagen y agregarlo al PDF
        const imgData = canvas.toDataURL("image/jpeg", 0.7); // Calidad 0.7 (ajustable)
        pdf.addImage(imgData, "PNG", 5, posY - 9, valeWidthScaled, valeHeightScaled);
      }

      // Descargar el PDF
      pdf.save(`Vales_${this.orden.nroOrden}.pdf`);
    },
    format(value) {
      if (!value) return "$0";
      return `$${value.toLocaleString('es-AR')}`;
    },

  }
};
</script>

<style scoped>
/* Quita el padding del body de la card */
.card-body {
  padding: 0 !important;
}
</style>
