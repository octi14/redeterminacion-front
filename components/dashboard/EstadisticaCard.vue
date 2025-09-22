<template>
  <b-card
    :title="titulo"
    :sub-title="subtitulo"
    class="mb-3 stat-card"
    :class="cardClass"
  >
    <template #header>
      <div class="d-flex align-items-center">
        <i :class="icono" class="mr-2"></i>
        <span class="font-weight-bold">{{ titulo }}</span>
      </div>
    </template>

    <div class="text-center">
      <h2 class="mb-2" :class="valorClass">
        <span v-if="valor === 'N/A'" class="text-muted">
          <i class="bi bi-dash-circle"></i> N/A
        </span>
        <span v-else>{{ valor }}</span>
      </h2>
      <small v-if="descripcion" class="text-muted">{{ descripcion }}</small>
    </div>

    <template #footer v-if="footer">
      <small class="text-muted">{{ footer }}</small>
    </template>
  </b-card>
</template>

<script>
export default {
  name: 'EstadisticaCard',
  props: {
    titulo: {
      type: String,
      required: true
    },
    subtitulo: {
      type: String,
      default: ''
    },
    valor: {
      type: [String, Number],
      required: true
    },
    descripcion: {
      type: String,
      default: ''
    },
    footer: {
      type: String,
      default: ''
    },
    icono: {
      type: String,
      default: 'bi bi-graph-up'
    },
    variant: {
      type: String,
      default: 'primary'
    }
  },
  computed: {
    cardClass() {
      return `border-${this.variant}`
    },
    valorClass() {
      return `text-${this.variant}`
    }
  }
}
</script>

<style scoped>
.stat-card {
  background: white;
  border-radius: 15px;
  border: none;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.stat-card .card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 2px solid #dee2e6;
  border-radius: 15px 15px 0 0 !important;
  padding: 1rem 1.25rem;
}

.stat-card .card-header i {
  font-size: 1.1em;
}

.stat-card .card-body {
  padding: 1.25rem;
  text-align: center;
}

.stat-card .card-body h2 {
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
}

.stat-card .card-body p {
  color: #6c757d;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-card .card-body small {
  color: #adb5bd;
}

.stat-card .card-footer {
  background: rgba(0, 0, 0, 0.02);
  border-top: 1px solid #dee2e6;
  border-radius: 0 0 15px 15px;
  padding: 0.75rem 1.25rem;
}

.stat-card .card-footer small {
  color: #6c757d;
  font-weight: 500;
}
</style>
