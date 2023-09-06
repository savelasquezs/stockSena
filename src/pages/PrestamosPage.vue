<!-- Fecha documentacion 4/09/2023 -->
<!--Este componente Vue.js representa una página que muestra estadísticas relacionadas
   con una tabla de préstamos y permite agregar préstamos utilizando un formulario en una
    ventana emergente. Los datos de la tabla y la interacción con la tienda Vuex están 
    configurados en el script para mantener la página actualizada y receptiva.-->
<template>
  <div style="background-color: #f5f5f5">
    <div class="q-pa-md">
      <stadisticTableBar
        :stadisticTableBarInfo="prestamosStore.stadisticTableBarInfo"
      />
    </div>

    <q-dialog v-model="openedForm">
      <q-card>
        <q-card-section class="row justify-end q-pb-none">
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <prestamos-form @prestamoGuardado="openedForm = false" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <TableReuse
      :dataArray="prestamosStore.prestamosDatabase"
      :columns="prestamosStore.columns"
      title="Tabla de Prestamos"
      :internalColumns="prestamosStore.internalColumns"
      addText="Agregar Prestamo"
      @add="openedForm = true"
      tablaUrl="productos"
      buscarPorFecha
    />
  </div>
</template>
<!-- Se importa UsePrestamosStore desde src/stores/prestamosStore para utilizar una tienda Vuex llamada 
prestamosStore.-->
<!--Se importan los componentes stadisticTableBar, PrestamosForm, y TableReuse para su  
 uso en la plantilla-->
<script setup>
import { UsePrestamosStore } from "src/stores/prestamosStore";
import stadisticTableBar from "components/utils/StadisticTableBar.vue";
import PrestamosForm from "components/prestamos/PrestamosForm.vue";
import TableReuse from "components/utils/TableReuse.vue";

import { ref } from "vue";
// Se crea una variable reactiva llamada openedForm y se inicializa como false.
// Esta variable controla si se muestra o se oculta la ventana emergente con el formulario
// de préstamos.
const openedForm = ref(false);
const prestamosStore = UsePrestamosStore();
const dataTableArray = ref([]);
// Se crea una instancia de la tienda Vuex prestamosStore utilizando la función
// UsePrestamosStore.
prestamosStore.listenChanges().then(() => {
  // Se crea una variable reactiva llamada dataTableArray para almacenar los datos de la
  // tabla de préstamos. Los datos se obtienen de la tienda Vuex y se asignan a esta variable reactiva cuando se llama a prestamosStore.listenChanges().
  dataTableArray.value = prestamosStore.prestamosDatabase;
});
</script>
