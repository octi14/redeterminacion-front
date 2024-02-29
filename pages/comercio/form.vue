<template>
<div class="page">
  <Banner title="Habilitaciones comerciales" />
  <!-- Comprobante (página 4) -->
  <div v-if="printing === true">
    <b-card no-body border-variant="success" style="margin-top: 80px" class="printing-modal shadow col-md-5 col-sm-8 mx-auto">
      <b-card-header class="row" header-class="green text-light">
        <h5><b>Comprobante de Solicitud - </b> Comercio</h5>
      </b-card-header>
      <b-card-body class="text-center">
        <div class="row"><b-icon-check scale="1.2" class="icon-orange mt-1"/><h5><b class="text-green ml-1">Día: </b> {{ new Date().toLocaleDateString('es-AR') }}</h5> </div>
        <div class="row"><b-icon-check scale="1.2" class="icon-orange mt-1"/><h5><b class="text-green ml-1">Tipo de Solicitud: </b> {{ solicitante.tipoSolicitud }}</h5> </div>
        <div class="row"><b-icon-check scale="1.2" class="icon-orange mt-1"/><h5><b class="text-green ml-1">Rubro: </b> {{ inmueble.rubro }}</h5> </div>
        <div class="row"><b-icon-check scale="1.2" class="icon-orange mt-1"/><h5><b class="text-green ml-1">Nro de trámite:</b> {{ nroTramite }}</h5> </div>
        <div class="row"><b-icon-check scale="1.2" class="icon-orange mt-1"/><h5><b class="text-green ml-1">Solicitante: </b> {{ solicitante.nombre }}  {{ solicitante.apellido }}</h5> </div>
        <hr/>
        <p class="" style="text-align: justify"><b-icon-caret-right-fill variant="success"></b-icon-caret-right-fill> Tené en cuenta que el Departamento Comercio puede solicitarte documentación adicional vía correo electrónico.</p>
        <p class="" style="text-align: justify"><b-icon-caret-right-fill variant="success"></b-icon-caret-right-fill> Para consultar el estado de tu trámite ingresá en <a class="external-link" href="https://haciendavgesell.gob.ar/">haciendavgesell.gob.ar</a>, hacé click en el ícono correspondiente y escribí el número asignado en este comprobante.</p>
        <hr/>
        <b-button class="mt-2 btn-orange" v-if="endButton === true" @click="onResetParams">Volver</b-button>
      </b-card-body>
    </b-card>
  </div>
  <b-form v-else @submit.prevent="submitForm" class="my-3" style="margin-left:10px;margin-right:10px">
    <b-card no-body class="col-8 mt-1 section-card"  style="margin: 0px auto">
      <h5 style="margin-top:0px; margin-bottom: 0px; text-align:center;" ><b-icon-exclamation-circle-fill class="icon-orange"></b-icon-exclamation-circle-fill> El siguiente formulario tiene carácter de declaración jurada.</h5>
    </b-card>
  <b-card no-body class="col-8 mt-1 section-card"  style="margin: 0px auto">
    <!-- Sección: Datos del solicitante -->
    <fieldset >
      <legend><h3>Datos del Solicitante <b-icon-question-circle-fill @click="openPopup('DatosDelSolicitante')" font-scale="1" variant="info"></b-icon-question-circle-fill></h3></legend>
      <b-form-group label="Tipo de Solicitud *" label-for="tipo-solicitud" >
        <b-form-select title="Por el momento solo se pueden solicitar habilitaciones comerciales." id="tipo-solicitud" v-model="solicitante.tipoSolicitud" >
            <b-form-select-option v-if="solicitante.tipoSolicitud=='Habilitación'" selected="selected" value="Habilitación">Habilitar nuevo comercio</b-form-select-option>
            <b-form-select-option v-else value="Habilitación">Habilitar nuevo comercio</b-form-select-option>
            <b-form-select-option v-if="solicitante.tipoSolicitud=='Baja'" value="Baja" >Baja de comercio</b-form-select-option>
            <b-form-select-option v-else value="Baja" >Baja de comercio</b-form-select-option>
        </b-form-select>
      </b-form-group>

    </fieldset>
    <fieldset >
      <b-row>
      <b-col lg="6">
          <b-form-group label="Nombre *" label-for="nombreSolicitante">
            <b-form-input id="nombreSolicitante" v-model="solicitante.nombre"></b-form-input>
            <div v-if="$v.solicitante.nombre.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> El Nombre no puede estar vacío.
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group label="Apellido *" label-for="apellidoSolicitante" >
            <b-form-input id="apellidoSolicitante" v-model="solicitante.apellido"></b-form-input>
            <div v-if="$v.solicitante.apellido.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> El Apellido no puede estar vacío.
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <b-form-group label="DNI / Pasaporte *" label-for="DNISolicitante" >
            <b-form-input id="DNISolicitante" v-model="solicitante.dni"></b-form-input>
            <div v-if="$v.solicitante.dni.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Introduce un DNI válido.
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group label="CUIT *" label-for="cuit" >
            <b-form-input id="cuit" v-model="solicitante.cuit"></b-form-input>
            <div v-if="$v.solicitante.cuit.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Introduce un CUIT válido, sin guiones ni caracteres especiales.
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group>
            <label for="razon-social">Razón Social <i>(completar sólo si se trata de una Persona Jurídica)</i></label>
        <b-form-input id="razon-social" v-model="solicitante.razonSocial" ></b-form-input>
      </b-form-group>
      <b-form-group label="Domicilio Real y/o Legal *" label-for="domicilio-real" >
        <b-form-input id="domicilio-real" v-model="solicitante.domicilioReal" ></b-form-input>
        <div v-if="$v.solicitante.domicilioReal.$error" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> El Domicilio Real y/o Legal no puede estar vacío.
        </div>
      </b-form-group>
      <b-row>
        <b-col lg="6">
          <b-form-group label="Teléfono *" label-for="telefonoTitular" >
            <b-form-input id="telefonoTitular" v-model="solicitante.telefono" no-wheel ></b-form-input>
            <div v-if="$v.solicitante.telefono.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> El teléfono no puede estar vacío, contener letras o caracteres especiales.
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group label="Código Postal *" label-for="codigoPostal" >
            <b-col lg="4" style="padding-left: 0px;">
              <b-form-input id="codigoPostal" v-model="solicitante.codigoPostal" ></b-form-input>
            </b-col>
            <b-col lg="12" style="padding-left: 0px;">
              <div v-if="$v.solicitante.codigoPostal.$error" class="validation-error">
                <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> El código postal no puede estar vacío, contener letras o caracteres especiales.
              </div>
            </b-col>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <b-form-group label="Localidad *" label-for="localidadSolicitante" >
            <b-form-input id="localidadSolicitante" v-model="solicitante.localidad" ></b-form-input>
            <div v-if="$v.solicitante.localidad.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> La localidad no puede estar vacía.
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group label="Provincia *" label-for="provincia">
            <b-form-select id="provincia" v-model="solicitante.provincia" >
              <option value="" disabled>Selecciona una provincia</option>
              <option v-for="(provincia, index) in provincias" :key="index" :value="provincia">
                {{ provincia }}
              </option>
            </b-form-select>
            <div v-if="$v.solicitante.provincia.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Debe seleccionar una provincia.
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group label="Correo Electrónico *" label-for="mail" >
        <b-form-input id="mail" v-model="solicitante.mail" ></b-form-input>
        <div v-if="$v.solicitante.mail.$error" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Debe introducir un email válido. Ejemplo: nombre@dominio.com
        </div>
      </b-form-group>
      <b-form-group label="Repita el Correo Electrónico *" label-for="mail" >
        <b-form-input id="mail" v-model="solicitante.mail2" ></b-form-input>
        <div v-if="$v.solicitante.mail2.$error" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Los correos deben coincidir.
        </div>
      </b-form-group>
      <b-form-group label="Seleccione en caso de corresponder *" label-for="esPropietario" v-if="solicitante.tipoSolicitud=='Baja'">
        <b-form-checkbox v-model="solicitante.esTitular" name="esTitular" >
          <span>Soy o represento al titular de habilitación</span></b-form-checkbox>       
        <b-form-checkbox v-model="solicitante.esPropietario" name="esPropietario" >
          <span>Soy o represento al propietario del inmueble</span></b-form-checkbox>   
      </b-form-group>
    </fieldset>
      
    <b-row>
      <b-col lg="6" md="8" sm="8">
        <h5>¿Sos representante o apoderado/a del solicitante? <b-icon-question-circle-fill @click="openPopup('ApoderadoRepresentante')" font-scale="1" variant="info"></b-icon-question-circle-fill></h5>
      </b-col>
      <b-col class="form-check-inline" sm="4">
        <b-col lg="3" sm="3">
          <b-form-radio  id="esApoderado-no" v-model="solicitante.esApoderado" name="radio-esApoderado" checked="checked" value="false"> No</b-form-radio>
        </b-col>
        <b-col lg="3" sm="1">
          <b-form-radio  id="esApoderado-si" v-model="solicitante.esApoderado" name="radio-esApoderado" value="true"> Sí</b-form-radio>
        </b-col>
      </b-col>
    </b-row>
    <!-- Sección: Datos del Apoderado -->
    <fieldset v-if="solicitante.esApoderado === 'true'">
        <p>En este campo deberás cargar la <a href="https://drive.google.com/file/d/1m5ouibBL4sWokhkSR5keTjbUVo-I4TOU/view" target="_blank" class="external-link">Planilla de autorización de trámite</a> o el Poder autorizado por escribano que te indicamos que completes previamente.</p>
      <b-form-group v-if="solicitante.esApoderado === 'true'" label="Planilla de autorización de trámite *" label-for="documentos.planillaAutorizacion" >
        <b-form-file v-model="documentos.planillaAutorizacion.contenido" placeholder="No se seleccionó un archivo." browse-text="Examinar"
        accept=".pdf, image/*" :state="getFormFieldState('planillaAutorizacion')"
        @change="checkDocumentSize('planillaAutorizacion', $event)"
        @input="clearFormFieldState('planillaAutorizacion')"></b-form-file>
        <div v-if="$v.documentos.planillaAutorizacion.contenido.$error || fileTooLargeError.planillaAutorizacion" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> {{ fileTooLargeError.planillaAutorizacion || 'Debe seleccionar un archivo.' }}
        </div>
      </b-form-group>
    </fieldset>
  </b-card>
  <b-card no-body class="col-8 mt-1 section-card"  style="margin: 0px auto">
    <!-- Sección: Datos del inmueble -->
    <fieldset >
      <legend><h3>Datos del Inmueble</h3></legend>
      <b-row v-if="solicitante.tipoSolicitud == 'Baja'">
        <b-col lg="12" md="12">
          <b-form-group label="Nro de Expediente *" label-for="nroExpediente" >
            <div class="input-group"> <!-- Utilizamos la clase input-group -->
              <div class="input-group-prepend">
                <span class="input-group-text">(4124)</span> <!-- Prefijo fijo -->
              </div>
              <b-form-input id="nroExpedienteNro" v-model="nroExpedienteNro" no-wheel class="text-right" ></b-form-input>
              <div class="input-group-prepend">
                <span class="input-group-text">/</span> <!-- Prefijo fijo -->
              </div>
              <b-form-input id="nroExpedienteAnio" v-model="nroExpedienteAnio" class="col-2 text-left" no-wheel ></b-form-input>
            </div>
            <div v-if="$v.nroExpedienteNro.$error || $v.nroExpedienteAnio.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> El nro de expediente no puede estar vacío, contener letras o caracteres especiales.
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6" md="12">
          <b-form-group label="Localidad *" label-for="localidad" >
            <b-form-select id="localidad" v-model="inmueble.localidad" >
              <option value="" disabled>Seleccione...</option>
              <option value="villa-gesell">Villa Gesell</option>
              <option value="mar-de-las-pampas">Mar de las Pampas</option>
              <option value="mar-azul">Mar Azul</option>
              <option value="las-gaviotas">Las Gaviotas</option>
              <option value="colonia-marina">Colonia Marina</option>
            </b-form-select>
            <div v-if="$v.inmueble.localidad.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Debe seleccionar una localidad.
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6" md="12">
          <b-form-group label-for="rubro">
            <label for="rubro" class="rubro-label">Rubro *</label>
            <b-form-select id="rubro" v-model="inmueble.rubro"  @change="handleRubroChange">
              <option value="" disabled>Selecciona un Rubro</option>
              <option v-for="(rubro, index) in listaRubros" :key="index" :value="rubro.nombre">
                {{ rubro.nombre }}
              </option>
            </b-form-select>
            <div v-if="$v.inmueble.rubro.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Debe seleccionar un rubro.
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="12" md="12">          
          <b-form-group label="Describí brevemente la actividad a realizar (En caso de no encontrar un rubro que represente con precisión la misma)" label-for="nombre-fantasia" >
            <b-form-textarea id="actividad" v-model="inmueble.actividad">
            </b-form-textarea>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="8" md="12">
          <b-form-group label="Calle *" label-for="direccion-inmueble-calle" >
            <b-form-input id="direccion-inmueble-calle" v-model="inmueble.calle" ></b-form-input>
            <div v-if="$v.inmueble.calle.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> La calle no puede estar vacía.
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="2" md="6">
          <b-form-group label="" label-for="direccion-inmbueble-nro" >
            <label for="direccion-inmbueble-nro" class="rubro-label">Número * <b-icon-question-circle-fill class="" @click="openPopup('NroInmueble')" font-scale="1" variant="info"></b-icon-question-circle-fill></label>
            <b-form-input id="direccion-inmbueble-nro" v-model="inmueble.nro" ></b-form-input>
            <div v-if="$v.inmueble.nro.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> El número no puede estar vacío, contener letras ni caracteres especiales.
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="2" md="6">
          <b-form-group label="Nro. de Local" label-for="direccion-inmueble-calle2" >
            <b-form-input id="direccion-inmueble-calle2" v-model="inmueble.nroLocal" placeholder="Ej. 2/A" ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group label="Nombre de Fantasía (En caso de que lo posea)" label-for="nombre-fantasia" >
        <b-form-input id="nombre-fantasia" v-model="inmueble.nombreFantasia"></b-form-input>
      </b-form-group>
    <fieldset  v-if="isHoteleria && solicitante.tipoSolicitud=='Habilitación'" key="rubro-h">
      <h5>Servicios exclusivos del rubro {{inmueble.rubro}} *</h5>
      <p>Seleccioná los servicios que brinda tu establecimiento:</p>

        <b-form-group>
        <b-form-checkbox v-for="servicio in inmueble.serviciosHoteleria" :key="servicio.id" :id="`servicio${servicio.id}`" :name="`servicio${servicio.id}`" v-model="servicio.value" scale=1.5 >
          {{ servicio.servicio }}
        </b-form-checkbox>

      </b-form-group>
      <b-form-group v-if="inmueble.serviciosHoteleria[11].value === true" label="Contanos que otros servicios brinda tu establecimiento: " label-for="otrosServicios" >
        <b-form-textarea id="otrosServicios" v-model="inmueble.otrosServicios" rows="2" max-rows="4" ></b-form-textarea>
        <div v-if="$v.inmueble.otrosServicios.$error" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Debe completar este campo, o desmarcar la casilla "Otros".
        </div>
      </b-form-group>
    </fieldset>
      <b-form-group v-if="rubroSeleccionado.croquis === true && isHoteleria && solicitante.tipoSolicitud=='Habilitación'" label-for="documentos.croquis" >
        <label for="croquis">Croquis <i>(en casos en que hay más de una parcela para uso de la actividad comercial y las mismas no se hallan reunidas por plano de mensura y unificación o reunidas de oficio)</i></label>
        <b-form-file v-model="documentos.croquis.contenido" placeholder="No se seleccionó un archivo." browse-text="Examinar"
        accept=".pdf, image/*" :state="getFormFieldState('croquis')"
        @change="checkDocumentSize('croquis', $event)"
        @input="clearFormFieldState('croquis')"></b-form-file>
        <div v-if="fileTooLargeError.croquis" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> {{ fileTooLargeError.croquis }}
        </div>
      </b-form-group>
      <b-form-group v-if="rubroSeleccionado.croquis === true && !isHoteleria && solicitante.tipoSolicitud=='Habilitación'" label-for="documentos.croquis" >
        <label for="croquis">Croquis </label>
        <b-form-file v-model="documentos.croquis.contenido" placeholder="No se seleccionó un archivo." browse-text="Examinar"
        accept=".pdf, image/*" :state="getFormFieldState('croquis')"
        @change="checkDocumentSize('croquis', $event)"
        @input="clearFormFieldState('croquis')"></b-form-file>
        <div v-if="$v.documentos.croquis.contenido.$error || fileTooLargeError.croquis" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> {{ fileTooLargeError.croquis || 'Debe seleccionar un archivo.' }}
        </div>
      </b-form-group>
    <fieldset  v-if="solicitante.tipoSolicitud=='Habilitación'">
       <b-row>
              <b-col lg="5" md="8" sm="7">
                <h5>Uso de espacio público</h5>
              </b-col>
       </b-row>
        <p>Indicá cuál de los siguientes ítems posee tu establecimiento:</p>
        <b-form-group label="" label-for="marquesina" style="margin-bottom: 0">
            <b-form-checkbox  id="marquesina" v-model="inmueble.marquesina" scale=1.5>Marquesina - Toldo</b-form-checkbox>
        </b-form-group>
        <b-form-group label="" label-for="mercaderia" style="margin-bottom: 0">
            <b-form-checkbox  id="mercaderia" v-model="inmueble.mercaderia" scale=1.5>Mercadería en la Vía Pública</b-form-checkbox>
        </b-form-group>
        <b-form-group label="" label-for="carteles" style="margin-bottom: 0">
            <b-form-checkbox  id="carteles" v-model="inmueble.carteles" scale=1.5>Carteles</b-form-checkbox>
        </b-form-group>
        <b-form-group label="" label-for="mesas" style="margin-bottom: 0">
            <b-form-checkbox  id="mesas" v-model="inmueble.mesas" scale=1.5>Mesas y Sillas</b-form-checkbox>
        </b-form-group>
    </fieldset>
    <div v-if="$v.inmueble.marquesina.$error || $v.inmueble.mercaderia.$error || $v.inmueble.carteles.$error || $v.inmueble.mesas.$error" class="validation-error">
      <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Selecciona al menos una opción.
    </div>
    </fieldset>

  </b-card>
  <b-card no-body class="col-8 mt-1 section-card" style="margin: 0px auto">
    <fieldset >
      <legend><h3>Carga de Documentación</h3></legend>
      <p>Aquí deberás cargar los documentos requeridos previamente. Tené en cuenta que deben ser <u>legibles</u>, estar subidos en <u>formato de imagen ó pdf</u> y tener un <u>peso máximo de 15 mb</u>.</p>
      <b-row>
        <b-col lg="6">
          <b-form-group label="DNI (Frente) *" label-for="dniFrente">
            <b-form-file v-model="documentos.dniFrente.contenido" placeholder="No se seleccionó un archivo." browse-text="Examinar"
              accept=".pdf, image/*"
              :state="getFormFieldState('dniFrente')"
              @change="handleDocumentUpdate('dniFrente'); checkDocumentSize('dniFrente', $event)"
              @input="clearFormFieldState('dniFrente')"></b-form-file>
            <div v-if="$v.documentos.dniFrente.contenido.$error || fileTooLargeError.dniFrente" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> {{ fileTooLargeError.dniFrente || 'Debe seleccionar un archivo.' }}
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group label="DNI (Dorso) *" label-for="dniDorso" >
            <b-form-file v-model="documentos.dniDorso.contenido" placeholder="No se seleccionó un archivo." browse-text="Examinar"
            accept=".pdf, image/*"  :state="getFormFieldState('dniDorso')"
            @change="handleDocumentUpdate('dniDorso'); checkDocumentSize('dniDorso', $event)"
            @input="clearFormFieldState('dniDorso')"></b-form-file>
            <div v-if="$v.documentos.dniDorso.contenido.$error || fileTooLargeError.dniDorso" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> {{ fileTooLargeError.dniDorso || 'Debe seleccionar un archivo.' }}
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group v-if="solicitante.tipoSolicitud=='Habilitación'"> 
        <label for="constanciaCuit" class="rubro-label">Constancia de CUIT * <b-icon-question-circle-fill @click="openPopup('ConstanciaCUIT')" font-scale="1" variant="info"></b-icon-question-circle-fill></label>
        <b-form-file v-model="documentos.constanciaCuit.contenido" placeholder="No se seleccionó un archivo." browse-text="Examinar"
        accept=".pdf, image/*"  :state="getFormFieldState('constanciaCuit')"
        @change="handleDocumentUpdate('constanciaCuit'); checkDocumentSize('constanciaCuit', $event)"
        @input="clearFormFieldState('constanciaCuit')"></b-form-file>
        <div v-if="$v.documentos.constanciaCuit.contenido.$error || fileTooLargeError.constanciaCuit" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> {{ fileTooLargeError.constanciaCuit || 'Debe seleccionar un archivo.' }}
        </div>
      </b-form-group>
      <b-form-group v-if="solicitante.tipoSolicitud=='Habilitación'">
        <label for="constanciaIngresosBrutos" class="rubro-label">Constancia de inscripción a Ingresos Brutos <b-icon-question-circle-fill @click="openPopup('ConstanciaIngresosBrutos')" font-scale="1" variant="info"></b-icon-question-circle-fill></label>
        <b-form-file v-model="documentos.constanciaIngresosBrutos.contenido" placeholder="No se seleccionó un archivo." browse-text="Examinar"
        accept=".pdf, image/*" :state="getFormFieldState('constanciaIngresosBrutos')"
        @change="handleDocumentUpdate('constanciaIngresosBrutos'); checkDocumentSize('constanciaIngresosBrutos', $event)"
        @input="clearFormFieldState('constanciaIngresosBrutos')"></b-form-file>
        <div v-if="fileTooLargeError.constanciaIngresosBrutos" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> {{ fileTooLargeError.constanciaIngresosBrutos }}
        </div>
      </b-form-group>
      <b-form-group v-if="solicitante.tipoSolicitud=='Habilitación'">
        <label for="certificadoDomicilio" class="rubro-label">Certificado de domicilio Ingresos Brutos - Punto de venta Villa Gesell <b-icon-question-circle-fill @click="openPopup('certificadoDomicilio')" font-scale="1" variant="info"></b-icon-question-circle-fill></label>
        <b-form-file v-model="documentos.certificadoDomicilio.contenido" placeholder="No se seleccionó un archivo." browse-text="Examinar"
        accept=".pdf, image/*" :state="getFormFieldState('certificadoDomicilio')"
        @change="handleDocumentUpdate('certificadoDomicilio'); checkDocumentSize('certificadoDomicilio', $event)"
        @input="clearFormFieldState('certificadoDomicilio')"></b-form-file>
        <div v-if="fileTooLargeError.certificadoDomicilio" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> {{ fileTooLargeError.certificadoDomicilio }}
        </div>
      </b-form-group>
      <b-form-group v-if="solicitante.tipoSolicitud=='Baja'">
        <label for="libreDeudaIB" class="rubro-label">Libre Deuda de Ingresos Brutos <span v-if="solicitante.esTitular">* </span><b-icon-question-circle-fill @click="openPopup('ConstanciaLibreDeudaIB')" font-scale="1" variant="info"></b-icon-question-circle-fill></label>
        <b-form-file v-model="documentos.libreDeudaIB.contenido" placeholder="No se seleccionó un archivo." browse-text="Examinar"
        accept=".pdf, image/*"  :state="getFormFieldState('libreDeudaIB')"
        @change="handleDocumentUpdate('libreDeudaIB'); checkDocumentSize('libreDeudaIB', $event)"
        @input="clearFormFieldState('libreDeudaIB')"></b-form-file>
        <div v-if="$v.documentos.libreDeudaIB.contenido.$error || fileTooLargeError.libreDeudaIB" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> {{ fileTooLargeError.libreDeudaIB || 'Debe seleccionar un archivo.' }}
        </div>
      </b-form-group><b-form-group v-if="solicitante.tipoSolicitud=='Baja'">
        <label for="libreDeudaComercial" class="rubro-label">Libre Deuda de Tasa de Inspección de Seguridad e Higiene. * <b-icon-question-circle-fill @click="openPopup('ConstanciaLibreDeudaSegHig')" font-scale="1" variant="info"></b-icon-question-circle-fill></label>
        <b-form-file v-model="documentos.libreDeudaSegHig.contenido" placeholder="No se seleccionó un archivo." browse-text="Examinar"
        accept=".pdf, image/*"  :state="getFormFieldState('libreDeudaSegHig')"
        @change="handleDocumentUpdate('libreDeudaSegHig'); checkDocumentSize('libreDeudaSegHig', $event)"
        @input="clearFormFieldState('libreDeudaSegHig')"></b-form-file>
        <div v-if="$v.documentos.libreDeudaSegHig.contenido.$error || fileTooLargeError.libreDeudaSegHig" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> {{ fileTooLargeError.libreDeudaSegHig || 'Debe seleccionar un archivo.' }}
        </div>
      </b-form-group>
      <b-form-group>
        <label for="libreDeudaUrbana" class="rubro-label">Libre Deuda de Tasa por Servicios Urbanos <i>(o última factura de pago que indique que la Tasa municipal no registra deuda)</i>. * <b-icon-question-circle-fill @click="openPopup('ConstanciaLibreDeuda')" font-scale="1" variant="info"></b-icon-question-circle-fill></label>
        <b-form-file v-model="documentos.libreDeudaUrbana.contenido" placeholder="No se seleccionó un archivo." browse-text="Examinar"
        accept=".pdf, image/*"  :state="getFormFieldState('libreDeudaUrbana')"
        @change="handleDocumentUpdate('libreDeudaUrbana'); checkDocumentSize('libreDeudaUrbana', $event)"
        @input="clearFormFieldState('libreDeudaUrbana')"></b-form-file>
        <div v-if="$v.documentos.libreDeudaUrbana.contenido.$error || fileTooLargeError.libreDeudaUrbana" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> {{ fileTooLargeError.libreDeudaUrbana || 'Debe seleccionar un archivo.' }}
        </div>
      </b-form-group>
      <b-form-group >
        <label v-if="solicitante.tipoSolicitud=='Habilitación'" for="tituloPropiedad">Escritura traslativa de Dominio del inmueble / Contrato de locación / Otro. *</label>
        <label v-if="solicitante.tipoSolicitud=='Baja'" for="tituloPropiedad">Escritura traslativa de Dominio del inmueble / Contrato de locación / Boleto de Compraventa. <span v-if="!solicitante.esTitular && solicitante.esPropietario">* </span></label>
        <b-form-file v-model="documentos.tituloPropiedad.contenido" placeholder="No se seleccionó un archivo." browse-text="Examinar"
        accept=".pdf, image/*"  :state="getFormFieldState('tituloPropiedad')"
        @change="handleDocumentUpdate('tituloPropiedad'); checkDocumentSize('tituloPropiedad', $event)"
        @input="clearFormFieldState('tituloPropiedad')"></b-form-file>
        <div v-if="$v.documentos.tituloPropiedad.contenido.$error || fileTooLargeError.tituloPropiedad" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> {{ fileTooLargeError.tituloPropiedad || 'Debe seleccionar un archivo.' }}
        </div>
      </b-form-group>
      <b-form-group v-if="solicitante.tipoSolicitud=='Habilitación'">
        <label for="plano" class="rubro-label">Plano o Informe técnico * <b-icon-question-circle-fill @click="openPopup('plano')" font-scale="1" variant="info"></b-icon-question-circle-fill></label>
        <b-form-file v-model="documentos.plano.contenido" placeholder="No se seleccionó un archivo." browse-text="Examinar"
        accept=".pdf, image/*"  :state="getFormFieldState('plano')"
        @change="handleDocumentUpdate('plano'); checkDocumentSize('plano', $event)"
        @input="clearFormFieldState('plano')"></b-form-file>
        <div v-if="$v.documentos.plano.contenido.$error || fileTooLargeError.plano" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> {{ fileTooLargeError.plano || 'Debe seleccionar un archivo.' }}
        </div>
      </b-form-group>
      <b-row>
        <b-col lg="6" md="8" sm="7">
          <h5>¿El iniciante es una Persona Jurídica?</h5>
        </b-col>
        <b-form-group label="" label-for="esPersonaJuridica" style="margin:auto 0">
          <div class="form-check-inline">
            <b-col lg="3" sm="3">
              <b-form-radio  id="esPersonaJuridica-no" v-model="solicitante.esPersonaJuridica" name="radio-esPersonaJuridica" checked="checked" value="false"> No</b-form-radio>
            </b-col>
            <b-col lg="3" sm="2">
              <b-form-radio  id="esPersonaJuridica-si" v-model="solicitante.esPersonaJuridica" name="radio-esPersonaJuridica" value="true"> Sí</b-form-radio>
            </b-col>
          </div>
        </b-form-group>
      </b-row>
      <!-- Sección: Datos del Apoderado -->
    <fieldset v-if="solicitante.esPersonaJuridica === 'true'">
      <p>A continuación deberás cargar la Escritura constitutiva de la Persona Jurídica y el Acta de Directorio actualizada.</p>
      <b-form-group label="Acta de Constitución de Persona Jurídica *" label-for="actaPersonaJuridica" >
        <b-form-file v-model="documentos.actaPersonaJuridica.contenido" placeholder="No se seleccionó un archivo." browse-text="Examinar"
        accept=".pdf, image/*"  :state="getFormFieldState('actaPersonaJuridica')"
        @change="handleDocumentUpdate('actaPersonaJuridica'); checkDocumentSize('actaPersonaJuridica', $event)"
        @input="clearFormFieldState('actaPersonaJuridica')"></b-form-file>
        <div v-if="$v.documentos.actaPersonaJuridica.contenido.$error || fileTooLargeError.actaPersonaJuridica" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> {{ fileTooLargeError.actaPersonaJuridica || 'Debe seleccionar un archivo.' }}
        </div>
      </b-form-group>
      <b-form-group label="" label-for="actaDirectorio" >
        <label for="actaDirectorio" class="actaDirectorio-label">Acta de Directorio Actualizada <i>(En caso que corresponda)</i> </label>
        <b-form-file v-model="documentos.actaDirectorio.contenido" placeholder="No se seleccionó un archivo." browse-text="Examinar"
        accept=".pdf, image/*" :state="getFormFieldState('actaDirectorio')"
        @change="handleDocumentUpdate('actaDirectorio'); checkDocumentSize('actaDirectorio', $event)"
        @input="clearFormFieldState('actaDirectorio')"></b-form-file>
        <div v-if="fileTooLargeError.actaDirectorio" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> {{ fileTooLargeError.actaDirectorio }}
        </div>
      </b-form-group>
    </fieldset>
    </fieldset>
    <div class="centeredContainer" style="min-width: 304px;">
      <b-form-group>
        <div id="captchaContainer" class="g-recaptcha" :data-sitekey="recaptchaSiteKey"></div>
        <div v-if="captchaError" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Por favor completa la verificación para continuar.
        </div>
      </b-form-group>
      <fieldset>
        <b-button size="lg" @click="onResetParams" variant="danger" class="btn-cancel" >Cancelar</b-button>
        <b-button size="lg" type="submit" variant="success" :disabled="!areAllFieldsComplete" class="" >Enviar</b-button>
        <div v-if="!areAllFieldsComplete" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Completar todos los campos marcados con (*).
        </div>
        <div v-if="!areAllFieldsValid" class="validation-error">
          <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Por favor, revisa el formulario en busca de errores.
        </div>
      </fieldset>
    </div>
  </b-card>
  </b-form>
<!-- PopUps -->
<b-modal v-model="showPopupDatosDelSolicitante" title="" :hide-footer="true" @click-outside="showPopupDatosDelSolicitante = false" :header-bg-variant="'success'"  centered>
  <template #modal-header>
    <div class="modal-info">
      <h5>
          <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
          Información Adicional
      </h5>
    </div>
    <button type="button" aria-label="Close" class="close" @click="showPopupDatosDelSolicitante = false">×</button>
  </template>
  <div class="modal-info">
    <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>El interesado futuro comerciante / industrial o afín mayor de 18 años.</p>
    <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>El representante o apoderado/a de la persona interesada con documentación que acredite el carácter de tal.</p>
  </div>
</b-modal>
<b-modal v-model="showPopupApoderadoRepresentante" title="" :hide-footer="true" @click-outside="showPopupApoderadoRepresentante = false" :header-bg-variant="'success'"  centered>
  <template #modal-header>
    <div class="modal-info">
      <h5>
          <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
          Información Adicional
      </h5>
    </div>
    <button type="button" aria-label="Close" class="close" @click="showPopupApoderadoRepresentante = false">×</button>
  </template>
  <div class="modal-info popupApoderado">
    <h3>Representante o Apoderado/a</h3>
    <p class="destacado"><b-icon-caret-right-fill ></b-icon-caret-right-fill>Esta figura permite facultar a una persona para la realización de trámites, actos y gestiones en representación del/la contribuyente o responsable solicitante.</p>
    <h6>Casos de Representación:</h6>
    <p><span class="icon-orange">1) </span><b>Representante Voluntario:</b> Persona que actúa en nombre y por cuenta de otra, en virtud de la facultad que ella le confiere mediante un mandato (poder o autorización).</p>
    <p><span class="icon-orange">2) </span><b>Representante Legal:</b> Persona que actúa en nombre y por cuenta de una Persona Jurídica en virtud del carácter que posee por integrar los órganos de mando. Asimismo, los padres que ejercen la patria potestad sobre sus hijos/as.</p>
    <p><span class="icon-orange">3) </span><b>Representante Judicial:</b> Persona que actúa en nombre y por cuenta de otra (Humana o Jurídica) en virtud de una designación judicial, debido a una incapacidad legal que recae sobre aquella.</p>
    <p><span class="icon-orange">4) </span><b>Sucesiones Indivisas:</b> Casos en que, existiendo varios/as herederos/as, todos/as son propietarios/as de los bienes, pero aún no se ha realizado la división de los mismos en la proporción que cada uno/a tiene derecho a heredar.</p>
    <p><span class="icon-orange">5) </span><b>Herederos/as o Legatarios/as (Causahabientes):</b> Sucesor/a de una persona fallecida (actuación ante el Fisco previa al inicio de la sucesión o iniciada ésta, previa a la declaratoria de herederos/as).</p>
    </div>
</b-modal>
<b-modal v-model="showPopupNroInmueble" title="" :hide-footer="true" @click-outside="showPopupNroInmueble = false" :header-bg-variant="'success'"  centered>
  <template #modal-header>
    <div class="modal-info">
      <h5>
          <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
          Información Adicional
      </h5>
    </div>
    <button type="button" aria-label="Close" class="close" @click="showPopupNroInmueble = false">×</button>
  </template>
  <div class="modal-info">
    <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>Podés consultar el número enviando un correo electrónico a <a href="mailto:catatro@gesell.gob.ar" target="_blank">catastro@gesell.gob.ar</a>, indicando nomenclatura catastral del bien que se encuentra en la escritura del mismo.</p>
  </div>
</b-modal>
<b-modal v-model="showPopupConstanciaCUIT" title="Constancia de CUIT" :hide-footer="true" @click-outside="showPopupConstanciaCUIT = false" :header-bg-variant="'success'"  centered>
  <template #modal-header>
    <div class="modal-info">
      <h5>
          <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
          Información Adicional
      </h5>
    </div>
    <button type="button" aria-label="Close" class="close" @click="showPopupConstanciaCUIT = false">×</button>
  </template>
  <div class="modal-info">
    <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>Podes solicitar tu constancia de CUIT haciendo <a href="https://seti.afip.gob.ar/padron-puc-constancia-internet/ConsultaConstanciaAction.do" target="_blank" >click aquí</a>.</p>
  </div>
</b-modal>
<b-modal v-model="showPopupConstanciaIngresosBrutos" title="Constancia de Ingresos Brutos" :hide-footer="true" @click-outside="showPopupConstanciaIngresosBrutos = false" :header-bg-variant="'success'"  centered>
  <template #modal-header>
    <div class="modal-info">
      <h5>
          <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
          Información Adicional
      </h5>
    </div>
    <button type="button" aria-label="Close" class="close" @click="showPopupConstanciaIngresosBrutos = false">×</button>
  </template>
  <div class="modal-info">
    <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>Podes solicitar tu constancia de Ingresos Brutos haciendo <a href="https://www.arba.gov.ar/GuiaTramites/TramiteSeleccionado.asp?tramite=582&categ=34" target="_blank" >click aquí</a>.</p>
  </div>
</b-modal>
<b-modal v-model="showPopupConstanciaLibreDeuda" title="Libre Deuda de Tasa por Servicios Urbanos" :hide-footer="true" @click-outside="showPopupConstanciaLibreDeuda = false" :header-bg-variant="'success'"  centered>
  <template #modal-header>
    <div class="modal-info">
      <h5>
          <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
          Información Adicional
      </h5>
    </div>
    <button type="button" aria-label="Close" class="close" @click="showPopupConstanciaLibreDeuda = false">×</button>
  </template>
  <div class="modal-info">
    <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>Podés descargar tu última factura haciendo <a href="https://arvige.gob.ar/lpagos" target="_blank" >click aquí</a>.</p>
    <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>En el encabezado de cada factura se indica si tu partida registra deuda o no lo hace. Hacé click en la imagen y verificá cómo se visualiza.</p>
    <div style="width: 100%">
      <a href="http://haciendavgesell.gob.ar/_nuxt/img/ej-libredeuda.78769c7.jpg" target="_blank"><img src="../../assets/ej-libredeuda.jpg" width="100%" height="fit-content" /></a>
    </div>
  </div>
</b-modal>
<b-modal v-model="showPopupCertificadoDomicilio" title="Certificado de domicilio Ingresos Brutos- Punto de Venta Villa Gesell" :hide-footer="true" @click-outside="showPopupCertificadoDomicilio = false" :header-bg-variant="'success'"  centered>
  <template #modal-header>
    <div class="modal-info">
      <h5>
          <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
          Información Adicional
      </h5>
    </div>
    <button type="button" aria-label="Close" class="close" @click="showPopupCertificadoDomicilio = false">×</button>
  </template>
  <div class="modal-info">
    <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>Podés solicitar tu Certificado de domicilio haciendo <a href="https://www.arba.gov.ar/GuiaTramites/TramiteSeleccionado.asp?tramite=582&categ=34" target="_blank" >click aquí</a>.</p>
  </div>
</b-modal>
<b-modal v-model="showPopupConstanciaLibreDeudaIB" title="Libre deuda de Ingresos Brutos" :hide-footer="true" @click-outside="showPopupConstanciaLibreDeudaIB = false" :header-bg-variant="'success'"  centered>
  <template #modal-header>
    <div class="modal-info">
      <h5>
          <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
          Información Adicional
      </h5>
    </div>
    <button type="button" aria-label="Close" class="close" @click="showPopupConstanciaLibreDeudaIB = false">×</button>
  </template>
  <div class="modal-info">
    <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>Podés solicitar tu Libre Deuda de Ingresos Brutos haciendo <a href="https://www.arba.gov.ar/GuiaTramites/TramiteSeleccionado.asp?tramite=266&categ=34#anclaDescripcion" target="_blank" >click aquí</a>.</p>
  </div>
</b-modal>
<b-modal v-model="showPopupConstanciaLibreDeudaSegHig" title="Libre deuda de Tasa de Inspección de Seguridad e Higiene" :hide-footer="true" @click-outside="showPopupConstanciaLibreDeudaSegHig = false" :header-bg-variant="'success'"  centered>
  <template #modal-header>
    <div class="modal-info">
      <h5>
          <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
          Información Adicional
      </h5>
    </div>
    <button type="button" aria-label="Close" class="close" @click="showPopupConstanciaLibreDeudaSegHig = false">×</button>
  </template>
  <div class="modal-info">
    <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>Podés solicitarlo enviando un correo electrónico a <a href="mailto:deptocomercio@gesell.gob.ar" target="_blank" >deptocomercio@gesell.gob.ar</a>, indicando <b>número de legajo comercial</b> y <b>nombre del titular de la habilitación</b>.</p>
  </div>
</b-modal>
<b-modal v-model="showPopupPlano" title="" :hide-footer="true" @click-outside="showPopupPlano = false" :header-bg-variant="'success'"  centered>
  <template #modal-header>
    <div class="modal-info">
      <h5>
          <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
          Información Adicional
      </h5>
    </div>
    <button type="button" aria-label="Close" class="close" @click="showPopupPlano = false">×</button>
  </template>
  <div class="modal-info modal-plano">
    <div>
      <h6>Tipos de Plano para cargar</h6>
      <p><span class="icon-orange">1. </span>Plano Conforme a obra o Medición Aprobado.</p>
      <p><span class="icon-orange">2. </span>Plano Conforme a obra o Medición Registrado.</p>
    </div>
    <div class="parrafo">
      <h6>¿Cómo identificar los tipos de plano?</h6>
      <p><b-icon-check scale="1.25" class="icon-orange"></b-icon-check>Verificá el sello impuesto en la carátula de tu plano. Esta puede indicar: <i class="icon-green">Conforme a obra o Medición Aprobado o Conforme a obra o Medición Registrado.</i></p>
    </div>
    <div class="parrafo">
      <div style="width: 64%; display: inline-block; vertical-align:top;">
      <h6>¿Cómo digitalizar el plano?</h6>
        <p><b-icon-check scale="1.25" class="icon-orange"></b-icon-check>Sacá una <b>fotografía</b> de la <b>carátula</b> y del <b>sector del plano donde se encuentra el local a habilitar</b>. Éste debe estar claramente <b>identificado</b> con una <b>cruz</b> en lápiz.</p>
        <p><b-icon-check scale="1.25" class="icon-orange"></b-icon-check>Luego, uní las imagenes en un pdf con alguna herramienta digital (como <a href="https://www.ilovepdf.com/es/jpg_a_pdf" class="external-link" target="_blank">ilovepdf</a>).</p>
        <p><b-icon-check scale="1.25" class="icon-orange"></b-icon-check>Podés ver un ejemplo haciendo click en la imagen. <i>Ahí te indicamos cómo identificar el tipo de plano y cómo señalar la unidad funcional donde se ubicará tu comercio.</i></p>
      </div>
      <div style="width: 35%; display: inline-block; max-width:165px; margin-top:1rem">
        <a href="https://drive.google.com/file/d/16sXdLRDbHy-GwIhM4Er-EftM9-QpSGcy/view" target="_blank"><img src="../../assets/ej-plano.jpg" width="100%" height="fit-content" /></a>
      </div>
    </div>
  </div>
</b-modal>
<b-modal v-model="showPopupFormLoading" no-close-on-backdrop title="" :header-bg-variant="'success'" hide-footer centered>
  <template #modal-header>
    <h5 class="centeredContainer">Solicitud en Proceso</h5>
  </template>
  <div class="centeredContainer">
    <p class="popup-link">Tus archivos se están cargando.</p>
    <b-spinner variant="success" style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
    <p>No cierres esta página</p>
  </div>
</b-modal>
<b-modal v-model="showPopupFormOk" title="" ok-only @click-outside="showPopupFormOk = false" :header-bg-variant="'success'" centered>
  <template #modal-header>
    <div class="centeredContainer"><h3>
      <b-icon icon="check-circle-fill" scale="1.5" variant="light"></b-icon>
    </h3></div>
  </template>
  <div class="centeredContainer">
    <p class="modal-subtitle">¡Tu solicitud ha sido enviada exitosamente!</p>
    <p class="">En los próximos días recibirás un correo electrónico del Departamento Comercio Municipal en el que te indicarán cómo continuar. Asegurate de revisar la bandeja de correos no deseados (Spam).</p>
    <p class=""><b>Tu número de trámite es: </b></p>
    <p class="h3"><b> {{ nroTramite }} </b></p>
    <p class="">Por favor, conservá este número. Será solicitado más adelante.</p>
  </div>
    <div class="centeredContainer" style="padding:0 1rem; padding-top: 1rem; border-top:1px solid #CCC; ">
      <p class="" style="text-align: justify; margin-bottom:0; font-size: 0.75rem "><b-icon-caret-right-fill variant="success"></b-icon-caret-right-fill> Tené en cuenta que el Departamento Comercio puede solicitarte documentación adicional vía correo electrónico.</p>
      <p class="" style="text-align: justify; font-size: 0.75rem; margin-bottom:0; "><b-icon-caret-right-fill variant="success"></b-icon-caret-right-fill> Para consultar el estado de tu trámite ingresá en <a class="external-link" href="https://haciendavgesell.gob.ar/">haciendavgesell.gob.ar</a>, hacé click en el ícono correspondiente y escribí el número asignado en este comprobante.</p>
    </div>
  <template #modal-footer>
    <div class="" style="margin: auto">
      <b-button @click="onResetParams" class="btn-cancel">Volver</b-button>
      <b-button @click="onPrintTicket">Imprimir</b-button>
    </div>
  </template>
</b-modal>
<b-modal v-model="showPopupFormError" title="Error en el envío!" @click-outside="showPopupFormError = false" :header-bg-variant="'danger'" centered>
  <template #modal-header>
    <div class="centeredContainer"><h3>
        <b-icon-exclamation-octagon scale="1.5" variant="light"></b-icon-exclamation-octagon>
    </h3></div>
    <button type="button" aria-label="Close" class="close" @click="showPopupFormError = false">×</button>
  </template>
  <div class="centeredContainer modal-error">
    <p class="modal-subtitle">No hemos podido procesar tu solicitud</p>
    <p class="">Por favor, verificá tu conexión a internet e intentalo nuevamente más tarde.</p>
    <p class="minitext">Si el problema persiste, comunicate con <a target="_blank" href="mailto:arvige@gesell.gob.ar" class="external-link">arvige@gesell.gob.ar</a> para que podamos ayudarte.</p>
  </div>
  <template #modal-footer>
    <div class="" style="margin: auto">
      <b-button @click="showPopupFormError = false" variant="danger" class="btn-cancel" >Aceptar</b-button>
    </div>
  </template>
</b-modal>


</div>
</template>
<script>
import rubros from "@/plugins/rubros.js";
import { required, requiredIf, alpha, numeric, email, minLength, maxLength, sameAs } from 'vuelidate/lib/validators';
export default {
  validations() {
    return {
      nroExpedienteNro: { requiredIf: requiredIf(function () {
        return this.solicitante.tipoSolicitud == 'Baja' }) , numeric },
      nroExpedienteAnio: { requiredIf: requiredIf(function () {
        return this.solicitante.tipoSolicitud == 'Baja' }) , numeric },
      solicitante: {
        nombre: { required },
        apellido: { required },
        dni: { required, numeric, maxLength: maxLength(9), minLength: minLength(7) },
        cuit: { required, numeric, maxLength: maxLength(12), minLength: minLength(10) },
        domicilioReal: { required },
        telefono: { required, numeric },
        codigoPostal: { required, numeric, maxLength: maxLength(4), minLength: minLength(4) },
        localidad: { required },
        provincia: { required },
        mail: { required, email },
        mail2: { required, email, sameAs: sameAs( function(){return this.solicitante.mail } ) }
      },
      inmueble: {
        localidad: { required },
        rubro: { required },
        calle: { required },
        nro: { required, numeric },
        otrosServicios: { requiredIf: requiredIf(function () {
          return this.inmueble.serviciosHoteleria[11].value === true }) 
        },
        marquesina: {
          requiredIfAtLeastOneChecked: (value) => {
            return value || this.inmueble.mercaderia || this.inmueble.carteles || this.inmueble.mesas || this.solicitante.tipoSolicitud == 'Baja';
          }
        },
        mercaderia: {
          requiredIfAtLeastOneChecked: (value) => {
            return value || this.inmueble.marquesina || this.inmueble.carteles || this.inmueble.mesas || this.solicitante.tipoSolicitud == 'Baja';
          }
        },
        carteles: {
          requiredIfAtLeastOneChecked: (value) => {
            return value || this.inmueble.marquesina || this.inmueble.mercaderia || this.inmueble.mesas || this.solicitante.tipoSolicitud == 'Baja';
          }
        },
        mesas: {
          requiredIfAtLeastOneChecked: (value) => {
            return value || this.inmueble.marquesina || this.inmueble.mercaderia || this.inmueble.carteles || this.solicitante.tipoSolicitud == 'Baja';
          }
        }
      },
      documentos: {
        dniFrente: { contenido:{ required} },
        dniDorso: { contenido:{ required} },
        constanciaCuit: { contenido:{ required} },
        constanciaIngresosBrutos: { contenido:{ required} },
        libreDeudaUrbana: { contenido:{ required} },
        libreDeudaIB: { contenido:{ requiredIf: requiredIf(function () {
          return (this.solicitante.tipoSolicitud === 'Baja' && this.solicitante.esTitular == true) }) }},
        libreDeudaSegHig: { contenido:{ requiredIf: requiredIf(function () {
          return this.solicitante.tipoSolicitud === 'Baja' }) }},
        tituloPropiedad: { contenido:{ requiredIf: requiredIf(function () {
          return this.solicitante.tipoSolicitud === 'Habilitación' || (
            this.solicitante.tipoSolicitud === 'Baja' && this.solicitante.esPropietario && !this.solicitante.esTitular)
          }) }},
        plano: { contenido:{requiredIf: requiredIf(function () {
          return this.solicitante.tipoSolicitud === 'Habilitación' }) }},
        planillaAutorizacion: { contenido:{requiredIf: requiredIf(function () {
          return this.solicitante.esApoderado === 'true' })}},
        croquis: { contenido:{requiredIf: requiredIf(function () {
          return this.rubroSeleccionado.croquis && !this.isHoteleria })}},
        actaPersonaJuridica: { contenido:{requiredIf: requiredIf(function () {
          return this.solicitante.esPersonaJuridica === 'true' })}},
      }
    }
    // Otras validaciones aquí...
  },
  data:function() {
      return {
      recaptchaSiteKey: "6LfNxggoAAAAANyfZ5a2Lg_Rx28HX_lINDYX7AU-",
      captchaResponse: null,
      captchaError: false,
      maxFileSize: 15 * 1024 * 1024, // 15MB in bytes,
      fileTooLargeError: {},
      TEST_submit: true,
      listaRubros: rubros,
      rubroSeleccionado: {
        id: null,
        nombre: null,
        descripcion: null,
        especiales: [],
        links: [],
        requisitos: [],
        pom: null,
        inspeccion: false,
        croquis: false,
      },
      rubrosHoteleria:[136,137,138,139,140,141,142,143,144,145],
      provincias: [
        'CABA','Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy',
        'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz',
        'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán'
      ],
      isHoteleria: false,
      nroTramite: null,      
      nroExpediente: '',
      nroExpedienteAnio: '',
      nroExpedienteNro: '',
      solicitante: {
        tipoSolicitud: this.$route.query.tramite,
        nombre: '',
        apellido: '',
        dni: '',
        cuit: '',
        razonSocial: '',
        domicilioReal: '',
        telefono: '',
        codigoPostal: '',
        localidad: '',
        provincia: '',
        mail: '',
        esApoderado: false,
        esPersonaJuridica: false,
        esTitular: false,
        esPropietario: false,
      },
      inmueble: {
        localidad: '',
        calle: '',
        nro: null,
        nroLocal: null,
        nombreFantasia: '',
        rubro: null,
        actividad: "",
        espacioPublico: true,
        marquesina: false,
        mercaderia: false,
        mesas: false,
        carteles: false,
        otrosServicios: '',
        serviciosHoteleria: [
          { id: "1", servicio: "Servicio de Mucama-Ropa Blanca", value: false},
          { id: "2", servicio: "Desayuno", value: false},
          { id: "3", servicio: "Restaurante - Bar", value: false},
          { id: "4", servicio: "Gimnasio", value: false},
          { id: "5", servicio: "Piletas de Natación", value: false},
          { id: "6", servicio: "Spa", value: false},
          { id: "7", servicio: "Estacionamiento dentro del predio", value: false},
          { id: "8", servicio: "TV-Electrodomésticos", value: false},
          { id: "9", servicio: "Ventiladores y/o Aire Acondicionado", value: false},
          { id: "10", servicio: "Calefacción", value: false},
          { id: "11", servicio: "WI FI y/o Internet", value: false},
          { id: "12", servicio: "Otros", value: false}
        ],
      },      
      documentos: {
        planillaAutorizacion: {
          nombreDocumento: 'Planilla de autorización de trámite',
          contenido: null
        },
        dniFrente:{
          nombreDocumento: 'DNI (Frente)',
          contenido: null
        },
        dniDorso:{
          nombreDocumento: 'DNI (Dorso)',
          contenido: null
        },
        constanciaCuit:{
          nombreDocumento: 'Constancia de CUIT',
          contenido: null
        },
        constanciaIngresosBrutos:{
          nombreDocumento: 'Constancia de inscripción a Ingresos Brutos',
          contenido: null
        },
        actaPersonaJuridica:{
          nombreDocumento: 'Acta de Constitución de Persona Jurídica',
          contenido: null
        },
        actaDirectorio:{
          nombreDocumento: 'Acta de Directorio Actualizada',
          contenido: null
        },
        libreDeudaUrbana:{
          nombreDocumento: 'Libre Deuda de Tasa por Servicios Urbanos',
          contenido: null
        },
        libreDeudaComercial:{
          nombreDocumento: 'Libre Deuda de Tasa de Inspección de Seguridad e Higiene',
          contenido: null
        },
        libreDeudaIB:{
          nombreDocumento: 'Libre Deuda de Ingresos Brutos',
          contenido: null
        },
        libreDeudaSegHig:{
          nombreDocumento: 'Libre Deuda de Tasa de Inspección de Seguridad e Higiene',
          contenido: null
        },
        tituloPropiedad:{
          nombreDocumento: 'Escritura traslativa de Dominio del inmueble / Contrato de locación / Boleto de Compraventa',
          contenido: null
        },
        plano:{
          nombreDocumento: 'Plano o Informe técnico',
          contenido: null
        },
        certificadoDomicilio:{
          nombreDocumento: 'Certificado de domicilio Ingresos Brutos - Punto de venta Villa Gesell ',
          contenido: null
        },
        croquis:{
          nombreDocumento: 'Croquis',
          contenido: null
        }
      },
      formFieldStates: {
        planillaAutorizacion: null,
        dniFrente: null,
        dniDorso: null,
        constanciaCuit: null,
        constanciaIngresosBrutos: null,
        actaPersonaJuridica: null,
        actaDirectorio: null,
        libreDeudaUrbana: null,
        libreDeudaComercial: null,
        libreDeudaIB: null,
        tituloPropiedad: null,
        certificadoDomicilio: null,
        plano: null,
        croquis: null,
      },
      showPopupDatosDelSolicitante: false,
      showPopupApoderadoRepresentante: false,
      showPopupNroInmueble: false,
      showPopupConstanciaIngresosBrutos: false,
      showPopupConstanciaCUIT: false,
      showPopupConstanciaLibreDeuda: false,
      showPopupCertificadoDomicilio: false,
      showPopupConstanciaLibreDeudaIB: false,
      showPopupConstanciaLibreDeudaSegHig: false,
      showPopupPlano: false,
      showPopupFormOk: false,
      showPopupFormLoading: false,
      showPopupFormError: false,
      printing: false,
      endButton: false,
      }
  },
  computed: {
    formattedDate() {
      if (this.date) {
        const day = this.date.getDate();
        const month = this.date.getMonth() + 1;
        const year = this.date.getFullYear();
        return `${day}/${month}/${year}`;
      }
      return '';
    },
    areAllFieldsComplete() {
      if (this.TEST_submit){
          return true;
      }
      else{
        return this.solicitante.nombre && this.solicitante.apellido && this.solicitante.dni && this.solicitante.cuit && this.solicitante.domicilioReal &&
              this.solicitante.telefono && this.solicitante.codigoPostal && this.solicitante.localidad && this.solicitante.provincia && this.solicitante.mail &&
              this.inmueble.localidad && this.inmueble.calle && this.inmueble.nro && this.inmueble.rubro && this.documentos.dniFrente && this.documentos.dniDorso &&
              (this.documentos.constanciaCuit || this.solicitante.tipoSolicitud!='Habilitación') && 
              this.documentos.libreDeudaUrbana && 
              (this.documentos.libreDeudaComercial || this.solicitante.tipoSolicitud!='Baja') && 
              (this.documentos.libreDeudaIB || this.solicitante.tipoSolicitud!='Baja') && 
              (this.documentos.tituloPropiedad || this.solicitante.tipoSolicitud!='Habilitación') &&
              (this.documentos.plano || this.solicitante.tipoSolicitud!='Habilitación')

      }
    },
    areAllFieldsValid(){
      if(this.areAllFieldsComplete)
        return !this.$v.$invalid && !Object.values(this.fileTooLargeError).some(error => !!error)
      return true;
    }
  },
  mounted() {
    //ORDENAR listaRubros antes de mostrarla.
    this.listaRubros.sort((a, b) => a.nombre.localeCompare(b.nombre));
    //CAMBIAR EL SITEKEY POR UNO DE VERDAD
    grecaptcha.ready(() => {
    grecaptcha.render('captchaContainer', {
      sitekey: this.recaptchaSiteKey,
      });
    });
  },
  methods: {
    isCaptchaOK(){
        //console.log("isCAPTCHAOK?? = " + (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length > 0));
        this.captchaError = !(typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length > 0);
        if(this.TEST_submit) return true;
        return !this.captchaError;
    },
    openPopup(type) {
      // Lógica para abrir el popup correspondiente según el tipo (A, B, C, D)else if (type === 'B')
      if (type === 'DatosDelSolicitante') {
        console.log("ShowPopup DatosDelSolicitante")
        this.showPopupDatosDelSolicitante = true;
      } else if (type === 'ApoderadoRepresentante') {
        console.log("ShowPopup ApoderadoRepresentante")
        this.showPopupApoderadoRepresentante = true;
      } else if (type === 'NroInmueble') {
        this.showPopupNroInmueble = true;
      } else if (type === 'ConstanciaIngresosBrutos') {
        this.showPopupConstanciaIngresosBrutos = true;
      } else if (type === 'ConstanciaCUIT') {
        this.showPopupConstanciaCUIT = true;
      } else if (type === 'ConstanciaLibreDeuda') {
        this.showPopupConstanciaLibreDeuda = true;
      } else if (type === 'certificadoDomicilio') {
        this.showPopupCertificadoDomicilio = true;
      } else if (type === 'plano') {
        this.showPopupPlano = true;
      } else if (type === 'FormLoading') {
        this.showPopupFormLoading = true;
      } else if (type === 'FormOk') {
        this.showPopupFormLoading = false
        this.showPopupFormOk = true
      } else if (type === 'FormError') {
        this.showPopupFormLoading = false
        this.showPopupFormError = true
      }else if (type === 'ConstanciaLibreDeudaIB') {
        this.showPopupConstanciaLibreDeudaIB = true;
      }else if (type === 'ConstanciaLibreDeudaSegHig') {
        this.showPopupConstanciaLibreDeudaSegHig = true;
      }
    },
    cancelForm(){
      console.log("CANCEL FORM");
    },
    async submitForm() {
      if(false){
        console.log("SUBMIT FORM CALLED");
        if (this.solicitante.esApoderado)
          console.log("solicitante.esApoderado: " + this.solicitante.esApoderado);
        else
          console.log("SUBMIT FORM CALLED");
        this.$v.$touch(); // Marca los campos como tocados para mostrar los errores
        console.log("!this.$v.$invalid && !Object.values(this.fileTooLargeError).some(error => !!error)");
        console.log(!this.$v.$invalid && !Object.values(this.fileTooLargeError).some(error => !!error));
        console.log("Object.values(this.fileTooLargeError).some(error => !!error)");
        console.log(Object.values(this.fileTooLargeError).some(error => !!error));
        this.isCaptchaOK();

      }else{
        this.$v.$touch(); // Marca los campos como tocados para mostrar los errores
        if (!this.$v.$invalid && !Object.values(this.fileTooLargeError).some(error => !!error) && this.isCaptchaOK()) {
          // Si no hay errores, envía el formulario
          console.log("FORMULARIO ENVIADO");
          try {

            this.openPopup('FormLoading');
            const documentosParaGuardar = {};
            this.nroExpediente = "4124-" + this.nroExpedienteNro + "/" + this.nroExpedienteAnio;
            if (this.tipoSolicitud="Baja")
              this.espacioPublico = false;
            // Recorrer los campos en this.documentos
            for (const campo in this.documentos) {
              const nombreDoc = this.documentos[campo].nombreDocumento;
              const contenidoDoc = this.documentos[campo].contenido;

              if (contenidoDoc instanceof Blob) {
                // Verificar que el campo sea un Blob válido (archivo PDF seleccionado)
                const fileBlob = new Blob([contenidoDoc], { type: contenidoDoc.type });

                // Agregar el archivo PDF a documentosParaGuardar
                documentosParaGuardar[campo] = {
                  nombreDocumento: nombreDoc,
                  data: await this.blobToBase64(fileBlob),
                  contentType: contenidoDoc.type,
                };
              }
            }

            const habilitacion = {
              documentos: documentosParaGuardar,
              solicitante: this.solicitante,
              inmueble: this.inmueble,
              nroExpediente: this.nroExpediente,
            };
            // habilitacion.nroTramite = nroTramite
            const response = await this.$store.dispatch('habilitaciones/create', {
              habilitacion,
            });
            console.log(response.data)
            this.nroTramite = response.data
            this.openPopup('FormOk');
          } catch (e) {
            this.openPopup('FormError');
          }
        };
        }
    },
    onFinalizar(){
      this.$router.push('/')
      this.showPopupFormOk = false
      this.onResetParams()
    },
    resetFormFieldState(obj, field) {
      //console.log("resetFormFieldState("+obj+", "+field+")");
      this.fileTooLargeError[field] = null;
      if(obj == `documentos` && this.$v.documentos[field])
        this.$v.documentos[field].$reset();
      if(obj == `inmueble` && this.$v.inmueble[field])
        this.$v.inmueble[field].$reset();
      if(obj == `solicitante` && this.$v.solicitante[field])
        this.$v.solicitante[field].$reset();
    },
    resetAllVuelidations() {
      for (const field in this.solicitante) {
        if (this.solicitante.hasOwnProperty(field)) {
          this.resetFormFieldState(`solicitante`, field);
        }
      }
      for (const field in this.inmueble) {
        if (this.inmueble.hasOwnProperty(field)) {
          this.resetFormFieldState(`inmueble`, field);
        }
      }
      for (const field in this.documentos) {
        if (this.documentos.hasOwnProperty(field)) {
          this.resetFormFieldState(`documentos`, field);
        }
      }
    },
    onResetParams(){
      this.resetAllVuelidations()
      this.nroTramite = null
      this.solicitante.nombre = ''
      this.solicitante.apellido = ''
      this.solicitante.dni = ''
      this.solicitante.cuit = ''
      this.solicitante.razonSocial = ''
      this.solicitante.domicilioReal = ''
      this.solicitante.telefono = ''
      this.solicitante.codigoPostal = ''
      this.solicitante.localidad = ''
      this.solicitante.provincia = ''
      this.solicitante.mail = ''
      this.solicitante.esApoderado = false
      this.solicitante.esPersonaJuridica = false

      this.nroExpediente = ''
      this.nroExpedienteNro = ''
      this.nroExpedienteAnio = ''
      this.inmueble.localidad = ''
      this.inmueble.calle = ''
      this.inmueble.nro = null
      this.inmueble.nroLocal = null
      this.inmueble.nombreFantasia = ''
      this.inmueble.rubro = null
      this.inmueble.espacioPublico = true
      this.inmueble.marquesina = false
      this.inmueble.mercaderia = false
      this.inmueble.mesas = false
      this.inmueble.carteles = false
      this.inmueble.otrosServicios = ''

      this.documentos.planillaAutorizacion.contenido = null
      this.documentos.dniFrente.contenido = null
      this.documentos.dniDorso.contenido = null
      this.documentos.constanciaCuit.contenido = null
      this.documentos.constanciaIngresosBrutos.contenido = null
      this.documentos.actaPersonaJuridica.contenido = null
      this.documentos.actaDirectorio.contenido = null
      this.documentos.libreDeudaUrbana.contenido = null
      this.documentos.libreDeudaComercial.contenido = null
      this.documentos.libreDeudaIB.contenido = null
      this.documentos.tituloPropiedad.contenido = null
      this.documentos.certificadoDomicilio.contenido = null
      this.documentos.plano.contenido = null
      this.documentos.croquis.contenido = null

      this.showPopupDatosDelSolicitante = false
      this.showPopupApoderadoRepresentante = false
      this.showPopupNroInmueble = false
      this.showPopupConstanciaIngresosBrutos = false
      this.showPopupConstanciaCUIT = false
      this.showPopupConstanciaLibreDeuda = false
      this.showPopupCertificadoDomicilio = false
      this.showPopupPlano = false
      this.showPopupFormOk = false
      this.showPopupFormLoading = false
      this.showPopupFormError = false
      this.printing= false
      this.$router.push('/comercio')
    },
    handleRubroChange() {
      if (this.inmueble.rubro != null) {
      // Obtener los datos correspondientes al rubro seleccionado
      const i = this.listaRubros.findIndex(rubro => rubro.nombre === this.inmueble.rubro);
      this.rubroSeleccionado.id = this.listaRubros[i].id;
      this.rubroSeleccionado.nombre = this.listaRubros[i].nombre;
      this.rubroSeleccionado.descripcion = this.listaRubros[i].descripcion;
      this.rubroSeleccionado.especiales = this.listaRubros[i].especiales;
      this.rubroSeleccionado.links = this.listaRubros[i].links;
      this.rubroSeleccionado.requisitos = this.listaRubros[i].requisitos;
      this.rubroSeleccionado.pom = this.listaRubros[i].pom;
      this.rubroSeleccionado.inspeccion = this.listaRubros[i].inspeccion;
      this.rubroSeleccionado.croquis = this.listaRubros[i].croquis;
      this.isHoteleria = this.rubrosHoteleria.includes(this.rubroSeleccionado.id);
      if(!this.isHoteleria){
        this.inmueble.serviciosHoteleria.forEach(servicio => {
          servicio.value = false;
        });
        this.inmueble.otrosServicios = ''
      }

      } else {
        // Si no se ha seleccionado ninguna opción, reiniciar las propiedades
        this.rubroSeleccionado.id = null;
        this.rubroSeleccionado.nombre = null;
        this.rubroSeleccionado.descripcion = null;
        this.rubroSeleccionado.especiales = [];
        this.rubroSeleccionado.links = [];
        this.rubroSeleccionado.requisitos = [];
        this.rubroSeleccionado.pom = null;
        this.rubroSeleccionado.inspeccion = false;
        this.rubroSeleccionado.croquis = false;
        this.rubroSeleccionado.isHoteleria = false;
      }
    },
    blobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
      });
    },
    handleDocumentUpdate(fieldName) {
      const contenidoDoc = this.documentos[fieldName];


      if (contenidoDoc instanceof Blob) {
        // Verificar que el campo sea un Blob válido (archivo PDF o imagen seleccionado)
        const fileBlob = new Blob([contenidoDoc], { type: contenidoDoc.type });

        // Agregar el archivo PDF o imagen a documentosParaGuardar
        this.documentos[fieldName] = {
          name: contenidoDoc.name,
          contentType: contenidoDoc.type,
          file: fileBlob,
        };
      }
    },
    checkDocumentSize(field, event){
      console.log('checkDocumentSize CALLED');
      const file = event.target.files[0];

      console.log('event.target.files[0]: ' + event.target.files[0]);

      console.log('file.size: ' + file.size + '> this.maxFileSize: ' + this.maxFileSize);
       if (file && file.size > this.maxFileSize) {
        // El archivo excede el tamaño máximo permitido
        this.fileTooLargeError[field] = 'El archivo debe pesar menos de '+this.maxFileSize/1024/1024+'MB.';
        return;
      }else
      this.fileTooLargeError[field] = null
    },
     getFormFieldState(fieldName) {
      return this.formFieldStates[fieldName];
    },
    clearFormFieldState(fieldName) {
      this.formFieldStates[fieldName] = null;
    },
    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    async onPrintTicket() {
      this.showPopupFormOk = false;
      this.printing = true;
      await this.wait(500);
      print();
      await this.wait(500);
      this.endButton = true;
    },
  }

}
</script>

<style scoped>
@media (max-width: 1200px) {
  .col-8{
    max-width: 80%;
  }
}
@media (max-width: 720px) {
  h5{
    font-size: 1.15rem;
  }
  .form-check-inline{
    margin-right: 0;
  }
}
@media (max-width: 480px) {
  .col-8{
    max-width: 90%;
  }
}
.printing-modal .card-header h5{
  color: white !important;
}
.printing-modal h5{
  margin: 0 0 0.5rem;
}
.green{
    background-color:#0b6919;
  }
.btn-orange{
  background-color:#eb8a0a !important;
  border: none;
}
.text-green{
  color:#0c6919;
}
.centeredContainer{
  width:  auto;
  margin: auto;
  text-align: center;
}
.centeredContainer button{
  width: 40%;
  font-size: 1rem;
  padding-right: 0;
  padding-left: 0;
}
p, .li-content{
  font-family: Calibri, 'Trebuchet MS', sans-serif;
}
.validation-error {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}
.icon-orange{
  color: #E27910;
}
.icon-green{
  color: #0c681a;
}
ul{
  list-style-type: none; /* Elimina los puntos por defecto */
  padding: 0;
}
.btn{
  background-color: #0c681a;
  border-color: #0c681a;
}
.btn:hover{
  background-color: green;
  border-color: green;
}
.btn.disabled{
  background-color: #619D6A;
  border-color: #619D6A;
}
.btn.disabled:hover{
  background-color: #619D6A;
  border-color: #619D6A;
}
.btn-cancel:hover{
  background-color: #f09658;
  border-color: #f09658;
}
.btn-cancel{
  background-color: #e53749;
  border-color: #e53749;
}
.centeredContainer{
  width:  auto;
  margin: auto;
  text-align: center;
}
.centeredContainer button{
  width: 40%;
  font-size: 1rem;
  padding-right: 0;
  padding-left: 0;
}
.modal-dialog{
  max-width: 600px;
}
.modal-body{
  padding: 1.5rem 1rem;
}
.modal h5, .modal h3{
  color: white !important;
  font-weight: bold;
  font-size: 1.5rem;
}
.modal .modal-subtitle{
  color: #0c681a !important;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 15px;
  padding-top: 0;
}
.modal-content .bg-danger{
  background-color: #e53749 !important;
}
.modal-content .bg-success{
  background-color: #0c681a !important;
}
.modal-error .modal-subtitle{
  color: #e53749 !important;
}
.modal-error p{
  color: black;
  font-weight: 500;
  padding: 0 1rem;
}
.modal-error .minitext{
  font-size: 0.75rem;
  font-weight: 100;
}
.popupApoderado{
  padding-left: 6%;
}
.modal-info h3{
  color: #0c681a !important;
  font-size: 1.6rem;
  padding-bottom: 0.5rem;
  margin-top: 0;
}
.modal-info h5{
  font-size: 1.5rem;
  padding: 0.75rem 0;
  margin: 0;
}
.modal-info h6{
  font-size: 1.25rem;
  font-weight: bold;
  color: #0c681a;
  margin: 1rem 0;
}
.modal-info .destacado{
  border-bottom: 2px solid #ccc;
  border-top: 2px solid #ccc;
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: #666;
}
.modal-info .bi-question-circle{
  margin-right: 1rem;
  padding-right: 0.5rem;
  border-right: 1px solid #FFF;
}
.modal-info p, .modal-info .bi-caret-right-fill{
  display: inline-block;
}
.modal-info .bi-caret-right-fill{
  margin-right: 1rem;
  color: #f09658;
  vertical-align: top;
  margin-top: 0.35rem;
  font-size: 1.05rem;
}
.modal-info ul b, .modal-info a, .popupApoderado b{
  color: #0c681a;
}
.modal-info p{
  color: #666;
}
.modal-plano .parrafo{
  border-top: #ccc 1px solid;
  padding-top: 1rem;
  margin-top: 1rem;
}
.modal-plano .parrafo p{
  margin-bottom: 0.5rem;
}
.modal-plano h6{
  margin-top: 0;
}
.modal-plano p{
  margin-bottom: 0;
}
.popupApoderado b{
  font-weight: 600;
}
.btn{
  padding: 0.5rem 3rem;
  font-weight: 500;
}
form .card{
  margin-top: 20px !important;
  padding: 20px;
  border-radius: 1rem;
}
.section-card{
  box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.75);
  -webkit-box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.75);
  -moz-box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.75);
}
form p{
  font-weight: 600;
  color: #666;
}
h3{
  font-weight: bold;
  color: #0c681a !important;
  margin: 1rem 0;
}
h5{
  margin: 1rem 0;
  color: #0c681a ;
}
.modal-title{
  font-weight: bold;
}
/* Selector para ocultar las flechas en los inputs numéricos */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Opcional: Estilos adicionales para los inputs numéricos */
input[type="number"] {
  -moz-appearance: textfield; /* Firefox */
  appearance: textfield; /* Otros navegadores */
  width: 100%; /* Ajusta el ancho según tus necesidades */
  padding: 0.375rem 0.75rem; /* Ajusta el padding según tus necesidades */
}
.popup-link, .external-link {
  color: #0c681a;
}
.rubro-label{
  width: 98%;
}
.rubro-label a{
  margin-left: 10px;
}
.form-check-inline div{
  margin-right: 10px;
}
.bi-question-circle-fill{
  cursor: pointer;
}
.titularOpropietario{
  margin-bottom: 1rem;
}
.titularOpropietario p{
  display: inline-flex;
}
.titularOpropietario .custom-switch{
  margin: 0 0.5rem;
}
</style>
