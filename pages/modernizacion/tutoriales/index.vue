<template>
  <div class="page main-background">
    <Banner title="Tutoriales" />
    <div class="container">
      <div class="row justify-content-center mb-5">
        <div class="text-center mx-5 my-auto">
          <NuxtLink to="/modernizacion/tutoriales/mail-institucional">
            <b-button variant="outline" class="mt-5">
              <b-icon-folder class="h1 landing-icon" /> <br />
              <h3 style="color:green"><b> Mail institucional </b></h3>
            </b-button>
          </NuxtLink>
        </div>
        <div class="text-center mx-5 my-auto">
          <NuxtLink to="/modernizacion/tutoriales/gde">
            <b-button variant="outline" class="mt-5">
              <b-icon-folder class="h1 landing-icon" /> <br />
              <h3 style="color:green"><b> Sistema GDE </b></h3>
            </b-button>
          </NuxtLink>
        </div>
        <div class="text-center mx-5 my-auto">
          <NuxtLink to="/modernizacion/tutoriales/otros">
            <b-button variant="outline" class="mt-5">
              <b-icon-folder class="h1 landing-icon" /> <br />
              <h3 style="color:green"><b> Otros </b></h3>
            </b-button>
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row justify-content-center mt-5">
        <NuxtLink to="/modernizacion">
          <b-button variant="primary"> Volver </b-button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
