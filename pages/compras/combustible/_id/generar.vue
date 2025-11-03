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
            <b-form-group label="Patente del Vehículo" label-for="patente">
              <div>
                <!-- Input con autocompletado -->
                <b-form-input
                  id="patente"
                  v-model="form.patente"
                  type="text"
                  placeholder="Escriba o seleccione la patente del vehículo"
                  required
                  :disabled="loadingVehiculos"
                  @input="onPatenteInput"
                  @focus="showSugerencias = true"
                  list="patentes-list"
                  autocomplete="off"
                ></b-form-input>

                <!-- Lista de sugerencias -->
                <div v-if="showSugerencias && sugerenciasFiltradas.length > 0" class="sugerencias-dropdown">
                  <div
                    v-for="(sugerencia, index) in sugerenciasFiltradas"
                    :key="index"
                    class="sugerencia-item"
                    @click="seleccionarPatente(sugerencia)"
                  >
                    {{ sugerencia }}
                  </div>
                  <div
                    class="sugerencia-item sugerencia-personalizada"
                    @click="abrirPatentePersonalizada"
                  >
                    <b-icon-plus-circle class="mr-2" />
                    Ingresar patente personalizada...
                  </div>
                </div>

                <small class="form-text text-muted" v-if="vehiculosDelArea.length > 0">
                  {{ vehiculosDelArea.length }} vehículo{{ vehiculosDelArea.length !== 1 ? 's' : '' }} registrado{{ vehiculosDelArea.length !== 1 ? 's' : '' }} para el área {{ orden.area }}
                </small>
                <small class="form-text text-muted" v-else>
                  No hay vehículos registrados para el área {{ orden.area }}. Ingrese una patente para continuar.
                </small>
              </div>
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

            <b-button type="submit" variant="success" :disabled="!form.monto || !form.cantidad || !form.patente || loading">
              <span v-if="loading">Generando...</span>
              <span v-else>Generar vales</span>
            </b-button>
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
    <b-modal id="confirmacionModal" hide-footer header-bg-variant="success" title-class="text-center text-light" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-check-circle scale="2.5" class="my-3" variant="light"/>
        </div>
      </template>
      <p class="h5 text-center font-weight-bold text-dark mt-4 mb-5">Los vales de combustible
        se han creado correctamente</p>
      <div class="d-flex justify-content-center">
        <b-button size="sm" variant="success" class="mr-2 col-3" @click="generarImpresion">Imprimir</b-button>
        <b-button size="sm" class="col-3" variant="danger" @click="cerrarModal">Salir</b-button>
      </div>
    </b-modal>

      <!-- Modal de carga -->
      <b-modal v-model="loading" hide-footer header-bg-variant="success" title-class="text-center text-light" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-spinner scale="2.5" class="my-3" variant="light"/>
        </div>
      </template>
      <p class="h5 text-center font-weight-bold text-dark mt-4 mb-4">Generando vales...</p>
      <p class="h6 text-center font-weight-400 text-dark mt-2 mb-5">Por favor, esperá un momento</p>
    </b-modal>

    <!-- Modal para patente personalizada -->
    <b-modal v-model="showPatentePersonalizada" hide-footer header-bg-variant="primary" title-class="text-center text-light" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-car-front-fill scale="2.5" class="my-3" variant="light"/>
        </div>
      </template>
      <h4 class="text-center text-primary mb-4">Patente Personalizada</h4>
      <p class="text-center text-muted mb-4">Ingrese la patente del vehículo que no está en la lista</p>

      <b-form-group label="Patente del Vehículo">
        <b-form-input
          v-model="patentePersonalizada"
          type="text"
          placeholder="Ej: ABC123"
          @keyup.enter="registrarVehiculoPersonalizado"
        ></b-form-input>
      </b-form-group>

      <div class="d-flex justify-content-center mt-4">
        <b-button variant="success" class="mr-2" @click="registrarVehiculoPersonalizado" :disabled="!patentePersonalizada">
          Crear
        </b-button>
        <b-button variant="secondary" @click="showPatentePersonalizada = false">
          Cancelar
        </b-button>
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
      loading: false,
      loadingVehiculos: false,
      vehiculos: [],
      showPatentePersonalizada: false,
      patentePersonalizada: '',
      showSugerencias: false,
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
    },
    vehiculosDelArea() {
      if (!this.orden || !this.vehiculos.length) return []
      return this.vehiculos.filter(vehiculo => vehiculo.area === this.orden.area)
    },
    opcionesVehiculos() {
      const vehiculosOptions = this.vehiculosDelArea.map(vehiculo => ({
        value: vehiculo.patente,
        text: vehiculo.patente
      }))

      // Agregar opción para patente personalizada
      vehiculosOptions.push({
        value: 'personalizada',
        text: '➕ Ingresar patente personalizada...'
      })

      return vehiculosOptions
    },
    sugerenciasFiltradas() {
      if (!this.form.patente) {
        return this.vehiculosDelArea.map(v => v.patente)
      }

      const busqueda = this.form.patente.toLowerCase()
      return this.vehiculosDelArea
        .map(v => v.patente)
        .filter(patente => patente.toLowerCase().includes(busqueda))
    }
  },
  async mounted() {
    // Cargar vehículos cuando se monta el componente
    await this.cargarVehiculos()
  },
  watch: {
    // Cargar vehículos cuando cambie la orden (área)
    orden: {
      handler: async function(newOrden) {
        if (newOrden) {
          await this.cargarVehiculos()
        }
      },
      immediate: true
    }
  },
  mounted() {
    // Cerrar sugerencias al hacer clic fuera
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    async cargarVehiculos() {
      if (!this.orden) return

      this.loadingVehiculos = true
      try {
        await this.$store.dispatch('vehiculos/getAll')
        this.vehiculos = this.$store.state.vehiculos ? this.$store.state.vehiculos.all : []
      } catch (error) {
        console.error('Error al cargar vehículos:', error)
        this.vehiculos = []
      } finally {
        this.loadingVehiculos = false
      }
    },

    onPatenteInput() {
      this.showSugerencias = true
    },

    seleccionarPatente(patente) {
      this.form.patente = patente
      this.showSugerencias = false
    },

    abrirPatentePersonalizada() {
      this.showPatentePersonalizada = true
      this.showSugerencias = false
    },

    handleClickOutside(event) {
      const patenteInput = document.getElementById('patente')
      const sugerenciasDropdown = document.querySelector('.sugerencias-dropdown')

      if (patenteInput && sugerenciasDropdown) {
        if (!patenteInput.contains(event.target) && !sugerenciasDropdown.contains(event.target)) {
          this.showSugerencias = false
        }
      }
    },

    async validarPatenteDuplicada(patente) {
      try {
        // Obtener todos los vehículos para verificar si la patente existe
        await this.$store.dispatch('vehiculos/getAll')
        const todosVehiculos = this.$store.state.vehiculos ? this.$store.state.vehiculos.all : []

        // Buscar si la patente existe en alguna área (incluyendo la actual)
        const patenteExiste = todosVehiculos.some(vehiculo =>
          vehiculo.patente && vehiculo.patente.toUpperCase() === patente.toUpperCase()
        )

        return patenteExiste
      } catch (error) {
        console.error('Error al validar patente:', error)
        // En caso de error, permitir continuar (fallback)
        return false
      }
    },

    async validarPatenteEnOtraArea(patente) {
      try {
        // Obtener todos los vehículos para verificar si la patente existe en otras áreas
        await this.$store.dispatch('vehiculos/getAll')
        const todosVehiculos = this.$store.state.vehiculos ? this.$store.state.vehiculos.all : []

        // Buscar si la patente existe en alguna área
        const vehiculoExistente = todosVehiculos.find(vehiculo =>
          vehiculo.patente && vehiculo.patente.toUpperCase() === patente.toUpperCase()
        )

        return vehiculoExistente ? vehiculoExistente.area : null
      } catch (error) {
        console.error('Error al validar patente en otra área:', error)
        return null
      }
    },

    async registrarVehiculoPersonalizado() {
      if (this.patentePersonalizada.trim()) {
        const patente = this.patentePersonalizada.trim().toUpperCase()

        // Validar que la patente no exista en ninguna área
        const patenteExiste = await this.validarPatenteDuplicada(patente)

        if (patenteExiste) {
          const areaConflictiva = await this.validarPatenteEnOtraArea(patente)

          this.$bvToast.toast(`La patente ${patente} ya existe en el área ${areaConflictiva}. Por favor, ingrese una patente diferente.`, {
            variant: "warning",
            title: "Patente duplicada",
            solid: true,
            autoHideDelay: 5000
          })
          return
        }

        try {
          // Registrar el vehículo en la base de datos
          const userToken = this.$store.state.user.token
          const nuevoVehiculo = {
            patente: patente,
            area: this.orden.area
          }

          await this.$store.dispatch('vehiculos/create', {
            vehiculo: nuevoVehiculo,
            userToken
          })

          // Registrar actividad de creación de vehículo
          await this.$logUserActivity(
            this.$store.state.user.username,
            'Crear Vehículo',
            `Vehículo ${patente} creado en el área ${this.orden.area}`
          );

          // Actualizar la lista de vehículos
          await this.cargarVehiculos()

          // Asignar la patente al formulario
          this.form.patente = patente
          this.showPatentePersonalizada = false
          this.patentePersonalizada = ''

          this.$bvToast.toast(`Vehículo ${patente} registrado exitosamente en el área ${this.orden.area}`, {
            variant: "success",
            title: "Vehículo registrado",
            solid: true,
            autoHideDelay: 3000
          })

        } catch (error) {
          console.error('Error al registrar vehículo:', error)
          this.$bvToast.toast("Error al registrar el vehículo. Por favor, intente nuevamente.", {
            variant: "danger",
            title: "Error",
            solid: true,
            autoHideDelay: 5000
          })
        }
      }
    },
    async generarVales() {
      this.loading = true
      if (!this.orden) {
        alert("No hay una orden de compra válida.");
        this.loading = false
        return;
      }

      // Validar que la patente esté presente
      if (!this.form.patente || this.form.patente.trim() === '') {
        alert("Por favor, seleccione o ingrese una patente válida.");
        this.loading = false
        return;
      }

      const area = this.orden.area;

      const totalMonto = this.form.cantidad * this.form.monto;
      // Verificar si el total excede el saldo disponible según el tipo de combustible

        const saldoCombustible = this.orden.saldos.find((item) => item.tipoCombustible === this.form.combustible);

        const saldoDisponible = saldoCombustible ? saldoCombustible.saldo : 0;

      if (totalMonto > saldoDisponible) {
        this.$bvModal.msgBoxOk(`El monto total excede el saldo disponible para ${this.form.combustible}`, {
          title: "Saldo insuficiente",
          size: "md",
          bodyClass: "text-center font-weight-bold text-dark h5 my-4",
          buttonSize: "md",
          okVariant: "success",
          okTitle: "Aceptar",
          footerClass: "mx-auto",
          titleClass: "text-center font-weight-bold mx-auto text-light",
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
        dominio: this.form.patente, // El backend espera 'dominio' pero internamente usamos 'patente'
      };

      try {
        await this.$store.dispatch('combustible/generarVales', { payload });

        // Registrar actividad de generación de vales
        await this.$logUserActivity(
          this.$store.state.user.username,
          'Generar Vales',
          `${this.form.cantidad} vales de ${this.form.combustible} generados para el vehículo ${this.form.patente}`
        );
        this.loading = false
        this.$bvModal.show("confirmacionModal"); // Mostrar modal de confirmación

        // Limpiar formulario después de generar los vales
        this.form.cantidad = 1;
        this.form.combustible = "Super";
        this.form.monto = null;
        this.form.patente = "";
      } catch (error) {
        console.error("Error al generar los vales:", error);
        this.loading = false;
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

      await new Promise((resolve, reject) => {
        backgroundImage.onload = resolve;
        backgroundImage.onerror = reject;
      });

      const fondoWidth = backgroundImage.width;
      const fondoHeight = backgroundImage.height;

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const scaleFactor = (pageWidth) / fondoWidth;
      const fondoWidthScaled = fondoWidth * scaleFactor;
      const fondoHeightScaled = fondoHeight * scaleFactor;

      for (let i = 0; i < this.valesCreados.length; i += 4) {
      if (i !== 0) pdf.addPage();

      canvas.width = fondoWidth;
      canvas.height = fondoHeight * 2; // 👈 duplicamos la altura para dos imágenes una debajo de otra

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Fila 1 (vales i y i+1)
      ctx.drawImage(backgroundImage, 0, 0, fondoWidth, fondoHeight);
      const vale1 = this.valesCreados[i];
      if (vale1) this.dibujarValeEnMitad(ctx, vale1, "izquierda", 0);
      const vale2 = this.valesCreados[i + 1];
      if (vale2) this.dibujarValeEnMitad(ctx, vale2, "derecha", 0);

      // Fila 2 (vales i+2 y i+3)
      ctx.drawImage(backgroundImage, 0, fondoHeight, fondoWidth, fondoHeight);
      const vale3 = this.valesCreados[i + 2];
      if (vale3) this.dibujarValeEnMitad(ctx, vale3, "izquierda", fondoHeight);
      const vale4 = this.valesCreados[i + 3];
      if (vale4) this.dibujarValeEnMitad(ctx, vale4, "derecha", fondoHeight);

      const imgData = canvas.toDataURL("image/jpeg", 0.7);
      pdf.addImage(imgData, "JPEG", 0, 0, fondoWidthScaled, fondoHeightScaled * 2);
    }

      pdf.save(`Vales_${this.orden.nroOrden}.pdf`);
    },

    dibujarValeEnMitad(ctx, vale, lado, offsetY = 0) {
      const offsetX = lado === "izquierda" ? 0 : 1748; // ⚠️ Asegurate que 1748 sea la mitad exacta de tu imagen
      const pos = (x, y) => [offsetX + x, offsetY + y];

      // Fondo blanco (opcional, si ya lo hiciste antes)
      // ctx.fillStyle = "white";
      // ctx.fillRect(offsetX, offsetY, 1748, altoDelVale);

      const montoTexto = `Pesos ${numeroATexto(vale.monto)}`;

      ctx.fillStyle = "black";
      ctx.font = "500 38px sans-serif";

      // Ejemplo de coordenadas, ajustalas si hace falta
      ctx.fillText(`${this.orden.proveedor}`, ...pos(600, 310));
      ctx.fillText(`${this.orden.nroOrden}`, ...pos(600, 367));
      ctx.fillText(`${vale.nro_vale.toString().padStart(3, '0')}`, ...pos(1600, 266));
      ctx.fillText(`${vale.area}`, ...pos(1340, 365));
      ctx.fillText(`${vale.tipoCombustible}`, ...pos(600, 420));
      ctx.fillText(`${this.format(vale.monto)}`, ...pos(600, 471));

      ctx.font = "500 30px sans-serif";
      ctx.fillText(montoTexto, ...pos(1100, 471));
      ctx.fillText(`${vale.dominio}`, ...pos(1400, 623));

      ctx.font = "500 38px sans-serif"; // volver al tamaño original si seguís con más texto
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

/* Estilos para el dropdown de sugerencias */
.sugerencias-dropdown {
  position: absolute;
  z-index: 1000;
  width: calc(100% - 30px);
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ced4da;
  border-top: none;
  border-radius: 0 0 0.25rem 0.25rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.sugerencia-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.sugerencia-item:hover {
  background-color: #f8f9fa;
}

.sugerencia-item:last-child {
  border-bottom: none;
}

.sugerencia-personalizada {
  background-color: #e7f5ff;
  color: #0c5460;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.sugerencia-personalizada:hover {
  background-color: #d0ebff;
}

/* Scrollbar personalizado para el dropdown */
.sugerencias-dropdown::-webkit-scrollbar {
  width: 6px;
}

.sugerencias-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.sugerencias-dropdown::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.sugerencias-dropdown::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
