<template>
  <span>
    <b-button
      :variant="buttonVariant"
      :class="[{ 'file-preview__trigger--link': buttonVariant === 'link' }, buttonClass]"
      :title="title"
      :aria-label="title"
      :block="buttonBlock"
      @click="show = true"
    >
      <b-icon :icon="icon" :font-scale="fontScale" />
    </b-button>

    <b-modal v-model="show" size="xl" :title="title" hide-footer body-class="file-preview__modal-body">
      <div :class="['file-preview__content', { 'file-preview__content--zoomed': isImage && zoomLevel > 1 }]">
        <div v-if="cannotPreview" class="file-preview__empty-state">
          <b-icon-file-earmark-arrow-down class="file-preview__empty-icon" />
          <h5>No se puede previsualizar este formato en el navegador</h5>
          <p>
            Esto no significa que el archivo esté mal cargado ni que el contribuyente haya enviado documentación inválida.
            Para revisarlo, descargá el archivo y abrilo desde tu equipo.
          </p>
        </div>
        <img
          v-else-if="isImage"
          :src="previewUrl"
          :alt="title"
          class="file-preview__image"
          :style="imageStyle"
        >
        <iframe v-else :src="previewUrl" :title="title" class="file-preview__document"></iframe>
      </div>

      <div class="file-preview__footer">
        <span class="file-preview__hint">{{ footerHint }}</span>
        <div class="file-preview__actions">
          <b-button-group v-if="isImage" size="sm" class="file-preview__zoom-controls">
            <b-button variant="outline-secondary" :disabled="zoomLevel <= minZoom" title="Alejar imagen" @click="zoomOut">
              <b-icon-dash />
            </b-button>
            <b-button variant="outline-secondary" disabled class="file-preview__zoom-value">
              {{ zoomPercent }}
            </b-button>
            <b-button variant="outline-secondary" :disabled="zoomLevel >= maxZoom" title="Acercar imagen" @click="zoomIn">
              <b-icon-plus />
            </b-button>
            <b-button variant="outline-secondary" :disabled="zoomLevel === 1" title="Restablecer zoom" @click="resetZoom">
              <b-icon-arrow-counterclockwise />
            </b-button>
          </b-button-group>
          <b-button variant="success" :href="previewUrl" target="_blank" :download="downloadName">
            <b-icon-download class="mr-1" />
            Descargar
          </b-button>
        </div>
      </div>
    </b-modal>
  </span>
</template>

<script>
export default {
  name: 'FilePreview',
  props: {
    url: { type: String, default: '' },
    file: { type: Object, default: null },
    data: { type: String, default: '' },
    contentType: { type: String, default: '' },
    title: { type: String, default: 'Ver archivo' },
    icon: { type: String, default: 'file-earmark-text' },
    fontScale: { type: [String, Number], default: 1.25 },
    fileName: { type: String, default: '' },
    buttonVariant: { type: String, default: 'link' },
    buttonClass: { type: [String, Array, Object], default: '' },
    buttonBlock: { type: Boolean, default: false },
  },
  data: () => ({
    show: false,
    objectUrl: '',
    zoomLevel: 1,
    minZoom: 0.5,
    maxZoom: 3,
    zoomStep: 0.25,
  }),
  computed: {
    fileData() {
      return this.data || (this.file && this.file.data) || ''
    },
    fileContentType() {
      return this.contentType || (this.file && this.file.contentType) || ''
    },
    resolvedFileName() {
      return this.fileName || (this.file && this.file.filename) || (this.file && this.file.nombre) || ''
    },
    previewUrl() {
      return this.objectUrl || this.url
    },
    cleanUrl() {
      return (this.previewUrl || this.resolvedFileName || '').split('?')[0].toLowerCase()
    },
    isHeic() {
      const type = String(this.fileContentType || '').toLowerCase()
      return ['image/heic', 'image/heif'].includes(type)
        || ['.heic', '.heif'].some(ext => this.cleanUrl.endsWith(ext))
    },
    isImage() {
      if (this.isHeic) return false
      const type = String(this.fileContentType || '').toLowerCase()
      return type.startsWith('image/')
        || ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'].some(ext => this.cleanUrl.endsWith(ext))
    },
    cannotPreview() {
      return this.isHeic
    },
    footerHint() {
      return this.cannotPreview ? 'Descarga requerida para revisar el documento' : 'Vista previa del documento'
    },
    imageStyle() {
      return {
        width: `${this.zoomLevel * 100}%`,
        maxWidth: this.zoomLevel === 1 ? '100%' : 'none',
        maxHeight: this.zoomLevel === 1 ? '100%' : 'none',
      }
    },
    zoomPercent() {
      return `${Math.round(this.zoomLevel * 100)}%`
    },
    downloadName() {
      return this.resolvedFileName || true
    },
  },
  watch: {
    show(value) {
      if (value) {
        this.ensureObjectUrl()
      } else {
        this.resetZoom()
        this.revokeObjectUrl()
      }
    },
    fileData() {
      this.revokeObjectUrl()
    },
  },
  beforeUnmount() {
    this.revokeObjectUrl()
  },
  methods: {
    ensureObjectUrl() {
      if (this.objectUrl || this.url || !this.fileData) return
      const base64 = this.fileData.includes(',') ? this.fileData.split(',').pop() : this.fileData
      const binary = atob(base64)
      const bytes = new Uint8Array(binary.length)
      for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index)
      }
      const blob = new Blob([bytes], { type: this.fileContentType || 'application/octet-stream' })
      this.objectUrl = URL.createObjectURL(blob)
    },
    revokeObjectUrl() {
      if (!this.objectUrl) return
      URL.revokeObjectURL(this.objectUrl)
      this.objectUrl = ''
    },
    zoomIn() {
      this.zoomLevel = Math.min(this.maxZoom, this.zoomLevel + this.zoomStep)
    },
    zoomOut() {
      this.zoomLevel = Math.max(this.minZoom, this.zoomLevel - this.zoomStep)
    },
    resetZoom() {
      this.zoomLevel = 1
    },
  },
}
</script>

<style scoped>
.file-preview__trigger--link {
  line-height: 1;
  padding: 0;
  vertical-align: baseline;
}

.file-preview__content {
  align-items: center;
  background: #f7faf8;
  border: 1px solid #e3ebe5;
  border-radius: 8px;
  display: flex;
  height: min(68vh, 720px);
  justify-content: center;
  overflow: hidden;
}

.file-preview__content--zoomed {
  align-items: flex-start;
  justify-content: flex-start;
  overflow: auto;
}

.file-preview__image {
  display: block;
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  transition: transform 0.15s ease;
}

.file-preview__document {
  border: 0;
  height: 100%;
  width: 100%;
}

.file-preview__footer {
  align-items: center;
  border-top: 1px solid #edf2ef;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-top: 0.85rem;
  padding-top: 0.85rem;
}

.file-preview__hint {
  color: #66756f;
  font-size: 0.9rem;
}

.file-preview__actions {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: flex-end;
}

.file-preview__zoom-controls {
  white-space: nowrap;
}

.file-preview__zoom-value {
  min-width: 4rem;
}

@media (max-width: 768px) {
  .file-preview__content {
    height: 62vh;
  }

  .file-preview__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .file-preview__actions {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
