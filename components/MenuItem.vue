<template>
  <div class="row no-gutters justify-content-center mt-5 mb-3">
    <NuxtLink :to="to" class="col-md-5">
      <b-button variant="outline" class="d-flex w-100 white shadow-card">
        <div class="me-3">
          <b-icon :icon="icon" class="mx-3 my-3 landing-icon" />
        </div>
        <div class="col text-left my-auto">
          <h3 class="landing-text"><b> {{title}} </b></h3>
          <h6>{{description}}</h6>
        </div>
      </b-button>
    </NuxtLink>
  </div>
</template>

<script>
export default {
  props: {
    icon: String,
    title: String,
    description: String,
    to: String
  }
}
</script>

<style scoped>
.landing-icon {
  width: 60px;
  height: 60px;
  color: #ef8918;
  transition: transform 0.2s ease;
}
/* Aplicar escala al hacer hover en el ícono */
.landing-icon:hover {
  transform: scale(1.15);
}

.col{
  margin: 16px;
}
</style>
