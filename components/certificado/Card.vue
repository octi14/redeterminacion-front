<template>
  <!-- Modal del Certificado con tabla de detalles -->
  <BModal v-model="visible" title="Detalles del Certificado" header-bg-variant="info" @hide="closeModal" size="xl">
    <div v-if="certificado">
      <div class="text-center mb-3">
        <NuxtLink v-if="!certificado.redeterminado" :to="{ name: 'redeterminaciones-id', params: { id: certificado.id } }">
          <b-button variant="success">Redeterminar</b-button>
        </NuxtLink>
        <strong v-else>Redeterminado el {{ certificado.redeterminado }}</strong>

        <b-dropdown variant="outline-primary" class="text-center mb-3">
          <b-dropdown-item @click="eliminarRedet">Eliminar redeterminación</b-dropdown-item>
          <b-dropdown-item @click="eliminarCert" variant="danger">Eliminar certificado</b-dropdown-item>
        </b-dropdown>
      </div>
      <!-- Tabla de detalles del certificado -->
      <b-table :items="tableItems" :fields="tableFields" striped hover responsive class="mt-3"></b-table>
    </div>
    <template #footer>
      <b-button variant="secondary" @click="closeModal">Cerrar</b-button>
    </template>
  </BModal>
</template>

<script>
import certificado from '~/service/certificado'
export default {
  setup(){ const { showToast } = useProjectToast(); return { showToast } },
  props: {
    obra: {
      type: Object,
      required: true,
    },
    certificado: {
      type: Object,
      required: true,
    },
    redet: {
      type: Object,
    },
  },
  data() {
    return {
      visible: true,
      obraUvi: false,
      tableFields: [
        { key: 'item', label: 'Item' },
        { key: 'contratado', label: 'Contratado ($)' },
        { key: 'anticipo', label: 'Anticipo ($)' },
        { key: 'avance', label: 'Avance' },
        { key: 'saldo', label: 'Saldo ($)' },
        { key: 'saldoRedeterminado', label: 'Saldo Redeterminado ($)' }
      ]
    }
  },
  mounted() {
    this.obraUvi = this.obra?.ponderacion?.[0]?.porcentaje == null
  },
  computed: {
    isAdmin(){
      return Boolean(useUserStore().admin == "true")
    },
    adminHacienda(){
      return useUserStore().admin == "hacienda"
    },
    tableItems() {
      return this.certificado.items.map((item, index) => ({
        item: `Item ${index + 1}: ${item.item}`,
        contratado: this.format(this.redondear(item.contratado)),
        anticipo: !this.obraUvi ? this.format(this.redondear(item.anticipo)) : '-',
        avance: `${item.avance}%`,
        saldo: this.format(
          this.redondear(
            this.obraUvi
              ? (item.contratado - item.anticipo) * (item.avance / 100)
              : item.saldo
          )
        ),
        saldoRedeterminado: this.certificado.redeterminado && this.redet?.items[index] !== undefined
          ? this.format(this.redondear(this.totalRedet(this.redet.items[index])))
          : '-'
      }));
    }
  },
  methods: {
    redondear(numero) {
      return Number(numero).toFixed(2)
    },
    format(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    toggleShow(){
      this.visible = !this.visible
    },
    totalRedet(item) {
      const materiales = Number(item.materiales) || 0;
      const generales = Number(item.generales) || 0;
      const manoObra = Number(item.manoObra) || 0;
      const equipos = Number(item.equipos) || 0;
      const uvi = Number(item.uvi) || 0;

      return materiales + generales + manoObra + equipos + uvi;
    },
    async eliminarCert() {
      try {
        const userToken = useUserStore().token;
        const certificado = this.certificado;
        const obra = this.obra;

        // Filtrar los certificados de la obra para mantener solo los que no coinciden con el ID del certificado a eliminar
        const certificadosActualizados = obra.certificados.filter((cert) => cert.toString() !== certificado.id);

        // Crear una copia de la obra excluyendo los campos de tipo Date
        const obraSinFechas = { ...obra, fecha_contrato: undefined, acta_inicio: undefined /* excluye el campo fecha_contrato */ };

        // Llamar a una acción de Vuex para actualizar los certificados de la obra en el estado
        await useObrasStore().actualizarCertificados(certificadosActualizados);

        // Llamar a una acción de Vuex para actualizar la obra en la base de datos
        await useObrasStore().update({
          obra: obraSinFechas,
          userToken
        });

        // Llamar a una acción de Vuex para eliminar el certificado
        await useCertificadosStore().delete({
          certificado,
          userToken
        });

        this.showToast('Eliminada correctamente', {
          title: '',
          variant: 'success',
          appendToast: true,
          solid: true,
        });

        await this.$router.push('/');
      } catch (e) {
        this.showToast('Error eliminando', {
          title: 'Error',
          variant: 'danger',
          appendToast: true,
          solid: true,
        });
      }
    },
    async eliminarRedet(){
      try {
        const redeterminacion = this.redet
        const userToken = useUserStore().token

        await useRedeterminacionesStore().delete({
          redeterminacion,
          userToken
        })
        this.showToast('Eliminada correctamente', {
          title: '',
          variant: 'success',
          appendToast: true,
          solid: true,
        })
        await this.$router.push('/')
      } catch (e) {
        this.showToast('Error eliminando', {
          title: 'Error',
          variant: 'danger',
          appendToast: true,
          solid: true,
        })
      }
    },
    closeModal() {
      this.visible = false;
      this.$emit('close');
    },
  },
}
</script>
