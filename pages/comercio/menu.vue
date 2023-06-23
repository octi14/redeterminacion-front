<template>
  <div class="page">
    <Banner title="Habilitaciones comerciales" />
    <div class="text-center">
      <h5> Sitio en construcción </h5>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPopupA: false,
      showPopupB: false,
      showPopupC: false,
      showPopupD: false,
      showConfirmationPopup: false,
      documentCheckboxChecked: false
    };
  },
  methods: {
    openPopup(type) {
      // Lógica para abrir el popup correspondiente según el tipo (A, B, C, D)
      if (type === 'A') {
        this.showPopupA = true;
      } else if (type === 'B') {
        this.showPopupB = true;
      } else if (type === 'C') {
        this.showPopupC = true;
      } else if (type === 'D') {
        this.showPopupD = true;
      } else if (type === 'Form') {
        this.showConfirmationPopup = true;
      }
    },
    proceedToForm() {
      // Aquí puedes realizar alguna acción adicional si es necesario antes de redirigir al formulario
      this.showConfirmationPopup = false;
    }
  }
}
</script>
<style scoped>
.external-link {
  color: #007bff;
  font-weight: bold;
}

.popup-link {
  color: #dc3545;
  font-weight: bold;
}

.disabled {
  pointer-events: none;
}
</style>
