<template>
  <div class="page main-background">
    <Banner title="Compras" subtitle="Generar vales"/>

    <LoadingState v-if="cargandoOrden" size="lg" class="mt-5" />

    <b-container v-else-if="orden" class="mt-4">
      <b-card no-body class="shadow-card generar-vales-card">
        <b-card-header class="generar-vales-card-header bg-success text-white text-center border-0">
          <h3 class="generar-vales-card-header-title mb-1">Generando vales: orden N°</h3>
          <h4 class="text-white font-weight-bold mb-0">{{ orden.nroOrden }}</h4>
        </b-card-header>

        <b-card-body class="generar-vales-card-body">
          <p class="generar-vales-area text-center mb-0">
            <span class="generar-vales-area-label">Área asignada:</span>
            <span class="generar-vales-area-value">{{ orden.area }}</span>
          </p>

          <b-form @submit.prevent="generarVales" class="generar-vales-form">
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
                    <i class="bi bi-plus-circle"></i>
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

    <b-container v-else class="justify-content-center text-center card shadow-card mt-4">
      <h3 class="text-danger font-weight-bold mt-5">Ocurrió un error al cargar la orden de compra.</h3>
      <h5 class="m-5">Por favor, volvé a la lista de órdenes de compra y seleccioná una.</h5>
    </b-container>

    <div class="row no-gutters justify-content-center">
      <div class="page-btn-volver-wrap">
        <b-button variant="primary" size="sm" class="page-btn-volver" @click="$router.push(`/compras/combustible`)">Volver</b-button>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <BModal v-model="showConfirmacionModal" no-footer header-bg-variant="success" title-class="text-center text-light" centered>
      <template #header>
        <div class="confirmation-popup-header mx-auto">
          <i class="bi bi-check-circle text-light"></i>
        </div>
      </template>
      <p class="h5 text-center font-weight-bold text-dark mt-4 mb-5">Los vales de combustible
        se han creado correctamente</p>
      <div class="modal-confirm-actions">
        <b-button size="sm" variant="success" @click="generarImpresion">Imprimir</b-button>
        <b-button size="sm" variant="danger" @click="cerrarModal">Salir</b-button>
      </div>
    </BModal>

      <!-- Modal de carga -->
      <BModal v-model="loading" no-footer header-bg-variant="success" title-class="text-center text-light" centered>
      <template #header>
        <div class="confirmation-popup-header mx-auto">
          <b-spinner scale="2.5" class="my-3" variant="light"/>
        </div>
      </template>
      <p class="h5 text-center font-weight-bold text-dark mt-4 mb-4">Generando vales...</p>
      <p class="h6 text-center font-weight-400 text-dark mt-2 mb-5">Por favor, esperá un momento</p>
    </BModal>

    <!-- Modal para patente personalizada -->
    <BModal v-model="showPatentePersonalizada" no-footer header-bg-variant="primary" title-class="text-center text-light" centered>
      <template #header>
        <div class="confirmation-popup-header mx-auto">
          <i class="bi bi-car-front-fill text-light"></i>
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

      <div class="modal-confirm-actions mt-4">
        <b-button variant="success" @click="registrarVehiculoPersonalizado" :disabled="!patentePersonalizada">
          Crear
        </b-button>
        <b-button variant="secondary" @click="showPatentePersonalizada = false">
          Cancelar
        </b-button>
      </div>
    </BModal>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['authenticated', 'require-admin'],
  adminRoles: ['compras', 'master'],
})
</script>

<script>
//instalar esto
import html2canvas from "html2canvas";
import templateVale from "@/assets/TemplateValex2.png";
import { numeroATexto } from "@/utils/numeroATexto";

export default {
  setup(){ const { showToast } = useProjectToast(); return { showToast } },
  data() {
    return {
      loading: false,
      cargandoOrden: true,
      loadError: false,
      loadingVehiculos: false,
      vehiculos: [],
      valesParaImprimir: [],
      showPatentePersonalizada: false,
      showConfirmacionModal: false,
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
      return useCombustibleStore().single;
    },
    valesCreados(){
      return useCombustibleStore().vales_creados
    },
    tiposCombustible(){
      const orden = useCombustibleStore().single
      if (!orden || !orden.montos) return []
      return orden.montos.map((item) => item.tipoCombustible)
    },
    // Saldo por tipo = monto del tipo − suma de vales no anulados de ese tipo
    saldosCalculados() {
      if (!this.orden || !this.orden.montos) return []
      const vales = this.valesCreados || []
      const noAnulados = vales.filter(v => !v.anulado)
      return this.orden.montos.map((m) => {
        const emitido = noAnulados
          .filter(v => v.tipoCombustible === m.tipoCombustible)
          .reduce((sum, v) => sum + (Number(v.monto) || 0), 0)
        const saldo = (Number(m.monto) || 0) - emitido
        return { tipoCombustible: m.tipoCombustible, saldo }
      })
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
  async mounted() {
    await this.loadOrden()
    if (import.meta.client) {
      document.addEventListener('click', this.handleClickOutside)
    }
  },
  beforeUnmount() {
    if (import.meta.client) {
      document.removeEventListener('click', this.handleClickOutside)
    }
  },
  methods: {
    async loadOrden() {
      const ordenId = this.$route.params.id
      this.loadError = false
      this.cargandoOrden = true
      try {
        await useCombustibleStore().getSingle({ id: ordenId })
        await useCombustibleStore().getValesSingle({ id: ordenId })
        if (!useCombustibleStore().single) {
          this.loadError = true
        }
      } catch (error) {
        console.error('Error al cargar orden para generar vales:', error)
        this.loadError = true
        useCombustibleStore().setSingle(null)
      } finally {
        this.cargandoOrden = false
      }
    },
    async cargarVehiculos() {
      if (!this.orden) return

      this.loadingVehiculos = true
      try {
        await useVehiculosStore().getAll()
        this.vehiculos = useVehiculosStore().all || []
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
        await useVehiculosStore().getAll()
        const todosVehiculos = useVehiculosStore().all || []

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
        await useVehiculosStore().getAll()
        const todosVehiculos = useVehiculosStore().all || []

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

          this.showToast(`La patente ${patente} ya existe en el área ${areaConflictiva}. Por favor, ingrese una patente diferente.`, {
            variant: "warning",
            title: "Patente duplicada",
            solid: true,
            value: 5000
          })
          return
        }

        try {
          // Registrar el vehículo en la base de datos
          const userToken = useUserStore().token
          const nuevoVehiculo = {
            patente: patente,
            area: this.orden.area
          }

          await useVehiculosStore().create({
            vehiculo: nuevoVehiculo,
            userToken
          })

          // Registrar actividad de creación de vehículo
          await this.$logUserActivity(
            useUserStore().username,
            'Crear Vehículo',
            `Vehículo ${patente} creado en el área ${this.orden.area}`
          );

          // Actualizar la lista de vehículos
          await this.cargarVehiculos()

          // Asignar la patente al formulario
          this.form.patente = patente
          this.showPatentePersonalizada = false
          this.patentePersonalizada = ''

          this.showToast(`Vehículo ${patente} registrado exitosamente en el área ${this.orden.area}`, {
            variant: "success",
            title: "Vehículo registrado",
            solid: true,
            value: 3000
          })

        } catch (error) {
          console.error('Error al registrar vehículo:', error)
          this.showToast("Error al registrar el vehículo. Por favor, intente nuevamente.", {
            variant: "danger",
            title: "Error",
            solid: true,
            value: 5000
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
      const saldoItem = this.saldosCalculados.find((s) => s.tipoCombustible === this.form.combustible);
      const saldoDisponible = saldoItem ? Number(saldoItem.saldo) || 0 : 0;

      if (totalMonto > saldoDisponible) {
        this.loading = false;
        this.showToast(`El monto total excede el saldo disponible para ${this.form.combustible}`, {
          title: 'Saldo insuficiente',
          variant: 'danger',
        })
        return
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
        await useCombustibleStore().generarVales({ payload });

        this.valesParaImprimir = [...(useCombustibleStore().vales_creados || [])];

        // Refrescar la orden en el store para que el saldo y la UI se actualicen
        await useCombustibleStore().getSingle({ id: this.orden.id });
        await useCombustibleStore().getValesSingle({ id: this.orden.id });

        // Registrar actividad de generación de vales
        await this.$logUserActivity(
          useUserStore().username,
          'Generar Vales',
          `${this.form.cantidad} vales de ${this.form.combustible} generados para el vehículo ${this.form.patente}`
        );
        this.loading = false
        this.showConfirmacionModal = true

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
      this.valesParaImprimir = [];
      this.showConfirmacionModal = false
      this.$router.push("/compras/combustible");
    },

    async generarImpresion() {
      await this.crearPDFVales();
    },
    async crearPDFVales() {
      if (!this.valesParaImprimir?.length) return;

      const { default: jsPDF } = await import('jspdf');

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

      for (let i = 0; i < this.valesParaImprimir.length; i += 4) {
      if (i !== 0) pdf.addPage();

      canvas.width = fondoWidth;
      canvas.height = fondoHeight * 2; // 👈 duplicamos la altura para dos imágenes una debajo de otra

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Fila 1 (vales i y i+1)
      ctx.drawImage(backgroundImage, 0, 0, fondoWidth, fondoHeight);
      const vale1 = this.valesParaImprimir[i];
      if (vale1) this.dibujarValeEnMitad(ctx, vale1, "izquierda", 0);
      const vale2 = this.valesParaImprimir[i + 1];
      if (vale2) this.dibujarValeEnMitad(ctx, vale2, "derecha", 0);

      // Fila 2 (vales i+2 y i+3)
      ctx.drawImage(backgroundImage, 0, fondoHeight, fondoWidth, fondoHeight);
      const vale3 = this.valesParaImprimir[i + 2];
      if (vale3) this.dibujarValeEnMitad(ctx, vale3, "izquierda", fondoHeight);
      const vale4 = this.valesParaImprimir[i + 3];
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
.generar-vales-card {
  overflow: hidden;
}

.generar-vales-card :deep(.card-header) {
  width: 100%;
  margin: 0;
  padding: 1rem 1.25rem;
  border-radius: 0;
}

.generar-vales-card-header-title {
  font-size: 1.35rem;
  font-weight: 600;
}

.generar-vales-card-body {
  padding: 0;
}

.generar-vales-area {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: baseline;
  gap: 0.35rem;
  padding: 1.25rem 1.5rem 0;
}

.generar-vales-area-label {
  color: var(--bs-primary);
  font-size: 1.25rem;
  font-weight: 700;
}

.generar-vales-area-value {
  color: #212529;
  font-size: 1.25rem;
  font-weight: 500;
}

.generar-vales-form {
  margin: 1.25rem 1.5rem 1.5rem;
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
