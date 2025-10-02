<template>
  <div>
    <h4 class="section-title">
      <i class="bi bi-graph-up-arrow-fill mr-2"></i>
      Evolución Temporal de Índices
    </h4>

    <b-card class="mb-4 dashboard-card" v-if="evolucionIndices && Object.keys(evolucionIndices).length > 0">
      <template #header>
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <i class="bi bi-graph-up-arrow-fill text-secondary mr-2"></i>
            <strong>Evolución de Índices por Categoría</strong>
          </div>
          <div>
            <small class="text-muted">{{ Object.keys(evolucionIndices).length }} tipos de índices</small>
          </div>
        </div>
      </template>

      <div v-if="Object.keys(evolucionIndices).length === 0" class="text-center py-4">
        <i class="bi bi-graph-down text-muted" style="font-size: 3rem;"></i>
        <p class="text-muted mt-2">No hay datos de índices disponibles</p>
      </div>

      <div v-else>
        <!-- Selector de categoría -->
        <div class="mb-4">
          <label for="categoriaSelect" class="form-label">Seleccionar Categoría:</label>
          <b-form-select
            id="categoriaSelect"
            v-model="categoriaSeleccionada"
            :options="opcionesCategorias"
            class="w-auto"
          />
        </div>

        <!-- Gráfico de evolución -->
        <div v-if="categoriaSeleccionada && evolucionIndices[categoriaSeleccionada]" class="chart-container">
          <div class="chart-header mb-3">
            <h5 class="mb-1">{{ getNombreCategoria(categoriaSeleccionada) }}</h5>
            <small class="text-muted">
              {{ evolucionIndices[categoriaSeleccionada].length }} períodos registrados
            </small>
          </div>

          <!-- Gráfico de líneas -->
          <div class="chart-wrapper mb-4">
            <canvas ref="chartCanvas"></canvas>
          </div>

          <!-- Botón para mostrar/ocultar tabla -->
          <div class="text-center mb-3">
            <b-button
              variant="outline-secondary"
              size="sm"
              @click="mostrarTabla = !mostrarTabla"
            >
              <i :class="mostrarTabla ? 'bi bi-eye-slash' : 'bi bi-eye'" class="mr-1"></i>
              {{ mostrarTabla ? 'Ocultar' : 'Mostrar' }} Tabla Detallada
            </b-button>
          </div>

          <!-- Tabla de evolución -->
          <div v-if="mostrarTabla" class="table-responsive">
            <table class="table table-sm table-hover">
              <thead class="table-light">
                <tr>
                  <th>Período</th>
                  <th>Año</th>
                  <th>Mes</th>
                  <th class="text-end">Valor</th>
                  <th class="text-end">Variación</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in datosActuales"
                  :key="item.periodo"
                  :class="{ 'table-success': item.variacion > 0, 'table-danger': item.variacion < 0 }"
                >
                  <td>{{ item.periodo }}</td>
                  <td>{{ item.año }}</td>
                  <td>{{ getNombreMes(item.mes) }}</td>
                  <td class="text-end font-weight-bold">{{ (item.valor || 0).toFixed(2) }}</td>
                  <td class="text-end">
                    <span v-if="index > 0" :class="item.variacion >= 0 ? 'text-success' : 'text-danger'">
                      <i :class="item.variacion >= 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'" class="mr-1"></i>
                      {{ (item.variacion || 0).toFixed(2) }}%
                    </span>
                    <span v-else class="text-muted">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Resumen estadístico -->
          <div class="row mt-4">
            <div class="col-md-3">
              <div class="stat-box">
                <div class="stat-value text-primary">{{ (valorActual || 0).toFixed(2) }}</div>
                <div class="stat-label">Valor Actual</div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-box">
                <div class="stat-value text-success">{{ (valorMaximo || 0).toFixed(2) }}</div>
                <div class="stat-label">Valor Máximo</div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-box">
                <div class="stat-value text-danger">{{ (valorMinimo || 0).toFixed(2) }}</div>
                <div class="stat-label">Valor Mínimo</div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-box">
                <div class="stat-value text-info">{{ (promedio || 0).toFixed(2) }}</div>
                <div class="stat-label">Promedio</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vista general de todas las categorías -->
        <div v-if="!categoriaSeleccionada" class="categories-overview">
          <h6 class="mb-3">Resumen por Categoría</h6>
          <div class="row">
            <div
              v-for="(data, categoria) in evolucionIndices"
              :key="categoria"
              class="col-md-6 col-lg-3 mb-3"
            >
              <div class="category-card" @click="categoriaSeleccionada = categoria">
                <div class="category-name">{{ getNombreCategoria(categoria) }}</div>
                <div class="category-stats">
                  <div class="stat-item">
                    <span class="stat-label">Períodos:</span>
                    <span class="stat-value">{{ data.length }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Último valor:</span>
                    <span class="stat-value">{{ data[data.length - 1]?.valor.toFixed(2) || 'N/A' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'GraficoIndices',
  props: {
    evolucionIndices: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      categoriaSeleccionada: null,
      mostrarTabla: false
    }
  },
  computed: {
    opcionesCategorias() {
      const categorias = Object.keys(this.evolucionIndices)
      return [
        { value: null, text: 'Seleccionar categoría...' },
        ...categorias.map(categoria => ({
          value: categoria,
          text: this.getNombreCategoria(categoria)
        }))
      ]
    },
    datosActuales() {
      if (!this.categoriaSeleccionada || !this.evolucionIndices[this.categoriaSeleccionada]) {
        return []
      }

      const datos = this.evolucionIndices[this.categoriaSeleccionada]

      if (!Array.isArray(datos) || datos.length === 0) {
        return []
      }

      // Calcular variación porcentual
      return datos.map((item, index) => {
        let variacion = 0
        if (index > 0 && datos[index - 1]) {
          const valorAnterior = datos[index - 1].valor
          const valorActual = item.valor

          if (typeof valorAnterior === 'number' && typeof valorActual === 'number' && valorAnterior > 0) {
            variacion = ((valorActual - valorAnterior) / valorAnterior) * 100
          }
        }

        return {
          ...item,
          valor: typeof item.valor === 'number' ? item.valor : 0,
          variacion
        }
      })
    },
    valorActual() {
      const datos = this.datosActuales
      if (!datos || datos.length === 0) return 0
      const valor = datos[datos.length - 1]?.valor
      return typeof valor === 'number' ? valor : 0
    },
    valorMaximo() {
      const datos = this.datosActuales
      if (!datos || datos.length === 0) return 0
      const valores = datos.map(d => d.valor).filter(v => typeof v === 'number')
      return valores.length > 0 ? Math.max(...valores) : 0
    },
    valorMinimo() {
      const datos = this.datosActuales
      if (!datos || datos.length === 0) return 0
      const valores = datos.map(d => d.valor).filter(v => typeof v === 'number')
      return valores.length > 0 ? Math.min(...valores) : 0
    },
    promedio() {
      const datos = this.datosActuales
      if (!datos || datos.length === 0) return 0
      const valores = datos.map(d => d.valor).filter(v => typeof v === 'number')
      return valores.length > 0 ? valores.reduce((sum, v) => sum + v, 0) / valores.length : 0
    }
  },
  watch: {
    evolucionIndices: {
      handler() {
        // Auto-seleccionar la primera categoría si hay datos
        if (this.evolucionIndices && Object.keys(this.evolucionIndices).length > 0) {
          this.categoriaSeleccionada = Object.keys(this.evolucionIndices)[0]
        }
      },
      immediate: true
    },
    datosActuales: {
      handler() {
        this.$nextTick(() => {
          this.createChart()
        })
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.createChart()
    })

    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    getNombreMes(mes) {
      const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ]
      return meses[mes - 1] || mes
    },
    getNombreCategoria(categoria) {
      // Mapeo de categorías a nombres más amigables
      const nombresCategorias = {
        'ipc': 'Índice de Precios al Consumidor',
        'ipc_ba': 'IPC Buenos Aires',
        'ipc_nacional': 'IPC Nacional',
        'inflacion': 'Inflación',
        'inflacion_anual': 'Inflación Anual',
        'inflacion_mensual': 'Inflación Mensual',
        'indice_precios': 'Índice de Precios',
        'canasta_basica': 'Canasta Básica',
        'canasta_total': 'Canasta Total',
        'salario_minimo': 'Salario Mínimo',
        'tipo_cambio': 'Tipo de Cambio',
        'dolar': 'Dólar',
        'euro': 'Euro',
        'uf': 'Unidad de Fomento',
        'utm': 'Unidad Tributaria Mensual'
      }

      // Si tenemos un nombre mapeado, lo usamos, sino capitalizamos la categoría
      return nombresCategorias[categoria.toLowerCase()] || categoria.charAt(0).toUpperCase() + categoria.slice(1)
    },
    handleResize() {
      this.$nextTick(() => {
        this.createChart()
      })
    },
    createChart() {
      if (!this.$refs.chartCanvas || !this.datosActuales.length) return

      const canvas = this.$refs.chartCanvas
      const ctx = canvas.getContext('2d')

      // Configurar tamaño del canvas para usar todo el ancho disponible
      const container = canvas.parentElement
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight

      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Configuración del gráfico
      const padding = 60
      const chartWidth = canvas.width - (padding * 2)
      const chartHeight = canvas.height - (padding * 2)

      // Preparar datos
      const valores = this.datosActuales.map(item => item.valor)
      const variaciones = this.datosActuales.map(item => item.variacion)
      const labels = this.datosActuales.map(item => `${item.año}-${String(item.mes).padStart(2, '0')}`)

      // Encontrar valores mínimos y máximos
      const minValor = Math.min(...valores)
      const maxValor = Math.max(...valores)
      const minVariacion = Math.min(...variaciones.filter(v => !isNaN(v)))
      const maxVariacion = Math.max(...variaciones.filter(v => !isNaN(v)))

      // Función para convertir valor a coordenada Y
      const valorToY = (valor, min, max) => {
        if (max === min) return chartHeight / 2
        return padding + chartHeight - ((valor - min) / (max - min)) * chartHeight
      }

      // Función para convertir índice a coordenada X
      const indexToX = (index) => {
        return padding + (index / (valores.length - 1)) * chartWidth
      }

      // Dibujar ejes
      ctx.strokeStyle = '#ddd'
      ctx.lineWidth = 1

      // Eje Y izquierdo (valores)
      ctx.beginPath()
      ctx.moveTo(padding, padding)
      ctx.lineTo(padding, padding + chartHeight)
      ctx.stroke()

      // Eje Y derecho (variaciones)
      ctx.beginPath()
      ctx.moveTo(padding + chartWidth, padding)
      ctx.lineTo(padding + chartWidth, padding + chartHeight)
      ctx.stroke()

      // Eje X
      ctx.beginPath()
      ctx.moveTo(padding, padding + chartHeight)
      ctx.lineTo(padding + chartWidth, padding + chartHeight)
      ctx.stroke()

      // Dibujar línea de valores
      if (valores.length > 1) {
        ctx.strokeStyle = '#007bff'
        ctx.lineWidth = 3
        ctx.beginPath()

        valores.forEach((valor, index) => {
          const x = indexToX(index)
          const y = valorToY(valor, minValor, maxValor)

          if (index === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        })
        ctx.stroke()

        // Dibujar puntos
        ctx.fillStyle = '#007bff'
        valores.forEach((valor, index) => {
          const x = indexToX(index)
          const y = valorToY(valor, minValor, maxValor)

          ctx.beginPath()
          ctx.arc(x, y, 6, 0, 2 * Math.PI)
          ctx.fill()

          // Borde blanco en los puntos
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 2
          ctx.stroke()
        })
      }

      // Dibujar línea de variaciones
      if (variaciones.length > 1) {
        ctx.strokeStyle = '#28a745'
        ctx.lineWidth = 2
        ctx.beginPath()

        variaciones.forEach((variacion, index) => {
          if (!isNaN(variacion)) {
            const x = indexToX(index)
            const y = valorToY(variacion, minVariacion, maxVariacion)

            if (index === 0 || (index > 0 && !isNaN(variaciones[index - 1]))) {
              if (index === 0 || !isNaN(variaciones[index - 1])) {
                if (index === 0) {
                  ctx.moveTo(x, y)
                } else {
                  ctx.lineTo(x, y)
                }
              }
            }
          }
        })
        ctx.stroke()

        // Dibujar puntos de variación
        ctx.fillStyle = '#28a745'
        variaciones.forEach((variacion, index) => {
          if (!isNaN(variacion)) {
            const x = indexToX(index)
            const y = valorToY(variacion, minVariacion, maxVariacion)

            ctx.beginPath()
            ctx.arc(x, y, 4, 0, 2 * Math.PI)
            ctx.fill()

            // Borde blanco en los puntos
            ctx.strokeStyle = '#ffffff'
            ctx.lineWidth = 2
            ctx.stroke()
          }
        })
      }

      // Dibujar etiquetas
      ctx.fillStyle = '#666'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'

      // Etiquetas del eje X
      labels.forEach((label, index) => {
        const x = indexToX(index)
        ctx.fillText(label, x, padding + chartHeight + 20)
      })

      // Etiquetas del eje Y izquierdo
      ctx.textAlign = 'right'
      const valorStep = (maxValor - minValor) / 5
      for (let i = 0; i <= 5; i++) {
        const valor = minValor + (valorStep * i)
        const y = valorToY(valor, minValor, maxValor)
        ctx.fillText(valor.toFixed(1), padding - 10, y + 4)
      }

      // Etiquetas del eje Y derecho
      ctx.textAlign = 'left'
      const variacionStep = (maxVariacion - minVariacion) / 5
      for (let i = 0; i <= 5; i++) {
        const variacion = minVariacion + (variacionStep * i)
        const y = valorToY(variacion, minVariacion, maxVariacion)
        ctx.fillText(variacion.toFixed(1) + '%', padding + chartWidth + 10, y + 4)
      }

      // Títulos de los ejes
      ctx.fillStyle = '#333'
      ctx.font = 'bold 14px Arial'
      ctx.textAlign = 'center'

      // Título principal del gráfico
      ctx.fillStyle = '#333'
      ctx.font = 'bold 16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`Evolución: ${this.getNombreCategoria(this.categoriaSeleccionada)}`, canvas.width / 2, 25)

      // Título del eje Y izquierdo
      ctx.font = 'bold 14px Arial'
      ctx.save()
      ctx.translate(20, padding + chartHeight / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText('Valor del Índice', 0, 0)
      ctx.restore()

      // Título del eje Y derecho
      ctx.save()
      ctx.translate(canvas.width - 20, padding + chartHeight / 2)
      ctx.rotate(Math.PI / 2)
      ctx.fillText('Variación %', 0, 0)
      ctx.restore()
    }
  }
}
</script>

<style scoped>
.section-title {
  color: #495057;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

.section-title i {
  color: #28a745;
  margin-right: 0.5rem;
}

.dashboard-card {
  background: white;
  border-radius: 15px;
  border: none;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.dashboard-card .card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 2px solid #dee2e6;
  border-radius: 15px 15px 0 0 !important;
  padding: 1.25rem 1.5rem;
}

.chart-container {
  min-height: 300px;
}

.chart-wrapper {
  position: relative;
  height: 400px;
  width: 100%;
  overflow: hidden;
}

.chart-wrapper canvas {
  width: 100% !important;
  height: 100% !important;
}

.stat-box {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  border: 1px solid #e9ecef;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
}

.category-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card:hover {
  background: #e9ecef;
  border-color: #28a745;
  transform: translateY(-2px);
}

.category-name {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
}

.category-stats {
  font-size: 0.875rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.stat-item .stat-label {
  color: #6c757d;
}

.stat-item .stat-value {
  font-weight: 600;
  color: #495057;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.1);
}

.table-success {
  background-color: rgba(40, 167, 69, 0.1) !important;
}

.table-danger {
  background-color: rgba(220, 53, 69, 0.1) !important;
}
</style>
