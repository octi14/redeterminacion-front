<template>
  <div class="page main-background">
    <Banner title="Comercio"/>
    <MenuItem to="comercio/tramites" title="Trámites comerciales" description="Realizar los trámites para tu comercio" icon="pen"/>
    <MenuItem to="comercio/abierto_anual" title="Abierto Anual" description="Acceder al formulario de Abierto Anual de comercios" icon="shop"/>
    <MenuItem to="comercio/consulta_tramite" title="Consulta estado de trámite" description="Consultá el estado de tu trámite comercial" icon="search"/>
    <MenuItem to="comercio/turnos" title="Turnos" description="Obtener turnos para inspección de comercios" icon="clock"/>
    <div class="row no-gutters">
      <b-button variant="primary" class="mx-auto text-center my-4" @click="$router.push('/')">Volver</b-button>
    </div>
  </div>
</template>
