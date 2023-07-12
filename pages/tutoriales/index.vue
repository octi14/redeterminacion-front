<template>
  <div class="page">
    <Banner title="Tutoriales" />
    <div class="row justify-content-center" style="height: 50%">
      <div class="text-center mx-5 my-auto">
        <NuxtLink to="/tutoriales/mail-institucional">
          <b-button variant="outline" class="mt-5">
            <b-icon-folder class="h1 landing-icon" /> <br />
            <h3 style="color:green"><b> Mail institucional </b></h3>
          </b-button>
        </NuxtLink>
      </div>
      <div class="text-center mx-5 my-auto">
        <NuxtLink to="/tutoriales/gde">
          <b-button variant="outline" class="mt-5">
            <b-icon-folder class="h1 landing-icon" /> <br />
            <h3 style="color:green"><b> Sistema GDE </b></h3>
          </b-button>
        </NuxtLink>
      </div>
    </div>
    <div class="text-center mt-3 float-lg-end">
      <NuxtLink to="/modernizacion">
        <b-button variant="primary"> Volver </b-button>
      </NuxtLink>
    </div>
  </div>
</template>
