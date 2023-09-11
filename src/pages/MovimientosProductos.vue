<!-- Fecha documentacion 5/09/2023 -->
<!-- Este componente Vue.js se utiliza para mostrar estadísticas
  y una tabla de movimientos, permitiendo agregar nuevos movimientos
  mediante un formulario en una ventana emergente. La interacción 
  con la tienda Vuex movimientosStore se utiliza para mantener los
  datos actualizados. -->
<template>
  <!-- Este componente StadisticTableBar se utiliza para mostrar estadísticas relacionadas
  con los movimientos. Recibe información estadística a través de la propiedad -->
  <StadisticTableBar :stadisticTableBarInfo="movimientosStore.stadistics" />
  <!--Aquí se define una ventana emergente utilizando el componente q-dialog de Quasar.
  La ventana emergente se muestra u oculta según el valor de la variable reactiva 
  formOppened. Cuando la ventana emergente está abierta, se puede agregar un nuevo
  movimiento. -->
  <q-dialog v-model="formOppened">
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="flex row justify-end q-pb-none">
        <!--Este botón se utiliza para cerrar la ventana emergente. Cuando se hace clic en él, se establece formOppened en false, lo que oculta la 
          ventana emergente. -->
        <q-btn dense round flat icon="close" v-close-popup style="width: 30px">
          <q-tooltip class="bg-white text-red">Cerrar</q-tooltip>
        </q-btn>
      </q-card-section>
      <q-card-section>
        <!-- <movimiento-form @movimientoGuardado="formOppened = false" />: 
          Aquí se utiliza el componente movimiento-form para mostrar un formulario de
          movimiento dentro de la ventana emergente. Cuando se guarda un movimiento 
          (probablemente al enviar el formulario), se emite el evento movimientoGuardado,
          y se establece formOppened en false para cerrar la ventana emergente. -->
        <movimiento-form @movimientoGuardado="formOppened = false" />
      </q-card-section>
    </q-card>
  </q-dialog>
  routes es una matriz que contiene objetos de ruta. Cada objeto representa una
  ruta en la aplicación y contiene información sobre cómo se debe manejar esa
  ruta.

  <TableReuse
    :dataArray="movimientosStore.movimientosDatabase"
    :columns="movimientosStore.columns"
    title="Tabla de movimientos"
    :internalColumns="movimientosStore.internalColumns"
    addText="Agregar Movimiento"
    @add="formOppened = true"
    buscarPorFecha
  />
</template>

<script setup>
import MovimientoForm from "components/Movimientos/MovimientoForm.vue";
import StadisticTableBar from "components/utils/StadisticTableBar.vue";
import TableReuse from "components/utils/TableReuse.vue";
import { ref } from "vue";
import { UseMovimientosStore } from "stores/movimientosStore";

// Se crea una variable reactiva llamada formOppened para controlar la apertura y cierre de la ventana emergente.
const formOppened = ref(false);
// Se crea una variable reactiva utilizada para almacenar los datos de la tabla de movimientos.
const dataTableArray = ref([]);
const movimientosStore = UseMovimientosStore();
// Se llama a movimientosStore.listenChanges() para escuchar cambios en la tienda y
// actualizar dataTableArray con los datos de la tienda.
movimientosStore.listenChanges().then(() => {
  dataTableArray.value = movimientosStore.movimientosDatabase;
});
</script>

<style lang="scss" scoped></style>
