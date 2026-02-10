<template>
  <div class="page main-background">
    <Banner title="Compras" subtitle="Detalle de orden de compra"/>
    <!-- Header + Datos de la orden de compra -->
    <template v-if="orden && adminCompras">
      <div class="flex col" style="width: 96%">
        <div class="row justify-content-center mt-3">
          <h4> Número de orden: <b> {{ orden.nroOrden }}</b></h4>
        </div>
        <!-- <div class="row justify-content-center mt-3">
          <div class="h5 row"> Estado:
            <h5 :class="getStatusClass(habilitacion.status)" class="ml-2"> {{ habilitacion.status }}</h5>
          </div>
        </div> -->
      </div>
      <!--Botones-->
      <div class="row col-10 mx-auto justify-content-center" v-if="adminCompras">
        <b-button v-if="orden && orden.id" @click="$router.push(`/compras/combustible/${orden.id}/generar`)" variant="success" class="btn-4 mt-3 mx-1">
          + | Agregar vales
        </b-button>
        <b-button @click="onShowObservaciones" variant="primary" class="btn-2 mt-3 mx-1"> Ver observaciones </b-button>
      </div>

      <!--Datos de orden de compra-->
      <b-card no-body class="container big-container col-md-7 col-sm-10 shadow-card mt-4 mx-auto">
        <div class="container mt-4">
          <h5 class="row">
            <b-icon-receipt class="icon-orange mt-4 ml-4" scale="1.75"/>
            <a class="ml-3 mr-2 mt-2 separador" > | </a>
            <h2 class="text-green mt-3"><b>Datos de orden de compra</b></h2>
          </h5>
          <hr />
        </div>
        <div class="container mx-auto">
          <div class="row mt-4 mx-5">
            <b-icon-caret-right-fill class="icon-orange mt-1" scale="1.25"/>
            <h5 class="text-dark mx-2">Área asignada: </h5>
            <h5 class="text-right text-gray font-weight-bold" style="font-size: 1.75rem; line-height: 1.5rem">{{ orden.area }}</h5>
          </div>
          <div class="row no-gutters mt-1 mx-5">
            <b-icon-caret-right-fill class="icon-orange mt-1" scale="1.25"/>
            <h5 class="text-dark mx-2">Proveedor:</h5>
            <h5 class="text-right text-gray font-weight-bold" style="font-size: 1.75rem; line-height: 1.5rem">{{ orden.proveedor }}</h5>
          </div>
          <div class="fuel-layout mt-5">.
            <div
              class="fuel-container-h"
              v-for="(monto, index) in orden.montos"
              :key="index"
              :class="{ 'fuel-container-selected': filtroTipoCombustible === monto.tipoCombustible }"
              @click="filtrarPorTipoCombustible(monto.tipoCombustible)"
              style="cursor: pointer; transition: all 0.3s ease;"
            >
              <div class="fuel-icon-wrapper">
                <!-- SVG de círculo completo -->
                <div class="circular-progress-container" style="position: relative">
                  <FuelIcon class="fuel-icon" :class="['fill-color-' + index]" style="height: 45px; width: 45px;"/>
                  <svg viewBox="0 0 100 100" class="circular-progress">
                    <!-- Fondo gris (borde de la barra) -->
                    <circle
                      class="progress-background"
                      cx="50"
                      cy="50"
                      r="40"
                      stroke-width="10"
                    ></circle>
                    <!-- Barra de progreso -->
                    <circle
                      class="progress-bar"
                      :class="['stroke-color-' + index]"
                      cx="50"
                      cy="50"
                      r="40"
                      :style="{ strokeDasharray: getProgreso(getSaldoPorTipo(monto.tipoCombustible), monto.monto) }"
                    ></circle>
                  </svg>
                </div>
              </div>
              <div class="fuel-info-h">
                <div class="fuel-title-h">
                  <p>{{ monto.tipoCombustible ? monto.tipoCombustible.toUpperCase() : 'Sin definir' }}</p>
                </div>
                <div class="fuel-saldos-h">
                  <p>Restante: <span :class="['text-color-' + index]">{{ format(getSaldoPorTipo(monto.tipoCombustible)) }}</span></p>
                  <p>Total: {{ format(monto.monto) }}</p>
                </div>
            </div>
          </div>

        </div>
        </div>
      </b-card>
    </template>
    <!-- Vales -->
    <template>
      <div v-if="orden">
        <div class="container big-container col-md-7 col-sm-10 card shadow-card mt-4 mb-3 mx-auto">
          <!-- Título -->
          <div class="col mx-auto">
            <h5 class="row mt-3 ml-1">
              <b-icon-receipt class="icon-orange mt-4 ml-4" scale="2"/>
              <a class="ml-3 mr-2 mt-2 separador" > | </a>
              <h2 class="text-green mt-3"><b>Vales emitidos</b></h2>
              <div class="ml-auto mr-4 mt-2 d-flex align-items-center">
                <!-- Selector de vista -->
                <div class="btn-group mr-2" role="group">
                  <b-button
                    :variant="vistaVales === 'grid' ? 'primary' : 'outline-secondary'"
                    size="sm"
                    @click="cambiarVistaVales('grid')"
                    title="Vista cuadrícula"
                  >
                    <b-icon-grid/>
                  </b-button>
                  <b-button
                    :variant="vistaVales === 'list' ? 'primary' : 'outline-secondary'"
                    size="sm"
                    @click="cambiarVistaVales('list')"
                    title="Vista lista"
                  >
                    <b-icon-list/>
                  </b-button>
                </div>
                <b-button
                  variant="success"
                  size="sm"
                  class="mr-2"
                  @click="exportarValesAExcel"
                >
                  <b-icon-file-earmark-spreadsheet-fill/>
                  Exportar a Excel
                </b-button>
                <b-button
                  :variant="ocultarAnulados ? 'primary' : 'outline-secondary'"
                  size="sm"
                  @click="toggleOcultarAnulados"
                >
                  <b-icon-eye-slash v-if="ocultarAnulados"/>
                  <b-icon-eye v-else/>
                  {{ ocultarAnulados ? 'Mostrar anulados' : 'Ocultar anulados' }}
                </b-button>
              </div>
            </h5>
            <hr />
          </div>

          <!-- Mostrar los enlaces a los vales -->
          <div class="container justify-content-center mx-auto" v-if="paginatedVales && paginatedVales.length">
            <!-- Botones de utilización masiva -->
            <div class="row justify-content-center">
              <!-- Botón para deseleccionar todos -->
              <div class="text-center mx-3 my-3" v-if="valesSeleccionados.length">
                <button class="btn btn-secondary" @click="deseleccionarTodos">
                  <b-icon-x-circle/> Deseleccionar todos
                </button>
              </div>
              <!-- Botón para reimprimir seleccionados -->
              <div class="text-center mx-3 my-3" v-if="valesSeleccionados.length">
                <button class="btn btn-primary" @click="abrirModalReimpresion">
                  <b-icon-printer-fill/> Reimprimir seleccionados ({{ valesSeleccionados.length }})
                </button>
              </div>
              <!-- Botón para reimprimir seleccionados -->
              <div class="text-center my-3" v-if="valesSeleccionados.length">
                <button class="btn btn-success" @click="abrirModalUtilizarVales">
                  <b-icon-check/> Marcar como utilizados ({{ valesSeleccionados.length }})
                </button>
              </div>
              <div class="text-center mx-3 my-3" v-if="valesSeleccionados.length">
                <button class="btn btn-danger" @click="abrirModalEliminacionMasiva">
                  <b-icon-trash/> Eliminar seleccionados ({{ valesSeleccionados.length }})
                </button>
              </div>
            </div>

            <!-- Paginador -->
            <div class="row justify-content-center mt-4" v-if="getTotalValesFiltrados() > 0">
              <div class="col-auto">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="getTotalValesFiltrados()"
                  :per-page="itemsPerPage"
                  class="mt-3"
                  align="center"
                  size="md"
                  :hide-goto-end-buttons="true"
                  :hide-ellipsis="true"
                />
              </div>
            </div>
            <!-- Información de rango de páginas -->
            <div class="row justify-content-center mt-2" v-if="getTotalValesFiltrados() > 0">
              <div class="col-auto">
                <span class="text-muted">
                  Mostrando vales {{ getPageRange().start }}-{{ getPageRange().end }} de {{ getTotalValesFiltrados() }}
                  <span v-if="filtroTipoCombustible" class="text-primary">
                    (filtrado por {{ filtroTipoCombustible }} - haz clic nuevamente para mostrar todos)
                  </span>
                </span>
              </div>
            </div>

            <!-- Vista Cuadrícula -->
            <div v-if="vistaVales === 'grid'" class="row mx-4">
              <div v-for="(vale, index) in paginatedVales" :key="index" class="col-md-6 mb-3">
                <b-card no-body class="border-card main-background shadow-card">
                  <div class="m-2">
                    <div class="row no-gutters align-items-center">
                      <div class="col mt-2 ml-2">
                        <div class="row d-flex justify-content-between align-items-center">
                          <div class="d-flex align-items-center">

                            <input v-if="!vale.consumido && !vale.anulado" type="checkbox" class="mb-2 ml-2" :value="vale.id" v-model="valesSeleccionados" />
                            <b-icon-x-square v-else disabled="disabled" class="mb-2 ml-2"></b-icon-x-square>

                            <h4 class="mb-2 ml-2 font-weight-700 text-gray">
                              VALE N° {{ vale.nro_vale }}
                            </h4>
                          </div>
                          <!-- Botones -->
                          <div v-if="jefeCompras && !vale.anulado" class="d-flex mr-2">
                            <button v-if="!vale.consumido" class="btn btn-success btn-sm mx-1" title="Marcar como utilizado" @click="confirmarMarcarUtilizado(vale, (currentPage - 1) * itemsPerPage + index)">
                              <b-icon-check />
                            </button>
                            <button v-if="!vale.consumido" class="btn btn-primary btn-sm mx-1" title="Reimprimir" @click="confirmarReimpresion(vale, index)">
                              <b-icon-printer-fill />
                            </button>
                            <button v-if="!vale.consumido" class="btn btn-danger btn-sm mx-1" title="Eliminar" @click="confirmarEliminacion(vale.id)">
                              <b-icon-trash-fill />
                            </button>
                          </div>
                        </div>
                        <p class="card-text ml-3 text-dark">Tipo de combustible: {{ vale.tipoCombustible }}</p>
                        <p class="card-text ml-3 text-dark">Importe: {{ format(vale.monto) }}</p>
                        <p class="card-text ml-3 text-dark">Patente: {{ vale.dominio ? vale.dominio.toUpperCase() : 'Sin patente' }}</p>
                        <p class="card-text ml-3 text-dark">Fecha de emisión: {{ new Date(vale.fechaEmision).toLocaleDateString('es-AR') }}</p>
                        <p class="card-text ml-3 text-dark">
                          Estado:
                          <span :class="vale.consumido ? 'text-danger' : 'text-success'">
                            <b v-if="!vale.anulado">{{ vale.consumido ? 'No disponible' : 'Disponible' }}</b>
                            <b class="text-gray" v-else>Anulado</b>
                          </span>
                        </p>
                      </div>


                    </div>
                  </div>
                </b-card>
              </div>
            </div>

            <!-- Vista Lista -->
            <div v-if="vistaVales === 'list'" class="mx-4">
              <div class="table-responsive">
                <table class="table table-hover vales-list-table">
                  <thead>
                    <tr>
                      <th style="width: 40px;" class="text-center">
                        <input 
                          type="checkbox" 
                          :checked="todosValesPaginaSeleccionados"
                          @change="toggleSeleccionarTodosPagina"
                          class="vale-checkbox"
                          title="Seleccionar todos los vales disponibles de esta página"
                        />
                      </th>
                      <th>N° Vale</th>
                      <th>Tipo Combustible</th>
                      <th>Importe</th>
                      <th>Patente</th>
                      <th>Fecha Emisión</th>
                      <th>Estado</th>
                      <th v-if="jefeCompras" style="width: 120px;">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr 
                      v-for="(vale, index) in paginatedVales" 
                      :key="index"
                      :class="{ 'vale-disabled': vale.consumido || vale.anulado }"
                      class="vale-row"
                    >
                      <td class="text-center">
                        <input 
                          v-if="!vale.consumido && !vale.anulado" 
                          type="checkbox" 
                          :value="vale.id" 
                          v-model="valesSeleccionados"
                          class="vale-checkbox"
                        />
                        <b-icon-x-square v-else disabled="disabled" class="text-muted"></b-icon-x-square>
                      </td>
                      <td class="font-weight-bold">{{ vale.nro_vale }}</td>
                      <td>{{ vale.tipoCombustible }}</td>
                      <td>{{ format(vale.monto) }}</td>
                      <td>{{ vale.dominio ? vale.dominio.toUpperCase() : 'Sin patente' }}</td>
                      <td>{{ new Date(vale.fechaEmision).toLocaleDateString('es-AR') }}</td>
                      <td>
                        <span :class="vale.consumido ? 'text-danger' : 'text-success'">
                          <b v-if="!vale.anulado">{{ vale.consumido ? 'No disponible' : 'Disponible' }}</b>
                          <b class="text-gray" v-else>Anulado</b>
                        </span>
                      </td>
                      <td v-if="jefeCompras && !vale.anulado" class="text-center">
                        <div class="d-flex justify-content-center align-items-center">
                          <button 
                            v-if="!vale.consumido" 
                            class="btn btn-success btn-sm mx-1" 
                            title="Marcar como utilizado" 
                            @click="confirmarMarcarUtilizado(vale, (currentPage - 1) * itemsPerPage + index)"
                          >
                            <b-icon-check />
                          </button>
                          <button 
                            v-if="!vale.consumido" 
                            class="btn btn-primary btn-sm mx-1" 
                            title="Reimprimir" 
                            @click="confirmarReimpresion(vale, index)"
                          >
                            <b-icon-printer-fill />
                          </button>
                          <button 
                            v-if="!vale.consumido" 
                            class="btn btn-danger btn-sm mx-1" 
                            title="Eliminar" 
                            @click="confirmarEliminacion(vale.id)"
                          >
                            <b-icon-trash-fill />
                          </button>
                        </div>
                      </td>
                      <td v-else-if="jefeCompras"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Mensaje si no hay vales -->
          <div class="justify-content-center mx-auto" v-else>
            <p class="h6 text-center my-5" v-if="!filtroTipoCombustible">
              No hay vales emitidos para esta orden de compra.
            </p>
            <div v-else class="text-center my-5">
              <p class="h6 text-muted">No hay vales de {{ filtroTipoCombustible }} para esta orden.</p>
              <p class="text-muted small">Haz clic en el tipo de combustible nuevamente para mostrar todos los vales.</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div class="text-center mb-3">
      <b-button variant="primary" @click="volver">Volver</b-button>
    </div>

    <!-- Modals -->
    <b-modal v-model="showObservaciones" size="lg" header-bg-variant="primary" title="Observaciones" title-class="text-light" hide-footer centered>
      <p v-html="observaciones"></p>
    </b-modal>

    <!-- Modal de Confirmación para utilización -->
    <b-modal id="modalUtilizacion" header-class="justify-content-center" title-class="text-light" header-bg-variant="success" hide-footer centered>
      <template #modal-header>
        <b-iconstack class="my-3">
          <b-icon-circle scale="2.7" variant="light"/>
          <b-icon-exclamation scale="2" variant="light" />
        </b-iconstack>
      </template>
      <p class="h5 text-center mt-3 mb-4 font-weight-500 text-dark">
        ¿Estás seguro de que deseas marcar el vale como utilizado?
      </p>
      <hr class="row col-9 mx-auto"/>
      <div class="d-flex justify-content-center">
        <button class="btn btn-success mx-2" @click="marcarUtilizado()">Aceptar</button>
        <button class="btn btn-danger" @click="$bvModal.hide('modalUtilizacion')">Cancelar</button>
      </div>
    </b-modal>

    <!-- Modal de Confirmación para Reimpresión -->
    <b-modal id="modalReimpresion" header-class="justify-content-center" title-class="text-light" header-bg-variant="success" hide-footer centered>
      <template #modal-header>
        <b-iconstack class="my-3">
          <b-icon-circle scale="2.7" variant="light"/>
          <b-icon-printer-fill scale="1.5" variant="light" />
        </b-iconstack>
      </template>
      <p class="h5 text-center mt-3 mb-4 font-weight-500 text-dark">Estás a punto de reimprimir el vale.</p>
      <p class="h6 text-center mt-2 mb-3 font-weight-500 text-dark">¿Deseás continuar?</p>
      <hr class="row col-9 mx-auto"/>
      <div class="d-flex justify-content-center">
        <button class="btn btn-success mx-2" @click="reimprimirVale(valeSeleccionado)">Aceptar</button>
        <button class="btn btn-danger" @click="$bvModal.hide('modalReimpresion')">Cancelar</button>
      </div>
    </b-modal>

    <!-- Modal de confirmación para reimpresión múltiple -->
    <b-modal id="modalReimpresionMasiva" header-class="justify-content-center" header-bg-variant="success" title-class="text-light text-center" hide-footer centered>
      <template #modal-header>
        <b-iconstack class="my-3">
          <b-icon-circle scale="2.7" variant="light"/>
          <b-icon-printer-fill scale="1.5" variant="light" />
        </b-iconstack>
      </template>
      <p class="h5 text-center mt-3 mb-4 font-weight-500 text-dark">Estás a punto de reimprimir los vales.</p>
      <p class="h6 text-center mt-2 mb-3 font-weight-500 text-dark">¿Deseás continuar?</p>
      <hr/>
      <div class="row no-gutters justify-content-center">
        <b-button variant="success" @click="imprimirValesSeleccionados">Aceptar</b-button>
        <b-button variant="danger" class="mx-2" @click="$bvModal.hide('modalReimpresionMasiva')">Cancelar</b-button>
      </div>
    </b-modal>

    <!-- Modal de confirmación para marcación como consumido masivamente -->
    <b-modal id="modalUtilizacionMasiva" header-class="justify-content-center" header-bg-variant="success" title-class="text-light text-center" hide-footer centered>
      <template #modal-header>
        <b-iconstack class="my-3">
          <b-icon-circle scale="2.7" variant="light"/>
          <b-icon-exclamation scale="1.9" variant="light" />
        </b-iconstack>
      </template>
      <p class="h5 text-center mt-3 my-4 text-dark font-weight-500">¿Estás seguro/a de que querés marcar los vales seleccionados como utilizados?</p>
      <hr class="row col-9 mx-auto justify-content-center"/>
      <div class="row no-gutters justify-content-center">
        <b-button variant="success" @click="marcarValesSeleccionados">Aceptar</b-button>
        <b-button variant="danger" class="mx-2" @click="$bvModal.hide('modalUtilizacionMasiva')">Cancelar</b-button>
      </div>
    </b-modal>

    <!-- Modal de confirmación para marcación como consumido masivamente -->
    <b-modal id="modalEliminacionMasiva" header-class="justify-content-center" header-bg-variant="danger" title-class="text-light text-center" hide-footer centered>
      <template #modal-header>
        <b-iconstack class="my-3">
          <b-icon-circle scale="2.7" variant="light"/>
          <b-icon-exclamation scale="1.9" variant="light" />
        </b-iconstack>
      </template>
      <p class="h5 text-center mt-3 my-4 text-dark font-weight-500">¿Estás seguro/a de que querés eliminar los vales seleccionados?</p>
      <hr class="row col-9 mx-auto justify-content-center"/>
      <div class="row no-gutters justify-content-center">
        <b-button variant="success" :disabled="eliminandoVales" @click="eliminarValesSeleccionados">
          <b-spinner v-if="eliminandoVales" small class="mr-2"></b-spinner>
          {{ eliminandoVales ? 'Eliminando...' : 'Aceptar' }}
        </b-button>
        <b-button variant="danger" class="mx-2" :disabled="eliminandoVales" @click="$bvModal.hide('modalEliminacionMasiva')">Cancelar</b-button>
      </div>
    </b-modal>


      <!-- Modal de Confirmación para Eliminación -->
      <b-modal id="modalEliminadoMasivo" title="Confirmar Eliminación" title-class="text-light text-center" header-bg-variant="danger" hide-footer centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-iconstack>
            <b-icon-circle scale="3" variant="light"/>
            <b-icon-trash-fill scale="2" variant="light"/>
          </b-iconstack>
        </div>
      </template>
      <div class="mt-4 mb-5">
        <h4 class="text-center font-weight-500 text-dark">Los vales de combustible se han eliminado.</h4>
      </div>
      <div class="d-flex justify-content-center">
        <button class="btn btn-success mr-2" @click="cerrarModalEliminacionMasiva">Aceptar</button>
      </div>
    </b-modal>

    <!-- Modal de Confirmación para Eliminación -->
    <b-modal v-model="modalEliminacion" header-class="justify-content-center" title-class="text-light text-center" header-bg-variant="danger" hide-footer centered>
      <template #modal-header>
        <b-iconstack class="my-3">
          <b-icon-circle scale="2.7" variant="light"/>
          <b-icon-trash-fill scale="1.5" variant="light" />
        </b-iconstack>
      </template>
      <p class="h5 text-center mt-3 mb-4 font-weight-500 text-dark">Estás a punto de eliminar el vale.</p>
      <p class="h6 text-center mt-2 mb-3 font-weight-500 text-dark">¿Deseás continuar?</p>
      <hr class="row col-9 mx-auto"/>
      <div class="row no-gutters justify-content-center">
        <button class="btn btn-success mx-2" :disabled="eliminandoVale" @click="eliminarVale()">
          <b-spinner v-if="eliminandoVale" small class="mr-2"></b-spinner>
          {{ eliminandoVale ? 'Eliminando...' : 'Aceptar' }}
        </button>
        <button class="btn btn-danger mx-2" :disabled="eliminandoVale" @click="modalEliminacion = false">Cancelar</button>
      </div>
    </b-modal>

    <!-- Modal de Confirmación para Eliminación -->
    <b-modal v-model="modalEliminado" title="Confirmar Eliminación" title-class="text-light text-center" header-bg-variant="danger" hide-footer centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-iconstack>
            <b-icon-circle scale="3" variant="light"/>
            <b-icon-trash-fill scale="2" variant="light"/>
          </b-iconstack>
        </div>
      </template>
      <div class="mt-4 mb-5">
        <h4 class="text-center font-weight-500 text-dark">El vale de combustible se ha eliminado.</h4>
      </div>
      <div class="d-flex justify-content-center">
        <button class="btn btn-success mr-2" @click="cerrarModalEliminacion">Aceptar</button>
      </div>
    </b-modal>

    <!-- Modal de Confirmación para Eliminación -->
    <b-modal id="modalUtilizacionSuccess" v-model="modalModificado" header-class="justify-content-center" header-bg-variant="success" hide-footer centered>
      <template #modal-header>
        <b-iconstack class="my-3">
          <b-icon-circle scale="2.7" variant="light"/>
          <b-icon-check scale="2" variant="light"/>
        </b-iconstack>
      </template>
      <p class="h5 mt-3 text-center font-weight-500">Vale de combustible modificado.</p>
      <div class="d-flex justify-content-end">
        <button class="btn btn-primary mx-auto mr-2" @click="cerrarModalModificacion ">Aceptar</button>
      </div>
    </b-modal>

  </div>
</template>

<script>
import templateVale from "@/assets/TemplateValex2.png";
import { numeroATexto } from "@/utils/numeroATexto";
import jsPDF from "jspdf";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
export default {
  data() {
    return {
      loading: false,
      currentPage: 1,
      itemsPerPage: 100,
      modalEliminacion: false,
      modalEliminado: false,
      modalModificado: false,
      valeSeleccionado: null,
      valesSeleccionados: [], // Para almacenar los vales elegidos
      indexSeleccionado: null,
      showObservaciones: false,
      observaciones: '',
      tempNroVale: null,
      tempValeRef: null,
      eliminandoVale: false, // Control para deshabilitar botón de eliminar vale individual
      eliminandoVales: false, // Control para deshabilitar botón de eliminar vales seleccionados
      filtroTipoCombustible: null, // Filtro por tipo de combustible
      ocultarAnulados: false, // Control para ocultar/mostrar vales anulados
      vistaVales: 'grid', // 'grid' o 'list' - Vista actual de los vales
    }
  },
  computed: {
    orden(){
      return this.$store.state.combustible.single
    },
    // Saldo por tipo = monto del tipo − suma de vales no anulados de ese tipo
    saldosCalculados() {
      if (!this.orden || !this.orden.montos) return [];
      const vales = this.vales || [];
      const noAnulados = vales.filter(v => !v.anulado);
      return this.orden.montos.map((m) => {
        const emitido = noAnulados
          .filter(v => v.tipoCombustible === m.tipoCombustible)
          .reduce((sum, v) => sum + (Number(v.monto) || 0), 0);
        const saldo = (Number(m.monto) || 0) - emitido;
        return { tipoCombustible: m.tipoCombustible, saldo };
      });
    },
    totalMonto() {
      if (!this.orden || !this.orden.montos) return 0;
      return this.orden.montos.reduce((total, m) => total + (Number(m.monto) || 0), 0);
    },
    totalSaldo() {
      return this.saldosCalculados.reduce((total, s) => total + (Number(s.saldo) || 0), 0);
    },
    adminCompras(){
      return this.$store.state.user.admin == "compras" || this.$store.state.user.admin == "master"
    },
    jefeCompras(){
      return (this.$store.state.user.admin == "compras" && this.$store.state.user.username == "martinjordan@gesell.gob.ar") || this.$store.state.user.admin == "master"
    },
    vales(){
      return this.$store.state.combustible.vales_creados
    },
    selectedVales() {
      if (!this.vales || !Array.isArray(this.vales)) {
        return [];
      }
      return this.vales.filter(v => this.valesSeleccionados.includes(v.id));
    },
    paginatedVales() {
      if (!this.vales || !Array.isArray(this.vales)) {
        return [];
      }

      // Filtrar por tipo de combustible si está seleccionado
      let valesFiltrados = this.vales;
      if (this.filtroTipoCombustible) {
        valesFiltrados = this.vales.filter(vale =>
          vale.tipoCombustible === this.filtroTipoCombustible
        );
      }

      // Filtrar anulados si está activo el filtro
      if (this.ocultarAnulados) {
        valesFiltrados = valesFiltrados.filter(vale => !vale.anulado);
      }

      const start = (this.currentPage - 1) * this.itemsPerPage;
      return valesFiltrados.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      if (!this.vales || !Array.isArray(this.vales)) {
        return 0;
      }

      // Usar vales filtrados para calcular total de páginas
      let valesFiltrados = this.vales;
      if (this.filtroTipoCombustible) {
        valesFiltrados = this.vales.filter(vale =>
          vale.tipoCombustible === this.filtroTipoCombustible
        );
      }

      // Filtrar anulados si está activo el filtro
      if (this.ocultarAnulados) {
        valesFiltrados = valesFiltrados.filter(vale => !vale.anulado);
      }

      return Math.ceil(valesFiltrados.length / this.itemsPerPage);
    },
    todosValesPaginaSeleccionados() {
      if (!this.paginatedVales || !Array.isArray(this.paginatedVales)) {
        return false;
      }
      
      // Obtener solo los vales disponibles de la página actual (no consumidos y no anulados)
      const valesDisponiblesPagina = this.paginatedVales.filter(
        vale => !vale.consumido && !vale.anulado
      );
      
      // Si no hay vales disponibles, retornar false
      if (valesDisponiblesPagina.length === 0) {
        return false;
      }
      
      // Verificar si todos los vales disponibles están seleccionados
      return valesDisponiblesPagina.every(vale => 
        this.valesSeleccionados.includes(vale.id)
      );
    },
  },
  watch: {
    // Limpiar vales seleccionados que ya no están disponibles (consumidos o anulados)
    vales: {
      handler(newVales) {
        if (!newVales || !Array.isArray(newVales)) return;
        
        // Filtrar los vales seleccionados para mantener solo los que están disponibles
        this.valesSeleccionados = this.valesSeleccionados.filter(valeId => {
          const vale = newVales.find(v => v.id === valeId || v._id === valeId);
          return vale && !vale.consumido && !vale.anulado;
        });
      },
      deep: true
    }
  },
  async fetch() {
    const ordenId = this.$route.params.id
    await this.$store.dispatch('combustible/getSingle',{
      id: ordenId,
    })

    await this.$store.dispatch('combustible/getValesSingle', {
      id: ordenId,
    })
  },
  methods: {
    getSaldoPorTipo(tipoCombustible) {
      const item = this.saldosCalculados.find(s => s.tipoCombustible === tipoCombustible);
      return item ? Number(item.saldo) || 0 : 0;
    },
    getProgreso(saldo, monto) {
      const porcentaje = (saldo / monto) * 100; // Obtiene el porcentaje restante
      const circunferencia = 2 * Math.PI * 40; // Longitud total del círculo (basado en el radio de 40)
      return `${(porcentaje / 100) * circunferencia}, ${circunferencia}`;
    },
    async registrarActividad(evento, result, nroSolicitud){
      const userId = this.$store.state.user.username; // Reemplaza con el ID del usuario real
      const actionType = evento;
      const actionResult = "Trámite nro " + nroSolicitud + ' ' + result;

      try {
          await this.$logUserActivity(userId, actionType, actionResult);
      } catch (error) {
          console.error('Error al registrar la actividad:', error);
      }
    },
    onShowObservaciones(){
      if(this.orden.observaciones){
        this.observaciones = this.orden.observaciones.split('**').join('<br>').split(',').join('')
      }else{
        this.observaciones = "No hay observaciones para mostrar."
      }
      this.showObservaciones = true
    },
    async onShowGenerarVales(){
      await this.$router.push('/generar')
    },
    confirmarReimpresion(vale, index) {
      this.valeSeleccionado = vale;
      this.indexSeleccionado = index
      this.$bvModal.show('modalReimpresion')
    },
    confirmarEliminacion(id) {
      this.valeSeleccionado = id;
      this.eliminandoVale = false; // Resetear estado al abrir modal
      this.modalEliminacion = true;
    },
    async reimprimirVale(vale) {
      this.loading = true
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const backgroundImage = new Image();
      backgroundImage.src = templateVale;
      backgroundImage.crossOrigin = "anonymous";

      await new Promise((resolve) => {
        backgroundImage.onload = resolve;
      });

      canvas.width = backgroundImage.width;
      canvas.height = backgroundImage.height;

      // 🔹 Fondo blanco sólido
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 🔹 Dibujar imagen de fondo
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

      // Convertir monto a texto
      const montoTexto = `Pesos ${numeroATexto(vale.monto)}`;

      // 🔹 Agregar texto
      ctx.fillStyle = "black";
      ctx.font = "500 40px sans-serif";
      //Original
      ctx.fillText(`${this.orden.nroOrden}`, 600, 368);
      ctx.fillText(`${this.orden.proveedor}`, 600, 310);
      ctx.fillText(`${vale.nro_vale.toString().padStart(3, '0')}`, 1600, 266);
      ctx.fillText(`${vale.area}`, 1400, 365);
      ctx.fillText(`${vale.tipoCombustible}`, 600, 420);
      // ctx.fillText(`${vale.fechaEmision.toLocaleDateString('es-AR')}`, 1400, 420);
      ctx.fillText(`$${vale.monto}`, 600, 472);
      // Cambiar el tamaño de la fuente solo para el monto
      ctx.font = "500 30px sans-serif";  // Fuente más pequeña
      ctx.fillText(montoTexto, 1100, 472);
      ctx.fillText(`${vale.dominio}`, 1400, 623);


      //Volver a la fuente original para los demás campos
      ctx.font = "500 40px sans-serif";

      //Duplicado
      ctx.fillText(`${this.orden.nroOrden}`, 2348, 368);
      ctx.fillText(`${this.orden.proveedor}`, 2348, 310);
      ctx.fillText(`${vale.nro_vale.toString().padStart(3, '0')}`, 3348, 266);
      ctx.fillText(`${vale.area}`, 3148, 365);
      ctx.fillText(`${vale.tipoCombustible}`, 2348, 420);
      // ctx.fillText(`${vale.fechaEmision.toLocaleDateString('es-AR')}`, 3148, 420);
      ctx.fillText(`$${vale.monto}`, 2348, 472);
      // Cambiar el tamaño de la fuente solo para el monto en el duplicado
      ctx.font = "500 30px sans-serif";  // Fuente más pequeña
      ctx.fillText(montoTexto, 2848, 472);
      ctx.fillText(`${vale.dominio}`, 3148, 623);


      // 🔹 Convertir a imagen y descargar
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `Vale_${this.orden.nroOrden}_N${this.indexSeleccionado +1}.png`;
      link.click();
      await this.wait(400)
      this.loading = false
      this.$bvModal.hide('modalReimpresion')
    },
    async imprimirValesSeleccionados() {
      if (this.valesSeleccionados.length === 0) return;

      const jsPDF = (await import('jspdf')).default;
      const templateVale = require('@/assets/TemplateValex2.png');
      const { numeroATexto } = require('@/utils/numeroATexto');

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const backgroundImage = new Image();
      backgroundImage.src = templateVale;
      backgroundImage.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        backgroundImage.onload = resolve;
        backgroundImage.onerror = reject;
      });

      const fondoWidth = backgroundImage.width;
      const fondoHeight = backgroundImage.height;

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const scaleFactor = (pageWidth) / fondoWidth;
      const fondoWidthScaled = fondoWidth * scaleFactor;
      const fondoHeightScaled = fondoHeight * scaleFactor;

      // Obtener los objetos de los vales seleccionados
      const valesSeleccionadosObjs = this.vales.filter(v => this.valesSeleccionados.includes(v.id));

      for (let i = 0; i < valesSeleccionadosObjs.length; i += 4) {
        if (i !== 0) pdf.addPage();

        canvas.width = fondoWidth;
        canvas.height = fondoHeight * 2; // Duplicamos la altura para dos filas

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Fila 1 (vales i y i+1)
        ctx.drawImage(backgroundImage, 0, 0, fondoWidth, fondoHeight);
        const vale1 = valesSeleccionadosObjs[i];
        if (vale1) this.dibujarValeEnMitad(ctx, vale1, "izquierda", 0);
        const vale2 = valesSeleccionadosObjs[i + 1];
        if (vale2) this.dibujarValeEnMitad(ctx, vale2, "derecha", 0);

        // Fila 2 (vales i+2 y i+3)
        ctx.drawImage(backgroundImage, 0, fondoHeight, fondoWidth, fondoHeight);
        const vale3 = valesSeleccionadosObjs[i + 2];
        if (vale3) this.dibujarValeEnMitad(ctx, vale3, "izquierda", fondoHeight);
        const vale4 = valesSeleccionadosObjs[i + 3];
        if (vale4) this.dibujarValeEnMitad(ctx, vale4, "derecha", fondoHeight);

        const imgData = canvas.toDataURL("image/jpeg", 0.7);
        pdf.addImage(imgData, "JPEG", 0, 0, fondoWidthScaled, fondoHeightScaled * 2);
      }

      pdf.save(`Vales_${this.orden.nroOrden}.pdf`);
      this.$bvModal.hide('modalReimpresionMasiva')
    },
    dibujarValeEnMitad(ctx, vale, lado, offsetY = 0) {
      const offsetX = lado === "izquierda" ? 0 : 1748; // ⚠️ Asegurate que 1748 sea la mitad exacta de tu imagen
      const pos = (x, y) => [offsetX + x, offsetY + y];

      // Fondo blanco (opcional, si ya lo hiciste antes)
      // ctx.fillStyle = "white";
      // ctx.fillRect(offsetX, offsetY, 1748, altoDelVale);

      const montoTexto = `Pesos ${numeroATexto(vale.monto)}`;

      ctx.fillStyle = "black";
      ctx.font = "500 38px sans-serif";

      console.log(vale)
      // Ejemplo de coordenadas, ajustalas si hace falta
      ctx.fillText(`${this.orden.proveedor}`, ...pos(600, 310));
      ctx.fillText(`${this.orden.nroOrden}`, ...pos(600, 367));
      ctx.fillText(`${vale.nro_vale.toString().padStart(3, '0')}`, ...pos(1600, 266));
      ctx.fillText(`${vale.area}`, ...pos(1340, 365));
      ctx.fillText(`${vale.tipoCombustible}`, ...pos(600, 420));
      ctx.fillText(`${this.format(vale.monto)}`, ...pos(600, 471));

      ctx.font = "500 30px sans-serif";
      ctx.fillText(montoTexto, ...pos(1100, 471));
      ctx.fillText(`${vale.dominio}`, ...pos(1400, 623));

      ctx.font = "500 38px sans-serif"; // volver al tamaño original si seguís con más texto
    },
    async eliminarVale() {
      if (!this.valeSeleccionado || this.eliminandoVale) return;

      const id = this.valeSeleccionado;
      this.eliminandoVale = true;
      
      try {
        const userToken = this.$store.state.user.token;

        // Hacer la petición al backend para eliminar el vale
        await this.$store.dispatch("combustible/anularVale", { id, userToken });

        // Remover el vale de los seleccionados si estaba seleccionado
        this.valesSeleccionados = this.valesSeleccionados.filter(valeId => valeId !== id);

        this.modalEliminacion = false;
        this.modalEliminado = true;
      } catch (error) {
        console.error("Error al eliminar el vale:", error);
        alert("Ocurrió un error al eliminar el vale. Revisa la consola para más detalles.");
      } finally {
        this.eliminandoVale = false;
      }
    },
    async eliminarValesSeleccionados(){
      if (this.valesSeleccionados.length === 0 || this.eliminandoVales) return;

      this.eliminandoVales = true; // Deshabilitar botón

      const valesAEliminar = [...this.valesSeleccionados]; // Copiar el array antes de limpiarlo
      let errores = 0;

      try {
        for (let i = 0; i < valesAEliminar.length; i++) {
          try {
            const id = valesAEliminar[i];
            const userToken = this.$store.state.user.token;

            // Hacer la petición al backend para eliminar el vale
            await this.$store.dispatch("combustible/anularVale", { id, userToken })
          } catch(e) {
            console.error(`Error al eliminar vale ${valesAEliminar[i]}:`, e);
            errores++;
          }
        }

        // Limpiar la selección después de eliminar
        this.valesSeleccionados = [];

        if (errores > 0) {
          alert(`No se pudieron eliminar ${errores} vale(s). Hubo un problema con alguno(s) de ellos.`);
        }

        this.$bvModal.hide('modalEliminacionMasiva')
        this.$bvModal.show('modalEliminadoMasivo')
      } catch (error) {
        console.error("Error general en eliminación masiva:", error);
        alert("Ocurrió un error al eliminar los vales. Revisa la consola para más detalles.");
      } finally {
        // Resetear estado del botón siempre, incluso si hay errores
        this.eliminandoVales = false;
      }
    },
    confirmarMarcarUtilizado(valeRef, index) {
      this.tempValeRef = valeRef
      this.tempNroVale = index
      this.$bvModal.show('modalUtilizacion')
    },
    cerrarModalModificacion(){
      this.$bvModal.hide('modalUtilizacionSuccess')
      location.reload()
    },
    cerrarModalEliminacion(){
      this.modalEliminado = false
      location.reload()
    },
    cerrarModalEliminacionMasiva(){
      this.$bvModal.hide('modalEliminadoMasivo')
      location.reload()
    },
    async marcarUtilizado(){
      const id = this.tempValeRef.id;
        try {
          const userToken = this.$store.state.user.token;

          const vale = {
            consumido: true,
          }

          // Hacer la petición al backend para eliminar el vale
          await this.$store.dispatch("combustible/consumirVale", { id, vale });

          // Registrar actividad de uso de vale
          await this.$logUserActivity(
            this.$store.state.user.username,
            'Marcar Vale como Utilizado',
            `Vale ${this.tempValeRef.nro_vale} marcado como utilizado`
          );

          // Eliminar el vale de la lista en el frontend
          this.vales = this.vales.filter(v => v._id !== this.valeSeleccionado);

          // Remover el vale de los seleccionados si estaba seleccionado
          this.valesSeleccionados = this.valesSeleccionados.filter(valeId => valeId !== id);

          this.$bvModal.hide('modalUtilizacion')
          this.modalModificado = true;
        } catch (error) {
          console.error("Error al eliminar el vale:", error);
          alert("Ocurrió un error al eliminar el vale. Revisa la consola para más detalles.");
        }
    },
    async marcarValesSeleccionados() {
      if (this.valesSeleccionados.length === 0) return;

      const valesAMarcar = [...this.valesSeleccionados]; // Copiar el array antes de limpiarlo

      for (let i = 0; i < valesAMarcar.length; i++) {
        try {
          const id = valesAMarcar[i];
          const userToken = this.$store.state.user.token;

          const vale = {
            consumido: true,
          }
          // Hacer la petición al backend para eliminar el vale
          await this.$store.dispatch("combustible/consumirVale", { id, vale })
        }catch (error) {
        console.error("Error al eliminar el vale:", error);
        alert("Ocurrió un error al eliminar el vale. Revisa la consola para más detalles.");
        }
      }

      // Registrar actividad de uso masivo de vales
      await this.$logUserActivity(
        this.$store.state.user.username,
        'Marcar Vales como Utilizados',
        `${valesAMarcar.length} vales marcados como utilizados`
      );
      
      // Limpiar la selección después de marcar como utilizados
      this.valesSeleccionados = [];
      
      await this.wait(500)
      this.$bvModal.hide('modalUtilizacionMasiva')
      location.reload()
    },
    getStatusClass(status) {
      return this.statusClasses[status] || '';
    },
    abrirModalReimpresion() {
      this.$bvModal.show('modalReimpresionMasiva');
    },
    abrirModalUtilizarVales() {
      this.$bvModal.show('modalUtilizacionMasiva');
    },
    abrirModalEliminacionMasiva() {
      this.eliminandoVales = false; // Resetear estado al abrir modal
      this.$bvModal.show('modalEliminacionMasiva');
    },
    //Métodos de sistema
    async volver(){
      await this.$router.push('/compras/combustible')
      this.valeSeleccionado = null,
      this.indexSeleccionado = null
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    onResetEdit() {
      this.editing = false
    },
    // format(value) {
    //   return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value);
    // },
    getPercentage(saldo, monto) {
      return monto ? (saldo / monto) * 100 : 0;
    },
    format(value) {
      if (!value) return "$0";
      return `$${value.toLocaleString('es-AR')}`;
    },
    getPageRange() {
      if (!this.vales || !Array.isArray(this.vales)) {
        return { start: 0, end: 0 };
      }

      // Usar vales filtrados para calcular el rango
      let valesFiltrados = this.vales;
      if (this.filtroTipoCombustible) {
        valesFiltrados = this.vales.filter(vale =>
          vale.tipoCombustible === this.filtroTipoCombustible
        );
      }

      // Filtrar anulados si está activo el filtro
      if (this.ocultarAnulados) {
        valesFiltrados = valesFiltrados.filter(vale => !vale.anulado);
      }

      const start = (this.currentPage - 1) * this.itemsPerPage + 1;
      const end = Math.min(this.currentPage * this.itemsPerPage, valesFiltrados.length);
      return { start, end };
    },

    getTotalValesFiltrados() {
      if (!this.vales || !Array.isArray(this.vales)) {
        return 0;
      }

      let valesFiltrados = this.vales;

      if (this.filtroTipoCombustible) {
        valesFiltrados = this.vales.filter(vale =>
          vale.tipoCombustible === this.filtroTipoCombustible
        );
      }

      // Filtrar anulados si está activo el filtro
      if (this.ocultarAnulados) {
        valesFiltrados = valesFiltrados.filter(vale => !vale.anulado);
      }

      return valesFiltrados.length;
    },

    filtrarPorTipoCombustible(tipoCombustible) {
      // Si ya está seleccionado el mismo tipo, desactivar el filtro
      if (this.filtroTipoCombustible === tipoCombustible) {
        this.filtroTipoCombustible = null;
      } else {
        // Si es un tipo diferente, aplicar el filtro
        this.filtroTipoCombustible = tipoCombustible;
      }
      this.currentPage = 1; // Resetear a la primera página
    },

    limpiarFiltroCombustible() {
      this.filtroTipoCombustible = null;
      this.currentPage = 1; // Resetear a la primera página
    },

    toggleOcultarAnulados() {
      this.ocultarAnulados = !this.ocultarAnulados;
      this.currentPage = 1; // Resetear a la primera página
    },

    deseleccionarTodos() {
      this.valesSeleccionados = [];
    },

    toggleSeleccionarTodosPagina() {
      if (!this.paginatedVales || !Array.isArray(this.paginatedVales)) {
        return;
      }

      // Obtener solo los vales disponibles de la página actual (no consumidos y no anulados)
      const valesDisponiblesPagina = this.paginatedVales.filter(
        vale => !vale.consumido && !vale.anulado
      );

      // Obtener los IDs de los vales disponibles de la página
      const idsValesPagina = valesDisponiblesPagina.map(vale => vale.id);

      // Verificar si todos ya están seleccionados
      const todosSeleccionados = idsValesPagina.every(id => 
        this.valesSeleccionados.includes(id)
      );

      if (todosSeleccionados) {
        // Si todos están seleccionados, deseleccionar solo los de esta página
        this.valesSeleccionados = this.valesSeleccionados.filter(
          id => !idsValesPagina.includes(id)
        );
      } else {
        // Si no todos están seleccionados, agregar todos los de esta página
        // Combinar los seleccionados actuales con los de la página (sin duplicados)
        const nuevosSeleccionados = [...this.valesSeleccionados];
        idsValesPagina.forEach(id => {
          if (!nuevosSeleccionados.includes(id)) {
            nuevosSeleccionados.push(id);
          }
        });
        this.valesSeleccionados = nuevosSeleccionados;
      }
    },

    cambiarVistaVales(vista) {
      this.vistaVales = vista;
    },

    async exportarValesAExcel() {
      try {
        if (!this.vales || !Array.isArray(this.vales) || this.vales.length === 0) {
          this.$bvToast.toast('No hay vales para exportar', {
            title: 'Información',
            variant: 'info',
            solid: true
          });
          return;
        }

        // Mapeamos los datos necesarios para el Excel
        const datosExcel = this.vales.map(vale => ({
          'Número de orden': this.orden.nroOrden || '',
          'Número de vale': vale.nro_vale || '',
          'Tipo de combustible': vale.tipoCombustible || '',
          'Monto': vale.monto || 0,
          'Patente': vale.dominio ? vale.dominio.toUpperCase() : 'Sin patente',
          'Fecha de emisión': vale.fechaEmision ? new Date(vale.fechaEmision).toLocaleDateString('es-AR') : '',
          'Estado': vale.anulado ? 'Anulado' : (vale.consumido ? 'No disponible' : 'Disponible')
        }));

        // Convertimos los datos a una hoja de Excel
        const hojaVales = XLSX.utils.json_to_sheet(datosExcel);

        // Ajustamos el ancho de las columnas
        const columnas = Object.keys(datosExcel[0]);
        const anchos = columnas.map(col => ({ wch: Math.max(col.length, 15) }));
        hojaVales['!cols'] = anchos;

        // Creamos un libro de Excel y agregamos la hoja
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, hojaVales, 'Vales');

        // Convertimos el libro a un buffer
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        // Creamos un Blob para descargar
        const blob = new Blob([excelBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        // Usamos FileSaver.js para guardar el archivo
        const fecha = new Date().toISOString().split('T')[0];
        const nombreArchivo = `Vales_Orden_${this.orden.nroOrden}_${fecha}.xlsx`;
        saveAs(blob, nombreArchivo);

        this.$bvToast.toast('Archivo Excel generado exitosamente', {
          title: 'Éxito',
          variant: 'success',
          solid: true
        });
      } catch (error) {
        console.error('Error al generar el Excel:', error);
        this.$bvToast.toast('Error al generar el archivo Excel', {
          title: 'Error',
          variant: 'danger',
          solid: true
        });
      }
    },
  },
}
</script>


<style scoped>
.fuel-icon {
  position: absolute;
  top: 50%;
  left: 51%;
  transform: translate(-50%, -50%);
}
/* Contenedor de la barra semicircular */
.circular-progress-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
}

.small{
  font-size: 16px;
}

.checkbox-container {
  align-self: start;
}


.text-gray{
  color:#505050;
}

.border-card{
  border: #000 1px solid;
}

.big-container{
  padding: 2rem 3rem;
}

@media (max-width: 1200px) {
.separador{
    display: none;
  }
}
.separador{
  color:rgba(0, 0, 0, 0.5);
  font-size: 35px;
  opacity:0.3;
}
/* Estilo del SVG */
.circular-progress {
  width: 140px; /* Aumento del tamaño del SVG */
  height: 140px; /* Aumento del tamaño del SVG */
  transform: rotate(-270deg); /* Giramos el círculo para que empiece desde la parte superior */
}

/* Fondo gris del círculo */
.progress-background {
  fill: none;
  stroke: #e9e9e9;
  stroke-linecap: round;
  stroke-width: 10;
}

/* Barra de progreso */
.progress-bar {
  fill: none;
  stroke: #e59335;
  stroke-linecap: butt;
  stroke-dasharray: 314.16, 314.16; /* Longitud total del círculo (basado en el radio de 50) */
  transition: stroke-dasharray 1.5s ease-in-out;
  stroke-width: 10;
}
.fuel-layout {
  display: flex;
  flex-wrap: wrap; /* Permitir que se acomoden en filas */
}
/* PRUEBA CLASES CARD HORIZONTAL */
.fuel-container-h {
  display: flex;
  align-items: center;  /* Alinear los elementos verticalmente */
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  min-width: 400px;  /* Ajusta el tamaño de la tarjeta */
  min-height: 150px; /* Ajusta la altura para que todas sean iguales */
  border: 1px solid #333;
  padding: 2rem 1rem;
  margin: auto;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.fuel-container-h:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.fuel-container-selected {
  background: #e3f2fd !important;
  border-color: #2196f3 !important;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3) !important;
  transform: translateY(-2px);
}

.fuel-container-selected .fuel-title-h p {
  color: #1976d2;
  font-weight: bold;
}

.fuel-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 120px;
  height: 120px;
  background: #f9f9f9;
  border-radius: 8px;
}

.fuel-icon-h {
  width: 80px;
  height: 80px;
}

.fuel-info-h {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8%;  /* Espacio entre el icono y el texto */
  flex: 1; /* Para que se expanda y ocupe el espacio disponible */
}

.fuel-saldos-h {
  font-size: 15px;
  color: #333;
  margin-top: 8px;
}
.fuel-title-h {
  padding-bottom:1rem;
  border-bottom: 1px solid #999;
  white-space: nowrap;
  margin: 0;
}
.fuel-title-h p{
  font-size: 24px;
  color: #333;
  font-weight: bold;
  text-transform: uppercase;
  margin: 0;
}
.fuel-saldos-h p {
  margin: 2px 0;
  font-weight: 501;
}
.fuel-saldos-h p:first-child {
  color: #666;
}

/* Clases para stroke (bordes) */
.stroke-color-0 { stroke: blue; }
.stroke-color-1 { stroke: orange; }
.stroke-color-2 { stroke: red; }
.stroke-color-3 { stroke: green; }
.stroke-color-4 { stroke: cadetblue; }
.stroke-color-5 { stroke: darkmagenta; }
.stroke-color-6 { stroke: gold; }
.stroke-color-7 { stroke: lightcoral; }
/* Clases para fill (relleno) */
.fill-color-0 { fill: blue; }
.fill-color-1 { fill: orange; }
.fill-color-2 { fill: red; }
.fill-color-3 { fill: green; }
.fill-color-4 { fill: cadetblue; }
.fill-color-5 { fill: darkmagenta; }
.fill-color-6 { fill: gold; }
.fill-color-7 { fill: lightcoral; }
/* Clases para texto (color) */
.text-color-0 { color: blue !important; }
.text-color-1 { color: orange !important;; }
.text-color-2 { color: red !important;; }
.text-color-3 { color: green !important;; }
.text-color-4 { color: cadetblue !important;; }
.text-color-5 { color: darkmagenta !important;; }
.text-color-6 { color: gold !important;; }
.text-color-7 { color: lightcoral !important;; }


.card-title{
  font-size: 20px;
}

.card-text{
  font-size: 16px;
}

.modal-dialog {
  max-width: 80% !important;
}

/* Responsive: */

@media only screen and (min-width: 640px) {
  .layout {
    display: flex;
    max-width: 90%;
    margin: auto;
  }
}

/* etc */
.iconoAdvertencia {
  position: relative;
  display: inline-block;
}

/* Estilo del texto de advertencia */
.textoHover {
  position: absolute;
  top: -60px; /* Ajusta la posición vertical del texto */
  left: 20px; /* Ajusta la posición horizontal del texto */
  background-color: #fff;
  color: #000;
  padding: 5px;
  width: 450px;
  border-radius: 5px;
  z-index: 1; /* Asegura que esté encima del ícono */
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3); /* Agrega una sombra */
}

.col {
  padding: 0.4em;
  margin: 0 2px 2px 40px;
}

p{
  font-size: 18px;
}

/* Estilos para vista lista de vales */
.vales-list-table {
  margin-bottom: 0;
  background-color: #fff;
}

.vales-list-table thead th {
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
  font-size: 14px;
  padding: 12px 8px;
  color: #505050;
  text-align: left;
}

.vales-list-table tbody tr {
  transition: background-color 0.2s ease;
}

/* Filas alternadas: blanco y gris */
.vales-list-table tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

.vales-list-table tbody tr:nth-child(odd) {
  background-color: #fff;
}

.vales-list-table tbody tr:hover {
  background-color: #e9ecef !important;
}

.vales-list-table tbody tr.vale-disabled {
  opacity: 0.6;
}

.vales-list-table tbody tr.vale-disabled:nth-child(even) {
  background-color: #f0f0f0;
}

.vales-list-table tbody tr.vale-disabled:nth-child(odd) {
  background-color: #f8f8f8;
}

.vales-list-table tbody tr.vale-disabled:hover {
  background-color: #e0e0e0 !important;
}

.vales-list-table tbody td {
  padding: 12px 8px;
  vertical-align: middle;
  font-size: 14px;
  border-bottom: 1px solid #dee2e6;
}

.vale-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.vale-row {
  cursor: default;
}

/* Responsive para vista lista */
@media (max-width: 768px) {
  .vales-list-table {
    font-size: 12px;
  }
  
  .vales-list-table thead th,
  .vales-list-table tbody td {
    padding: 8px 4px;
    font-size: 12px;
  }
  
  .vales-list-table thead th:nth-child(3),
  .vales-list-table tbody td:nth-child(3),
  .vales-list-table thead th:nth-child(4),
  .vales-list-table tbody td:nth-child(4) {
    display: none;
  }
}
</style>
